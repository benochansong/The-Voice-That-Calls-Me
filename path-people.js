// A passer-by keeps a stable home position. Only the play session remembers a passing step;
// re-entering from a checkpoint lays out the street anew.
function createPassingNeighbor(figure,preferredSide){
 return {
  figure,homeX:figure.position.x,homeZ:figure.position.z,yaw:figure.rotation.y,preferredSide,
  previousX:null,previousZ:null,blockedX:0,blockedZ:0,phase:'home',amount:0,time:0,away:0,offsetX:0,offsetZ:0,
  gaze:new THREE.Vector3()
 };
}
function passingNeighborBlocks(person,x,z,boriPosition){
 const at=person.figure.position;
 const next=Math.hypot(x-at.x,z-at.z);
 const blocked=next<.53&&next<Math.hypot(boriPosition.x-at.x,boriPosition.z-at.z);
 if(blocked){
  person.blockedX=x-boriPosition.x;person.blockedZ=z-boriPosition.z;
 }
 return blocked;
}
function choosePassingStep(n,p,alongX,alongZ){
 // Sideways relative to the approaching lamb. The street side breaks a head-on tie.
 let sideX=alongZ,sideZ=-alongX;
 const distanceToLine=(n.homeX-p.x)*sideX+(n.homeZ-p.z)*sideZ;
 const sign=Math.abs(distanceToLine)>.17?Math.sign(distanceToLine):(sideX*n.preferredSide>=0?1:-1);
 sideX*=sign;sideZ*=sign;
 // On a cross-street approach step diagonally, clear of the next spectator in the row.
 n.offsetX=sideX*1.03+n.preferredSide*.36*Math.abs(sideZ);
 n.offsetZ=sideZ*.91;
}
function stepPassingNeighbor(n,dt,p){
 const f=n.figure,dist=Math.hypot(n.homeX-p.x,n.homeZ-p.z);
 const first=n.previousX===null;
 const vx=(first?0:p.x-n.previousX)+n.blockedX,vz=(first?0:p.z-n.previousZ)+n.blockedZ;
 n.blockedX=n.blockedZ=0;
 n.previousX=p.x;n.previousZ=p.z;
 const step=Math.hypot(vx,vz);
 let noticed=false;
 if(first&&dist<.52){
  // A legacy save can place Bori in the original footprint. Start with the lane already clear.
  n.offsetX=(p.x<n.homeX?1:p.x>n.homeX?-1:n.preferredSide)*1.03;
  n.offsetZ=0;n.amount=1;n.phase='aside';
 }
 const approachSpeed=step/dt;
 const noticeRange=Math.min(4.2,Math.max(3.15,.65*approachSpeed+1));
 if(n.phase==='home'&&dist<noticeRange&&step>.0001){
  const ux=vx/step,uz=vz/step,dx=n.homeX-p.x,dz=n.homeZ-p.z;
  if(dx*ux+dz*uz>0&&Math.abs(dx*uz-dz*ux)<1.05){
   choosePassingStep(n,p,ux,uz);n.phase='notice';n.time=0;n.away=0;
  }
 }
 if(n.phase==='home')return false;
 n.time+=dt;
 if(n.phase==='notice'&&n.time>=.10){n.phase='opening';noticed=true}
 if(n.phase==='aside'){
  n.away=dist>3.75?n.away+dt:0;
  if(n.away>.6)n.phase='return';
 }else if(n.phase==='return'&&dist<2.7){
  n.phase='opening';n.away=0;
 }
 const oldX=f.position.x,oldZ=f.position.z;
 if(n.phase==='opening'){
  n.amount=Math.min(1,n.amount+dt/.46);
  if(n.amount===1)n.phase='aside';
 }else if(n.phase==='return'){
  n.amount=Math.max(0,n.amount-dt/.9);
 }
 const easing=n.amount*n.amount*(3-2*n.amount);
 f.position.x=n.homeX+n.offsetX*easing;
 f.position.z=n.homeZ+n.offsetZ*easing;
 const strideX=(f.position.x-oldX)/dt,strideZ=(f.position.z-oldZ)/dt;
 const speed=Math.hypot(strideX,strideZ);
 const toLamb=Math.atan2(p.x-f.position.x,p.z-f.position.z);
 const difference=Math.atan2(Math.sin(toLamb-n.yaw),Math.cos(toLamb-n.yaw));
 const turn=n.phase==='return'?0:Math.max(-.88,Math.min(.88,difference));
 f.rotation.y=softTurn(f.rotation.y,n.yaw+turn,dt,6);
 const rightX=Math.cos(f.rotation.y),rightZ=-Math.sin(f.rotation.y);
 const lateral=speed>.0001?(strideX*rightX+strideZ*rightZ)/speed:0;
 // Shift weight onto the planted foot before the first sandal lifts.
 const anticipation=n.phase==='notice'?Math.sin(Math.PI*n.time/.10):0;
 f.rotation.z=.035*anticipation*(n.offsetX*rightX+n.offsetZ*rightZ);
 n.gaze.set(p.x,p.y+.82,p.z);
 animatePerson(f,dt,{lookAt:n.phase==='return'?null:n.gaze,walk:speed,strideSide:lateral});
 if(n.phase==='return'&&n.amount===0){
  f.rotation.y=n.yaw;f.rotation.z=0;n.phase='home';n.time=0;n.away=0;
 }
 return noticed;
}
