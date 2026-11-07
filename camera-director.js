// One camera owns position, gaze and lens easing, including the prologue.
// Scene changes dissolve a single captured frame instead of flying between sets.
const cameraAim=new T.Vector3(),cameraRotation=new T.Quaternion();
const cameraMatrix=new T.Matrix4(),cameraUp=new T.Vector3(0,1,0);
const meetingFace=new T.Vector3(),meetingLamb=new T.Vector3();
const meetingEye=new T.Vector3(),meetingLook=new T.Vector3();
const meetingGaze=new T.Vector3();
let cameraScene='',cameraManual=false,cameraLens=58;
let cameraBeat='',cameraEaseAge=0;
let sceneDissolve=null,dissolveAge=0;

function cameraSceneKey(){
 return save.prologue||save.chapterStep||(waterMeeting?'firstMeeting':sceneTime>=0?'dock':'market');
}
function cameraSetKey(step){
 if(!step)return 'market';
 return laterBeats[step]?.[6]||(['bedside','recovery','aside','evening'].includes(step)?'courtyard':'roof');
}
function cameraInput(){cameraManual=true}
function meetingEyePoint(figure,out){
 const eyes=figure.getObjectByName(figure===offeringFace?'offering-pupils':'iris-1');
 if(eyes)return eyes.getWorldPosition(out);
 return figure.localToWorld(out.set(0,figure===offeringFace?.204:1.5,.18));
}
function updateMeetingGaze(dt,moving){
 const first=waterMeeting&&waterMeeting.drink>.55;
 if(!first&&(save.chapterStep!=='reunion'||moving))return;
 const weight=first?T.MathUtils.smoothstep(waterMeeting.drink,.55,.9):T.MathUtils.smoothstep(beatTime,0,.9);
 meetingEyePoint(first?offeringFace:gardener,meetingGaze);
 sheep.worldToLocal(meetingGaze);meetingGaze.sub(head.position);
 const flat=Math.hypot(meetingGaze.x,meetingGaze.z);
 const turn=T.MathUtils.clamp(-Math.atan2(meetingGaze.x,-meetingGaze.z),-.9,.9);
 head.rotation.y=softTurn(head.rotation.y,turn,dt,9);
 head.rotation.x=T.MathUtils.lerp(head.rotation.x,T.MathUtils.clamp(Math.atan2(meetingGaze.y,flat),-.2,.38),weight);
}
function startSceneDissolve(){
 if(!camReady)return;
 if(!sceneDissolve){
  sceneDissolve=document.createElement('canvas');
  sceneDissolve.id='sceneDissolve';sceneDissolve.setAttribute('aria-hidden','true');
  Object.assign(sceneDissolve.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'0'});
  renderer.domElement.after(sceneDissolve);
 }
 // Also works for input-triggered changes when the WebGL drawing buffer was cleared.
 renderer.render(scene,camera);
 sceneDissolve.width=renderer.domElement.width;sceneDissolve.height=renderer.domElement.height;
 sceneDissolve.getContext('2d').drawImage(renderer.domElement,0,0);
 sceneDissolve.hidden=false;sceneDissolve.style.display='block';sceneDissolve.style.opacity='1';dissolveAge=0;
}
function updateSceneDissolve(dt){
 if(!sceneDissolve||sceneDissolve.hidden)return;
 dissolveAge+=dt;
 const duration=.75;
 sceneDissolve.style.opacity=String(1-T.MathUtils.smootherstep(dissolveAge,0,duration));
 if(dissolveAge>=duration){
  sceneDissolve.hidden=true;sceneDissolve.style.display='none';
  // Release the full-resolution backing store after the transition.
  sceneDissolve.width=sceneDissolve.height=1;
 }
}
function meetingPortrait(figure,eye,look,weight,side=1){
 if(!weight)return;
 meetingEyePoint(figure,meetingFace);
 head.getWorldPosition(meetingLamb);
 // The same gentle three-quarter angle recalls the first encounter in the garden.
 const angle=figure===offeringFace?jesus.rotation.y:figure.rotation.y;
 const sn=Math.sin(angle),cs=Math.cos(angle);
 const across=figure===offeringFace?1.85:2.45,forward=figure===offeringFace?1.75:1.05;
 meetingEye.set(meetingFace.x+side*across*cs+forward*sn,meetingFace.y+.36,
  meetingFace.z-side*across*sn+forward*cs);
 meetingLook.copy(meetingFace).lerp(meetingLamb,.36);meetingLook.y-=.12;
 // Keep both faces inside a portrait viewport without cropping their eye line.
 meetingEye.sub(meetingLook).multiplyScalar(Math.max(1,1.05/camera.aspect)).add(meetingLook);
 eye.lerp(meetingEye,weight);look.lerp(meetingLook,weight);
 cameraLens=T.MathUtils.lerp(58,44,weight);
}
function composeStoryCamera(eye,look,moving){
 const key=cameraSceneKey();
 if(key!==cameraScene){cameraScene=key;cameraManual=false}
 cameraLens=58;
 if(waterMeeting&&!cameraManual){
  const weight=T.MathUtils.smootherstep(waterMeeting.age,0,.8);
  meetingPortrait(offeringFace,eye,look,weight,waterMeeting.side);
 }else if(save.chapterStep==='reunion'&&!moving&&!cameraManual){
  meetingPortrait(gardener,eye,look,T.MathUtils.smootherstep(beatTime,0,1.2),-1);
 }
}
function settleStoryCamera(eye,look,dt,lens=cameraLens,cut=false){
 const beat=cameraSceneKey();
 if(beat!==cameraBeat){cameraBeat=beat;cameraEaseAge=0}
 cameraEaseAge+=dt;
 const ease=T.MathUtils.smoothstep(cameraEaseAge,0,.45);
 const snap=!camReady||cut;
 const blend=snap?1:1-Math.exp(-dt*5*ease);
 camera.position.lerp(eye,blend);
 cameraAim.copy(look);
 cameraMatrix.lookAt(camera.position,cameraAim,cameraUp);
 cameraRotation.setFromRotationMatrix(cameraMatrix);
 camera.quaternion.slerp(cameraRotation,snap?1:1-Math.exp(-dt*8*ease));
 const nextLens=T.MathUtils.lerp(camera.fov,lens,snap?1:1-Math.exp(-dt*4*ease));
 if(Math.abs(nextLens-camera.fov)>.001){camera.fov=nextLens;camera.updateProjectionMatrix()}
 camReady=true;
 updateSceneDissolve(dt);
}
