// Scene blocking owns positions. This pass supplies gaze and gait after blocking has
// finished; an actor already posed for a handoff or a passing lamb keeps that pose.
const castMemory=new WeakMap();
const castObserver=new T.Vector3(),castPoint=new T.Vector3();
const speakerPoint=new T.Vector3(),listenerPoint=new T.Vector3();
const sceneConversations=new Map();
function stageConversation(steps,speaker,listener){
 for(const step of steps)sceneConversations.set(step,{speaker,listener});
}
stageConversation(['recovery'],mother,healer);
stageConversation(['lowering','healing'],patient,teachers);
stageConversation(['boatTalk'],boatTeacher,null);
stageConversation(['hush'],captain,mariners[0]);
stageConversation(['tending'],helper,injured);
stageConversation(['inn'],helper,keeper);
stageConversation(['called'],caller5,bart);
stageConversation(['welcome'],caller5,zac);
stageConversation(['pledge'],zac,caller5);
stageConversation(['twoCoins'],widow,chest);
stageConversation(['anoint'],mary6,perfume);
stageConversation(['washFeet'],aTeacher,basin);
stageConversation(['lastMeal'],aTeacher,guests7[0]);
stageConversation(['mealMorning'],host8,peter8);
stageConversation(['sharing'],host,servers[0]);
stageConversation(['prayer'],praying,null);
stageConversation(['seize'],praying,arrestParty[0]);
stageConversation(['threeAnswers'],peter7,null);
stageConversation(['sentence'],governor,accused);
stageConversation(['laidToRest'],joseph,shroud);
stageConversation(['herName'],gardener,magdalene);
stageConversation(['newsPath','testimony'],magdalene,witnesses8[0]);
stageConversation(['threeCalls'],host8,peter8);

const walkingCast=new Set([standingGiver,kid,...fishers,bearer,mother,patient,levy,caller,little,
 ...lateFamily,...servers,helper,...walkers,shepherd,bart,zac,widow,...donors,mary6,
 ...arrestParty,peter7,accused,...escorts,joseph,magdalene,...witnesses8,host8,peter8]);
const followOwnSteps=new Set([bearer,mother,patient,levy,caller,little,...lateFamily,helper,...walkers,
 shepherd,bart,zac,widow,...donors,mary6,peter7,accused,...escorts,joseph,magdalene,...witnesses8,...fishers]);
function castIsVisible(person){
 for(let node=person;node;node=node.parent)if(!node.visible)return false;
 return true;
}
function eyeLevel(object,out){
 out.set(0,isStoryPerson(object)?1.5:0,0);
 return object.localToWorld(out);
}
function castCanWalk(person){
 if(save.prologue)return person===nativitySet.player||nativitySet.companions.includes(person);
 if(person===patient)return save.chapterStep==='healing'&&beatTime>7;
 if(person===zac&&person.position.y>.1)return false;
 return walkingCast.has(person);
}
function updateCast(dt){
 const step=save.chapterStep;
 const intro=Boolean(save.prologue);
 if(intro&&!nativitySet.field.visible)return;
 const observer=intro?nativitySet.player:head;
 const conversation=sceneConversations.get(step);
 let speaker=conversation?.speaker,listener=conversation?.listener;
 eyeLevel(observer,castObserver);
 if(intro){
  if(save.prologue==='goodNews'){speaker=nativitySet.messenger;listener=nativitySet.player}
  if(['toManger','newborn','holdMemory','acrossYears'].includes(save.prologue)){
   speaker=nativitySet.tinyHand;listener=null;
  }
 }else if(!step&&sceneTime>=0){speaker=standingGiver;listener=sceneTime<4?fishers[0]:fishers[2]}
 // When a listener answers, the others follow the reply rather than the previous speaker.
 if(listener&&speakingLine?.figure===listener&&speakingLine.scene===sceneDialogueKey()){
  const previous=speaker;speaker=listener;listener=previous;
 }
 if(speaker)eyeLevel(speaker,speakerPoint);
 if(listener)eyeLevel(listener,listenerPoint);
 if(step==='climb'||step==='flowers')eyeLevel(mountTeacher,listenerPoint);
 // Keep witnesses oriented toward the distant hill. They should not greet a passing lamb here.
 const quiet=step==='crucified'||step==='briefPassion'||step==='sabbath'||step==='seventhEnd';
 for(const person of storyPersonFigures){
  if(!castIsVisible(person))continue;
  // The sleepers, the reclining sick and distant figures on crosses keep their authored poses.
  if(person.parent===hillCross&&person.position.z< -8)continue;
  if((person===mother||person===patient||person===injured)&&Math.abs(person.rotation.z)>.8)continue;
  if((step==='prayer'||step==='watch')&&sleepers.includes(person))continue;
  if(person===captain&&(step==='gale'||step==='boarding'))continue;
  person.getWorldPosition(castPoint);
  const dx=castObserver.x-castPoint.x,dz=castObserver.z-castPoint.z,range=dx*dx+dz*dz;
  const principal=person===speaker||person===listener;
  if(range>180&&!principal)continue;
  let state=castMemory.get(person);
  if(!state){state={lastTime:-1,x:castPoint.x,z:castPoint.z,notice:0,tracking:false};castMemory.set(person,state)}
  const continuous=Math.abs(clock-dt-state.lastTime)<.001;
  const vx=continuous?(castPoint.x-state.x)/dt:0,vz=continuous?(castPoint.z-state.z)/dt:0;
  const speed=Math.hypot(vx,vz);
  state.lastTime=clock;state.x=castPoint.x;state.z=castPoint.z;
  if(personPosedThisFrame(person))continue;
  const walk=speed<7&&castCanWalk(person)?speed:0;
  if(walk>.17&&followOwnSteps.has(person)&&Math.abs(person.rotation.z)<.5){
   person.rotation.y=softTurn(person.rotation.y,Math.atan2(vx,vz),dt,5);
  }
  let look=null;
  if(speaker){
   look=person===speaker?(listener?listenerPoint:null):speakerPoint;
  }else if(!quiet&&person!==observer){
   // Different on/off distances stop eyes from fluttering at the edge of a lane.
   if(!continuous){state.tracking=false;state.notice=0}
   const radius=state.tracking?3.95:2.8+(person.id%6)*.09;
   const close=range<radius*radius&&Math.abs(castObserver.y-castPoint.y)<2.5;
   state.notice=close?Math.min(.6,state.notice+dt):0;
   state.tracking=close&&(state.tracking||state.notice>.10+(person.id%5)*.025);
   if(state.tracking||person===gardener&&step==='calledHome')look=castObserver;
   else if((step==='climb'||step==='flowers')&&person!==mountTeacher)look=listenerPoint;
  }
  animatePerson(person,dt,{lookAt:look,walk});
 }
}
