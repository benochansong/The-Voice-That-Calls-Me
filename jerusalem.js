// The sixth chapter uses three sets. The oil scene is always identified as a memory.
const gates=new T.Group(),court6=new T.Group(),bethany=new T.Group();
Object.assign(laterSets,{gates,court6,bethany});scene.add(gates,court6,bethany);
const sixth={
 ridge:[0,3.6,'call','제자들의 찬양','올리브 산 길목에서 어린 나귀에게 다가가기','행렬과 함께 걷기','gates'],
 procession:[0,-1.3,'step','겉옷 위의 발굽 소리','나귀 옆 중앙길 또는 왼쪽 군중 곁으로 걷기','나귀 곁에서 따라가기','gates'],
 cityGate:[0,-6.3,'call','성문 안의 목소리','행렬을 따라 성문 아래로 가기','성 안으로 들어가기','gates'],
 colonnade:[-2.4,.25,'step','돌바닥에 닿는 발소리','성전 기둥 사이로 걸어 헌금함 곁에 서기','가만히 지켜보기','court6'],
 twoCoins:[-2.4,.25,'step','헌금함 곁의 옷자락 소리','과부의 손과 작은 두 소리에 귀 기울이기','','court6'],
 disciples:[1.8,-2.5,'call','제자들을 부르는 목소리','맞은편 예수님 곁으로 가기','과부에 관한 말씀 듣기','court6'],
 twilight:[2.8,3.8,'step','저녁 문턱의 발걸음','해 질 무렵 돌문 곁으로 가기','입성 전 베다니를 떠올리기','court6'],
 flask:[1.7,1.1,'step','향유 그릇을 든 마리아의 발소리','식탁 아래로 가서 마리아가 다가오는 모습 보기','마리아의 발걸음 기다리기','bethany'],
 giveRoom:[-1.7,.15,'step','식탁보 아래로 다가오는 발소리','식탁 왼쪽으로 비켜 마리아에게 자리를 내주기','그 자리에서 몸 낮추기','bethany'],
 anoint:[-1.7,.15,'step','향유가 흐르는 소리','마리아가 예수님의 발에 향유를 붓는 모습 지켜보기','','bethany'],
 backToCity:[0,3.8,'step','저녁 바람에 움직이는 천','베다니의 문턱으로 돌아가기','회상을 마치고 예루살렘으로','bethany'],
 sixthEnd:[2.8,3.8,'step','예루살렘 저녁의 발소리','6장 끝 · 예루살렘의 저녁','다락방 문턱으로 가기','court6']
};
Object.assign(laterBeats,sixth);
function isSixth(){return Object.hasOwn(sixth,save.chapterStep)}
const limestone=0xd2b995;
cube(gates,0xc8ab80,0,-.22,0,48,.44,40);
for(const side of [-1,1]){
 cube(gates,limestone,side*9.1,2.2,-7.7,13.3,4.4,1.65);
 cube(gates,0xc2a68a,side*3,2.7,-7.65,1.25,5.4,2.4);
 for(let i=0;i<7;i++)cube(gates,limestone,side*(4+i*1.6),4.52,-7.7,.77,.45,1.45);
}
cube(gates,limestone,0,4.8,-7.65,5.1,1,1.55);
for(let i=0;i<9;i++){
 const x=(i%2?1:-1)*(6.5+i%3),z=6-i*1.5;
 cube(gates,wood,x,1,z,.4,2,.4);oval(gates,0x879472,x,2.4,z,1.5,.95,1.2);
}
const colt=donkey.clone();gates.add(colt);
const rider=actor(gates,0,0,linen);
const worshippers=[];
for(let i=0;i<16;i++){
 const side=i%2?1:-1,z=5-Math.floor(i/2)*1.4;
 const person=actor(gates,side*(3.7+(i%3)*.27),z,[0x9e7862,0x788f7e,0xb09974][i%3]);
 person.rotation.y=-side*Math.PI/2;
 const arm=cube(person,0xc09371,.26,1.4,.18,.12,.48,.14);worshippers.push(arm);
}
for(let i=0;i<7;i++)cube(gates,[0xa56d5d,0x708b87,0xc0a779][i%3],Math.sin(i)*.35,.015,3.5-i*1.35,1.65,.035,1.1).rotation.y=Math.sin(i)*.24;
cube(court6,0xdac8a9,0,-.22,0,38,.44,30);
for(let i=0;i<8;i++)cube(court6,0xbea98a,0,.003,7-i*2,19,.01,.045);
for(let x of [-5.4,5.4]){
 cube(court6,limestone,x,3.95,0,.95,.45,16);
 for(let i=0;i<5;i++){let z=6-i*3;
 part(court6,new T.CylinderGeometry(.29,.38,3.62,10),linen,x,1.81,z,1,1,1);
 cube(court6,limestone,x,.13,z,.93,.26,.93);}
}
cube(court6,limestone,0,1.9,-7.4,17,3.8,.5);
const chest=cube(court6,wood,-2.9,.53,-1.35,1,.99,.83);
cube(court6,0x51483c,-2.9,1.04,-1.35,.48,.025,.11);
const widow=actor(court6,-3.8,.6,0x797790);
const offering=[0,1].map(()=>part(court6,new T.CylinderGeometry(.075,.075,.021,12),0xad8253,0,0,0,1,1,1));
const stoneTeacher=actor(court6,1.7,-3.8,linen);
actor(court6,2.7,-3.9,0x81937e);actor(court6,.6,-4.2,0xb18365);
const donors=[actor(court6,-1.1,-.8,0xaf885d),actor(court6,-.2,-1.6,0x69887e)];
room(bethany);
cube(bethany,wood,0,.93,-2.9,4.3,.18,1.2);
for(const x of [-1.8,1.8])cube(bethany,wood,x,.43,-2.9,.18,.86,.84);
for(let i=0;i<5;i++)oval(bethany,0xbe915a,-1.4+i*.63,1.07,-2.9,.19,.09,.16);
const atTable=actor(bethany,.15,-1.5,linen);atTable.scale.y=.76;
const mary6=actor(bethany,2.35,1.2,0x878196);
actor(bethany,-2.8,-2.2,0xb68666);actor(bethany,1.4,-3.8,0x83917d);
const alabaster=oval(bethany,0xc6a783,0,0,0,.12,.2,.12);
const perfume=oval(bethany,0xcaab6b,.17,.12,-1.16,.045,.23,.045);
const hair=oval(bethany,0x514239,.35,.21,-1.08,.16,.09,.25);
function syncSixth(b){
 const memory=b[6]==='bethany';sheep.visible=true;
 document.querySelector('header small').textContent=memory?'제6장 · 회상 · 입성 전 베다니':'예루살렘 · 제6장';
 scene.background.set(memory?0xddb698:save.chapterStep==='sixthEnd'||save.chapterStep==='twilight'?0xe4bd96:0xcbd6bf);
 return true;
}
function sixthBlocked(x,z){
 const area=sixth[save.chapterStep][6];
 if(Math.abs(x)>4.85||z>7.8||z< -7.15)return true;
 if(area==='gates')return z< -6.4&&Math.abs(x)>2;
 if(area==='court6')return Math.abs(x+2.9)<.73&&Math.abs(z+1.35)<.62;
 return Math.abs(x)<2.38&&Math.abs(z+2.9)<.8;
}
function sixthSounds(){
 if(save.chapterStep==='procession')return [chapterCue(),[-3,-1.3,'call','길 가장자리의 찬양']];
 return [chapterCue()];
}
function updateSixth(dt){
 const s=save.chapterStep,b=sixth[s],t=beatTime,p=sheep.position;
 p.y=0;const edge=s==='procession'&&distance(-3,-1.3)<1.35;
 by('place').textContent={gates:'올리브 산길 · 예루살렘 성문',court6:'예루살렘 성전 · 헌금함이 있는 뜰',bethany:'입성 전 베다니 · 식탁 아래에서 본 기억'}[b[6]];
 by('hint').textContent=edge?'E · 군중 곁에서 행렬 따라가기':b[5]&&distance(b[0],b[1])<1.45?'E · '+b[5]:b[4];
 if(b[6]==='gates'){
 const z=s==='ridge'?3.25:s==='procession'?Math.max(-2.1,Math.min(3.25,p.z-1)):Math.max(-6.75,Math.min(-2.1,p.z-1));
 colt.position.set(.55,.06,z);rider.position.set(.55,1.05,z+.08);rider.scale.y=.79;
 worshippers.forEach((arm,i)=>arm.rotation.x=-.55+Math.sin(clock*2+i)*.33);
 return;
 }
 if(b[6]==='court6'){
 const before=s==='colonnade',watch=s==='twoCoins',approach=watch?unit(t/1.6):before?0:1;
 widow.position.set(-3.8+approach*.92,0,.6-approach*1.37);
 donors.forEach((d,i)=>d.position.x=-1.1+i*.9+(before?0:watch?unit(t/2):1)*2.4);
 offering.forEach((coin,i)=>{
 const drop=t-(2.2+i*1.3);
 coin.visible=watch&&drop>=0&&drop<.58;
 coin.position.set(-2.9,1.47-.48*unit(drop/.58)**2,-1.35);
 if(watch&&drop>=.58&&drop-dt<.58){
 ping('coin',-.28,.065);caption(i?'두 번째 작은 동전 소리.':'첫 번째 작은 동전 소리.',1.25);
 }
 });
 if(watch&&t>=6){enterBeat('disciples');caption('과부가 넣은 것은 두 렙돈이었다. 예수님이 제자들을 가까이 부르신다.　막 12:41–44',6)}
 return;
 }
 const pouring=s==='anoint',finished=s==='backToCity';
 const near=finished?1:pouring?unit(t/2):s==='giveRoom'?.19:0;
 mary6.position.set(2.35-near*1.83,0,1.2-near*2.24);
 mary6.scale.y=1-near*.55;
 alabaster.position.set(mary6.position.x-.23,.95-near*.58,mary6.position.z-.09);
 alabaster.rotation.z=pouring&&t>2&&t<5?1.78:.12;
 perfume.visible=pouring&&t>=2&&t<5;hair.visible=pouring&&t>=5;
 if(pouring&&t-dt<2&&t>=2)caption('마리아가 값비싼 순전한 나드 향유를 예수님의 발에 붓는다.',3);
 if(pouring&&t-dt<5&&t>=5)caption('마리아는 자기 머리털로 그 발을 닦는다. 집 안에 향기가 가득하다.　요 12:1–8',5);
 if(pouring&&t>=10){enterBeat('backToCity');caption('식탁 아래로 비치는 저녁빛. 향유를 바른 발의 기억을 간직하고 문으로 돌아간다.',5)}
}
function sixthAction(){
 const s=save.chapterStep,b=sixth[s];
 const edge=s==='procession'&&distance(-3,-1.3)<1.35;
 if(!edge&&distance(b[0],b[1])>=1.45)return;
 switch(s){
 case 'ridge':enterBeat('procession');caption('제자들이 겉옷을 얹은 어린 나귀에 예수님이 오르셨다. 사람들은 길 위에 겉옷을 펼친다.　눅 19:28–40',6);break;
 case 'procession':save.entryView=edge?'crowd':'colt';enterBeat('cityGate');caption(edge?'찬양하는 사람들 곁으로 지나간다. 그들의 눈길이 나귀를 따라 성문을 향한다.':'겉옷 위로 작은 발굽이 지나간다. 보리도 그 곁을 따라 성문으로 걷는다.',5);break;
 case 'cityGate':enterBeat('colonnade',[0,0,6]);caption('그 뒤 성전에서. 예수님은 헌금함 맞은편에 앉아 사람들이 넣는 모습을 지켜보신다.',5);break;
 case 'colonnade':enterBeat('twoCoins');caption('사람들이 지나간 뒤 가난한 과부 한 사람이 다가온다.',2);break;
 case 'disciples':enterBeat('twilight');caption('예수님은 과부가 궁핍한 가운데 자기 생활비 전부를 넣었다고 제자들에게 말씀하신다.　막 12:41–44',7);break;
 case 'twilight':enterBeat('flask',[0,0,4.8]);caption('회상 · 입성 전 베다니. 유월절 엿새 전, 보리가 식탁 아래에서 보았던 저녁이다.　요 12:1–8',7);break;
 case 'flask':enterBeat('giveRoom');caption('향유를 든 마리아가 식탁 곁으로 다가온다. 왼쪽으로 비켜서면 발치까지 길이 열린다.',5);break;
 case 'giveRoom':enterBeat('anoint');pose='sit';poseEnd=clock+2;caption('회상 · 보리는 천이 드리운 자리에서 조용히 몸을 낮춘다.',2);break;
 case 'backToCity':enterBeat('sixthEnd',[2.8,0,3.8]);caption('회상이 끝났다. 다시 예루살렘의 저녁. 보리는 고요해진 뜰에 앉는다.',6);break;
 case 'sixthEnd':enterBeat('upperDoor',[0,0,6]);caption('제7장　빈자리 곁에서 · 문턱에 고인 물빛이 일렁인다.',5);break;
 }
}
function appendSixthRecord(refs){
 const s=save.chapterStep,area=sixth[s]?.[6];
 if(area!=='gates'){
 refs.append(' 예수님이 어린 나귀를 타고 예루살렘에 들어가시자 제자들이 찬양했다(눅 19:28–40).');
 by('memory').lastElementChild.append(save.entryView==='crowd'?' 보리는 길 가장자리에서 찬양하는 이들의 얼굴을 보았다.':' 보리는 길 가운데서 어린 나귀의 발굽을 따라갔다.');
 }
 if((isSeventh()||isEighth())||['twilight','sixthEnd'].includes(s)||area==='bethany')refs.append(' 예수님은 두 렙돈을 넣은 과부가 자기 생활비 전부를 드렸다고 말씀하셨다(막 12:41–44).');
 if((isSeventh()||isEighth())||s==='backToCity'||s==='sixthEnd'){refs.append(' 입성 전 베다니에서 마리아가 예수님의 발에 향유를 붓고 머리털로 닦았다(요 12:1–8).');by('memory').lastElementChild.append(' 보리는 그 저녁을 떠올리며 식탁 곁에서 마리아에게 길을 비켜 주었던 일을 기억했다.');}
}
