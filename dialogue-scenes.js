// Stable identifiers are shared with the offline voice bank. Text is spoken without labels or references.
const spokenLines={
 "angelNews": {
  "role": "angel",
  "text": "무서워하지 마라. 너희에게 기쁜 소식을 전하러 왔다."
 },
 "shepherdCome": {
  "role": "shepherd",
  "text": "베들레헴으로 갑시다. 우리도 그 아기를 봅시다."
 },
 "sellerAside": {
  "role": "seller",
  "text": "지나가렴. 길을 내줄게."
 },
 "childCome": {
  "role": "child",
  "text": "이제 풀렸어. 같이 가자."
 },
 "fishersCall": {
  "role": "jesus",
  "text": "나를 따라오너라."
 },
 "walkHome": {
  "role": "jesus",
  "text": "일어나 네 자리를 들고 집으로 가거라."
 },
 "leviCall": {
  "role": "jesus",
  "text": "나를 따라오너라."
 },
 "merchantWater": {
  "role": "seller",
  "text": "여기 물을 놓아 줄게."
 },
 "hillChild": {
  "role": "child",
  "text": "내 옆에 있어 줄래?"
 },
 "hillFlowers": {
  "role": "jesus",
  "text": "들에 핀 꽃들이 어떻게 자라는지 보아라."
 },
 "wakeUp": {
  "role": "disciple",
  "text": "선생님, 우리가 물에 빠지게 됐습니다!"
 },
 "calmSea": {
  "role": "jesus",
  "text": "바람아, 그쳐라. 바다야, 잔잔해져라."
 },
 "fiveLoaves": {
  "role": "disciple",
  "text": "떡 다섯 개와 물고기 두 마리가 있습니다."
 },
 "mercyCall": {
  "role": "bartimaeus",
  "text": "다윗의 자손 예수님, 저를 불쌍히 여겨 주세요!"
 },
 "whatWant": {
  "role": "jesus",
  "text": "내가 너에게 무엇을 해 주기를 바라느냐?"
 },
 "seeAgain": {
  "role": "bartimaeus",
  "text": "선생님, 다시 보고 싶습니다."
 },
 "zacCome": {
  "role": "jesus",
  "text": "삭개오야, 내려오너라. 오늘은 네 집에 머물겠다."
 },
 "zacGive": {
  "role": "zacchaeus",
  "text": "가진 것의 절반을 가난한 이들에게 나누겠습니다."
 },
 "hosanna": {
  "role": "disciple",
  "text": "주님의 이름으로 오시는 임금님께 복이 있습니다!"
 },
 "widowGift": {
  "role": "jesus",
  "text": "저 여인은 살아갈 돈을 모두 넣었단다."
 },
 "rememberMe": {
  "role": "jesus",
  "text": "이 떡을 나누며 나를 기억하여라."
 },
 "peterNo": {
  "role": "peter",
  "text": "나는 그분을 모르오."
 },
 "maryQuestion": {
  "role": "angel",
  "text": "여인아, 왜 울고 있느냐?"
 },
 "maryName": {
  "role": "jesus",
  "text": "마리아야."
 },
 "maryTeacher": {
  "role": "mary",
  "text": "선생님!"
 },
 "maryWitness": {
  "role": "mary",
  "text": "내가 주님을 뵈었어요."
 },
 "breakfast": {
  "role": "jesus",
  "text": "이리 와서 아침을 먹어라."
 },
 "loveAsk": {
  "role": "jesus",
  "text": "요한의 아들 시몬아, 네가 나를 사랑하느냐?"
 },
 "loveAnswer": {
  "role": "peter",
  "text": "주님, 제가 주님을 사랑하는 줄 아시지요."
 },
 "tendLambs": {
  "role": "jesus",
  "text": "내 양들을 돌보아라."
 },
 "followMe": {
  "role": "jesus",
  "text": "나를 따라오너라."
 }
};

// Actors are resolved when their line starts; the prologue cast is built only for prologue saves.
const spokenCues={
 angelNews:[()=>nativitySet.messenger,'천사','warm','눅 2:10–12 · 의역'],
 shepherdCome:[()=>nativitySet.companions[0],'목자','joy','눅 2:15 · 의역'],
 sellerAside:[()=>seller,'생선 장수','warm','창작 대사'],
 childCome:[()=>kid,'장터 아이','joy','창작 대사'],
 fishersCall:[()=>standingGiver,'예수님','warm','막 1:16–18 · 의역'],
 walkHome:[()=>teachers,'예수님','resolve','막 2:11 · 의역'],
 leviCall:[()=>caller,'예수님','warm','막 2:14 · 의역'],
 merchantWater:[()=>merchant,'식탁 곁 장사꾼','warm','창작 대사'],
 hillChild:[()=>little,'언덕 아래 아이','concern','창작 대사'],
 hillFlowers:[()=>mountTeacher,'예수님','calm','마 6:28 · 의역'],
 wakeUp:[()=>mariners[0],'제자','concern','막 4:38 · 의역'],
 calmSea:[()=>captain,'예수님','resolve','막 4:39 · 의역'],
 fiveLoaves:[()=>servers[0],'제자','concern','막 6:38 · 의역'],
 mercyCall:[()=>bart,'바디매오','concern','막 10:47–48 · 의역'],
 whatWant:[()=>caller5,'예수님','warm','막 10:51 · 의역'],
 seeAgain:[()=>bart,'바디매오','resolve','막 10:51 · 의역'],
 zacCome:[()=>caller5,'예수님','warm','눅 19:5 · 의역'],
 zacGive:[()=>zac,'삭개오','resolve','눅 19:8 · 의역'],
 hosanna:[()=>worshippers[3],'찬양하는 제자','joy','눅 19:37–38 · 의역'],
 widowGift:[()=>stoneTeacher,'예수님','calm','막 12:43–44 · 의역'],
 rememberMe:[()=>aTeacher,'예수님','warm','눅 22:19 · 의역'],
 peterNo:[()=>peter7,'베드로','concern','눅 22:57 · 의역'],
 maryQuestion:[()=>angels8[0],'천사','warm','요 20:13 · 의역'],
 maryName:[()=>gardener,'예수님','warm','요 20:16 · 의역'],
 maryTeacher:[()=>magdalene,'막달라 마리아','wonder','요 20:16 · 의역'],
 maryWitness:[()=>magdalene,'막달라 마리아','joy','요 20:18 · 의역'],
 breakfast:[()=>host8,'예수님','warm','요 21:12 · 의역'],
 loveAsk:[()=>host8,'예수님','calm','요 21:15 · 의역'],
 loveAnswer:[()=>peter8,'베드로','warm','요 21:15 · 의역'],
 tendLambs:[()=>host8,'예수님','warm','요 21:16 · 의역'],
 followMe:[()=>host8,'예수님','resolve','요 21:19 · 의역']
};

// Offsets are measured against the chapter's own paused/restarted clock.
// Keep the offerings, rooster, Sabbath and the space after Mary's testimony quiet.
const sceneLines={
 'nativity.goodNews':[[.6,'angelNews']],
 'nativity.toVillage':[[.4,'shepherdCome']],
 dockCall:[[.7,'fishersCall']],
 healing:[[5.1,'walkHome']],
 supper:[[.4,'leviCall']],
 dusk:[[.4,'merchantWater']],
 lake:[[.4,'hillFlowers']],
 hush:[[.1,'wakeUp'],[4.05,'calmSea']],
 bread:[[.45,'fiveLoaves']],
 outcry:[[.5,'mercyCall']],
 called:[[1.55,'whatWant'],[4.55,'seeAgain']],
 welcome:[[.15,'zacCome']],
 pledge:[[5.1,'zacGive']],
 procession:[[.5,'hosanna']],
 twilight:[[.4,'widowGift']],
 lastMeal:[[.35,'rememberMe']],
 threeAnswers:[[.4,'peterNo']],
 herName:[[.8,'maryQuestion'],[5.1,'maryName'],[7.1,'maryTeacher']],
 testimony:[[.45,'maryWitness']],
 mealMorning:[[.45,'breakfast']],
 threeCalls:[[.15,'loveAsk'],[4.55,'loveAnswer'],[9.0,'tendLambs'],[16.0,'followMe']]
};
function sceneDialogueKey(){
 if(save.prologue)return 'nativity.'+save.prologue;
 if(save.chapterStep)return save.chapterStep;
 if(sceneTime>=0)return 'dockCall';
 return save.done?'afterDock':'market';
}
function speakSceneLine(id){
 const [actor,speaker,emotion,reference]=spokenCues[id];
 const {role,text}=spokenLines[id];
 sayCharacter(actor(),role,text,emotion,{speaker,reference});
}
let dialogueScene=null,dialogueIndex=0,marketSellerSpoke=false,marketChildJoined=false,hillChildJoined=false;
function updateSceneDialogue(){
 const key=sceneDialogueKey();
 if(dialogueScene!==key){
  dialogueScene=key;dialogueIndex=0;
  // Restoring a save with a companion must not repeat the invitation.
  marketSellerSpoke=sellerSeen;marketChildJoined=Boolean(save.child);hillChildJoined=Boolean(save.hillChild);
 }
 if(key==='market'){
  if(save.child&&!marketChildJoined)speakSceneLine('childCome');
  else if(sellerSeen&&!marketSellerSpoke)speakSceneLine('sellerAside');
  marketChildJoined=Boolean(save.child);marketSellerSpoke=sellerSeen;
 }else if(key==='climb'&&save.hillChild&&!hillChildJoined){
  hillChildJoined=true;speakSceneLine('hillChild');
 }
 const lines=sceneLines[key];if(!lines||dialogueIndex>=lines.length)return;
 const time=save.prologue?nativityTime:key==='dockCall'?sceneTime:beatTime;
 const [at,id]=lines[dialogueIndex];
 if(time>=at){dialogueIndex++;speakSceneLine(id)}
}
