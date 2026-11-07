// These local 16 kHz mono performances and their SAPI mouth/word cues were
// rendered together. The market, garden and journal call the same "보리야" asset.
function dialogueKey(text,role){
 return role+'|'+text.trim().replace(/[.!?…]+$/u,'');
}
const voiceBank=new Map(dialoguePerformances.map(take=>[dialogueKey(take.text,take.role),take]));
let currentDialogueAudio=null;
const decodedSpatialVoices=new Map();
const dialoguePosition=new THREE.Vector3();

function dialogueTiming(text,role='jesus'){return voiceBank.get(dialogueKey(text,role))||null}
function dialogueDuration(text,role='jesus'){return dialogueTiming(text,role)?.duration||0}

function dialoguePlayback(){
 const active=currentDialogueAudio;
 if(!active)return null;
 const media=active.media;
 const playing=media?active.started&&!media.paused&&!media.ended:active.started;
 const elapsed=media?media.currentTime:active.context?active.offset+(active.started?active.context.currentTime-active.startTime:0):
  active.started?(performance.now()-active.startTime)/1000:0;
 return {text:active.text,role:active.role,elapsed,duration:active.duration,playing};
}
function dialogueIsAudible(){
 const a=currentDialogueAudio;
 return Boolean(a&&a.started&&(!a.media||!a.media.paused&&!a.media.ended));
}
function stopDialogueVoice(){
 const active=currentDialogueAudio;
 currentDialogueAudio=null;
 if(!active)return;
 if(active.source){
  active.source.onended=null;active.source.stop();active.source.disconnect();
  active.pan.disconnect();active.gain.disconnect();
 }else if(active.media){
  active.media.onended=active.media.onplaying=active.media.onerror=null;
  active.media.pause();
  active.media.removeAttribute('src');
  active.media.load();
 }else if(active.utterance){
  window.speechSynthesis?.cancel();
 }
}
function setDialogueVolume(){
 const active=currentDialogueAudio;
 if(!active)return;
 if(prefs.mute||prefs.voiceVolume===0){stopDialogueVoice();return}
 if(active.gain)active.gain.gain.setTargetAtTime(prefs.voiceVolume/100,audio.currentTime,.02);
 else if(active.media)active.media.volume=prefs.voiceVolume/100;
 else if(active.utterance&&active.utterance.volume!==prefs.voiceVolume/100)stopDialogueVoice();
}
function updateSpatialDialogue(){
 const active=currentDialogueAudio;
 if(!active?.figure||!active.pan)return;
 meetingEyePoint(active.figure,dialoguePosition);
 placeSound(active.pan,dialoguePosition);
}
function decodeSpatialVoice(take){
 if(!decodedSpatialVoices.has(take.file)){
  const data=Uint8Array.from(atob(spatialVoiceFiles[take.file]),c=>c.charCodeAt(0));
  const pending=audio.decodeAudioData(data.buffer).catch(error=>{decodedSpatialVoices.delete(take.file);throw error});
  decodedSpatialVoices.set(take.file,pending);
 }
 return decodedSpatialVoices.get(take.file);
}
async function playSpatialVoice(take,text,role,offset){
 awaken();
 if(!audio||!spatialVoiceFiles[take.file]){playRecordedMedia(take,text,role,offset);return}
 const figure=!by('book').open&&speakingLine?.text===text&&speakingLine.role===role?speakingLine.figure:null;
 const active={text,role,duration:take.duration,context:audio,offset,figure,started:false};
 currentDialogueAudio=active;
 try{
  const buffer=await decodeSpatialVoice(take);
  if(currentDialogueAudio!==active)return;
  if(audio.state!=='running'||prefs.mute||!prefs.voiceVolume){currentDialogueAudio=null;return}
  updateSoundListener();
  const source=audio.createBufferSource(),gain=audio.createGain();
  const pan=figure?soundPanner(meetingEyePoint(figure,dialoguePosition),true):audio.createStereoPanner();
  source.buffer=buffer;gain.gain.value=prefs.voiceVolume/100;
  source.connect(pan).connect(gain).connect(audio.destination);
  Object.assign(active,{source,gain,pan,startTime:audio.currentTime,started:true});
  source.onended=()=>{
   source.disconnect();pan.disconnect();gain.disconnect();
   if(currentDialogueAudio===active)currentDialogueAudio=null;
  };
  source.start(0,offset);
 }catch{
  if(currentDialogueAudio===active){stopDialogueVoice();playRecordedMedia(take,text,role,offset)}
 }
}

// Only a missing recording (or a new, unrecorded line) uses system speech.
// Pick one installed Korean voice deterministically; leave captions running if unavailable.
function speakLocalFallback(text,role,duration){
 const synth=window.speechSynthesis;
 if(!synth||prefs.mute||!prefs.voiceVolume)return;
 const voices=synth.getVoices().filter(v=>v.localService&&/^ko(?:-|$)/i.test(v.lang))
  .sort((a,b)=>a.voiceURI.localeCompare(b.voiceURI,'en'));
 const selected=voices.find(v=>v.name==='Microsoft Heami Desktop - Korean')||voices[0];
 if(!selected)return;
 const utterance=new SpeechSynthesisUtterance(text);
 const delivery={jesus:[.81,.90],angel:[.98,.91],shepherd:[.88,.98],seller:[.92,1.02],
  child:[1.15,1.08],disciple:[.91,1.06],bartimaeus:[.85,1.04],zacchaeus:[.95,.97],
  peter:[.83,1.01],mary:[1.04,.95]}[role]||[1,1];
 utterance.voice=selected;utterance.lang='ko-KR';utterance.pitch=delivery[0];
 utterance.rate=delivery[1];utterance.volume=prefs.voiceVolume/100;
 const active={text,role,duration,utterance,started:false,startTime:0};
 currentDialogueAudio=active;
 utterance.onstart=()=>{active.startTime=performance.now();active.started=true};
 utterance.onend=utterance.onerror=()=>{if(currentDialogueAudio===active)currentDialogueAudio=null};
 synth.speak(utterance);
}
function playDialogueAudio(text,role='jesus',offsetSeconds=0){
 stopDialogueVoice();
 if(prefs.mute||!prefs.voiceVolume)return;
 const take=dialogueTiming(text,role);
 const offset=Math.max(0,Number(offsetSeconds)||0);
 if(!take){if(offset===0)speakLocalFallback(text,role,0);return}
 if(offset>=take.duration)return;
 playSpatialVoice(take,text,role,offset);
}
function playRecordedMedia(take,text,role,offset){
 const media=new Audio('media/voice/'+take.file);
 const active={text,role,duration:take.duration,media,started:false};
 currentDialogueAudio=active;
 media.volume=prefs.voiceVolume/100;
 if(offset>0)media.currentTime=offset;
 media.onplaying=()=>{active.started=true};
 media.onended=()=>{if(currentDialogueAudio===active)currentDialogueAudio=null};
 const failed=error=>{
  if(currentDialogueAudio!==active)return;
  stopDialogueVoice();
  // A blocked gesture or interrupted playback should never enqueue a late line.
  if(offset===0&&(!error||error.name==='NotSupportedError'))speakLocalFallback(text,role,take.duration);
 };
 media.onerror=()=>failed();
 media.play().catch(failed);
}
