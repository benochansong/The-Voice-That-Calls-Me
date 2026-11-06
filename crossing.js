// The hull rocks independently of the camera. Match Bori's deck height to its roll.
const crossing=new T.Group(), meadow=new T.Group(), hull=new T.Group();
scene.add(crossing,meadow);crossing.add(hull);
Object.assign(laterSets,{crossing,meadow});
const route={
 boarding:[0,.8,'step','돛줄이 우는 소리','갑판 가운데로 걸어가기','호수 건너기','crossing'],
 gale:[-1.45,-1.4,'step','밧줄이 부딪히는 소리','왼쪽 밧줄이나 오른쪽 제자 곁에서 몸 낮추기','몸 낮추기','crossing'],
 hush:[0,-3.4,'call','제자들이 부르는 소리','고물 쪽을 바라보기','','crossing'],
 quiet:[0,-2.8,'water','잔잔해진 물소리','고물의 예수님 곁으로 가기','잔잔한 물결 바라보기','crossing'],
 shoreRest:[0,3.4,'water','물가의 잔물결','선미 반대쪽으로 돌아가기 · 왼쪽에서 선택 기억 듣기','다른 날의 빈 들로','crossing'],
 family:[3.8,3.1,'step','늦게 온 가족의 발소리','오른쪽 길에서 늦게 온 가족 만나기','가족에게 다가가기','meadow'],
 seats:[-3.6,-2.4,'step','풀밭에서 부르는 소리','가족을 왼쪽 빈 자리로 이끌기','풀밭에 함께 앉기','meadow'],
 bread:[0,-5,'call','떡을 나누는 자리','앞쪽에서 예수님과 제자들을 바라보기','떡과 물고기 바라보기','meadow'],
 sharing:[3,-1,'step','제자들의 발걸음','음식을 나누는 제자를 따라 오른쪽 무리로 가기','사람들 곁에 머물기','meadow'],
 baskets:[0,3.4,'step','광주리 놓는 소리','다시 길 입구로 돌아와 광주리 살펴보기','남은 조각 바라보기','meadow'],
 fourthEnd:[0,3.4,'step','풀잎 스치는 소리','4장 끝 · 빈 들의 저녁','여행 수첩 펼치기','meadow']
};
Object.assign(laterBeats,route);
function isFourth(){return Object.hasOwn(route,save.chapterStep)}
const deep=cube(crossing,0x517e89,0,-.85,0,145,.4,145);
for(let i=0;i<25;i++)oval(crossing,0x778c8c,Math.sin(i*2.1)*58,0,-38-i%6*3,6,2+i%4,4);
for(let i=-5;i<=5;i++){
 const len=10-Math.abs(i)*.67;
 cube(hull,i%2?0xa67750:0xb68456,i*.42,0,0,.415,.19,len);
}
for(const side of [-1,1]){
 cube(hull,wood,side*2.28,.28,0,.18,.64,6.5);
 for(let end of [-1,1])cube(hull,wood,side*1.12,.28,end*4.02,.16,.59,2.9).rotation.y=-side*end*.94;
}
cube(hull,wood,-.7,2.25,.3,.16,4.5,.16);
const sail=cube(hull,linen,.27,3.23,.3,1.98,1.95,.07);
const lamp=oval(hull,0xffc16c,-.67,1.67,.37,.16,.26,.16);
for(let i=0;i<4;i++)part(hull,new T.TorusGeometry(.3+i*.055,.036,5,18),wood,-1.4,.14+i*.04,-1.35,1,1,1).rotation.x=Math.PI/2;
const captain=actor(hull,0,-3.65,linen),mariners=[actor(hull,1.5,-1.6,0x728579),actor(hull,-1.4,1.5,0xb18065)];
const swells=[];
for(let i=0;i<42;i++){
 const x=(i%7-3)*5.3,z=(Math.floor(i/7)-3)*5.4;
 if(Math.abs(x)<3&&Math.abs(z)<6)continue;
 swells.push(oval(crossing,0x98bac0,x,-.55,z,2.75,.3,.48));
}
cube(meadow,0x9ead76,0,-.22,0,60,.42,48);
for(let i=0;i<24;i++)oval(meadow,0x82976e,Math.sin(i*2.7)*29,.2,-15-i%4*2,4,1.7+i%3,4);
const lateFamily=[actor(meadow,4.5,2.9,0xaa735d),actor(meadow,4,3.6,0xc09c60,.71)];
const host=actor(meadow,0,-6.2,linen),servers=[actor(meadow,-1,-5.4,0x748b7e),actor(meadow,1,-5.4,0xa17f61)];
for(let i=0;i<40;i++){
 const row=Math.floor(i/8),col=i%8;
 const x=(col<4?-1:1)*(2.3+(col%4)*1.15),z=-5.7+row*1.85;
 if(Math.hypot(x+3.6,z+2.4)<1.85||Math.hypot(x-3,z+1)<1.35)continue;
 actor(meadow,x,z,[0x899179,0xbc9477,0x9b8979,0x81949a][(col+row)%4],.8).scale.y=.52;
}
const loaves=[],fish=[],fragments=[];
for(let i=0;i<5;i++)loaves.push(oval(meadow,0xc18a47,-.65+i*.29,.25,-5.8,.17,.13,.23));
for(let i=0;i<2;i++)fish.push(oval(meadow,0x77999d,.55+i*.28,.21,-5.5,.12,.08,.27));
for(let i=0;i<12;i++){
 const x=(i%6-2.5)*.75,z=4.7+Math.floor(i/6)*.68;
 part(meadow,new T.CylinderGeometry(.28,.18,.34,9),0xa27c4d,x,.17,z,1,1,1);
 oval(meadow,0x5b4935,x,.346,z,.24,.02,.24);
 fragments.push(oval(meadow,0xe4b477,x,.39,z,.2,.12,.2));
}
function fourthBlocked(x,z){
 if(route[save.chapterStep][6]==='meadow')return Math.abs(x)>7||z>7.8||z< -6.5;
 return Math.abs(z)>4.35||Math.abs(x)>Math.min(2,4.8-Math.abs(z))||Math.hypot(x+.7,z-.3)<.36;
}
function syncFourth(b){
 document.querySelector('header small').textContent='갈릴리 · 제4장';
 scene.background.set(b[6]==='crossing'?0x98b4b7:0xe7d6ae);
 return true;
}
const stormSky=new T.Color(0x627785),calmSky=new T.Color(0xb4cbca);
let gustNoise,nextGust=0;
function playGust(strength){
 if(!audio||prefs.mute||strength<.08||clock<nextGust)return;
 nextGust=clock+1;
 if(!gustNoise){
  gustNoise=audio.createBuffer(1,audio.sampleRate,audio.sampleRate);
  const samples=gustNoise.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
 }
 const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain(),t=audio.currentTime;
 source.buffer=gustNoise;filter.type='lowpass';filter.frequency.value=290+strength*430;
 gain.gain.setValueAtTime(.001,t);gain.gain.linearRampToValueAtTime(.095*strength,t+.4);gain.gain.exponentialRampToValueAtTime(.001,t+.98);
 source.connect(filter).connect(gain).connect(audio.destination);source.start();
}
function updateFourth(dt){
 const s=save.chapterStep,b=route[s],p=sheep.position;
 const aboard=b[6]==='crossing',near=distance(b[0],b[1])<1.55;
 const sailorSpot=s==='gale'&&distance(1.45,-1.4)<1.55;
 const memorySpot=s==='shoreRest'&&distance(-1.65,.3)<1.25;
 by('place').textContent=aboard?'갈릴리 호수 · 작은 배':'갈릴리 · 빈 들의 풀밭';
 by('hint').textContent=memorySpot?'E · 야이로의 딸과 여인의 기억 듣기':b[5]&&(near||sailorSpot)?'E · '+b[5]:b[4];
 if(aboard){
 const storm=s==='gale'?Math.min(1,.28+beatTime/3):s==='hush'?1-T.MathUtils.clamp((beatTime-4)/4,0,1):0;
 playGust(storm);
 hull.rotation.z=Math.sin(clock*2.3)*(.012+.095*storm);hull.rotation.x=Math.cos(clock*1.9)*(.008+.05*storm);
 p.y=.12+Math.sin(hull.rotation.z)*p.x-Math.sin(hull.rotation.x)*p.z;
 swells.forEach((w,i)=>{const phase=clock*(1+storm)+i;w.position.y=-.59+Math.sin(phase)*(.09+.42*storm);w.scale.y=.18+.62*storm;w.rotation.z=Math.cos(phase)*storm*.15});
 scene.background.copy(calmSky).lerp(stormSky,storm);
 lamp.rotation.z=Math.sin(clock*3)*storm*.45;sail.rotation.y=Math.sin(clock*4)*storm*.21;
 const sleeping=s==='boarding'||s==='gale';captain.rotation.z=sleeping?1.23:Math.max(0,1.23-beatTime);
 captain.position.y=.14;
 mariners[0].position.z=s==='hush'? -1.6-Math.min(1.5,beatTime):s==='gale'||s==='boarding'?-1.6:-3.1;
 if((s==='gale'||s==='hush')&&save.shelter)sheep.scale.y=.65;
 if(s==='gale'&&beatTime>=16)wakeDisciples();
 if(s==='hush'&&beatTime-dt<4&&beatTime>=4)caption('예수님이 일어나 바람을 꾸짖고 바다에 잠잠하라고 말씀하신다.',4);
 if(s==='hush'&&beatTime>=8.8){enterBeat('quiet');caption('바람이 그치고 호수가 아주 잔잔해졌다.　막 4:35–41',5)}
 return;
 }
 p.y=0;const guiding=s==='seats',arrived=!guiding&&s!=='family';
 lateFamily.forEach((a,i)=>{
 const x=guiding?p.x+(i?1:.65):arrived?-3.6+i*.8:4.5-i*.5;
 const z=guiding?p.z+.75+i*.3:arrived?-2.85:2.9+i*.7;
 a.position.x+=(x-a.position.x)*Math.min(1,dt*2.8);a.position.z+=(z-a.position.z)*Math.min(1,dt*2.8);
 a.scale.y=arrived?.54:i?.71:1;
 });
 const distributed=['sharing','baskets','fourthEnd'].includes(s);
 servers.forEach((a,i)=>{const t=s==='sharing'?Math.min(1,beatTime/4):distributed?1:0;
 a.position.set((i?1:-1)*(1+2*t),0,-5.4+4.4*t)});
 loaves.concat(fish).forEach((food,i)=>{food.position.z=distributed?servers[i%2].position.z+.22:-5.8+(i>=5?.3:0);food.position.x=distributed?servers[i%2].position.x+(i%3-1)*.16:i<5?-.65+i*.29:.55+(i-5)*.28;food.position.y=distributed?.88:.25});
 fragments.forEach(f=>f.visible=s==='baskets'||s==='fourthEnd');
}
function wakeDisciples(){enterBeat('hush');caption('겁에 질린 제자들이 고물에서 주무시던 예수님을 깨운다.',4)}
function fourthAction(){
 const s=save.chapterStep,b=route[s];
 if(s==='shoreRest'&&distance(-1.65,.3)<1.25){
 save.shoreMemory=true;checkpoint();journal();return;
 }
 if(s==='gale'&&(distance(-1.45,-1.4)<1.55||distance(1.45,-1.4)<1.55)){
 save.shelter=sheep.position.x>0?'feet':'rope';wakeDisciples();return}
 if(distance(b[0],b[1])>=1.55)return;
 switch(s){
 case 'boarding':enterBeat('gale');caption('거센 바람에 물결이 갑판을 때린다. 등불이 기울고 발밑의 널빤지가 흔들린다.',5);break;
 case 'quiet':enterBeat('shoreRest');caption('제자들은 바람과 바다까지 그분께 순종하는 것을 보고 두려워하며 서로 묻는다.',6);break;
 case 'shoreRest':enterBeat('family',[0,0,6.8]);caption('시간이 흐른 뒤, 빈 들. 무리를 가르치시던 예수님 곁에 저녁이 찾아온다.　막 6:30–35',6);break;
 case 'family':enterBeat('seats');caption('늦게 온 가족이 보리를 따라온다. 왼쪽 풀밭에 앉을 자리가 남아 있다.');break;
 case 'seats':enterBeat('bread');caption('사람들이 푸른 풀밭에 무리를 지어 앉는다.');break;
 case 'bread':enterBeat('sharing');caption('예수님이 떡 다섯 개와 물고기 두 마리를 받아 하늘을 우러러 축복하신 뒤, 떡을 떼어 제자들에게 주신다.',7);break;
 case 'sharing':enterBeat('baskets');caption('제자들이 무리에게 나누어 주고, 모두 배불리 먹었다.　막 6:39–42',6);break;
 case 'baskets':enterBeat('fourthEnd');caption('먹은 남자가 오천 명이었다. 남은 떡 조각과 물고기를 모으니 열두 광주리가 찼다.　막 6:43–44',7);break;
 case 'fourthEnd':journal();break;
 }
}
function appendFourthRecord(refs){
 const s=save.chapterStep;
 if(!['boarding','gale','hush'].includes(s))refs.append(' 제자들이 예수님을 깨웠고, 그분의 말씀에 풍랑이 잔잔해졌다(막 4:35–41).');
 if(s==='fourthEnd')refs.append(' 예수님이 떡 다섯 개와 물고기 두 마리를 축복하셨고 제자들이 나누어 주었다. 모두 먹고 남은 것은 열두 광주리였다(막 6:30–44).');
 if(save.shelter)by('memory').lastElementChild.append(save.shelter==='feet'?' 보리는 제자의 발 곁에서 웅크렸다.':' 보리는 감긴 밧줄 곁에서 몸을 낮췄다.');
 if(s==='fourthEnd')by('memory').lastElementChild.append(' 보리가 늦게 온 가족을 풀밭의 빈자리로 이끌었다.');
 if(save.shoreMemory){
 const note=document.createElement('p');note.textContent='물가에서 들은 기억 · 야이로가 딸을 위해 찾아온 길에, 오래 앓던 여인이 예수님의 옷에 손을 대어 나았다. 예수님은 여인의 말을 들으신 뒤 야이로의 집으로 가서 딸의 손을 잡아 일으키셨다(막 5:21–43).';refs.after(note);
 }
}
syncChapter();
