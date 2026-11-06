// Walking targets name Bori's next action. Witnessed events advance on their own.
const nightSets={upper:new T.Group(),olives:new T.Group(),fireside:new T.Group(),judgment:new T.Group(),hillCross:new T.Group(),gardenTomb:new T.Group()};
Object.assign(laterSets,nightSets);
for(const set of Object.values(nightSets))scene.add(set);
const {upper,olives,fireside,judgment,hillCross,gardenTomb}=nightSets;
const seventh={
 upperDoor:[0,1,'water','대야에 담기는 물소리','문턱의 물빛으로 다가가기','발 씻김 지켜보기','upper'],
 washFeet:[0,1,'water','발을 씻기는 물소리','물과 수건을 들고 낮아지신 예수님 바라보기','','upper'],
 mealPlace:[-2,-1,'call','식탁 곁의 목소리','왼쪽 식탁 곁 또는 오른쪽 문간에 자리 잡기','떡과 잔을 건네는 손 바라보기','upper'],
 lastMeal:[-1,-2,'call','떡을 떼는 소리','선택한 자리에서 마지막 식사에 머물기','','upper'],
 gardenDoor:[0,5,'step','동산으로 향하는 발걸음','문을 지나 올리브나무 동산으로 가기','동산으로 나가기','upper'],
 watch:[-2,-1.7,'call','나무 너머의 기도','나무 곁에 가거나 그 자리에 조용히 머물기','깨어 곁에 있기','olives'],
 prayer:[-2,-1.7,'call','기도하는 목소리','기도가 이어지는 동안 동산에 머물기','','olives'],
 seize:[1,-3,'step','다가오는 횃불 소리','횃불과 흩어지는 발걸음 바라보기','','olives'],
 followFire:[0,4.8,'step','멀어지는 발걸음','동산 입구를 지나 뜰의 불가로 가기','멀찍이 따라가기','olives'],
 denial:[1,0,'call','불가의 목소리','베드로가 앉은 불가 가까이 가기','사람들의 말 듣기','fireside'],
 threeAnswers:[1,0,'call','불가에서 오가는 말','불빛 곁에 머물기','','fireside'],
 emptySeat:[1,0,'step','떠나는 발소리','베드로가 떠난 자리에 머물기','빈자리 곁에 앉기','fireside'],
 morning:[0,4.6,'step','새벽 뜰의 발소리','새벽 문간으로 걸어가기','수난 장면 보기 방식 고르기','fireside'],
 passionChoice:[-2.6,3,'step','재판 뜰로 향하는 발걸음','왼쪽 등불은 전체 보기 · 오른쪽 등불은 짧게 보기','전체 보기 · 재판 뜰로','fireside'],
 briefPassion:[0,3,'step','안식일을 앞둔 바람','재판과 죽음과 장사 · 문단을 읽고 준비되면 계속하기','안식일의 고요로','gardenTomb'],
 verdict:[0,-1.8,'call','빌라도의 재판 뜰','뜰 바깥에서 판결을 들을 자리 찾기','재판 지켜보기','judgment'],
 sentence:[0,-1.8,'call','판결을 내리는 목소리','판결과 호송을 지켜보기','','judgment'],
 crossRoad:[2,3.4,'step','성 밖으로 향하는 발걸음','성문으로 향하는 길을 따라가기','성 밖 언덕으로','judgment'],
 witnesses:[-2,-1.8,'step','곁에 선 사람들의 숨소리','멀리서 지켜보는 사람들 곁으로 걷기','함께 서 있기','hillCross'],
 crucified:[-2,-1.8,'step','언덕 위 옷자락 소리','사람들 곁에서 멀리 언덕 바라보기','','hillCross'],
 gravePath:[1.8,3,'step','무덤으로 향하는 발소리','사람들을 따라 언덕을 내려가기','장사하는 곳으로','hillCross'],
 linenTomb:[.5,-1.8,'step','세마포 스치는 소리','무덤 가까이 조용히 다가가기','장사 지켜보기','gardenTomb'],
 laidToRest:[.5,-1.8,'step','천이 움직이는 소리','여인들 곁에서 요셉이 장사하는 모습 지켜보기','','gardenTomb'],
 sabbath:[0,3,'step','고요한 길','무덤에서 물러나 쉴 자리 찾기','안식일에 머물기','gardenTomb'],
 seventhEnd:[0,3,'step','저녁 바람','7장 끝 · 안식일의 고요','새벽 정원으로 가기','gardenTomb']
};
Object.assign(laterBeats,seventh);
function isSeventh(){return Object.hasOwn(seventh,save.chapterStep)}
room(upper);room(fireside);room(judgment);
for(const set of [olives,hillCross,gardenTomb])cube(set,set===olives?0x818267:0xb6a28a,0,-.22,0,52,.44,42);
for(const [set,x,z] of [[upper,0,4.5],[fireside,-2.6,3],[fireside,2.6,3],[judgment,2.4,3.8]]){
 cube(set,wood,x,.46,z,.12,.92,.12);oval(set,0xffbb66,x,1,z,.12,.2,.12);
}
cube(upper,wood,0,.8,-3.25,4.8,.2,1.5);
for(let x of [-2,2])cube(upper,wood,x,.4,-3.25,.22,.8,1);
const aTeacher=actor(upper,0,-.8,linen);
const guests7=[];
for(let i=0;i<7;i++)guests7.push(actor(upper,-2.5+i*.8,-4.35,[0x879382,0xb18b6a,0xac8d89][i%3]));
const washed=actor(upper,-.72,-1.12,0x8a927e);
const basin=oval(upper,wood,-.53,.18,-.68,.43,.16,.31);
oval(upper,water,-.53,.29,-.68,.37,.045,.25);
const towel=cube(upper,linen,0,.45,-.66,.18,.48,.1);
const sharedBread=oval(upper,0xc49560,0,.98,-2.7,.31,.1,.19);
const cup=part(upper,new T.CylinderGeometry(.135,.075,.22,9),clay,.55,1.01,-2.7,1,1,1);
for(let i=0;i<12;i++){
 const x=(i%2?1:-1)*(3.5+i%3),z=5-Math.floor(i/2)*2.2;
 cube(olives,wood,x,1.27,z,.43,2.5,.47).rotation.z=.12*Math.cos(i);
 oval(olives,0x63705d,x,2.88,z,1.6,.93,1.35);
}
const praying=actor(olives,-.5,-3.8,linen);
const sleepers=[actor(olives,-2.9,-.65,0x938670),actor(olives,2,-.5,0x758b78),actor(olives,2.8,-.9,0xb3987c)];
const arrestParty=[];
for(let i=0;i<4;i++){const a=actor(olives,i*.65-1,-6.2,i===0?0x977d61:0x737878);
 if(i){cube(a,wood,.34,1.38,0,.075,.8,.075);oval(a,0xf0b170,.34,1.85,0,.11,.24,.11)}arrestParty.push(a)}
const flame7=oval(fireside,0xea9853,-.55,.4,-.3,.36,.5,.32);
for(let i=0;i<8;i++)oval(fireside,0x7e7464,-.55+Math.cos(i*.79)*.55,.1,-.3+Math.sin(i*.79)*.55,.16,.13,.16);
const peter7=actor(fireside,1,-.9,0x788a80);
for(let i=0;i<3;i++)actor(fireside,-2+i*.55,-1.6-i*.43,0xa78b70+i*0x020302);
const governor=actor(judgment,0,-4.65,0x956d70);governor.position.y=.36;
cube(judgment,limestone,0,.14,-4.7,3.5,.32,1.5);
const accused=actor(judgment,1.7,-3.4,linen);
const escorts=[actor(judgment,2.4,-3.7,0x78787c),actor(judgment,1,-3.7,0x777775)];
for(let i=0;i<7;i++)actor(judgment,-3+i*.82,.45+Math.sin(i)*.3,0x958771+i*0x010101);
oval(hillCross,0x958773,0,-.25,-11,10,2.1,5.5);
for(let i=-1;i<=1;i++){
 const x=i*3.1,z=-11.5-Math.abs(i)*.65;
 cube(hillCross,wood,x,3,z,.17,3.3,.18);cube(hillCross,wood,x,3.9,z,1.45,.14,.16);
 const figure=actor(hillCross,x,z+.1,i===0?0xd6c7aa:0xa79a89,.67);figure.position.y=2.65;
}
const windCloth=cube(hillCross,0xae9c88,-3,.93,-2.7,.78,1.08,.09);
for(let i=0;i<4;i++)actor(hillCross,-3.4+i*.77,-3+Math.sin(i)*.4,0x998a79+i*0x020202);
for(let i=0;i<5;i++)oval(gardenTomb,0xa99c83,(i-2)*1.2,.82,-5.6,1.5,1.55,1.25);
oval(gardenTomb,0x484b43,.05,.76,-4.4,.74,.94,.15);
const burialStone=oval(gardenTomb,0x968c7e,1.7,.7,-4.06,.84,.86,.31);
const joseph=actor(gardenTomb,.9,-2.7,0x91937b);
const shroud=oval(gardenTomb,linen,.52,.59,-2.7,.36,.25,.84);
for(let i=0;i<2;i++)actor(gardenTomb,-2.4+i*.72,-1.9-i*.5,0x96868b+i*0x030303);
const briefText='빌라도가 예수님을 십자가에 못 박도록 넘겼고, 예수님은 십자가에서 죽으셨다. 아리마대 사람 요셉이 그 몸을 세마포로 싸서 바위를 판 무덤에 모셨다. 여인들은 그곳을 보고 돌아가 안식일에 쉬었다.　눅 23:13–56';
function syncSeventh(b){
 const memories={upper:'예루살렘 · 다락방',olives:'겟세마네 · 밤',fireside:'대제사장의 집 뜰',judgment:'빌라도의 재판 뜰',hillCross:'성 밖 · 멀리 보이는 언덕',gardenTomb:'무덤 곁 · 안식일을 앞둔 길'};
 by('place').textContent=memories[b[6]];
 document.querySelector('header small').textContent='제7장 · 빈자리 곁에서';
 scene.background.set({upper:0xc4ad91,olives:0x687381,fireside:0x8b8590,judgment:0xc4beb1,hillCross:0xa39ca2,gardenTomb:0xbab4a8}[b[6]]);
 return true;
}
function seventhBlocked(x,z){
 if(Math.abs(x)>5.1||z>7||z< -5.1)return true;
 return seventh[save.chapterStep][6]==='upper'&&Math.abs(x)<2.6&&Math.abs(z+3.25)<1;
}
function seventhSounds(){
 if(save.chapterStep==='passionChoice')return [chapterCue(),[2.6,3,'step','짧게 보는 길']];
 return [chapterCue()];
}
function updateSeventh(dt){
 const s=save.chapterStep,b=seventh[s],t=beatTime,area=b[6],p=sheep.position;p.y=0;
 const edge=s==='mealPlace'&&distance(2.5,1.7)<1.4;
 const brief=s==='passionChoice'&&distance(2.6,3)<1.4;
 by('place').textContent={upper:'다락방 · '+(['upperDoor','washFeet'].includes(s)?'발 씻김　요 13:1–17':'마지막 식사　눅 22:14–23'),olives:'겟세마네　막 14:32–50',fireside:'불을 피운 뜰　눅 22:54–62',judgment:'빌라도의 재판 뜰　눅 23:13–25',hillCross:'멀리서 지켜보는 언덕　눅 23:26–49',gardenTomb:'장사와 안식일　눅 23:50–56'}[area];
 by('hint').textContent=brief?'E · 수난 짧게 보기':edge?'E · 문간에서 마지막 식사 바라보기':b[5]&&distance(b[0],b[1])<1.45?'E · '+b[5]:b[4];
 if(s==='briefPassion'){if(by('caption').textContent!==briefText)caption(briefText,Infinity);shroud.visible=false;joseph.visible=false;burialStone.position.x=.08;return}
 if(area==='upper'){
 const wash=s==='upperDoor'||s==='washFeet';aTeacher.position.set(wash?-.05:0,0,wash?-.85:-2.25);
 aTeacher.scale.y=wash?.58:.87;towel.visible=wash;towel.position.y=.43+(s==='washFeet'?Math.sin(t*2)*.07:0);
 const giving=s==='lastMeal',progress=giving?unit((t-1)/2):0;
 sharedBread.position.set(-progress*.9,.99+progress*.12,-2.65-progress*.5);
 cup.position.set(.55+(giving?unit((t-4)/2):0)*.9,1.01,-2.7);
 if(s==='washFeet'&&t>6){enterBeat('mealPlace');caption('예수님이 제자들의 발을 씻기시고 서로의 발을 씻어 주라고 가르치신다.　요 13:1–17',6)}
 if(giving&&t-dt<4&&t>=4)caption('예수님이 잔도 건네시며 제자들을 위해 흘리는 피로 세우는 새 언약을 말씀하신다.',6);
 if(giving&&t>10){enterBeat('gardenDoor');caption('식사가 끝난 뒤, 사람들의 발걸음이 동산을 향한다.',4)}
 }else if(area==='olives'){
 const taken=s==='followFire',arrest=s==='seize',v=taken?1:arrest?unit(t/5):0;
 praying.scale.y=v>.3?1:.62;praying.position.x=-.5+2.5*v;praying.position.z=-3.8-v;
 sleepers.forEach((a,i)=>{a.scale.y=v>.3?.91:.52;a.position.x=[-2.9,2,2.8][i]+(i?1:-1)*unit((v-.6)/.4)*3});
 arrestParty.forEach((a,i)=>{a.visible=arrest||taken;a.position.set(1.8+i*.48-2.3*(1-v),0,-6.7+2*v-i*.16)});
 if(s==='watch'&&t>12){enterBeat('prayer');caption('보리가 조용히 머무는 동안에도 예수님의 기도는 이어진다.',4)}
 if(s==='prayer'&&t>7){enterBeat('seize');caption('유다가 입맞춤으로 예수님을 가리킨다. 무리가 예수님을 붙잡고 제자들은 흩어진다.　막 14:43–50',7)}
 if(arrest&&t>7)enterBeat('followFire');
 }else if(area==='fireside'){
 flame7.scale.y=.49+Math.sin(clock*6)*.06;
 const leaving=s==='threeAnswers'?unit((t-11)/3):s==='denial'?0:1;
 peter7.position.set(1+3.3*leaving,0,-.9+3.5*leaving);peter7.visible=leaving<1;
 if(s==='threeAnswers'){
 if(t-dt<4&&t>=4)caption('두 번째 사람이 그도 제자들 중 하나라고 하자, 베드로는 아니라고 답한다.',4);
 if(t-dt<8&&t>=8)caption('시간이 흐른 뒤 세 번째 사람이 말한다. 베드로가 다시 부인하는 순간 닭이 운다.',4);
 if(t-dt<11&&t>=11){ping('cock',0,.065);caption('예수님이 돌아보신다. 베드로는 하신 말씀을 기억하고 밖으로 나가 운다.',5)}
 if(t>16)enterBeat('emptySeat');
 }
 }else if(area==='judgment'){
 const v=s==='crossRoad'?1:s==='sentence'?unit((t-3)/4):0;
 accused.position.set(1.7+1.2*v,0,-3.4+3.8*v);
 escorts.forEach((a,i)=>a.position.set((i?1:2.4)+1.2*v,0,-3.7+3.8*v));
 if(s==='sentence'&&t>7){enterBeat('crossRoad');caption('로마 군인들이 예수님을 데리고 성 밖으로 간다. 시몬이 십자가를 지고 뒤따른다.　눅 23:26',6)}
 }else if(area==='hillCross'){
 windCloth.rotation.z=Math.sin(clock*1.8)*.12;
 if(s==='crucified'&&t-dt<5&&t>=5)caption('어둠이 내린다. 예수님은 아버지께 영을 맡기시고 숨을 거두신다. 사람들은 멀리 서서 바라본다.',7);
 if(s==='crucified'&&t>12)enterBeat('gravePath');
 }else{
 const rest=s==='sabbath'||s==='seventhEnd',laid=s==='laidToRest',v=rest?1:laid?unit(t/6):0;
 shroud.visible=!rest;joseph.visible=!rest;burialStone.position.x=1.7-1.62*v;
 joseph.position.z=-2.7-1.35*v;shroud.position.z=-2.7-1.9*v;
 if(laid&&t>7){enterBeat('sabbath');caption('여인들은 무덤과 그 몸을 모신 곳을 본 뒤 돌아간다. 안식일이 시작된다.',6)}
 }
}

function seventhAction(){
 const s=save.chapterStep,b=seventh[s],edge=s==='mealPlace'&&distance(2.5,1.7)<1.4,brief=s==='passionChoice'&&distance(2.6,3)<1.4;
 if(!edge&&!brief&&distance(b[0],b[1])>=1.45)return;
 switch(s){
 case 'upperDoor':enterBeat('washFeet');caption('예수님이 수건을 두르고 물을 담아 제자들의 발을 씻기신다. 보리는 그 손을 알아본다.　요 13:1–17',6);break;
 case 'mealPlace':save.mealView=edge?'door':'table';enterBeat('lastMeal');caption('마지막 식사 · 예수님이 감사하시고 떡을 떼어 제자들에게 주시며 자신을 기억하라고 하신다.　눅 22:14–23',4);break;
 case 'gardenDoor':enterBeat('watch',[0,0,5.7]);caption('겟세마네. 예수님은 제자들에게 깨어 있으라고 하시고, 아버지의 뜻을 구하며 기도하신다.',6);break;
 case 'watch':enterBeat('prayer');caption('보리는 나무 그늘에 앉는다. 예수님은 자신의 원보다 아버지의 뜻이 이루어지기를 기도하신다.　막 14:32–42',6);pose='sit';poseEnd=clock+2;break;
 case 'followFire':enterBeat('denial',[0,0,5.4]);caption('멀찍이 따라온 베드로가 대제사장의 집 뜰에 피운 불 곁에 앉는다.',5);break;
 case 'denial':enterBeat('threeAnswers');caption('한 여종이 그도 예수님과 함께 있었다고 한다. 베드로는 그분을 모른다고 답한다.',4);break;
 case 'emptySeat':enterBeat('morning');pose='sit';poseEnd=clock+2;caption('보리는 불 곁에 남은 빈자리에 앉는다.',4);break;
 case 'morning':enterBeat('passionChoice');caption('수난 장면 · 왼쪽 등불에서 전체 경로를 걷거나, 오른쪽에서 죽음과 장사를 한 문단으로 읽을 수 있다.',8);break;
 case 'passionChoice':save.passionView=brief?'brief':'full';enterBeat(brief?'briefPassion':'verdict',[0,0,brief?3:5.7]);if(!brief)caption('아침. 보리는 빌라도의 재판 뜰 바깥으로 걸어간다.',5);break;
 case 'briefPassion':enterBeat('sabbath',[0,0,3.9]);caption('여인들이 돌아간 뒤, 안식일의 고요가 내려앉는다.',5);break;
 case 'verdict':enterBeat('sentence');caption('빌라도는 사형에 해당할 죄를 찾지 못했다고 말한다. 그러나 바라바를 놓아주고 예수님을 십자가에 못 박으라는 요구대로 판결한다.　눅 23:13–25',7);break;
 case 'crossRoad':enterBeat('witnesses',[0,0,5.6]);caption('성 밖. 보리는 멀리 서 있는 사람들의 옷자락 사이로 언덕을 본다.',5);break;
 case 'witnesses':enterBeat('crucified');caption('로마 군인들이 예수님과 두 죄수를 십자가에 못 박는다. 보리는 지켜보는 사람들 곁에 남는다.　눅 23:32–49',5);break;
 case 'gravePath':enterBeat('linenTomb',[0,0,5.4]);caption('준비일 저녁, 아리마대 사람 요셉이 빌라도에게 예수님의 몸을 청한다.',5);break;
 case 'linenTomb':enterBeat('laidToRest');caption('요셉은 예수님의 몸을 내려 세마포로 싸고, 아직 아무도 모신 적 없는 바위 무덤에 모신다.　눅 23:50–56',7);break;
 case 'sabbath':enterBeat('seventhEnd');caption('안식일. 보리는 사람들의 발소리가 잦아든 길에서 쉰다.',6);break;
 case 'seventhEnd':enterBeat('gardenDawn',[0,0,5.7]);caption('제8장　정원에서 아침 식탁까지 · 안식 후 첫날, 아직 어두운 때.',5);break;
 }
}
function appendSeventhRecord(refs){
 const s=save.chapterStep,b=seventh[s],afterMeal=!['upperDoor','washFeet','mealPlace','lastMeal'].includes(s);
 if(s!=='upperDoor'&&s!=='washFeet')refs.append(' 예수님은 제자들의 발을 씻기시고 서로 섬기라고 가르치셨다(요 13:1–17).');
 if(afterMeal)refs.append(' 마지막 식사에서 예수님은 떡과 잔을 건네셨다(눅 22:14–23).');
 if(afterMeal&&b?.[6]!=='upper'&&b?.[6]!=='olives')refs.append(' 겟세마네에서 기도하신 뒤 붙잡히셨고 제자들이 흩어졌다(막 14:32–50).');
 if(save.passionView||['emptySeat','morning','passionChoice'].includes(s))refs.append(' 베드로가 세 번 부인하고 밖에 나가 울었다(눅 22:54–62).');
 if(isEighth()||s==='seventhEnd'){refs.append(' 빌라도가 판결했고 로마 군인들이 십자가형을 집행했다. 예수님이 죽으신 뒤 요셉이 장사했고 여인들은 안식일에 쉬었다(눅 23:13–56).');by('memory').lastElementChild.append(save.mealView==='door'?' 보리는 문간에서 마지막 식사를 지켜보고 안식일 길가에서 쉬었다.':' 보리는 식탁 가까이서 마지막 식사를 지켜보고 안식일 길가에서 쉬었다.');}
}

// Timed checkpoints restart the scene; restore its opening narration along with its actors.
if(isSeventh()){
 const resumeLines={
 washFeet:['예수님이 수건을 두르고 제자들의 발을 씻기신다.　요 13:1–17',6],
 lastMeal:['예수님이 감사하시고 떡을 떼어 제자들에게 주시며 자신을 기억하라고 하신다.　눅 22:14–23',4],
 prayer:['예수님은 아버지의 뜻이 이루어지기를 기도하신다.',6],
 seize:['유다가 입맞춤으로 예수님을 가리킨다. 무리가 그분을 붙잡고 제자들은 흩어진다.',7],
 threeAnswers:['한 여종이 그도 예수님과 함께 있었다고 하자 베드로가 처음으로 부인한다.',4],
 sentence:['빌라도는 사형에 해당할 죄를 찾지 못했다고 말했으나 결국 예수님을 십자가에 못 박도록 넘긴다.',7],
 crucified:['보리는 사람들 곁에서 로마 군인들이 십자가형을 집행하는 언덕을 멀리 바라본다.',5],
 laidToRest:['요셉이 예수님의 몸을 세마포로 싸서 바위 무덤에 모신다.　눅 23:50–56',7]
 };
 const line=resumeLines[save.chapterStep];if(line)caption(...line);
}
