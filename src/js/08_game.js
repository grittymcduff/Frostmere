/* ---------- save ---------- */
const SAVE_KEY='frostmere-save-v1';
const blankSave=()=>({v:1,scene:'hub',done:{},missed:[],seen:{},lessons:{},locked:{},caches:{},inv:{lens:0,feather:0,charm:0},music:{on:true,vol:.08,settled:true},sfx:{on:true,vol:.1},muted:false,audioV:2,tod:'dusk',voice:true,stats:{answered:0,first:0}});
const FREEZE_AT=2; // misses on a stone attempt that freeze it
let SAVE=blankSave();
function loadSave(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));if(s&&s.v===1)SAVE={...blankSave(),...s,inv:{...blankSave().inv,...(s.inv||{})},audioV:s.audioV};}catch(e){}}
function persist(){SAVE.scene=curScene||'hub';SAVE.tod=todKey;SAVE.t=Date.now();try{localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE));}catch(e){}renderHud();cloudQueue();checkNotes();}

/* ---------- progress rules ---------- */
const regionById=id=>COURSE.regions.find(r=>r.id===id);
const liveNodes=reg=>reg.nodes.filter(id=>NODES[id]&&!NODES[id].sealed);
const regionDone=id=>{const r=regionById(id);if(!r)return true;const l=liveNodes(r);return l.length>0&&l.every(n=>SAVE.done[n]);};
const regionUnlocked=id=>{if(id==='hub')return true;const r=regionById(id);return !r.requires||regionDone(r.requires);};
function nodeState(id){const n=NODES[id];if(!n||n.sealed)return 'sealed';if(SAVE.done[id])return 'done';return SAVE.locked[id]?'frozen':'todo';}
const lessonId=(id,j)=>`${id}#L${j+1}`;
const lessonsOf=id=>NODES[id]?.lessons||[];
const lessonsDone=id=>lessonsOf(id).filter((_,j)=>SAVE.lessons[lessonId(id,j)]).length;
function lessonState(id,j){if(SAVE.lessons[lessonId(id,j)])return 'lessonDone';if(j>0&&!SAVE.lessons[lessonId(id,j-1)])return 'blocked';return SAVE.done[id]?'none':'lesson';}
function registerLessons(){for(const id of Object.keys(NODES)){const C=NODES[id].cache;if(C)NODES[id+'#C']={cacheOf:id,title:'Supply cache',kicker:`Supply cache · ${NODES[id].title}`,puzzles:[C.puzzle]};lessonsOf(id).forEach((L,j)=>{NODES[lessonId(id,j)]={lessonOf:id,j,title:L.title,kicker:`Waypoint ${j+1} of ${lessonsOf(id).length} · ${NODES[id].title}`,puzzles:L.practice};});}}

/* ---------- HUD, toasts, banners ---------- */
const $=id=>document.getElementById(id);
function renderHud(){
  const reg=regionById(curScene);
  $('hName').textContent=reg?reg.name:COURSE.hubName;
  $('hSub').textContent=reg?reg.sub:COURSE.hubSub;
  let line='';
  if(reg){const l=liveNodes(reg);const fz=l.filter(n=>nodeState(n)==='frozen').length;line=`Study stones restored: ${l.filter(n=>SAVE.done[n]).length} / ${l.length}`+(fz?` · ${fz} frozen`:'')+(reg.nodes.length>l.length?` · ${reg.nodes.length-l.length} sealed`:'');}
  else{const all=COURSE.regions.flatMap(liveNodes);line=`Course progress: ${all.filter(n=>SAVE.done[n]).length} / ${all.length} stones`+(reviewCount()?` · ${reviewCount()} to review`:'')+(dailyReady()?' · daily quest ready':'');}
  $('hLine').textContent=line;
  const iv=invText();$('hInv').textContent=iv?`Carrying: ${iv}`:'';$('hInv').classList.toggle('hidden',!iv);
}
let toastT=0;
function toast(msg,ms=2600){const t=$('toast');t.innerHTML=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms);}
function banner(title,sub){const b=$('banner');b.querySelector('b').textContent=title;b.querySelector('span').textContent=sub||'';b.classList.remove('on');void b.offsetWidth;b.classList.add('on');}
const uiOpen=()=>!card.classList.contains('hidden')||!$('log').classList.contains('hidden')||!$('map').classList.contains('hidden')||!$('report').classList.contains('hidden')||!$('notes').classList.contains('hidden')||!$('whatsnew').classList.contains('hidden')||fading;

/* ---------- dialogs ---------- */
function openDialog(npc,i=0){
  const lines=typeof npc.lines==='function'?npc.lines():npc.lines;
  showCard(`<div class="kicker">${esc(npc.role||'')}</div><h2>${esc(npc.name)}</h2><p class="say">${lines[i]}</p><div class="acts"><span class="pg">${i+1} / ${lines.length}</span></div>`);
  const acts=card.querySelector('.acts'),b=btn(i<lines.length-1?'Next':'Close','primary');
  if(npc.id==='welcome'&&i===0){const h=btn('▶ Hear Quill’s welcome','sol');h.onclick=()=>{closeCard();Narr.play();};acts.appendChild(h);}
  acts.appendChild(b);b.focus();
  b.onclick=()=>{if(i<lines.length-1)openDialog(npc,i+1);else{SAVE.seen[npc.id]=true;persist();closeCard();}};
}
function openWelcome(){openDialog(COURSE.welcome);}
function lessonListHtml(id){return `<ul class="wl">${lessonsOf(id).map((L,j)=>{const st=lessonState(id,j);return `<li class="${st}"><i class="ic ${st==='lessonDone'?'done':st==='blocked'?'sealed':'todo'}">${st==='lessonDone'?'✓':j+1}</i>${esc(L.title)}</li>`;}).join('')}</ul>`;}
function openNode(id){
  const n=NODES[id];
  if(!n||n.sealed){showCard(`<div class="kicker">${esc(n?.kicker||'Sealed stone')}</div><h2>${esc(n?.title||'Sealed')}</h2><p class="say">${n?.sealedText||'This stone is still sealed. Its quests are added in a later build.'}</p>`);return;}
  const L=lessonsOf(id).length,ld=lessonsDone(id),prev=SAVE.done[id];
  if(nodeState(id)==='frozen'){
    showCard(`<div class="kicker">${esc(n.kicker)} · frozen</div><h2>${esc(n.title)}</h2><p class="say">The stone rejected your answers and froze solid. To thaw it, finish its waypoints on the path behind you, in order — each is a short lesson with practice questions.</p>${lessonListHtml(id)}<p class="meta">${ld} of ${L} waypoints complete</p><div class="acts"></div>`);addTeach(id);return;}
  const rule=L&&!prev?(ld<L?`<p class="rule">Restore it with <b>at most one miss</b>. Miss ${FREEZE_AT} or more and it freezes until you finish its ${L} waypoints (${ld} done so far). Feeling unsure? The waypoints are on the path just before this stone.</p>`
      :`<p class="rule">You've finished all ${L} waypoints. Restore it with at most one miss — it won't freeze again.</p>`):'';
  showCard(`<div class="kicker">${esc(n.kicker)}</div><h2>${esc(n.title)}</h2><p class="say">${n.intro}</p>${rule}
    <p class="meta">${n.puzzles.length} challenges${prev?` · best first-try score ${prev.best} / ${n.puzzles.length}`:''}${invText()?` · you carry ${invText()}`:''}</p><div class="acts"></div>`);
  const b=btn(prev?'Study again':'Challenge the stone','primary');card.querySelector('.acts').appendChild(b);b.focus();addTeach(id);
  b.onclick=()=>startSession(n.title,n.kicker,n.puzzles.map((_,idx)=>({node:id,idx})),items=>{
    const miss=items.filter(x=>x.missed).length,first=items.length-miss,wasDone=!!SAVE.done[id],regBefore=regionDone(curScene);
    if(wasDone){SAVE.done[id].best=Math.max(first,SAVE.done[id].best);persist();toast(`Studied again · ${first} / ${items.length} on the first try`);return;}
    if(miss>=FREEZE_AT){
      if(L&&lessonsDone(id)<L){SAVE.locked[id]=true;persist();freezeFx(id);chime('freeze');quillOnce('barkFreeze','Frozen. No shame in it — walk back to its waypoints. The lessons there are exactly what this stone was asking.');
        toast(`<b>${esc(n.title)}</b> froze over · ${miss} misses. Finish its ${L} waypoints to thaw it.`,4200);}
      else{persist();toast(`The stone dims · ${miss} misses. It needs at most one — try again.`,3600);}
      return;}
    delete SAVE.locked[id];SAVE.done[id]={best:first,ts:Date.now()};persist();
    burst();chime('restore');quillOnce('barkStone','Your first stone, restored. One idea you can now defend — nineteen to go.');toast(`<b>${esc(n.title)}</b> restored · ${first} / ${items.length} on the first try`);
    if(!regBefore&&regionDone(curScene)){const nx=COURSE.regions.find(r=>r.requires===curScene);chime('region');
      quillOnce('barkRegion_'+curScene,{woods:'Signpost Woods is restored. You can read a regression now — next, learn when to trust one. Lantern Hollow awaits to the west.',hollow:'Lantern Hollow is restored. You know the rules and the tests. Crystal Reach, to the east, is where broken models go to be diagnosed.',reach:'Every stone restored. Take the practice final under exam conditions — and keep the review board empty.'}[curScene]);
      setTimeout(()=>banner(`${regionById(curScene).name} restored`,nx?`The gate to ${nx.name} is unsealed`:'Every stone in this region is restored'),900);}
  },'stone');
}
function openLesson(id,j){
  const Ls=lessonsOf(id),L=Ls[j],lid=lessonId(id,j),st=lessonState(id,j),n=NODES[id];
  const kick=`Waypoint ${j+1} of ${Ls.length} · leads to ${n.title}`;
  if(st==='blocked'){showCard(`<div class="kicker">${esc(kick)}</div><h2>${esc(L.title)}</h2><p class="say">The pages are blank for now. Waypoints open in order — finish <b>${esc(Ls[j-1].title)}</b> first; it's back along the path.</p>`);return;}
  showCard(`<div class="kicker">${esc(kick)}</div><h2>${esc(L.title)}</h2><div class="teach">${L.teach}</div>
    <p class="meta">${L.practice.length} practice question${L.practice.length>1?'s':''}${SAVE.lessons[lid]?' · completed':''}</p><div class="acts"></div>`);
  const b=btn(SAVE.lessons[lid]?'Practice again':'Practice','primary');card.querySelector('.acts').appendChild(b);b.focus();addTeach(id);
  b.onclick=()=>startSession(L.title,kick,L.practice.map((_,idx)=>({node:lid,idx})),()=>{
    const was=SAVE.lessons[lid];SAVE.lessons[lid]=true;
    const all=lessonsDone(id)===Ls.length;
    if(all&&SAVE.locked[id]){delete SAVE.locked[id];persist();thawFx(id);chime('thaw');quillOnce('barkThaw','Thawed. Try the stone again while the lessons are fresh.');toast(`<b>${esc(n.title)}</b> thaws — challenge it again.`,3600);return;}
    persist();if(!was&&SAVE.locked[id])crackFx(id);if(!was)toast(all?`All waypoints for <b>${esc(n.title)}</b> complete.`:`Waypoint complete · next one is further along the path.`);
  });
}
const ITEM={lens:{n:'Lens',d:'strikes out one wrong answer on a multiple-choice question'},feather:{n:'Feather',d:'reveals the first step on a calculation question'},charm:{n:'Warding Charm',d:'arm it before answering — your next miss on that question won’t count'}};
function invText(){return Object.keys(ITEM).filter(k=>SAVE.inv[k]).map(k=>`${SAVE.inv[k]} ${ITEM[k].n}${SAVE.inv[k]>1&&k!=='charm'?'s':''}`).join(', ');}
function openCache(id){
  const C=NODES[id].cache,cid=id+'#C',it=ITEM[C.item];
  if(SAVE.caches[cid]){showCard(`<div class="kicker">Supply cache · ${esc(NODES[id].title)}</div><h2>Empty cache</h2><p class="say">You already took the ${it.n} from this one.</p>`);return;}
  showCard(`<div class="kicker">Supply cache · near ${esc(NODES[id].title)}</div><h2>A frozen supply cache</h2><p class="say">A rune-lock seals it. Solve the problem etched on the lid to open it. Inside: a <b>${it.n}</b> — it ${it.d}. Items work only during a stone challenge.</p><div class="acts"></div>`);
  const b=btn('Read the lock','primary');card.querySelector('.acts').appendChild(b);b.focus();
  b.onclick=()=>startSession('Supply cache',`Supply cache · ${NODES[id].title}`,[{node:cid,idx:0}],()=>{
    SAVE.caches[cid]=true;SAVE.inv[C.item]=(SAVE.inv[C.item]||0)+1;persist();chime('cache');quillOnce('barkCache','A cache! Items only work at the stones — save them for the ones that worry you.');
    const o=objects.find(o=>o.cache===id);if(o){o.spr=SPR.cacheOpen;burst();}
    toast(`Found a <b>${it.n}</b> — it ${it.d}.`,4200);},'cache');
}
function stoneObj(id){return objects.find(o=>o.kind==='stone'&&o.node===id);}
let shake=0;
/* ice shell on frozen stones: grows on freeze, cracks as waypoints are finished, shatters on thaw */
const ICEFX={};const nowS=()=>performance.now()/1000;
function iceFrame(id){const L=lessonsOf(id).length,f=L?lessonsDone(id)/L:0,C=SPR.iceCracks;
  if(f<=0||!C)return SPR.ice;return f<.6||!C[1]?C[0]:C[1];}
function drawIce(g,o){
  const id=o.node,fx=ICEFX[id];
  if(fx){const e=nowS()-fx.t0;
    if(fx.k==='freeze'&&e<.7){const p=1-(1-e/.7)**3,S=SPR.ice,top=o.y+2-S.oy,h=S.h*p;
      g.save();g.beginPath();g.rect(o.x-S.ox-10,top+S.h-h,S.w+20,h+6);g.clip();const a=g.globalAlpha;g.globalAlpha=a*(.4+.6*p);
      drawSpr(g,S,o.x,o.y+2,.94+.06*p);g.globalAlpha=a;g.restore();return;}
    if(fx.k==='thaw'&&e<1.2){const C=SPR.iceCracks,S=C?C[C.length-1]:SPR.ice;
      if(e<.45){const j=e*6;drawSpr(g,S,o.x+rand(-j,j),o.y+2);return;}
      const k=(e-.45)/.75,a=g.globalAlpha;g.globalAlpha=a*(1-k)**1.5;drawSpr(g,S,o.x,o.y+2+k*6,1+k*.18);g.globalAlpha=a;return;}
    if(fx.k==='crack'&&e<.5&&SAVE.locked[id]){drawSpr(g,iceFrame(id),o.x+rand(-2,2)*(1-e*2),o.y+2);return;}
    delete ICEFX[id];}
  if(SAVE.locked[id])drawSpr(g,iceFrame(id),o.x,o.y+2);
}
function iceBurst(o,n){for(let i=0;i<n;i++){const a=rand(0,TAU),v=rand(30,160);emit({t:'spark',x:o.x+rand(-14,14),y:o.y-rand(10,70),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,l:0,m:rand(.6,1.4),sz:rand(3,7)});}}
function crackFx(id){const o=stoneObj(id);ICEFX[id]={k:'crack',t0:nowS()};shake=.18;if(o&&FX.particles)iceBurst(o,18);}
function freezeFx(id){const o=stoneObj(id);ICEFX[id]={k:'freeze',t0:nowS()};shake=.45;if(!o||!FX.particles)return;
  for(let i=0;i<70;i++){const a=rand(0,TAU),v=rand(30,160);emit({t:'spark',x:o.x+rand(-14,14),y:o.y-rand(10,70),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,l:0,m:rand(.6,1.4),sz:rand(3,7)});}}
function thawFx(id){const o=stoneObj(id);ICEFX[id]={k:'thaw',t0:nowS()};if(!o||!FX.particles)return;setTimeout(()=>iceBurst(o,60),450);shake=.25;
  for(let i=0;i<50;i++){emit({t:'mote',warm:1,x:o.x+rand(-20,20),y:o.y-rand(0,80),vx:rand(-20,20),vy:rand(-60,-20),l:0,m:rand(1,2),sz:rand(2,5),ph:rand(0,9)});}}
/* ---------- practice final: 2 questions from every module, mixed ---------- */
const EXAM_PER=2;
function examPool(){const pool={};for(const [id,n] of Object.entries(NODES)){const m=/^m(\d+)-[a-z]+$/.exec(id);if(!m||n.sealed||!n.puzzles||n.explain)continue;
  (pool[+m[1]]=pool[+m[1]]||[]).push(...n.puzzles.map((_,idx)=>({node:id,idx})));}return pool;}
function openExam(){
  const pool=examPool(),mods=Object.keys(pool).map(Number).sort((a,b)=>a-b),N=mods.length*EXAM_PER,E=SAVE.exam;
  showCard(`<div class="kicker">Village exam hall</div><h2>Practice final</h2>
    <p class="say">${N} questions — ${EXAM_PER} from each of Modules ${mods[0]}–${mods[mods.length-1]}, drawn at random from the study stones and shuffled, with fresh numbers where a question uses data. The clock runs while you work.</p>
    <p class="say"><b>Practice mode:</b> you see whether each answer is right and can try again; your score counts first tries. <b>Exam conditions:</b> one attempt per question, a countdown on each (75 s multiple choice, 2 min sorting, 2½ min calculations), and no feedback until the end — then you review every miss with its answer.</p>
    <p class="meta">Items don’t work here; the calculator does. Misses go to the review board.</p>
    ${E?`<p class="meta">Best: <b>${E.best} / ${E.n}</b> · last: ${E.last} / ${E.n} in ${fmtClock(E.time)} · taken ${E.count} time${E.count>1?'s':''}</p>`:''}<div class="acts"></div>`);
  const draw=()=>shuffle(mods.flatMap(m=>shuffle(pool[m]).slice(0,EXAM_PER)));
  const b=btn('Practice mode','sol'),c=btn('Exam conditions','primary');card.querySelector('.acts').append(b,c);c.focus();
  b.onclick=()=>startSession('Practice final','Village exam hall',draw(),res=>examResult(res,mods,false),'exam');
  c.onclick=()=>startSession('Practice final · exam conditions','Village exam hall',draw(),res=>examResult(res,mods,true),'examc');
}
setInterval(()=>{const c=document.getElementById('exClock');if(c&&run?.mode==='exam')c.textContent=fmtClock(Date.now()-run.t0);},500);
function examResult(items,mods,strict){
  const n=items.length,score=items.filter(x=>!x.missed).length;
  const by=m=>items.filter(x=>+/^m(\d+)/.exec(x.node)[1]===m);
  const prev=SAVE.exam;SAVE.exam={best:Math.max(score,prev?.best||0),last:score,n,time:examTime,count:(prev?.count||0)+1};SAVE.examHist=[...(SAVE.examHist||[]),{s:score,n,t:examTime,ts:Date.now(),c:strict?1:0}].slice(-12);persist();
  const weak=mods.filter(m=>by(m).some(x=>x.missed));
  const rows=mods.map(m=>{const its=by(m),ok=its.filter(x=>!x.missed).length;return `<tr><td class="mod">Module ${m}</td><td class="n ${ok===its.length?'ok':'no'}">${ok} / ${its.length}</td><td>${[...new Set(its.filter(x=>x.missed).map(x=>esc(NODES[x.node].title)))].join(', ')||'—'}</td></tr>`;}).join('');
  setTimeout(()=>{showCard(`<div class="kicker">Village exam hall · results</div><h2>${score} / ${n} on the first try</h2>
    <p class="say">${score>=n*.9?'Excellent — exam-ready across the board.':score>=n*.75?'Solid. Tighten up the modules marked below.':score>=n*.5?'Getting there. Revisit the stones listed below, and do their waypoints if you skipped them.':'Plenty to review — work through the waypoints and stones listed below, then try again.'} Time: <b>${fmtClock(examTime)}</b>.${prev?` Best so far: ${SAVE.exam.best} / ${n}.`:''}</p>
    <table class="tb exres"><tr><th>Module</th><th class="n">Right first try</th><th>Revisit</th></tr>${rows}</table>
    ${strict&&weak.length?`<details class="tools" open><summary>Review your ${n-score} miss${n-score>1?'es':''}</summary>${items.filter(x=>x.missed).map(x=>{const p=x.p,ans=p.type==='mc'?p.opts[p.a]:p.type==='num'?`${p.pre||''}${p.fmt?p.fmt(p.a):fmtNum(p.a,Math.abs(p.a)<10?3:2)}${p.unit?' '+p.unit:''}`:p.type==='order'?p.items.join(' → '):p.items.map(t=>`${t.t} → <i>${p.cats[t.c]}</i>`).join('<br>');
      return `<div class="miss"><p class="q">${p.q}${x.timedOut?' <em>(time ran out)</em>':''}</p><p><b>Answer:</b> ${ans}</p>${p.solution?`<p class="meta">${p.solution}</p>`:''}<p class="meta">${p.why||''}</p></div>`;}).join('')}</details>`:''}
    ${weak.length?`<p class="meta">Missed questions are pinned to the review board by the fire.</p>`:''}<div class="acts"></div>`);
    if(!SAVE.seen.barkExam){SAVE.seen.barkExam=1;quillSay('Your first practice final. Whatever the score, the misses are the gift — each one is now waiting on the review board.');}
    chime('restore');const a=btn('Take it again','primary'),c=btn('Close','sol');card.querySelector('.acts').append(a,c);a.onclick=openExam;c.onclick=closeCard;},60);
}
let examTime=0;
const reviewCount=()=>{const due=dueKeys().filter(k=>!SAVE.missed.some(m=>m.node+'|'+m.idx===k));return SAVE.missed.length+due.length;};
function openReview(){
  const miss=SAVE.missed.map(m=>({node:m.node,idx:m.idx})),due=dueKeys().filter(k=>!SAVE.missed.some(m=>m.node+'|'+m.idx===k)).map(k=>{const [node,idx]=k.split('|');return {node,idx:+idx};});
  if(!miss.length&&!due.length){
    const Q=SAVE.qs||{},next=Object.values(Q).filter(q=>q.box>0&&q.due).sort((a,b)=>a.due-b.due)[0];
    showCard(`<div class="kicker">Review board</div><h2>Nothing due right now</h2><p class="say">Two kinds of questions come back here: ones you <b>missed</b>, and ones you got right that are due for a <b>spaced refresher</b> — after 1 day, then 3, 7, 16 and 35. Spacing reviews out like this is the most reliable way to remember material on exam day.</p>${next?`<p class="meta">Next refresher due ${new Date(next.due).toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}.</p>`:''}`);return;}
  const pickN=[...shuffle(miss).slice(0,6),...due].slice(0,8);
  showCard(`<div class="kicker">Review board</div><h2>${miss.length} missed · ${due.length} due for a refresher</h2>
    <p class="say">Here are ${pickN.length}, missed ones first, with fresh numbers where the question uses data. Get a missed question right first time and it comes off the board; get a refresher right and it comes back later, at a longer gap.</p><div class="acts"></div>`);
  const b=btn('Start review','primary');card.querySelector('.acts').appendChild(b);b.focus();
  b.onclick=()=>{startSession('Review board','Spaced review',pickN,items=>{
    let cleared=0;for(const it of items)if(!it.missed){SAVE.missed=SAVE.missed.filter(m=>!(m.node===it.node&&m.idx===it.idx));cleared++;}
    persist();toast(`Review done · ${cleared} of ${items.length} right first time · ${reviewCount()} left`);},'review');};
}
function burst(){if(!FX.particles)return;for(let i=0;i<60;i++){const a=rand(0,TAU),v=rand(40,170);emit({t:'mote',warm:1,x:player.x+rand(-10,10),y:player.y-30,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,l:0,m:rand(.8,1.8),sz:rand(2,5),ph:rand(0,9)});}}

/* ---------- quest log + save tools ---------- */
function renderLog(){
  const icon=s=>({done:'<i class="ic done">✓</i>',todo:'<i class="ic todo">!</i>',sealed:'<i class="ic sealed"></i>',frozen:'<i class="ic frozen">❄</i>'}[s]);
  let h=`<button class="close" id="logClose" aria-label="Close">×</button><div class="kicker">Quest log</div><h2>The course map</h2>`;
  for(const r of COURSE.regions){
    const un=regionUnlocked(r.id),dn=regionDone(r.id);
    h+=`<section class="reg ${un?'':'locked'}"><div class="rh"><b>${esc(r.name)}</b><span>${dn?'Restored':un?'Open':'Sealed — restore '+esc(regionById(r.requires).name)+' first'}</span></div><div class="rs">${esc(r.sub)}</div><ul>`;
    for(const id of r.nodes){const n=NODES[id],st=nodeState(id),L=lessonsOf(id).length;h+=`<li>${icon(st)}<span>${esc(n?.title||id)}${L?`<small> · waypoints ${lessonsDone(id)}/${L}</small>`:''}</span><em>${st==='done'?`${SAVE.done[id].best} / ${n.puzzles.length}`:st==='sealed'?'later build':st==='frozen'?'frozen':''}</em></li>`;}
    const cs=r.nodes.filter(id=>NODES[id]?.cache);if(cs.length)h+=`<li class="cl"><i class="ic cache"></i><span>Supply caches found</span><em>${cs.filter(id=>SAVE.caches[id+'#C']).length} / ${cs.length}</em></li>`;
    h+=`</ul></section>`;
  }
  const acc=SAVE.stats.answered?Math.round(100*SAVE.stats.first/SAVE.stats.answered):0;
  h+=`<p class="meta">${invText()?`Carrying: ${invText()} · `:''}${SAVE.stats.answered} answered · ${acc}% right on the first try · ${SAVE.missed.length} pinned for review</p>
  <details class="tools" id="acctSec"><summary>Account &amp; cloud save</summary><div id="acctBox"></div></details>
  <details class="tools"><summary>Save &amp; transfer</summary><p class="meta">Progress saves in this browser automatically. To move it to another device, copy this code and paste it there.</p>
  <textarea id="saveCode" rows="3" readonly></textarea><div class="acts"><button class="opt" id="copyCode">Copy code</button><button class="opt" id="importBtn">Paste a code…</button><button class="opt danger" id="resetBtn">Reset progress</button></div><div id="toolMsg" class="meta"></div></details>`;
  const L=$('log');L.innerHTML=h;renderAcct();
  $('saveCode').value=btoa(unescape(encodeURIComponent(JSON.stringify(SAVE))));
  $('logClose').onclick=()=>L.classList.add('hidden');
  $('copyCode').onclick=async()=>{try{await navigator.clipboard.writeText($('saveCode').value);$('toolMsg').textContent='Copied.';}catch(e){$('saveCode').select();$('toolMsg').textContent='Select the code above and copy it.';}};
  $('importBtn').onclick=()=>{const ta=$('saveCode');ta.readOnly=false;ta.value='';ta.focus();$('toolMsg').textContent='Paste your code, then press Load.';
    const b=$('importBtn');b.textContent='Load';b.onclick=()=>{try{const s=JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));if(s.v!==1)throw 0;SAVE={...blankSave(),...s,reset:Date.now()};persist();travel(SAVE.scene,'start');L.classList.add('hidden');toast('Progress loaded.');}catch(e){$('toolMsg').textContent='That code could not be read.';}};};
  $('resetBtn').onclick=()=>{const b=$('resetBtn');if(b.dataset.arm){SAVE={...blankSave(),reset:Date.now()};persist();travel('hub','start');L.classList.add('hidden');toast('Progress reset.');}else{b.dataset.arm=1;b.textContent='Tap again to erase everything';}};
}
/* ---------- map: the three regions and what each stone covers, in plain language ---------- */
function renderMap(){
  const R=COURSE.regions,here=curScene||'hub',icon=s=>({done:'<i class="ic done">✓</i>',todo:'<i class="ic todo">!</i>',sealed:'<i class="ic sealed"></i>',frozen:'<i class="ic frozen">❄</i>'}[s]);
  const pos={hub:[200,128],woods:[200,34],hollow:[56,128],reach:[344,128]};
  const stat=id=>{if(id==='hub')return '';const r=regionById(id),l=liveNodes(r);return `${l.filter(n=>SAVE.done[n]).length}/${l.length}`;};
  const col=id=>id==='hub'?'#ffd27a':regionDone(id)?'#8fe0a0':regionUnlocked(id)?'#ffd27a':'#7f8aa8';
  let svg=`<svg viewBox="0 0 400 182" role="img" aria-label="Map: the village in the middle, Signpost Woods to the north, Lantern Hollow to the west, Crystal Reach to the east">`;
  for(const id of ['woods','hollow','reach'])svg+=`<line x1="${pos.hub[0]}" y1="${pos.hub[1]}" x2="${pos[id][0]}" y2="${pos[id][1]}" stroke="${regionUnlocked(id)?'rgba(255,214,150,.55)':'rgba(140,150,180,.35)'}" stroke-width="2.5" stroke-dasharray="${regionUnlocked(id)?'':'5 5'}"/>`;
  for(const id of ['hub','woods','hollow','reach']){const [x,y]=pos[id],name=id==='hub'?'Frostmere Village':regionById(id).name,lk=id!=='hub'&&!regionUnlocked(id);
    svg+=`<g class="rg" data-r="${id}"><circle cx="${x}" cy="${y}" r="${id==='hub'?17:15}" fill="rgba(10,16,34,.85)" stroke="${col(id)}" stroke-width="2.5"/>
      <text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="12" fill="${col(id)}">${id==='hub'?'⌂':lk?'🔒':stat(id)}</text>
      <text x="${x}" y="${y+(id==='woods'?-22:31)+(id==='woods'?0:0)}" text-anchor="middle" font-size="12.5">${esc(name)}</text>
      ${id===here?`<text x="${x}" y="${y+(id==='woods'?34:45)}" text-anchor="middle" font-size="10.5" fill="#8fe0a0">● you are here</text>`:''}</g>`;}
  svg+=`</svg>`;
  const sec=(id,name,tag,body,lk,lockMsg)=>`<section class="mreg${lk?' locked':''}" id="mr-${id}"><h3><span>${esc(name)} ${id===here?'<em class="here">· you are here</em>':''}</span><small>${tag}</small></h3><p class="pl">${COURSE.plain[id]}${lk?` <i>${lockMsg}</i>`:''}</p>${body}</section>`;
  let h=`<button class="close" id="mapClose" aria-label="Close">×</button><div class="kicker">Map of Frostmere</div><h2>Where to go, and what you’ll learn there</h2>${svg}`;
  h+=sec('hub','Frostmere Village','home base',`<ul>
    <li><i class="ic todo">?</i><span><b>Warden Quill</b> — your guide; replay his welcome at the sign</span></li>
    <li><i class="ic ${reviewCount()?'todo':'done'}">${reviewCount()?'!':'✓'}</i><span><b>Review board</b> — missed questions, plus ones due for a spaced refresher<em>${SAVE.missed.length} missed · ${dueKeys().length} due</em></span></li>
    <li><i class="ic todo">✎</i><span><b>Interpretation desk</b> — explain a result in your own words, then compare with a model answer</span></li>
    <li><i class="ic ${SAVE.exam?'done':'todo'}">${SAVE.exam?'✓':'!'}</i><span><b>Practice final</b> — 20 mixed questions from every area, with a clock<em>${SAVE.exam?`best ${SAVE.exam.best} / ${SAVE.exam.n}`:'not taken yet'}</em></span></li></ul>`,false)
;
  for(const r of R){const un=regionUnlocked(r.id),req=r.requires?regionById(r.requires).name:'';
    const items=r.nodes.map(id=>{const n=NODES[id],st=un?nodeState(id):'sealed',L=lessonsOf(id).length;
      return `<li>${icon(st)}<span><b>${esc(n.title)}</b> — ${COURSE.about[id]||esc(n.kicker||'')}${TEACH[id]?` <button class="lnk" data-teach="${id}">🎓 teach me</button>`:''}<em>${st==='done'?'restored':st==='frozen'?'frozen — finish its waypoints':un?`${L?`${lessonsDone(id)} of ${L} lessons done`:''}`:'locked'}${n.kicker?` · <span class="tag">${esc(n.kicker.split('·')[0].trim())}</span>`:''}</em></span></li>`;}).join('');
    const tag=(r.sub.split('·')[0]||'').trim();
    h+=sec(r.id,r.name,tag,`<ul>${items}</ul>${un&&r.id!==here?`<div class="acts" style="justify-content:flex-start;margin-top:8px"><button class="go" data-go="${r.id}">Travel to ${esc(r.name)}</button></div>`:''}`,!un,`Opens once every stone in ${esc(req)} is restored.`);}
  if(here!=='hub')h+=`<div class="acts" style="justify-content:flex-start"><button class="go" data-go="hub">Return to the village</button></div>`;
  const M=$('map');M.innerHTML=h;
  $('mapClose').onclick=()=>M.classList.add('hidden');
  M.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{M.classList.add('hidden');const to=b.dataset.go;travel(to,to==='hub'?('from'+here[0].toUpperCase()+here.slice(1)):'fromHub');});
  M.querySelectorAll('[data-teach]').forEach(b=>b.onclick=()=>Teach.open(b.dataset.teach));
  M.querySelectorAll('svg .rg').forEach(g=>g.onclick=()=>$('mr-'+g.dataset.r)?.scrollIntoView({behavior:'smooth',block:'start'}));
}
function toggleMap(){const M=$('map');if(M.classList.contains('hidden')){$('log').classList.add('hidden');$('report').classList.add('hidden');$('notes').classList.add('hidden');renderMap();M.classList.remove('hidden');keys.clear();}else M.classList.add('hidden');}
$('mapBtn').onclick=toggleMap;
function toggleLog(){$('map').classList.add('hidden');$('report').classList.add('hidden');$('notes').classList.add('hidden');const L=$('log');if(L.classList.contains('hidden')){renderLog();L.classList.remove('hidden');keys.clear();}else L.classList.add('hidden');}
$('logBtn').onclick=toggleLog;

/* ---------- interaction + travel ---------- */
let nearI=null,fading=false;
const readBtn=$('readBtn');
// which interactable (if any) a tap at world point (wx,wy) is aimed at: its sprite body, above the anchor
function tapPick(wx,wy){let best=null,bd=1e9;for(const it of INTER){const dx=wx-it.x,dy=wy-(it.y-34);const d=Math.hypot(dx,dy*.7);if(d<48&&d<bd){bd=d;best=it;}}return best;}
function tryRead(){if(nearI&&!uiOpen())nearI.act();}
readBtn.onclick=tryRead;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='q'&&card.classList.contains('hidden'))toggleLog();if(k==='m'&&card.classList.contains('hidden'))toggleMap();if(k==='n'&&card.classList.contains('hidden'))toggleNotes();
  if(k==='escape'){if(Teach.open_){Teach.close();return;}closeCard();['log','map','notes'].forEach(x=>$(x).classList.add('hidden'));}
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
  for(const L of lights)if(L.node){const s=nodeState(L.node);L.col=s==='done'?[120,230,150]:s==='sealed'?[110,125,190]:s==='frozen'?[140,205,255]:[255,205,120];L.i=s==='sealed'?.45:.85;}
  for(const o of objects)if(o.cache&&!SAVE.caches[o.cache+'#C']&&FX.particles&&Math.hypot(player.x-o.x,player.y-o.y)<380&&R()<dt*5)emit({t:'spark',x:o.x+rand(-12,12),y:o.y-rand(4,22),vx:rand(-6,6),vy:rand(-22,-8),l:0,m:rand(.6,1.2),sz:rand(2,4)});
  // tapped an object from afar: use it once we're close enough
  if(tapTarget?.it&&Math.hypot(player.x-tapTarget.it.x,player.y-tapTarget.it.y)<tapTarget.it.r){const it=tapTarget.it;tapTarget=null;if(!uiOpen())it.act();}
  // nearest interactable
  let best=null,bd=1e9;for(const it of INTER){const d=Math.hypot(player.x-it.x,player.y-it.y);if(d<it.r&&d<bd){bd=d;best=it;}}
  if(best!==nearI){nearI=best;readBtn.classList.toggle('hidden',!best);}
  if(best)readBtn.querySelector('span').textContent=best.label();
}

/* ---------- effects panel ---------- */
const fxPanel=$('fx');
$('fxBtn').onclick=()=>fxPanel.classList.toggle('hidden');
// phone menu: one button that drops down the others; picking an item closes it
{const tb=$('topbtns'),mb=$('menuBtn'),set=o=>{tb.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.textContent=o?'✕ Close':'☰ Menu';};
 mb.onclick=e=>{e.stopPropagation();set(!tb.classList.contains('open'));};
 tb.querySelectorAll('button:not(#menuBtn)').forEach(b=>b.addEventListener('click',()=>set(false)));
 addEventListener('pointerdown',e=>{if(tb.classList.contains('open')&&!tb.contains(e.target))set(false);});}
fxPanel.querySelectorAll('input[data-fx]').forEach(i=>i.onchange=()=>{FX[i.dataset.fx]=i.checked;if(i.dataset.fx==='particles')parts.length=0;});
function syncTodButtons(){document.querySelectorAll('#tod button').forEach(x=>x.classList.toggle('on',x.dataset.t===todKey));}
document.querySelectorAll('#tod button').forEach(b=>b.onclick=()=>{todKey=b.dataset.t;syncTodButtons();persist();});

/* ---------- music controls ---------- */
const musOn=$('musOn'),musVol=$('musVol');
function syncMusic(){musOn.checked=SAVE.music.on;musVol.value=Math.round(SAVE.music.vol*100);Music.set(SAVE.music.on&&!SAVE.muted,SAVE.music.vol);}
musOn.onchange=()=>{SAVE.music.on=musOn.checked;Music.start();syncMusic();persist();};
musVol.oninput=()=>{SAVE.music.vol=musVol.value/100;Music.start();syncMusic();};
musVol.onchange=persist;
const firstGesture=()=>{Music.start();syncMusic();removeEventListener('pointerdown',firstGesture);removeEventListener('keydown',firstGesture);};
addEventListener('pointerdown',firstGesture);addEventListener('keydown',firstGesture);

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
  if(shake>0){shake-=dt;const k=shake*14;cam.x+=rand(-k,k);cam.y+=rand(-k,k);}
  updateParticles(dt,t);
  updateWorldLogic(dt);
  Sfx.tick(dt);
  render(t);
  hintT+=dt;if(hintT>10&&hint.style.opacity!=='0')hint.style.opacity='0';
  fpsAcc+=dt;fpsN++;if(fpsAcc>.5){fpsEl.textContent=`${Math.round(fpsN/fpsAcc)} fps · ${parts.length} particles`;fpsAcc=0;fpsN=0;}
  requestAnimationFrame(frame);
}

/* ---------- boot ---------- */
loadSave();
registerLessons();
loadArt().then(()=>{
initSprites();
applyArt();
resize();
setScene(regionById(SAVE.scene)&&regionUnlocked(SAVE.scene)?SAVE.scene:'hub','start');
// one-time move of older saves to the quieter defaults (music 8%, ambience 10%)
function migrateAudio(){if(SAVE.audioV===2)return false;SAVE.music={...SAVE.music,vol:.08,settled:true};SAVE.sfx={...(SAVE.sfx||{on:true}),vol:.1};SAVE.audioV=2;return true;}
migrateAudio();
syncMusic();
renderHud();
cloudInit();
{const reg=regionById(curScene);banner(reg?reg.name:COURSE.hubName,reg?reg.sub:COURSE.hubSub);}
window.__game={get run(){return run;},Music,openCache,Calc,objs:()=>objects,openLesson,player,cam,FX,SAVE:()=>SAVE,setTod:k=>{todKey=k;},travel,keys,NODES,Stats,openNode,regionDone,openReview,openExam,toggleMap,openDaily:()=>openDaily(),openDesk:()=>openDesk(),toggleNotes:()=>toggleNotes(),quillSay:t=>quillSay(t),dueKeys:()=>dueKeys(),toggleReport:()=>toggleReport(),practiceArea:m=>practiceArea(m),inter:()=>INTER,tap:()=>tapTarget,zoom:()=>ZOOM,Sfx,freezeFx,thawFx,crackFx,openWelcome,Narr:()=>Narr,CLOUD,mergeSaves,cloudPull,cloudPush,persist};
requestAnimationFrame(frame);
});
