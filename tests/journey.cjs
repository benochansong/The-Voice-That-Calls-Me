// node tests/journey.cjs — isolated Chrome profile; never touches the player's save.
// Override BORI_CHROME if Chrome is installed elsewhere. Requires Node 22+.

const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{pathToFileURL}=require('node:url');
process.chdir(path.resolve(__dirname,'..'));
(async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bori-movement-'));const proc=spawn(process.env.BORI_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--disable-background-networking','--enable-unsafe-swiftshader','--use-angle=swiftshader','--remote-debugging-port=0','--user-data-dir='+dir,pathToFileURL(path.resolve('index.html')).href],{windowsHide:true,stdio:'ignore'});try{
const delay=ms=>new Promise(r=>setTimeout(r,ms));let port;for(let i=0;i<100;i++){try{port=fs.readFileSync(path.join(dir,'DevToolsActivePort'),'utf8').split('\n')[0];break}catch{await delay(100)}}if(!port)throw Error('browser debugger unavailable');
const tabs=await(await fetch('http://127.0.0.1:'+port+'/json')).json(),tab=tabs.find(t=>t.url.startsWith('file:'));
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0,pending=new Map(),errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};
async function cmd(method,params={}){const n=++id,p=new Promise(ok=>pending.set(n,ok));ws.send(JSON.stringify({id:n,method,params}));const r=await p;if(r.error)throw Error(JSON.stringify(r.error));return r.result}
await cmd('Runtime.enable');
async function ev(expression){const r=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value}
async function ready(){for(let i=0;i<150;i++){if(await ev("typeof locomotion!=='undefined'&&typeof atmosphereSet!=='undefined'&&camReady"))return;await delay(100)}throw Error('scene timeout '+JSON.stringify(errors))}
await ready();await cmd('Emulation.setDeviceMetricsOverride',{width:1120,height:700,deviceScaleFactor:1,mobile:false});
function check(v,label){if(!v)throw Error(label)}
async function setup(){await ev("window.requestAnimationFrame=()=>0;by('mute').checked=true;settings();window.qaFrame=(n=1)=>{const draw=renderer.render;renderer.render=()=>{};try{for(let i=0;i<n;i++)loop(prev+50)}finally{renderer.render=draw;prev=performance.now()}};window.qaStage=()=>save.prologue||save.chapterStep||(save.done?'dock':save.drank?'market':'water')");
await ev("\nwindow.qaWalk=(x,z,r=.35)=>{\n const stage=qaStage();let stuck=0;\n for(let i=0;i<1600;i++){\n  if(qaStage()!==stage){keys.clear();qaFrame(12);return}\n  const p=sheep.position,dx=x-p.x,dz=z-p.z,d=Math.hypot(dx,dz);\n  if(d<r){keys.clear();qaFrame(12);return}\n  yaw=Math.atan2(dx,-dz);keys.add('KeyW');if(d>2)keys.add('ShiftLeft');else keys.delete('ShiftLeft');\n  const ox=p.x,oz=p.z;qaFrame();\n  if(Math.hypot(p.x-ox,p.z-oz)<.00005&&sceneTime<0&&clock>=poseEnd&&!waterMeeting)stuck++;else stuck=0;\n  if(stuck>120){keys.clear();throw Error('stuck '+stage+' at '+p.x+','+p.z+' toward '+x+','+z)}\n }\n throw Error('walk timeout '+stage);\n};\n");}
async function seed(s){await ev("localStorage.boriJourney="+JSON.stringify(JSON.stringify(s))+";location.reload()");await delay(400);await ready();await setup()}
async function frames(n){await ev('qaFrame('+n+')')}
async function walk(x,z,r=.35){await ev('qaWalk('+[x,z,r].join(',')+')')}
async function action(){await ev("onkeydown({code:'KeyE',repeat:false});onkeyup({code:'KeyE'});qaFrame(2)")}
async function stage(){return ev('qaStage()')}
async function snap(name){await ev('renderer.render(scene,camera)');const s=await cmd('Page.captureScreenshot',{format:'jpeg',quality:85});const f=path.join(dir,name+'.jpg');fs.writeFileSync(f,Buffer.from(s.data,'base64'));console.log('IMAGE',f)}

await seed({drank:false,child:false,done:false,x:0,z:8,prologue:'watchFlock'});
let visited=[],turns=0;
while(++turns<150){
 const s=await stage();visited.push(s);console.log('PLAY',s);
 if(s==='credits')break;
 if(s==='goodNews'||s==='newborn'||s==='acrossYears'){await frames(s==='goodNews'?365:s==='newborn'?305:132);continue}
 if(['watchFlock','toVillage','toManger','holdMemory'].includes(s)){
  const b=await ev('nativitySteps[save.prologue]');await walk(b[0],b[1]);await action();continue
 }
 if(s==='water'){await walk(0,15.2);await action();await frames(130);continue}
 if(s==='market'){
  await walk(4.5,10);await walk(4.5,-2);await walk(5,-4);await action();await frames(55);
  await walk(4,-8);await walk(0,-11);await walk(0,-14.2);await frames(170);continue
 }
 if(s==='dock'){await action();continue}
 if(s==='stairs'){await walk(3.4,3.6);await walk(3.4,-2.65);await action();continue}
 if(s==='below'){await walk(3.4,3.5);continue}
 if(s==='witness'){await walk(3.4,3.6);await walk(1.9,3.6);await walk(1.9,1.65);await action();continue}
 if(s==='aside'){await walk(-2.8,.6);continue}
 if(s==='climb'&&!await ev('save.hillChild')){await walk(4.5,3.7);await action();await frames(50)}
 if(s==='embers'&&!await ev('save.lostParable')){await walk(-3.4,.7);await action();continue}
 if(s==='shoreRest'&&!await ev('save.shoreMemory')){await walk(-1.65,.3);await action();await ev("by('book').close()");await frames(2)}
 const b=await ev('(laterBeats[save.chapterStep]||beats[save.chapterStep])');
 if(!b[5]){await frames(450);continue}
 await frames(50);
 await walk(b[0],b[1]);
 if(await stage()===s)await action();
 check(await ev('[sheep.position.x,sheep.position.y,sheep.position.z,camera.position.x,camera.fov].every(Number.isFinite)'),'finite world '+s);
}
check(await stage()==='credits','campaign ended');
check(await ev("save.restSpot==='table'&&save.nativitySeen&&save.child&&save.hillChild&&save.lostParable&&save.shoreMemory&&save.passionView==='full'"),'choices preserved');
await frames(70);await snap('movement-table-ending');
const original=await ev('localStorage.boriJourney');
console.log('PASS campaign '+visited.length+' stages, prologue through table ending');
await ev("journal();playChapter(8,choicesByChapter[8][0])");await delay(400);await ready();await setup();
check(await stage()==='lastRest','ending replay');
await walk(3.8,-3.2);await action();await frames(70);check(await ev("save.restSpot==='boat'"),'boat ending');await snap('movement-boat-ending');
check(await ev('localStorage.boriJourney')===original,'replay overwrote campaign');
await ev('restoreMainJournal()');await delay(400);await ready();await setup();
check(await ev("save.restSpot==='table'&&save.chapterStep==='credits'&&locomotion.pace===0"),'original ending restored');
await ev("journal();playChapter(7,choicesByChapter[7][1])");await delay(400);await ready();await setup();
await walk(2.6,3);await action();check(await stage()==='briefPassion','short passion choice');
await action();await walk(0,3);await action();check(await stage()==='seventhEnd','short passion joins Sabbath');
await action();await delay(400);await ready();await setup();check(await ev("save.restSpot==='table'&&save.chapterStep==='credits'"),'short replay restored');
check(await ev('localStorage.boriJourney')===original,'save changed');
console.log('PASS both endings, full/brief Passion, optional scenes, replay and original save restoration, no runtime exceptions');
check(!errors.length,JSON.stringify(errors));ws.close()}finally{proc.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
