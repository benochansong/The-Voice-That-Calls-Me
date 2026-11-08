// World coordinates: the lake lies north, along negative Z.
const T=THREE, scene=new T.Scene(), camera=new T.PerspectiveCamera(58,1,.06,170);
const renderer=new T.WebGLRenderer({antialias:true});
document.body.prepend(renderer.domElement);
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.shadowMap.enabled=true;
scene.background=new T.Color(0xbcdacd); scene.fog=new T.FogExp2(0xc9d8bd,.012);
scene.add(new T.HemisphereLight(0xffedd0,0xe4b58b,2.1));
const sun=new T.DirectionalLight(0xffdfab,2.3);
sun.position.set(-16,28,12);sun.castShadow=true;
Object.assign(sun.shadow.camera,{left:-30,right:30,top:36,bottom:-36,far:95});
sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.001;scene.add(sun);
const box=new T.BoxGeometry(),ball=new T.IcosahedronGeometry(1,1), mats=new Map();
function part(parent,geo,color,x,y,z,w,h,d){
 if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,flatShading:true}));
 const m=new T.Mesh(geo,mats.get(color));m.position.set(x,y,z);m.scale.set(w,h,d);
 m.castShadow=m.receiveShadow=true;parent.add(m);return m;
}
const cube=(...args)=>part(args[0],box,...args.slice(1)), oval=(...args)=>part(args[0],ball,...args.slice(1));
function group(x,y,z){let g=new T.Group();g.position.set(x,y,z);scene.add(g);return g}
const wood=0x855435,linen=0xf3e3c3,clay=0xc07c58,water=0x65b5b4;
cube(scene,0xdcc196,0,-.26,5,70,.5,45);cube(scene,water,0,-.47,-52,150,.5,76);
for(let i=0;i<32;i++){
 let x=Math.sin(i*34.41)*56,z=-28-(i%8)*4;
 cube(scene,0xa7d4c4,x,-.21,z,1+i%4,.02,.08);
 oval(scene,0x87ab98,x,1,-62-i%4,7,3+i%5,5);
}
const walls=[];
function house(x,z,w,d,h){
 cube(scene,0xd3ac80,x,h/2,z,w,h,d);cube(scene,linen,x,h,z,w+.25,.24,d+.25);
 walls.push([x,z,w/2,d/2]);
 const sign=Math.sign(x)||1;
 for(let j=-1;j<=1;j++)cube(scene,0x635343,x-sign*(w/2+.01),h*.55,z+j*d*.3,.03,.68,.5);
}
for(const x of [-10,10])for(let i=0;i<4;i++)house(x,16-i*8,4,6,3.2+(i%2));
house(0,3.4,4.2,5.5,3.1);
function stall(x,z,color){
 for(let a of [-1,1])for(let b of [-1,1])cube(scene,wood,x+a*1.5,1.15,z+b*1.05,.1,2.3,.1);
 for(let i=0;i<6;i++)cube(scene,i%2?color:linen,x-1.48+i*.59,2.32,z,.61,.1,2.5).rotation.x=.09;
}
stall(0,17,0xb96549);stall(-5,8,0x527e75);stall(5,9,0xb99a45);
for(let i=0;i<12;i++){
 let x=(i%2?1:-1)*(7.2+.3*Math.sin(i)),z=16-i*2.5;
 oval(scene,clay,x,.42,z,.37,.48,.38);oval(scene,0x6c4936,x,.83,z,.2,.045,.21);
}
for(let i=0;i<23;i++)cube(scene,i%2?0xb07d50:0xbd9060,0,0,-13-i*.35,4.8,.17,.32);
function boat(x,z){
 const g=group(x,-.08,z);
 g.add(buildStorySkiff(5.8,2.45));
 cube(g,wood,0,2,0,.11,4,.11);cube(g,linen,.55,2.7,0,1.15,1.7,.09).rotation.z=.15;

 return g;
}
boat(-3.6,-17);boat(3.7,-20);
function human(x,z,robe,size=1,role=robe===linen?'teacher':'traveler'){
 const figure=storyPeople.build(x,z,robe,size,role);
 scene.add(figure);return figure;
}
const jesus=group(.35,0,13.6);
const standingGiver=storyPeople.build(0,0,linen,1,'teacher');
const [kneelingGiver,offeringHands,offeringFace]=storyPeople.buildKneeling();
kneelingGiver.add(offeringFace);
jesus.add(standingGiver,kneelingGiver,offeringHands);
standingGiver.visible=false;
const palmPool=oval(offeringHands,0x7daead,0,.621,.594,.112,.012,.078);
const waterGlimmer=oval(offeringHands,0xe0e9d7,-.035,.632,.585,.046,.004,.011);
function marketWaterTarget(out){return palmPool.getWorldPosition(out)}
const offeringLook=new T.Vector3();
function updateWaterGiver(progress,dt){
 const offering=!save.drank||progress!==null;
 standingGiver.visible=!offering;kneelingGiver.visible=offering;offeringHands.visible=offering;
 if(!offering)return;
 const breath=Math.sin(clock*1.85);
 const tilt=progress===null?0:Math.sin(Math.PI*Math.min(1,Math.max(0,progress)));
 // The hands remain cupped; the small forward reach keeps water and palms together.
 kneelingGiver.rotation.x=.009*breath+.026*tilt;
 // Follow the lamb's eye line as the head bends rather than aiming at its feet.
 head.localToWorld(offeringLook.set(0,.014,-.289));
 kneelingGiver.worldToLocal(offeringLook);
 const dx=offeringLook.x,dz=offeringLook.z-.267;
 const glance=Math.atan2(dx,Math.max(.35,dz));
 const chin=Math.atan2(1.154-offeringLook.y,Math.hypot(dx,dz));
 offeringFace.rotation.y=softTurn(offeringFace.rotation.y,T.MathUtils.clamp(glance*.86,-.55,.55),dt,5);
 offeringFace.rotation.x=softTurn(offeringFace.rotation.x,T.MathUtils.clamp(chin*.86,-.12,.42),dt,5);
 updateOfferingEyes(offeringFace,glance-offeringFace.rotation.y,chin-offeringFace.rotation.x,dt,clock);
 offeringHands.position.set(0,.005*breath-.012*tilt,.014*tilt);
 waterGlimmer.scale.x=.045+.005*Math.sin(clock*2.4);
}
const seller=human(-5,4,0xa46144),kid=human(5,-4,0xd79c57,.72);
const marketSellerLane=createPassingNeighbor(seller,-1);
const marketResident=human(4.35,2.65,0x778571);
marketResident.rotation.y=.35;
const marketResidentLane=createPassingNeighbor(marketResident,1);
const fishers=[human(-3,-15,0x668d83),human(-4,-15,0xb48052),human(3,-17,0xb86e54),human(4,-17,0x73978a)];
const bori=buildBori();
const {sheep,head,ears,legs,boriMouthAnchor}=bori;
scene.add(sheep);sheep.position.set(0,0,17);
const prologuePreview=location.hash==='#nativity-preview';
// The replay checkpoint belongs to this tab's history entry, never to the campaign slot.
const chapterReplay=location.hash==='#chapter-replay'?history.state?.boriReplay:null;
const replaying=prologuePreview||Boolean(chapterReplay);
const fresh=()=>({drank:false,child:false,done:false,x:0,z:8,prologue:'watchFlock'});
let save=fresh();
try{
 const previous=JSON.parse(localStorage.getItem('boriJourney'));
 // Older saves already belong to the market or a later chapter, including undrunk market saves.
 if(!replaying&&previous&&typeof previous==='object')save=Object.assign({drank:false,child:false,done:false,x:0,z:17},previous);
}catch{}

if(replaying&&history.state?.boriReplay?.checkpoint)save={...history.state.boriReplay.checkpoint};
sheep.position.set(save.x,0,save.z);
function checkpoint(){
 save.x=sheep.position.x;save.z=sheep.position.z;
 if(replaying){
  history.replaceState({boriReplay:{chapter:chapterReplay?.chapter||0,checkpoint:save}},'');
  return;
 }
 try{localStorage.boriJourney=JSON.stringify(save)}catch{}
}
let yaw=0,keys=new Set(),listen=false,drag=false,clock=0,nextTone=0,sayUntil=0,pose='',poseEnd=0,sceneTime=-1,sellerSeen=false,camReady=false;
function caption(t,d=3){storyCaption.textContent=t;storyCaption.scrollTop=0;sayUntil=clock+d}
function ping(type,side,level){
 if(!audio||!environmentAudible())return;
 const osc=audio.createOscillator(),gain=audio.createGain(),pan=audio.createStereoPanner(),t=audio.currentTime;
 const hz={water:920,call:330,step:90,cry:490,coin:1480,cock:660}[type];
 osc.type=type==='step'?'triangle':'sine';osc.frequency.setValueAtTime(hz,t);osc.frequency.exponentialRampToValueAtTime(type==='call'?440:hz*.74,t+.28);
 gain.gain.setValueAtTime(.001,t);gain.gain.exponentialRampToValueAtTime(level,t+.035);gain.gain.exponentialRampToValueAtTime(.001,t+.35);
 pan.pan.value=Math.sin(side);osc.connect(gain).connect(pan).connect(environmentGain);osc.start(t);osc.stop(t+.38);
}
function journal(){pauseCharacterLine();stopWorldAudio();resetLocomotion();keys.clear();listen=false;setDirectionCue('');
 by('memory').innerHTML=save.done?'<h3>복음서에서</h3><p>마가복음 1장 16–20절 · 갈릴리 호숫가에서 예수님은 시몬과 안드레, 이어 야고보와 요한을 부르셨고 그들은 예수님을 따랐다.</p><h3>보리의 기억 · 창작</h3><p>손에 고인 물을 마셨던 첫날. '+(save.child?'아이가 내 곁에 앉아 함께 호수를 보았다.':'부두에서 그물 고치는 모습을 바라보았다.')+'</p>':'<p>'+by('hint').textContent+'</p>';appendChapterRecord();appendNativityRecord();prepareChapterMenu();by('book').showModal();by('book').scrollTop=0}
by('menu').onclick=journal;by('resume').onclick=()=>by('book').close();
by('restart').onclick=()=>{if(replaying)return;if(confirm('이 기기에서 보리의 여행을 처음부터 시작할까요?')){localStorage.removeItem('boriJourney');location.reload()}};
const distance=(x,z)=>Math.hypot(sheep.position.x-x,sheep.position.z-z);
function action(){
 if(by('book').open||clock<poseEnd||sceneTime>=0)return;
 if(save.prologue){nativityAction();return}
 if(!save.drank&&distance(.35,13.6)<2.5){beginWaterMeeting()}
 else if(save.drank&&!save.done&&!save.child&&distance(5,-4)<2.5){save.child=true;pose='sit';poseEnd=clock+2.3;caption('아이가 끈을 풀고 보리 곁에 선다.');checkpoint()}
 else if(save.done)chapterAction();
}
function earDown(){listen=prefs.toggle?!listen:true;updateMusicLevel(listen);nextTone=0}
function earUp(){if(!prefs.toggle){listen=false;updateMusicLevel(false)}}
onkeydown=e=>{if(by('book').open)return;awaken();keys.add(e.code);if(!e.repeat){if(e.code==='KeyE')action();if(e.code==='KeyQ')earDown()}};
onkeyup=e=>{keys.delete(e.code);if(e.code==='KeyQ')earUp()};
onblur=()=>{keys.clear();resetLocomotion();listen=false;drag=false};
renderer.domElement.onpointerdown=e=>{awaken();if(e.button===2)earDown();else drag=true;renderer.domElement.setPointerCapture(e.pointerId)};
onpointerup=e=>{drag=false;if(e.button===2)earUp()};oncontextmenu=e=>e.preventDefault();
onpointermove=e=>{if(drag){yaw+=e.movementX*.006;if(e.movementX)cameraInput()}};
function blocked(x,z){
 if(save.prologue)return nativityBlocked(x,z);
 if(save.chapterStep)return chapterBlocked(x,z);
 if(Math.abs(x)>7.8||z>20||z< -20||z< -14&&Math.abs(x)>2.2)return true;
 const fromTeacher=Math.hypot(x-jesus.position.x,z-jesus.position.z);
 if(!save.drank&&fromTeacher<.53&&fromTeacher<distance(jesus.position.x,jesus.position.z))return true;
 if(save.drank&&(passingNeighborBlocks(marketSellerLane,x,z,sheep.position)||
                 passingNeighborBlocks(marketResidentLane,x,z,sheep.position)))return true;
 return walls.some(([cx,cz,w,d])=>roundedWall(x,z,cx,cz,w,d))
}
const soundFacing=new T.Vector3();
const handSoundPosition=new T.Vector3();
function marketCues(){
 if(!save.drank||waterMeeting){
  const h=marketWaterTarget(handSoundPosition);
  return [[h.x,h.z,'water','손에 맺힌 물방울']];
 }
 const sources=[[jesus.position.x,jesus.position.z,'call','익숙한 부름'],[seller.position.x,seller.position.z,'step','장수의 발소리']];
 if(!save.child)sources.push([5,-4,'cry','아이의 훌쩍임']);
 return sources;
}
function soundscape(){
 camera.getWorldDirection(soundFacing);
 const listenerYaw=Math.atan2(soundFacing.x,-soundFacing.z);
 const sources=save.prologue?nativityCues():save.chapterStep?chapterSounds():marketCues();
 const audible=sources.map(([x,z,type,name])=>{
 const bearing=Math.atan2(x-sheep.position.x,sheep.position.z-z);
 const relative=bearing-listenerYaw,angle=Math.atan2(Math.sin(relative),Math.cos(relative));
 return {x,z,bearing,angle,type,name,weight:(1.5+Math.cos(angle))/(3+distance(x,z))};
 }).sort((a,b)=>b.weight-a.weight);
 const cue=audible[0];
 setDirectionCue(prefs.directionCaptions?cueDirection(cue.angle)+' · '+cue.name:'');
 if(clock>nextTone){audible.slice(0,2).forEach(playSpatialCue);nextTone=clock+1.25}
 return cue.bearing;
}
function playSceneMusic(){
 if(!audio||audio.state!=='running'||!musicAudible()||document.hidden){
  stopScore();return;
 }
 updateMusicLevel(listen);
 updateScore(audio,musicGain,scoreCue(save));
}
// A hidden page may stop receiving animation frames while scheduled audio keeps sounding.
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopScore()});
window.addEventListener('pagehide',stopScore);
let prev=performance.now(),padA=false,padLT=false,padMoving=false;
function loop(now){
 requestAnimationFrame(loop);const dt=T.MathUtils.clamp((now-prev)/1000,.00001,.05);prev=now;
 if(document.hidden||by('book').open){resetLocomotion();stopWorldAudio();playSceneMusic();return}
 clock+=dt;
 const pad=Array.from(navigator.getGamepads?.()||[]).find(Boolean),axis=i=>Math.abs(pad?.axes[i]||0)>.16?pad.axes[i]:0;
 const stick=movementStick(pad?.axes[0]||0,pad?.axes[1]||0);
 const usingStick=Boolean(stick[0]||stick[1]||axis(2));
 if(usingStick&&!padMoving)awaken();
 padMoving=usingStick;
 const a=!!pad?.buttons[0]?.pressed,lt=!!pad?.buttons[6]?.pressed;
 if(a&&!padA){awaken();action()}if(lt&&!padLT){awaken();earDown()}if(!lt&&padLT)earUp();padA=a;padLT=lt;
 yaw+=(Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft'))+axis(2))*dt*1.9;
 if(keys.has('ArrowRight')||keys.has('ArrowLeft')||axis(2))cameraInput();
 let dx=Number(keys.has('KeyD'))-Number(keys.has('KeyA'))+stick[0],dz=Number(keys.has('KeyS'))-Number(keys.has('KeyW'))+stick[1];
 const speed=listen?1.15:keys.has('ShiftLeft')||keys.has('ShiftRight')||pad?.buttons[10]?.pressed?4.8:2.75;
 const vx=dx*Math.cos(yaw)-dz*Math.sin(yaw),vz=dx*Math.sin(yaw)+dz*Math.cos(yaw),p=sheep.position;
 if(steppingAway(vx,vz)){waterMeeting=null;caption('예수님은 물을 담은 채 기다리신다.',3)}
 const lastX=p.x,lastZ=p.z;
 const allowed=!waterMeeting&&(!save.prologue||nativityCanWalk())&&clock>=poseEnd&&sceneTime<0&&save.chapterStep!=='testimony'&&save.chapterStep!=='credits';
 const move=moveBori(dt,vx,vz,speed,allowed);
 if(!listen)setDirectionCue('');
 if(save.prologue){updateNativity(dt,move);updateCast(dt);updateCharacterDialogue(dt);updateAtmosphere(dt);updateWorldAudio(dt);playSceneMusic();renderer.render(scene,camera);return}
 if(!save.chapterStep){updateWaterMeeting(dt);updateMarketTeacher(dt)}
 const sitting=(pose==='sit'&&clock<poseEnd)||save.chapterStep==='credits'||
  (save.shelter&&['gale','hush'].includes(save.chapterStep));
 if(save.done)fishers.forEach((f,i)=>f.position.set((i-1.5)*.65,0,-14-i*.4));
 if(!save.chapterStep&&save.child&&!sitting){
  const dx=p.x+.85-kid.position.x,dz=p.z+.85-kid.position.z;
  kid.position.x+=dx*Math.min(1,dt*2);kid.position.z+=dz*Math.min(1,dt*2);
  const gap=Math.hypot(dx,dz);
  const gaze=gap>.2?Math.atan2(dx,dz):Math.atan2(p.x-kid.position.x,p.z-kid.position.z);
  kid.rotation.y=softTurn(kid.rotation.y,gaze,dt,5);
  kid.position.y=.014*Math.min(1,gap)*Math.abs(Math.sin(clock*6.8));
 }
 if(!save.chapterStep&&save.drank){
  stepPassingNeighbor(marketResidentLane,dt,p);
  if(stepPassingNeighbor(marketSellerLane,dt,p)&&!sellerSeen){
   sellerSeen=true;caption('생선 장수가 보리를 보고 한 걸음 옆으로 비켜 준다.');
  }
 }
 if(save.drank&&!save.done&&sceneTime<0&&p.z< -13.4){sceneTime=0;listen=false;caption('호숫가에서 예수님이 시몬과 안드레를 부르신다.',4)}
 if(sceneTime>=0){
 let before=sceneTime;sceneTime+=dt;
 if(before<4&&sceneTime>=4)caption('조금 더 가시다가 야고보와 요한도 부르신다.',4);
 fishers.forEach((f,i)=>{if(sceneTime>(i<2?1:5))f.position.lerp(new T.Vector3((i-1.5)*.65,0,-14-i*.4),dt*.8)});
 if(sceneTime>8){save.done=true;sceneTime=-1;checkpoint();caption('그들은 그물을 두고 예수님을 따랐다.　막 1:16–20',5)}
 }
 if(clock>sayUntil&&by('caption').textContent)by('caption').textContent='';
 const bearing=listen?soundscape():null;
 const pace=waterMeeting?waterMeeting.speed:Math.hypot(p.x-lastX,p.z-lastZ)/dt;
 updateBori(dt,pace>.035,pace,bearing,waterMeeting?.drink??null,Boolean(sitting),save.chapterStep==='credits');
 if(waterMeeting){
  const dip=T.MathUtils.smoothstep(waterMeeting.drink,.12,.52)*(1-T.MathUtils.smoothstep(waterMeeting.drink,.55,.9));
  head.position.y+=(waterMeetingHand.y-.62)*dip;
 }else if(!save.drank&&!listen)lookTowardWater(dt);
 by('place').textContent=p.z< -10?'갈릴리 호숫가':p.z<1?'아이의 골목':'가버나움 장터';
 by('hint').textContent=save.done?'E · 시몬의 집으로 동행하기':sceneTime>=0?'부두에서 바라보기':!save.drank?(distance(.35,13.6)<2.5?'E · 손에 담긴 물 마시기':'천막 밖 물소리로 다가가기'):!save.child&&distance(5,-4)<2.5?'E · 아이 곁에 앉기':'귀를 세워 호숫가로 가기';
 if(save.chapterStep)updateChapter(dt);
 updateMeetingGaze(dt,move);
 updateCast(dt);
 updateCharacterDialogue(dt);
 if(waterMeeting)by('hint').textContent=save.drank?'예수님 곁에서 숨 고르기':'손 가까이 다가가기 · 물러서면 멈춤';
 if(chapterReplay)showReplayExitHint();
 // Follow the actual terrain height. On deck, scale only the rocking component of the camera, not the hull or the player's footing.
 const onDeck=route[save.chapterStep]?.[6]==='crossing';
 const cameraBaseY=onDeck ? .12+(p.y-.12)*prefs.cameraShake/100 : p.y;
 const focus=new T.Vector3(p.x,cameraBaseY+.85,p.z);
 const viewYaw=sceneTime>=0?0:yaw;
 let target=focus.clone();
 for(let r=.2;r<=3.8;r+=.2){let x=p.x-Math.sin(viewYaw)*r,z=p.z+Math.cos(viewYaw)*r;if(!save.chapterStep&&walls.some(([cx,cz,w,d])=>Math.abs(x-cx)<w+.12&&Math.abs(z-cz)<d+.12))break;target.set(x,cameraBaseY+1.35+r*.19,z)}
 focus.set(p.x+Math.sin(viewYaw)*1.5,cameraBaseY+.78,p.z-Math.cos(viewYaw)*1.5);
 composeWaterCamera(target,focus);
 composeMealView(target,focus);
 composeStoryCamera(target,focus,move);
 if(save.chapterStep==='credits')frameRestingPlace(target,focus);
 if(save.chapterStep)chapterCamera(target,focus);
 settleStoryCamera(target,focus,dt);
 updateAtmosphere(dt);
 updateWorldAudio(dt);
 playSceneMusic();
 renderer.render(scene,camera);
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
onresize=resize;resize();
window.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(loop),{once:true});
