// Highlight the food itself in a low, lamb-height view. The flour and scores
// are painted into a shared surface; the flat bread still casts a clear shadow.
const breadSurface=(()=>{
 const geometry=new T.SphereGeometry(1,32,18),points=geometry.getAttribute('position'),colors=[];
 const crust=new T.Color(0xc18a4d),flour=new T.Color(0xf4d29a),toast=new T.Color(0xab6939);
 for(let i=0;i<points.count;i++){
  const x=points.getX(i),y=points.getY(i),z=points.getZ(i);
  const edge=1+.043*Math.sin(x*7+z*3)+.022*Math.cos(z*10-x*4);
  // Paler transverse scores and toasted shoulders on the top face.
  const line=Math.min(...[-.43,0,.43].map(offset=>Math.abs(x+z*.34-offset)));
  const slash=Math.exp(-line*line*490)*(1-T.MathUtils.smoothstep(Math.abs(z),.37,.67))*Math.max(0,y);
  const color=crust.clone().lerp(toast,(.4+.24*Math.sin(x*8+z*4))*Math.max(0,y)).lerp(flour,slash);
  colors.push(color.r,color.g,color.b);
  points.setXYZ(i,x*edge,y*(1+.03*Math.sin(x*6))-.13*slash,z*edge);
 }
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();return geometry;
})();
const breadPaint=new T.MeshStandardMaterial({vertexColors:true,roughness:1});
function sharingLoaf(set,x,y,z,rx,ry,rz){
 const mesh=new T.Mesh(breadSurface,breadPaint);mesh.position.set(x,y,z);mesh.scale.set(rx,ry,rz);
 mesh.castShadow=mesh.receiveShadow=true;set.add(mesh);return mesh;
}
function sharingFish(set,x,y,z,length){
 const fish=new T.Group();fish.position.set(x,y,z);fish.scale.setScalar(length);set.add(fish);
 oval(fish,0x859894,.04,0,0,.37,.13,.13);
 const tailShape=new T.BufferGeometry();
 tailShape.setAttribute('position',new T.Float32BufferAttribute([-.25,0,0,-.5,.14,0,-.48,0,0,-.25,0,0,-.48,0,0,-.5,-.13,0],3));
 tailShape.computeVertexNormals();
 const tail=new T.Mesh(tailShape,new T.MeshStandardMaterial({color:0x697b78,side:T.DoubleSide,roughness:1}));
 tail.castShadow=true;fish.add(tail);
 for(const side of [-1,1])oval(fish,0x3e4d48,.29,.036,side*.096,.023,.022,.013);
 return fish;
}
function breadBasket(set,x,z){
 part(set,new T.CylinderGeometry(.51,.36,.68,18),0xb48b58,x,.34,z,1,1,.75);
 oval(set,0x806442,x,.696,z,.48,.034,.34);
 for(let j=0;j<4;j++){
  const r=.37+j*.043,y=.10+j*.18;
  const rim=part(set,new T.TorusGeometry(r,.015,5,24),j===3?0xc5a779:0x92724f,x,y,z,1,.75,1);
  rim.rotation.x=Math.PI/2;
 }
}

// One prop follows the giver's articulated palm, then the receiver's. Directions and
// offsets are calculated in world space so seated and turned figures can share a meal.
class SharedMeal {
 constructor(giver,servings){
  this.giver=giver;
  this.servings=servings;
  this.intents=new Map();
  this.chest=new T.Vector3();
  this.up=new T.Vector3(0,1,0);
  this.from=new T.Vector3();this.to=new T.Vector3();
  this.lastTime=null;
  for(const serving of servings){
   serving.source=new T.Vector3(...serving.source);
   if(serving.place)serving.place=new T.Vector3(...serving.place);
   serving.receiverHand=serving.hand==='left'?'right':'left';
   serving.giveAt=new T.Vector3();serving.takeAt=new T.Vector3();
   serving.contact=new T.Vector3();serving.axis=new T.Vector3();serving.goal=new T.Vector3();
   serving.receiveHome=new T.Vector3();serving.carryAt=new T.Vector3();
  }
 }
 restingPalm(figure,hand,out){
  return figure.localToWorld(out.set(hand==='left'?.29:-.29,.67,.13));
 }
 animate(dt,time,carrySpeed=0){
  // time=0 on either side of entering a scene is a reproducible, resting tableau.
  const reset=this.lastTime===null||time<this.lastTime;
  this.lastTime=time;
  this.intents.clear();
  for(const serving of this.servings){
   const p=T.MathUtils.clamp((time-serving.start)/serving.duration,0,1);
   serving.phase=p;
   if(p<=.14)serving.prop.position.copy(serving.source);
   if(p===0){serving.prop.position.copy(serving.source);continue}
   if(p===1&&serving.place){serving.prop.position.copy(serving.place);continue}
   const {receiver,hand,receiverHand,giveAt,takeAt,axis,goal,contact}=serving;
   const giver=this.giver;
   const giveSide=hand==='left'?1:-1,takeSide=-giveSide;
   const giving=p<.74;
   // Both palms approach opposite sides of the object, just in front of their chests.
   const from=giver.localToWorld(this.from.set(giveSide*.38,1.13,.25));
   const to=receiver.localToWorld(this.to.set(takeSide*.38,1.13,.25));
   contact.copy(from).lerp(to,.5);
   axis.subVectors(to,from);axis.y=0;
   if(axis.lengthSq()<.01)axis.subVectors(receiver.position,giver.position);
   axis.normalize();
   const rest=this.restingPalm(receiver,receiverHand,serving.receiveHome);
   receiver.localToWorld(serving.carryAt.set(takeSide*.21,1.01,.34));
   // Physical support is slightly below the bread or fish; a cup is held by its side.
   const height=serving.height,margin=serving.margin;
   if(giving){
    const home=this.restingPalm(giver,hand,this.from);
    giver.localToWorld(this.chest.set(giveSide*.20,1.17,.34));
    this.chest.addScaledVector(this.up,height);
    if(p<.16){
     giveAt.copy(serving.source).addScaledVector(axis,-margin).addScaledVector(this.up,-height);
     giveAt.lerp(home,1-T.MathUtils.smootherstep(p,0,.14));
    }else{
     goal.copy(serving.source).lerp(this.chest,T.MathUtils.smootherstep(p,.16,.33))
      .lerp(contact,T.MathUtils.smootherstep(p,.33,.48));
     giveAt.copy(goal).addScaledVector(axis,-margin).addScaledVector(this.up,-height)
      .lerp(home,T.MathUtils.smootherstep(p,.6,.74));
    }
    this.intent(giver,hand,giveAt,p<.33?serving.source:contact,reset);
   }
   if(p<.60){
    takeAt.copy(contact).addScaledVector(axis,margin).addScaledVector(this.up,-height);
    takeAt.lerp(rest,1-T.MathUtils.smootherstep(p,.27,.48));
   }else{
    takeAt.copy(serving.carryAt);
    if(p<.78){
     this.to.copy(contact).addScaledVector(axis,margin).addScaledVector(this.up,-height);
     takeAt.lerp(this.to,1-T.MathUtils.smootherstep(p,.60,.78));
    }
    if(serving.place){
     this.to.copy(serving.place).addScaledVector(axis,margin).addScaledVector(this.up,-height);
     takeAt.lerp(this.to,T.MathUtils.smootherstep(p,.80,.93)).lerp(rest,T.MathUtils.smootherstep(p,.96,1));
    }
   }
   this.intent(receiver,receiverHand,takeAt,p<.74?contact:takeAt,reset);
   if(p===1&&!serving.place)this.intents.get(receiver).walk=carrySpeed;
  }
  for(const [person,intent] of this.intents)animatePerson(person,dt,intent);
  for(const serving of this.servings){
   const p=serving.phase;
   if(p<=.14||p===1&&serving.place)continue;
   const {axis,margin,height,prop}=serving;
   if(p<.60){
    personPalm(this.giver,serving.hand,this.from).addScaledVector(axis,margin).addScaledVector(this.up,height);
    personPalm(serving.receiver,serving.receiverHand,this.to).addScaledVector(axis,-margin).addScaledVector(this.up,height);
    prop.position.copy(serving.source).lerp(this.from,T.MathUtils.smootherstep(p,.14,.18))
      .lerp(this.to,T.MathUtils.smootherstep(p,.5,.6));
   }else{
    personPalm(serving.receiver,serving.receiverHand,prop.position).addScaledVector(axis,-margin).addScaledVector(this.up,height);
    if(serving.place)prop.position.lerp(serving.place,T.MathUtils.smootherstep(p,.92,.96));
   }
  }
 }
 intent(person,hand,target,look,immediate){
  let intent=this.intents.get(person);
  if(!intent){intent={lookAt:look,immediate};this.intents.set(person,intent)}
  intent[hand==='left'?'reachLeft':'reachRight']=target;
 }
}

const mealCameraEye=new T.Vector3(),mealCameraFocus=new T.Vector3();
function composeMealView(eye,focus){
 const s=save.chapterStep,p=sheep.position;
 let service,duration;
 if(s==='lastMeal'){service=supperService;duration=10}
 else if(s==='mealMorning'){service=shoreService;duration=9}
 else if(s==='sharing'){service=meadowService;duration=3.2}
 else return;
 // The near side of the table and the doorway give different views. Walking
 // away or looking elsewhere immediately lets the usual over-the-shoulder view take over.
 const giver=service.giver.position,deltaX=giver.x-p.x,deltaZ=giver.z-p.z;
 const distance=Math.hypot(deltaX,deltaZ),bearing=Math.atan2(deltaX,-deltaZ);
 const nearby=1-T.MathUtils.smoothstep(distance,3.8,6.1);
 const looking=T.MathUtils.smoothstep(Math.cos(yaw-bearing),.15,.55);
 const weight=nearby*looking*T.MathUtils.smootherstep(beatTime,0,.9)*(1-T.MathUtils.smootherstep(beatTime,duration-.95,duration));
 if(!weight)return;
 const from=service.servings[0].receiver.position,to=service.servings[1].receiver.position;
 const switchHands=s==='sharing'?.5:T.MathUtils.smootherstep(beatTime,3.85,4.8);
 mealCameraFocus.copy(from).lerp(to,switchHands).lerp(giver,.52);
 mealCameraFocus.y=1.11;mealCameraFocus.z+=.13;
 const side=p.x<=giver.x?-1:1,sn=Math.sin(yaw),cs=Math.cos(yaw);
 mealCameraEye.set(p.x-1.05*sn+side*.78*cs,1.42,p.z+1.05*cs+side*.78*sn);
 eye.lerp(mealCameraEye,weight*.95);
 focus.lerp(mealCameraFocus,weight*.92);
}
