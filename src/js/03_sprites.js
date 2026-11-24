/* ---------- sprite factories ---------- */
function makeCabin(w){
  const bodyH=74, roofH=98, ov=16, cw=w+70, ch=bodyH+roofH+46;
  const doorX=rand(-w*.15,w*.15), info={windows:[],chimney:null,w,bodyH,roofH};
  const spr=makeSprite(cw,ch,cw/2,bodyH+roofH+26,g=>{
    g.fillStyle='rgba(40,55,95,.28)';ell(g,14,-4,w/2+34,24);
    // foundation stones
    g.fillStyle='#5d6270';g.fillRect(-w/2,-12,w,12);
    for(let x=-w/2+4;x<w/2;x+=rand(9,13)){g.fillStyle=pick(['#8a8f9c','#7a808e','#969aa4']);ell(g,x,-6,rand(5,7),rand(4,5.5));
      g.fillStyle='rgba(250,252,255,.8)';ell(g,x-1,-9,3.5,1.6);}
    // log walls
    for(let y=-bodyH;y<-12;y+=11){
      const lg=g.createLinearGradient(0,y,0,y+11);lg.addColorStop(0,'#94694a');lg.addColorStop(.45,'#76503a');lg.addColorStop(1,'#4d3224');
      g.fillStyle=lg;g.beginPath();g.roundRect(-w/2-4,y,w+8,11,5);g.fill();
      g.strokeStyle='rgba(40,24,16,.35)';g.lineWidth=.8;for(let k=0;k<3;k++){const x=rand(-w/2,w/2);g.beginPath();g.moveTo(x,y+5);g.lineTo(x+rand(8,20),y+5.5);g.stroke();}
      for(const sx of [-1,1]){g.fillStyle='#c09366';circ(g,sx*(w/2+4),y+5.5,5.6);g.strokeStyle='#7d5638';g.lineWidth=1;g.beginPath();g.arc(sx*(w/2+4),y+5.5,3,0,TAU);g.stroke();}
    }
    // wall shading (light from upper left)
    const sh=g.createLinearGradient(-w/2,0,w/2,0);sh.addColorStop(0,'rgba(255,220,180,.08)');sh.addColorStop(1,'rgba(20,20,50,.3)');
    g.fillStyle=sh;g.fillRect(-w/2-4,-bodyH,w+8,bodyH-12);
    // door
    g.fillStyle='#2a1a12';g.beginPath();g.roundRect(doorX-18,-56,36,46,[14,14,0,0]);g.fill();
    const dg=g.createLinearGradient(doorX-15,0,doorX+15,0);dg.addColorStop(0,'#6a4128');dg.addColorStop(1,'#432818');
    g.fillStyle=dg;g.beginPath();g.roundRect(doorX-15,-53,30,43,[12,12,0,0]);g.fill();
    g.strokeStyle='rgba(20,10,5,.5)';g.lineWidth=1;for(let k=-1;k<=1;k++){g.beginPath();g.moveTo(doorX+k*8,-50);g.lineTo(doorX+k*8,-10);g.stroke();}
    g.fillStyle='#e3b860';circ(g,doorX+9,-30,1.8);
    g.fillStyle='rgba(250,252,255,.95)';ell(g,doorX,-8,22,4);
    // windows
    for(const wx of [doorX-w*.3,doorX+w*.3]){
      if(Math.abs(wx)>w/2-18)continue;
      const wy=-bodyH+18;
      g.fillStyle='#2b1a10';g.fillRect(wx-16,wy-3,32,28);
      const wg=g.createRadialGradient(wx,wy+11,2,wx,wy+11,20);wg.addColorStop(0,'#fff1c4');wg.addColorStop(.6,'#ffc463');wg.addColorStop(1,'#d9822e');
      g.fillStyle=wg;g.fillRect(wx-13,wy,26,22);
      g.fillStyle='#2b1a10';g.fillRect(wx-1.2,wy,2.4,22);g.fillRect(wx-13,wy+10,26,2.4);
      g.fillStyle='rgba(250,252,255,.95)';g.beginPath();g.roundRect(wx-18,wy+23,36,5,3);g.fill();
      info.windows.push([wx,wy+11]);
    }
    // roof
    const y0=-bodyH+4, top=y0-roofH;
    g.fillStyle='#2e211b';g.beginPath();g.moveTo(-w/2-ov,y0+7);g.lineTo(w/2+ov,y0+7);g.lineTo(w/2+ov-10,top+6);g.lineTo(-w/2-ov+10,top+6);g.closePath();g.fill();
    // shadow cast by the eave onto the wall
    const es=g.createLinearGradient(0,y0,0,y0+22);es.addColorStop(0,'rgba(15,10,25,.55)');es.addColorStop(1,'rgba(15,10,25,0)');
    g.fillStyle=es;g.fillRect(-w/2-4,y0,w+8,22);
    // shingle roof underneath
    const roofPath=()=>{g.beginPath();g.moveTo(-w/2-ov,y0);g.lineTo(w/2+ov,y0);g.lineTo(w/2+ov-10,top);g.lineTo(-w/2-ov+10,top);g.closePath();};
    g.save();roofPath();g.clip();
    g.fillStyle='#4a3028';g.fillRect(-w/2-ov,top,w+2*ov,roofH);
    for(let y=top+4,row=0;y<y0;y+=9,row++){
      for(let x=-w/2-ov+(row%2)*7;x<w/2+ov;x+=14){
        g.fillStyle=pick(['#6e4536','#7b4c3a','#62402f','#845542']);g.beginPath();g.roundRect(x,y,13,10,[0,0,5,5]);g.fill();
        g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,y+8.5,13,1.5);
      }
    }
    // thick snow blanket with an uneven lower edge, so shingles peek through
    const rg=g.createLinearGradient(0,top,0,y0);rg.addColorStop(0,'#fbfdff');rg.addColorStop(.55,'#e9f0f8');rg.addColorStop(1,'#c3d3e8');
    g.fillStyle=rg;g.beginPath();g.moveTo(-w/2-ov-2,top-2);g.lineTo(w/2+ov+2,top-2);
    const pts=[];for(let x=w/2+ov+2;x>=-w/2-ov-2;x-=rand(10,18))pts.push([x,y0-rand(4,roofH*.34)]);
    pts.push([-w/2-ov-2,y0-rand(6,20)]);
    let px=w/2+ov+2,py=y0-8;g.lineTo(px,py);
    for(const [x,y] of pts){g.quadraticCurveTo((px+x)/2,Math.max(py,y)+6,x,y);px=x;py=y;}
    g.closePath();g.fill();
    // snow thickness shading + wind streaks
    const rs=g.createLinearGradient(-w/2,0,w/2+ov,0);rs.addColorStop(0,'rgba(255,255,255,.15)');rs.addColorStop(1,'rgba(95,120,170,.28)');
    g.fillStyle=rs;g.fillRect(-w/2-ov,top,w+2*ov,roofH);
    for(let i=0;i<8;i++){const x=rand(-w/2,w/2);g.fillStyle='rgba(140,162,200,.2)';ell(g,x,rand(top+16,y0-roofH*.4),rand(16,40),rand(2.5,5));}
    for(let i=0;i<6;i++){const x=rand(-w/2,w/2);g.fillStyle='rgba(255,255,255,.7)';ell(g,x,rand(top+10,y0-roofH*.45),rand(10,24),rand(1.5,3));}
    g.restore();
    // dark fascia boards on the roof's side edges
    g.strokeStyle='#2e1f18';g.lineWidth=4;g.beginPath();g.moveTo(-w/2-ov,y0+2);g.lineTo(-w/2-ov+10,top);g.moveTo(w/2+ov,y0+2);g.lineTo(w/2+ov-10,top);g.stroke();
    g.strokeStyle='#f4f8fc';g.lineWidth=2.5;g.beginPath();g.moveTo(-w/2-ov+1,y0-2);g.lineTo(-w/2-ov+10,top-1);g.stroke();
    // ridge
    g.fillStyle='#ffffff';g.beginPath();g.roundRect(-w/2-ov+8,top-6,w+2*ov-16,10,6);g.fill();
    g.fillStyle='rgba(140,165,205,.35)';g.fillRect(-w/2-ov+12,top+3,w+2*ov-24,2);
    // lumpy eave
    for(let x=-w/2-ov;x<=w/2+ov;x+=rand(10,15)){
      g.fillStyle='rgba(120,145,190,.45)';ell(g,x+1,y0+4,rand(8,11),5);
      g.fillStyle='#f6f9fd';ell(g,x,y0+1,rand(8,11),rand(4.5,6.5));
    }
    // icicles
    for(let x=-w/2-ov+6;x<w/2+ov-4;x+=rand(5,11)){
      if(R()<.35)continue;const L=rand(5,17);
      const ic=g.createLinearGradient(0,y0+5,0,y0+5+L);ic.addColorStop(0,'rgba(235,248,255,.95)');ic.addColorStop(1,'rgba(150,205,240,.5)');
      g.fillStyle=ic;g.beginPath();g.moveTo(x-2,y0+5);g.lineTo(x+2,y0+5);g.lineTo(x+.3,y0+5+L);g.closePath();g.fill();
    }
    // chimney
    const cx=w*.24+rand(-10,10), cy=y0-roofH*.5;
    g.fillStyle='#5f6472';g.fillRect(cx-12,cy-36,24,40);
    for(let r=0;r<5;r++)for(let c=0;c<2;c++){g.fillStyle=pick(['#868b98','#767b89','#9196a1']);g.fillRect(cx-11+c*12+(r%2)*5,cy-34+r*8,10,6.5);}
    g.fillStyle='rgba(20,20,40,.25)';g.fillRect(cx+4,cy-36,8,40);
    g.fillStyle='#fbfdff';g.beginPath();g.roundRect(cx-15,cy-42,30,9,5);g.fill();
    g.fillStyle='#f4f8fc';ell(g,cx-4,cy+3,20,6);
    info.chimney=[cx,cy-44];
  });
  spr.info=info;return spr;
}

function makePine(hue){
  return makeSprite(120,190,60,178,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,10,-2,40,11);
    g.fillStyle='#4b3426';g.fillRect(-5,-24,10,24);
    const tiers=4;
    for(let i=0;i<tiers;i++){
      const bottom=-20-i*31, top=bottom-56+i*2, hw=48-i*9.5;
      // body
      const tg=g.createLinearGradient(-hw,0,hw,0);
      tg.addColorStop(0,`hsl(${hue},38%,33%)`);tg.addColorStop(.55,`hsl(${hue},45%,22%)`);tg.addColorStop(1,`hsl(${hue+8},50%,13%)`);
      g.fillStyle=tg;g.beginPath();g.moveTo(0,top);
      const seg=7;for(let s=0;s<=seg;s++){const x=hw-(2*hw)*s/seg;g.lineTo(x,bottom-(s%2?7:0)+rand(-1.5,1.5));}
      g.closePath();g.fill();
      // underside shade
      g.fillStyle='rgba(5,15,25,.35)';ell(g,0,bottom-2,hw*.8,4);
      // snow on upper-left slope
      const sg=g.createLinearGradient(-hw,top,hw*.3,bottom);sg.addColorStop(0,'#ffffff');sg.addColorStop(1,'#c8d8ec');
      g.fillStyle=sg;g.beginPath();g.moveTo(0,top-1);
      g.lineTo(-hw*.9,bottom-6);g.quadraticCurveTo(-hw*.55,bottom-2,-hw*.3,bottom-10);
      g.quadraticCurveTo(-hw*.05,bottom-14,hw*.05,bottom-26);
      g.quadraticCurveTo(hw*.25,top+26,hw*.12,top+10);g.closePath();g.fill();
      // dollops on tips
      for(let s=0;s<3;s++){g.fillStyle='#f3f7fc';ell(g,rand(-hw*.8,hw*.6),bottom-rand(3,9),rand(3,6),rand(1.8,3));}
    }
    g.fillStyle='#ffffff';ell(g,0,-20-3*31-52,5,4);
  });
}

function makeBirch(){
  return makeSprite(170,210,85,200,g=>{
    g.fillStyle='rgba(40,55,95,.25)';ell(g,8,-2,34,9);
    g.lineCap='round';
    const branch=(x,y,a,len,wd,d)=>{
      const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;
      g.strokeStyle='#5e5853';g.lineWidth=wd+1.6;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
      g.strokeStyle='#e7e1d8';g.lineWidth=wd;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
      if(wd>3){g.strokeStyle='rgba(40,35,35,.7)';g.lineWidth=1.2;for(let k=0;k<2;k++){const t=rand(.2,.8);const mx=lerp(x,x2,t),my=lerp(y,y2,t);g.beginPath();g.moveTo(mx-wd*.4,my);g.lineTo(mx+wd*.3,my+1);g.stroke();}}
      if(wd>1.6&&Math.sin(a)<0){g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=wd*.55;g.beginPath();g.moveTo(x,y-wd*.4);g.lineTo(lerp(x,x2,.8),lerp(y,y2,.8)-wd*.4);g.stroke();}
      if(d<=0)return;
      const n=d>3?2:pick([2,2,3]);
      for(let i=0;i<n;i++)branch(x2,y2,a+rand(-.75,.75),len*rand(.62,.8),wd*.68,d-1);
    };
    branch(0,0,-Math.PI/2+rand(-.08,.08),56,8,6);
  });
}

function makeRock(){
  return makeSprite(64,52,32,40,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,22,7);
    const pts=[];const n=11;for(let i=0;i<n;i++){const a=i/n*TAU;const r=rand(14,21);pts.push([Math.cos(a)*r,Math.sin(a)*r*.72-10]);}
    const rg=g.createLinearGradient(-18,-28,18,4);rg.addColorStop(0,'#a1a8b8');rg.addColorStop(1,'#4b5263');
    g.fillStyle=rg;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();
    g.strokeStyle='rgba(30,35,50,.35)';g.lineWidth=1;g.beginPath();g.moveTo(-4,-14);g.lineTo(3,-6);g.lineTo(1,0);g.stroke();
    g.fillStyle='#f7fafd';g.beginPath();g.moveTo(pts[5][0]*.95,pts[5][1]+3);
    for(let i=6;i<n;i++)g.lineTo(pts[i][0]*.95,pts[i][1]+1);g.quadraticCurveTo(10,-12,0,-13);g.quadraticCurveTo(-10,-14,pts[5][0]*.95,pts[5][1]+3);g.fill();
  });
}

function makeBush(){
  return makeSprite(70,50,35,40,g=>{
    g.fillStyle='rgba(40,55,95,.28)';ell(g,4,0,26,7);
    for(let i=0;i<9;i++){const x=rand(-18,18),y=rand(-20,-6);g.fillStyle=pick(['#25504a','#2d6156','#1f433f','#346a5b']);circ(g,x,y,rand(7,11));}
    for(let i=0;i<5;i++){g.fillStyle='#f6f9fd';ell(g,rand(-16,14),rand(-28,-20),rand(5,9),rand(2.5,4));}
    for(let i=0;i<9;i++){const x=rand(-17,17),y=rand(-20,-6);g.fillStyle='#7a1e1e';circ(g,x+.5,y+.5,2.1);g.fillStyle='#e0473c';circ(g,x,y,1.8);g.fillStyle='rgba(255,220,210,.8)';circ(g,x-.5,y-.6,.5);}
  });
}

function makeLamp(){
  return makeSprite(36,104,18,96,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,10,4);
    g.fillStyle='#242833';g.fillRect(-4,-6,8,6);g.fillRect(-2,-74,4,70);
    g.fillRect(-7,-76,14,3);
    g.fillStyle='#2a2f3b';g.beginPath();g.moveTo(-8,-78);g.lineTo(8,-78);g.lineTo(6,-96);g.lineTo(-6,-96);g.closePath();g.fill();
    const lg=g.createLinearGradient(0,-94,0,-80);lg.addColorStop(0,'#fff6d2');lg.addColorStop(1,'#ffb54a');
    g.fillStyle=lg;g.fillRect(-5,-94,10,14);g.fillStyle='#242833';g.fillRect(-.8,-94,1.6,14);
    g.fillStyle='#242833';g.beginPath();g.moveTo(-10,-96);g.lineTo(10,-96);g.lineTo(0,-104);g.closePath();g.fill();
    g.fillStyle='#fbfdff';ell(g,0,-99,8,3.5);
    g.fillStyle='rgba(250,252,255,.9)';ell(g,0,-6,7,2);
  });
}

function makeCrate(){
  return makeSprite(44,48,22,40,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,5,0,18,6);
    g.fillStyle='#7c5534';g.fillRect(-14,-22,28,22);
    g.fillStyle='#9a6c43';g.beginPath();g.moveTo(-14,-22);g.lineTo(14,-22);g.lineTo(10,-30);g.lineTo(-10,-30);g.closePath();g.fill();
    g.strokeStyle='#4a301c';g.lineWidth=1.4;g.strokeRect(-14,-22,28,22);g.beginPath();g.moveTo(-14,-22);g.lineTo(14,0);g.moveTo(-14,-11);g.lineTo(14,-11);g.stroke();
    g.fillStyle='rgba(20,20,50,.22)';g.fillRect(4,-22,10,22);
    g.fillStyle='#f6f9fd';ell(g,-1,-27,12,4.2);ell(g,6,-25,6,2.5);
  });
}

function makeBarrel(){
  return makeSprite(40,50,20,42,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,15,5);
    const bg=g.createLinearGradient(-12,0,12,0);bg.addColorStop(0,'#8e5f3a');bg.addColorStop(.4,'#a57048');bg.addColorStop(1,'#4d3020');
    g.fillStyle=bg;g.beginPath();g.moveTo(-11,-30);g.quadraticCurveTo(-15,-15,-11,0);g.lineTo(11,0);g.quadraticCurveTo(15,-15,11,-30);g.closePath();g.fill();
    g.strokeStyle='#3a3a44';g.lineWidth=2;for(const y of [-24,-6]){g.beginPath();g.moveTo(-13,y);g.lineTo(13,y);g.stroke();}
    g.fillStyle='#6d4a30';ell(g,0,-30,11,4);g.fillStyle='#f6f9fd';ell(g,-1,-31,9,3);
  });
}

function makeFence(len){
  return makeSprite(len+20,44,10,34,g=>{
    g.fillStyle='rgba(40,55,95,.22)';g.fillRect(2,-2,len,5);
    for(const y of [-20,-10]){g.fillStyle='#6b4a32';g.fillRect(0,y,len,3.5);g.fillStyle='#f6f9fd';g.fillRect(0,y-1.6,len,1.8);}
    for(let x=0;x<=len;x+=22){g.fillStyle='#5a3d29';g.fillRect(x-2.5,-26,5,26);g.fillStyle='#7d593c';g.fillRect(x-2.5,-26,2,26);
      g.fillStyle='#fbfdff';ell(g,x,-27,4,2.4);}
  });
}

function makeSnowman(){
  return makeSprite(60,84,30,76,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,5,0,20,6);
    const ball=(y,r)=>{const sg=g.createRadialGradient(-r*.35,y-r*.35,1,0,y,r);sg.addColorStop(0,'#ffffff');sg.addColorStop(.7,'#e1eaf4');sg.addColorStop(1,'#a9bcd6');g.fillStyle=sg;circ(g,0,y,r);};
    ball(-15,16);ball(-38,12);ball(-56,9);
    g.strokeStyle='#5a4030';g.lineWidth=1.8;g.lineCap='round';
    g.beginPath();g.moveTo(-10,-40);g.lineTo(-24,-50);g.lineTo(-27,-56);g.moveTo(-21,-48);g.lineTo(-26,-46);g.moveTo(10,-40);g.lineTo(23,-47);g.lineTo(28,-44);g.stroke();
    g.fillStyle='#c8433a';g.beginPath();g.roundRect(-10,-49,20,5,2.5);g.fill();g.fillRect(4,-47,5,12);
    g.fillStyle='#1e2230';circ(g,-3,-58,1.4);circ(g,3,-58,1.4);circ(g,0,-36,1.4);circ(g,0,-29,1.4);
    g.fillStyle='#e8822f';g.beginPath();g.moveTo(0,-55.5);g.lineTo(10,-54);g.lineTo(0,-53);g.closePath();g.fill();
    g.fillStyle='#232733';g.fillRect(-8,-66,16,3);g.fillRect(-5.5,-76,11,11);g.fillStyle='#c8433a';g.fillRect(-5.5,-69,11,2);
  });
}

function makeCrystals(){
  return makeSprite(110,120,55,104,g=>{
    g.fillStyle='rgba(60,80,150,.35)';ell(g,4,0,40,10);
    g.fillStyle='#e6eff9';ell(g,0,-4,34,9);
    const shards=[[-18,-6,-.35,52,10],[16,-5,.3,58,11],[0,-8,0,80,14],[-30,-2,-.6,30,7],[30,-2,.55,32,7],[8,-3,.12,40,8]];
    for(const [x,y,a,h,wd] of shards){
      g.save();g.translate(x,y);g.rotate(a);
      const sg=g.createLinearGradient(-wd,0,wd,0);sg.addColorStop(0,'#d7fbff');sg.addColorStop(.45,'#6fd0f0');sg.addColorStop(1,'#5038b0');
      g.fillStyle=sg;g.beginPath();g.moveTo(-wd/2,0);g.lineTo(-wd/2,-h*.78);g.lineTo(0,-h);g.lineTo(wd/2,-h*.78);g.lineTo(wd/2,0);g.closePath();g.fill();
      g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1;g.beginPath();g.moveTo(-wd*.1,-2);g.lineTo(-wd*.1,-h*.8);g.lineTo(0,-h);g.stroke();
      g.restore();
    }
    g.fillStyle='#f6f9fd';ell(g,-6,-3,18,4);ell(g,14,-2,12,3);
  });
}

function makeSign(){
  return makeSprite(60,70,30,62,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,14,5);
    g.fillStyle='#4e3423';g.fillRect(-3,-44,6,44);
    g.fillStyle='#8a5d3a';g.beginPath();g.roundRect(-22,-52,44,24,3);g.fill();
    g.strokeStyle='#4a2f1d';g.lineWidth=1.5;g.strokeRect(-22,-52,44,24);
    g.strokeStyle='rgba(50,30,18,.55)';g.lineWidth=1.6;for(const y of [-45,-40,-35]){g.beginPath();g.moveTo(-15,y);g.lineTo(rand(6,15),y);g.stroke();}
    g.fillStyle='#fbfdff';g.beginPath();g.roundRect(-24,-56,48,6,3);g.fill();
    g.fillStyle='rgba(250,252,255,.9)';ell(g,0,-1,10,2.4);
  });
}

function makeFlowers(){
  return makeSprite(40,30,20,22,g=>{
    for(let i=0;i<4;i++){g.fillStyle='#2c5a4c';ell(g,rand(-10,10),rand(-6,-1),5,2.4,rand(-1,1));}
    for(let i=0;i<4;i++){const x=rand(-10,10),y=rand(-11,-5);g.fillStyle='#8c1f24';circ(g,x,y,3.4);g.fillStyle='#e04a4f';circ(g,x-.6,y-.6,2.4);g.fillStyle='#ffb0a8';circ(g,x-1,y-1.2,.8);}
    g.fillStyle='rgba(250,252,255,.9)';ell(g,0,-1,12,2.2);
  });
}

function makeFirePit(){
  return makeSprite(110,60,55,40,g=>{
    for(let i=0;i<14;i++){const a=i/14*TAU;const x=Math.cos(a)*34,y=Math.sin(a)*15-6;
      g.fillStyle='rgba(30,30,45,.4)';ell(g,x+1,y+2,8,5.5);g.fillStyle=pick(['#7b8291','#6b7180','#8b909b']);ell(g,x,y,7.5,5.2);
      g.fillStyle='rgba(255,230,200,.25)';ell(g,x-1,y-2,4,2);}
    g.fillStyle='#4a2c1a';g.save();g.rotate(.35);g.beginPath();g.roundRect(-24,-10,48,9,4);g.fill();g.restore();
    g.save();g.rotate(-.35);g.fillStyle='#5a3620';g.beginPath();g.roundRect(-24,-4,48,9,4);g.fill();g.restore();
    g.fillStyle='#2a1810';ell(g,0,-5,14,6);
  });
}

function makeFgPine(){
  const c=canvas(320,520),g=c.getContext('2d');g.translate(160,515);
  for(let i=0;i<6;i++){const b=-i*80,hw=150-i*22;
    g.fillStyle='#070e1c';g.beginPath();g.moveTo(0,b-150);for(let s=0;s<=10;s++){g.lineTo(hw-2*hw*s/10,b-(s%2?18:0));}g.closePath();g.fill();
    g.strokeStyle='rgba(120,150,210,.25)';g.lineWidth=3;g.beginPath();g.moveTo(0,b-150);g.lineTo(-hw,b);g.stroke();}
  g.fillStyle='#070e1c';g.fillRect(-14,-20,28,20);
  return c;
}

