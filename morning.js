// The testimony and Bori's fictional reunion have independent checkpoints.
const dawnGarden=new T.Group(),breakfastBeach=new T.Group();
Object.assign(laterSets,{dawnGarden,breakfastBeach});scene.add(dawnGarden,breakfastBeach);
const eighth={
 gardenDawn:[-.8,.6,'step','무덤으로 향하는 발소리','길 바깥에서 막달라 마리아의 발걸음 따라가기','정원 길에서 기다리기','dawnGarden'],
 openTomb:[-.8,.6,'step','돌문 곁의 발소리','마리아가 열린 무덤을 발견하는 모습 바라보기','','dawnGarden'],
 tears:[-2.8,-1.2,'cry','정원에 남은 울음소리','무덤 바깥으로 돌아 마리아 곁에 머물기','마리아가 돌아보는 모습 지켜보기','dawnGarden'],
 herName:[-2.8,-1.2,'call','마리아를 부르는 목소리','그분이 마리아의 이름을 부르는 순간 기다리기','','dawnGarden'],
 newsPath:[3.5,3.7,'step','제자들에게 달려가는 발걸음','오른쪽 정원 문간까지 마리아를 따라가기','문간에서 증언 듣기','dawnGarden'],
 testimony:[3.5,3.7,'call','제자들에게 전하는 마리아의 목소리','마리아가 제자들에게 소식을 전할 때까지 듣기','','dawnGarden'],
 calledHome:[-2.3,-3.8,'call','내 이름을 불러 주던 목소리','보리야 · 소리가 들린 곳으로 가기　Shift 달리기','익숙한 손에 다가가기','dawnGarden'],
 reunion:[-2.3,-3.8,'call','곁에서 들리는 숨소리','천천히 숨을 고르기','','dawnGarden'],
 galilee:[0,4.8,'water','갈릴리의 물결','정원 길을 따라 나가기','갈릴리의 아침으로','dawnGarden'],
 netMorning:[3.3,-2.3,'step','당겨 올리는 그물 소리','물가의 배와 그물 곁으로 가기','제자들이 뭍에 오는 모습 보기','breakfastBeach'],
 charcoal:[-2.6,-.1,'step','숯불 타는 소리','왼쪽 숯불 곁으로 걸어가기','아침 식탁 곁에 앉기','breakfastBeach'],
 mealMorning:[-2.6,-.1,'call','아침을 나누는 목소리','예수님이 떡과 생선을 나누시는 모습 바라보기','','breakfastBeach'],
 peterWalk:[.8,-3.6,'call','물가에서 나누는 목소리','식사 뒤 예수님과 베드로 곁으로 걷기','베드로와의 대화 듣기','breakfastBeach'],
 threeCalls:[.8,-3.6,'call','베드로에게 건네는 말씀','물가에서 세 번의 물음과 대답 듣기','','breakfastBeach'],
 lastRest:[-3.3,1.4,'step','숯불과 식탁의 소리','식탁 곁이나 오른쪽 배 곁에서 쉴 자리 고르기','식탁 곁에 눕기','breakfastBeach'],
 credits:[0,0,'water','아침 물소리','끝 · 여행 수첩에서 보리의 기억 다시 읽기','여행 수첩 펼치기','breakfastBeach']
};
Object.assign(laterBeats,eighth);
function isEighth(){return Object.hasOwn(eighth,save.chapterStep)}
cube(dawnGarden,0x97a285,0,-.22,0,44,.44,42);
for(let i=0;i<5;i++)oval(dawnGarden,0xaaa493,-3+(i-2)*1.12,.85,-5.95,1.46,1.6,1.25);
oval(dawnGarden,0x454e4b,-3,.79,-4.76,.76,.96,.16);
oval(dawnGarden,0xa69f8c,-4.65,.79,-4.4,.85,.91,.33);
cube(dawnGarden,linen,-3,.27,-4.58,.6,.06,.32);
for(let i=0;i<32;i++){
 const x=(i%2?1:-1)*(4.7+Math.sin(i)*1.8),z=Math.cos(i*1.9)*6.8;
 oval(dawnGarden,0x748866,x,.26,z,.52,.4,.43);
 oval(dawnGarden,i%3?0xf1dfb9:0xd9aca2,x+.13,.6,z,.08,.055,.1);
}
for(let x of [2.1,5.1])cube(dawnGarden,0xc9b394,x,1.35,4.6,.36,2.7,.48);
cube(dawnGarden,wood,3.6,2.72,4.6,3.36,.2,.48);
const magdalene=actor(dawnGarden,-.8,2.4,0x907a87),gardener=actor(dawnGarden,-2.3,-3.8,linen);
const witnesses8=[actor(dawnGarden,3.8,4.55,0x778b82),actor(dawnGarden,4.65,4.2,0xaa896d)];
const angels8=[actor(dawnGarden,-3.5,-4.9,linen,.83),actor(dawnGarden,-2.6,-4.95,linen,.83)];
cube(breakfastBeach,0xdcc5a0,0,-.22,3,58,.44,17.5);
cube(breakfastBeach,water,0,-.38,-27,110,.44,44);
const waveTips=[];
for(let i=0;i<28;i++){
 const x=Math.sin(i*12.3)*22,z=-6.2-Math.floor(i/4)*2.1;
 waveTips.push(cube(breakfastBeach,0xbad6c8,x,-.12,z,.85+i%4*.4,.025,.075));
}
for(let i=0;i<16;i++)oval(breakfastBeach,0x97ad99,-37+i*5,.1,-43,6.5,2+i%4,5);
const morningBoat=new T.Group();breakfastBeach.add(morningBoat);morningBoat.position.set(3.9,-.04,-5.9);
oval(morningBoat,wood,0,.13,0,1.4,.5,2.18);oval(morningBoat,0x6f5747,0,.48,0,1.13,.09,1.85);
for(let i=0;i<8;i++){
 cube(morningBoat,0x9ca29a,-.81+i*.2,.61,-.1,.035,.035,1.57);
 cube(morningBoat,0x9ca29a,-.12,.62,-.85+i*.22,1.5,.035,.035);
}
for(let i=0;i<7;i++)oval(breakfastBeach,0x69554a,-2.65+.4*Math.cos(i*.9),.12,-1.4+.4*Math.sin(i*.9),.22,.15,.19);
const ember=oval(breakfastBeach,0xefaa69,-2.65,.22,-1.4,.31,.15,.24);
const bread8=oval(breakfastBeach,0xc49762,-2.05,.35,-1.55,.28,.12,.2);
const fish8=oval(breakfastBeach,0x8c9b96,-2.68,.36,-1.4,.14,.09,.32);
const host8=actor(breakfastBeach,-2.1,-2.2,linen),peter8=actor(breakfastBeach,2.7,-4.6,0x788a80);
for(let i=0;i<5;i++)actor(breakfastBeach,-4.4+i*.73,-2.9-Math.sin(i)*.4,[0x978879,0xaf936e,0x80988a][i%3],.83);
const lastPanel=document.createElement('section');
lastPanel.id='lastPanel';lastPanel.hidden=true;
lastPanel.innerHTML='<small>여행의 끝</small><h2>나를 부르는 목소리</h2><p id="lastMemory"></p><p>원전　네 복음서<br>보리의 여정　창작 이야기</p>';
document.body.append(lastPanel);
function syncEighth(b){
 const s=save.chapterStep;
 sheep.visible=true;lastPanel.hidden=s!=='credits';
 if(!lastPanel.hidden)by('lastMemory').textContent=save.restSpot==='boat'?'그물이 마르는 배 곁에서, 보리는 물결을 들으며 눕는다.':'아침을 나눈 식탁 곁에서, 보리는 마지막 숯불 소리를 들으며 눕는다.';
 document.querySelector('header small').textContent=s==='calledHome'||s==='reunion'?'제8장 · 보리의 기억':b[6]==='dawnGarden'?'제8장 · 부활의 아침':'제8장 · 갈릴리의 아침';
 scene.background.set(b[6]==='dawnGarden'?(s==='gardenDawn'||s==='openTomb'?0xa7b5b1:0xd6d6bd):0xc2dcd5);
 return true;
}
function endingSound(boat){
 if(!audio||!environmentAudible())return;
 const duration=boat?2.2:.24,size=Math.floor(audio.sampleRate*duration),buffer=audio.createBuffer(1,size,audio.sampleRate),data=buffer.getChannelData(0);
 let drift=0;
 for(let i=0;i<size;i++){const n=Math.random()*2-1;drift=(drift+.04*n)/1.04;data[i]=boat?drift*1.6:n*Math.exp(-i/(size*.12));}
 const source=audio.createBufferSource(),gain=audio.createGain(),t=audio.currentTime;
 source.buffer=buffer;gain.gain.setValueAtTime(.001,t);gain.gain.linearRampToValueAtTime(boat?.19:.08,t+(boat?.7:.008));gain.gain.exponentialRampToValueAtTime(.001,t+duration);source.connect(gain).connect(environmentGain);source.start();
}
function eighthBlocked(x,z){
 if(save.chapterStep==='credits')return true;
 const beach=eighth[save.chapterStep][6]==='breakfastBeach';
 return Math.abs(x)>5.65||z>7||z<(beach?-5.05:-4.45);
}
function eighthSounds(){
 if(save.chapterStep==='lastRest')return [chapterCue(),[3.8,-3.2,'water','배 옆 물결과 그물 소리']];
 return [chapterCue()];
}
const lines8={
 openTomb:[[0,'막달라 마리아가 돌이 옮겨진 것을 보고 베드로와 다른 제자에게 달려가 알린다.'],[4,'두 제자가 무덤에 달려와 놓인 세마포를 살핀 뒤 돌아간다. 마리아는 밖에서 울고 있다.　요 20:1–11']],
 herName:[[0,'무덤 안 두 천사가 왜 우느냐고 묻는다. 돌아선 마리아는 곁에 계신 예수님을 동산지기로 여긴다.'],[5,'예수님이 마리아의 이름을 부르신다. 마리아는 그분을 알아보고 선생님이라고 부른다.'],[10,'예수님은 형제들에게 가서 아버지께로 올라가신다는 말씀을 전하라고 하신다.　요 20:14–17']],
 testimony:[[0,'막달라 마리아가 제자들에게 자신이 주님을 보았다고 알린다.'],[4,'마리아는 예수님이 자기에게 하신 말씀도 전한다.　요 20:18']],
 mealMorning:[[0,'숯불 위에는 생선과 떡이 있다. 예수님은 제자들을 아침 식사로 부르신다.'],[4,'예수님이 다가와 떡을 가져다 주시고 생선도 나누어 주신다.　요 21:9–14']],
 threeCalls:[[0,'예수님이 베드로에게 자신을 사랑하느냐고 물으신다. 베드로가 대답하자 어린 양들을 먹이라고 맡기신다.'],[5,'두 번째 물음에도 베드로는 사랑한다고 답한다. 예수님은 양들을 돌보라고 하신다.'],[10,'세 번째 물음에 베드로는 근심하며 주님이 아신다고 답한다. 예수님은 양들을 먹이라고 하신다.'],[15,'예수님은 베드로가 걸을 길을 말씀하시고 자신을 따르라고 부르신다.　요 21:15–19']]
};
let lastSpokenStage='',nextEndingSound=0;
function updateEighth(dt){
 const s=save.chapterStep,b=eighth[s],t=beatTime,p=sheep.position;p.y=0;
 const boatSide=s==='lastRest'&&distance(3.8,-3.2)<1.4;
 by('place').textContent=b[6]==='dawnGarden'?'무덤 밖의 정원':'갈릴리 호숫가 · 숯불과 그물';
 by('hint').textContent=s==='credits'?'E · 마지막 여행 수첩 펼치기':boatSide?'E · 배 곁에 눕기':b[5]&&distance(b[0],b[1])<1.4?'E · '+b[5]:b[4];
 for(const [at,line] of lines8[s]||[]){
 if(at===0?lastSpokenStage!==s:t-dt<at&&t>=at)caption(line,at===15?6:5);
 }
 lastSpokenStage=s;
 if(b[6]==='dawnGarden'){
 const after=['testimony','calledHome','reunion','galilee'].includes(s);
 magdalene.visible=!['calledHome','reunion','galilee'].includes(s);
 gardener.visible=['herName','newsPath','testimony','calledHome','reunion','galilee'].includes(s);
 angels8.forEach(a=>a.visible=s==='herName'&&t<5);
 if(s==='gardenDawn')magdalene.position.set(-.8,0,1.45);
 else if(s==='openTomb'){
 const v=unit(t/2),w=unit((t-2)/2);
 magdalene.position.set(-.8-2.2*v+6.65*w,0,1.45-5.4*v+8*w);
 }else if(s==='newsPath'||after){
 const progress=after?1:unit((p.z+1.2)/4.9);
 magdalene.position.set(-3.3+6.75*progress,0,-3.5+7.55*progress);
 }else magdalene.position.set(-3.3,0,-3.5);
 magdalene.rotation.y=s==='herName'&&t>=5?1.4:0;
 witnesses8.forEach((a,i)=>{
 const trip=s==='openTomb'?unit((t-4)/2)*(1-unit((t-6.7)/2)):0;
 a.position.set(3.8+i*.65-(6.5+i*.3)*trip,0,4.55-i*.3-8.5*trip);
 });
 gardener.scale.y=s==='reunion'||s==='galilee'?.72:1;
 if(s==='openTomb'&&t>=10)enterBeat('tears');
 if(s==='herName'&&t>=15)enterBeat('newsPath');
 if(s==='testimony'&&t>=9){
 enterBeat('calledHome');caption('예수님　“보리야.”',7);voice('보리야');
 }
 if(s==='calledHome'&&distance(-2.3,-3.8)<1.05){enterBeat('reunion');caption('첫날 물을 건네던 손이 다시 보리의 눈높이로 내려온다.',5)}
 if(s==='reunion'&&t>=5.5)enterBeat('galilee');
 return;
 }
 morningBoat.rotation.z=Math.sin(clock*1.3)*.018;
 waveTips.forEach((w,i)=>w.position.y=-.12+Math.sin(clock*1.2+i)*.035);
 ember.scale.y=.14+.025*Math.sin(clock*4);
 const seated=s==='charcoal'||s==='mealMorning',talk=['threeCalls','lastRest','credits'].includes(s);
 const near=talk?1:s==='peterWalk'?unit(t/3):0;
 host8.position.set(-2.1+near*2.9,0,-2.2-near*2.2);
 peter8.position.set(s==='netMorning'?2.7:-1.15+near*3,0,s==='netMorning'?-4.6:-2.6-near*1.8);
 peter8.scale.y=seated?.74:.96;
 const serving=s==='mealMorning'?unit((t-4)/2):0;
 bread8.position.set(-2.05+serving*.74,.35+serving*.5,-1.55-serving*.8);
 fish8.position.set(-2.68+serving*.95,.36+serving*.48,-1.4-serving*.82);
 if(s==='mealMorning'&&t>=9)enterBeat('peterWalk');
 if(s==='threeCalls'&&t>=21){enterBeat('lastRest');caption('배 곁에서는 그물이 마르고, 식탁 곁에는 아직 불씨가 남아 있다.',5)}
 if(s==='credits'){
 sheep.scale.y=.52;head.rotation.x=-.36;legs.forEach(l=>l.rotation.x=.9);
 if(clock>=nextEndingSound){const boat=save.restSpot==='boat';endingSound(boat);nextEndingSound=clock+(boat?2.8:1.9)}
 }
}
function eighthAction(){
 const s=save.chapterStep,b=eighth[s];
 if(s==='credits'){if(chapterReplay)restoreMainJournal();else journal();return}
 const boatSide=s==='lastRest'&&distance(3.8,-3.2)<1.4;
 if(!boatSide&&distance(b[0],b[1])>=1.4)return;
 switch(s){
 case 'gardenDawn':enterBeat('openTomb');break;
 case 'tears':enterBeat('herName');break;
 case 'newsPath':enterBeat('testimony');break;
 case 'calledHome':caption('예수님　“보리야.”',4);break;
 case 'galilee':enterBeat('netMorning',[0,0,5.6]);caption('그 뒤 갈릴리 호수. 밤새 빈 그물에, 예수님의 말씀대로 배 오른편에 던지자 물고기가 가득 잡힌다.　요 21:1–8',7);break;
 case 'netMorning':enterBeat('charcoal');caption('제자들이 물고기 든 그물을 끌고 뭍에 오른다. 아침 바람에 숯불 냄새가 실려 온다.',6);break;
 case 'charcoal':enterBeat('mealMorning');break;
 case 'peterWalk':enterBeat('threeCalls');break;
 case 'lastRest':save.restSpot=boatSide?'boat':'table';enterBeat('credits');caption('',0);break;
 }
}
function appendEighthRecord(refs){
 const s=save.chapterStep,beach=eighth[s][6]==='breakfastBeach';
 if(['calledHome','reunion','galilee'].includes(s)||beach)refs.append(' 막달라 마리아가 부활하신 예수님을 알아보고 제자들에게 주님을 보았다고 전했다(요 20:1–18).');
 if(s==='peterWalk'||s==='threeCalls'||s==='lastRest'||s==='credits')refs.append(' 갈릴리 호숫가에서 예수님이 떡과 생선으로 아침을 나누셨다(요 21:1–14).');
 if(s==='lastRest'||s==='credits')refs.append(' 예수님은 베드로에게 세 번 사랑을 물으시고 양들을 맡기며 따르라고 부르셨다(요 21:15–19).');
 if(beach||s==='reunion'||s==='galilee')by('memory').lastElementChild.append(' 마리아가 소식을 전한 뒤 보리는 제 이름을 부르는 목소리를 듣고 익숙한 손으로 다가갔다.');
 if(s==='credits')by('memory').lastElementChild.append(save.restSpot==='boat'?' 마지막 아침, 배 곁에 누워 그물과 잔물결 소리를 들었다.':' 마지막 아침, 식탁 곁에 누워 숯불 소리를 들었다.');
}
syncChapter();
if(save.chapterStep==='calledHome')caption('보리야 · 정원에서 들었던 익숙한 목소리를 따라가자.',6);
