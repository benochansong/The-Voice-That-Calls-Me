const paintedSkyWeather={cover:{value:0},travel:{value:0}};
// Hand-painted surfaces use the same small set of offline, tileable washes in every chapter.
// Details are batched by shape so a basket of fruit or a whole field of stems needs only a few draws.
(()=>{
 let seed=1927;
 function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 function paperTexture(kind){
  const sheet=document.createElement('canvas');sheet.width=sheet.height=256;
  const brush=sheet.getContext('2d'),size=sheet.width;
  brush.fillStyle='#f7f1e5';brush.fillRect(0,0,size,size);
  function stroke(points,color,width){
   brush.strokeStyle=color;brush.lineWidth=width;brush.lineCap='round';brush.beginPath();
   points.forEach(([x,y],i)=>i?brush.lineTo(x,y):brush.moveTo(x,y));brush.stroke();
  }
  // Dry-brush fibres and broad broken patches of pigment.
  for(let n=0;n<1900;n++){
   const x=random()*size,y=random()*size;
   const length=n<110?4+random()*25:1+random()*4;
   stroke([[x,y],[x+length,y+random()*1.7-.85]],n%3?'rgba(100,76,65,.085)':'rgba(255,255,250,.52)',n<110?2.1:1);
  }
  if(kind==='stone'){
   for(let row=0;row<8;row++){
    const y=row*32;
    for(let col=-1;col<5;col++){
     const x=col*64+(row%2)*32;
     const lean=(row*3+col*7)%4;
     const fill=brush.createLinearGradient(x,y,x+45,y+30);
     fill.addColorStop(0,'rgba(255,255,255,.15)');fill.addColorStop(1,'rgba(120,91,75,.10)');
     brush.fillStyle=fill;brush.fillRect(x+2,y+1,61,30);
     stroke([[x+2,y+1],[x+20,y+2],[x+52,y],[x+62,y-1]],'rgba(109,87,71,.25)',2.3);
     stroke([[x+1,y+4],[x+lean,y+20],[x+2,y+29]],'rgba(118,90,68,.21)',1.8);
     stroke([[x+5,y+4],[x+25,y+4]],'rgba(255,255,250,.69)',1.8);
    }
   }
  }else if(kind==='timber'){
   for(let j=0;j<60;j++){
    const y=random()*256,phase=random()*6;
    const points=[];for(let a=0;a<=32;a++)points.push([a*8,y+Math.sin(a*.19635+phase)*2+Math.sin(a*.589+phase)*1.3]);
    stroke(points,j%3?'rgba(92,64,47,.20)':'rgba(255,248,215,.44)',.55+random()*1.7);
   }
  }else if(kind==='sand'){
   for(let j=0;j<130;j++){
    const x=random()*256,y=random()*256,r=.6+random()*1.8;
    stroke([[x-r*1.4,y],[x,y-r*.4],[x+r,y]],'rgba(126,102,77,.24)',r);
   }
  }else if(kind==='linen'){
   for(let j=0;j<256;j+=5){
    stroke([[j,0],[j+1,110],[j,256]],'rgba(117,104,84,.14)',1);
    stroke([[0,j],[122,j+1],[256,j]],'rgba(248,248,236,.60)',1.5);
   }
  }else if(kind==='lake'){
   brush.fillStyle='#e3f1ec';brush.fillRect(0,0,256,256);
   for(let j=0;j<100;j++){
    const x=random()*256,y=random()*256,w=3+random()*35;
    stroke([[x,y],[x+w*.4,y-.6],[x+w,y+1]],j%2?'rgba(112,165,160,.24)':'rgba(255,251,220,.59)',random()*2+1);
   }
  }
  const tex=new T.CanvasTexture(sheet);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;
  tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return tex;
 }
 const textures={};for(const kind of ['sand','stone','timber','linen','lake'])textures[kind]=paperTexture(kind);
 const materialCache=new Map(),uvCache=new Map();
 const woodColors=new Set([wood,0xb07d50,0xbd9060,0xb68456,0xa67750]);
 function dressSurface(mesh){
  if(mesh.geometry!==box||!mesh.material?.isMeshStandardMaterial)return;
  const {x:w,y:h,z:d}=mesh.scale,color=mesh.material.color.getHex();
  let kind;
  if(w>12&&d>8&&h<1)kind=color===water||color===0x517e89?'lake':'sand';
  else if(h>=1.6&&Math.max(w,d)>2.5)kind='stone';
  else if(woodColors.has(color)&&Math.max(w,h,d)>.8)kind='timber';
  else if(h<.24&&w>.33&&d>1.3&&w<2&&mesh.position.y>1.9)kind='linen';
  if(!kind)return;
  const signature=kind+'-'+color;
  if(!materialCache.has(signature)){
   const mat=mesh.material.clone();mat.map=textures[kind];mat.roughness=1;
   materialCache.set(signature,mat);
  }
  mesh.material=materialCache.get(signature);
  // Preserve the physical size of a brush mark on a broad hillside and a narrow post.
  const uvKey=[kind,w,h,d].join('/');
  if(!uvCache.has(uvKey)){
   const geometry=box.clone(),pos=geometry.getAttribute('position'),norm=geometry.getAttribute('normal'),uv=geometry.getAttribute('uv');
   const repeat=kind==='lake'?6:kind==='sand'?3.1:kind==='linen'?.85:kind==='stone'?3.9:2.2;
   for(let i=0;i<pos.count;i++){
    const x=pos.getX(i)*w,y=pos.getY(i)*h,z=pos.getZ(i)*d;
    const top=Math.abs(norm.getY(i))>.5,side=Math.abs(norm.getX(i))>.5;
    let u=side?z:x,v=top?z:y;
    if(kind==='timber'&&((top&&d>w)||(!top&&h>(side?d:w))))[u,v]=[v,u];
    uv.setXY(i,u/repeat,v/repeat);
   }
   uvCache.set(uvKey,geometry);
  }
  mesh.geometry=uvCache.get(uvKey);
 }
 scene.traverse(dressSurface);

 const cutout=new T.BufferGeometry();
 cutout.setAttribute('position',new T.Float32BufferAttribute([0,0,0,-.28,.48,.05,0,1,0,0,0,0,0,1,0,.28,.48,-.045],3));
 cutout.computeVertexNormals();
 // Printed warp, bands of lozenges and a narrow sewn hem. The neutral ink takes the dye
 // of the individual instance, giving the red, teal and saffron lengths their own colour.
 const loom=document.createElement('canvas');loom.width=256;loom.height=256;
 const thread=loom.getContext('2d');thread.fillStyle='#fff9eb';thread.fillRect(0,0,256,256);
 for(let j=0;j<256;j+=3){
  thread.fillStyle=j%2?'rgba(88,63,55,.08)':'rgba(144,126,103,.065)';thread.fillRect(j,0,1,256);
  thread.fillRect(0,j,256,.65);
 }
 for(const y of [30,207]){
  thread.fillStyle='#d8cbb5';thread.fillRect(0,y-6,256,2);thread.fillRect(0,y+11,256,2);
  thread.fillStyle='#bba98f';
  for(let x=-8;x<=256;x+=16){thread.beginPath();thread.moveTo(x,y+2);thread.lineTo(x+5,y-1);thread.lineTo(x+10,y+2);thread.lineTo(x+5,y+7);thread.closePath();thread.fill()}
 }
 const warp=new T.CanvasTexture(loom);warp.colorSpace=T.SRGBColorSpace;warp.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
 // A cloth panel falls in a shallow curve between its top corners.
 const hanging=new T.PlaneGeometry(1,1,12,7),hangPos=hanging.getAttribute('position');
 for(let i=0;i<hangPos.count;i++){
  const x=hangPos.getX(i),y=hangPos.getY(i);
  hangPos.setXYZ(i,x,y-.085*(1-4*x*x),.034*Math.sin((x+.5)*Math.PI*2)*(.85-y*.4));
 }
 hanging.computeVertexNormals();
 const shapes={
  timber:box,stone:new T.DodecahedronGeometry(1),fruit:new T.IcosahedronGeometry(1,1),
  disc:new T.CylinderGeometry(.5,.44,1,12),ring:new T.TorusGeometry(.5,.026,4,24),
  leaf:cutout,cloth:hanging
 };
 const colorInk=new T.Color(),placement=new T.Object3D();
 const paint=new T.MeshStandardMaterial({color:0xffffff,roughness:1,flatShading:true});
 const leafy=paint.clone();leafy.side=T.DoubleSide;
 const woven=leafy.clone();woven.map=warp;
 function paintSet(set,draw){
  const rows=new Map();
  function add(shape,x,y,z,w,h,d,color,rz=0,ry=0,rx=0){
   placement.position.set(x,y,z);placement.rotation.set(rx,ry,rz);placement.scale.set(w,h,d);placement.updateMatrix();
   if(!rows.has(shape))rows.set(shape,[]);
   rows.get(shape).push([placement.matrix.clone(),color]);
  }
  draw(add);
  for(const [shape,strokes] of rows){
   const layer=new T.InstancedMesh(shapes[shape],shape==='cloth'?woven:shape==='leaf'?leafy:paint,strokes.length);
   strokes.forEach(([matrix,color],index)=>{layer.setMatrixAt(index,matrix);layer.setColorAt(index,colorInk.setHex(color))});
   layer.castShadow=shape!=='leaf';layer.receiveShadow=true;layer.computeBoundingSphere();set.add(layer);
  }
 }
 function olive(add,x,y,z,scale){
  const trunk=0x75614a;
  add('timber',x,y+1.25*scale,z,.34*scale,2.55*scale,.39*scale,trunk,.1);
  for(let i=0;i<11;i++){
   const phase=i*2.4,dx=Math.cos(phase)*1.35*scale,dz=Math.sin(phase)*1.1*scale;
   if(i<4)add('timber',x+dx*.46,y+2.12*scale,z+dz*.46,.19*scale,1.42*scale,.2*scale,trunk,-dx*.48,0,dz*.43);
   add('stone',x+dx,y+(2.75+i%3*.31)*scale,z+dz,(1.2+random()*.3)*scale,(.78+random()*.26)*scale,1.12*scale,[0x697f66,0x8e9b79,0x627c70,0xa3a982][i%4],0,phase);
  }
 }
 function grasses(add,x,y,z,n,bloom=false){
  for(let i=0;i<n;i++){
   const bx=x+(random()-.5)*1.5,bz=z+(random()-.5)*1.2,h=.18+random()*.33;
   for(let b=0;b<3;b++)add('leaf',bx,y,bz,.095,h*(1-b*.16),.28,[0x75896c,0xadc08b,0x819477][b],(b-1)*.58,random()*4);
   if(bloom&&i%3===0){
    const petal=i%2?0xf9ddae:0xc78380,flowerY=y+h*.9;
    add('timber',bx,y+h*.45,bz,.013,h*.9,.013,0x86926e);
    for(let k=0;k<4;k++){const a=k*Math.PI*.5+.35;add('fruit',bx+.041*Math.cos(a),flowerY,bz+.041*Math.sin(a),.053,.027,.036,petal,0,-a)}
    add('fruit',bx,flowerY+.018,bz,.029,.024,.029,0xc28c4e);
   }
  }
 }
 function basket(add,x,y,z,r,height,contents){
  add('disc',x,y+height*.5,z,r*2,height,r*2,0xbd9262);
  for(let j=1;j<=4;j++){
   const f=j/4;
   add('ring',x,y+height*f,z,r*(1.8+.22*f),r*(1.8+.22*f),.85, j===4?0xb48653:0x977246,0,0,Math.PI/2);
  }
  add('disc',x,y+height+.004,z,r*1.87,.025,r*1.87,0x77634b);
  if(!contents)return;
  for(let j=0;j<12;j++){
   const a=j*2.4,rad=Math.sqrt(j/12)*r*.79,sz=r*(contents==='loaf'?.39:.26);
   add('fruit',x+Math.cos(a)*rad,y+height+sz*(.9-rad*.4),z+Math.sin(a)*rad,sz*(contents==='loaf'?1.29:1),sz*.83,sz,contents==='loaf'?[0xd6a053,0xe0ad67][j%2]:[0x8b4946,0xb26950,0xc47a56,0x994c43][j%4],0,a);
  }
 }
 function standardRoom(add,x,z){
  basket(add,x,.02,z,.38,.47,'loaf');
  basket(add,x+.74,.02,z+.21,.23,.35,null);
 }
 const market=new T.Group();scene.add(market);market.visible=firstSet[0].visible;firstSet.push(market);
 paintSet(market,add=>{
  for(const side of [-1,1])for(let i=0;i<8;i++){
   add('stone',side*(34+i%3*4),-.8,29-i*7.8,8+i%2*2,2.9+i%3*.9,8.6,
    [0xa3b09a,0xb7b79e,0x95a895][i%3],0,i*.62);
  }
  // The striped canvas casts shade above eye level; its short stitched valance traces the street.
  for(const [cx,cz,tint] of [[0,17,0xaf6352],[-5,8,0x518478],[5,9,0xc39653]]){
   for(let i=0;i<6;i++){
    const x=cx-1.47+i*.59,edge=i%2?tint:0xede0c4;
    for(const s of [-1,1]){
     const y=2.31-s*.11;
     add('cloth',x,y-.08,cz+s*1.24,.59,.18,.46,edge);
     for(let f=-1;f<=1;f++)add('timber',x+f*.18,y-.19,cz+s*1.24,.016,.08,.016,0xcdad84);
    }
   }
  }
  for(const side of [-1,1]){
   const x=side*6.55,z=side>0?9:8;
   add('timber',x,.71,z,1.25,.12,2.18,0x9c7654);
   for(let k of [-1,1])add('timber',x,.35,z+k*.85,.97,.7,.12,0x9c7654);
   basket(add,x,.77,z-.48,.43,.24,side<0?'loaf':'fruit');
   basket(add,x,.77,z+.48,.35,.24,side<0?'fruit':'loaf');
   basket(add,x-.12,.01,z+1.6,.4,.49,null);
  }
  // Draped dyers' cloth and sun-worn shutters lean out of the two house fronts.
  // They stay tight against masonry, outside the walkable alley.
  for(const side of [-1,1]){
   const face=-side*Math.PI/2,front=side*7.86;
   for(let i=0;i<4;i++){
    const z=16-i*8,h=3.2+i%2;
    add('timber',front,1.03,z+.88,.13,2.06,.96,0x554a40);
    for(let j=0;j<5;j++)add('timber',front-side*.09,1.02,z+.50+j*.185,.055,1.93,.176,(i+side)%2?0x657f7c:0x9e7660);
    add('timber',front-side*.02,2.12,z+.88,.26,.19,1.31,0x89715a);
    const clothX=front-side*.24,clothZ=z-1.25,cy=h-.93;
    const dyes=[0x487e80,0xad645c,0xa1a274,0x9a7865],tint=dyes[(i+(side>0?0:1))%4];
    add('timber',clothX,h-.16,clothZ,.14,.12,1.81,0x7f6953);
    add('cloth',clothX,cy,clothZ,1.54,1.38,.54,tint,0,face);
    for(const shift of [-.48,-.41,.48]){
     add('cloth',clothX-side*.025,cy+shift,clothZ,1.54,.055,1.05,0xdfcda4,0,face);
    }
    for(let j=0;j<6;j++)add('timber',clothX,cy-.80,clothZ-.61+j*.246,.036,.14,.031,0xd3bc91);
    // Painted ceramic pot and a spill of herbs at the doorway.
    add('fruit',front-side*.25,.29,z+1.74,.31,.31,.29,[0xc58269,0xa88f69][i%2]);
    for(let j=0;j<8;j++){
     const a=j*2.399;
     add('leaf',front-side*.25+Math.cos(a)*.09,.50,z+1.74+Math.sin(a)*.09,.22,.27+(j%4)*.06,.16,0x708a71,(j%3-1)*.7,a);
    }
   }
  }
  // A recessed door, contrasting timber lintels and textile hangings break up the house in the fork.
  add('timber',0,.93,6.175,1.18,1.84,.055,0x5e5043);
  add('disc',0,1.81,6.18,1.18,.07,.8,0x5e5043,0,0,Math.PI/2);
  for(let j=0;j<6;j++)add('timber',-.46+j*.185,.90,6.211,.17,1.75,.036,[0x946c4c,0x88664b,0x9e7955][j%3]);
  add('timber',0,1.91,6.24,1.44,.15,.22,0x7c6147);
  for(let i=0;i<8;i++)add('timber',-1.78+i*.51,2.86,6.19,.14,.16,.31,0x92724e);
  for(const side of [-1,1]){
   add('timber',side*1.33,1.51,6.184,.77,.81,.041,0x705f4c);
   for(let j=0;j<4;j++)add('timber',side*1.33-.28+j*.18,1.5,6.211,.13,.72,.04,0xa4825b);
   add('timber',side*1.33,1.06,6.25,.94,.11,.23,0xc1a078);
  }
  basket(add,-1.55,.015,6.49,.29,.41,null);
  // An indigo woven shade with ochre selvedges draws the eye above the door.
  for(let i=0;i<7;i++){
   const x=-1.2+i*.40;
   add('cloth',x,2.36,6.78,.405,1.32,.56,i%3===0?0xcab994:0x557e80,0,0,-1.26);
   add('cloth',x,2.07,7.38,.405,.24,.36,i%3===0?0xd1c2a0:0x557e80);
   add('timber',x,2.02,7.405,.395,.032,.018,0xd3aa71);
  }
  for(const x of [-1.38,1.38])add('timber',x,2.15,6.82,.052,.052,1.35,0x745e47,0,0,.32);
  // Side stalls keep their wares visible from Bori's height on either approach.
  for(const [sx,sz,tint] of [[-5,8,0x547f82],[5,9,0xb86c56]]){
   add('cloth',sx+.54,1.74,sz-.92,1.17,.71,1.8,tint);
   basket(add,sx-.43,.01,sz-.42,.29,.34,'fruit');
  }
  // Small still lifes flank the tent. The middle remains open for Bori's approach.
  basket(add,-2.32,.015,15.25,.39,.38,'fruit');
  basket(add,-2.94,.015,15.59,.27,.47,null);
  basket(add,2.42,.015,15.04,.39,.37,'loaf');
  const vine=[0x69856a,0x73957a,0x96a779,0x627d68];
  for(let i=0;i<11;i++){
   const x=-1.8+i*.31, drop=i<4?.87-i*.1:.28;
   for(let j=0;j<4;j++){
    const y=3.17-j*drop*.26,z=6.25+(j%2)*.04;
    add('leaf',x+Math.cos(i+j)*.12,y,z,.32,.29,.72,vine[(i+j)%4],j%2?1.9:-1.95,.13);
   }
  }
  for(let i=0;i<36;i++){
   const z=19-i*.9,x=Math.sin(i*.8)*.26+(i%2?1:-1)*(2.21+.29*Math.sin(i*.56));
   add('stone',x,.005,z,.19+random()*.27,.018,.16+random()*.18,[0xbfa986,0xd7c4a7,0xc7b598][i%3],0,random()*4);
  }
  // Narrow cypress crowns rise above the flat roofs, framing the far blue ridge.
  for(const side of [-1,1])for(let i=0;i<5;i++){
   const x=side*(10.4+i%2*.93),z=10-i*5.2,height=4.9+i%3*.8;
   add('timber',x,height*.35,z,.21,height*.7,.25,0x776c54);
   for(let k=0;k<3;k++)add('stone',x+Math.sin(i+k)*.13,height*(.58+k*.15),z,.69-k*.16,height*.31,.66-k*.15,[0x607c73,0x698778,0x88967d][k],.05*(k-1));
  }
  for(let i=0;i<8;i++)olive(add,(i%2?1:-1)*(13+random()*1.5),-.05,18-i*5.5,1.25+random()*.55);
  for(let i=0;i<25;i++)grasses(add,(i%2?1:-1)*(6.9+random()*.85),0,18-i*1.36,7,i%4===0);
  for(let i=0;i<75;i++){
   const z=19-random()*31,x=(i%2?1:-1)*(2.9+random()*3);
   add('stone',x,.002,z,.08+random()*.13,.018+random()*.014,.055+random()*.09,[0xc7ae83,0xccb18b,0xdfc89d][i%3],0,random()*Math.PI);
  }
 });
 // Keep adornment close to the environment rather than surrounding narrative actors.
 for(const set of [courtyard,roofSet,meal,bethany,upper])paintSet(set,add=>standardRoom(add,-4.8,-4.7));
 for(const set of [hill,meadow,wayside,dawnGarden,breakfastBeach,shore]){
  paintSet(set,add=>{
   const seaside=set===breakfastBeach||set===shore;
   for(let i=0;i<17;i++){
    const x=(i%2?1:-1)*(5.6+random()*1.5),z=seaside?7-random()*11:6-random()*12;
    grasses(add,x,set===hill?hillHeight(z):.01,z,9,i%3===0);
   }
   if(set===hill){
    // Layer the far downs behind the ridge so the world never ends at a straight tabletop.
    for(let j=0;j<17;j++)add('stone',-31+j*3.8,1.8+Math.cos(j*.65)*.75,-21-(j%3)*3,5.2,3.5+Math.sin(j*.7)*.7,4.5,[0x93aa96,0xa9b5a1,0x869e92][j%3]);
   }
   for(const side of [-1,1]){
    const z=seaside?-1.4:-6.8;
    olive(add,side*(8.3+random()*2),set===hill?hillHeight(z):0,z,seaside?.83:1.28);
   }
  });
 }
 if(nativitySet){
  paintSet(nativitySet.field,add=>{
   // Broken straw at the path edge and tied rafters keep the cradle in an inhabited shelter.
   for(let i=0;i<25;i++)add('timber',-3.25+i*.31,3.12,-17.97,.08,.10,2.48,0x9b805b,.02,Math.sin(i)*.045,-.08);
   for(let i=0;i<94;i++){
    const z=6-random()*21,x=Math.sin(z*.21)*.8+(i%2?1:-1)*(1.72+random()*.43);
    add('stone',x,.012,z,.12+random()*.22,.026,.09+random()*.16,0xa39d77,0,random()*4);
   }
   for(let j=0;j<20;j++)grasses(add,(j%2?1:-1)*(3.55+random()*1.2),0,8-j*1.26,7);
   olive(add,-7.2,0,-3.8,1.35);olive(add,8.2,0,-15,1.5);
   basket(add,-2.65,.01,-17.5,.39,.44,null);
  });
 }

 // One atmospheric sky for all rooms and landscapes. It takes its current palette from
 // the chapter, so angel light, a storm and the return to daylight retain their own timing.
 // Paint long banks of clouds in one transparent skyscape. Each cloud is built
 // from translucent overlapping bristle dabs rather than opaque polygon blobs.
 const panorama=document.createElement('canvas');panorama.width=1024;panorama.height=256;
 const skyBrush=panorama.getContext('2d');
 for(let i=0;i<40;i++){
  const x=random()*1024,y=130+random()*85,spread=16+random()*53;
  for(let dab=0;dab<22;dab++){
   const drift=(random()-.5)*spread;
   skyBrush.fillStyle=dab%3?'rgba(255,250,228,.11)':'rgba(215,232,224,.15)';
   for(const shift of [-1024,0,1024]){
    skyBrush.beginPath();skyBrush.ellipse(x+drift+shift,y+random()*3,8+random()*17,1.3+random()*(5.9-Math.abs(drift)/spread*6),0,0,Math.PI*2);skyBrush.fill();
   }
  }
 }
 const cloudAtlas=new T.CanvasTexture(panorama);cloudAtlas.wrapS=T.RepeatWrapping;
 const skyMaterial=new T.ShaderMaterial({
  side:T.BackSide,depthWrite:false,uniforms:{skyTint:{value:new T.Color()},cloudInk:{value:textures.sand},cloudAtlas:{value:cloudAtlas},cover:paintedSkyWeather.cover,travel:paintedSkyWeather.travel},
  vertexShader:`
   varying vec3 viewRay;
   void main(){
    viewRay=position;
    vec4 clip=projectionMatrix*vec4(mat3(viewMatrix)*position,1.0);
    gl_Position=clip.xyww;
   }`,
  fragmentShader:`
   uniform vec3 skyTint;uniform sampler2D cloudInk;uniform sampler2D cloudAtlas;uniform float cover;uniform float travel;varying vec3 viewRay;
   void main(){
    vec3 ray=normalize(viewRay);
    float daylight=smoothstep(.12,.53,dot(skyTint,vec3(.2126,.7152,.0722)));
    float h=clamp(ray.y,0.0,1.0);
    vec3 high=mix(skyTint*vec3(.73,.83,1.04),mix(skyTint,vec3(.38,.65,.77),.70),daylight);
    vec3 low=mix(skyTint*1.10,mix(skyTint,vec3(1.0,.81,.60),.33),daylight);
    vec3 color=mix(low,high,smoothstep(-.07,.61,h));
    vec2 uv=ray.xz/max(.15,h+.10)+vec2(travel,travel*.22);
    float ink=texture2D(cloudInk,uv*vec2(.17,.55)).r;
    float ripple=sin(uv.y*4.5+sin(uv.x*1.7)+sin(uv.x*.8)*2.5);
    float clouds=smoothstep(.14,.83,ripple+(ink-.88)*1.65)*smoothstep(.02,.11,h)*(1.0-smoothstep(.30,.72,h));
    vec2 cloudUV=vec2(atan(ray.z,ray.x)/6.28318+.5+travel*.035,clamp(.05+h*1.4,0.,1.));
    float veil=texture2D(cloudAtlas,cloudUV).a;
    color=mix(color,vec3(.97,.94,.82),daylight*(clouds*.09+veil*.68));
    vec3 stormInk=mix(skyTint*.62,skyTint*1.18,clamp(ink*.4+clouds*.35+veil*.3,0.,1.));
    color=mix(color,stormInk,cover*.8);
    color*=.985+.018*ink;
    gl_FragColor=vec4(color,1.);
    #include <colorspace_fragment>
   }`
 });
 const sky=new T.Mesh(new T.SphereGeometry(1,28,14),skyMaterial);sky.renderOrder=-1000;sky.frustumCulled=false;
 sky.onBeforeRender=()=>skyMaterial.uniforms.skyTint.value.copy(scene.background);
 scene.add(sky);
 // Cool skylight keeps the shadows in warm stone, timber and wool from merging.
 daylightSky.set(0xd7e6ed);daylightGround.set(0xcfc6b1);
 if(!save.prologue){skyLight.color.copy(daylightSky);skyLight.groundColor.copy(daylightGround)}
 sun.color.set(0xffefdc);
 renderer.shadowMap.type=T.PCFSoftShadowMap;
 // A soft contact wash grounds Bori's feet without baking the directional sun into the coat.
 const wash=document.createElement('canvas');wash.width=wash.height=64;
 const ink=wash.getContext('2d'),falloff=ink.createRadialGradient(32,32,2,32,32,32);
 falloff.addColorStop(0,'rgba(81,63,47,.31)');falloff.addColorStop(.52,'rgba(81,63,47,.16)');
 falloff.addColorStop(1,'rgba(81,63,47,0)');ink.fillStyle=falloff;ink.fillRect(0,0,64,64);
 const stamp=new T.CanvasTexture(wash);stamp.colorSpace=T.SRGBColorSpace;
 const contact=new T.Mesh(new T.PlaneGeometry(1.22,1.52),new T.MeshBasicMaterial({
  map:stamp,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1
 }));
 contact.rotation.x=-Math.PI/2;contact.position.y=.012;sheep.add(contact);
})();
