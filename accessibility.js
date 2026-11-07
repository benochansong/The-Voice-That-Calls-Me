// Preferences live outside the journey slot and apply to the campaign and journal replays.
const by=id=>document.getElementById(id);
const captionSizes=[16,20,24,28];
const shakeLevels=[0,35,100];
function loadPlayerPreferences(){
 let stored={};
 try{stored=JSON.parse(localStorage.getItem('boriPrefs'))||{}}catch{}
 const defaultShake=matchMedia('(prefers-reduced-motion: reduce)').matches?0:100;
 const volume=(value,fallback=100)=>Number.isFinite(value)?Math.max(0,Math.min(100,Math.round(value))):fallback;
 return {
  mute:stored.mute===true,toggle:stored.toggle===true,
  directionCaptions:stored.directionCaptions!==false,
  captionSize:captionSizes.includes(stored.captionSize)?stored.captionSize:16,
  cameraShake:shakeLevels.includes(stored.cameraShake)?stored.cameraShake:defaultShake,
  voiceVolume:volume(stored.voiceVolume),ambientVolume:volume(stored.ambientVolume),
  musicVolume:volume(stored.musicVolume,40)
 };
}
const prefs=loadPlayerPreferences();
let audio,environmentGain,musicGain;
let scoreListening=false,lastMusicTarget=null;

function musicAudible(){return !prefs.mute&&prefs.musicVolume>0}

// Only the music bus is ducked. Navigation cues and the spoken call keep their own mix.
function updateMusicLevel(listening){
 scoreListening=listening;
 if(!musicGain)return;
 const foreground=listening||(prefs.voiceVolume>0&&dialogueIsAudible());
 const target=musicAudible()?prefs.musicVolume/100*(foreground ? .10 : 1):0;
 if(target===lastMusicTarget)return;
 const now=audio.currentTime;
 const gain=musicGain.gain;
 gain.cancelScheduledValues(now);
 if(target===0){
  gain.setValueAtTime(0,now);
 }else{
  const decreasing=lastMusicTarget!==null&&target<lastMusicTarget;
  const response=decreasing ? .011 : .24;
  gain.setTargetAtTime(target,now,response);
 }
 lastMusicTarget=target;
}
function setDirectionCue(text){
 const cue=by('directionCue');
 if(cue.textContent!==text)cue.textContent=text;
}
function applyPlayerPreferences(){
 document.documentElement.style.setProperty('--caption-size',prefs.captionSize+'px');
 by('voiceLevel').value=prefs.voiceVolume+'%';
 by('ambientLevel').value=prefs.ambientVolume+'%';
 by('musicLevel').value=prefs.musicVolume+'%';
 for(const id of ['voiceVolume','ambientVolume','musicVolume'])by(id).setAttribute('aria-valuetext',prefs[id]+'%');
 by('sampleVoice').disabled=prefs.mute||prefs.voiceVolume===0;
 by('sampleAmbient').disabled=!environmentAudible();
 if(!prefs.directionCaptions)setDirectionCue('');
 if(environmentGain)environmentGain.gain.value=prefs.mute?0:prefs.ambientVolume/100;
 setDialogueVolume();
 updateMusicLevel(scoreListening);
}
function settings(event){
 for(const key of Object.keys(prefs)){
  const control=by(key);
  prefs[key]=control.type==='checkbox'?control.checked:Number(control.value);
 }
 applyPlayerPreferences();
 if(event?.isTrusted)awaken();
 try{localStorage.setItem('boriPrefs',JSON.stringify(prefs))}catch{}
}
for(const key of Object.keys(prefs)){
 const control=by(key);
 if(control.type==='checkbox')control.checked=prefs[key];else control.value=prefs[key];
 control.addEventListener(control.type==='range'?'input':'change',settings);
}
applyPlayerPreferences();

function environmentAudible(){return !prefs.mute&&prefs.ambientVolume>0}
function awaken(){
 if(!environmentAudible()&&!musicAudible()&&(prefs.mute||!prefs.voiceVolume))return;
 try{
  if(!audio){
   audio=new AudioContext();environmentGain=audio.createGain();
   environmentGain.gain.value=prefs.ambientVolume/100;
   environmentGain.connect(audio.destination);
   musicGain=audio.createGain();
   musicGain.gain.value=0;
   musicGain.connect(audio.destination);
   updateMusicLevel(scoreListening);
  }
  if(audio.state==='suspended')audio.resume().catch(()=>{});
 }catch{}
}
by('menu').addEventListener('click',awaken);
function voice(text,role='jesus',offsetSeconds=0){playDialogueAudio(text,role,offsetSeconds)}
const cueDirections=['앞','오른쪽 앞','오른쪽','오른쪽 뒤','뒤','왼쪽 뒤','왼쪽','왼쪽 앞'];
function cueDirection(angle){return cueDirections[(Math.round(angle/(Math.PI/4))+8)%8]}

// The hint and location can wrap to several lines on a narrow display.
const hudBounds=new ResizeObserver(entries=>{
 for(const entry of entries){
  const height=entry.borderBoxSize[0].blockSize;
  document.documentElement.style.setProperty('--hud-'+entry.target.localName,Math.ceil(height)+'px');
 }
});
hudBounds.observe(document.querySelector('header'));
hudBounds.observe(document.querySelector('footer'));
// Keep each caption keyboard-scrollable when enlarged text no longer fits.
const storyCaption=by('caption');
const captionScroll=new ResizeObserver(entries=>{
 for(const {target} of entries){
  if(target.scrollHeight>target.clientHeight)target.tabIndex=0;
  else target.removeAttribute('tabindex');
 }
});
for(const panel of [storyCaption,by('characterLine')]){
 captionScroll.observe(panel);
 panel.addEventListener('keydown',event=>{
  if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End','Space'].includes(event.code))event.stopPropagation();
 });
}
by('sampleVoice').onclick=()=>{
 voice('보리야');
};
by('sampleAmbient').onclick=()=>{
 awaken();
 if(audio)audio.resume().then(()=>playWorldEffect('drop',null,.4,0,true)).catch(()=>{});
};
