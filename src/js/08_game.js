/* ---------- save ---------- */
const SAVE_KEY='frostmere-save-v1';
const blankSave=()=>({v:1,scene:'hub',done:{},missed:[],seen:{},tod:'dusk',stats:{answered:0,first:0}});
let SAVE=blankSave();
function loadSave(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(s&&s.v===1)SAVE={...blankSave(),...s};}catch(e){}}
function persist(){SAVE.scene=curScene||'hub';SAVE.tod=todKey;try{localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE));}catch(e){}renderHud();}

/* ---------- progress rules ---------- */
const regionById=id=>COURSE.regions.find(r=>r.id===id);
const liveNodes=reg=>reg.nodes.filter(id=>NODES[id]&&!NODES[id].sealed);
const regionDone=id=>{const r=regionById(id);if(!r)return true;const l=liveNodes(r);return l.length>0&&l.every(n=>SAVE.done[n]);};
const regionUnlocked=id=>{if(id==='hub')return true;const r=regionById(id);return !r.requires||regionDone(r.requires);};
function nodeState(id){const n=NODES[id];if(!n||n.sealed)return 'sealed';return SAVE.done[id]?'done':'todo';}

/* ---------- HUD, toasts, banners ---------- */
const $=id=>document.getElementById(id);
function renderHud(){
  const reg=regionById(curScene);
  $('hName').textContent=reg?reg.name:COURSE.hubName;
  $('hSub').textContent=reg?reg.sub:COURSE.hubSub;
  let line='';
  if(reg){const l=liveNodes(reg);line=`Study stones restored: ${l.filter(n=>SAVE.done[n]).length} / ${l.length}`+(reg.nodes.length>l.length?` · ${reg.nodes.length-l.length} sealed`:'');}
  else{const all=COURSE.regions.flatMap(liveNodes);line=`Course progress: ${all.filter(n=>SAVE.done[n]).length} / ${all.length} stones`+(SAVE.missed.length?` · ${SAVE.missed.length} to review`:'');}
  $('hLine').textContent=line;
}
let toastT=0;
function toast(msg,ms=2600){const t=$('toast');t.innerHTML=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms);}
function banner(title,sub){const b=$('banner');b.querySelector('b').textContent=title;b.querySelector('span').textContent=sub||'';b.classList.remove('on');void b.offsetWidth;b.classList.add('on');}
const uiOpen=()=>!card.classList.contains('hidden')||!$('log').classList.contains('hidden')||fading;

/* ---------- dialogs ---------- */
function openDialog(npc,i=0){
  const lines=typeof npc.lines==='function'?npc.lines():npc.lines;
  showCard(`<div class="kicker">${esc(npc.role||'')}</div><h2>${esc(npc.name)}</h2><p class="say">${lines[i]}</p><div class="acts"><span class="pg">${i+1} / ${lines.length}</span></div>`);
  const acts=card.querySelector('.acts'),b=btn(i<lines.length-1?'Next':'Close','primary');acts.appendChild(b);b.focus();
  b.onclick=()=>{if(i<lines.length-1)openDialog(npc,i+1);else{SAVE.seen[npc.id]=true;persist();closeCard();}};
}
function openWelcome(){openDialog(COURSE.welcome);}
function openNode(id){
  const n=NODES[id];
  if(!n||n.sealed){showCard(`<div class="kicker">${esc(n?.kicker||'Sealed stone')}</div><h2>${esc(n?.title||'Sealed')}</h2><p class="say">${n?.sealedText||'This stone is still sealed. Its quests are added in a later build.'}</p>`);return;}
  const prev=SAVE.done[id];
  showCard(`<div class="kicker">${esc(n.kicker)}</div><h2>${esc(n.title)}</h2><p class="say">${n.intro}</p>
    <p class="meta">${n.puzzles.length} challenges${prev?` · best first-try score ${prev.best} / ${n.puzzles.length}`:''}</p><div class="acts"></div>`);
  const b=btn(prev?'Study again':'Begin','primary');card.querySelector('.acts').appendChild(b);b.focus();
  b.onclick=()=>startSession(n.title,n.kicker,n.puzzles.map((_,idx)=>({node:id,idx})),items=>{
    const first=items.filter(x=>!x.missed).length,wasDone=!!SAVE.done[id],regBefore=regionDone(curScene);
    SAVE.done[id]={best:Math.max(first,SAVE.done[id]?.best||0),ts:Date.now()};persist();
    burst();
    if(!wasDone)toast(`<b>${esc(n.title)}</b> restored · ${first} / ${items.length} on the first try`);
    else toast(`Studied again · ${first} / ${items.length} on the first try`);
    if(!regBefore&&regionDone(curScene)){const nx=COURSE.regions.find(r=>r.requires===curScene);
      setTimeout(()=>banner(`${regionById(curScene).name} restored`,nx?`The gate to ${nx.name} is unsealed`:'Every stone in this region is restored'),900);}
  });
}
function openReview(){
  if(!SAVE.missed.length){showCard(`<div class="kicker">Review board</div><h2>Nothing to review</h2><p class="say">Questions you miss anywhere in the world are pinned here, so you can retry them with fresh numbers. The board is empty — nice work.</p>`);return;}
  const pickN=shuffle(SAVE.missed).slice(0,6);
  showCard(`<div class="kicker">Review board</div><h2>${SAVE.missed.length} pinned question${SAVE.missed.length>1?'s':''}</h2><p class="say">Here are ${pickN.length} of them, with fresh numbers where the question uses data. Answer one right on the first try and it comes off the board.</p><div class="acts"></div>`);
  const b=btn('Start review','primary');card.querySelector('.acts').appendChild(b);b.focus();
  b.onclick=()=>{startSession('Review board','Spaced review',pickN,items=>{
    let cleared=0;for(const it of items)if(!it.missed){SAVE.missed=SAVE.missed.filter(m=>!(m.node===it.node&&m.idx===it.idx));cleared++;}
    persist();toast(`Review done · ${cleared} cleared · ${SAVE.missed.length} left`);});run.mode='review';};
}
function burst(){if(!FX.particles)return;for(let i=0;i<60;i++){const a=rand(0,TAU),v=rand(40,170);emit({t:'mote',warm:1,x:player.x+rand(-10,10),y:player.y-30,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,l:0,m:rand(.8,1.8),sz:rand(2,5),ph:rand(0,9)});}}

/* ---------- quest log + save tools ---------- */
function renderLog(){
  const icon=s=>({done:'<i class="ic done">✓</i>',todo:'<i class="ic todo">!</i>',sealed:'<i class="ic sealed"></i>'}[s]);
  let h=`<button class="close" id="logClose" aria-label="Close">×</button><div class="kicker">Quest log</div><h2>The course map</h2>`;
  for(const r of COURSE.regions){
    const un=regionUnlocked(r.id),dn=regionDone(r.id);
    h+=`<section class="reg ${un?'':'locked'}"><div class="rh"><b>${esc(r.name)}</b><span>${dn?'Restored':un?'Open':'Sealed — restore '+esc(regionById(r.requires).name)+' first'}</span></div><div class="rs">${esc(r.sub)}</div><ul>`;
    for(const id of r.nodes){const n=NODES[id],st=nodeState(id);h+=`<li>${icon(st)}<span>${esc(n?.title||id)}</span><em>${st==='done'?`${SAVE.done[id].best} / ${n.puzzles.length}`:st==='sealed'?'later build':''}</em></li>`;}
    h+=`</ul></section>`;
  }
  const acc=SAVE.stats.answered?Math.round(100*SAVE.stats.first/SAVE.stats.answered):0;
  h+=`<p class="meta">${SAVE.stats.answered} answered · ${acc}% right on the first try · ${SAVE.missed.length} pinned for review</p>
  <details class="tools"><summary>Save &amp; transfer</summary><p class="meta">Progress saves in this browser automatically. To move it to another device, copy this code and paste it there.</p>
  <textarea id="saveCode" rows="3" readonly></textarea><div class="acts"><button class="opt" id="copyCode">Copy code</button><button class="opt" id="importBtn">Paste a code…</button><button class="opt danger" id="resetBtn">Reset progress</button></div><div id="toolMsg" class="meta"></div></details>`;
  const L=$('log');L.innerHTML=h;
  $('saveCode').value=btoa(unescape(encodeURIComponent(JSON.stringify(SAVE))));
  $('logClose').onclick=()=>L.classList.add('hidden');
  $('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText($('saveCode').value);$('toolMsg').textContent='Copied.';}catch(e){$('saveCode').select();$('toolMsg').textContent='Select the code above and copy it.';}};
  $('importBtn').onclick=()=>{const ta=$('saveCode');ta.readOnly=false;ta.value='';ta.focus();$('toolMsg').textContent='Paste your code, then press Load.';
    const b=$('importBtn');b.textContent='Load';b.onclick=()=>{try{const s=JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));if(s.v!==1)throw 0;SAVE={...blankSave(),...s};persist();travel(SAVE.scene,'start');L.classList.add('hidden');toast('Progress loaded.');}catch(e){$('toolMsg').textContent='That code could not be read.';}};};
  $('resetBtn').onclick=()=>{const b=$('resetBtn');if(b.dataset.arm){SAVE=blankSave();persist();travel('hub','start');L.classList.add('hidden');toast('Progress reset.');}else{b.dataset.arm=1;b.textContent='Tap again to erase everything';}};
}
function toggleLog(){const L=$('log');if(L.classList.contains('hidden')){renderLog();L.classList.remove('hidden');keys.clear();}else L.classList.add('hidden');}
$('logBtn').onclick=toggleLog;

/* ---------- interaction + travel ---------- */
let nearI=null,fading=false;
const readBtn=$('readBtn');
function tryRead(){if(nearI&&!uiOpen())nearI.act();}
readBtn.onclick=tryRead;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='q'&&card.classList.contains('hidden'))toggleLog();
  if(k==='escape'){closeCard();$('log').classList.add('hidden');}
  if(k==='enter'&&!uiOpen())tryRead();});
function travel(to,spawnKey){
  fading=true;const f=$('fade');f.classList.add('on');
  setTimeout(()=>{setScene(to,spawnKey);persist();const reg=regionById(to);
    banner(reg?reg.name:COURSE.hubName,reg?reg.sub:COURSE.hubSub);
    f.classList.remove('on');setTimeout(()=>fading=false,250);},420);
}
function updateWorldLogic(dt){
  // gates
  for(const gt of GATES){gt.cool-=dt;const d=Math.hypot(player.x-gt.x,player.y-gt.y);
    gt.light.col=regionUnlocked(gt.to)?[255,200,120]:[120,140,200];
    if(d<44&&gt.cool<=0&&!fading){
      if(regionUnlocked(gt.to)){gt.cool=2;travel(gt.to,gt.spawnKey);}
      else{gt.cool=1.4;const r=regionById(gt.to);toast(`<b>${esc(r.name)}</b> is sealed. Restore every stone in ${esc(regionById(r.requires).name)} first.`);
        const nx=(player.x-gt.x)/(d||1),ny=(player.y-gt.y)/(d||1);player.vx=nx*220;player.vy=ny*220;tapTarget=null;}
    }}
  // stone lights follow quest state
  for(const L of lights)if(L.node){const s=nodeState(L.node);L.col=s==='done'?[120,230,150]:s==='sealed'?[110,125,190]:[255,205,120];L.i=s==='sealed'?.45:.85;}
  // nearest interactable
  let best=null,bd=1e9;for(const it of INTER){const d=Math.hypot(player.x-it.x,player.y-it.y);if(d<it.r&&d<bd){bd=d;best=it;}}
  if(best!==nearI){nearI=best;readBtn.classList.toggle('hidden',!best);}
  if(best)readBtn.querySelector('span').textContent=best.label();
}

/* ---------- effects panel ---------- */
const fxPanel=$('fx');
$('fxBtn').onclick=()=>fxPanel.classList.toggle('hidden');
fxPanel.querySelectorAll('input[data-fx]').forEach(i=>i.onchange=()=>{FX[i.dataset.fx]=i.checked;if(i.dataset.fx==='particles')parts.length=0;});
function syncTodButtons(){document.querySelectorAll('#tod button').forEach(x=>x.classList.toggle('on',x.dataset.t===todKey));}
document.querySelectorAll('#tod button').forEach(b=>b.onclick=()=>{todKey=b.dataset.t;syncTodButtons();persist();});

/* ---------- main loop ---------- */
let last=performance.now(),dtLast=1/60,fpsAcc=0,fpsN=0,hintT=0;
const hint=$('hint'),fpsEl=$('fps');
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;dtLast=dt;const t=now/1000;
  wind=FX.wind?windAt(t):0;
  const T=TOD[todKey],e=1-Math.exp(-2.5*dt);
  for(let i=0;i<3;i++){amb.c[i]=lerp(amb.c[i],T.amb[i],e);amb.tint[i]=lerp(amb.tint[i],T.tint[i],e);}
  amb.a=lerp(amb.a,T.a,e);amb.glow=lerp(amb.glow,T.glow,e);amb.ta=lerp(amb.ta,T.ta,e);
  if(!uiOpen())updatePlayer(dt,t);else{player.vx*=.8;player.vy*=.8;}
  playerLight.x=player.lantern.x;playerLight.y=player.lantern.y;
  cam.px=cam.x;cam.py=cam.y;
  const tx=player.x+player.vx*.32,ty=player.y-24+player.vy*.32,ce=1-Math.exp(-3.6*dt);
  cam.x+=(tx-cam.x)*ce;cam.y+=(ty-cam.y)*ce;
  const hw=VW/2/ZOOM,hh=VH/2/ZOOM;
  cam.x=hw*2>=W?W/2:clamp(cam.x,hw,W-hw);cam.y=hh*2>=H?H/2:clamp(cam.y,hh,H-hh);
  updateParticles(dt,t);
  updateWorldLogic(dt);
  render(t);
  hintT+=dt;if(hintT>10&&hint.style.opacity!=='0')hint.style.opacity='0';
  fpsAcc+=dt;fpsN++;if(fpsAcc>.5){fpsEl.textContent=`${Math.round(fpsN/fpsAcc)} fps · ${parts.length} particles`;fpsAcc=0;fpsN=0;}
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
loadSave();
initSprites();
resize();
setScene(regionById(SAVE.scene)&&regionUnlocked(SAVE.scene)?SAVE.scene:'hub','start');
renderHud();
{const reg=regionById(curScene);banner(reg?reg.name:COURSE.hubName,reg?reg.sub:COURSE.hubSub);}
window.__game={get run(){return run;},player,cam,FX,SAVE:()=>SAVE,setTod:k=>{todKey=k;},travel,keys,NODES,Stats,openNode,regionDone};
requestAnimationFrame(frame);
