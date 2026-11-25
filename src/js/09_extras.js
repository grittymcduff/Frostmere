/* ==========================================================================
   Study extras: field notes (a formula & rules sheet that fills in as you
   learn), the daily quest, Quill's text reactions, chimes, and text size.
   ========================================================================== */

/* ---------- field notes: one card per stone, unlocked by its first waypoint or by restoring it ---------- */
var NOTES=[
 ['m1-signs','Signs come from theory','Decide the <b>expected sign</b> of every coefficient <i>before</i> estimating. Theory gives direction; data give size. Substitutes (rival’s price) → +, own price → −, income → + for normal goods.'],
 ['m1-cross','Correlation is not cause','Before reading a coefficient causally, rule out: a <b>third factor</b> driving both, <b>reverse causation</b>, and coincidence. Only a <b>design</b> (e.g. random assignment) earns the word “causes”.'],
 ['m1-magic','Prediction and residual','<div class="fx">Ŷ = b₀ + b₁X &nbsp;·&nbsp; residual e = Y − Ŷ</div>Negative residual → the model <b>over</b>-predicted; positive → under-predicted. The error ε is unobservable; the residual e is what you can compute.'],
 ['m1-units','Read coefficients in units','“A one-<b>unit</b> rise in X is associated with b₁ <b>units</b> of Y, holding the others constant.” Rescaling X changes the number, not the relationship. The intercept only means something if X = 0 is plausible and near the data.'],
 ['m1-ledger','Reading Excel output — in order','1 · signs &amp; units → 2 · size → 3 · precision (SE, t, p, CI) → 4 · fit (R², adj. R²) &amp; residuals → 5 · is the whole specification plausible?'],
 ['m2-ols','Least squares','<div class="fx">OLS minimizes Σe² &nbsp;·&nbsp; R² = SSR/SST = 1 − SSE/SST</div>Squaring stops misses cancelling and weights big misses more. With an intercept, residuals sum to zero.'],
 ['m2-andy','Holding other factors constant','In Y = b₀ + b₁X₁ + b₂X₂, b₁ is X₁’s association with Y <b>with X₂ held fixed</b>. A one-variable model can mix in drivers that move with X₁.'],
 ['m2-fit','R² versus adjusted R²','<div class="fx">adj. R² = 1 − (1 − R²)(n − 1)/(n − k − 1)</div>R² never falls when you add a variable; adjusted R² can. Only compare R² across models with the <b>same Y</b>. High R² ≠ causation.'],
 ['m3-design','Six steps of applied regression','1 · question &amp; mechanism → 2 · variables &amp; expected signs → 3 · data → 4 · estimate → 5 · evaluate (signs, size, precision, residuals) → 6 · document. <b>Investigate</b> unusual observations; drop only proven errors.'],
 ['m3-dummy','Dummy variables','A 0/1 dummy shifts the intercept: its coefficient = difference from the <b>base group</b>, others held constant. With <b>k</b> categories use <b>k − 1</b> dummies — all k plus an intercept is the <b>dummy-variable trap</b>.'],
 ['m4-seven','The seven classical assumptions','1 linear in coefficients · 2 zero-mean error · 3 no endogeneity · 4 no serial correlation · 5 homoskedasticity · 6 no perfect multicollinearity · 7 normal errors (optional). 1–6 → OLS is <b>BLUE</b>. Breaking 3 → <b>bias</b>; breaking 4 or 5 → unreliable <b>standard errors</b>.'],
 ['m4-plots','Residual plots &amp; outliers','<div class="fx">standardized residual = e / s &nbsp;·&nbsp; flag |value| &gt; 2</div>Even band = good. Spray / funnel / bow-tie = heteroskedasticity. A <b>curve</b> = wrong form or missing driver. Biased = aimed wrong; imprecise = aimed right but wide.'],
 ['m5-tests','Setting up a test','Theory’s prediction goes in <b>Hₐ</b>. One-tailed if theory gives a direction, two-tailed if not. <b>Type I</b> = reject a true H₀ (false alarm, set by α); <b>Type II</b> = miss a real effect. Weigh which costs more.'],
 ['m5-three','t, p, confidence interval, F','<div class="fx">t = b / SE &nbsp;·&nbsp; CI = b ± t<sub>c</sub>·SE &nbsp;·&nbsp; F = (SSR/k) / (SSE/(n − k − 1))</div>Reject H₀ if p ≤ α. F tests all slopes jointly. <b>Significant ≠ important</b>, and significant ≠ causal.'],
 ['m6-trial','Experiments and causation','Random assignment balances everything except the treatment, so the comparison is a credible counterfactual. With one 0/1 treatment dummy: <b>b₀ = control mean</b>, <b>b₁ = treatment − control</b>.'],
 ['m6-omit','Omitted-variable bias','<div class="fx">bias in b₁ = β₂ · α₁</div>Needs both: the omitted variable affects Y (β₂ ≠ 0) <b>and</b> moves with X₁ (α₁ ≠ 0). Same signs → overestimate. Omitting something relevant → <b>bias</b>; adding something irrelevant → <b>noise</b>.'],
 ['m7-form','Functional forms','<div class="fx">linear: slope b₁ · elasticity b₁X̄/Ȳ<br>ln Y on ln X: b₁ = elasticity<br>Y on ln X: slope b₁/X<br>ln Y on X: slope b₁Y · elasticity b₁X<br>quadratic: slope b₁ + 2b₂X · peak X* = −b₁/(2b₂)</div>Pick the shape from the mechanism. Don’t extrapolate past the data.'],
 ['m8-multi','Multicollinearity','<div class="fx">VIF = 1 / (1 − R²<sub>aux</sub>) &nbsp;·&nbsp; &gt;5 warning, &gt;10 serious</div>Unbiased but <b>imprecise</b>: bigger SEs, unstable signs. Classic sign: high R² + significant F, weak t-tests. Often do nothing; drop a variable only if theory says it’s redundant.'],
 ['m9-serial','Serial correlation &amp; Durbin–Watson','<div class="fx">DW = Σ(eₜ − eₜ₋₁)² / Σeₜ² &nbsp;·&nbsp; ≈0 positive · ≈2 none · ≈4 negative</div>DW &lt; dL reject · DW &gt; dU don’t reject · between = inconclusive. Invalid with a lagged Y. SEs understated → p-values too optimistic. Check trend/seasonality/form first.'],
 ['m10-hetero','Heteroskedasticity tests','<div class="fx">LM = n × R²<sub>aux</sub> ~ χ²(df) &nbsp;·&nbsp; 5% critical: df 2 → 5.99, df 5 → 11.07</div>Breusch–Pagan: e² on the Xs (narrow). White: adds squares &amp; cross-products (wide). Coefficients unbiased, SEs wrong. Fix the form first, then robust SEs.'],
];
const noteOpen=id=>!!(SAVE.done[id]||SAVE.lessons[id+'#L1']||SAVE.lessons[id+'#L2']);
function checkNotes(quiet){
  if(!NOTES||!SAVE.seen)return;const seen=SAVE.notesSeen||(SAVE.notesSeen=[]),fresh=NOTES.filter(n=>noteOpen(n[0])&&!seen.includes(n[0]));
  if(!fresh.length)return;fresh.forEach(n=>seen.push(n[0]));
  if(!quiet)setTimeout(()=>toast(`New field note: <b>${fresh.map(n=>n[1]).join('</b>, <b>')}</b> — open <b>Notes</b> to read it.`,3600),3300);
}
let notesAll=false;
function renderNotes(){
  const open=NOTES.filter(n=>noteOpen(n[0])).length;
  let h=`<button class="close" id="notesClose" aria-label="Close">×</button><div class="kicker">Field notes</div><h2>Formulas and rules of thumb</h2>
    <p class="meta">${open} of ${NOTES.length} collected. A note unlocks when you finish a stone’s first waypoint or restore the stone. <button class="lnk" id="notesAll">${notesAll?'Show only collected notes':'Show all (for exam review)'}</button></p>`;
  for(let m=1;m<=10;m++){const ns=NOTES.filter(n=>+/^m(\d+)/.exec(n[0])[1]===m);
    h+=`<section class="nsec"><h3>${esc(AREAS[m])}</h3>`;
    for(const [id,t,body] of ns){const ok=notesAll||noteOpen(id);
      h+=ok?`<div class="note"><b>${t}</b><div>${body}</div></div>`:`<div class="note locked"><b>${t}</b><div>Locked — finish a waypoint at <i>${esc(NODES[id]?.title||'')}</i>.</div></div>`;}
    h+=`</section>`;}
  const P=$('notes');P.innerHTML=h;$('notesClose').onclick=()=>P.classList.add('hidden');$('notesAll').onclick=()=>{notesAll=!notesAll;renderNotes();};
}
function toggleNotes(){const P=$('notes');if(P.classList.contains('hidden')){['log','map','report'].forEach(x=>$(x).classList.add('hidden'));renderNotes();P.classList.remove('hidden');keys.clear();}else P.classList.add('hidden');}
$('notesBtn').onclick=toggleNotes;

/* ---------- daily quest: five questions built around what's due and what's weak ---------- */
const today=()=>new Date().toLocaleDateString('en-CA');
function dailyReady(){return !!SAVE.qs&&Object.keys(SAVE.qs).length>=3&&SAVE.daily?.last!==today();}
function openDaily(){
  const Q=SAVE.qs||{},picked=[],add=k=>{if(k&&!picked.includes(k)&&NODES[k.split('|')[0]]&&!NODES[k.split('|')[0]].explain)picked.push(k);};
  dueKeys().slice(0,2).forEach(add);
  const R=computeReport(),weak=R.areas.filter(a=>a.mastery!==null).sort((a,b)=>a.mastery-b.mastery).slice(0,2);
  for(const a of weak){const ks=areaQuestions(a.m).filter(k=>!picked.includes(k)).sort((x,y)=>((Q[x]?[...Q[x].h].reduce((s,c)=>s+ +c,0)/Q[x].h.length:.6)-(Q[y]?[...Q[y].h].reduce((s,c)=>s+ +c,0)/Q[y].h.length:.6))+Math.random()*.3-.15);add(ks[0]);}
  const unseen=shuffle(Object.keys(NODES).filter(id=>/^m\d+-[a-z]+$/.test(id)&&!NODES[id].explain&&NODES[id].puzzles).flatMap(id=>NODES[id].puzzles.map((_,i)=>id+'|'+i)).filter(k=>!Q[k]));
  while(picked.length<5&&unseen.length)add(unseen.pop());
  const rest=shuffle(Object.keys(Q));while(picked.length<5&&rest.length)add(rest.pop());
  const items=shuffle(picked).map(k=>{const [node,idx]=k.split('|');return {node,idx:+idx};});
  startSession('Today’s quest','Daily quest · five questions',items,res=>{
    const ok=res.filter(x=>!x.missed).length,d=SAVE.daily||{streak:0},y=new Date(Date.now()-864e5).toLocaleDateString('en-CA');
    if(d.last!==today()){d.streak=d.last===y?d.streak+1:1;d.last=today();SAVE.daily=d;
      const it=pick(['lens','feather','charm']);SAVE.inv[it]=(SAVE.inv[it]||0)+1;persist();chime('cache');
      toast(`Daily quest done · ${ok} / ${res.length} first try · <b>${d.streak}-day streak</b> · reward: a ${ITEM[it].n}`,4200);
      if(d.streak===3||d.streak===7||d.streak===14)quillSay(`${d.streak} days in a row. That rhythm — a little, often — is exactly how this material sticks.`);}
    else toast(`Extra practice · ${ok} / ${res.length} on the first try`);
    renderHud();},'focus');
}

/* ---------- Quill's text-only reactions (shown in the narration bar) ---------- */
let sayT=0;
function quillSay(text){
  const bar=$('narr');if(typeof Narr!=='undefined'&&Narr.playing)return;
  bar.querySelector('p').textContent=text;bar.classList.add('bark');bar.classList.remove('hidden','fadeIn');void bar.offsetWidth;bar.classList.add('fadeIn');
  clearTimeout(sayT);sayT=setTimeout(()=>{bar.classList.add('hidden');bar.classList.remove('bark');},Math.max(5500,text.split(' ').length*380));
}
function quillOnce(key,text){if(SAVE.seen[key])return;SAVE.seen[key]=1;persist();setTimeout(()=>quillSay(text),700);}

/* ---------- chimes: small synthesized cues for big moments ---------- */
let chimeAC=null;
function chime(kind){
  const s=SAVE.sfx||{on:true,vol:.1};if(SAVE.muted||!s.on)return;
  try{chimeAC=chimeAC||new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  const ac=chimeAC,t0=ac.currentTime+.02,out=ac.createGain();out.gain.value=Math.min(.5,Math.max(.12,s.vol*3.5));out.connect(ac.destination);
  const hz=n=>440*2**((n-69)/12);
  const SEQ={restore:[72,76,79,84],region:[67,72,76,79,84,88],thaw:[79,83,86],cache:[93,100,105],freeze:[88,83,79,76]};
  (SEQ[kind]||SEQ.restore).forEach((n,i)=>{const o=ac.createOscillator(),g=ac.createGain(),st=t0+i*(kind==='freeze'?.07:.11);
    o.type=kind==='freeze'?'sine':'triangle';o.frequency.value=hz(n);g.gain.setValueAtTime(0,st);g.gain.linearRampToValueAtTime(.35,st+.01);g.gain.exponentialRampToValueAtTime(.001,st+(kind==='region'?1.6:1.1));
    o.connect(g).connect(out);o.start(st);o.stop(st+1.7);});
  if(kind==='freeze'){const len=ac.sampleRate*.5,b=ac.createBuffer(1,len,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len)**2;
    const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();src.buffer=b;f.type='highpass';f.frequency.value=3000;g.gain.value=.25;src.connect(f).connect(g).connect(out);src.start(t0);}
}

/* ---------- text size ---------- */
function applyTextSize(){const v=SAVE.textSize||1;document.documentElement.style.setProperty('--ts',v);const sel=$('tsSel');if(sel)sel.value=String(v);}
$('tsSel').onchange=e=>{SAVE.textSize=+e.target.value;applyTextSize();persist();};
applyTextSize();
checkNotes(true);
$('confOn').checked=SAVE.confOn!==false;$('confOn').onchange=e=>{SAVE.confOn=e.target.checked;persist();};

/* ---------- interpretation desk: three "explain it" prompts, unseen and weakest areas first ---------- */
function openDesk(){
  const Q=SAVE.qs||{},all=Object.keys(NODES).filter(id=>NODES[id].explain).flatMap(id=>NODES[id].puzzles.map((_,i)=>id+'|'+i));
  const sc=k=>Q[k]?[...Q[k].h].reduce((s,c)=>s+ +c,0)/Q[k].h.length+Math.random()*.3:Math.random()*.4;
  const pickd=all.map(k=>[k,sc(k)]).sort((a,b)=>a[1]-b[1]).slice(0,3).map(x=>x[0]);
  showCard(`<div class="kicker">Village · interpretation desk</div><h2>Explain it in your own words</h2>
    <p class="say">Exams don’t just ask you to pick an answer — they ask you to <b>interpret</b> one. You’ll get three short prompts. Write two to four sentences for each, then compare with a model answer and tick the key points you covered. Covering two-thirds of them counts as a pass.</p>
    <p class="meta">Prompts you haven’t tried, and areas where you’re weakest, come first. Ten areas, one prompt each.</p><div class="acts"></div>`);
  const b=btn('Start','primary');card.querySelector('.acts').appendChild(b);b.focus();
  b.onclick=()=>startSession('Interpretation desk','Explain it',pickd.map(k=>{const [node,idx]=k.split('|');return {node,idx:+idx};}),res=>{
    toast(`Interpretation desk · ${res.filter(x=>!x.missed).length} / ${res.length} covered the key points`);quillOnce('barkDesk','Writing it out is harder than picking it — which is exactly why it works.');},'focus');
}

/* ---------- "what's new" greeting for returning players: closes itself after 15 s ---------- */
const WHATS_NEW={v:3,items:[
  ['🎓','Teach me','Stuck on a stone? Tap “Teach me” for a one-minute refresher from Warden Quill — on every stone card, inside questions, on the map and in your progress report.'],
  ['✓','Accuracy pass','Every question was checked against the course. A few numbers, labels and generated charts were tightened so the right answer is always clear.'],
  ['❄','Crystal Reach is open','Modules 7–10: functional form, multicollinearity, serial correlation and heteroskedasticity — four new stones.'],
  ['⏱','Practice final, with exam conditions','20 questions from all ten modules. Try it with one attempt per question and a countdown — then review every miss.'],
  ['📈','Progress report','Strength by area, what to focus on next, and one-tap practice for your weakest topics. Press P.'],
  ['↻','Spaced review','Questions you got right come back after 1, 3, 7, 16 and 35 days on the review board, so they stick.'],
  ['✎','Interpretation desk','Explain a result in your own words, then compare with a model answer. Left of the south path.'],
  ['📜','Field notes','Formulas and rules of thumb collect as you finish waypoints. Press N.'],
  ['☀','Daily quest','Five questions a day from what’s due and what’s weak. Keep the streak for a free item.'],
  ['☁','Play on any device','Sign in with Google to keep your progress everywhere. Plus a map (M), a “how sure?” check, chimes and text size.'],
]};
let wnQueue=[];
const whatsNewOpen=()=>!$('whatsnew').classList.contains('hidden');
function afterWhatsNew(fn){if(whatsNewOpen())wnQueue.push(fn);else fn();}
function showWhatsNew(){
  const W=$('whatsnew');SAVE.whatsNew=WHATS_NEW.v;persist();
  W.innerHTML=`<button class="close" id="wnClose" aria-label="Close">×</button><div class="kicker">Welcome back</div><h2>What’s new in Frostmere</h2>
    <div class="wn">${WHATS_NEW.items.map(([ic,t,d])=>`<div class="wi"><i>${ic}</i><div><b>${t}</b><span>${d}</span></div></div>`).join('')}</div>
    <div class="wnf"><div class="wnbar"><i></i></div><button class="go" id="wnOk">Let’s go</button></div>`;
  W.classList.remove('hidden','out');keys.clear();
  let left=15000,last=Date.now(),hover=false,done=false;
  const close=()=>{if(done)return;done=true;clearInterval(tm);W.classList.add('out');setTimeout(()=>{W.classList.add('hidden');W.classList.remove('out');const q=wnQueue;wnQueue=[];q.forEach(f=>f());},600);};
  const bar=W.querySelector('.wnbar i');
  const tm=setInterval(()=>{const now=Date.now();if(!hover)left-=now-last;last=now;bar.style.width=Math.max(0,left/150)+'%';if(left<=0)close();},100);
  W.onmouseenter=()=>hover=true;W.onmouseleave=()=>hover=false;   // reading with the mouse over it pauses the countdown
  $('wnClose').onclick=close;$('wnOk').onclick=close;
  addEventListener('keydown',function k(e){if(e.key==='Escape'||e.key==='Enter'){close();removeEventListener('keydown',k);}});
}
// returning players see it on load; brand-new players get Quill's intro instead (and skip this release's list)
if(!SAVE.seen.intro)SAVE.whatsNew=WHATS_NEW.v;
else if((SAVE.whatsNew||0)<WHATS_NEW.v)setTimeout(showWhatsNew,1200);
