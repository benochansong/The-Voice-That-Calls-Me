// A moving figure uses the same painted geometry as the static crowd. Its bones
// are created on first use; adding a moving head or elbow does not add draw calls.
const storyPersonFigures=[];
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
  constructor(){this.positions=[];this.normals=[];this.colors=[];this.indices=[];this.lipWeights=[];this.chinWeights=[]}
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
 function dress(body,c,kneeling,shoe=(side,paintShoe)=>paintShoe()){
  const h=kneeling?.56:1;
  body.part(robeShape,c.robe,0,0,0,1,h,1);
  body.part(hemShape,c.sash,0,0,0,1,h,1);
  body.part(beltShape,tint(c.sash,.77),0,0,0,1,h,1);
  if(!kneeling)body.ribbon(c.sash,[
   [-.181,1.26,.155,.052],[-.137,1.17,.183,.062],[-.052,1.07,.205,.07],
   [.046,.968,.197,.071],[.133,.874,.163,.065],[.161,.815,.132,.049],
   [.17,.706,.16,.037],[.195,.555,.164,.038]
  ]);
  body.detail(c.skin,0,1.315*h,.018,.095,.136,.105);
  for(const side of [-1,1])shoe(side,()=>{
   body.detail(0x694c3d,side*.153,.065,.066,.098,.062,.164);
   body.detail(0xcb9c72,side*.153,.093,.11,.083,.032,.087);
   body.part(block,tint(c.sash,.7),side*.153,.121,.115,.164,.024,.046,0,side*.16,0);
  });
  if(kneeling)body.part(gatheredSkirt,c.robe,0,0,.048,1,1,1);
 }
 // Separate upper and lower pigment bands share an inner edge at rest. During a vowel,
 // that edge opens into a curved, shaded mouth; the corners stay attached to the cheeks.
 function paintLips(body,c,cy,z){
  const teacher=c.role==='teacher',width=teacher?.068:.063;
  const baseY=cy-.087,front=z+(teacher?.192:.177);
  const upper=new THREE.Color(c.skin).lerp(new THREE.Color(0x884946),.60);
  const lower=new THREE.Color(c.skin).lerp(new THREE.Color(0xc07b71),.56);
  const inside=new THREE.Color(0x633833);
  function band(yTop,yBottom,topJoint,bottomJoint,color,depth){
   const start=body.positions.length/3,sections=12;
   for(let i=0;i<=sections;i++){
    const t=2*i/sections-1,round=1-t*t,side=t<0?'leftCorner':'rightCorner';
    const crease=.002*t*t,zz=front-.014*t*t+depth;
    // An elliptical aperture keeps rounded vowels from pinching into a diamond.
    const cornerWeight=1-Math.sqrt(round);
    const x=t*width;
    for(const [height,bone] of [[yTop,topJoint],[yBottom,bottomJoint]]){
     body.lipWeights.push([body.positions.length/3,bone,side,cornerWeight]);
     const arch=height>.002?1-.28*Math.exp(-t*t/.035):1;
     body.positions.push(x,baseY+crease+height*round*arch,zz);
     body.normals.push(t*.33,.12,1);
     body.colors.push(color.r,color.g,color.b);
    }
    if(i){const k=start+i*2;body.indices.push(k-2,k-1,k,k,k-1,k+1)}
   }
  }
  band(.008,.0015,'upperLip','upperLip',upper,.0006);
  band(.0015,.0012,'upperLip','upperInside',new THREE.Color(0xbd9280),.0004);
  band(.0012,-.0015,'upperInside','lowerLip',inside,0);
  band(-.0015,-.011,'lowerLip','lowerLip',lower,.0008);
 }
 function face(body,c,cy,eyes=(side,part,paintEye)=>paintEye()){
  const x=0,z=cy<1.3?.105:0;
  const hood=c.role==='angel'||c.role==='veil'||(c.role==='traveler'&&(c.style===1||c.style===4));
  const teacher=c.role==='teacher';
  const back=hood?c.sash:c.hair;
  body.oval(back,x,cy+.016,z-.045,.234,.267,.187);
  function chinSurface(drawSurface){
   const start=body.positions.length/3;drawSurface();
   for(let i=start;i<body.positions.length/3;i++){
    const weight=THREE.MathUtils.smoothstep(cy-body.positions[i*3+1],.082,.205);
    if(weight>0)body.chinWeights.push([i,weight]);
   }
  }
  chinSurface(()=>body.oval(c.skin,x,cy,z,.203,.241,.174));
  for(const side of [-1,1]){
   body.detail(c.skin,side*.195,cy-.012,z,.043,.061,.038);
   body.detail(tint(c.skin,.86),side*.209,cy-.017,z+.007,.019,.032,.03);
   const eyeX=side*.081;
   eyes(side,'lid',()=>body.detail(0xf0dbb6,eyeX,cy+.024,z+.162,.046,.024,.014,0,side*.25,side*.015));
   eyes(side,'iris',()=>{
    body.detail(0x332921,eyeX,cy+.023,z+.174,.022,.023,.012,0,side*.25);
    body.detail(0xffe7bd,eyeX-.006,cy+.03,z+.184,.006,.006,.004);
   });
   eyes(side,'brow',()=>body.link(c.hair,[side*.043,cy+.066,z+.168],[side*.126,cy+.068,z+.139],.013,.013));
   eyes(side,'cheek',()=>body.detail(tint(c.skin,.94),side*.117,cy-.03,z+.132,.038,.018,.011,0,side*.37));
  }
  body.detail(c.skin,x,cy-.013,z+.176,.042,.061,.041,-.1);
  if(teacher){
   chinSurface(()=>body.oval(c.hair,0,cy-.116,z+.035,.177,.145,.141));
   chinSurface(()=>body.detail(c.skin,0,cy-.084,z+.159,.076,.032,.026));
   body.detail(tint(c.hair,.87),0,cy-.056,z+.166,.077,.016,.018);
  }
  paintLips(body,c,cy,z);
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
 const joints=[];
 function joint(name,parent,x,y,z){
  const index=joints.length;
  joints.push({name,parent,position:new THREE.Vector3(x,y,z)});
  return index;
 }
 // Rest coordinates are in unscaled figure space. A limb can therefore solve its
 // reach under a rotated parent, a child's scale or a seated scene transform.
 const rootBone=joint('person-root',-1,0,0,0),torso=joint('torso',rootBone,0,.79,0);
 const neck=joint('head',torso,0,1.35,.01),limbs=[];
 for(const side of [-1,1]){
  const arm=joint('upper-arm-'+side,torso,side*.212,1.222,.005);
  const forearm=joint('forearm-'+side,arm,side*.331,.925,.034);
  const hand=joint('palm-'+side,forearm,side*.281,.653,.16);
  const thigh=joint('thigh-'+side,rootBone,side*.152,.68,0);
  const shin=joint('shin-'+side,thigh,side*.152,.364,.043);
  const shoe=joint('sandal-'+side,shin,side*.152,.08,.04);
  const lid=joint('eye-'+side,neck,side*.081,1.56,.163);
  const iris=joint('iris-'+side,lid,side*.081,1.56,.175);
  limbs.push({side,arm,forearm,hand,thigh,shin,shoe,lid,iris});
 }
 const figures=new WeakMap();
 function addFaceJoints(add,parent,cy,z){
  const channels={};
  function at(name,x,y,depth){channels[name]=add(name,parent,x,cy+y,z+depth)}
  at('jaw',0,-.034,.025);
  at('upperLip',0,-.086,.174);at('upperInside',0,-.086,.174);at('lowerLip',0,-.090,.174);
  for(const side of [-1,1]){
   const prefix=side<0?'left':'right';
   at(prefix+'Corner',side*.064,-.085,.162);
   at(prefix+'Brow',side*.083,.067,.152);
   at(prefix+'Cheek',side*.117,-.03,.132);
  }
  return channels;
 }
 const faceJoints=addFaceJoints(joint,neck,1.536,0);
 function markingBone(side,part,channels,eye){
  if(part==='lid'||part==='iris')return eye[part];
  return channels[(side<0?'left':'right')+(part==='brow'?'Brow':'Cheek')];
 }
 function bindLipAndChin(body,channels,headBone,ids,weights){
  function blend(i,a,b,mix){
   const k=i*4;ids[k]=a;ids[k+1]=b;weights[k]=1-mix;weights[k+1]=mix;
  }
  for(const [i,center,corner,mix] of body.lipWeights)blend(i,channels[center],channels[corner],mix);
  for(const [i,mix] of body.chinWeights)blend(i,headBone,channels.jaw,mix);
 }
 function draw(geometry){
  const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
 }
 function buildPaintedRig(c){
  const b=new PaintedMesh(),ranges=[];
  function section(bone,drawPart){
   const first=b.positions.length/3;drawPart();ranges.push({first,last:b.positions.length/3,bone});
  }
  const armStarts=[];
  // First lay down base assignments, then overlay small details like toes and pupils.
  const fromSide=side=>limbs[side===-1?0:1];
  dress(b,c,false,(side,part)=>section(fromSide(side).shoe,part));
  const robeEnd=b.positions.length/3;
  const faceStart=robeEnd;
  face(b,c,1.536,(side,part,paintEye)=>section(markingBone(side,part,faceJoints,fromSide(side)),paintEye));
  const faceEnd=b.positions.length/3;
  for(const limb of limbs){
   const {side}=limb;
   section(limb.shin,()=>b.oval(tint(c.robe,.71),side*.152,.236,.025,.069,.171,.068));
   const start=b.positions.length/3;
   const knots=[[.202,1.218,0,.065,.077],[.261,1.173,0,.10,.106],[.303,1.077,.015,.105,.103],
    [.324,.944,.04,.092,.091],[.306,.843,.078,.079,.08],[.279,.742,.114,.085,.083]];
   const sleeve=knots.map(([x,y,z,w,d])=>[side*x,y,z,w,d]);
   b.sleeve(c.robe,sleeve);
   const wrist=sleeve[sleeve.length-1];
   b.sleeve(c.sash,[wrist,[wrist[0],wrist[1]-.017,wrist[2],.079,.078]]);
   armStarts.push([limb,start,b.positions.length/3]);
   section(limb.hand,()=>{
    b.oval(c.skin,side*.28,.687,.14,.058,.067,.05);
    for(let i=0;i<3;i++)b.detail(c.skin,side*(.25+i*.025),.641,.15,.018,.041,.024);
    b.detail(c.skin,side*.235,.681,.17,.023,.043,.023,-.23);
   });
  }
  const geo=b.finish(),vertices=geo.getAttribute('position');
  const ids=new Uint16Array(vertices.count*4),weights=new Float32Array(ids.length);
  function weight(i,a,boneB=a,mix=0){
   const off=i*4;ids[off]=a;ids[off+1]=boneB;
   weights[off]=1-mix;weights[off+1]=mix;weights[off+2]=0;
  }
  for(let i=0;i<robeEnd;i++){
   const x=vertices.getX(i),y=vertices.getY(i);
   const hem=1-THREE.MathUtils.smoothstep(y,.13,.61);
   const swing=.42*hem*THREE.MathUtils.smoothstep(Math.abs(x),.03,.22);
   weight(i,torso,fromSide(x<0?-1:1).thigh,swing);
   // Part of the hem hangs freely even as a seated actor lowers the pelvis.
   weights[i*4]-=.55*hem;ids[i*4+2]=rootBone;weights[i*4+2]=.55*hem;
  }
  for(let i=faceStart;i<faceEnd;i++)weight(i,neck);
  for(const [limb,start,end] of armStarts)for(let i=start;i<end;i++){
   const below=1-THREE.MathUtils.smoothstep(vertices.getY(i),.89,1.015);
   weight(i,limb.arm,limb.forearm,below);
  }
  for(const {first,last,bone} of ranges)for(let i=first;i<last;i++)weight(i,bone);
  bindLipAndChin(b,faceJoints,neck,ids,weights);
  geo.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(ids,4));
  geo.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  return geo;
 }
 function build(x,z,robe,size,role){
  const figure=new THREE.Group();figure.position.set(x,0,z);figure.scale.setScalar(size);
  const style=Math.abs(Math.round(x*11+z*7))%skinTones.length,c=palette(robe,style,role);
  const key=[robe,role,role==='teacher'?0:style].join('-');
  if(!templates.has(key))templates.set(key,buildPaintedRig(c));
  const model=draw(templates.get(key));figure.add(model);
  figures.set(figure,{model,style,seed:Math.abs(x*.627+z*1.353)%5.19,rig:null});
  storyPersonFigures.push(figure);return figure;
 }
 function rigFor(figure){
  const record=figures.get(figure);
  if(!record||record.rig)return record?.rig;
  const mesh=new THREE.SkinnedMesh(record.model.geometry,material);
  mesh.castShadow=mesh.receiveShadow=true;
  mesh.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,.91,0),1.44);
  const bones=joints.map((j,i)=>{
   const bone=new THREE.Bone();bone.name=j.name;
   bone.position.copy(j.position);
   if(j.parent>=0)bone.position.sub(joints[j.parent].position);
   return bone;
  });
  for(let i=0;i<bones.length;i++){
   const parent=joints[i].parent;
   (parent<0?mesh:bones[parent]).add(bones[i]);
  }
  mesh.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(bones));
  figure.remove(record.model);figure.add(mesh);record.model=mesh;
  record.rig={bones,phase:record.seed,elapsed:record.seed,lastPose:-1,activity:0,sit:0,greeting:0};
  return record.rig;
 }
 const offeringEyes=new WeakMap();
 function buildKneeling(){
  const c=palette(0xf3e3c3,0,'teacher'),body=new PaintedMesh();
  // Bent hips keep the figure's head and shoulders proportionate at Bori's eye level.
  dress(body,c,true);body.oval(c.robe,0,.68,.012,.264,.322,.197,-.17);
  body.ribbon(c.sash,[[-.14,.95,.108,.045],[-.09,.873,.176,.06],[0,.783,.229,.065],[.09,.689,.223,.063],[.16,.587,.219,.047],[.177,.45,.275,.035]]);
  const portrait=new PaintedMesh(),eyeRanges=[];
  const faceRoot=new THREE.Bone(),lids=new THREE.Bone(),pupils=new THREE.Bone();
  lids.name='offering-eyelids';pupils.name='offering-pupils';
  lids.position.set(0,.204,.222);faceRoot.add(lids);lids.add(pupils);
  const portraitBones=[faceRoot,lids,pupils];
  const portraitJoints=addFaceJoints((name,parent,x,y,z)=>{
   const bone=new THREE.Bone();bone.name=name;bone.position.set(x,y,z);
   portraitBones[parent].add(bone);return portraitBones.push(bone)-1;
  },0,.18,.060);
  const eyeBones={lid:1,iris:2};
  face(portrait,c,1.13,(side,part,paintEye)=>{
   const from=portrait.positions.length/3;paintEye();
   eyeRanges.push([from,portrait.positions.length/3,markingBone(side,part,portraitJoints,eyeBones)]);
  });
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
  const headShape=portrait.finish().translate(0,-.95,-.045);
  const count=headShape.getAttribute('position').count,ids=new Uint16Array(count*4),weights=new Float32Array(count*4);
  for(let i=0;i<count;i++)weights[i*4]=1;
  for(const [from,to,bone] of eyeRanges)for(let i=from;i<to;i++)ids[i*4]=bone;
  bindLipAndChin(portrait,portraitJoints,0,ids,weights);
  headShape.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(ids,4));
  headShape.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  const head=new THREE.SkinnedMesh(headShape,material);
  head.castShadow=head.receiveShadow=true;
  head.add(faceRoot);head.updateMatrixWorld(true);head.bind(new THREE.Skeleton(portraitBones));
  offeringEyes.set(head,{lids,pupils,bones:portraitBones,channels:portraitJoints});
  head.position.set(0,.95,.045);
  return [draw(body.finish()),draw(hands.finish()),head];
 }
 function updateEyes(head,yawError,pitchError,dt,time){
  const eyes=offeringEyes.get(head);if(!eyes)return;
  const follow=1-Math.exp(-30*dt);
  eyes.pupils.position.x+=(THREE.MathUtils.clamp(yawError,-1,1)*.016-eyes.pupils.position.x)*follow;
  eyes.pupils.position.y+=(-THREE.MathUtils.clamp(pitchError,-.7,.7)*.016-eyes.pupils.position.y)*follow;
  const blink=Math.max(0,1-Math.abs(time%4.7-3.85)/.11);
  eyes.lids.scale.y=(1-.93*blink)*(1-(eyes.expression?.squint||0));
 }
 // Lip shapes move much sooner than the eyebrows. A consonant can close the
 // mouth while the character still looks concerned about the person nearby.
 const moods={
  calm:   {brow:0,     tilt:0,    smile:.001, squint:0},
  warm:   {brow:.004,  tilt:-.03, smile:.011, squint:.07},
  joy:    {brow:.014,  tilt:.035, smile:.018, squint:.13},
  concern:{brow:.004,  tilt:-.18, smile:-.005,squint:.04},
  sorrow: {brow:-.002, tilt:-.23, smile:-.010,squint:.12},
  wonder: {brow:.022,  tilt:-.05, smile:.002, squint:-.065},
  resolve:{brow:-.007, tilt:.13,  smile:-.002,squint:.08}
 };
 function createExpression(bones,channels){
  const nodes={};
  for(const [name,i] of Object.entries(channels)){
   const bone=bones[i];nodes[name]={bone,rest:bone.position.clone()};
  }
  return {nodes,open:0,round:0,wide:0,brow:0,tilt:0,smile:0,squint:0};
 }
 function dialogueFace(figure,dt,pose){
  if(!figure)return false;
  const portrait=offeringEyes.get(figure),record=figures.get(figure);
  const rig=portrait||(pose?rigFor(figure):record?.rig);
  if(!rig||(!pose&&!rig.expression))return false;
  const state=rig.expression||(rig.expression=createExpression(rig.bones,portrait?.channels||faceJoints));
  const clamp=THREE.MathUtils.clamp,frame=clamp(dt,0,.1);
  const targetOpen=clamp(pose?.open||0,0,1);
  const lips=1-Math.exp(-frame*(targetOpen<state.open?42:28)),faceEase=1-Math.exp(-frame*8);
  state.open+=(targetOpen-state.open)*lips;
  state.round+=(clamp(pose?.round||0,0,1)-state.round)*lips;
  state.wide+=(clamp(pose?.wide||0,0,1)-state.wide)*lips;
  const mood=moods[pose?.emotion]||moods.calm,amount=pose?clamp(pose.strength??1,0,1):0;
  state.brow+=(mood.brow*amount-state.brow)*faceEase;state.tilt+=(mood.tilt*amount-state.tilt)*faceEase;
  state.smile+=(mood.smile*amount-state.smile)*faceEase;state.squint+=(mood.squint*amount-state.squint)*faceEase;
  const {jaw,upperLip,upperInside,lowerLip}=state.nodes;
  const width=.25*state.wide-.34*state.round,depth=.009*state.round;
  jaw.bone.rotation.x=.093*state.open;
  jaw.bone.position.y=jaw.rest.y-.007*state.open;
  upperLip.bone.position.set(upperLip.rest.x,upperLip.rest.y+.009*state.open,upperLip.rest.z+depth);
  lowerLip.bone.position.set(lowerLip.rest.x,lowerLip.rest.y-.047*state.open,lowerLip.rest.z+depth);
  const innerEdge=.009*state.open*(.4+state.wide)*(1-.75*state.round);
  upperInside.bone.position.copy(upperLip.bone.position);upperInside.bone.position.y-=innerEdge;
  upperLip.bone.scale.x=upperInside.bone.scale.x=lowerLip.bone.scale.x=1+width;
  for(const side of [-1,1]){
   const key=side<0?'left':'right',corner=state.nodes[key+'Corner'],brow=state.nodes[key+'Brow'],cheek=state.nodes[key+'Cheek'];
   corner.bone.position.set(corner.rest.x+side*(.061*width+Math.max(0,state.smile)*.32),
    corner.rest.y+state.smile-.019*state.open,corner.rest.z+depth*.5);
   brow.bone.position.y=brow.rest.y+state.brow;brow.bone.rotation.z=side*state.tilt;
   cheek.bone.position.y=cheek.rest.y+state.smile*.65;
  }
  return !!pose||state.open>.001||state.round>.001||state.wide>.001||
   Math.abs(state.smile)>.0001||Math.abs(state.squint)>.001||Math.abs(state.tilt)>.001;
 }
 const localTarget=new THREE.Vector3(),axis=new THREE.Vector3(),bend=new THREE.Vector3(),towardElbow=new THREE.Vector3(),towardTip=new THREE.Vector3();
 const desiredUpper=new THREE.Quaternion(),desiredLower=new THREE.Quaternion(),desiredHand=new THREE.Quaternion();
 const baseDown=new THREE.Vector3(0,-1,0);
 const euler=new THREE.Euler();
 function chain(a,b,c){
  const upper=joints[b].position.clone().sub(joints[a].position);
  const lower=joints[c].position.clone().sub(joints[b].position);
  return {a,b,c,upperLength:upper.length(),lowerLength:lower.length(),upper:upper.normalize(),lower:lower.normalize()};
 }
 for(const limb of limbs){
  limb.armChain=chain(limb.arm,limb.forearm,limb.hand);
  limb.legChain=chain(limb.thigh,limb.shin,limb.shoe);
 }
 // Solve two rigid links in their parent's coordinates. Capping the distance
 // keeps an unreachable point from lengthening the actor's sleeves or legs.
 function poseChain(bones,chain,delta,pole,blend){
  const {upperLength:a,lowerLength:b}=chain;
  const d=THREE.MathUtils.clamp(delta.length(),Math.abs(a-b)+.002,a+b-.0001);
  axis.copy(delta);
  if(axis.lengthSq()<.000001)axis.copy(baseDown);else axis.normalize();
  bend.copy(pole).addScaledVector(axis,-axis.dot(pole));
  if(bend.lengthSq()<.000001){
   bend.set(0,0,1);if(Math.abs(axis.z)>.9)bend.set(1,0,0);
   bend.addScaledVector(axis,-axis.dot(bend));
  }
  bend.normalize();
  const projection=(a*a-b*b+d*d)/(2*d);
  const height=Math.sqrt(Math.max(0,a*a-projection*projection));
  towardElbow.copy(axis).multiplyScalar(projection).addScaledVector(bend,height);
  towardTip.copy(axis).multiplyScalar(d).sub(towardElbow);
  desiredUpper.setFromUnitVectors(chain.upper,towardElbow.normalize());
  desiredLower.setFromUnitVectors(chain.lower,towardTip.normalize());
  desiredLower.premultiply(desiredHand.copy(desiredUpper).invert());
  bones[chain.a].quaternion.slerp(desiredUpper,blend);bones[chain.b].quaternion.slerp(desiredLower,blend);
 }
 const pole=new THREE.Vector3(),delta=new THREE.Vector3(),identity=new THREE.Quaternion();
 function relax(bone,x,y,z,blend){desiredHand.setFromEuler(euler.set(x,y,z));bone.quaternion.slerp(desiredHand,blend)}
 function animate(figure,dt,options={}){
  const rig=rigFor(figure);if(!rig)return;
  const {bones}=rig;const body=bones[torso],head=bones[neck];
  const frame=Math.max(0,Math.min(.1,dt)),rate=speed=>options.immediate?1:1-Math.exp(-frame*speed);
  const speed=THREE.MathUtils.clamp(options.walk||0,0,5);
  rig.lastPose=clock;rig.elapsed+=frame;
  rig.activity+=(Math.min(1,speed/.82)-rig.activity)*rate(13);
  rig.sit+=(THREE.MathUtils.clamp(options.sit||0,0,1)-rig.sit)*rate(8);
  rig.phase+=frame*(4.6+1.8*speed)*rig.activity;
  const sideStep=THREE.MathUtils.clamp(options.strideSide||0,-1,1);
  const forward=Math.sqrt(1-sideStep*sideStep);
  const sway=Math.sin(rig.phase)*rig.activity;
  let yaw=0,pitch=0;
  if(options.lookAt){
   figure.worldToLocal(localTarget.copy(options.lookAt));
   localTarget.sub(joints[neck].position);localTarget.y+=.16*rig.sit-.13;
   const flat=Math.hypot(localTarget.x,localTarget.z);
   const peripheral=THREE.MathUtils.smoothstep(localTarget.z/Math.max(.001,flat),-.96,-.35);
   yaw=THREE.MathUtils.clamp(Math.atan2(localTarget.x,localTarget.z),-1.12,1.12)*peripheral;
   pitch=THREE.MathUtils.clamp(-Math.atan2(localTarget.y,flat),-.35,.58)*peripheral;
  }
  body.position.set(sway*(.017+.027*Math.abs(sideStep)),.79-.145*rig.sit+.014*Math.abs(sway),-.04*rig.sit);
  body.rotation.x+=(pitch*.08+.105*rig.sit+.024*rig.activity-body.rotation.x)*rate(5);
  body.rotation.y+=(yaw*.19+.038*sway*forward-body.rotation.y)*rate(5);
  body.rotation.z+=(-sway*.022-body.rotation.z)*rate(6);
  head.rotation.y+=(yaw*.74-head.rotation.y)*rate(8);
  head.rotation.x+=(pitch*.82-head.rotation.x)*rate(7);
  const blink=Math.max(0,1-Math.abs((rig.elapsed%4.7)-4.39)/.11);
  for(const limb of limbs){
   const side=limb.side,lid=bones[limb.lid],iris=bones[limb.iris];
   lid.scale.y=(1-.93*blink)*(1-(rig.expression?.squint||0));
   const residual=yaw-body.rotation.y-head.rotation.y;
   iris.position.x+=(THREE.MathUtils.clamp(residual*1.1,-1,1)*.016-iris.position.x)*rate(30);
   const irisY=-THREE.MathUtils.clamp(pitch-body.rotation.x-head.rotation.x,-.65,.65)*.016;
   iris.position.y+=(irisY-iris.position.y)*rate(28);
   const phase=rig.phase+(side<0?0:Math.PI);
   const stride=Math.cos(phase)*rig.activity*Math.min(.245,.08+speed*.078);
   const lift=Math.max(0,Math.sin(phase))*rig.activity;
   const hip=bones[limb.thigh],foot=bones[limb.shoe];
   hip.position.y=.68-.14*rig.sit-.059*rig.activity;
   delta.set(sideStep*stride,.08+.07*lift-hip.position.y,.04+forward*stride+.15*rig.sit);
   pole.set(side*.12,-.04,1);
   poseChain(bones,limb.legChain,delta,pole,1);
   // Level the planted sandal in world-facing figure space; the swing foot rolls off its toes.
   desiredHand.copy(hip.quaternion).multiply(bones[limb.shin].quaternion).invert();
   desiredLower.setFromEuler(euler.set(-lift*.19,0,0));desiredHand.multiply(desiredLower);
   foot.quaternion.copy(desiredHand);
   const target=side===-1?options.reachRight:options.reachLeft;
   if(target){
    body.worldToLocal(localTarget.copy(target));
    delta.copy(localTarget).sub(bones[limb.arm].position);
    pole.set(side*.86,-.67,-.43);
    poseChain(bones,limb.armChain,delta,pole,rate(18));
    relax(bones[limb.hand],-.17,side*.11,side*.22,rate(12));
   }else{
    const greeting=side<0?rig.greeting:0;
    relax(bones[limb.arm],-.75*greeting+stride*1.75*forward-.25*rig.sit,0,side*.045+stride*sideStep,rate(12));
    relax(bones[limb.forearm],-.32*greeting-.13*lift-.19*rig.sit,0,0,rate(12));
    bones[limb.hand].quaternion.slerp(identity,rate(10));
   }
  }
 }
 function palm(figure,side,out){
  const rig=rigFor(figure);
  if(!rig)throw new TypeError('personPalm requires a story figure');
  const limb=side==='right'?limbs[0]:limbs[1];
  return rig.bones[limb.hand].getWorldPosition(out);
 }
 function attach(figure,object,part){
  const rig=rigFor(figure);if(!rig)return;
  const bone=part==='head'?neck:limbs[part==='right'?0:1].hand;
  rig.bones[bone].attach(object);
 }
 function greeting(figure,amount){
  const record=figures.get(figure);
  if(!record||(!amount&&!record.rig))return;
  const rig=rigFor(figure);rig.greeting=THREE.MathUtils.clamp(amount,0,1);
  if(rig.lastPose!==clock){
   rig.bones[limbs[0].arm].rotation.x=-.75*rig.greeting;
   rig.bones[limbs[0].forearm].rotation.x=-.32*rig.greeting;
  }
 }
 return {build,buildKneeling,animate,palm,greeting,attach,updateEyes,dialogueFace,
  isPerson:figure=>figures.has(figure),
  posedThisFrame:figure=>figures.get(figure)?.rig?.lastPose===clock};
})();

// Hands and gaze targets use world coordinates. The actor's own transform remains under scene control.
const animatePerson=storyPeople.animate,personPalm=storyPeople.palm;
const isStoryPerson=storyPeople.isPerson,personPosedThisFrame=storyPeople.posedThisFrame;
const setGreetingHand=storyPeople.greeting;
const bindPersonAccessory=storyPeople.attach;
const updateOfferingEyes=storyPeople.updateEyes;
const applyDialogueFace=storyPeople.dialogueFace;
