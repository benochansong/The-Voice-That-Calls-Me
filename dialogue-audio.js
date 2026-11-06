// These local 16 kHz mono performances and their SAPI mouth/word cues were
// rendered together. The market, garden and journal call the same "보리야" asset.
function dialogueKey(text,role){
 return role+'|'+text.trim().replace(/[.!?…]+$/u,'');
}
const voiceBank=new Map(dialoguePerformances.map(take=>[dialogueKey(take.text,take.role),take]));
let currentDialogueAudio=null;

function dialogueTiming(text,role='jesus'){return voiceBank.get(dialogueKey(text,role))||null}
function dialogueDuration(text,role='jesus'){return dialogueTiming(text,role)?.duration||0}

function dialoguePlayback(){
 const active=currentDialogueAudio;
 if(!active)return null;
 const media=active.media;
 const playing=media?active.started&&!media.paused&&!media.ended:active.started;
 const elapsed=media?media.currentTime:active.started?(performance.now()-active.startTime)/1000:0;
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
 if(active.media){
  active.media.onended=active.media.onplaying=active.media.onerror=null;
  active.media.pause();
  active.media.removeAttribute('src');
  active.media.load();
 }else{
  window.speechSynthesis?.cancel();
 }
}
function setDialogueVolume(){
 const active=currentDialogueAudio;
 if(!active)return;
 if(prefs.mute||prefs.voiceVolume===0){stopDialogueVoice();return}
 if(active.media)active.media.volume=prefs.voiceVolume/100;
 else if(active.utterance.volume!==prefs.voiceVolume/100)stopDialogueVoice();
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
