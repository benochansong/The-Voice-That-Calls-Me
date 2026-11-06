// Paint the figure parts into a single vertex-coloured mesh for each body.
// A crowd shares its cloth, face and hair geometry by costume and silhouette.
const storyPeople=(()=>{
 const sphere=new THREE.SphereGeometry(1,10,7);
 const bead=new THREE.SphereGeometry(1,7,5);
 const block=new THREE.BoxGeometry(1,1,1);
 const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96});
 const templates=new Map();
 const skinTones=[0xae7554,0xc0845e,0xb77a54,0xa26a49,0xc68d67];
 const hairTones=[0x45332e,0x382c2a,0x594134,0x513b31,0x6b5141];
 const headCloths=[0xd6bb93,0x8e9e94,0x9b765f,0xb6a486,0xb09a83];
 const v=new THREE.Vector3(),n=new THREE.Vector3(),matrix=new THREE.Matrix4();
 const rotation=new THREE.Quaternion(),angles=new THREE.Euler(),normalMatrix=new THREE.Matrix3();
 const position=new THREE.Vector3(),scale=new THREE.Vector3(),paint=new THREE.Color();
 const localY=new THREE.Vector3(0,1,0);
 function tint(color,ratio){return new THREE.Color(color).multiplyScalar(ratio).getHex()}

 class PaintedMesh {
  constructor(){this.positions=[];this.normals=[];this.colors=[];this.indices=[]}
  part(shape,color,x,y,z,w,h,d,rx=0,ry=0,rz=0){
   rotation.setFromEuler(angles.set(rx,ry,rz));
   matrix.compose(position.set(x,y,z),rotation,scale.set(w,h,d));
   this.transformed(shape,color);
  }
  transformed(shape,color){
   const vertices=shape.attributes.position,normals=shape.attributes.normal,base=this.positions.length/3;
   normalMatrix.getNormalMatrix(matrix);paint.setHex(color);
   for(let i=0;i<vertices.count;i++){
    v.fromBufferAttribute(vertices,i).applyMatrix4(matrix);
    n.fromBufferAttribute(normals,i).applyNormalMatrix(normalMatrix);
    // A little pale paint on upper planes keeps the hand-modelled forms legible at dusk.
    const wash=.93+.075*Math.max(0,n.y)+.024*Math.sin(17*v.y+9*v.x-5*v.z);
    this.positions.push(v.x,v.y,v.z);this.normals.push(n.x,n.y,n.z);
    this.colors.push(paint.r*wash,paint.g*wash,paint.b*wash);
   }
   for(const index of shape.index.array)this.indices.push(base+index);
  }
  oval(...args){this.part(sphere,...args)}
  detail(...args){this.part(bead,...args)}
  link(color,a,b,w,d){
   v.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
   const length=v.length();
   rotation.setFromUnitVectors(localY,v.normalize());
   position.set((b[0]+a[0])/2,(b[1]+a[1])/2,(b[2]+a[2])/2);
   matrix.compose(position,rotation,scale.set(w,length*.57,d));
   this.transformed(bead,color);
  }
  sleeve(color,knots){
   // Sweep a cloth tube around the bent arm. The continuous elbow keeps its weight.
   const points=[],indices=[],sides=10;
   const axis=new THREE.Vector3(),across=new THREE.Vector3(),depth=new THREE.Vector3();
   for(let j=0;j<knots.length;j++){
    const [x,y,z,w,h]=knots[j],a=knots[Math.max(0,j-1)],b=knots[Math.min(knots.length-1,j+1)];
    axis.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]).normalize();
    across.set(1,0,0).addScaledVector(axis,-axis.x).normalize();
    depth.crossVectors(across,axis);
    for(let i=0;i<sides;i++){
     const angle=i*Math.PI*2/sides;
     v.set(x,y,z).addScaledVector(across,w*Math.cos(angle)).addScaledVector(depth,h*Math.sin(angle));
     points.push(v.x,v.y,v.z);
     if(j){const l=j*sides+i,r=j*sides+(i+1)%sides;indices.push(l-sides,l,r-sides,r-sides,l,r)}
    }
   }
   const shape=new THREE.BufferGeometry();shape.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
   shape.setIndex(indices);shape.computeVertexNormals();this.part(shape,color,0,0,0,1,1,1);shape.dispose();
  }
  ribbon(color,path){
   const start=this.positions.length/3;paint.setHex(color);
   for(let j=0;j<path.length;j++){
    const [x,y,z,w]=path[j];
    for(const side of [-1,0,1]){
     this.positions.push(x+w*side,y,z+(side===0?.018:0));
     this.normals.push(side*.14,0,.99);const fold=side===-1?.85:side===0?1.04:.98;
     this.colors.push(paint.r*fold,paint.g*fold,paint.b*fold);
    }
    if(j){const k=start+j*3;this.indices.push(k-3,k,k-2,k-2,k,k+1,k-2,k+1,k-1,k-1,k+1,k+2)}
   }
  }
  finish(){
   const geometry=new THREE.BufferGeometry();
   geometry.setAttribute('position',new THREE.Float32BufferAttribute(this.positions,3));
   geometry.setAttribute('normal',new THREE.Float32BufferAttribute(this.normals,3));
   geometry.setAttribute('color',new THREE.Float32BufferAttribute(this.colors,3));
   geometry.setIndex(this.indices);geometry.computeBoundingSphere();return geometry;
  }
 }
 function garment(rings){
  // Irregular radii give the robe hanging folds instead of a symmetrical cone.
  const pos=[],idx=[],cols=18;
  rings.forEach(([height,rx,rz],j)=>{
   for(let i=0;i<cols;i++){
    const a=i*Math.PI*2/cols;
    const fold=1+.054*Math.cos(6*a+.33)+.026*Math.sin(4*a+.4*j);
    pos.push(Math.sin(a)*rx*fold,height+.008*Math.cos(3*a),Math.cos(a)*rz*fold);
    const l=j*cols+i,r=j*cols+(i+1)%cols;
    if(j)idx.push(l-cols,r-cols,l,r-cols,r,l);
   }
  });
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
 }
 const robeShape=garment([[.11,.32,.22],[.15,.327,.225],[.23,.304,.214],[.57,.247,.177],[.8,.204,.146],[.96,.233,.172],[1.17,.266,.176],[1.27,.23,.154],[1.32,.115,.108]]);
 const hemShape=garment([[.151,.329,.227],[.174,.324,.224]]);
 const beltShape=garment([[.795,.212,.154],[.845,.213,.155]]);
 const gatheredSkirt=garment([[.075,.389,.29],[.11,.412,.32],[.22,.437,.339],[.31,.421,.329],[.43,.35,.264],[.62,.224,.18],[.72,.19,.15]]);
 function palette(robe,style,role){
  const teacher=role==='teacher';
  return {robe,skin:teacher?0xae7653:skinTones[style],hair:teacher?0x45302b:hairTones[style],
   sash:teacher?0xa87558:role==='angel'?0xd7c089:headCloths[style],style,role};
 }
 function dress(body,c,kneeling){
  const h=kneeling?.56:1;
  body.part(robeShape,c.robe,0,0,0,1,h,1);
  body.part(hemShape,c.sash,0,0,0,1,h,1);
  body.part(beltShape,tint(c.sash,.77),0,0,0,1,h,1);
  if(!kneeling)body.ribbon(c.sash,[
   [-.181,1.26,.155,.052],[-.137,1.17,.183,.062],[-.052,1.07,.205,.07],
   [.046,.968,.197,.071],[.133,.874,.163,.065],[.161,.815,.132,.049],
   [.17,.706,.16,.037],[.195,.555,.164,.038]
  ]);
  body.detail(c.skin,0,1.315*h,.01,.088,.11,.097);
  for(const side of [-1,1]){
   body.detail(0x694c3d,side*.153,.065,.066,.098,.062,.164);
   body.detail(0xcb9c72,side*.153,.093,.11,.083,.032,.087);
   body.part(block,tint(c.sash,.7),side*.153,.121,.115,.164,.024,.046,0,side*.16,0);
  }
  if(kneeling)body.part(gatheredSkirt,c.robe,0,0,.048,1,1,1);
 }
 function face(body,c,cy){
  const x=0,z=cy<1.3?.105:0;
  const hood=c.role==='angel'||c.role==='veil'||(c.role==='traveler'&&(c.style===1||c.style===4));
  const teacher=c.role==='teacher';
  const back=hood?c.sash:c.hair;
  body.oval(back,x,cy+.016,z-.045,.234,.267,.187);
  body.oval(c.skin,x,cy,z,.203,.241,.174);
  for(const side of [-1,1]){
   body.detail(c.skin,side*.195,cy-.012,z,.043,.061,.038);
   body.detail(tint(c.skin,.86),side*.209,cy-.017,z+.007,.019,.032,.03);
   const eyeX=side*.081;
   body.detail(0xf0dbb6,eyeX,cy+.024,z+.162,.046,.024,.014,0,side*.25,side*.015);
   body.detail(0x332921,eyeX,cy+.023,z+.174,.022,.023,.012,0,side*.25);
   body.detail(0xffe7bd,eyeX-.006,cy+.03,z+.184,.006,.006,.004);
   body.link(c.hair,[side*.043,cy+.066,z+.168],[side*.126,cy+.068,z+.139],.013,.013);
   body.detail(tint(c.skin,.92),side*.117,cy-.03,z+.132,.036,.016,.01,0,side*.37);
  }
  body.detail(c.skin,x,cy-.013,z+.176,.042,.061,.041,-.1);
  if(teacher){
   body.oval(c.hair,0,cy-.116,z+.035,.177,.145,.141);
   body.detail(c.skin,0,cy-.084,z+.159,.076,.032,.026);
   body.detail(tint(c.hair,.87),0,cy-.056,z+.166,.077,.016,.018);
  }
  body.link(0x865544,[-.046,cy-.087,z+.157],[.043,cy-.087,z+.163],.009,.011);
  body.oval(back,0,cy+.157,z-.024,.231,.135,.193);
  if(hood){
   for(const side of [-1,1]){
    body.oval(back,side*.193,cy-.031,z-.023,.058,.231,.132,0,0,side*.055);
    body.link(tint(back,.72),[side*.18,cy+.148,z+.103],[side*.203,cy-.157,z+.085],.014,.017);
   }
  }else{
   for(let k=0;k<5;k++){
    const a=(k-2)*.51;
    body.detail(c.hair,.192*Math.sin(a),cy+.151+.015*Math.cos(a),z+.124*Math.cos(a),.086,.067,.073,0,0,a*.25);
   }
   if(teacher)for(const side of [-1,1]){
    body.oval(c.hair,side*.18,cy-.037,z-.052,.069,.215,.141,0,0,side*.07);
    body.detail(tint(c.hair,1.34),side*.206,cy-.035,z+.022,.021,.139,.041);
   }
  }
 }
 function hangingArm(body,c,side,ox=0,oy=0){
  const knots=[[.202,1.218,0,.051,.071],[.261,1.173,0,.098,.105],[.303,1.077,.015,.105,.102],
   [.324,.944,.04,.089,.088],[.306,.843,.078,.077,.08],[.279,.742,.114,.084,.083]];
  const sleeve=knots.map(([x,y,z,w,d])=>[side*x+ox,y+oy,z,w,d]);
  body.sleeve(c.robe,sleeve);const wrist=sleeve[sleeve.length-1];
  body.sleeve(c.sash,[wrist,[wrist[0],wrist[1]-.017,wrist[2],.079,.078]]);
  body.oval(c.skin,wrist[0],wrist[1]-.065,wrist[2]+.012,.06,.091,.048);
  body.detail(c.skin,wrist[0]-side*.046,wrist[1]-.051,wrist[2]+.032,.024,.049,.027);
 }
 function draw(geometry){
  const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
 }
 function geometryFor(key,make){
  if(!templates.has(key)){const b=new PaintedMesh();make(b);templates.set(key,b.finish())}
  return templates.get(key);
 }
 function build(x,z,robe,size,role){
  const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(size);
  const style=Math.abs(Math.round(x*11+z*7))%skinTones.length;
  const c=palette(robe,style,role);
  const key=[robe,role,role==='teacher'?0:style].join('-');
  const body=geometryFor(key,b=>{
   dress(b,c,false);face(b,c,1.536);hangingArm(b,c,1);
   if(role!=='teacher')hangingArm(b,c,-1);
  });
  g.add(draw(body));
  if(role==='teacher'){
   const arm=draw(geometryFor(key+'-hand',b=>hangingArm(b,c,-1,.219,-1.19)));
   arm.name='greeting-arm';arm.position.set(-.219,1.19,0);g.add(arm);
  }
  return g;
 }
 function buildKneeling(){
  const c=palette(0xf3e3c3,0,'teacher'),body=new PaintedMesh();
  // Bent hips keep the figure's head and shoulders proportionate at Bori's eye level.
  dress(body,c,true);body.oval(c.robe,0,.68,.012,.264,.322,.197,-.17);
  body.ribbon(c.sash,[[-.14,.95,.108,.045],[-.09,.873,.176,.06],[0,.783,.229,.065],[.09,.689,.223,.063],[.16,.587,.219,.047],[.177,.45,.275,.035]]);
  const portrait=new PaintedMesh();face(portrait,c,1.13);
  for(const side of [-1,1]){
   body.sleeve(c.robe,[[side*.18,.893,.033,.073,.074],[side*.24,.85,.057,.098,.11],[side*.305,.758,.157,.094,.105],[side*.307,.703,.211,.09,.089]]);
  }
  const hands=new PaintedMesh();
  for(const side of [-1,1]){
   hands.sleeve(c.robe,[[side*.309,.723,.19,.085,.086],[side*.306,.695,.221,.092,.089],[side*.252,.635,.34,.077,.075],[side*.197,.596,.448,.072,.071]]);
   hands.sleeve(c.sash,[[side*.201,.598,.439,.073,.071],[side*.193,.595,.454,.072,.071]]);
   hands.link(c.skin,[side*.197,.597,.447],[side*.121,.577,.548],.054,.056);
   hands.oval(c.skin,side*.086,.568,.566,.097,.052,.117,-.04,side*.17,side*.17);
   // Individual curled fingers make a shallow rim around the pool; thumb closes its near side.
   for(let finger=0;finger<4;finger++){
    const x=side*(.025+finger*.036),z=.657-finger*.011;
    hands.detail(c.skin,x,.583+finger*.003,z-.016,.024,.026,.058,-.21,side*.16);
   }
   hands.link(c.skin,[side*.148,.591,.529],[side*.135,.635,.59],.031,.034);
  }
  const head=draw(portrait.finish().translate(0,-.95,-.045));
  head.position.set(0,.95,.045);
  return [draw(body.finish()),draw(hands.finish()),head];
 }
 return {build,buildKneeling};
})();

function setGreetingHand(figure,amount){
 const arm=figure.getObjectByName('greeting-arm');
 if(arm)arm.rotation.x=-Math.max(0,Math.min(1,amount))*1.02;
}
