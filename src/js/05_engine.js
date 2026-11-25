/* ---------- physics ---------- */
function collide(p){
  for(const c of colliders){
    if(c.t==='c'){
      const dx=p.x-c.x,dy=p.y-c.y,rr=c.r+PR,d2=dx*dx+dy*dy;
      if(d2<rr*rr&&d2>1e-6){const d=Math.sqrt(d2),nx=dx/d,ny=dy/d;p.x=c.x+nx*rr;p.y=c.y+ny*rr;
        const vn=p.vx*nx+p.vy*ny;if(vn<0){p.vx-=vn*nx;p.vy-=vn*ny;}}
    }else{
      const qx=clamp(p.x,c.x0,c.x1),qy=clamp(p.y,c.y0,c.y1),dx=p.x-qx,dy=p.y-qy,d2=dx*dx+dy*dy;
      if(d2<PR*PR){
        let nx,ny,pen;
        if(d2>1e-6){const d=Math.sqrt(d2);nx=dx/d;ny=dy/d;pen=PR-d;}
        else{const l=p.x-c.x0,r=c.x1-p.x,t=p.y-c.y0,b=c.y1-p.y,m=Math.min(l,r,t,b);
          if(m===l){nx=-1;ny=0;}else if(m===r){nx=1;ny=0;}else if(m===t){nx=0;ny=-1;}else{nx=0;ny=1;}pen=m+PR;}
        p.x+=nx*pen;p.y+=ny*pen;const vn=p.vx*nx+p.vy*ny;if(vn<0){p.vx-=vn*nx;p.vy-=vn*ny;}
      }
    }
  }
  p.x=clamp(p.x,24,W-24);p.y=clamp(p.y,48,H-16);
}

let stuckT=0;
function updatePlayer(dt,t){
  const p=player;
  let ix=0,iy=0,mag=0;
  if(keys.has('a')||keys.has('arrowleft'))ix-=1;
  if(keys.has('d')||keys.has('arrowright'))ix+=1;
  if(keys.has('w')||keys.has('arrowup'))iy-=1;
  if(keys.has('s')||keys.has('arrowdown'))iy+=1;
  if(ix||iy){const m=Math.hypot(ix,iy);ix/=m;iy/=m;mag=1;}
  else if(joy.on&&(joy.vx||joy.vy)){const m=Math.hypot(joy.vx,joy.vy);if(m>.12){ix=joy.vx/m;iy=joy.vy/m;mag=clamp((m-.12)/.8,0,1);}}
  else if(tapTarget){
    const dx=tapTarget.x-p.x,dy=tapTarget.y-p.y,d=Math.hypot(dx,dy);
    if(d<6){tapTarget=null;}else{ix=dx/d;iy=dy/d;mag=clamp(d/40,.35,1);}
    tapTime+=dt;
    if(Math.hypot(p.vx,p.vy)<18&&tapTime>.4){stuckT+=dt;if(stuckT>.5){tapTarget=null;stuckT=0;}}else stuckT=0;
  }
  const s=surfaceAt(p.x,p.y);
  const jog=keys.has('shift');
  let max=(jog?245:165)*(s===1?1:s===2?1.12:.84);
  // response: how quickly velocity chases the target velocity. Ice is very low → sliding.
  const kIn=s===2?1.5:s===1?11:8, kOut=s===2?.55:s===1?10:8;
  const tx=ix*max*mag,ty=iy*max*mag,k=(mag>0?kIn:kOut);
  const a=1-Math.exp(-k*dt);
  p.vx+=(tx-p.vx)*a;p.vy+=(ty-p.vy)*a;
  p.x+=p.vx*dt;p.y+=p.vy*dt;
  collide(p);
  const sp=Math.hypot(p.vx,p.vy);
  // facing turns smoothly (follows intent, or velocity when sliding)
  const fx=mag>0?ix:p.vx,fy=mag>0?iy:p.vy,fm=Math.hypot(fx,fy);
  if(fm>.01&&(mag>0||sp>25)){const ta=1-Math.exp(-14*dt);p.face.x+=(fx/fm-p.face.x)*ta;p.face.y+=(fy/fm-p.face.y)*ta;
    const n=Math.hypot(p.face.x,p.face.y)||1;p.face.x/=n;p.face.y/=n;}
  if(p.face.x<-.25)p.side=-1;else if(p.face.x>.25)p.side=1;
  // walk cycle (on ice you glide: legs only move when pushing)
  const walking=s===2?mag*Math.min(sp,90):sp;
  p.phase+=walking*dt*.085;
  const idx=Math.floor(p.phase/Math.PI);
  if(idx!==p.stepIdx){p.stepIdx=idx;if(walking>20)onStep(idx%2?1:-1,s,sp);}
  if(s===2&&sp>70&&FX.particles&&R()<dt*14)emit({t:'spark',x:p.x+rand(-6,6),y:p.y+rand(-2,2),vx:-p.vx*.1,vy:-p.vy*.1,l:0,m:rand(.4,.8),sz:rand(3,6)});
}
function onStep(side,s,sp){
  const p=player,ang=Math.atan2(p.vy,p.vx),nx=-Math.sin(ang),ny=Math.cos(ang);
  const fx=p.x+nx*side*4,fy=p.y+ny*side*4;
  Sfx.step(s,sp,side);
  if(s!==2){prints.push({x:fx,y:fy,a:ang,l:0,deep:s===0});if(prints.length>260)prints.shift();}
  if(!FX.particles||s===2)return;
  const n=s===0?3+(sp>200?2:0):1;
  for(let i=0;i<n;i++)emit({t:'puff',x:fx+rand(-3,3),y:fy+rand(-2,1),vx:rand(-18,18)-p.vx*.08,vy:rand(-26,-8),l:0,m:rand(.45,.8),sz:rand(5,9)*(s===0?1:.7)});
}

/* ---------- particles update ---------- */
let wind=0;
function windAt(t,ph=0){return Math.sin(t*.9+ph)*.6+Math.sin(t*2.3+ph*1.7+1)*.22+Math.sin(t*.37)*.45;}
function updateParticles(dt,t){
  if(FX.particles){
    // embers from fire
    const fireOn=SCENE.fire&&Math.abs(PLAZA.x-cam.x)<VW/ZOOM&&Math.abs(PLAZA.y-cam.y)<VH/ZOOM;
    if(fireOn)for(let i=0;i<dt*26;i++)emit({t:'ember',x:PLAZA.x+rand(-14,14),y:PLAZA.y-10,vx:rand(-14,14),vy:rand(-110,-60),l:0,m:rand(.9,2.1),sz:rand(2,4.2),ph:rand(0,9)});
    // chimney smoke
    for(const c of chimneys){if(Math.abs(c.x-cam.x)>VW/ZOOM||Math.abs(c.y-cam.y)>VH/ZOOM)continue;
      c.acc+=dt*7;while(c.acc>1){c.acc--;emit({t:'smoke',x:c.x+rand(-3,3),y:c.y,vx:rand(-4,4),vy:rand(-22,-14),l:0,m:rand(2.6,4),sz:rand(6,9)});}}
    // grove motes
    if(GROVE&&Math.hypot(GROVE.x-cam.x,GROVE.y-cam.y)<900&&R()<dt*12)
      emit({t:'mote',x:GROVE.x+rand(-170,170),y:GROVE.y+rand(-120,120),vx:rand(-6,6),vy:rand(-14,-4),l:0,m:rand(3,5.5),sz:rand(3,6),ph:rand(0,9)});
    if(SCENE.skyLanterns&&amb.a>.3&&R()<dt*1.1)emit({t:'sky',x:cam.x+rand(-VW/ZOOM*.6,VW/ZOOM*.6),y:cam.y+VH/ZOOM*.55,vx:rand(-4,4),vy:-rand(14,24),l:0,m:rand(16,26),sz:rand(3,5.5),ph:rand(0,9)});
    // fireflies-ish warm motes near the plaza at dusk/night
    if(amb.a>.3&&R()<dt*3)emit({t:'mote',warm:1,x:PLAZA.x+rand(-260,260),y:PLAZA.y+rand(-200,200),vx:rand(-6,6),vy:rand(-8,0),l:0,m:rand(3,5),sz:rand(2,4),ph:rand(0,9)});
  }
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i];p.l+=dt;if(p.l>=p.m){parts.splice(i,1);continue;}
    if(p.t==='puff'){p.vx*=Math.exp(-4*dt);p.vy=p.vy*Math.exp(-4*dt)+30*dt;}
    else if(p.t==='ember'){p.vx+=(wind*30+Math.sin(t*6+p.ph)*40)*dt;p.vy*=Math.exp(-.6*dt);}
    else if(p.t==='smoke'){p.vx+=wind*14*dt;p.sz+=dt*9;}
    else if(p.t==='mote'){p.vx+=Math.sin(t*1.3+p.ph)*8*dt;p.vy+=Math.cos(t*1.1+p.ph)*6*dt;}
    else if(p.t==='spark'){p.vx*=.95;p.vy*=.95;}
    else if(p.t==='sky'){p.vx+=(wind*6+Math.sin(t*.5+p.ph)*3)*dt;}
    p.x+=p.vx*dt;p.y+=p.vy*dt;
  }
  // snow (screen space with parallax by depth)
  const dx=(cam.x-cam.px)*ZOOM,dy=(cam.y-cam.py)*ZOOM;
  for(const f of flakes){
    f.y+=(16+34*f.d)*dt*(f.d>1.4?1.3:1);
    f.x+=(wind*22+Math.sin(t*1.2+f.ph)*9)*f.d*dt;
    f.x-=dx*f.d;f.y-=dy*f.d;
    const m=20;if(f.y>VH+m)f.y-=VH+2*m;if(f.y<-m)f.y+=VH+2*m;if(f.x>VW+m)f.x-=VW+2*m;if(f.x<-m)f.x+=VW+2*m;
  }
  for(const p of prints)p.l+=dt;
  while(prints.length&&prints[0].l>14)prints.shift();
}

/* ---------- rendering ---------- */
function drawSpr(g,spr,x,y,s=1){g.drawImage(spr.cv,x-spr.ox*s,y-spr.oy*s,spr.w*s,spr.h*s);}

function drawPlayer(g,t){
  if(IMG.player)return drawPlayerSheet(g,t);
  const p=player,sp=Math.hypot(p.vx,p.vy),onIce=surfaceAt(p.x,p.y)===2;
  const mv=onIce?clamp(sp/160,0,.35):clamp(sp/140,0,1);
  const sw=Math.sin(p.phase),bob=Math.abs(sw)*mv;
  const fx=p.face.x,fy=p.face.y,side=p.side;
  const back=fy<-.5, front=fy>.35;
  g.save();g.translate(p.x,p.y);
  g.fillStyle='rgba(30,40,75,.38)';ell(g,0,0,12-bob*1.6,4.6-bob*.6);
  g.scale(1.12,1.12);
  // boots
  g.fillStyle='#3a2826';
  const lift1=Math.max(0,sw)*mv*3.2,lift2=Math.max(0,-sw)*mv*3.2;
  ell(g,-4.5+fx*1.5,-2.2-lift1,3.9,2.8);ell(g,4.5+fx*1.5,-2.2-lift2,3.9,2.8);
  g.translate(0,-bob*2.6);
  // lean into movement + squash/stretch
  const lean=clamp(p.vx/600,-.12,.12);
  g.transform(1,0,-lean,1,0,0);
  g.scale(1+bob*.05,1-bob*.05);
  // scarf tail (behind body unless moving down)
  const tailBase=[-side*4,-27];
  const flutter=Math.sin(t*14)*2.2*mv+Math.sin(t*3)*.6;
  const tailEnd=[tailBase[0]-p.vx*.055-side*3,tailBase[1]+7-p.vy*.05+flutter];
  const drawTail=()=>{g.strokeStyle='#b8352e';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(...tailBase);
    g.quadraticCurveTo(tailBase[0]+(tailEnd[0]-tailBase[0])*.5,tailBase[1]+5+flutter*.5,tailEnd[0],tailEnd[1]);g.stroke();
    g.strokeStyle='#e9c260';g.lineWidth=1;g.beginPath();g.moveTo(tailEnd[0]-1.5,tailEnd[1]+1.5);g.lineTo(tailEnd[0]+1.5,tailEnd[1]+2.5);g.stroke();};
  if(!front)drawTail();
  // lantern (behind body when walking up)
  const hx=side*11.5,hy=-15,swing=Math.sin(p.phase)*.35*mv-p.vx*.0012;
  const drawLantern=()=>{g.save();g.translate(hx,hy);g.rotate(swing);
    g.strokeStyle='#2a2420';g.lineWidth=1;g.beginPath();g.moveTo(0,0);g.lineTo(0,4);g.stroke();
    g.fillStyle='#2a2420';g.fillRect(-3.4,3.6,6.8,1.6);g.fillRect(-3.4,12,6.8,1.6);
    const lg=g.createLinearGradient(0,5,0,12);lg.addColorStop(0,'#fff6d0');lg.addColorStop(1,'#ffb347');g.fillStyle=lg;g.fillRect(-2.8,5,5.6,7);
    g.restore();
    p.lantern.x=p.x+(hx+Math.sin(swing)*-8)*1.12;p.lantern.y=p.y+(hy+8-bob*2.6)*1.12;};
  if(back)drawLantern();
  // cloak
  const cg=g.createLinearGradient(-12,0,12,0);cg.addColorStop(0,'#46a8a8');cg.addColorStop(.6,'#2c7480');cg.addColorStop(1,'#1d4e5c');
  g.fillStyle=cg;g.beginPath();g.moveTo(-7,-28);
  const hem=Math.sin(p.phase*2)*1.2*mv;
  g.quadraticCurveTo(-13.5,-13,-12.5-lean*20,-4+hem);g.quadraticCurveTo(0,-.8,12.5-lean*20,-4-hem);g.quadraticCurveTo(13.5,-13,7,-28);g.closePath();g.fill();
  g.strokeStyle='rgba(10,30,40,.35)';g.lineWidth=1;g.beginPath();g.moveTo(-3,-24);g.lineTo(-4.5,-5);g.moveTo(4,-24);g.lineTo(5,-5);g.stroke();
  g.strokeStyle='#e2b65a';g.lineWidth=1.6;g.beginPath();g.moveTo(-12.5-lean*20,-4.4+hem);g.quadraticCurveTo(0,-1.2,12.5-lean*20,-4.4-hem);g.stroke();
  if(!back){g.fillStyle='#e2b65a';circ(g,0,-22,1.3);circ(g,0,-16,1.3);}
  // arm/mitten on lantern side
  g.fillStyle='#235c69';ell(g,side*9,-18,3.6,5,side*.4);g.fillStyle='#b8352e';circ(g,hx*.92,hy+.5,2.4);
  // scarf collar
  g.fillStyle='#c8433a';g.beginPath();g.roundRect(-8.5,-31,17,6,3);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-8.5,-27,17,2);
  if(front)drawTail();
  // head + hood
  const hcx=fx*1.6,hcy=-38+(back?-.5:0);
  g.fillStyle='#8f3f30';circ(g,hcx*.6,hcy,11);
  // hood tip flops opposite to motion
  g.beginPath();g.moveTo(hcx*.6-5,hcy-8);g.quadraticCurveTo(hcx*.6-p.vx*.04-side*4,hcy-17-p.vy*.02,hcx*.6-p.vx*.07-side*9,hcy-12+Math.sin(t*9)*mv);g.lineTo(hcx*.6+4,hcy-9);g.closePath();g.fill();
  g.fillStyle='#e9c260';circ(g,hcx*.6-p.vx*.07-side*9,hcy-12+Math.sin(t*9)*mv,2.2);
  if(!back){
    g.fillStyle='#f3d2b2';ell(g,hcx,hcy+1.5,7.8-Math.abs(fx)*1.5,7.4);
    g.fillStyle='#5a3326';g.beginPath();g.ellipse(hcx,hcy-3.5,7.6-Math.abs(fx)*1.4,3.2,0,Math.PI,TAU);g.fill();
    if(fy>-.2||Math.abs(fx)>.3){
      const ex=fx*2.6,ey=fy*1.2;
      const blink=(t%4.2)<.12?.3:1;
      g.fillStyle='#1d1a24';ell(g,hcx-2.8+ex,hcy+1+ey,1.25,1.7*blink);ell(g,hcx+2.8+ex,hcy+1+ey,1.25,1.7*blink);
      g.fillStyle='rgba(240,120,120,.45)';ell(g,hcx-4.6+ex,hcy+4,1.8,1);ell(g,hcx+4.6+ex,hcy+4,1.8,1);
    }
  }else{g.fillStyle='rgba(0,0,0,.15)';ell(g,hcx*.6,hcy+3,8,4);}
  // hood rim highlight
  g.strokeStyle='rgba(255,210,180,.35)';g.lineWidth=1.2;g.beginPath();g.arc(hcx*.6,hcy,10.6,Math.PI*1.1,Math.PI*1.6);g.stroke();
  if(!back)drawLantern();
  g.restore();
}

function drawFire(g,o,t){
  drawSpr(g,o.spr,o.x,o.y);
  g.save();g.translate(o.x,o.y-12);g.globalCompositeOperation='lighter';
  const cols=['rgba(255,80,20,.55)','rgba(255,160,40,.6)','rgba(255,236,170,.75)'];
  for(let L=0;L<3;L++){const hW=[17,12,6][L],hH=[48,34,19][L];
    for(let k=0;k<3;k++){const ox=(k-1)*hW*.5,ph=t*(8+k)+k*2.1+L*1.3;
      const h=hH*(.78+.22*Math.sin(ph)+.08*Math.sin(ph*2.7));const sway=Math.sin(t*5+k*1.7)*3+wind*5;
      g.fillStyle=cols[L];g.beginPath();g.moveTo(ox-hW*.6,0);g.quadraticCurveTo(ox-hW*.75,-h*.45,ox+sway,-h);g.quadraticCurveTo(ox+hW*.75,-h*.45,ox+hW*.6,0);g.closePath();g.fill();}}
  g.restore();
}

function drawMarker(g,m,t){
  const st=m.state(); if(st==='none')return;
  const x=m.x,y=m.y-(m.h||80)+Math.sin(t*3+m.x)*3.5;
  g.save();g.translate(x,y);
  if(st==='done'){g.fillStyle='#3e9a62';circ(g,0,0,9);g.strokeStyle='#eafff0';g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(-4,0);g.lineTo(-1,3.5);g.lineTo(4.5,-3.5);g.stroke();}
  else if(st==='sealed'){g.fillStyle='rgba(30,36,56,.85)';circ(g,0,0,9);g.strokeStyle='#9aa6c4';g.lineWidth=1.8;g.beginPath();g.arc(0,-2,3.2,Math.PI,0);g.stroke();g.fillStyle='#9aa6c4';g.fillRect(-4.2,-1.5,8.4,6);}
  else if(st==='frozen'){g.fillStyle='rgba(20,50,90,.85)';circ(g,0,0,10);g.strokeStyle='#bfe8ff';g.lineWidth=1.6;g.lineCap='round';
    for(let k=0;k<3;k++){const a=k*Math.PI/3;g.beginPath();g.moveTo(Math.cos(a)*6,Math.sin(a)*6);g.lineTo(-Math.cos(a)*6,-Math.sin(a)*6);g.stroke();}}
  else if(st==='lesson'){g.fillStyle='#2b5f8a';g.beginPath();g.roundRect(-10,-8,20,15,4);g.fill();g.fillStyle='#e8f3ff';g.beginPath();g.moveTo(-7,-5);g.lineTo(-1,-3);g.lineTo(-1,5);g.lineTo(-7,3);g.closePath();g.fill();
    g.beginPath();g.moveTo(7,-5);g.lineTo(1,-3);g.lineTo(1,5);g.lineTo(7,3);g.closePath();g.fill();}
  else if(st==='lessonDone'){g.fillStyle='rgba(62,154,98,.85)';circ(g,0,0,6);g.strokeStyle='#eafff0';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.moveTo(-2.6,0);g.lineTo(-.6,2.3);g.lineTo(3,-2.2);g.stroke();}
  else if(st==='talk'){g.fillStyle='#f6ead0';g.beginPath();g.roundRect(-11,-8,22,15,6);g.fill();g.beginPath();g.moveTo(-3,7);g.lineTo(-7,12);g.lineTo(2,7);g.fill();
    g.fillStyle='#5a3a1a';for(const dx of [-5,0,5])circ(g,dx,-.5,1.6);}
  else{g.rotate(Math.PI/4);g.fillStyle='#7a4a12';g.fillRect(-9,-9,18,18);g.fillStyle='#f1c25c';g.fillRect(-7.5,-7.5,15,15);g.rotate(-Math.PI/4);
    g.fillStyle='#4a2a08';g.fillRect(-1.4,-6,2.8,8);circ(g,0,5,1.6);}
  g.restore();
}

function render(t){
  const g=ctx;
  g.setTransform(1,0,0,1,0,0);
  g.fillStyle='#0b1222';g.fillRect(0,0,cv.width,cv.height);
  const sx=DPR*ZOOM, ox=DPR*(VW/2-cam.x*ZOOM), oy=DPR*(VH/2-cam.y*ZOOM);
  g.setTransform(sx,0,0,sx,ox,oy);
  const vx0=cam.x-VW/2/ZOOM, vy0=cam.y-VH/2/ZOOM, vx1=cam.x+VW/2/ZOOM, vy1=cam.y+VH/2/ZOOM;
  // ground (only visible slice)
  const gx0=clamp(vx0,0,W),gy0=clamp(vy0,0,H),gx1=clamp(vx1,0,W),gy1=clamp(vy1,0,H);
  if(gx1>gx0&&gy1>gy0)g.drawImage(ground,gx0*GS,gy0*GS,(gx1-gx0)*GS,(gy1-gy0)*GS,gx0,gy0,gx1-gx0,gy1-gy0);
  // footprints
  if(FX.prints)for(const f of prints){
    const a=clamp(1-f.l/14,0,1)*(f.deep?.55:.32);
    g.save();g.translate(f.x,f.y);g.rotate(f.a);
    g.fillStyle=`rgba(85,105,145,${a})`;ell(g,0,0,3.6,2.3);
    g.fillStyle=`rgba(255,255,255,${a*.7})`;ell(g,-.6,-1.4,2.6,.9);g.restore();
  }
  // tap target ring
  if(tapTarget){const k=(t*2)%1;g.strokeStyle=`rgba(255,226,168,${.8-k*.6})`;g.lineWidth=1.6;g.beginPath();g.ellipse(tapTarget.x,tapTarget.y,6+k*10,(6+k*10)*.5,0,0,TAU);g.stroke();}
  // depth-sorted world
  const list=[];
  for(const o of objects){
    const s=o.s,hw=o.spr.w*s*.6;
    if(o.x+hw<vx0||o.x-hw>vx1||o.y-o.spr.oy*s>vy1+20||o.y+30<vy0)continue;
    list.push(o);
  }
  list.push({kind:'player',y:player.y});
  list.sort((a,b)=>a.y-b.y);
  for(const o of list){
    if(o.kind==='player'){drawPlayer(g,t);continue;}
    if(o.occ){
      const p=player,s=o.s;
      const inside=p.y<o.y-4&&p.x>o.x+o.occ[0]*s&&p.x<o.x+o.occ[1]*s&&p.y-30>o.y+o.occ[2]*s&&p.y-10<o.y+o.occ[3]*s;
      o.fade+=((inside?.38:1)-o.fade)*Math.min(1,dtLast*8);
    }
    g.globalAlpha=o.fade;
    if(o.kind==='fire')drawFire(g,o,t);
    else if(o.sway&&FX.wind){
      const sk=windAt(t,o.phase)*.045*o.sway;
      g.save();g.translate(o.x,o.y);g.transform(1,0,sk,1,0,0);g.scale(o.s,o.s);g.drawImage(o.spr.cv,-o.spr.ox,-o.spr.oy,o.spr.w,o.spr.h);g.restore();
    }else drawSpr(g,o.spr,o.x,o.y,o.s);
    if(o.kind==='stone')drawIce(g,o);
    g.globalAlpha=1;
    if(o.marker)drawMarker(g,o.marker,t);
  }
  // festival lantern strings (overhead, drawn above the sorted world)
  for(const s of STRINGS){
    if(Math.max(s.x1,s.x2)<vx0-40||Math.min(s.x1,s.x2)>vx1+40||Math.max(s.y1,s.y2)<vy0-40||Math.min(s.y1,s.y2)>vy1+120)continue;
    const sw=FX.wind?wind*4:0,mx=(s.x1+s.x2)/2+sw,my=(s.y1+s.y2)/2+s.sag;
    g.strokeStyle='rgba(40,30,30,.75)';g.lineWidth=1;g.beginPath();g.moveTo(s.x1,s.y1);g.quadraticCurveTo(mx,my,s.x2,s.y2);g.stroke();
    s.lan.forEach((L,i)=>{const u=L.u,x=(1-u)**2*s.x1+2*(1-u)*u*mx+u*u*s.x2,y=(1-u)**2*s.y1+2*(1-u)*u*my+u*u*s.y2,sway=Math.sin(t*2+i+s.x1)*1.5;
      L.light.x=x+sway;L.light.y=y+6;
      g.strokeStyle='rgba(40,30,30,.6)';g.beginPath();g.moveTo(x,y);g.lineTo(x+sway,y+4);g.stroke();
      g.fillStyle=L.c;ell(g,x+sway,y+9,4.6,5.6);g.fillStyle='rgba(255,240,200,.55)';ell(g,x+sway-1,y+8,1.8,3.4);
      g.fillStyle='#2a1a14';g.fillRect(x+sway-2.5,y+3,5,1.6);g.fillRect(x+sway-2,y+14.2,4,1.4);});
  }
  // world particles
  if(FX.particles){
    for(const p of parts){
      const k=p.l/p.m;
      if(p.t==='puff'){g.globalAlpha=(1-k)*.85;g.drawImage(DOT.white,p.x-p.sz*(1+k),p.y-p.sz*(1+k)*.7,p.sz*2*(1+k),p.sz*1.4*(1+k));}
      else if(p.t==='smoke'){g.globalAlpha=Math.sin(Math.PI*Math.min(1,k*1.4))*.32;g.drawImage(DOT.smoke,p.x-p.sz,p.y-p.sz,p.sz*2,p.sz*2);}
    }
    g.globalCompositeOperation='lighter';
    for(const p of parts){
      const k=p.l/p.m;
      if(p.t==='ember'){g.globalAlpha=(1-k)*(.6+.4*Math.sin(t*20+p.ph));const s=p.sz*(1-k*.5);g.drawImage(DOT.ember,p.x-s*2,p.y-s*2,s*4,s*4);}
      else if(p.t==='mote'){g.globalAlpha=Math.sin(Math.PI*k)*(.6+.4*Math.sin(t*5+p.ph));const s=p.sz;g.drawImage(p.warm?DOT.warm:DOT.cool,p.x-s*2,p.y-s*2,s*4,s*4);}
      else if(p.t==='spark'){g.globalAlpha=(1-k);const s=p.sz;g.drawImage(DOT.cool,p.x-s,p.y-s,s*2,s*2);}
    }
    g.globalCompositeOperation='source-over';g.globalAlpha=1;
  }
  // lighting
  if(FX.light&&amb.a>.01){
    lx.setTransform(1,0,0,1,0,0);lx.globalCompositeOperation='source-over';
    lx.clearRect(0,0,lc.width,lc.height);
    lx.fillStyle=rgba(amb.c,amb.a);lx.fillRect(0,0,lc.width,lc.height);
    lx.globalCompositeOperation='destination-out';
    const ls=DPR*LS*ZOOM;
    for(const L of lights){
      const fl=1+L.fl*(Math.sin(t*11+L.seed)*.5+Math.sin(t*6.3+L.seed*2)*.35+Math.sin(t*23+L.seed)*.15);
      L.cur=L.i*fl;const r=L.r*(1+(fl-1)*.4);
      const sx2=((L.x-cam.x)*ZOOM+VW/2)*DPR*LS,sy2=((L.y-cam.y)*ZOOM+VH/2)*DPR*LS,rr=r*ls;
      if(sx2<-rr||sy2<-rr||sx2>lc.width+rr||sy2>lc.height+rr)continue;
      const gr=lx.createRadialGradient(sx2,sy2,0,sx2,sy2,rr);
      gr.addColorStop(0,`rgba(0,0,0,${Math.min(.92,L.cur*.92)})`);gr.addColorStop(.4,`rgba(0,0,0,${.42*L.cur})`);gr.addColorStop(1,'rgba(0,0,0,0)');
      lx.fillStyle=gr;lx.beginPath();lx.ellipse(sx2,sy2,rr,rr*.8,0,0,TAU);lx.fill();
    }
    g.setTransform(1,0,0,1,0,0);g.drawImage(lc,0,0,cv.width,cv.height);
  }
  if(FX.light){
    g.setTransform(sx,0,0,sx,ox,oy);g.globalCompositeOperation='lighter';
    for(const L of lights){
      const r=L.r*.6,a=(L.col[0]<200?.14:.26)*(L.cur||L.i)*amb.glow;
      if(L.x+r<vx0||L.x-r>vx1||L.y+r<vy0||L.y-r>vy1)continue;
      const gr=g.createRadialGradient(L.x,L.y,0,L.x,L.y,r);
      gr.addColorStop(0,rgba(L.col,a));gr.addColorStop(.3,rgba(L.col,a*.45));gr.addColorStop(1,rgba(L.col,0));
      g.fillStyle=gr;g.fillRect(L.x-r,L.y-r,r*2,r*2);
    }
    g.globalCompositeOperation='source-over';
  }
  if(FX.particles&&SCENE.skyLanterns){
    g.setTransform(sx,0,0,sx,ox,oy);g.globalCompositeOperation='lighter';
    for(const p of parts)if(p.t==='sky'){const k=p.l/p.m,a=Math.min(1,k*4)*Math.min(1,(1-k)*3)*(.75+.25*Math.sin(t*6+p.ph));
      g.globalAlpha=a*.5;g.drawImage(DOT.warm,p.x-p.sz*4,p.y-p.sz*4,p.sz*8,p.sz*8);
      g.globalAlpha=a;g.fillStyle='#ffcf7a';g.beginPath();g.roundRect(p.x-p.sz*.55,p.y-p.sz*.8,p.sz*1.1,p.sz*1.5,p.sz*.35);g.fill();}
    g.globalAlpha=1;g.globalCompositeOperation='source-over';
  }
  if(SCENE.aurora&&FX.light){
    g.setTransform(DPR,0,0,DPR,0,0);g.globalCompositeOperation='screen';
    const bands=[[80,255,180,.2,.12],[90,220,255,.15,.2],[200,110,255,.12,.3]];
    bands.forEach(([r,gg,b,a,yy],k)=>{for(const [lw,al] of [[110,.35],[60,.6],[22,1]]){
      g.strokeStyle=`rgba(${r},${gg},${b},${a*al*(.75+.25*Math.sin(t*.4+k))})`;g.lineWidth=lw;g.lineCap='round';g.beginPath();
      for(let x=-40;x<=VW+40;x+=24){const y=VH*yy+Math.sin(x*.004+t*.25+k*1.7)*34+Math.sin(x*.011-t*.45+k)*12-cam.y*.02;x<=-40?g.moveTo(x,y):g.lineTo(x,y);}
      g.stroke();}});
    g.globalCompositeOperation='source-over';
  }
  // snow
  g.setTransform(DPR,0,0,DPR,0,0);
  if(FX.particles){
    for(const f of flakes){
      if(f.d>1.4){g.globalAlpha=.55;g.drawImage(DOT.white,f.x-f.r*2,f.y-f.r*2,f.r*4,f.r*4);}
      else{g.globalAlpha=.35+f.d*.35;g.drawImage(DOT.white,f.x-f.r*1.5,f.y-f.r*1.5,f.r*3,f.r*3);}
    }
    g.globalAlpha=1;
  }
  // foreground silhouettes (parallax 1.35)
  if(FX.fg){
    const psx=(player.x-cam.x)*ZOOM+VW/2,psy=(player.y-cam.y)*ZOOM+VH/2;
    for(const f of FG){
      const s=f[2]*ZOOM*.95,x=(f[0]*W/2000-cam.x)*ZOOM*1.35+VW/2,y=(f[1]*H/1500-cam.y)*ZOOM*1.35+VH/2;
      const w=320*s,h=520*s;if(x+w/2<0||x-w/2>VW||y<0||y-h>VH)continue;
      const near=Math.abs(psx-x)<w*.35&&psy<y&&psy>y-h*.9;
      f.fade=(f.fade??1);f.fade+=((near?.35:1)-f.fade)*Math.min(1,dtLast*6);
      g.globalAlpha=.94*f.fade;g.drawImage(SPR.fgPine,x-w/2,y-h,w,h);
    }
    g.globalAlpha=1;
  }
  // grade + vignette
  if(FX.grade){
    g.globalCompositeOperation='soft-light';g.fillStyle=rgba(amb.tint,amb.ta*2.2);g.fillRect(0,0,VW,VH);
    g.globalCompositeOperation='source-over';
    const vg=g.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.35,VW/2,VH/2,Math.hypot(VW,VH)*.6);
    vg.addColorStop(0,'rgba(6,10,24,0)');vg.addColorStop(1,`rgba(6,10,24,${.35+amb.a*.35})`);
    g.fillStyle=vg;g.fillRect(0,0,VW,VH);
  }
  // joystick
  if(joy.on){
    g.fillStyle='rgba(12,18,36,.35)';g.strokeStyle='rgba(255,226,168,.45)';g.lineWidth=2;
    g.beginPath();g.arc(joy.bx,joy.by,58,0,TAU);g.fill();g.stroke();
    g.fillStyle='rgba(255,226,168,.75)';g.beginPath();g.arc(joy.bx+joy.kx,joy.by+joy.ky,24,0,TAU);g.fill();
  }
}

