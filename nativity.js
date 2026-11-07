// Luke 2:1–20. Field and village share one walkable path.
// Only the prologue loads this set. Chapter saves keep their original scene and camera.
const nativitySteps={
 watchFlock:[-.65,3.3,'step','양 떼의 방울 소리','들판의 등불 곁으로 가기','목자들과 밤을 지키기'],
 goodNews:[-.65,3.3,'call','들판 위에 울리는 소식','천사의 소식 듣기',''],
 toVillage:[1.6,-7.1,'step','베들레헴으로 향하는 발걸음','다른 목자들과 함께 등불을 따라 마을로 걷기','열린 문 너머 살펴보기'],
 toManger:[.45,-15.25,'cry','구유 곁의 작은 숨소리','마리아와 요셉 곁으로 다가가기','구유 곁에 머물기'],
 newborn:[.45,-15.25,'cry','아기의 숨소리','목자들의 자리에서 아기 예수님 바라보기',''],
 holdMemory:[.45,-15.25,'call','조용히 전하는 목자들의 말','구유 곁에서 들판의 소식을 기억하기','아기의 손 바라보기'],
 acrossYears:[.45,-15.25,'water','손에 고인 물소리','아기의 손에서 갈릴리의 아침으로','']
};
const nativityWalking=new Set(['watchFlock','toVillage','toManger','holdMemory']);
function nativityCanWalk(){return nativityWalking.has(save.prologue)}
function nativityCues(){return [nativitySteps[save.prologue].slice(0,4)]}
function nativityBlocked(x,z){
 const step=save.prologue;
 if(Math.abs(x)>4.25||z>9||z< -16.3)return true;
 if(step==='watchFlock'&&z<.8||step==='toVillage'&&z< -8.8)return true;
 return z< -14&&Math.abs(x-.45)<1.15&&z< -15.7;
}

function buildNativity(){
 const field=new T.Group();scene.add(field);
 const surface=(x,y,z,w,h,d,c)=>cube(field,c,x,y,z,w,h,d);
 surface(0,-.35,-5,74,.68,86,0x73795d);
 for(let i=0;i<15;i++){
  const z=9-i*2.05;
  surface(Math.sin(z*.21)*.8,-.035,z,3.7,.065,2.2,0xb8a481).rotation.y=.05*Math.cos(i);
 }
 for(let i=0;i<24;i++){
  const x=Math.cos(i*2.4)*31,z=-32+Math.sin(i*3.2)*5;
  oval(field,0x586659,x,0,z,6,1.8+i%4,4.5);
 }
 for(let i=0;i<45;i++){
  const x=(i%2?1:-1)*(3.4+(i%7)*.68),z=10-i*.58;
  oval(field,i%3?0x667654:0x898471,x,.13,z,.3+i%3*.14,.22,.38);
 }

 // A fine field of stars, with no guiding star over the village.
 const stars=new Float32Array(260*3),starSeeds=new Float32Array(260);
 for(let i=0;i<260;i++){
  const a=i*2.39996,e=.035+(i%53)/53*1.49;
  stars.set([Math.cos(a)*46*Math.cos(e),46*Math.sin(e),Math.sin(a)*46*Math.cos(e)-6],i*3);
  starSeeds[i]=(i*.61803398875)%1;
 }
 const skyGeometry=new T.BufferGeometry();
 skyGeometry.setAttribute('position',new T.BufferAttribute(stars,3));
 skyGeometry.setAttribute('seed',new T.BufferAttribute(starSeeds,1));
 const starlight=new T.Points(skyGeometry,new T.ShaderMaterial({
  transparent:true,depthWrite:false,
  uniforms:{time:{value:0},pixelRatio:{value:renderer.getPixelRatio()}},
  vertexShader:`
   attribute float seed;uniform float time;uniform float pixelRatio;varying float glow;
   void main(){
    glow=.72+.13*sin(time*(.35+seed*.3)+seed*28.);
    gl_PointSize=(2.2+seed*2.2)*pixelRatio;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
   }`,
  fragmentShader:`
   varying float glow;
   void main(){
    vec2 p=gl_PointCoord-.5;float halo=exp(-dot(p,p)*21.);
    gl_FragColor=vec4(1.,.91,.74,halo*glow);
    #include <colorspace_fragment>
   }`
 }));
 starlight.name='nativity-stars';field.add(starlight);

 const lampMaterial=new T.MeshBasicMaterial({color:0xffcf79});
 function lantern(x,z,height){
  surface(x,height/2,z,.09,height,.09,wood);
  const lens=oval(field,0xffcc82,x,height+.08,z,.12,.17,.12);
  lens.material=lampMaterial;
  surface(x,height+.27,z,.28,.06,.23,wood);
 }
 for(let i=0;i<7;i++)lantern(i%2?2.8:-2.25,3.5-i*3.05,.85);
 const flame=oval(field,0xffbe61,-1.45,.38,2.3,.19,.37,.19);
 flame.material=lampMaterial;
 for(let i=0;i<8;i++)oval(field,0x79756b,-1.45+.4*Math.cos(i*.79),.09,2.3+.4*Math.sin(i*.79),.15,.11,.16);
 const firelight=new T.PointLight(0xffba68,9,8);firelight.position.set(-1.45,1,2.3);field.add(firelight);
 const flock=[];
 for(let i=0;i<6;i++){
  const animal=sheep.clone();field.add(animal);
  animal.scale.setScalar(.7+(i%3)*.08);animal.position.set((i%2?1:-1)*(2.9+i%3*.5),0,4-i*.93);
  animal.rotation.y=.7*i;flock.push(animal);
 }
 function herder(x,z,color){
  const figure=actor(field,x,z,color);
  bindPersonAccessory(figure,cube(figure,wood,.38,.98,.13,.055,1.95,.055),'left');
  bindPersonAccessory(figure,oval(figure,0xbba78c,0,1.74,0,.28,.15,.26),'head');
  return figure;
 }
 const player=herder(0,8,0x8b7761);
 const companions=[herder(-1.7,1.25,0x738079),herder(1.4,2,0x9a775f)];
 const messenger=actor(field,-1.3,-1.6,linen,1,'angel');
 const halo=new T.PointLight(0xffe4ac,0,13);halo.position.set(-1.3,3,-1.6);field.add(halo);
 const choir=[];
 for(let i=0;i<7;i++){
  const a=actor(field,-6.2+i*1.8,-7-Math.cos(i)*1.4,0xf0dbba,.74,'angel');
  a.position.y=3.3+Math.sin(i*.6)*.8;choir.push(a);
 }
 for(let i=0;i<6;i++){
  const x=(i%2?1:-1)*(6.7+i%3*.55),z=-6-i*2.5;
  surface(x,1.4,z,3.4,2.8,3.5,0xbea17f);
  surface(x,2.86,z,3.75,.18,3.8,0xd1bb94);
  surface(x-Math.sign(x)*1.72,1.3,z,.03,.57,.54,0xefbe76);
 }
 surface(.4,1.65,-19.15,7.8,3.3,.32,0xc4a886);
 for(const x of [-3.3,4.1]){
  surface(x,1.62,-17.3,.23,3.24,.22,wood);
  surface(x,1.62,-19,.24,3.24,.22,wood);
 }
 surface(.4,3.27,-18.1,7.8,.21,2.25,0x8b704f);
 const mary=actor(field,-.85,-17.55,0x839ba2);mary.scale.y=.78;
 actor(field,1.8,-17.8,0x8f8267);
 const manger=new T.Group();field.add(manger);manger.position.set(.45,0,-16.8);
 for(let x of [-.69,.69])for(let z of [-.31,.31])cube(manger,wood,x,.24,z,.12,.5,.13);
 cube(manger,0x9a7050,0,.47,0,1.65,.19,.79);
 for(let z of [-.39,.39])cube(manger,0xb78a58,0,.59,z,1.77,.23,.085);
 for(let i=0;i<17;i++)cube(manger,0xd7b676,-.75+i*.092,.6,Math.sin(i)*.14,.07,.06,.52).rotation.y=Math.cos(i)*.23;
 const swaddle=oval(manger,0xf4dfb7,-.1,.72,0,.48,.2,.24);
 oval(manger,0xc4926e,.41,.76,.015,.18,.16,.16);
 // Sleeping eyelids and a folded linen edge, seen from the shepherd's side of the manger.
 function stitch(points,radius,color){
  const arc=new T.QuadraticBezierCurve3(...points.map(([x,y,z])=>new T.Vector3(x,y,z)));
  part(manger,new T.TubeGeometry(arc,8,radius,5,false),color,0,0,0,1,1,1);
 }
 for(const x of [.347,.458])stitch([[x-.031,.806,.157],[x,.792,.174],[x+.025,.804,.164]],.006,0x785849);
 oval(manger,0xd5a27d,.41,.775,.167,.026,.022,.021);
 stitch([[-.31,.877,.016],[-.12,.905,.125],[.12,.789,.207]],.017,0xe0c59c);
 stitch([[-.11,.908,-.007],[.055,.896,.107],[.19,.795,.17]],.011,0xffebc9);
 const tinyHand=oval(manger,0xd5a27d,.24,.82,.19,.075,.055,.065);
 for(let i=0;i<3;i++)oval(manger,0xd5a27d,.224+i*.029,.844,.213,.018,.032,.024);
 const cradleLight=new T.PointLight(0xffc383,10,8);cradleLight.position.set(.1,2,-16.35);field.add(cradleLight);
 return {field,player,companions,messenger,halo,choir,flock,flame,swaddle,tinyHand,starlight,firelight,cradleLight};
}

let nativitySet=null,nativityTime=0,lastNativityLine=-1;
const marketSky=scene.background.clone(),marketFog=scene.fog.color.clone(),marketDensity=scene.fog.density;
const marketSunPower=sun.intensity;
const skyLight=scene.children.find(light=>light.isHemisphereLight);
const daylightSky=skyLight.color.clone(),daylightGround=skyLight.groundColor.clone();
const daylightPower=skyLight.intensity;
const originalKeys=by('keys').textContent;
function showMarketSet(show){
 firstSet.forEach(o=>o.visible=show);sheep.visible=show;nativitySet.field.visible=!show;
 scene.background.set(show?marketSky:0x283b51);scene.fog.color.set(show?marketFog:0x425166);
 scene.fog.density=show?marketDensity:.018;sun.intensity=show?marketSunPower:.49;
 skyLight.color.set(show?daylightSky:0xafc6e1);skyLight.groundColor.set(show?daylightGround:0x80796e);skyLight.intensity=show?daylightPower:1.15;
}
function startNativity(){
 nativitySet=buildNativity();showMarketSet(false);
 document.querySelector('header small').textContent='베들레헴 · 탄생 서막';
 by('keys').textContent='WASD 이동　Shift 달리기　드래그 / ← → 둘러보기　Q 귀 기울이기　E 행동';
 checkpoint();
}
function nextNativity(step){
 save.prologue=step;nativityTime=0;lastNativityLine=-1;listen=false;checkpoint();
}
function nativityAction(){
 const s=save.prologue,target=nativitySteps[s];
 if(!target[5]||distance(target[0],target[1])>1.55)return;
 if(s==='watchFlock')nextNativity('goodNews');
 if(s==='toVillage'){nextNativity('toManger');caption('마을에 들어선 목자들 앞에 불빛이 비치는 자리가 보인다.',5)}
 if(s==='toManger')nextNativity('newborn');
 if(s==='holdMemory')nextNativity('acrossYears');
}
const nativityWords={
 goodNews:[
  [0,'들판에 주님의 영광이 비치자 목자들이 두려워한다. 천사가 두려워하지 말라며 큰 기쁨의 소식을 전한다.'],
  [5,'오늘 다윗의 동네에 구주 곧 그리스도 주께서 나셨다. 강보에 싸여 구유에 누운 아기가 그 표징이다.'],
  [11,'많은 천군이 하나님을 찬양한다. 하늘에는 영광이, 땅에는 하나님이 기뻐하시는 사람들 가운데 평화가.　눅 2:8–14']
 ],
 newborn:[
  [0,'목자들이 마리아와 요셉, 그리고 구유에 누운 아기를 만난다. 천사가 말한 그대로다.　눅 2:15–16'],
  [5,'목자들은 이 아기에 관해 들은 말을 전한다. 마리아는 그 모든 말을 마음에 간직한다.　눅 2:17–19'],
  [10,'목자들은 듣고 본 일로 하나님께 영광을 돌리고 찬양한다.　눅 2:20']
 ]
};
function restoreMainJournal(){history.replaceState(null,'',location.pathname+location.search);location.reload()}
function finishNativity(){
 startSceneDissolve();
 renderer.domElement.style.opacity='';
 if(prologuePreview){restoreMainJournal();return}
 showMarketSet(true);delete save.prologue;save.nativitySeen=true;
 sheep.position.set(0,0,17);sheep.rotation.y=0;keys.clear();yaw=0;listen=false;camReady=false;
 document.querySelector('header small').textContent='갈릴리 · 제1장';by('keys').textContent=originalKeys;
 caption('여러 해가 흐른 뒤, 갈릴리. 천막 밖에서 물방울 소리가 들린다.',6);
 checkpoint();
}
const introTarget=new T.Vector3(),introEye=new T.Vector3();
function updateNativity(dt,moving){
 const s=save.prologue,b=nativitySteps[s],p=sheep.position;
 const {player,companions,messenger,halo,choir,flock,flame,swaddle,tinyHand}=nativitySet;
 nativityTime+=dt;const t=nativityTime;
 player.visible=s!=='newborn'&&s!=='acrossYears';player.position.copy(p);
 player.rotation.y=softTurn(player.rotation.y,sheep.rotation.y+Math.PI,dt,11);
 player.position.y=moving?.035*Math.abs(Math.sin(clock*8)):0;
 const inField=s==='watchFlock'||s==='goodNews';
 by('place').textContent=inField?'밤에 양을 지키던 목자들':s==='toVillage'?'베들레헴으로 가는 길':'구유 곁 · 베들레헴';
 by('hint').textContent=b[5]&&distance(b[0],b[1])<=1.55?'E · '+b[5]:b[4];
 flame.scale.y=.35+.04*Math.sin(clock*7);
 flock.forEach((a,i)=>a.rotation.y=i*.7+Math.sin(clock*.65+i)*.12);
 if(!inField){
  const progress=T.MathUtils.clamp((3.3-p.z)/18.55,0,1);
  companions.forEach((a,i)=>{a.position.set((i?1.45+1.4*progress:-1.6-progress)+Math.sin(progress*5)*.28,0,1.4+i*.62-progress*17.3);a.rotation.y=Math.PI});
 }
 messenger.visible=s==='goodNews';messenger.position.y=1.85+Math.sin(clock)*.07;
 halo.intensity=messenger.visible?17:0;
 choir.forEach(a=>a.visible=s==='goodNews'&&t>=11);
 const lineIndex=(nativityWords[s]||[]).findLastIndex(([at])=>t>=at);
 if(lineIndex>=0&&lineIndex!==lastNativityLine){
  lastNativityLine=lineIndex;caption(nativityWords[s][lineIndex][1],6);if(s==='goodNews')ping('call',-.12,.045)
 }
 if(clock>sayUntil&&by('caption').textContent)by('caption').textContent='';
 if(listen&&nativityCanWalk())soundscape();else setDirectionCue('');
 introEye.set(p.x-Math.sin(yaw)*2.85,2.18,p.z+Math.cos(yaw)*2.85);
 introTarget.set(p.x+Math.sin(yaw)*2,1.18,p.z-Math.cos(yaw)*2);
 if(s==='goodNews'){
  introEye.set(-.9,1.8,5.3);introTarget.set(-1.1,t>=11?3.1:2.7,-2);
 }else if(s==='newborn'){
  introEye.set(.85,1.52,-14.96);introTarget.set(.4,.68,-16.85);
 }else if(s==='acrossYears'){
  const market=t>=3;
  if(nativitySet.field.visible===market)showMarketSet(market);
  renderer.domElement.style.opacity=String(T.MathUtils.clamp(Math.abs(t-3)/.48,0,1));
  if(market){
   marketWaterTarget(introTarget);introEye.copy(introTarget);
   introEye.x+=.37;introEye.y+=.33;introEye.z+=.56;
   by('place').textContent='여러 해가 흐른 뒤 · 갈릴리';
  }else{
   introEye.set(1.04,1.06,-16.13);introTarget.set(.69,.81,-16.61);
  }
  // Match the infant's outstretched hand to the water held in the adult Jesus's hands.
  if(lastNativityLine!==-2&&market){caption('그 손이 자라, 갈릴리 장터에서 작은 양에게 물을 내민다.',4)}
  if(market)lastNativityLine=-2;
 }
 swaddle.scale.y=.20+Math.sin(clock*2)*.005;tinyHand.rotation.z=Math.sin(clock)*.08;
 // Cut only at the fully faded midpoint of the hand-to-hand match.
 settleStoryCamera(introEye,introTarget,dt,58,s==='acrossYears'&&t-dt<3&&t>=3);
 if(s==='goodNews'&&t>=18){nextNativity('toVillage');caption('목자들은 들은 일을 보러 베들레헴으로 서둘러 간다.',6)}
 if(s==='newborn'&&t>=15)nextNativity('holdMemory');
 if(s==='acrossYears'&&t>=6.4)finishNativity();
}
function appendNativityRecord(){
 const replay=by('nativityReplay');replay.hidden=!!save.prologue||Boolean(chapterReplay);
 if(prologuePreview){by('restart').hidden=true;replay.hidden=false;replay.textContent='원래 여정으로 돌아가기'}
 if(save.nativitySeen||save.prologue==='holdMemory'||save.prologue==='acrossYears'){
  const p=document.createElement('p');p.textContent='탄생 서막 · 목자들이 천사의 소식을 듣고 베들레헴으로 가서 구유에 누운 아기 예수님을 만났다(누가복음 2:1–20).';
  by('memory').prepend(p);
 }
}
by('nativityReplay').onclick=()=>{
 renderer.domElement.style.opacity='';
 if(prologuePreview){restoreMainJournal();return}
 history.replaceState(null,'',location.pathname+location.search+'#nativity-preview');location.reload();
};
if(save.prologue)startNativity();
