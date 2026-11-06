// A plank-built fishing skiff, with a pitched keel, open cockpit and a net
// hanging over the gunwale. All fittings share one vertex-coloured mesh.
function buildStorySkiff(length,width){
 const T=THREE,xyz=[],colours=[],ink=new T.Color();
 const point=(x,y,z)=>new T.Vector3(x,y,z);
 function triangle(a,b,c,color){
  ink.setHex(color);
  for(const p of [a,b,c]){xyz.push(p.x,p.y,p.z);colours.push(ink.r,ink.g,ink.b)}
 }
 function quad(a,b,c,d,color){triangle(a,b,c,color);triangle(a,c,d,color)}
 function rod(a,b,radius,color){
  const axis=b.clone().sub(a).normalize();
  const helper=Math.abs(axis.y)>.91?point(0,0,1):point(0,1,0);
  const u=axis.clone().cross(helper).normalize().multiplyScalar(radius),v=axis.clone().cross(u);
  const rim=[u,v,u.clone().negate(),v.clone().negate()];
  for(let i=0;i<4;i++){
   const off=rim[i],next=rim[(i+1)%4];
   quad(a.clone().add(off),b.clone().add(off),b.clone().add(next),a.clone().add(next),color);
  }
 }
 const half=length*.5,beam=width*.5;
 function breadth(t){return beam*(1-Math.pow(Math.abs(t),1.75))+.027}
 function hullPoint(t,level,side,inner=false){
  const taper=Math.abs(t),floor=inner?-.07:-.19;
  const x=breadth(t)*[.19,.61,.83,.96,1][level]*(inner?.94:1);
  const y=floor+[0,.15,.34,.57,.8][level]+taper*taper*(.13+level*.026);
  return point(side*x,y,t*half);
 }
 const stations=12,boards=[0x634936,0x895e41,0xa37653,0xb98a61];
 for(let k=0;k<stations;k++){
  const a=-1+2*k/stations,b=-1+2*(k+1)/stations;
  for(const side of [-1,1]){
   for(let j=0;j<4;j++){
    quad(hullPoint(a,j,side),hullPoint(b,j,side),hullPoint(b,j+1,side),hullPoint(a,j+1,side),boards[j]);
    quad(hullPoint(a,j,side,true),hullPoint(a,j+1,side,true),hullPoint(b,j+1,side,true),hullPoint(b,j,side,true),[0x795942,0x8c684d,0x9c7959,0xa88564][j]);
    if(j>0)rod(hullPoint(a,j,side),hullPoint(b,j,side),.012,0x75573f);
   }
   const oa=hullPoint(a,4,side),ob=hullPoint(b,4,side);
   const ia=hullPoint(a,4,side,true),ib=hullPoint(b,4,side,true);
   // The inside shell has a raised sole; bring its upper lip back to the sheer line.
   quad(oa,ob,ib,ia,0xc39b6c);rod(ia,ib,.028,0xcba077);
  }
  quad(hullPoint(a,0,-1,true),hullPoint(b,0,-1,true),hullPoint(b,0,1,true),hullPoint(a,0,1,true),0x89684c);
 }
 // Frames remain exposed between the two rowing benches.
 for(const t of [-.75,-.50,-.25,0,.25,.50,.75]){
  for(const side of [-1,1])for(let j=0;j<4;j++){
   const a=hullPoint(t,j,side,true),b=hullPoint(t,j+1,side,true);
   a.x*=.96;b.x*=.96;rod(a,b,.034,0x705541);
  }
  rod(hullPoint(t,0,-1,true),hullPoint(t,0,1,true),.04,0x705541);
 }
 for(const t of [-.35,.40]){
  const w=breadth(t)*.85,z=t*half,y=.43;
  const a=point(-w,y,z-.12),b=point(w,y,z-.12),c=point(w,y,z+.12),d=point(-w,y,z+.12);
  quad(a,b,c,d,0xcb9c6b);quad(d,c,point(w,y-.085,z+.12),point(-w,y-.085,z+.12),0x956d4c);
 }
 for(const sign of [-1,1]){
  const z=half*sign,shoulder=hullPoint(sign,4,1,true).y;
  rod(point(0,-.01,z*.965),point(0,shoulder+.07,z*1.025),.065,0x805a41);
 }
 // A paddle kept diagonally across the thwarts, broadening to a carved blade.
 const h=point(-.38*beam,.46,-half*.60),m=point(.38*beam,.49,half*.44),tip=point(.53*beam,.47,half*.77);
 rod(h,m,.032,0xcb9d68);
 const mid=m.clone().lerp(tip,.6);
 quad(m,mid.clone().add(point(.105,0,-.02)),tip,mid.clone().add(point(-.105,0,.02)),0xb88452);

 // Trace diagonal lines on a folded surface. The middle rests on the rail;
 // the near edge hangs loose against the hull and sinks between net ties.
 function netPoint(u,v){
  const z=(-.48+u*.68)*half+.055*Math.sin(v*Math.PI*2+u*4);
  const t=z/half,w=breadth(t);
  const x=v<.5?w*(.99+v*.11):w*(1.045-(v-.5)*.98);
  const sag=.06*Math.sin(Math.PI*u)+.026*Math.sin(4*Math.PI*u+v*2);
  const y=.85+.23*t*t-Math.abs(v-.50)*(v<.5?1.02:.51)-sag*Math.abs(v-.5)*2;
  return point(x,y,z);
 }
 function strand(u0,v0,u1,v1,r,w){
  let a=netPoint(u0,v0);for(let j=1;j<=4;j++){
   const t=j/4,b=netPoint(u0+(u1-u0)*t,v0+(v1-v0)*t);
   rod(a,b,r,w);a=b;
  }
 }
 const across=9,rows=5;
 for(let i=0;i<across;i++)for(let j=0;j<rows;j++){
  const u=i/across,v=j/rows;
  if((i+j)%2)strand(u,v,(i+1)/across,(j+1)/rows,.009,0x927e63);
  else strand(u,(j+1)/rows,(i+1)/across,v,.009,0xaa987d);
 }
 for(const edge of [0,1])strand(0,edge,1,edge,.018,0x7f6c55);
 const geometry=new T.BufferGeometry();
 geometry.setAttribute('position',new T.Float32BufferAttribute(xyz,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));geometry.computeVertexNormals();
 const skiff=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1}));
 skiff.name='Planked fishing skiff';skiff.castShadow=skiff.receiveShadow=true;
 return skiff;
}
