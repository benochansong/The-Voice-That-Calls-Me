// Painted light follows the story clock, so pausing, replays and older saves
// restore the same weather without storing another timeline.
const atmosphereProfiles={
 day:{sky:0xb9d3cf,fog:0xc7d5c4,key:0xffe7c6,fill:0xc8dce9,ground:0xb9aa90,power:1.85,ambient:1.65,haze:.012,sun:[-16,28,12]},
 golden:{sky:0xdac8a6,fog:0xd9c6a7,key:0xffd29a,fill:0xd4dadd,ground:0xc6a17a,power:1.75,ambient:1.55,haze:.014,sun:[-20,17,12]},
 dusk:{sky:0x9c8d9f,fog:0xa595a2,key:0xffbd83,fill:0xacb8d4,ground:0x887281,power:.95,ambient:1.35,haze:.019,sun:[-24,9,8]},
 night:{sky:0x202d4b,fog:0x414c67,key:0xa9c9f1,fill:0xa5b9d8,ground:0x6b6479,power:.38,ambient:1.05,haze:.019,sun:[-15,22,-10]},
 lamplight:{sky:0x414052,fog:0x696477,key:0xb2c3dd,fill:0xa7b4cd,ground:0x9b7764,power:.42,ambient:1.15,haze:.021,sun:[-15,22,-10]},
 lake:{sky:0x758b9f,fog:0x8eabb5,key:0xcad9ed,fill:0xbbd1df,ground:0x75899a,power:.8,ambient:1.3,haze:.024,sun:[-18,18,-8]},
 storm:{sky:0x354458,fog:0x637b8b,key:0xa7bed6,fill:0xb1c7da,ground:0x647584,power:.42,ambient:1.18,haze:.042,sun:[-18,18,-8]},
 overcast:{sky:0x96979f,fog:0xb1adb0,key:0xd3ced0,fill:0xbfc9d5,ground:0x9b8b89,power:1.05,ambient:1.45,haze:.019,sun:[-14,22,9]},
 darkness:{sky:0x292a40,fog:0x565568,key:0xa5a9c1,fill:0x9ca9c4,ground:0x706677,power:.24,ambient:.96,haze:.031,sun:[-14,22,9]},
 predawn:{sky:0x697f97,fog:0x94a5b3,key:0xc1ccdf,fill:0xbbcfdf,ground:0x87948c,power:.7,ambient:1.3,haze:.024,sun:[12,9,6]},
 sunrise:{sky:0xe7cbaa,fog:0xe2cfb0,key:0xffd098,fill:0xd1e2e3,ground:0xbdad89,power:1.95,ambient:1.65,haze:.013,sun:[12,15,6]},
 morning:{sky:0xbcd9d3,fog:0xd2dfcc,key:0xffdfa9,fill:0xd2e6eb,ground:0xc1b493,power:1.85,ambient:1.7,haze:.011,sun:[12,21,6]}
};
const atmosphereBySet={
 market:'day',courtyard:'golden',roof:'day',meal:'golden',hill:'day',shore:'day',field:'golden',
 crossing:'lake',meadow:'golden',wayside:'golden',ravine:'golden',fold:'night',jericho:'golden',
 gates:'day',court6:'day',bethany:'dusk',upper:'lamplight',olives:'night',fireside:'lamplight',
 judgment:'overcast',hillCross:'overcast',gardenTomb:'dusk',dawnGarden:'predawn',breakfastBeach:'morning',
 nativity:'night'
};
const atmosphereColors=['sky','fog','key','fill','ground'];
for(const profile of Object.values(atmosphereProfiles)){
 for(const key of atmosphereColors)profile[key]=new T.Color(profile[key]);
 profile.sun=new T.Vector3(...profile.sun);
}
const atmosphereNow={},atmosphereTarget={};
for(const key of atmosphereColors){atmosphereNow[key]=new T.Color();atmosphereTarget[key]=new T.Color()}
atmosphereNow.sun=new T.Vector3();atmosphereTarget.sun=new T.Vector3();
let atmosphereSet='',rainStrength=0;
const hearthLight=new T.PointLight(0xffba76,0,10,2);
hearthLight.name='story-hearth-light';scene.add(hearthLight);
const hearths={upper:[0,1.7,-1.6],fireside:[0,1.15,0],olives:[1.8,1.6,-3],
 breakfastBeach:[-2.65,.85,-1.4],crossing:[-.67,1.67,.37]};

// One draw for slanted rain and one for small rings on the moving deck.
const rainCount=480,rainSeeds=new Float32Array(rainCount*3);
const rainPositions=new Float32Array(rainCount*6);
for(let i=0;i<rainCount;i++){
 rainSeeds[i*3]=((i*.61803398875)%1)*22-11;
 rainSeeds[i*3+1]=((i*.754877666)%1)*12;
 rainSeeds[i*3+2]=((i*.414213562)%1)*26-13;
}
const rainGeometry=new T.BufferGeometry();
rainGeometry.setAttribute('position',new T.BufferAttribute(rainPositions,3).setUsage(T.DynamicDrawUsage));
const rainMaterial=new T.LineBasicMaterial({color:0xbcd7e6,transparent:true,opacity:0,depthWrite:false});
const storyRain=new T.LineSegments(rainGeometry,rainMaterial);
storyRain.name='story-rain';storyRain.frustumCulled=false;storyRain.visible=false;crossing.add(storyRain);
const splashCount=48,splashSides=7,splashPositions=new Float32Array(splashCount*splashSides*6);
const splashGeometry=new T.BufferGeometry();
splashGeometry.setAttribute('position',new T.BufferAttribute(splashPositions,3).setUsage(T.DynamicDrawUsage));
const splashMaterial=new T.LineBasicMaterial({color:0xc8e0df,transparent:true,opacity:0,depthWrite:false});
const storySplashes=new T.LineSegments(splashGeometry,splashMaterial);
storySplashes.name='story-rain-splashes';storySplashes.frustumCulled=false;storySplashes.visible=false;hull.add(storySplashes);
function updateStoryRain(strength){
 rainStrength=strength;
 storyRain.visible=storySplashes.visible=strength>.01;
 if(!storyRain.visible)return;
 const gust=.78+.22*Math.sin(clock*.71);
 rainMaterial.opacity=.27*strength;splashMaterial.opacity=.3*strength;
 const count=Math.ceil(rainCount*strength);
 rainGeometry.setDrawRange(0,count*2);
 for(let i=0;i<count;i++){
  const y=12-((rainSeeds[i*3+1]+clock*8.8)%12);
  const x=rainSeeds[i*3]+y*.21+Math.sin(clock*.71)*.38;
  const z=rainSeeds[i*3+2]+y*.075;
  const length=.28+(i%4)*.065;
  const at=i*6;
  rainPositions[at]=x;rainPositions[at+1]=y-.2;rainPositions[at+2]=z;
  rainPositions[at+3]=x-length*(.42+.18*gust);rainPositions[at+4]=y-length-.2;rainPositions[at+5]=z-length*.14;
 }
 rainGeometry.attributes.position.needsUpdate=true;
 for(let i=0;i<splashCount;i++){
  const age=(clock*1.35+i*.61803398875)%1;
  const radius=Math.sin(age*Math.PI)*.11;
  const x=((i*.754877666)%1)*3.3-1.65,z=((i*.414213562)%1)*6-3;
  for(let edge=0;edge<splashSides;edge++){
   const at=(i*splashSides+edge)*6,a=edge*Math.PI*2/splashSides,b=(edge+1)*Math.PI*2/splashSides;
   splashPositions[at]=x+Math.cos(a)*radius;splashPositions[at+1]=.113;splashPositions[at+2]=z+Math.sin(a)*radius;
   splashPositions[at+3]=x+Math.cos(b)*radius;splashPositions[at+4]=.113;splashPositions[at+5]=z+Math.sin(b)*radius;
  }
 }
 splashGeometry.attributes.position.needsUpdate=true;
}
function updateAtmosphere(dt){
 const step=save.chapterStep;
 const intro=save.prologue&&!(save.prologue==='acrossYears'&&nativityTime>=3);
 const set=intro?'nativity':cameraSetKey(step);
 let from=atmosphereProfiles[atmosphereBySet[set]||'day'],to=from,mix=0,storm=0;
 if(['evening','dusk','twilight','sixthEnd'].includes(step))from=to=atmosphereProfiles.dusk;
 if(set==='crossing'){
  storm=step==='gale'?Math.min(1,.28+beatTime/3):step==='hush'?1-T.MathUtils.smoothstep(beatTime,4,8):0;
  to=atmosphereProfiles.storm;mix=storm;
 }
 if(step==='crucified'||step==='gravePath'){
  to=atmosphereProfiles.darkness;mix=step==='gravePath'?1:T.MathUtils.smoothstep(beatTime,4.5,7);
 }
 if(step==='briefPassion')from=to=atmosphereProfiles.darkness;
 if(step==='sabbath'||step==='seventhEnd')from=to=atmosphereProfiles.night;
 if(set==='dawnGarden'){
  to=atmosphereProfiles.sunrise;
  mix=['gardenDawn','openTomb'].includes(step)?0:step==='tears'?.25:step==='herName'?.25+.75*T.MathUtils.smoothstep(beatTime,4,10):1;
 }
 for(const key of atmosphereColors)atmosphereTarget[key].copy(from[key]).lerp(to[key],mix);
 for(const key of ['power','ambient','haze'])atmosphereTarget[key]=T.MathUtils.lerp(from[key],to[key],mix);
 atmosphereTarget.sun.copy(from.sun).lerp(to.sun,mix);
 // New sets arrive behind the camera dissolve. Changes within a set stay gradual.
 const blend=set!==atmosphereSet?1:1-Math.exp(-dt*2.6);
 atmosphereSet=set;
 for(const key of atmosphereColors)atmosphereNow[key].lerp(atmosphereTarget[key],blend);
 for(const key of ['power','ambient','haze'])atmosphereNow[key]=T.MathUtils.lerp(atmosphereNow[key]??atmosphereTarget[key],atmosphereTarget[key],blend);
 atmosphereNow.sun.lerp(atmosphereTarget.sun,blend);
 scene.background.copy(atmosphereNow.sky);scene.fog.color.copy(atmosphereNow.fog);scene.fog.density=atmosphereNow.haze;
 sun.color.copy(atmosphereNow.key);sun.intensity=atmosphereNow.power;sun.position.copy(atmosphereNow.sun);
 skyLight.color.copy(atmosphereNow.fill);skyLight.groundColor.copy(atmosphereNow.ground);skyLight.intensity=atmosphereNow.ambient;
 const hearth=hearths[set];
 if(hearth)hearthLight.position.set(...hearth);
 const firePower=set==='breakfastBeach'?3.5:set==='crossing'?4.8:9;
 const fire=Boolean(hearth)&&(set!=='olives'||step==='seize'||step==='followFire');
 hearthLight.intensity=fire?firePower*(.97+.03*Math.sin(clock*2.3)):0;
 updateStoryRain(storm);
 paintedSkyWeather.cover.value=storm;
 paintedSkyWeather.travel.value+=dt*(.003+storm*.045);
 if(nativitySet){
  nativitySet.starlight.material.uniforms.time.value=clock;
  // Warm local pools retain the faces and the path beneath the cool night sky.
  nativitySet.firelight.intensity=8.2+.35*Math.sin(clock*2.1);
  nativitySet.cradleLight.intensity=8.5;
  nativitySet.halo.intensity=save.prologue==='goodNews'?17*T.MathUtils.smoothstep(nativityTime,0,1.6):0;
 }
}
