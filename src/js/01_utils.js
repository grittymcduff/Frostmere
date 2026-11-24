/* ---------- utils ---------- */
function mulberry(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R = mulberry(20261124);
const rand = (a,b) => a + R()*(b-a);
const pick = a => a[(R()*a.length)|0];
const clamp = (v,a,b) => v<a?a:v>b?b:v;
const lerp = (a,b,t) => a+(b-a)*t;
const TAU = Math.PI*2;
function ell(g,x,y,rx,ry,rot=0){g.beginPath();g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot,0,TAU);g.fill();}
function circ(g,x,y,r){g.beginPath();g.arc(x,y,Math.max(.1,r),0,TAU);g.fill();}
function canvas(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;}
function rgba(c,a){return `rgba(${c[0]},${c[1]},${c[2]},${a})`;}
function makeSprite(w,h,ox,oy,fn){
  const c=canvas(w*SS,h*SS), g=c.getContext('2d');
  g.scale(SS,SS); g.translate(ox,oy); fn(g);
  return {cv:c,w,h,ox,oy};
}
function softDot(col,size=64){
  const c=canvas(size,size),g=c.getContext('2d'),r=size/2;
  const gr=g.createRadialGradient(r,r,0,r,r,r);
  gr.addColorStop(0,rgba(col,1));gr.addColorStop(.35,rgba(col,.55));gr.addColorStop(1,rgba(col,0));
  g.fillStyle=gr;g.fillRect(0,0,size,size);return c;
}

