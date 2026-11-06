// Preferences live outside the journey slot and apply to the campaign and journal replays.
const by=id=>document.getElementById(id);
const captionSizes=[16,20,24,28];
const shakeLevels=[0,35,100];
function loadPlayerPreferences(){
 let stored={};
 try{stored=JSON.parse(localStorage.getItem('boriPrefs'))||{}}catch{}
 const defaultShake=matchMedia('(prefers-reduced-motion: reduce)').matches?0:100;
 const volume=value=>Number.isFinite(value)?Math.max(0,Math.min(100,Math.round(value))):100;
 return {
  mute:stored.mute===true,toggle:stored.toggle===true,
  directionCaptions:stored.directionCaptions!==false,
  captionSize:captionSizes.includes(stored.captionSize)?stored.captionSize:16,
  cameraShake:shakeLevels.includes(stored.cameraShake)?stored.cameraShake:defaultShake,
  voiceVolume:volume(stored.voiceVolume),ambientVolume:volume(stored.ambientVolume)
 };
}
const prefs=loadPlayerPreferences();
let audio,environmentGain;
function setDirectionCue(text){
 const cue=by('directionCue');
 if(cue.textContent!==text)cue.textContent=text;
}
function applyPlayerPreferences(){
 document.documentElement.style.setProperty('--caption-size',prefs.captionSize+'px');
 by('voiceLevel').value=prefs.voiceVolume+'%';
 by('ambientLevel').value=prefs.ambientVolume+'%';
 for(const id of ['voiceVolume','ambientVolume'])by(id).setAttribute('aria-valuetext',prefs[id]+'%');
 by('sampleVoice').disabled=prefs.mute||prefs.voiceVolume===0||!window.speechSynthesis;
 by('sampleAmbient').disabled=!environmentAudible();
 if(!prefs.directionCaptions)setDirectionCue('');
 if(environmentGain)environmentGain.gain.value=prefs.mute?0:prefs.ambientVolume/100;
}
function settings(){
 const oldVoice=prefs.voiceVolume;
 for(const key of Object.keys(prefs)){
  const control=by(key);
  prefs[key]=control.type==='checkbox'?control.checked:Number(control.value);
 }
 applyPlayerPreferences();
 if(prefs.mute||prefs.voiceVolume!==oldVoice)window.speechSynthesis?.cancel();
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
 if(!environmentAudible())return;
 try{
  if(!audio){
   audio=new AudioContext();environmentGain=audio.createGain();
   environmentGain.gain.value=prefs.ambientVolume/100;
   environmentGain.connect(audio.destination);
  }
  if(audio.state==='suspended')audio.resume().catch(()=>{});
 }catch{}
}
function voice(text){
 if(prefs.mute||!prefs.voiceVolume||!window.speechSynthesis)return;
 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang='ko-KR';utterance.rate=.82;utterance.volume=prefs.voiceVolume/100;
 speechSynthesis.speak(utterance);
}
const cueDirections=['앞','오른쪽 앞','오른쪽','오른쪽 뒤','뒤','왼쪽 뒤','왼쪽','왼쪽 앞'];
function cueDirection(angle){return cueDirections[(Math.round(angle/(Math.PI/4))+8)%8]}

const storyCaption=by('caption');
// At large text sizes a long passage can need its own scroll area on a small screen.
new ResizeObserver(()=>{
 if(storyCaption.scrollHeight>storyCaption.clientHeight)storyCaption.tabIndex=0;
 else storyCaption.removeAttribute('tabindex');
}).observe(storyCaption);
storyCaption.addEventListener('keydown',event=>{
 if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End','Space'].includes(event.code))event.stopPropagation();
});
by('sampleVoice').onclick=()=>{
 window.speechSynthesis?.cancel();
 voice('보리야');
};
by('sampleAmbient').onclick=()=>{
 awaken();
 ping('water',0,.12);
};
