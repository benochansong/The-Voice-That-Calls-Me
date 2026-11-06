// Separate playable spaces preserve the boundary between the journey and the parables.
const fifthSets={wayside:new T.Group(),ravine:new T.Group(),jericho:new T.Group(),fold:new T.Group()};
for(const set of Object.values(fifthSets))scene.add(set);
Object.assign(laterSets,fifthSets);
const {wayside,ravine,jericho,fold}=fifthSets;
const fifth={
 neighbor:[0,-1.8,'call','예수님의 목소리','길가에 모인 사람들 곁으로 가기','이웃에 관한 이야기 듣기','wayside'],
 wounded:[-2,1,'cry','여행자의 가쁜 숨','바위 아래 쓰러진 여행자 곁으로 가기','그 곁에 머물기','ravine'],
 tending:[-2,1,'step','돌아오는 나귀 발굽','지나가는 발걸음과 돌아오는 발굽 소리 듣기','','ravine'],
 toInn:[1.8,-5,'step','여관 문턱의 발소리','사마리아인과 나귀를 따라 여관으로 걷기','여관 주인 곁에 서기','ravine'],
 inn:[1.8,-5,'call','여관에 남긴 부탁','여관 문간에서 이야기를 끝까지 듣기','','ravine'],
 embers:[0,-4.5,'step','여리고로 가는 발걸음','앞길로 떠나거나 왼쪽 모닥불에서 선택 비유 듣기','여리고 길로 떠나기','wayside'],
 crag:[0,-1.8,'step','바위 너머 목자의 발소리','작은 양의 눈높이로 바위틈 입구까지 걷기','목자의 발소리 듣기','fold'],
 found:[0,-1.8,'call','목자의 부름','다가오는 목자를 기다리기','','fold'],
 outcry:[-3.5,2.1,'cry','바디매오의 외침','군중 너머 길 왼쪽의 외침을 찾아가기','멈춰 외침 듣기','jericho'],
 called:[-2.6,.8,'call','예수님이 멈추신 자리','예수님이 바디매오를 부르시는 모습 지켜보기','','jericho'],
 tree:[2.8,-3.5,'step','나뭇잎 스치는 소리','여리고 안쪽의 돌무화과나무로 가기','내려올 자리 찾기','jericho'],
 roomTree:[1.1,-2.2,'step','나무 아래의 발소리','나무 왼쪽 빈자리로 한 걸음 물러서기','삭개오가 내려오는 길 바라보기','jericho'],
 welcome:[1.1,-2.2,'call','나무 아래의 부름','삭개오가 내려오는 모습 바라보기','','jericho'],
 supperDoor:[-3.5,-5,'step','집 안의 저녁 식사 소리','삭개오의 집 문간으로 따라가기','저녁 식탁 곁에 앉기','jericho'],
 pledge:[-3.5,-5,'call','삭개오의 목소리','저녁 식탁에서 삭개오의 말 듣기','','jericho'],
 fifthEnd:[-3.5,-5,'step','저녁 골목의 발소리','5장 끝 · 삭개오의 집','예루살렘으로 떠나기','jericho']
};
Object.assign(laterBeats,fifth);
function isFifth(){return Object.hasOwn(fifth,save.chapterStep)}
for(const [key,set] of Object.entries(fifthSets)){
 cube(set,key==='fold'?0x9a967a:0xc8a878,0,-.22,0,48,.43,38);
 for(let i=0;i<18;i++)oval(set,key==='ravine'?0xb68b67:0x979a72,Math.sin(i*2.7)*25,-.3,-14-i%4*2,4,2+i%4,4);
}
const campTeacher=actor(wayside,0,-2.7,linen);
actor(wayside,1.3,-2.4,0x9b8064);actor(wayside,-1.4,-2.9,0x788779);
for(let i=0;i<8;i++)oval(wayside,0x807565,-3.4+.55*Math.cos(i*.79),.09,.7+.55*Math.sin(i*.79),.18,.14,.14);
const flame=oval(wayside,0xe99a47,-3.4,.4,.7,.25,.48,.22);
const campGlow=new T.PointLight(0xffa657,6,6);campGlow.position.set(-3.4,.8,.7);wayside.add(campGlow);
for(let i=0;i<14;i++)oval(ravine,0xab8666,(i%2?1:-1)*(4.6+i%3),.3,-6+i,1.5,1+i%3*.5,1.8);
const injured=actor(ravine,-2,1,0x976e5c),helper=actor(ravine,1,5.5,0x67887b);
const walkers=[actor(ravine,0,4,0xa5926b),actor(ravine,.8,5.5,0x7c7e71)];
const donkey=new T.Group();ravine.add(donkey);
oval(donkey,0x998775,0,.72,0,.39,.43,.68);
oval(donkey,0x998775,0,1.15,-.5,.21,.32,.26);
for(const side of [-1,1]){
 oval(donkey,0x877768,side*.12,1.52,-.46,.075,.24,.07);
 for(const z of [-.38,.38])cube(donkey,0x796d62,side*.22,.32,z,.12,.62,.14);
}
cube(ravine,0xc39873,2.4,1.45,-7.3,5.2,2.9,.35);
cube(ravine,wood,2.3,1.08,-7.05,1.45,2.16,.12);
const keeper=actor(ravine,2.8,-5.75,0x967952);
const wrap=oval(ravine,linen,-2,.47,1,.28,.16,.23);
const coins=[0,1].map(i=>oval(ravine,0xcac4a4,2.52+i*.13,.98,-5.52,.073,.027,.073));
for(let i=0;i<10;i++)oval(fold,0x817d71,(i%2?1:-1)*(2.4+i%3*.7),.4,3.8-i*.95,1.3,1.2+i%3*.35,1.45);
const shepherd=actor(fold,0,-6.3,0xa08261);
cube(shepherd,wood,.42,.96,0,.065,1.92,.065);
const lambView=sheep.clone();fold.add(lambView);lambView.scale.setScalar(.73);
const caller5=actor(jericho,0,.2,linen),bart=actor(jericho,-3.65,1.5,0xa88969);
const cloak=oval(jericho,0x987955,-3.6,.09,1.65,.53,.07,.45);
const zac=actor(jericho,3.4,-4.3,0x8e675e,.88);
cube(jericho,wood,3.7,1.85,-4.5,.62,3.7,.6);
cube(jericho,wood,3.26,2.1,-4.4,1.4,.22,.34).rotation.z=.24;
for(let i=0;i<7;i++)oval(jericho,0x778854,3.8+Math.sin(i*2)*1.15,3.75+i%3*.38,-4.65+Math.cos(i)*.8,1.15,.77,1.1);
for(let i=0;i<10;i++)actor(jericho,(i%2?1:-1)*(1.55+i%3*.48),-1.1+Math.floor(i/2)*.95,0x948572+i*0x010103,.87);
for(let i=0;i<7;i++){const z=-7+i*2.4;cube(jericho,0xc29a75,-7,1.65,z,2.1,3.3,2.28);cube(jericho,linen,-7,3.33,z,2.4,.18,2.5)}
cube(jericho,wood,-3.9,.57,-6.55,2.8,.17,1.06);
for(let i=0;i<4;i++)oval(jericho,0xb88351,-4.8+i*.58,.73,-6.55,.21,.1,.18);
function syncFifth(b){
 const parable=b[6]==='ravine'||b[6]==='fold';
 document.body.classList.toggle('parable',parable);
 document.querySelector('header small').textContent=parable?'제5장 · 예수님이 들려주신 비유':'여리고로 가는 길 · 제5장';
 scene.background.set(b[6]==='fold'?0xc7ba9c:save.chapterStep==='embers'?0xcbab96:0xe3c7a6);
 sheep.visible=b[6]!=='fold';return true;
}
function fifthBlocked(x,z){
 const area=fifth[save.chapterStep][6];
 if(area==='fold')return Math.abs(x)>1.4||z>3.9||z< -2.5;
 return Math.abs(x)>5.55||z>7.3||z< -6.25||area==='jericho'&&Math.hypot(x-3.7,z+4.5)<.56;
}
function fifthSounds(){
 const s=save.chapterStep;
 if(s==='embers'&&!save.lostParable)return [chapterCue(),[-3.4,.7,'call','불가에서 들리는 이야기']];
 if(s==='tending')return [[helper.position.x,helper.position.z,'step','나귀의 발굽'],[walkers[0].position.x,walkers[0].position.z,'step','멀어지는 발소리']];
 if(s==='found')return [[shepherd.position.x,shepherd.position.z,'step','다가오는 목자의 발걸음']];
 return [chapterCue()];
}
const unit=t=>T.MathUtils.clamp(t,0,1);
function updateFifth(dt){
 const s=save.chapterStep,b=fifth[s],area=b[6],t=beatTime,p=sheep.position;
 p.y=0;
 by('place').textContent={wayside:'여리고로 가는 길',ravine:'비유 · 여행자와 여관',fold:'비유 · 목자를 기다리는 양',jericho:'여리고 · 길가에서 식탁까지'}[area];
 const fire=s==='embers'&&!save.lostParable&&distance(-3.4,.7)<1.45;
 by('hint').textContent=fire?'E · 잃은 양의 비유 듣기':b[5]&&distance(b[0],b[1])<1.55?'E · '+b[5]:b[4];
 if(s==='embers'&&save.lostParable)by('hint').textContent=distance(0,-4.5)<1.55?'E · 여리고 길로 떠나기':'모닥불을 떠나 앞길로 걷기';
 if(area==='wayside'){flame.scale.y=.43+Math.sin(clock*7)*.06;return}
 if(area==='fold'){
 const approach=s==='found'?unit(t/5):0;
 shepherd.position.z=-6.3+approach*3.9;
 lambView.position.copy(p);lambView.rotation.copy(sheep.rotation);
 if(s==='found'){lambView.position.lerp(new T.Vector3(.12,1.6,-2.45),unit((t-5)/2));lambView.rotation.z=unit((t-5)/2)*.85}
 if(s==='found'&&t-dt<5&&t>=5)caption('목자는 찾은 양을 기뻐하며 어깨에 메고 돌아간다.　눅 15:3–7',4);
 if(s==='found'&&t>=9){save.lostParable=true;enterBeat('embers',[-3.3,0,1.7]);caption('다시 모닥불 곁. 예수님은 회개하는 한 사람을 두고 하늘에서 기뻐한다고 들려주신다.',6)}
 return;
 }
 if(area==='ravine'){
 const atInn=s==='inn',escort=s==='toInn',care=s==='tending';
 const arrival=care?unit((t-3)/3):atInn||escort?1:0;
 const march=escort?unit((1-p.z)/5.7):atInn?1:0;
 helper.position.set(1.2-3*arrival+3.7*march,0,5.7-4.55*arrival-6.15*march);
 helper.scale.y=care&&arrival>.8?.72:1;
 donkey.position.set(helper.position.x+.65,0,helper.position.z+.56);
 injured.rotation.z=escort||atInn?.24:1.38;
 injured.position.set(escort||atInn?donkey.position.x:-2,escort||atInn?1.02:.33,escort||atInn?donkey.position.z:1);
 wrap.visible=care&&t>5||escort||atInn;wrap.position.set(injured.position.x,injured.position.y+.18,injured.position.z);
 walkers.forEach((a,i)=>{a.position.z=care?4+i*2-Math.min(10,Math.max(0,t-i*1.3)*2):escort||atInn?-6:4+i*2});
 coins.forEach(c=>c.visible=atInn);
 if(care&&t-dt<3&&t>=3)caption('제사장과 레위인은 지나간다. 사마리아인은 다친 사람에게 다가와 상처를 싸맨다.',5);
 if(care&&t>8){enterBeat('toInn');caption('그는 여행자를 자기 짐승에 태워 여관으로 데려간다. 발굽 소리를 따라 걷자.',5)}
 if(atInn&&t>6){enterBeat('embers',[0,0,4.2]);caption('이웃이 되어 준 이는 자비를 베푼 사람이었다. 비유가 끝나고 길가의 소리가 돌아온다.　눅 10:25–37',6)}
 return;
 }
 const afterCall=!['outcry','called'].includes(s);
 const healed=afterCall?1:s==='called'?unit((t-5)/2):0;
 bart.position.set(-3.65+healed*2.6,0,1.5-healed*2.8);bart.scale.y=.56+.44*healed;
 cloak.visible=afterCall||s==='called';
 const descended=['supperDoor','pledge','fifthEnd'].includes(s)?1:s==='welcome'?unit((t-1)/3):0;
 const home=s==='pledge'||s==='fifthEnd'?1:s==='supperDoor'?unit((-p.x+1)/4.4):0;
 zac.position.set(3.35-descended*.8-home*6.1,2.19*(1-descended),-4.34+descended*.55-home*2.2);
 caller5.position.set(afterCall?2.1-home*5.6:0,0,afterCall?-3.2-home*2.7:.3);
 if(s==='called'&&t-dt<4&&t>=4)caption('예수님이 무엇을 원하는지 물으시자 바디매오는 보기를 원한다고 답한다.',4);
 if(s==='called'&&t>8){enterBeat('tree');caption('바디매오는 곧 보게 되어 예수님을 길에서 따랐다.　막 10:46–52　·　이어서 누가가 전하는 여리고 이야기.',6)}
 if(s==='welcome'&&t>5){enterBeat('supperDoor');caption('삭개오가 서둘러 내려와 기뻐하며 예수님을 맞아들인다. 집 문간으로 따라가자.',5)}
 if(s==='pledge'&&t-dt<5&&t>=5)caption('삭개오는 가난한 이들에게 재산의 절반을 주고, 속여 빼앗은 것은 네 배로 갚겠다고 말한다.',6);
 if(s==='pledge'&&t>11){enterBeat('fifthEnd');caption('예수님은 오늘 이 집에 구원이 이르렀다고 말씀하신다.　눅 19:1–10',6)}
}
function fifthAction(){
 const s=save.chapterStep,b=fifth[s];
 if(s==='embers'&&!save.lostParable&&distance(-3.4,.7)<1.45){enterBeat('crag',[0,0,3.4]);caption('예수님이 들려주시는 별도의 비유. 작은 양의 자리에서 목자가 오는 길을 바라본다.　눅 15:3–7',6);return}
 if(distance(b[0],b[1])>=1.55)return;
 switch(s){
 case 'neighbor':enterBeat('wounded',[0,0,6.3]);caption('비유 속 길 · 예루살렘에서 여리고로 내려가던 여행자가 강도를 만나 쓰러졌다.',5);break;
 case 'wounded':enterBeat('tending');caption('길가에 멈추면, 발걸음이 가까워졌다가 반대편으로 멀어진다.',3);break;
 case 'toInn':enterBeat('inn');caption('이튿날 사마리아인은 두 데나리온을 건네며 돌보아 달라고 부탁하고, 더 든 비용도 돌아와 갚겠다고 한다.',6);break;
 case 'embers':enterBeat('outcry',[0,0,6.3]);caption('마가가 전하는 여리고 밖 길. 바디매오가 예수님께 자비를 구한다.　막 10:46–52',5);break;
 case 'crag':enterBeat('found');caption('아흔아홉 마리를 두고 잃은 한 마리를 찾아온 목자의 발걸음이 가까워진다.',5);break;
 case 'outcry':enterBeat('called');caption('군중이 조용히 하라 해도 외침은 커진다. 예수님이 멈추어 그를 부르시니 그가 겉옷을 벗어 던진다.',4);break;
 case 'tree':enterBeat('roomTree');caption('사람들 위로 삭개오가 보인다. 나무 왼쪽으로 비켜서면 그가 내려올 공간이 있다.',4);break;
 case 'roomTree':enterBeat('welcome');caption('예수님이 위를 올려다보고 삭개오의 이름을 부르시며 오늘 그의 집에 머물겠다고 하신다.',5);break;
 case 'supperDoor':enterBeat('pledge');caption('식탁에 모인 사람들 사이에서 삭개오가 직접 일어나 자신의 결정을 말한다.',5);break;
 case 'fifthEnd':enterBeat('ridge',[0,0,7]);caption('제6장　성으로 들어가는 길 · 올리브 산에서 예루살렘으로 내려가는 길에 제자들의 찬양이 들린다.',6);break;
 }
}
function appendFifthRecord(refs){
 const s=save.chapterStep,b=fifth[s];
 if(isSixth()||s==='embers'||b[6]==='fold'||b[6]==='jericho')refs.append(' 선한 사마리아인은 다친 여행자를 돌보고 여관 주인에게 부탁했다(눅 10:25–37).');
 if(save.lostParable)refs.append(' 목자가 잃은 양 한 마리를 찾고 기뻐하는 비유도 들었다(눅 15:3–7).');
 if(isSixth()||b[6]==='jericho'&&!['outcry','called'].includes(s))refs.append(' 예수님은 바디매오를 부르시고 그의 청을 들으셨다. 그가 보게 되어 따랐다(막 10:46–52).');
 if(isSixth()||s==='fifthEnd'){refs.append(' 삭개오는 예수님을 맞으며 나눔과 배상을 약속했다(눅 19:1–10).');by('memory').lastElementChild.append(' 보리는 나무 아래 자리를 비우고 저녁 식탁까지 걸어왔다.');}
}
