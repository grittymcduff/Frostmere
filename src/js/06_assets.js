/* ---------- art pipeline: load optional PNGs and swap them in for procedural sprites ---------- */
const IMG={};
let GROUND_IMG=null;
function loadImg(src){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>{console.warn('Art not found:',src);res(null);};im.src=src;});}
async function loadArt(){
  const jobs=[];
  for(const [key,a] of Object.entries(ART.sprites)){if(!a.files?.length)continue;
    jobs.push(Promise.all(a.files.map(f=>loadImg(ART.base+f))).then(ims=>{const ok=ims.filter(Boolean);if(ok.length)IMG[key]=ok;}));}
  if(ART.player?.file)jobs.push(loadImg(ART.base+ART.player.file).then(im=>{if(im)IMG.player=im;}));
  for(const [reg,f] of Object.entries(ART.ground||{}))if(f)jobs.push(loadImg(ART.base+f).then(im=>{if(im)IMG['ground_'+reg]=im;}));
  await Promise.race([Promise.all(jobs),new Promise(r=>setTimeout(r,8000))]);
}
function applyArt(){
  for(const [key,ims] of Object.entries(IMG)){
    const a=ART.sprites[key];if(!a)continue;
    if(key==='fgPine'){SPR.fgPine=ims[0];continue;}
    const mk=(im,i)=>({cv:im,w:a.w,h:a.h,ox:a.ox,oy:a.oy,info:a.infos?.[i]||a.info});
    SPR[key]=a.multi?ims.map(mk):mk(ims[0],0);
  }
}
/* sprite-sheet player (used only when ART.player.file is set and loads) */
function drawPlayerSheet(g,t){
  const P=ART.player,im=IMG.player,p=player,sp=Math.hypot(p.vx,p.vy);
  const fx=p.face.x,fy=p.face.y,row=Math.abs(fx)>Math.abs(fy)?(fx<0?1:2):(fy<0?3:0);
  const moving=sp>14&&!(surfaceAt(p.x,p.y)===2&&sp<60);
  const frame=moving&&P.frames>1?1+Math.floor(p.phase/(Math.PI/2))%(P.frames-1):0;
  const bob=moving?Math.abs(Math.sin(p.phase))*1.5:0;
  g.fillStyle='rgba(30,40,75,.38)';ell(g,p.x,p.y,12,4.6);
  g.drawImage(im,frame*P.fw,row*P.fh,P.fw,P.fh,p.x-P.ox,p.y-P.oy-bob,P.w,P.h);
  const ln=P.lantern?.[row]?.[frame];
  if(ln){p.lantern.x=p.x+ln[0];p.lantern.y=p.y+ln[1]-bob;}
  else{p.lantern.x=p.x+(row===1?-12:row===2?12:p.side*11);p.lantern.y=p.y-20;}
}
