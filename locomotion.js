// Velocity is transient: checkpoints save a place, never a held key or momentum.
const locomotion={x:0,z:0,pace:0,acceleration:0};
function resetLocomotion(){
 locomotion.x=locomotion.z=locomotion.pace=locomotion.acceleration=0;
}
function movementStick(x,z){
 const length=Math.hypot(x,z);
 if(length<=.16)return [0,0];
 const strength=Math.min(1,(length-.16)/.84);
 return [x/length*strength,z/length*strength];
}
function roundedWall(x,z,cx,cz,halfX,halfZ,radius=.35){
 return Math.hypot(Math.max(0,Math.abs(x-cx)-halfX),Math.max(0,Math.abs(z-cz)-halfZ))<radius;
}
function movementBlocked(x,z){
 return blocked(x,z)||(!save.prologue&&!save.drank&&z<=11);
}
function circularSlide(x,z,dx,dz,cx,cz,radius){
 const nx=x-cx,nz=z-cz,d=Math.hypot(nx,nz);
 if(d<.0001||d>radius+.06)return null;
 const dot=(dx*nx+dz*nz)/(d*d);
 if(dot>=0)return null;
 const sx=dx-nx*dot,sz=dz-nz*dot;
 // A direct push into a post stays still; an oblique approach follows its rim.
 if(Math.hypot(sx,sz)<Math.hypot(dx,dz)*.12)return null;
 return [sx,sz];
}
function roundMovementObstacles(){
 if(save.prologue)return [];
 const area=laterBeats[save.chapterStep]?.[6];
 if(area==='crossing')return [[-.7,.3,.36]];
 let neighbors=[];
 if(!save.chapterStep&&save.drank)neighbors=[marketSellerLane,marketResidentLane];
 else if(area==='jericho')neighbors=jerichoBystanders;
 else if(area==='gates')neighbors=gateBystanders;
 const circles=neighbors.map(n=>[n.figure.position.x,n.figure.position.z,.53]);
 if(area==='jericho')circles.push([3.7,-4.5,.56]);
 if(!save.chapterStep&&!save.drank)circles.push([jesus.position.x,jesus.position.z,.53]);
 // Contact normals on the rounded corners of the market houses.
 if(!save.chapterStep)for(const [x,z,w,d] of walls){
  const p=sheep.position;
  if(Math.abs(p.x-x)>w&&Math.abs(p.z-z)>d)circles.push([x+Math.sign(p.x-x)*w,z+Math.sign(p.z-z)*d,.35]);
 }
 return circles;
}
function moveBori(dt,x,z,speed,allowed){
 if(!allowed){resetLocomotion();return false}
 const p=sheep.position,oldX=p.x,oldZ=p.z,previousPace=locomotion.pace;
 const length=Math.max(1,Math.hypot(x,z));
 const targetX=x/length*speed,targetZ=z/length*speed;
 const stopping=Math.hypot(targetX,targetZ)<.001;
 const reversing=targetX*locomotion.x+targetZ*locomotion.z<0;
 const rate=stopping?24:reversing?22:14,decay=Math.exp(-rate*dt);
 // Integrate the exponential response, not just its final speed. This also keeps
 // travel/stopping distance consistent between 20, 30 and 60 frames per second.
 const travelX=targetX*dt+(locomotion.x-targetX)*(1-decay)/rate;
 const travelZ=targetZ*dt+(locomotion.z-targetZ)*(1-decay)/rate;
 locomotion.x=targetX+(locomotion.x-targetX)*decay;
 locomotion.z=targetZ+(locomotion.z-targetZ)*decay;
 const steps=Math.max(1,Math.ceil(Math.hypot(travelX,travelZ)/.045));
 const sx=travelX/steps,sz=travelZ/steps;
 const circles=roundMovementObstacles();
 for(let i=0;i<steps;i++){
  if(!movementBlocked(p.x+sx,p.z+sz)){p.x+=sx;p.z+=sz;continue}
  let slid=false;
  for(const [cx,cz,radius] of circles){
   const tangent=circularSlide(p.x,p.z,sx,sz,cx,cz,radius);
   if(tangent&&!movementBlocked(p.x+tangent[0],p.z+tangent[1])){
    p.x+=tangent[0];p.z+=tangent[1];slid=true;break;
   }
  }
  if(slid)continue;
  // Retain the free component along a wall. Short steps cannot skip a person,
  // a stair boundary, the mast or the narrow edge of the deck.
  if(!movementBlocked(p.x+sx,p.z))p.x+=sx;
  if(!movementBlocked(p.x,p.z+sz))p.z+=sz;
 }
 const dx=p.x-oldX,dz=p.z-oldZ;
 if(Math.abs(dx)<.000001)locomotion.x=0;
 if(Math.abs(dz)<.000001)locomotion.z=0;
 if(stopping&&Math.hypot(locomotion.x,locomotion.z)<.025)locomotion.x=locomotion.z=0;
 locomotion.pace=Math.hypot(dx,dz)/dt;
 locomotion.acceleration=(locomotion.pace-previousPace)/dt;
 if(locomotion.pace>.025)sheep.rotation.y=Math.atan2(-dx,-dz);
 return locomotion.pace>.025;
}
