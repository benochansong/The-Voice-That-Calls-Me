// Shapes describe the visible opening, rounding and spreading of the lips.
// Keep the bilabial closures in particular: the initial B in Bori starts with closed lips.
const lipShape={
 rest:[0,0,0], open:[.90,.02,.19], mid:[.58,.04,.24], wide:[.31,0,.83],
 round:[.37,.90,0], smallRound:[.22,.69,.04], tongue:[.22,0,.23],
 teeth:[.10,0,.47], breath:[.34,0,.08], seal:[0,0,0]
};
const recordedShapes=[
 'rest','mid','open','round','mid','smallRound','wide','round','round','open','round',
 'open','breath','smallRound','tongue','teeth','smallRound','tongue','teeth','tongue','mid','seal'
];
let speakingLine=null;
const relaxingFaces=new Map();
const speechPose={open:0,round:0,wide:0,emotion:'calm',strength:0};

function sampleFace(line,elapsed){
 const {timing,duration}=line;
 let from=lipShape.rest,to=from,mix=0,power=0;
 if(timing?.visemes?.length){
  const events=timing.visemes;
  let i=0;
  while(i+1<events.length&&events[i+1].t<=elapsed)i++;
  if(elapsed>=events[i].t){
   from=lipShape[recordedShapes[events[i].id]]||lipShape.rest;
   const next=events[i+1];
   if(next){
    to=lipShape[recordedShapes[next.id]]||lipShape.rest;
    const blend=Math.min(.036,(next.t-events[i].t)*.38);
    if(blend>0)mix=T.MathUtils.smoothstep(elapsed,next.t-blend,next.t);
   }else to=from;
  }
 }else if(line.syllables.length){
  // Text timing is a fallback for an unavailable voice bank.
  const at=T.MathUtils.clamp(elapsed/duration,0,.9999)*line.syllables.length;
  const code=line.syllables[Math.floor(at)].charCodeAt(0)-0xac00;
  const vowel=Math.floor(code/28)%21,onset=Math.floor(code/588),phase=at%1;
  if([6,7,8,17].includes(onset)&&phase<.2)from=lipShape.seal;
  else if(vowel>=8&&vowel<=17)from=lipShape.round;
  else if([1,3,5,7,18,19,20].includes(vowel))from=lipShape.wide;
  else from=lipShape.open;
  to=from;power=Math.sin(phase*Math.PI);
 }
 if(timing?.envelope?.length){
  const samples=timing.envelope,at=Math.min(samples.length-1,elapsed*timing.rate);
  const i=Math.floor(at);
  power=T.MathUtils.lerp(samples[i],samples[Math.min(i+1,samples.length-1)],at-i);
 }
 const activity=T.MathUtils.smoothstep(power,.015,.42);
 speechPose.open=T.MathUtils.lerp(from[0],to[0],mix)*(.18+.82*activity);
 speechPose.round=T.MathUtils.lerp(from[1],to[1],mix)*(.46+.54*activity);
 speechPose.wide=T.MathUtils.lerp(from[2],to[2],mix)*(.46+.54*activity);
 speechPose.emotion=line.emotion;
 speechPose.strength=(1-Math.exp(-elapsed*14))*(1-T.MathUtils.smoothstep(elapsed,duration,duration+.32));
 return speechPose;
}
function clearCharacterLine(){
 if(!speakingLine)return;
 relaxingFaces.set(speakingLine.figure,0);speakingLine=null;
 stopDialogueVoice();
 by('characterLine').hidden=true;
}
function sayCharacter(figure,role,text,emotion,{speaker,reference,inStoryCaption=false}){
 if(!figure)return;
 clearCharacterLine();
 const timing=dialogueTiming(text,role);
 const syllables=Array.from(text).filter(c=>c>='가'&&c<='힣');
 speakingLine={figure,role,text,emotion,timing,syllables,scene:sceneDialogueKey(),
  elapsed:0,duration:timing?.duration||Math.max(.75,syllables.length*.19),paused:false,heard:false,pending:0};
 relaxingFaces.delete(figure);
 if(!inStoryCaption){
  by('speakerLabel').textContent=speaker+' · '+reference;
  by('spokenText').textContent=text;
  by('characterLine').hidden=false;
  by('characterLine').scrollTop=0;
 }
 voice(text,role);
}
function callBori(figure){
 caption('예수님　“보리야.”',figure===offeringFace?4:7);
 sayCharacter(figure,'jesus','보리야','warm',{speaker:'예수님',reference:'창작 대사',inStoryCaption:true});
}
function linePlaybackTime(line){
 const playing=dialoguePlayback();
 if(playing?.playing&&playing.text===line.text&&playing.role===line.role)return playing.elapsed;
 return null;
}
function pauseCharacterLine(){
 if(speakingLine&&!speakingLine.paused){
  speakingLine.elapsed=linePlaybackTime(speakingLine)??speakingLine.elapsed;
  speakingLine.paused=true;
 }
 stopDialogueVoice();
}
function resumeCharacterLine(){
 if(document.hidden||by('book').open)return;
 // A journal preview may have been playing over the paused journey.
 stopDialogueVoice();
 const line=speakingLine;
 if(!line?.paused)return;
 line.paused=false;line.pending=0;line.heard=false;
 if(line.scene===sceneDialogueKey()&&line.elapsed<line.duration)voice(line.text,line.role,line.elapsed);
}
function updateCharacterDialogue(dt){
 if(speakingLine&&speakingLine.scene!==sceneDialogueKey())clearCharacterLine();
 updateSceneDialogue(dt);
 for(const [figure,age] of relaxingFaces){
  if(!applyDialogueFace(figure,dt,null)||age>.7)relaxingFaces.delete(figure);
  else relaxingFaces.set(figure,age+dt);
 }
 const line=speakingLine;
 if(!line||line.paused)return;
 // The sound clock handles dropped render frames. With audio muted the same recorded
 // visemes and envelope run on the scene clock, so silence still has a readable performance.
 const playback=dialoguePlayback();
 const matching=playback&&playback.text===line.text&&playback.role===line.role;
 if(matching&&playback.playing){
  line.elapsed=playback.elapsed;line.heard=true;
 }else if(matching&&!line.heard&&line.pending<.65){
  // Do not mouth the opening syllable twice while a local media element loads.
  line.pending+=dt;
 }else{
  if(line.heard&&!prefs.mute&&prefs.voiceVolume>0&&!matching)line.elapsed=Math.max(line.duration,line.elapsed);
  line.elapsed+=dt;line.heard=false;
 }
 applyDialogueFace(line.figure,dt,sampleFace(line,line.elapsed));
 if(line.elapsed>=line.duration+.32)clearCharacterLine();
}
by('book').addEventListener('close',resumeCharacterLine);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseCharacterLine();else resumeCharacterLine()});
window.addEventListener('pagehide',pauseCharacterLine);
window.addEventListener('pageshow',event=>{if(event.persisted)resumeCharacterLine()});
