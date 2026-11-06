// Rigid pieces share a matte, vertex-painted surface. Bake them into one mesh per
// joint so the flock can use the same silhouette without a draw call for every curl.
function buildBori(){
 const sheep=new T.Group();
 sheep.name='Bori';
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.96,metalness:0});
 const sphere=new T.SphereGeometry(1,16,12);
 const identity=new T.Matrix4(),vec=new T.Vector3(),normal=new T.Vector3();
 const normalMatrix=new T.Matrix3(),color=new T.Color();
 function joint(parent,name,x=0,y=0,z=0){
  const group=new T.Group();
  group.name=name;group.position.set(x,y,z);parent.add(group);
  return group;
 }
 function paint(parent){
  const positions=[],normals=[],colors=[],indices=[];
  function stamp(geometry,tint,matrix=identity){
   const points=geometry.getAttribute('position'),surface=geometry.getAttribute('normal');
   const pigments=geometry.getAttribute('color'),offset=positions.length/3;
   color.set(tint);normalMatrix.getNormalMatrix(matrix);
   for(let i=0;i<points.count;i++){
    vec.fromBufferAttribute(points,i).applyMatrix4(matrix);
    normal.fromBufferAttribute(surface,i).applyMatrix3(normalMatrix).normalize();
    positions.push(vec.x,vec.y,vec.z);normals.push(normal.x,normal.y,normal.z);
    colors.push(color.r*(pigments?pigments.getX(i):1),color.g*(pigments?pigments.getY(i):1),color.b*(pigments?pigments.getZ(i):1));
   }
   const index=geometry.index;
   for(let i=0;i<(index?index.count:points.count);i++)indices.push(offset+(index?index.getX(i):i));
  }
  return {
   stamp,
   oval(x,y,z,w,h,d,tint,rx=0,ry=0,rz=0){
    const pose=new T.Object3D();
    pose.position.set(x,y,z);pose.scale.set(w,h,d);pose.rotation.set(rx,ry,rz);pose.updateMatrix();
    stamp(sphere,tint,pose.matrix);
   },
   stroke(points,radius,tint){
    const curve=new T.CatmullRomCurve3(points.map(point=>new T.Vector3(...point)));
    const tube=new T.TubeGeometry(curve,10,radius,5,false);stamp(tube,tint);tube.dispose();
   },
   finish(){
    const skin=new T.BufferGeometry();
    skin.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    skin.setAttribute('normal',new T.Float32BufferAttribute(normals,3));
    skin.setAttribute('color',new T.Float32BufferAttribute(colors,3));skin.setIndex(indices);
    skin.computeBoundingSphere();
    const mesh=new T.Mesh(skin,material);
    mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);
   }
  };
 }
 // A single fleece surface with shallow rounded locks. Each lock is lighter at
 // its crest and honey-coloured in the hollow below, like layered watercolour.
 function coat(layer,x,y,z,w,h,d,count,warm,light){
  const wool=new T.SphereGeometry(1,48,32),points=wool.getAttribute('position'),locks=[];
  for(let i=0;i<count;i++){
   const py=1-(2*i+1)/count,ring=Math.sqrt(1-py*py),angle=i*2.399963+.31*Math.sin(i);
   locks.push(new T.Vector3(ring*Math.cos(angle),py,ring*Math.sin(angle)));
  }
  const shadow=new T.Color(warm),crest=new T.Color(light),p=new T.Vector3(),ink=[];
  for(let i=0;i<points.count;i++){
   p.fromBufferAttribute(points,i);
   let nearest=-1;
   for(const lock of locks)nearest=Math.max(nearest,p.dot(lock));
   const bloom=Math.exp(-count*(1-nearest)*1.55),radius=.96+.135*bloom;
   const lit=T.MathUtils.clamp(.36+.36*bloom+.24*p.y-.06*p.z,0,1);
   const tone=shadow.clone().lerp(crest,lit);
   ink.push(tone.r,tone.g,tone.b);
   points.setXYZ(i,x+w*p.x*radius,y+h*p.y*radius,z+d*p.z*radius);
  }
  wool.computeVertexNormals();wool.setAttribute('color',new T.Float32BufferAttribute(ink,3));
  layer.stamp(wool,0xffffff);wool.dispose();
  // Short dry-brush arcs follow a few actual locks, including the rear silhouette.
  for(let i=4;i<locks.length;i+=6){
   const lock=locks[i];
   if(lock.y<-.25)continue;
   const across=new T.Vector3().crossVectors(lock,new T.Vector3(0,1,0)).normalize();
   const up=new T.Vector3().crossVectors(across,lock);
   const arc=[];
   for(let j=0;j<5;j++){
    const angle=.45+j*.55;
    const direction=lock.clone().addScaledVector(across,.145*Math.cos(angle)).addScaledVector(up,-.13*Math.sin(angle)).normalize();
    let nearest=-1;for(const c of locks)nearest=Math.max(nearest,direction.dot(c));
    const radius=.97+.135*Math.exp(-count*(1-nearest)*1.55);
    arc.push([x+w*direction.x*radius,y+h*direction.y*radius,z+d*direction.z*radius]);
   }
   layer.stroke(arc,w*.012,0xdcc29b);
  }
 }
 const coatShade=0xdfc494,cream=0xfff0ce,skin=0xbb8e74,chin=0xe0b998,hoof=0x715449;
 const facing=joint(sheep,'bori-facing'),trunk=joint(facing,'bori-body');
 const fleece=paint(trunk);
 coat(fleece,0,.605,.065,.395,.355,.555,49,coatShade,cream);

 fleece.finish();
 const tail=joint(trunk,'bori-tail',0,.68,.53),tailLayer=paint(tail);
 tailLayer.oval(0,-.085,.075,.125,.185,.12,0xf4ddaf,-.46);
 tailLayer.oval(.009,-.19,.105,.081,.092,.08,0xe7c999);tailLayer.finish();

 const head=joint(trunk,'bori-head',0,.865,-.38),face=paint(head);
 const faceSurface=new T.SphereGeometry(1,32,24),fp=faceSurface.getAttribute('position'),wash=[];
 const forehead=new T.Color(skin),underChin=new T.Color(chin);
 for(let i=0;i<fp.count;i++){
  const px=fp.getX(i),py=fp.getY(i),pz=fp.getZ(i);
  const taper=.9+.22*pz;
  fp.setXYZ(i,.254*px*taper,.206*py-.018+.075*pz,-.173+.279*pz);
  const dye=forehead.clone().lerp(underChin,T.MathUtils.clamp(-.46*pz-.35*py+.20,0,1));
  wash.push(dye.r,dye.g,dye.b);
 }
 faceSurface.computeVertexNormals();faceSurface.setAttribute('color',new T.Float32BufferAttribute(wash,3));
 face.stamp(faceSurface,0xffffff);faceSurface.dispose();
 // The brow sits above the eye sockets; the lower muzzle stays clear of the wool.
 coat(face,0,.164,-.116,.244,.145,.216,27,0xe4ca9e,0xffefce);
 face.oval(-.073,.101,-.287,.116,.089,.072,0xf8e3bb,.18,.15,-.28);
 face.oval(.031,.098,-.287,.077,.083,.066,0xf5dcac,.14,-.2,.38);
 face.oval(0,-.065,-.444,.071,.032,.024,0x795a50,-.18);
 face.oval(-.031,-.057,-.463,.011,.007,.006,0x503e38);
 face.oval(.031,-.057,-.463,.011,.007,.006,0x503e38);
 face.stroke([[0,-.078,-.452],[0,-.089,-.452],[0,-.098,-.445]],.005,0x987263);
 for(const side of [-1,1]){
  face.stroke([[0,-.098,-.445],[side*.033,-.105,-.438],[side*.062,-.099,-.428]],.005,0x9f7667);
 }
 face.finish();
 const eyes=[];
 for(const side of [-1,1]){
  const eye=joint(head,'bori-eye-'+side,side*.181,.003,-.294);
  eye.rotation.y=-side*.75;eyes.push(eye);
  const lid=paint(eye);
  lid.oval(0,0,0,.061,.052,.023,0x71534b);
  lid.oval(0,.001,-.015,.052,.046,.022,0x42352e);
  lid.oval(-.008,.012,-.035,.012,.012,.007,0xfff5d9);
  lid.oval(.024,-.018,-.035,.005,.005,.003,0xd8b48b);lid.finish();
 }
 const ears=[];
 for(const side of [-1,1]){
  const ear=joint(head,'bori-ear-'+side,side*.178,.092,-.087),leaf=paint(ear);
  ears.push(ear);
  // Flattened tapered lobes with an inset warm inner leaf; the right tip has
  // the barley-coloured marking that Jesus sees when naming Bori.
  const length=side===1?.405:.387;
  const blade=new T.SphereGeometry(1,24,18),points=blade.getAttribute('position'),colors=[];
  const base=new T.Color(0xc9a087),inner=new T.Color(0xe2a08b),wheaten=new T.Color(0xb28f58);
  for(let i=0;i<points.count;i++){
   const xx=points.getX(i),yy=points.getY(i),zz=points.getZ(i);
   const along=(side*xx+1)/2;
   const shape=.72+.42*(1-along);
   points.setXYZ(i,side*length*along,-.034*along+.104*yy*shape,.037*along+.069*zz*shape);
   const inside=T.MathUtils.smoothstep(-zz,.38,.75)*Math.sin(Math.PI*along);
   const dye=base.clone().lerp(inner,inside);
   if(side===1)dye.lerp(wheaten,T.MathUtils.smoothstep(along,.6,.92)*.78);
   colors.push(dye.r,dye.g,dye.b);
  }
  blade.computeVertexNormals();blade.setAttribute('color',new T.Float32BufferAttribute(colors,3));leaf.stamp(blade,0xffffff);
  blade.dispose();
  leaf.stroke([[side*.075,.007,-.041],[side*.164,.002,-.046],[side*.241,-.006,-.034]],.0055,0xb88470);
  leaf.finish();ear.rotation.z=side*(-.26+(side===1?.07:0));
 }
 const boriMouthAnchor=joint(head,'bori-mouth-contact',0,-.098,-.445);
 const legs=[],shins=[];
 for(const x of [-.209,.209]){
  for(const z of [-.235,.317]){
   const leg=joint(trunk,'bori-leg-'+legs.length,x,.475,z),limb=paint(leg);
   legs.push(leg);
   limb.oval(0,-.085,0,.098,.18,.096,0xe5ca9e);
   limb.oval(0,-.19,.008,.073,.1,.072,0xc6a087);limb.finish();
   const shin=joint(leg,'bori-pastern',0,-.225,.008),ankle=paint(shin);shins.push(shin);
   ankle.oval(0,-.087,-.002,.061,.122,.057,skin);
   for(const toe of [-1,1])ankle.oval(toe*.033,-.191,-.021,.042,.049,.071,hoof,-.13);
   ankle.finish();
  }
 }
 sphere.dispose();
 return {sheep,facing,trunk,head,eyes,ears,legs,shins,tail,boriMouthAnchor,
  state:{heading:0,stride:0,activity:0,seat:0,rest:0,alert:0,elapsed:0}};
}

// Bearing uses the same convention as the sound compass: zero is world -Z,
// positive angles turn toward +X. Three's rotation around Y uses the opposite sign.
function updateBori(dt,moving,pace,worldBearing,drinkProgress,sitting,resting=false){
 const {state,facing,trunk,tail,eyes,shins}=bori;
 const smooth=(rate)=>1-Math.exp(-dt*rate);
 const angular=(angle)=>Math.atan2(Math.sin(angle),Math.cos(angle));
 const sipping=Number.isFinite(drinkProgress);
 const dip=sipping?T.MathUtils.smoothstep(drinkProgress,.12,.52)*(1-T.MathUtils.smoothstep(drinkProgress,.82,1)):0;
 const attention=Number.isFinite(worldBearing);
 state.elapsed+=dt;
 state.rest+=((resting?1:0)-state.rest)*smooth(4.5);
 state.heading+=angular(sheep.rotation.y-state.heading)*smooth(sipping?22:13);
 // Always align to the anchor during contact, even if Bori came from behind the hand.
 facing.rotation.y=angular(state.heading-sheep.rotation.y)*(1-dip);
 state.activity+=((moving?1:0)-state.activity)*smooth(moving?11:16);
 state.seat+=((sitting?1:0)-state.seat)*smooth(10);
 state.alert+=((attention?1:0)-state.alert)*smooth(attention?16:8);
 const speed=T.MathUtils.clamp(pace,0,5.5);
 state.stride+=dt*(4.8+speed*2.6)*state.activity;
 const phase=state.stride,activity=state.activity*(1-dip);
 const breath=Math.sin(state.elapsed*2.1);
 trunk.position.y=(.006*breath+.032*activity*(.5-.5*Math.cos(2*phase))-.14*state.seat)*(1-dip);
 trunk.scale.x=1+.009*breath*(1-activity);
 trunk.rotation.x=(.035*Math.sin(phase)*activity-.11*state.seat)*(1-dip);
 trunk.rotation.z=.023*Math.sin(phase)*activity;
 tail.rotation.z=.13*Math.sin(state.elapsed*2.6)+activity*.19*Math.sin(phase);
 tail.rotation.x=-.1-.15*state.alert;
 for(let i=0;i<legs.length;i++){
  const front=i%2===0,left=i<2;
  const offset=front===left?0:Math.PI;
  const swing=Math.sin(phase+offset+(front?0:.22));
  legs[i].rotation.x=swing*activity*(.34+speed*.055)-(front?.16:.8)*state.seat;
  shins[i].rotation.x=-Math.max(0,swing)*activity*.33+(front?.32:1.45)*state.seat;
 }
 const relative=attention?angular(worldBearing+state.heading):0;
 const lookYaw=-T.MathUtils.clamp(relative,-.85,.85)*state.alert;
 head.rotation.y+=(lookYaw-head.rotation.y)*smooth(10);
 head.rotation.y*=1-dip;
 head.rotation.z=((attention?Math.sin(relative):0)*.105*state.alert+.018*breath)*(1-dip);
 head.rotation.x=(.017*breath+.06*Math.sin(phase)*activity+.1*state.alert)*(1-dip)-.35*dip;
 // Match the mouth marker to (.0,.62,-.765) at full extension, including the chin angle.
 const mouth=boriMouthAnchor.position;
 head.position.y=.865+(.62-Math.cos(-.35)*mouth.y+Math.sin(-.35)*mouth.z-.865)*dip;
 head.position.z=-.38+(-.765-Math.sin(-.35)*mouth.y-Math.cos(-.35)*mouth.z+.38)*dip;
 for(let i=0;i<2;i++){
  const side=i===0?-1:1;
  const headRelative=relative+head.rotation.y;
  const near=(1+side*Math.sin(relative))/2;
  const droop=side*(-.26+(side===1?.07:0)+.07*Math.sin(phase-.6)*activity);
  const lift=side*(.39+.81*near);
  const ear=ears[i];
  // As the nose dips, sweep the ears up and behind the cheek, leaving the eye visible.
  const rotation=T.MathUtils.lerp(T.MathUtils.lerp(droop,lift,state.alert),side*.38,dip);
  ear.rotation.z+=(rotation-ear.rotation.z)*smooth(9+near*12);
  const swivel=side*T.MathUtils.lerp(.04+.69*Math.cos(headRelative)*state.alert,-.57,dip);
  ear.rotation.y+=(swivel-ear.rotation.y)*smooth(9+near*9);
 }
 const blinkCycle=state.elapsed%4.35;
 const blink=Math.max(0,1-Math.abs(blinkCycle-3.9)/.12);
 for(const eye of eyes)eye.scale.y=1-.94*Math.max(blink,state.rest);

 // Settling to sleep begins with the knees. The belly descends a beat later
 // and the head rests beside the forelegs rather than hanging off the snout.
 const fold=T.MathUtils.smoothstep(state.rest,0,.82);
 const settle=T.MathUtils.smoothstep(state.rest,.26,1);
 if(fold>0){
  const sleepingBreath=Math.sin(state.elapsed*1.55);
  trunk.position.y=T.MathUtils.lerp(trunk.position.y,-.218+.003*sleepingBreath,settle);
  trunk.rotation.x*=1-settle;trunk.rotation.z*=1-settle;
  trunk.scale.x=T.MathUtils.lerp(trunk.scale.x,1+.013*sleepingBreath,settle);
  for(let i=0;i<legs.length;i++){
   const front=i%2===0;
   legs[i].rotation.x=T.MathUtils.lerp(legs[i].rotation.x,front?1.21:-1.19,fold);
   shins[i].rotation.x=T.MathUtils.lerp(shins[i].rotation.x,front?-2.38:2.36,fold);
  }
  head.position.y=T.MathUtils.lerp(head.position.y,.566,settle);
  head.position.z=T.MathUtils.lerp(head.position.z,-.407,settle);
  head.rotation.y=T.MathUtils.lerp(head.rotation.y,-.84,settle);
  head.rotation.x=T.MathUtils.lerp(head.rotation.x,-.35,settle);
  head.rotation.z=T.MathUtils.lerp(head.rotation.z,.16,settle);
  for(let i=0;i<ears.length;i++){
   const side=i===0?-1:1;
   ears[i].rotation.y=T.MathUtils.lerp(ears[i].rotation.y,-side*.45,settle);
   ears[i].rotation.z=T.MathUtils.lerp(ears[i].rotation.z,-side*.21,settle);
  }
  tail.rotation.z*=1-settle;
 }
}
