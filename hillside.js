// Each landscape has its own walking surface and cast. The shore is reused after the parable.
const laterSets={};
for(const name of ['meal','hill','shore','field']){
 const set=new T.Group();scene.add(set);laterSets[name]=set;
}
const {meal,hill,shore,field}=laterSets;
room(meal);
const levy=actor(meal,-2.7,1.2,0x728589);
const caller=actor(meal,-1.1,1,linen);
cube(meal,wood,-3,.65,2,1.8,.16,.8);
for(let i=0;i<5;i++)oval(meal,0xc4a154,-3+i*.15,.76,2,.07,.025,.07);
cube(meal,wood,0,.7,-3.2,4,.19,1.5);
for(let x of [-1.7,1.7])cube(meal,wood,x,.35,-3.2,.16,.7,1);
for(let i=0;i<5;i++){
 oval(meal,0xb87b45,-1.6+i*.75,.87,-3.3,.23,.1,.16);
 actor(meal,-1.7+i*.84,-4.25,[0xae8066,0x748778,0xb39960][i%3]);
}
const merchant=actor(meal,2.7,-2.7,0xa46144);
const bowl=oval(meal,clay,2.5,.12,-1.8,.28,.15,.28);
const sip=oval(meal,water,2.5,.23,-1.8,.22,.025,.22);
function hillHeight(z){return (8-z)*.23}
const slope=cube(hill,0x9eaa73,0,hillHeight(0)-.25,0,32,.48,30);
slope.rotation.x=Math.atan(.23);
function hillsideActor(x,z,color,size){const a=actor(hill,x,z,color,size);a.position.y=hillHeight(z);return a}
hillsideActor(0,-6.1,linen,1.08);
const little=hillsideActor(4.5,3.7,0xc59a61,.73);
for(let i=0;i<13;i++){const x=(i%2?1:-1)*(2+i%4*.8),z=-4+(i%5)*1.15;hillsideActor(x,z,0x807f64+i*0x030202,.86)}
for(let i=0;i<54;i++){
 const x=Math.sin(i*3.31)*7,z=Math.cos(i*1.21)*6,y=hillHeight(z);
 cube(hill,0x708551,x,y+.14,z,.035,.31,.035);
 oval(hill,i%3?linen:0xcf9958,x,y+.32,z,.08,.045,.08);
}
cube(shore,0xd9bf94,0,-.21,4,36,.4,20);
cube(shore,water,0,-.27,-20,90,.4,30);
const skiff=buildStorySkiff(4.4,2.45);skiff.position.set(0,-.04,-6.9);shore.add(skiff);
actor(shore,0,-6.9,linen).position.y=.4;
for(let i=0;i<9;i++)cube(shore,0xb9d8c9,Math.sin(i*23)*7,.01,-8-i,1.4,.025,.09);
const soilColors=[0xbda77e,0x9c9989,0x938055,0x986641],fieldZ=[4,0,-4,-8];
for(let i=0;i<4;i++)cube(field,soilColors[i],0,-.21,fieldZ[i],16,.42,4.1);
const birds=[],wheat=[],shoots=[],kernels=[];
for(let i=0;i<12;i++){
 const x=Math.sin(i*5.2)*4,z=Math.cos(i*2.1)*1.1;
 kernels.push(oval(field,0xe2b65e,x,.08,4+z,.09,.07,.15));
 oval(field,0x928c79,x,.21,z,.45,.3,.37);
 shoots.push(cube(field,0xb29951,x,.31,z,.055,.57,.055));
 const thorn=cube(field,0x586844,x,.63,-4+z,.1,1.4,.1);
 thorn.rotation.z=(i%2?1:-1)*.42;
 cube(field,0x656846,x+.12,.68,-4+z,.65,.08,.08).rotation.z=.5;
}
for(let i=0;i<33;i++){
 const x=Math.sin(i*2.3)*4,z=-8+Math.cos(i*2.7)*1.3;
 const stem=new T.Group();stem.position.set(x,0,z);field.add(stem);
 cube(stem,0xa48944,0,.53,0,.038,1.06,.038);
 oval(stem,0xdcb553,0,1.04,0,.12,.25,.1);wheat.push(stem);
}
for(let i=0;i<3;i++){
 const bird=new T.Group();field.add(bird);
 for(const side of [-1,1])oval(bird,0x524b42,side*.17,.05,0,.23,.07,.14).rotation.z=side*.3;
 birds.push(bird);
}
const laterBeats={
 levi:[-2.3,2.8,'step','세관의 동전 소리','세관 앞의 레위에게 다가가기','예수님의 부르심 듣기','meal'],
 supper:[0,-1.7,'call','식탁에서 나누는 말','레위를 따라 식탁 앞으로 가기','식사 자리에 머물기','meal'],
 seat:[2.5,-1.8,'water','물그릇 놓는 소리','오른쪽 물그릇 또는 왼쪽 안뜰에서 쉴 자리 고르기','여기에 눕기','meal'],
 dusk:[0,4.7,'step','언덕길로 가는 발소리','안뜰을 지나 언덕길로 떠나기','2장을 마치고 언덕으로','meal'],
 climb:[0,-4.7,'call','언덕 위의 목소리','언덕 위로 가거나 오른쪽 아래 아이 곁에 머물기','팔복에 귀 기울이기','hill'],
 flowers:[-3,0,'step','들꽃 사이의 바람','왼편 비탈의 들꽃으로 내려가기','들의 꽃에 관한 가르침 듣기','hill'],
 lake:[0,5.8,'water','호숫가의 물결','언덕 아래로 내려가기','호숫가로 가기','hill'],
 boatTalk:[0,-3.8,'water','배 옆의 물소리','물가의 배를 향해 걷기','예수님이 들려주시는 비유 듣기','shore'],
 pathSeed:[0,4,'step','새의 날갯소리','길가에 떨어진 씨로 다가가기','길가의 씨 살펴보기','field'],
 stoneSeed:[0,0,'step','돌 사이의 마른 싹','돌밭으로 걸어가기','얕은 흙 살펴보기','field'],
 thornSeed:[0,-4,'step','가시덤불 스치는 소리','가시덤불 사이로 들어가기','가시 사이의 싹 살펴보기','field'],
 harvest:[0,-8,'step','이삭 스치는 소리','좋은 땅의 이삭으로 가기','열매 맺은 이삭 바라보기','field'],
 returnLake:[0,-8,'water','멀리 들리는 물소리','비유 속 들판 · 호숫가의 물소리 듣기','호숫가로 돌아가기','field'],
 hillEnd:[0,-3.8,'call','배에서 들려오는 목소리','3장 끝 · 호숫가의 배로 가기','배에 올라 건너편으로','shore']
};
function syncLater(){
 const b=laterBeats[save.chapterStep];
 for(const [key,set] of Object.entries(laterSets))set.visible=b?.[6]===key;
 document.body.classList.toggle('parable',b?.[6]==='field');
 if(!b)return false;
 if(isEighth())return syncEighth(b);
 if(isSeventh())return syncSeventh(b);
 if(isSixth())return syncSixth(b);
 if(isFifth())return syncFifth(b);
 if(isFourth())return syncFourth(b);
 const area=b[6];
 scene.background.set({meal:0xedc69e,hill:0xc3d9bf,shore:0xb7d8d5,field:0xe3ce99}[area]);
 document.querySelector('header small').textContent=area==='meal'?'가버나움 · 제2장':area==='field'?'제3장 · 예수님이 들려주신 비유':'갈릴리 · 제3장';
 return true;
}
function chapterSounds(){
 if(isEighth())return eighthSounds();
 if(isSeventh())return seventhSounds();
 if(isSixth())return sixthSounds();
 if(isFifth())return fifthSounds();
 const cues=[chapterCue()];
 if(save.chapterStep==='climb'&&!save.hillChild)cues.push([4.5,3.7,'cry','아이의 훌쩍임']);
 if(save.chapterStep==='seat')cues.push([-3,-1.5,'step','안뜰로 가는 발걸음']);
 return cues;
}
function laterBlocked(x,z){
 const area=laterBeats[save.chapterStep][6];
 if(isEighth())return eighthBlocked(x,z);
 if(isSeventh())return seventhBlocked(x,z);
 if(isSixth())return sixthBlocked(x,z);
 if(isFifth())return fifthBlocked(x,z);
 if(isFourth())return fourthBlocked(x,z);
 if(area==='field')return Math.abs(x)>6||z>5.95||z< -9.95;
 if(Math.abs(x)>6.6||z>7.8||z<(area==='hill'?-7:-5.2))return true;
 return area==='meal'&&Math.abs(x)<2.2&&Math.abs(z+3.2)<.94;
}
function updateLater(dt){
 const s=save.chapterStep,b=laterBeats[s],p=sheep.position,area=b[6];
 if(isEighth()){updateEighth(dt);return}
 if(isSeventh()){updateSeventh(dt);return}
 if(isSixth()){updateSixth(dt);return}
 if(isFifth()){updateFifth(dt);return}
 if(isFourth()){updateFourth(dt);return}
 p.y=area==='hill'?hillHeight(p.z):0;
 const altSeat=s==='seat'&&distance(-3,-1.5)<1.65;
 const besideChild=s==='climb'&&!save.hillChild&&distance(4.5,3.7)<1.65;
 by('place').textContent={meal:'레위의 집 · 식탁과 안뜰',hill:'산 위 · 들꽃 핀 비탈',shore:'갈릴리 호숫가',field:'씨 뿌리는 사람의 비유'}[area];
 by('hint').textContent=besideChild?'E · 아이 곁에 앉기':altSeat||distance(b[0],b[1])<1.65?'E · '+b[5]:b[4];
 if(area==='meal'){
 const t=s==='levi'?0:s==='supper'?Math.min(beatTime/3,1):1;
 levy.position.set(-2.7+t*.4,0,1.2-t*4.9);caller.position.set(-1.1,0,1-t*5.1);
 const left=save.tableSeat==='court';bowl.position.x=sip.position.x=left?-3:2.5;
 }
 if(area==='hill'&&save.hillChild){
 little.position.x+=(p.x+.7-little.position.x)*Math.min(1,dt*2);
 little.position.z+=(p.z+.65-little.position.z)*Math.min(1,dt*2);little.position.y=hillHeight(little.position.z);
 }
 if(area==='field'){
 const eaten=s!=='pathSeed';birds.forEach((bird,i)=>bird.position.set(i-1+Math.sin(clock+i)*.35,eaten?.18+Math.abs(Math.sin(clock*2+i))*.26:1.5+Math.sin(clock+i)*.35,4+i*.32));
 kernels.forEach(k=>k.visible=!eaten);
 shoots.forEach(stem=>{stem.scale.y=s==='pathSeed'||s==='stoneSeed'?.57:.13;stem.position.y=stem.scale.y/2});
 wheat.forEach((stem,i)=>{stem.scale.y=s==='returnLake'?1:.7;stem.rotation.z=Math.sin(clock+i)*.04});
 }
}
function laterAction(){
 const s=save.chapterStep,b=laterBeats[s];
 if(isEighth()){eighthAction();return}
 if(isSeventh()){seventhAction();return}
 if(isSixth()){sixthAction();return}
 if(isFifth()){fifthAction();return}
 if(isFourth()){fourthAction();return}
 if(s==='climb'&&!save.hillChild&&distance(4.5,3.7)<1.65){
 save.hillChild=true;pose='sit';poseEnd=clock+2;checkpoint();caption('보리가 턱을 기대자 아이는 울음을 그치고 천천히 함께 언덕을 오른다.',4);return}
 const left=s==='seat'&&distance(-3,-1.5)<1.65;
 if(!left&&distance(b[0],b[1])>=1.65)return;
 switch(s){
 case 'levi':enterBeat('supper');caption('예수님이 세관에 앉은 레위를 부르시자, 레위는 일어나 그분을 따른다.　막 2:13–14',5);break;
 case 'supper':enterBeat('seat');caption('세리들과 죄인들이 함께 식사한다. 예수님은 병든 이에게 의사가 필요하듯 죄인을 부르러 오셨다고 말씀하신다.　막 2:15–17',7);break;
 case 'seat':save.tableSeat=left?'court':'bowl';enterBeat('dusk');pose='sit';poseEnd=clock+2;caption(left?'안뜰에 누운 보리에게 장사꾼이 물그릇을 가져온다.':'장사꾼이 상 아래 놓아 준 물 곁에 보리가 몸을 누인다.');break;
 case 'dusk':enterBeat('climb',[0,0,7]);caption('제3장　맨 뒤에 앉은 사람 · 언덕 위에서 가르침이 시작된다. 뒤편에서는 아이가 훌쩍인다.',6);break;
 case 'climb':enterBeat('flowers');caption('예수님은 슬퍼하는 사람에게 위로가 있고, 평화를 이루는 사람이 하나님의 자녀라 불릴 것이라고 가르치신다.　마 5:1–12',8);break;
 case 'flowers':enterBeat('lake');caption('들꽃이 바람에 흔들린다. 예수님은 들꽃을 입히시는 아버지께서 사람들도 돌보신다고 가르치신다.　마 6:25–34',7);break;
 case 'lake':enterBeat('boatTalk',[0,0,5]);caption('다른 날, 호숫가. 예수님은 배에 앉으시고 사람들은 물가에 선다.　막 4:1',5);break;
 case 'boatTalk':enterBeat('pathSeed',[0,0,5.8]);caption('예수님이 들려주시는 이야기 · 씨 뿌리는 사람이 씨를 뿌리러 나갔다.',4);break;
 case 'pathSeed':enterBeat('stoneSeed');caption('길가에 떨어진 씨를 새들이 와서 먹는다.',4);break;
 case 'stoneSeed':enterBeat('thornSeed');caption('돌밭의 씨는 빨리 싹을 냈지만 뿌리가 얕아 햇볕에 마른다.',4);break;
 case 'thornSeed':enterBeat('harvest');caption('함께 자란 가시덤불이 기운을 막아 열매를 맺지 못한다.',4);break;
 case 'harvest':enterBeat('returnLake');caption('좋은 땅에 떨어진 씨는 자라서 서른 배, 예순 배, 백 배의 열매를 맺는다.',5);poseEnd=clock+2;break;
 case 'returnLake':enterBeat('hillEnd',[0,0,-3.7]);caption('다시 호숫가. 좋은 땅은 말씀을 듣고 받아들여 열매 맺는 이들을 가리킨다.　막 4:13–20',7);break;
 case 'hillEnd':enterBeat('boarding',[0,0,3.6]);caption('저녁이 되어 예수님과 제자들이 건너편을 향해 떠난다.　막 4:35–36',5);break;
 }
}
function appendLaterRecord(refs){
 const b=laterBeats[save.chapterStep];if(!b)return;
 if(save.tableSeat){refs.append(' 예수님은 레위를 부르시고 세리들과 식사하셨다(막 2:13–17).');
 by('memory').lastElementChild.append(save.tableSeat==='court'?' 보리는 레위의 집 왼쪽 안뜰에 누웠다.':' 보리는 장사꾼이 놓아 준 물그릇 옆에 누웠다.');}
 if(isEighth()||isSeventh()||isSixth()||isFifth()||isFourth()||['lake','boatTalk','pathSeed','stoneSeed','thornSeed','harvest','returnLake','hillEnd'].includes(save.chapterStep)){
 refs.append(' 산에서 팔복과 들꽃에 관해 가르치셨다(마 5:1–12, 6:25–34).');by('memory').lastElementChild.append(save.hillChild?' 아이와 함께 비탈에 앉았다.':' 보리는 언덕 위로 곧장 올라갔다.');}
 if(isEighth()||isSeventh()||isSixth()||isFifth()||isFourth())appendFourthRecord(refs);
 if(isEighth()||isSeventh()||isSixth()||isFifth())appendFifthRecord(refs);
 if(isEighth()||isSeventh()||isSixth())appendSixthRecord(refs);
 if(isEighth()||isSeventh())appendSeventhRecord(refs);
 if(isEighth())appendEighthRecord(refs);
 if(isEighth()||isSeventh()||isSixth()||isFifth()||isFourth()||save.chapterStep==='hillEnd')refs.append(' 호숫가에서 씨 뿌리는 사람의 비유를 들려주셨다(막 4:1–20).');
}
