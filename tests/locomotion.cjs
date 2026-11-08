// Run with node tests/locomotion.cjs. No dependencies or browser save are used.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function world(obstacle=()=>false){
 const ctx=vm.createContext({Math,save:{drank:true,chapterStep:'test'},laterBeats:{},sheep:{position:{x:0,z:0},rotation:{y:0}},blocked:obstacle});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../locomotion.js'),'utf8')+';this.motion=locomotion;',ctx);
 return ctx;
}
function tick(c,seconds,x,z,speed=4.8,hz=60){for(let i=0;i<Math.round(seconds*hz);i++)c.moveBori(1/hz,x,z,speed,true)}
for(const hz of [20,30,60,144]){
 const c=world();c.moveBori(1/hz,0,-1,2.75,true);
 assert(c.motion.z<0&&c.motion.z> -2.75,'gradual launch');
 tick(c,1,0,-1,2.75,hz);const walk=Math.abs(c.motion.z);
 c.moveBori(1/hz,0,-1,4.8,true);
 assert(Math.abs(c.motion.z)>walk&&Math.abs(c.motion.z)<4.8,'walk/run blend');
 tick(c,1,0,-1,4.8,hz);const start=c.sheep.position.z;
 tick(c,.5,0,0,4.8,hz);
 assert(start-c.sheep.position.z<.205,'short stopping distance');
 assert.equal(c.motion.z,0,'settled to exact rest');
 const resting=c.sheep.position.z;tick(c,1,0,0,4.8,hz);assert.equal(c.sheep.position.z,resting);
}
const distances=[20,30,60,144].map(hz=>{const c=world();tick(c,2,0,-1,4.8,hz);tick(c,.5,0,0,4.8,hz);return -c.sheep.position.z});
assert(Math.max(...distances)-Math.min(...distances)<.002,'frame-rate independent travel');
const straight=world(),diagonal=world();tick(straight,1,1,0);tick(diagonal,1,1,1);
assert(Math.abs(Math.hypot(diagonal.sheep.position.x,diagonal.sheep.position.z)-straight.sheep.position.x)<1e-8,'no diagonal speed boost');
const wall=world((x,z)=>x>.8);tick(wall,2,1,-1,4.8,20);
assert(wall.sheep.position.x<=.8&&wall.sheep.position.z< -6,'slide along wall');
const thin=world((x,z)=>z< -1&&z> -1.07);tick(thin,2,0,-1,4.8,20);
assert(thin.sheep.position.z>=-1,'cannot tunnel through thin obstacle');
tick(thin,.2,0,1);assert(thin.sheep.position.z>-.7,'can move away immediately');
const paused=world();tick(paused,1,0,-1);const at=paused.sheep.position.z;
paused.moveBori(.05,0,-1,4.8,false);tick(paused,1,0,0);assert.equal(paused.sheep.position.z,at,'no momentum after lock');
const gate=world();gate.save.drank=false;gate.sheep.position.z=12;tick(gate,1,0,-1);assert(gate.sheep.position.z>11,'story gate preserved');
assert.deepEqual(Array.from(gate.movementStick(.1,.1)),[0,0]);
assert(Math.hypot(...gate.movementStick(.17,0))<.02,'gentle analogue edge');
assert(Math.abs(Math.hypot(...gate.movementStick(1,1))-1)<1e-8);
assert(!gate.roundedWall(1.3,1.3,0,0,1,1)&&gate.roundedWall(1.2,1.2,0,0,1,1),'rounded corner clearance');
const post=world((x,z)=>Math.hypot(x+.7,z-.3)<.36);
post.save.chapterStep='boarding';post.laterBeats.boarding=[0,0,0,0,0,0,'crossing'];post.sheep.position.z=.8;
for(let i=0;i<150;i++){
 const p=post.sheep.position,dx=-1.45-p.x,dz=-1.4-p.z,d=Math.hypot(dx,dz);
 if(d<.1)break;
 post.moveBori(.05,dx/d,dz/d,2.75,true);
 assert(Math.hypot(p.x+.7,p.z-.3)>=.36,'no mast penetration');
}
assert(Math.hypot(post.sheep.position.x+1.45,post.sheep.position.z+1.4)<.1,'oblique mast contact slides clear');
console.log('PASS acceleration, braking, 20–144 Hz, diagonals, wall slide, swept collision, story locks and analogue input');
