// A checkpoint names the next playable beat. Timed scenes restart at their beginning.
const firstSet=scene.children.filter(object=>!object.isLight&&object!==sheep);
const courtyard=new T.Group(), roofSet=new T.Group();
scene.add(courtyard,roofSet);
function actor(set,x,z,color,size=1){const figure=human(x,z,color,size);set.add(figure);return figure}
function room(set){
 cube(set,0xd9b98b,0,-.22,0,34,.4,30);
 cube(set,0xcb9e73,0,1.6,-6,13,3.2,.35);
 for(let i=-5;i<=5;i+=2){
  cube(set,wood,i,2.95,-5.8,.18,.18,.65);
  oval(set,clay,i,.39,-5.35,.31,.45,.31);
 }
 for(let x of [-10,10]){
  cube(set,0xcda981,x,1.6,0,4,3.2,14);
  cube(set,linen,x,3.23,0,4.4,.15,14.3);
 }
}
room(courtyard);room(roofSet);
const mother=actor(courtyard,-1.4,-2.6,0x95666b),healer=actor(courtyard,-.9,-3.35,linen);
cube(courtyard,wood,-1.4,.24,-2.6,2,.45,1);
const bearer=actor(courtyard,0,-.5,0x648279);
oval(bearer,clay,.34,1,.2,.22,.31,.22);
cube(courtyard,wood,-3,.55,-4.6,2.2,.14,1);
for(let x of [-3.8,-2.2])cube(courtyard,wood,x,.25,-4.6,.12,.5,.65);
for(let j=0;j<3;j++)oval(courtyard,0xb88748,-3.6+j*.6,.7,-4.6,.2,.09,.16);
for(let x of [-1.6,1.6])cube(courtyard,wood,x,1.35,5,.12,2.7,.13);
for(let i=0;i<7;i++)cube(courtyard,i%2?linen:0xb96549,-1.5+i*.5,2.65,5,.51,.1,2.4);
const guests=[actor(courtyard,-3.8,-3.6,0x738a86),actor(courtyard,-2.6,-5,0xb67d55)];
const neighbors=[actor(courtyard,-2.2,4.8,0xa18a5e),actor(courtyard,2.3,4.3,0x647f7a),actor(courtyard,2.9,5.7,0xa66e58)];
const roofY=3, roofColor=0xae895f;
for(let i=0;i<12;i++){let h=(i+1)*.25;cube(roofSet,0xcba87e,3.4,h/2,2.75-i*.5,1.8,h,.51)}
cube(roofSet,roofColor,0,2.88,-4.95,5.2,.24,1.9);
cube(roofSet,roofColor,0,2.88,-1.95,5.2,.24,1.1);
for(let x of [-1.95,1.95])cube(roofSet,roofColor,x,2.88,-3.25,1.3,.24,1.55);
for(let x of [-2.5,2.5])cube(roofSet,wood,x,1.4,-1.5,.16,2.8,.16);
const patch=cube(roofSet,0xc7a275,0,2.92,-3.25,2.6,.18,1.55);
const teachers=actor(roofSet,-1.7,-3.8,linen);
const crowd=[];
for(let i=0;i<10;i++)crowd.push(actor(roofSet,-2.35+(i%5)*.93,-.55+Math.floor(i/5)*.85,[0x748a75,0xab8466,0x987779][i%3],.91+i%2*.09));
const friends=[];
for(let i=0;i<4;i++)friends.push(actor(roofSet,(i%2?1:-1)*1.45,-3.35+(i<2?-.9:.9),[0x927655,0x77887b,0xb58163,0x737c91][i]));
const patient=actor(roofSet,0,-3.25,0xa57763,.87);
const mat=cube(roofSet,0xca9959,0,roofY+.13,-3.25,1.95,.13,.91);
const ropes=[],dust=[];
for(let i=0;i<4;i++)ropes.push(cube(roofSet,wood,(i%2?1:-1)*.86,3.6,-3.25+(i<2?-.38:.38),.032,1,.032));
for(let i=0;i<14;i++)dust.push(oval(roofSet,0xd2b18a,Math.sin(i)*1.1,2,-3.25+Math.cos(i)*.45,.04,.04,.04));
const beats={
 bedside:[-1,-1.8,'call','침상 곁의 목소리','침상 곁으로 다가가기','예수님 곁에 머물기'],
 recovery:[-1,-2,'call','일어서는 발소리','시몬의 장모가 일어나는 모습을 바라보기'],
 aside:[-2.8,.6,'water','물동이 소리','물동이를 든 사람이 지나가도록 왼쪽으로 비켜서기'],
 evening:[0,5,'step','천막이 바람에 스치는 소리','저녁 천막 아래로 돌아가기','천막을 지나 1장 마치기'],
 doorway:[0,1.7,'step','문 앞에 모인 사람들','사람들이 모인 집의 문간으로 가기','문간에서 귀 기울이기'],
 stairs:[3.4,-2.65,'step','지붕에서 들리는 발걸음','오른쪽 바깥 계단을 직접 올라가기','지붕을 바라보기'],
 lowering:[0,-3.25,'step','밧줄이 풀리는 소리','네 사람이 침상을 내리는 모습을 바라보기'],
 below:[3.4,3.2,'step','아래층에서 들리는 목소리','왔던 계단을 따라 아래로 내려가기'],
 witness:[1.9,1.65,'call','예수님의 목소리','문 앞 빈자리로 다가가기','집 안을 바라보기'],
 healing:[0,-3.25,'call','자리에서 일어나는 소리','그가 자리를 들고 걸어 나오는 모습을 바라보기'],
 end:[0,1,'step','골목으로 향하는 발소리','2장 · 지붕에서 내려온 자리','레위가 있는 세관으로']
};
const inCourt=()=>['bedside','recovery','aside','evening'].includes(save.chapterStep);
let beatTime=0;
function enterBeat(step,spawn){
 if(chapterReplay&&chapterForStep(step)!==chapterReplay.chapter){restoreMainJournal();return}
 save.chapterStep=step;beatTime=0;
 if(spawn){sheep.position.set(...spawn);yaw=0;camReady=false}
 checkpoint();syncChapter();
}
function syncChapter(){
 const later=syncLater();
 const active=later||!!beats[save.chapterStep];
 firstSet.forEach(o=>o.visible=!active);courtyard.visible=active&&inCourt();roofSet.visible=active&&!inCourt()&&!later;
 if(later)return;
 if(active){
 scene.background.set(inCourt()?0xf0d2a6:0xc6d8cb);
 document.querySelector('header small').textContent=inCourt()?'가버나움 · 제1장':'가버나움 · 제2장';
 }
}
function chapterCue(){return (laterBeats[save.chapterStep]||beats[save.chapterStep]).slice(0,4)}
function chapterAction(){
 const s=save.chapterStep;
 if(!s){enterBeat('bedside',[0,0,6.7]);caption('부두를 떠나 시몬과 안드레의 집에 도착했다.');return}
 const b=beats[s];
 if(s==='end'){enterBeat('levi',[0,0,6]);caption('호숫가 세관에 레위가 앉아 있다.');return}
 if(laterBeats[s]){laterAction();return}
 if(distance(b[0],b[1])>1.65)return;
 if(s==='bedside'){enterBeat('recovery');caption('예수님이 열병으로 누운 시몬의 장모에게 다가가 손을 잡으신다.',4)}
 if(s==='evening'){enterBeat('doorway',[0,0,7]);caption('제1장 끝　·　며칠 뒤, 다시 가버나움. 네 사람이 한 사람을 침상에 누인 채 데려왔다.',6)}
 if(s==='doorway'){enterBeat('stairs');caption('문까지 사람이 가득하다. 오른편에는 지붕으로 이어지는 돌계단이 있다.',4)}
 if(s==='stairs'&&sheep.position.y>2.25){enterBeat('lowering');caption('네 사람이 지붕을 열고 침상에 맨 줄을 조금씩 늦춘다.',5)}
 if(s==='witness'){enterBeat('healing');caption('예수님이 그의 죄가 용서되었다고 말씀하신다. 서기관들이 마음속으로 의문을 품는다.',5)}
}
function chapterBlocked(x,z){
 if(laterBeats[save.chapterStep])return laterBlocked(x,z);
 if(Math.abs(x)>6.8||z>8||z< -5.45)return true;
 if(inCourt())return x> -2.6&&x<-.5&&z< -2.2&&z> -3.2;
 // Access the roof only through the foot of the stairs. Keep the sheep off the open shaft.
 if(z<3&&z> -4.3&&x>=2.5&&x<=4.3){
  return sheep.position.z<3&& (sheep.position.x<2.5||sheep.position.x>4.3)&&z<2.5;
 }
 if(sheep.position.y>.38)return true;
 return z<.95&&x<2.5&&x> -2.8;
}
function updateChapter(dt){
 const s=save.chapterStep,b=beats[s],p=sheep.position;beatTime+=dt;
 if(laterBeats[s]){updateLater(dt);return}
 p.y=!inCourt()&&p.x>=2.5&&p.x<=4.3?T.MathUtils.clamp((3-p.z)*.5,0,3):0;
 by('place').textContent=inCourt()?'시몬의 집 · 안뜰':'지붕이 열린 집';
 by('hint').textContent=b[5]&&(s==='end'||distance(b[0],b[1])<1.65)?'E · '+b[5]:b[4];
 if(inCourt()){
 neighbors.forEach(n=>n.visible=s==='evening');
 if(s==='evening')scene.background.set(0xe8b596);
 const recovery=s==='bedside'?0:s==='recovery'?Math.min(1,beatTime/3):1;
 mother.rotation.z=(1-recovery)*Math.PI/2;mother.position.set(-1.15-recovery*.7,.52*(1-recovery),-2.6-recovery*1.3);
 healer.rotation.z=.18*(1-recovery);
 bearer.position.z=s==='evening'?Math.max(-4,.5-beatTime*1.6):.5;
 if(s==='recovery'&&beatTime>4){enterBeat('aside');caption('열이 떠나자 그가 일어나 사람들을 대접한다.　막 1:29–31',5)}
 if(s==='aside'&&distance(-2.8,.6)<1.6){enterBeat('evening');caption('보리가 비켜 준 문턱으로 물동이가 지나간다. 해 질 무렵, 사람들이 집 앞에 모인다.　막 1:32–34',6)}
 return;
 }
 friends.forEach(f=>f.position.y=3);
 const early=['doorway','stairs'].includes(s), lowered=early?0:s==='lowering'?T.MathUtils.clamp((beatTime-1)/4,0,1):1;
 patch.visible=early; mat.position.y=3.12-lowered*3;
 const stand=s==='end'?1:s==='healing'?T.MathUtils.clamp((beatTime-5)/2,0,1):0;
 const walk=s==='end'?1:s==='healing'?T.MathUtils.clamp((beatTime-7)/3,0,1):0;
 patient.position.set(.6*(1-stand),mat.position.y+.16,-3.25+walk*5);patient.rotation.z=(1-stand)*Math.PI/2;
 mat.rotation.z=stand*1.25;mat.position.z=patient.position.z;mat.position.x=stand*.52;
 if(stand){patient.position.y=0;mat.position.y=.13+stand*.6}
 crowd.forEach((f,i)=>f.position.x=-2.35+(i%5)*.93+(i%5<3?-1:1)*walk*1.2);
 ropes.forEach(r=>{r.visible=s==='lowering';r.scale.y=3.95-mat.position.y;r.position.y=(3.95+mat.position.y)/2});
 dust.forEach((d,i)=>{d.visible=s==='lowering';d.position.y=3-((beatTime+i*.17)%1.4)*1.85});
 if(s==='lowering'&&beatTime>6){enterBeat('below');caption('침상이 닿았다. 아래층에서 사람들의 말소리가 잦아든다.')}
 if(s==='below'&&p.z>=2.9&&p.y<.1){enterBeat('witness');caption('문 앞 오른쪽에서 집 안이 보인다.')}
 if(s==='healing'&&beatTime-dt<5&&beatTime>=5)caption('예수님이 일어나 자리를 들고 집으로 가라고 말씀하신다.',4);
 if(s==='healing'&&beatTime>10.5){enterBeat('end');caption('그는 모두가 보는 앞에서 자리를 들고 걸어 나갔다.　막 2:1–12',6)}
}
function chapterCamera(){
 if(save.chapterStep==='twoCoins'){camera.position.set(-1.45,1.6,.8);camera.lookAt(-2.88,1,-1.2)}
 if(save.chapterStep==='anoint'){camera.position.set(-1.25,.82,.65);camera.lookAt(.32,.37,-1.22)}
 const s=save.chapterStep;
 if(s==='lowering'){camera.position.set(5.4,8,-.1);camera.lookAt(0,1.8,-3.25)}
 if(s==='healing'){camera.position.set(1.3,1.95,.92);camera.lookAt(0,1,-3)}
 if(s==='recovery'){camera.position.set(.9,1.75,-.5);camera.lookAt(-1.5,.9,-3)}
}
function appendChapterRecord(){
 if(!save.chapterStep)return;
 const refs=by('memory').querySelector('p');
 if(!refs)return;
 if(!['bedside','recovery'].includes(save.chapterStep))refs.append(' 시몬의 장모가 열병에서 일어나 사람들을 대접했다(막 1:29–31).');
 if(!inCourt())refs.append(' 해가 지자 사람들이 집 앞으로 모였다(막 1:32–34).');
 if(save.chapterStep==='end'||laterBeats[save.chapterStep])refs.append(' 네 사람이 지붕을 열어 중풍병자를 예수님 앞에 내렸다. 그는 예수님의 말씀을 듣고 자기 자리를 들고 걸어 나갔다(막 2:1–12).');
 appendLaterRecord(refs);
 if(!inCourt())by('memory').lastElementChild.append(' 그날 저녁, 보리는 물동이가 지나도록 비켜 주고 천막 아래를 제 발로 걸었다.');
}
