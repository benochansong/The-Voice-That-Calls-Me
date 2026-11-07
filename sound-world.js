// All foley is generated locally. The listener stays with Bori while camera yaw
// supplies the same left/right reference used by the directional captions.
const worldSounds=new Map(),worldEffects=new Set(),foleyBuffers=new Map();
const soundPoint=new T.Vector3(),soundForward=new T.Vector3();
const footMemory={set:'',x:0,z:0,strike:0,distance:0,variant:0};
const neighbourSteps=new WeakMap();
let soundWorldSet='';

function surfaceAt(x,z,set=atmosphereSet){
 if(set==='crossing'||set==='market'&&z< -13.4&&Math.abs(x)<2.5)return 'deck';
 if(set==='nativity')return z< -6?'stone':'grass';
 if(set==='hill'||set==='meadow'||set==='fold'||set==='olives')return 'grass';
 if(set==='dawnGarden')return Math.abs(x+3)<1.4&&z< -3.4?'stone':'grass';
 if(set==='field')return z>2?'sand':z> -2?'stone':'grass';
 if(['shore','breakfastBeach','wayside','ravine','hillCross'].includes(set))return 'sand';
 if(set==='market'&&Math.abs(x)>2.8)return 'sand';
 return 'stone';
}
function updateSoundListener(){
 if(!audio)return;
 camera.getWorldDirection(soundForward);soundForward.y=0;soundForward.normalize();
 const earHeight=save.prologue?1.5:.85;
 const listener=audio.listener,t=audio.currentTime;
 if(listener.positionX){
  const values={positionX:sheep.position.x,positionY:sheep.position.y+earHeight,positionZ:sheep.position.z,
   forwardX:soundForward.x,forwardY:0,forwardZ:soundForward.z,upX:0,upY:1,upZ:0};
  for(const [name,value] of Object.entries(values))listener[name].setValueAtTime(value,t);
 }else{
  listener.setPosition(sheep.position.x,sheep.position.y+earHeight,sheep.position.z);
  listener.setOrientation(soundForward.x,0,soundForward.z,0,1,0);
 }
}
function soundPanner(position,voice=false){
 const pan=audio.createPanner();
 pan.panningModel='HRTF';pan.distanceModel='inverse';
 pan.refDistance=voice?4.5:2;pan.rolloffFactor=voice?.65:1.1;pan.maxDistance=60;
 pan.positionX.value=position.x;pan.positionY.value=position.y;pan.positionZ.value=position.z;
 return pan;
}
function placeSound(pan,position){
 const t=audio.currentTime;
 pan.positionX.setTargetAtTime(position.x,t,.025);
 pan.positionY.setTargetAtTime(position.y,t,.025);
 pan.positionZ.setTargetAtTime(position.z,t,.025);
}
function foleyBuffer(kind,variant=0){
 const key=kind+'-'+variant;
 if(foleyBuffers.has(key))return foleyBuffers.get(key);
 const foot=['stone','grass','sand','deck'].includes(kind);
 const duration=foot?.24:kind==='drop'?.48:kind==='breath'?.62:4.8;
 const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate);
 const data=buffer.getChannelData(0),rate=audio.sampleRate;
 let seed=173+variant*101,low=0,softer=0;
 for(let i=0;i<data.length;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const noise=seed/2147483648-1,t=i/rate;
  low+=.13*(noise-low);softer+=.018*(noise-softer);
  const fade=Math.min(1,t/.006,(duration-t)/.012);
  let value=0;
  if(foot){
   const impact=Math.exp(-t*(kind==='deck'?28:48));
   const frequency={stone:820,grass:260,sand:390,deck:135}[kind]*(1+variant*.035);
   const tap=Math.sin(t*frequency*Math.PI*2)*impact;
   const scrape=Math.sin(Math.min(1,t/.16)*Math.PI)*Math.exp(-t*12);
   value=kind==='stone'?.42*noise*impact+.22*tap:
    kind==='deck'?.48*tap+.22*Math.sin(t*frequency*2.31*Math.PI*2)*Math.exp(-t*38)+.16*low*impact:
    kind==='grass'?.9*(noise-low)*scrape+.18*low*impact:
    .75*low*scrape+.3*noise*impact;
  }else if(kind==='drop'){
   value=.32*Math.sin(2*Math.PI*(1050*t-650*t*t))*Math.exp(-t*15)+low*.2*Math.exp(-t*20);
  }else if(kind==='breath'){
   value=low*.7*Math.sin(Math.PI*t/duration)**2;
  }else if(kind==='wind'){
   value=softer*2.4*(.65+.35*Math.sin(2*Math.PI*t/duration)**2);
  }else if(kind==='rain'){
   value=(noise*.24+low*.8)*(.8+.2*Math.sin(t*5));
  }else if(kind==='wave'){
   const swell=Math.sin(Math.PI*t/duration)**2;
   value=(low*1.6+noise*.08)*swell+softer*.3;
  }else if(kind==='fire'){
   value=low*.16+(Math.abs(noise)>.998?noise*.7:0);
  }else if(kind==='wood'){
   const creak=Math.sin(Math.PI*t/duration)**8;
   value=(Math.sin(2*Math.PI*(94*t+5*Math.sin(t*2)))+.3*Math.sin(2*Math.PI*t*231))*.08*creak+low*.08;
  }else if(kind==='people'){
   const syllable=Math.max(0,Math.sin(t*8+Math.sin(t*3)))**2;
   value=(low*.35+Math.sin(2*Math.PI*t*143)*.03+Math.sin(2*Math.PI*t*257)*.025)*syllable;
  }
  data[i]=value*Math.max(0,fade);
 }
 foleyBuffers.set(key,buffer);return buffer;
}
function retireWorldSound(sound,fade=.04){
 if(sound.retired)return;
 sound.retired=true;
 const t=audio.currentTime;
 sound.gain.gain.cancelScheduledValues(t);
 sound.gain.gain.setTargetAtTime(0,t,Math.max(.003,fade/4));
 sound.source.stop(t+fade);
}
function playWorldEffect(kind,position,level=.22,variant=0,preview=false){
 if(!audio||audio.state!=='running'||!environmentAudible())return;
 const source=audio.createBufferSource(),gain=audio.createGain();
 const pan=preview?audio.createStereoPanner():soundPanner(position);
 source.buffer=foleyBuffer(kind,variant);gain.gain.value=level;
 source.connect(pan).connect(gain).connect(environmentGain);
 const sound={source,gain,pan,retired:false};
 if(!preview)worldEffects.add(sound);
 source.onended=()=>{source.disconnect();pan.disconnect();gain.disconnect();worldEffects.delete(sound)};
 source.start();
}
function stopWorldAudio(){
 for(const sound of worldSounds.values())retireWorldSound(sound);
 worldSounds.clear();
 for(const sound of worldEffects)retireWorldSound(sound,.02);
 worldEffects.clear();
 soundWorldSet='';
}
function setWorldBed(id,kind,x,y,z,level,wanted){
 wanted.add(id);
 let sound=worldSounds.get(id);
 soundPoint.set(x,y,z);
 if(!sound){
  const source=audio.createBufferSource(),gain=audio.createGain(),pan=soundPanner(soundPoint);
  source.buffer=foleyBuffer(kind);source.loop=true;gain.gain.value=0;
  source.connect(pan).connect(gain).connect(environmentGain);
  sound={source,gain,pan,retired:false};worldSounds.set(id,sound);
  source.onended=()=>{source.disconnect();pan.disconnect();gain.disconnect()};
  source.start(0,(worldSounds.size*.63)%source.buffer.duration);
 }
 placeSound(sound.pan,soundPoint);
 const focus=listen?.42:1;
 const speech=dialogueIsAudible()?.5:1;
 sound.gain.gain.setTargetAtTime(level*focus*speech,audio.currentTime,.12);
}
function playSpatialCue(cue){
 if(!audio||audio.state!=='running'||!environmentAudible()||dialogueIsAudible())return;
 const kind=cue.type==='water'?(cue.name.includes('물결')?'wave':'drop'):
  cue.type==='step'?surfaceAt(cue.x,cue.z):'breath';
 soundPoint.set(cue.x,sheep.position.y+.65,cue.z);
 playWorldEffect(kind,soundPoint,kind==='breath'?.55:.32,footMemory.variant++%4);
}
function updateWorldAudio(dt){
 const set=atmosphereSet,p=sheep.position;
 const changed=footMemory.set!==set;
 const travelled=changed?0:Math.hypot(p.x-footMemory.x,p.z-footMemory.z);
 const strike=Math.floor((bori.state.stride+.1)/Math.PI);
 const landed=!save.prologue&&travelled>.001&&travelled<.7&&strike!==footMemory.strike;
 footMemory.distance=changed?0:footMemory.distance+travelled;
 const humanStep=save.prologue&&travelled>.001&&travelled<.7&&footMemory.distance>.52;
 footMemory.set=set;footMemory.x=p.x;footMemory.z=p.z;footMemory.strike=strike;
 if(humanStep||landed)footMemory.distance=0;
 if(audio?.state==='running'){updateSoundListener();updateSpatialDialogue()}
 if(!audio||audio.state!=='running'||!environmentAudible()){stopWorldAudio();return}
 if(soundWorldSet!==set){stopWorldAudio();soundWorldSet=set}
 if(landed||humanStep){
  soundPoint.set(p.x,p.y+.08,p.z);
  playWorldEffect(surfaceAt(p.x,p.z),soundPoint,(travelled/dt>3.5?.4:.28)*(listen?.8:1),footMemory.variant++%4);
 }
 const wanted=new Set();
 const bed=(id,kind,x,y,z,level)=>setWorldBed(id,kind,x,y,z,level,wanted);
 const quiet=['prayer','crucified','gravePath','laidToRest','sabbath','seventhEnd','calledHome','reunion'].includes(save.chapterStep);
 bed('wind','wind',-8,3,-8,quiet?.05:.12);
 if(set==='crossing'){
  bed('left-wave','wave',-4,-.2,0,.24+rainStrength*.25);
  bed('right-wave','wave',4,-.2,-3,.2+rainStrength*.22);
  bed('mast','wood',-.7,1,.3,.16+rainStrength*.16);
  if(rainStrength>.01){
   bed('gust','wind',-5,3,-5,rainStrength*.7);
   bed('rain','rain',4,3,0,rainStrength*.28);
  }
 }else if(set==='market'||set==='shore'||set==='breakfastBeach'){
  bed('water','wave',set==='breakfastBeach'?3.9:0,-.1,set==='market'?-21:-6,.35);
  if(set==='breakfastBeach'){
   bed('embers','fire',-2.65,.3,-1.4,.48);
   bed('drying-net','wood',3.9,.4,-5.9,.12);
  }
 }
 if(set==='nativity')bed('campfire','fire',-1.45,.4,2.3,.46);
 if(set==='fireside')bed('courtyard-fire','fire',0,.4,0,.46);
 if(!quiet&&['market','courtyard','meal','meadow','jericho','gates','court6','upper'].includes(set)){
  bed('people','people',set==='market'?-4:1,1.3,set==='market'?4:-2,.22);
 }
 for(const [id,sound] of worldSounds)if(!wanted.has(id)){retireWorldSound(sound,.16);worldSounds.delete(id)}
 // Nearby walking people use their actual motion, not the current subtitle's goal point.
 for(const person of storyPersonFigures){
  if(!castIsVisible(person))continue;
  person.getWorldPosition(soundPoint);
  const footing=person.parent===hull?person.position:soundPoint;
  const previous=neighbourSteps.get(person);
  const gap=previous?Math.hypot(footing.x-previous.x,footing.z-previous.z):0;
  const stepDistance=(previous?.distance||0)+(gap<.5?gap:0);
  if(previous&&previous.set===set&&gap>.002&&gap<.5&&stepDistance>.62&&distance(soundPoint.x,soundPoint.z)<10){
   playWorldEffect(surfaceAt(soundPoint.x,soundPoint.z),soundPoint,.13,person.id%4);
   neighbourSteps.set(person,{x:footing.x,z:footing.z,distance:0,set});
  }else neighbourSteps.set(person,{x:footing.x,z:footing.z,distance:stepDistance,set});
 }
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopWorldAudio()});
window.addEventListener('pagehide',stopWorldAudio);
