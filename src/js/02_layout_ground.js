/* ---------- world layout ---------- */
// Scene layout — assigned by setScene() in 06_world.js
let PLAZA, POND, GROVE=null, PATHS=[], PATH_SAMPLES=[], CLEARINGS=[], GROUND_TINT=null, SCENE={};
function sampleCurve(pts,step){
  const out=[];
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];
    const n=Math.max(2,Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])/step));
    for(let j=0;j<n;j++){
      const t=j/n,t2=t*t,t3=t2*t;
      const f=(a,b,c,d)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);
      out.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1])]);
    }
  }
  out.push(pts[pts.length-1]);return out;
}

/* surface grid: 0 snow, 1 path/plaza, 2 ice */
const GC = 10; let GW = W/GC, GH = H/GC, surf = new Uint8Array(GW*GH);
function sizeWorld(w,h){W=w;H=h;GW=W/GC;GH=H/GC;surf=new Uint8Array(GW*GH);ground.width=W*GS;ground.height=H*GS;}
function buildSurface(){
  PATH_SAMPLES=PATHS.map(p=>sampleCurve(p,6));
  for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){
    const x=gx*GC+5,y=gy*GC+5;let s=0;
    if(Math.hypot(x-PLAZA.x,(y-PLAZA.y)*1.15)<PLAZA.r+8) s=1;
    for(const c of CLEARINGS)if(Math.hypot(x-c.x,(y-c.y)*1.15)<c.r)s=1;
    const ex=(x-POND.x)/POND.rx, ey=(y-POND.y)/POND.ry;
    if(ex*ex+ey*ey<0.92) s=2;
    surf[gy*GW+gx]=s;
  }
  for(const smp of PATH_SAMPLES)for(const [x,y] of smp){
    for(let dy=-40;dy<=40;dy+=GC)for(let dx=-40;dx<=40;dx+=GC){
      if(dx*dx+dy*dy>36*36)continue;
      const gx=((x+dx)/GC)|0, gy=((y+dy)/GC)|0;
      if(gx>=0&&gy>=0&&gx<GW&&gy<GH&&surf[gy*GW+gx]!==2) surf[gy*GW+gx]=1;
    }
  }
}
function surfaceAt(x,y){const gx=(x/GC)|0,gy=(y/GC)|0;if(gx<0||gy<0||gx>=GW||gy>=GH)return 0;return surf[gy*GW+gx];}

/* ---------- ground painting (done once) ---------- */
const ground = canvas(W*GS,H*GS);
function paintGround(){
  const g=ground.getContext('2d'); g.setTransform(GS,0,0,GS,0,0); g.globalCompositeOperation='source-over'; g.globalAlpha=1;
  let gr=g.createLinearGradient(0,0,W*.4,H);gr.addColorStop(0,'#dbe5f1');gr.addColorStop(1,'#c3d1e3');
  g.fillStyle=gr;g.fillRect(0,0,W,H);

  // soft drifts
  for(let i=0;i<460;i++){
    const x=rand(-50,W+50),y=rand(-50,H+50),r=rand(40,230),light=R()<.55;
    const c=light?[246,250,253]:[150,172,204], a=light?.55:.26;
    const rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,rgba(c,a));rg.addColorStop(1,rgba(c,0));
    g.fillStyle=rg;g.beginPath();g.ellipse(x,y,r,r*.62,0,0,TAU);g.fill();
  }
  // wind-carved drift ridges (shadow under a bright lip)
  for(let i=0;i<90;i++){
    const x=rand(0,W),y=rand(0,H),w=rand(40,130),rot=rand(-.25,.25);
    g.save();g.translate(x,y);g.rotate(rot);
    g.fillStyle='rgba(120,145,185,.16)';ell(g,4,5,w,w*.16);
    g.fillStyle='rgba(255,255,255,.45)';ell(g,0,0,w*.95,w*.11);
    g.restore();
  }
  // forest-floor shadow toward edges
  const edge=(x0,y0,x1,y1)=>{const e=g.createLinearGradient(x0,y0,x1,y1);e.addColorStop(0,'rgba(40,58,96,.42)');e.addColorStop(1,'rgba(40,58,96,0)');g.fillStyle=e;g.fillRect(0,0,W,H);};
  edge(0,0,0,260);edge(0,H,0,H-200);edge(0,0,240,0);edge(W,0,W-240,0);

  // trodden ground under paths
  for(const smp of PATH_SAMPLES){
    for(const [w,a] of [[96,.10],[74,.13],[56,.14]]){
      g.strokeStyle=`rgba(128,118,116,${a})`;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';
      g.beginPath();smp.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();
    }
  }
  // plaza trodden + melted ring around fire
  let pg=g.createRadialGradient(PLAZA.x,PLAZA.y,0,PLAZA.x,PLAZA.y,PLAZA.r+50);
  pg.addColorStop(0,'rgba(110,96,92,.55)');pg.addColorStop(.25,'rgba(120,110,108,.35)');pg.addColorStop(1,'rgba(120,110,108,0)');
  g.fillStyle=pg;g.beginPath();g.ellipse(PLAZA.x,PLAZA.y,PLAZA.r+50,(PLAZA.r+50)*.87,0,0,TAU);g.fill();

  for(const c of CLEARINGS){const cg=g.createRadialGradient(c.x,c.y,0,c.x,c.y,c.r+40);
    cg.addColorStop(0,'rgba(120,110,108,.32)');cg.addColorStop(1,'rgba(120,110,108,0)');g.fillStyle=cg;ell(g,c.x,c.y,c.r+40,(c.r+40)*.87);}
  // cobbles along paths
  const cobble=(x,y,rx,ry,rot)=>{
    g.save();g.translate(x,y);g.rotate(rot);
    g.fillStyle='rgba(50,60,85,.22)';ell(g,1,1.4,rx+.5,ry+.5);
    const base=pick([[132,138,150],[118,125,140],[146,146,150],[128,120,110],[110,118,132]]);
    const cg=g.createLinearGradient(-rx,-ry,rx,ry);cg.addColorStop(0,rgba(base.map(v=>Math.min(255,v+30)),1));cg.addColorStop(1,rgba(base.map(v=>v-14),1));
    g.fillStyle=cg;ell(g,0,0,rx,ry);
    if(R()<.7){g.fillStyle='rgba(246,249,253,.9)';ell(g,-rx*.1,-ry*.38,rx*.8,ry*.5);}
    g.restore();
  };
  for(const smp of PATH_SAMPLES){
    for(let i=2;i<smp.length-2;i+=2){
      const [x,y]=smp[i],[x2,y2]=smp[i+1],ang=Math.atan2(y2-y,x2-x),nx=-Math.sin(ang),ny=Math.cos(ang);
      for(let k=-3;k<=3;k++){
        if(R()<.12+Math.abs(k)*.16)continue;
        const off=k*10+rand(-2,2);
        cobble(x+nx*off+rand(-2,2),y+ny*off+rand(-2,2),rand(4.6,7),rand(3.4,5),ang+rand(-.5,.5));
      }
    }
  }
  for(let r=32;r<PLAZA.r;r+=11){
    const n=Math.floor(TAU*r/12);
    for(let i=0;i<n;i++){
      if(R()<.1+(r/PLAZA.r)*.25)continue;
      const a=i/n*TAU+rand(-.05,.05)+r;
      cobble(PLAZA.x+Math.cos(a)*r,PLAZA.y+Math.sin(a)*r*.87,rand(4.8,6.6),rand(3.5,4.8),a+Math.PI/2);
    }
  }
  if(SCENE.fire){ // fire scorch
  pg=g.createRadialGradient(PLAZA.x,PLAZA.y+4,0,PLAZA.x,PLAZA.y+4,52);
  pg.addColorStop(0,'rgba(50,36,30,.75)');pg.addColorStop(1,'rgba(70,56,50,0)');g.fillStyle=pg;ell(g,PLAZA.x,PLAZA.y+4,52,44);}

  // pond
  g.fillStyle='rgba(110,135,175,.35)';ell(g,POND.x+6,POND.y+10,POND.rx+22,POND.ry+18);
  g.fillStyle='rgba(250,252,255,.9)';ell(g,POND.x,POND.y-2,POND.rx+14,POND.ry+12);
  g.save();g.beginPath();g.ellipse(POND.x,POND.y,POND.rx,POND.ry,0,0,TAU);g.clip();
  let ig=g.createRadialGradient(POND.x-60,POND.y-40,10,POND.x,POND.y,POND.rx*1.1);
  ig.addColorStop(0,'#bfdbea');ig.addColorStop(.55,'#86b2cf');ig.addColorStop(1,'#5b85a9');
  g.fillStyle=ig;g.fillRect(POND.x-POND.rx,POND.y-POND.ry,POND.rx*2,POND.ry*2);
  // inner shadow from the bank
  g.strokeStyle='rgba(60,90,130,.35)';g.lineWidth=18;g.beginPath();g.ellipse(POND.x+4,POND.y+8,POND.rx,POND.ry,0,0,TAU);g.stroke();
  // reflections
  g.globalCompositeOperation='lighter';
  for(let i=0;i<9;i++){const x=POND.x+rand(-POND.rx,POND.rx*.6),y=POND.y+rand(-POND.ry,POND.ry);
    g.strokeStyle=`rgba(255,255,255,${rand(.06,.16)})`;g.lineWidth=rand(4,14);
    g.beginPath();g.moveTo(x,y);g.lineTo(x+70,y-46);g.stroke();}
  g.globalCompositeOperation='source-over';
  // cracks
  for(let i=0;i<14;i++){let x=POND.x+rand(-POND.rx*.8,POND.rx*.8),y=POND.y+rand(-POND.ry*.7,POND.ry*.7),a=rand(0,TAU);
    g.strokeStyle=`rgba(240,250,255,${rand(.35,.7)})`;g.lineWidth=rand(.6,1.3);g.beginPath();g.moveTo(x,y);
    for(let s=0;s<6;s++){a+=rand(-.7,.7);x+=Math.cos(a)*rand(8,20);y+=Math.sin(a)*rand(5,12);g.lineTo(x,y);
      if(R()<.3){g.moveTo(x,y);g.lineTo(x+rand(-10,10),y+rand(-8,8));g.moveTo(x,y);}}
    g.stroke();}
  // dusted snow patches on ice
  for(let i=0;i<16;i++){const x=POND.x+rand(-POND.rx*.9,POND.rx*.9),y=POND.y+rand(-POND.ry*.8,POND.ry*.8),r=rand(10,34);
    const sg=g.createRadialGradient(x,y,0,x,y,r);sg.addColorStop(0,'rgba(245,250,255,.55)');sg.addColorStop(1,'rgba(245,250,255,0)');g.fillStyle=sg;ell(g,x,y,r,r*.55);}
  g.restore();
  // snow lip around pond
  for(let i=0;i<70;i++){const a=i/70*TAU,x=POND.x+Math.cos(a)*POND.rx*1.01,y=POND.y+Math.sin(a)*POND.ry*1.01;
    g.fillStyle='rgba(120,148,188,.28)';ell(g,x+2,y+3,rand(9,16),rand(4,7));
    g.fillStyle='rgba(250,252,255,.95)';ell(g,x,y,rand(8,15),rand(3.5,6.5));}

  // grass tufts & twigs poking through snow
  for(let i=0;i<620;i++){
    const x=rand(0,W),y=rand(0,H);if(surfaceAt(x,y)!==0)continue;
    const n=(rand(3,8))|0;
    for(let k=0;k<n;k++){
      const bx=x+rand(-6,6),by=y+rand(-3,3),h=rand(4,11),lean=rand(-4,4);
      g.strokeStyle=pick(['#5b4a3a','#6c6447','#44584c','#7a6448','#3d4c4a']);g.lineWidth=rand(.7,1.4);
      g.beginPath();g.moveTo(bx,by);g.quadraticCurveTo(bx+lean*.3,by-h*.6,bx+lean,by-h);g.stroke();
    }
    g.fillStyle='rgba(250,252,255,.85)';ell(g,x,y+1,7,2.4);
  }
  // sparkle specks
  for(let i=0;i<2400;i++){g.fillStyle=R()<.8?`rgba(255,255,255,${rand(.4,.9)})`:`rgba(170,200,235,${rand(.3,.6)})`;
    const x=rand(0,W),y=rand(0,H);g.fillRect(x,y,rand(.6,1.5),rand(.6,1.5));}
  if(GROUND_TINT){g.globalCompositeOperation='multiply';g.fillStyle=GROUND_TINT;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';}
}

