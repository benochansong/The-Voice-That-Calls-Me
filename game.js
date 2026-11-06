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
 oval(g,wood,0,.12,0,1.35,.48,3);oval(g,0x654934,0,.45,0,1.13,.12,2.55);
 cube(g,wood,0,2,0,.11,4,.11);cube(g,linen,.55,2.7,0,1.15,1.7,.09).rotation.z=.15;
 for(let i=0;i<7;i++)cube(g,0x9b9476,-.9+i*.16,.57,.8,.045,.05,1.4);
 return g;
}
boat(-3.6,-17);boat(3.7,-20);
function human(x,z,robe,size=1){
 let g=group(x,0,z);g.scale.setScalar(size);
 part(g,new T.ConeGeometry(.43,1.36,9),robe,0,.81,0,1,1,1);
 oval(g,0xb87b55,0,1.56,0,.235,.28,.23);oval(g,0x523c30,0,1.73,-.02,.25,.17,.23);
 for(let s of [-1,1]){oval(g,robe,s*.29,1,0,.13,.32,.15);oval(g,0xb87b55,s*.26,.91,.22,.1,.1,.16)}
 return g;
}
const jesus=human(.35,13.6,linen);jesus.scale.y=.73;
oval(jesus,water,0,.9,.31,.22,.04,.13);
const seller=human(-5,4,0xa46144),kid=human(5,-4,0xd79c57,.72);
const fishers=[human(-3,-15,0x668d83),human(-4,-15,0xb48052),human(3,-17,0xb86e54),human(4,-17,0x73978a)];
const sheep=group(0,0,17), cream=0xffebc7, muzzle=0xcba886;
oval(sheep,cream,0,.57,.05,.41,.37,.57);
const head=new T.Group();sheep.add(head);head.position.set(0,.8,-.39);
oval(head,muzzle,0,0,-.08,.26,.26,.28);oval(head,cream,0,.17,-.08,.28,.15,.24);
const ears=[],legs=[];
for(let s of [-1,1]){
 ears.push(oval(head,muzzle,s*.28,.04,0,.21,.09,.09));oval(head,0x342d26,s*.16,.04,-.29,.037,.044,.032);
 for(let z of [-.26,.28])legs.push(oval(sheep,muzzle,s*.23,.24,z,.095,.25,.095));
}
oval(sheep,cream,0,.61,.56,.14,.14,.15);
const by=id=>document.getElementById(id);
const fresh=()=>({drank:false,child:false,done:false,x:0,z:17});
let save=fresh(),prefs={mute:false,toggle:false};
try{Object.assign(save,JSON.parse(localStorage.boriJourney||'{}'));Object.assign(prefs,JSON.parse(localStorage.boriPrefs||'{}'))}catch{}
sheep.position.set(save.x,0,save.z);
function checkpoint(){save.x=sheep.position.x;save.z=sheep.position.z;try{localStorage.boriJourney=JSON.stringify(save)}catch{}}
function settings(){prefs={mute:by('mute').checked,toggle:by('toggle').checked};try{localStorage.boriPrefs=JSON.stringify(prefs)}catch{}if(prefs.mute)window.speechSynthesis?.cancel()}
for(let key of ['mute','toggle']){by(key).checked=prefs[key];by(key).onchange=settings}
let yaw=0,keys=new Set(),listen=false,drag=false,audio,clock=0,nextTone=0,sayUntil=0,pose='',poseEnd=0,sceneTime=-1,sellerSeen=false,camReady=false;
function caption(t,d=3){by('caption').textContent=t;sayUntil=clock+d}
function awaken(){try{audio??=new AudioContext();if(audio.state==='suspended')audio.resume().catch(()=>{})}catch{}}
function voice(t){if(prefs.mute||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(t);u.lang='ko-KR';u.rate=.82;window.speechSynthesis.speak(u)}
function ping(type,side,level){
 if(!audio||prefs.mute)return;
 const osc=audio.createOscillator(),gain=audio.createGain(),pan=audio.createStereoPanner(),t=audio.currentTime;
 const hz={water:920,call:330,step:90,cry:490}[type];
 osc.type=type==='step'?'triangle':'sine';osc.frequency.setValueAtTime(hz,t);osc.frequency.exponentialRampToValueAtTime(type==='call'?440:hz*.74,t+.28);
 gain.gain.setValueAtTime(.001,t);gain.gain.exponentialRampToValueAtTime(level,t+.035);gain.gain.exponentialRampToValueAtTime(.001,t+.35);
 pan.pan.value=Math.sin(side);osc.connect(gain).connect(pan).connect(audio.destination);osc.start(t);osc.stop(t+.38);
}
function journal(){keys.clear();listen=false;
 by('memory').innerHTML=save.done?'<h3>복음서에서</h3><p>마가복음 1장 16–20절 · 갈릴리 호숫가에서 예수님은 시몬과 안드레, 이어 야고보와 요한을 부르셨고 그들은 예수님을 따랐다.</p><h3>보리의 기억 · 창작</h3><p>손에 고인 물을 마셨던 첫날. '+(save.child?'아이가 내 곁에 앉아 함께 호수를 보았다.':'부두에서 그물 고치는 모습을 바라보았다.')+'</p>':'<p>'+by('hint').textContent+'</p>';appendChapterRecord();by('book').showModal()}
by('menu').onclick=journal;by('resume').onclick=()=>by('book').close();
by('restart').onclick=()=>{if(confirm('이 기기에서 보리의 여행을 처음부터 시작할까요?')){localStorage.removeItem('boriJourney');location.reload()}};
const distance=(x,z)=>Math.hypot(sheep.position.x-x,sheep.position.z-z);
function action(){
 if(by('book').open||clock<poseEnd||sceneTime>=0)return;
 if(!save.drank&&distance(.35,13.6)<2.5){save.drank=true;pose='drink';poseEnd=clock+2;sheep.rotation.y=0;caption('예수님　“보리야.”',4);voice('보리야');checkpoint()}
 else if(save.drank&&!save.done&&!save.child&&distance(5,-4)<2.5){save.child=true;pose='sit';poseEnd=clock+2.3;caption('아이가 끈을 풀고 보리 곁에 선다.');checkpoint()}
 else if(save.done)chapterAction();
}
function earDown(){listen=prefs.toggle?!listen:true;nextTone=0}
function earUp(){if(!prefs.toggle)listen=false}
onkeydown=e=>{if(by('book').open)return;awaken();keys.add(e.code);if(!e.repeat){if(e.code==='KeyE')action();if(e.code==='KeyQ')earDown()}};
onkeyup=e=>{keys.delete(e.code);if(e.code==='KeyQ')earUp()};
onblur=()=>{keys.clear();listen=false;drag=false};
renderer.domElement.onpointerdown=e=>{awaken();if(e.button===2)earDown();else drag=true;renderer.domElement.setPointerCapture(e.pointerId)};
onpointerup=e=>{drag=false;if(e.button===2)earUp()};oncontextmenu=e=>e.preventDefault();
onpointermove=e=>{if(drag)yaw+=e.movementX*.006};
function blocked(x,z){
 if(save.chapterStep)return chapterBlocked(x,z);
 if(Math.abs(x)>7.8||z>20||z< -20||z< -14&&Math.abs(x)>2.2)return true;
 return walls.some(([cx,cz,w,d])=>Math.abs(x-cx)<w+.35&&Math.abs(z-cz)<d+.35)
}
function soundscape(){
 const sources=save.chapterStep?[chapterCue()]:save.drank?[[0,-13,'call','익숙한 부름'],[-5,4,'step','장수의 발소리'],...(!save.child?[[5,-4,'cry','아이의 훌쩍임']]:[])]:[[.35,13.6,'water','손에 맺힌 물방울']];
 const audible=sources.map(([x,z,type,name])=>{
 let angle=Math.atan2(x-sheep.position.x,sheep.position.z-z)-yaw;
 angle=Math.atan2(Math.sin(angle),Math.cos(angle));return {angle,type,name,weight:(1.5+Math.cos(angle))/(3+distance(x,z))};
 }).sort((a,b)=>b.weight-a.weight);
 const cue=audible[0],side=Math.abs(Math.sin(cue.angle))<.25?'':Math.sin(cue.angle)>0?'오른쪽 ':'왼쪽 ';
 if(clock>sayUntil)by('caption').textContent=side+(Math.cos(cue.angle)>=0?'앞':'뒤')+' · '+cue.name;
 if(clock>nextTone){audible.forEach((s,i)=>ping(s.type,s.angle,Math.max(.004,Math.min(.12,s.weight*.6))/(1+i)));nextTone=clock+.85}
 return cue.angle;
}
let prev=performance.now(),padA=false,padLT=false;
function loop(now){
 requestAnimationFrame(loop);const dt=Math.min(.05,(now-prev)/1000);prev=now;
 if(by('book').open)return;clock+=dt;
 const pad=Array.from(navigator.getGamepads?.()||[]).find(Boolean),axis=i=>Math.abs(pad?.axes[i]||0)>.16?pad.axes[i]:0;
 const a=!!pad?.buttons[0]?.pressed,lt=!!pad?.buttons[6]?.pressed;
 if(a&&!padA){awaken();action()}if(lt&&!padLT){awaken();earDown()}if(!lt&&padLT)earUp();padA=a;padLT=lt;
 yaw+=(Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft'))+axis(2))*dt*1.9;
 let dx=Number(keys.has('KeyD'))-Number(keys.has('KeyA'))+axis(0),dz=Number(keys.has('KeyS'))-Number(keys.has('KeyW'))+axis(1);
 const norm=Math.max(1,Math.hypot(dx,dz)),speed=(listen?1.15:keys.has('ShiftLeft')||pad?.buttons[10]?.pressed?4.8:2.75)*dt;
 const vx=(dx*Math.cos(yaw)-dz*Math.sin(yaw))*speed/norm,vz=(dx*Math.sin(yaw)+dz*Math.cos(yaw))*speed/norm,p=sheep.position;
 let move=(dx||dz)&&clock>=poseEnd&&sceneTime<0;
 if(move){
 if(!blocked(p.x+vx,p.z))p.x+=vx;
 if(!blocked(p.x,p.z+vz)&& (save.drank||p.z+vz>11))p.z+=vz;
 sheep.rotation.y=Math.atan2(-vx,-vz);
 }
 const sitting=pose==='sit'&&clock<poseEnd,drinking=pose==='drink'&&clock<poseEnd;
 sheep.scale.y=sitting?.72:1;head.rotation.x=drinking?-.7:0;
 legs.forEach((l,i)=>l.rotation.x=move?Math.sin(clock*12+i%2*Math.PI+(i>1?Math.PI:0))*.45:0);
 if(save.drank&&!drinking){jesus.scale.y=1;jesus.position.x=save.done?0:-.6;jesus.position.z=save.done?-16:-13}
 if(save.done)fishers.forEach((f,i)=>f.position.set((i-1.5)*.65,0,-14-i*.4));
 if(!save.chapterStep&&save.child&&!sitting){kid.position.x+=(p.x+.85-kid.position.x)*Math.min(1,dt*2);kid.position.z+=(p.z+.85-kid.position.z)*Math.min(1,dt*2)}
 if(!save.chapterStep&&save.drank&&!sellerSeen&&distance(-5,4)<2.2){sellerSeen=true;seller.rotation.y=.7;seller.position.x-=.8;caption('생선 장수가 웃으며 길을 비켜 준다.')}
 if(save.drank&&!save.done&&sceneTime<0&&p.z< -13.4){sceneTime=0;listen=false;caption('호숫가에서 예수님이 시몬과 안드레를 부르신다.',4)}
 if(sceneTime>=0){
 let before=sceneTime;sceneTime+=dt;
 if(before<4&&sceneTime>=4)caption('조금 더 가시다가 야고보와 요한도 부르신다.',4);
 fishers.forEach((f,i)=>{if(sceneTime>(i<2?1:5))f.position.lerp(new T.Vector3((i-1.5)*.65,0,-14-i*.4),dt*.8)});
 if(sceneTime>8){save.done=true;sceneTime=-1;checkpoint();caption('그들은 그물을 두고 예수님을 따랐다.　막 1:16–20',5)}
 }
 if(clock>sayUntil)by('caption').textContent='';
 let direction=listen?soundscape():0;ears.forEach((ear,i)=>ear.rotation.z=listen?(i?1:-1)*(.6+.2*Math.cos(direction)):0);
 by('place').textContent=p.z< -10?'갈릴리 호숫가':p.z<1?'아이의 골목':'가버나움 장터';
 by('hint').textContent=save.done?'E · 시몬의 집으로 동행하기':sceneTime>=0?'부두에서 바라보기':!save.drank?(distance(.35,13.6)<2.5?'E · 손에 담긴 물 마시기':'천막 밖 물소리로 다가가기'):!save.child&&distance(5,-4)<2.5?'E · 아이 곁에 앉기':'귀를 세워 호숫가로 가기';
 if(save.chapterStep)updateChapter(dt);
 const focus=new T.Vector3(p.x,p.y+.85,p.z);
 const viewYaw=sceneTime>=0?0:yaw;
 let target=focus.clone();
 for(let r=.2;r<=3.8;r+=.2){let x=p.x-Math.sin(viewYaw)*r,z=p.z+Math.cos(viewYaw)*r;if(!save.chapterStep&&walls.some(([cx,cz,w,d])=>Math.abs(x-cx)<w+.12&&Math.abs(z-cz)<d+.12))break;target.set(x,p.y+1.35+r*.19,z)}
 camera.position.lerp(target,camReady?1-Math.exp(-dt*12):1);camReady=true;camera.lookAt(p.x+Math.sin(viewYaw)*1.5,p.y+.78,p.z-Math.cos(viewYaw)*1.5);
 if(save.chapterStep)chapterCamera();
 renderer.render(scene,camera);
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
onresize=resize;resize();requestAnimationFrame(loop);
