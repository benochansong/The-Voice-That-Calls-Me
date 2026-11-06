// Bori approaches the near side of the palms. Only touching the water completes the encounter.
const waterMeetingHand=new T.Vector3();
const waterMeetingPoint=new T.Vector3();
const waterCameraEye=new T.Vector3();
const waterCameraLook=new T.Vector3();
const sipSeconds=1.85;
let waterMeeting=null;
let walkingToLake=false,lakeWaypoint=0,lakeWalkTime=0;
const lakePath=[[2.8,11.7],[4.5,7.3],[4.4,-.5],[2.7,-5.4],[-.6,-13]];

function softTurn(angle,target,dt,response){
 const delta=Math.atan2(Math.sin(target-angle),Math.cos(target-angle));
 return angle+delta*(1-Math.exp(-dt*response));
}
function lookTowardWater(dt){
 const palm=marketWaterTarget(waterMeetingHand);
 const gap=distance(palm.x,palm.z);
 if(gap>2.6)return;
 const toward=Math.atan2(palm.x-sheep.position.x,sheep.position.z-palm.z);
 const relative=toward+bori.state.heading;
 const blend=(1-T.MathUtils.smoothstep(gap,.8,2.6))*(1-Math.exp(-dt*7));
 const turn=T.MathUtils.clamp(Math.atan2(Math.sin(relative),Math.cos(relative)),-.7,.7);
 head.rotation.y=T.MathUtils.lerp(head.rotation.y,-turn,blend);
 head.rotation.x=T.MathUtils.lerp(head.rotation.x,-.17,blend);
}
function beginWaterMeeting(){
 if(waterMeeting)return;
 const start=sheep.position.clone(),hand=marketWaterTarget(waterMeetingHand);
 const end=new T.Vector3(hand.x,0,hand.z+.765);
 const side=start.x<hand.x? -1:1;
 const control=start.clone().lerp(end,.5);
 // Approach from the side when the player comes round the back of the seated figure.
 if(start.z<hand.z+.15){
  control.x=hand.x+side*1.75;
  control.z=hand.z+1.25;
 }
 const path=new T.QuadraticBezierCurve3(start,control,end);
 waterMeeting={path,side,age:0,approach:Math.max(.28,path.getLength()/1.3),drink:0,speed:0};
 listen=false;setDirectionCue('');caption('보리가 물 내민 손 가까이 한 발씩 다가간다.',2);
}
function steppingAway(vx,vz){
 if(!waterMeeting||save.drank||waterMeeting.age<.12||!Math.hypot(vx,vz))return false;
 const dx=sheep.position.x-waterMeetingHand.x,dz=sheep.position.z-waterMeetingHand.z;
 return vx*dx+vz*dz>.46*Math.hypot(vx,vz)*Math.hypot(dx,dz);
}
function updateWaterMeeting(dt){
 const meeting=waterMeeting;
 if(!meeting)return;
 meeting.age+=dt;
 const progress=T.MathUtils.clamp((meeting.age-meeting.approach)/sipSeconds,0,1);
 meeting.drink=progress;
 updateWaterGiver(progress,dt);
 marketWaterTarget(waterMeetingHand);
 const p=sheep.position,oldX=p.x,oldZ=p.z;
 if(meeting.age<meeting.approach){
  const t=meeting.age/meeting.approach;
  meeting.path.getPointAt(t*t*(3-2*t),waterMeetingPoint);
  p.copy(waterMeetingPoint);
  const heading=Math.atan2(oldX-p.x,oldZ-p.z);
  sheep.rotation.y=softTurn(sheep.rotation.y,t>.86?0:heading,dt,12);
 }else{
  // The muzzle anchor at the sip pose is (0, .62, -.765) in lamb-local coordinates.
  p.x=waterMeetingHand.x;p.z=waterMeetingHand.z+.765;
  sheep.rotation.y=softTurn(sheep.rotation.y,0,dt,18);
 }
 meeting.speed=Math.hypot(p.x-oldX,p.z-oldZ)/dt;
 if(progress>=.55&&!save.drank){
  save.drank=true;checkpoint();
  callBori(offeringFace);
 }
 if(progress>=1){waterMeeting=null;walkingToLake=true;lakeWaypoint=0;lakeWalkTime=0}
}
function composeWaterCamera(eye,look){
 if(!waterMeeting)return;
 const {age,drink,side}=waterMeeting;
 const strength=T.MathUtils.smoothstep(age,0,.55)*(1-T.MathUtils.smoothstep(drink,.84,1));
 const h=waterMeetingHand;
 waterCameraEye.set(h.x+side*2.46,h.y+.67,h.z+.04);
 waterCameraLook.set(h.x,h.y+.18,h.z+.2);
 eye.lerp(waterCameraEye,strength);look.lerp(waterCameraLook,strength);
}
function updateMarketTeacher(dt){
 if(waterMeeting)return;
 updateWaterGiver(null,dt);
 if(!save.drank)return;
 if(walkingToLake&&!save.done&&sceneTime<0){
  lakeWalkTime+=dt;
  const rise=T.MathUtils.smoothstep(lakeWalkTime,0,.65);
  jesus.scale.y=.74+.26*rise;
  if(lakeWalkTime<.5)return;
  const [x,z]=lakePath[lakeWaypoint],dx=x-jesus.position.x,dz=z-jesus.position.z;
  const length=Math.hypot(dx,dz);
  const stride=dt*T.MathUtils.clamp(1.5+(jesus.position.z-sheep.position.z)*.45,1.45,4.5);
  if(length<=stride){
   jesus.position.set(x,0,z);
   if(++lakeWaypoint===lakePath.length)walkingToLake=false;
  }else{
   jesus.position.x+=dx/length*stride;jesus.position.z+=dz/length*stride;
   standingGiver.rotation.z=.023*Math.sin(lakeWalkTime*6);
   standingGiver.position.y=.018*Math.abs(Math.sin(lakeWalkTime*6));
   jesus.rotation.y=softTurn(jesus.rotation.y,Math.atan2(dx,dz),dt,6);
  }
 }else{
  jesus.scale.y=1;standingGiver.rotation.z=0;standingGiver.position.y=0;
  walkingToLake=false;jesus.position.set(save.done?0:-.6,0,save.done?-16:-13);
  jesus.rotation.y=softTurn(jesus.rotation.y,0,dt,5);
 }
}
