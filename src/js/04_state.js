/* foreground silhouettes (parallax > 1) */
const FG=[[120,1560,1.1],[560,1620,1.25],[1460,1620,1.2],[1900,1520,1.05],[-90,980,1],[2090,760,1.1],[-70,330,.9],[2080,250,.95]];

/* ---------- player ---------- */
const player={x:1000,y:1240,vx:0,vy:0,face:{x:0,y:1},side:1,phase:0,stepIdx:0,lantern:{x:0,y:0}};
const PR=9;
let playerLight;

/* ---------- particles ---------- */
const parts=[];
const DOT={warm:softDot([255,170,80]),ember:softDot([255,120,40]),cool:softDot([130,220,255]),white:softDot([255,255,255]),smoke:softDot([205,210,222])};
function emit(p){if(parts.length<900)parts.push(p);}
const flakes=[];
function initFlakes(){flakes.length=0;const n=Math.round(clamp(VW*VH/4200,90,260));
  for(let i=0;i<n;i++){const d=Math.pow(R(),1.6)*1.7+.25;flakes.push({x:R()*VW,y:R()*VH,d,ph:R()*TAU,r:d>1.4?rand(3,5.5):d*rand(1,1.8)});}}
const prints=[];

/* ---------- input ---------- */
const keys=new Set();
let tapTarget=null, tapTime=0;
const joy={on:false,bx:0,by:0,kx:0,ky:0,vx:0,vy:0,id:null};
let ptr=null;
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
  keys.add(k); if(k==='e')tryRead(); if(k==='escape')closeCard();
  if(/^(w|a|s|d|arrow)/.test(k))tapTarget=null;
});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
addEventListener('blur',()=>keys.clear());
cv.addEventListener('pointerdown',e=>{
  if(uiOpen())return;
  cv.setPointerCapture(e.pointerId);
  ptr={id:e.pointerId,sx:e.clientX,sy:e.clientY,t:performance.now()};
});
cv.addEventListener('pointermove',e=>{
  if(!ptr||e.pointerId!==ptr.id)return;
  const dx=e.clientX-ptr.sx,dy=e.clientY-ptr.sy;
  if(!joy.on&&Math.hypot(dx,dy)>14){joy.on=true;joy.bx=ptr.sx;joy.by=ptr.sy;tapTarget=null;}
  if(joy.on){const m=Math.hypot(dx,dy),max=58,k=m>max?max/m:1;joy.kx=dx*k;joy.ky=dy*k;joy.vx=joy.kx/max;joy.vy=joy.ky/max;}
});
const endPtr=e=>{
  if(!ptr||e.pointerId!==ptr.id)return;
  if(!joy.on&&performance.now()-ptr.t<400){
    const wx=cam.x+(e.clientX-VW/2)/ZOOM,wy=cam.y+(e.clientY-VH/2)/ZOOM,it=tapPick(wx,wy);
    tapTarget=it?{x:it.x,y:it.y+14,it}:{x:wx,y:wy};tapTime=0;
    if(it&&Math.hypot(player.x-it.x,player.y-it.y)<it.r){tapTarget=null;if(!uiOpen())it.act();}
  }
  joy.on=false;joy.vx=joy.vy=joy.kx=joy.ky=0;ptr=null;
};
// stop the browser treating joystick drags as page gestures (pull-to-refresh, swipe-to-close):
// block touch scrolling everywhere except inside the scrollable panels
const scrollable=t=>t instanceof Element&&t.closest('#card,#log,#calc,#map,#fx,#report');
document.addEventListener('touchmove',e=>{if(!scrollable(e.target))e.preventDefault();},{passive:false});
cv.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);

/* ---------- camera ---------- */
const cam={x:player.x,y:player.y-30,px:0,py:0};

/* ---------- effects / time of day ---------- */
const FX={light:true,particles:true,wind:true,prints:true,fg:true,grade:true};
const TOD={
  day:  {amb:[30,40,80],a:0,   glow:.22,tint:[255,226,180],ta:.10},
  dusk: {amb:[44,34,100],a:.6,glow:.85,tint:[70,90,170],ta:.20},
  night:{amb:[6,10,36], a:.86, glow:1.05,tint:[50,80,160],ta:.22},
  festival:{amb:[64,26,92],a:.6,glow:1.25,tint:[200,110,190],ta:.2},   // Lantern Hollow
  aurora:{amb:[4,22,52],a:.72,glow:1.1,tint:[60,170,180],ta:.22},      // Crystal Reach
};
let todKey='dusk';
const amb={c:[...TOD.dusk.amb],a:TOD.dusk.a,glow:TOD.dusk.glow,tint:[...TOD.dusk.tint],ta:TOD.dusk.ta};

/* ---------- light buffer ---------- */
const lc=document.createElement('canvas'),lx=lc.getContext('2d');const LS=.5;

/* ---------- resize ---------- */
function resize(){
  VW=innerWidth;VH=innerHeight;DPR=Math.min(2,devicePixelRatio||1);
  cv.width=Math.round(VW*DPR);cv.height=Math.round(VH*DPR);
  ZOOM=clamp(Math.min(VW,VH)/560,.78,1.55);
  if(VW<VH)ZOOM=clamp(VW/430,.85,1.4);
  lc.width=Math.ceil(VW*DPR*LS);lc.height=Math.ceil(VH*DPR*LS);
  initFlakes();
}
addEventListener('resize',resize);

