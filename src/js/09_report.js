/* ---------- study report: where you're strong, where to focus, and one-tap targeted practice ----------
   Built from SAVE.qs (every answered question: attempts, first-try hits, last three outcomes).
   "Mastery" for an area = average of each answered question's last three outcomes, so recent
   work counts and old mistakes fade. Areas need 3+ answered questions before they're rated. */
const AREAS={
  1:'Regression basics — signs, cause vs. coincidence, reading a coefficient',
  2:'How the best-fit line works, holding factors constant, and R²',
  3:'Building a model step by step, odd data points, and categories (dummies)',
  4:'The ground rules behind regression, and reading residual plots',
  5:'Testing whether an effect is real: t-tests, p-values, confidence ranges, F-tests',
  6:'Cause and effect from experiments, and choosing which variables belong',
  7:'Choosing the right shape: curves, logs, and time delays',
  8:'Overlapping factors the model can’t tell apart (multicollinearity)',
  9:'Errors that carry over from one period to the next (serial correlation)',
  10:'Errors that grow with size (heteroskedasticity) and the tests for it',
};
const modOf=node=>+(/^m(\d+)/.exec(node)||[])[1];
const stoneOf=node=>node.split('#')[0];
function areaQuestions(m){  // every question that belongs to an area: stone challenges, waypoint practice, caches
  const out=[];for(const [id,n] of Object.entries(NODES)){if(modOf(id)!==m||!n.puzzles)continue;n.puzzles.forEach((_,i)=>out.push(id+'|'+i));}
  return out;}
function computeReport(){
  const Q=SAVE.qs||{},areas=[];let calc={n:0,ok:0},con={n:0,ok:0},ms=0;
  for(const [k,q] of Object.entries(Q)){const t=q.c?calc:con;t.n+=q.n;t.ok+=q.ok;ms+=q.ms||0;}
  for(let m=1;m<=10;m++){
    const keys=areaQuestions(m),seen=keys.filter(k=>Q[k]);
    const recent=seen.map(k=>{const h=Q[k].h;return [...h].reduce((s,c)=>s+ +c,0)/h.length;});
    const att=seen.reduce((s,k)=>s+Q[k].n,0),first=seen.reduce((s,k)=>s+Q[k].ok,0);
    const mastery=seen.length>=3?recent.reduce((a,b)=>a+b,0)/recent.length:null;
    const stones=[...new Set(keys.map(k=>stoneOf(k.split('|')[0])))].filter(id=>NODES[id]&&!id.includes('#'));
    const stoneM=stones.map(id=>{const ks=seen.filter(k=>stoneOf(k.split('|')[0])===id);if(ks.length<2)return null;
      return {id,m:ks.reduce((s,k)=>{const h=Q[k].h;return s+[...h].reduce((a,c)=>a+ +c,0)/h.length;},0)/ks.length};}).filter(Boolean).sort((a,b)=>a.m-b.m);
    const region=COURSE.regions.find(r=>r.nodes.some(id=>modOf(id)===m));
    const pinned=(SAVE.missed||[]).filter(x=>modOf(x.node)===m).length;
    areas.push({m,name:AREAS[m],total:keys.length,seen:seen.length,att,first,mastery,weakStone:stoneM[0],region,open:region?regionUnlocked(region.id):true,pinned});
  }
  // what to study next: weakest rated areas first, then open areas you haven't really started
  const rated=areas.filter(a=>a.mastery!==null&&a.mastery<.8).sort((a,b)=>a.mastery-b.mastery);
  const fresh=areas.filter(a=>a.mastery===null).sort((a,b)=>a.m-b.m);
  const focus=[...rated,...fresh].slice(0,3);
  const days=SAVE.days||{},today=new Date();let week=0,streak=0;
  for(let i=0;i<7;i++){const d=new Date(today-i*864e5).toLocaleDateString('en-CA');if(days[d])week++;}
  for(let i=0;i<365;i++){const d=new Date(today-i*864e5).toLocaleDateString('en-CA');if(days[d])streak++;else if(i>0)break;}
  return {areas,focus,calc,con,ms,week,streak,total:SAVE.stats.answered,first:SAVE.stats.first};
}
const pct=v=>Math.round(v*100)+'%';
const lvl=a=>a.mastery===null?(a.seen?'started':'new'):a.mastery>=.8?'strong':a.mastery>=.6?'building':'focus';
const LVL={strong:'Strong',building:'Building',focus:'Focus here',started:'Just started',new:'Not started'};
function renderReport(){
  const R=computeReport(),acc=R.total?R.first/R.total:0,H=SAVE.examHist||[];
  const mins=Math.round(R.ms/60000);
  let h=`<button class="close" id="repClose" aria-label="Close">×</button><div class="kicker">Study report</div><h2>Where you stand, and what to study next</h2>`;
  if(!R.total){h+=`<p class="say">Nothing to report yet. Answer a few questions — at a waypoint, a stone, or the practice final — and this page will show which areas are strong and which need work.</p>`;}
  else{
    h+=`<div class="kpis">
      <div><b>${R.total}</b><span>questions answered</span></div>
      <div><b>${pct(acc)}</b><span>right on the first try</span></div>
      <div><b>${R.calc.n?pct(R.calc.ok/R.calc.n):'—'}</b><span>on calculations</span></div>
      <div><b>${R.con.n?pct(R.con.ok/R.con.n):'—'}</b><span>on concept questions</span></div>
      <div><b>${R.week}/7</b><span>days studied this week${R.streak>1?` · ${R.streak}-day streak`:''}</span></div>
      <div><b>${H.length?`${H[H.length-1].s}/${H[H.length-1].n}`:'—'}</b><span>last practice final${H.length>1?` (was ${H[H.length-2].s})`:''}</span></div></div>`;
    if(R.calc.n>=5&&R.con.n>=5&&Math.abs(R.calc.ok/R.calc.n-R.con.ok/R.con.n)>=.12)
      h+=`<p class="meta">You do noticeably better on ${R.calc.ok/R.calc.n<R.con.ok/R.con.n?'concept questions than calculations — slow down on the arithmetic and use the calculator':'calculations than concept questions — read the lessons’ “why” explanations closely'}.</p>`;
  }
  // today's quest, spaced review, calibration
  {const d=SAVE.daily||{},due=dueKeys().length,ready=dailyReady();
   h+=`<div class="today"><div><b>${ready?'Today’s quest is ready':R.total<3?'Daily quest':'Today’s quest — done ✓'}</b><span>${R.total<3?'Unlocks after your first few questions.':ready?'Five questions picked from what’s due and your weakest areas. Finish it for a daily item.':'Come back tomorrow for a new one.'}${d.streak?` · <b>${d.streak}-day streak</b>`:''}</span></div>${ready?'<button class="go" id="dailyGo">Start</button>':''}</div>`;
   if(due||SAVE.missed.length)h+=`<div class="today"><div><b>Review board: ${SAVE.missed.length} missed · ${due} due for a refresher</b><span>Spaced refreshers come back after 1, 3, 7, 16 and 35 days — the board by the village fire.</span></div></div>`;
   const C=SAVE.cal,sw=Object.entries(SAVE.qs||{}).filter(([k,q])=>q.sw&&NODES[k.split('|')[0]]).map(([k])=>k);
   if(C&&C.s.n+C.u.n>=5)h+=`<div class="today"><div><b>How well you know what you know</b><span>When you said <i>sure</i>: ${C.s.n?pct(C.s.ok/C.s.n):'—'} right (${C.s.n}) · when <i>not sure</i>: ${C.u.n?pct(C.u.ok/C.u.n):'—'} right (${C.u.n}).${sw.length?` <b>${sw.length} question${sw.length>1?'s':''} you were sure about but missed</b> — the riskiest gaps going into an exam.`:''}</span></div>${sw.length?'<button class="go" id="swGo">Practice these</button>':''}</div>`;}
  if(R.focus.length){
    h+=`<h3 class="rh">Focus next</h3><div class="focus">`;
    R.focus.forEach((a,i)=>{const why=a.mastery!==null?`${pct(a.mastery)} right on your recent tries${a.weakStone?` · weakest: ${esc(NODES[a.weakStone.id].title)}`:''}`:a.seen?`only ${a.seen} of ${a.total} questions tried so far`:'not started yet';
      h+=`<div class="fc"><div><b>${i+1}. ${esc(a.name)}</b><span>${why}${a.pinned?` · ${a.pinned} on the review board`:''}</span></div><span class="fb2">${a.weakStone&&TEACH[a.weakStone.id]?`<button class="go ghost" data-tc="${a.weakStone.id}">🎓 Teach me</button>`:''}<button class="go" data-pr="${a.m}">Practice now</button></span></div>`;});
    h+=`</div>`;
  }
  h+=`<h3 class="rh">All areas</h3><div class="areas">`;
  for(const a of R.areas){const L=lvl(a),w=a.mastery!==null?a.mastery:0;
    h+=`<div class="ar ${L}"><div class="at"><span>${esc(a.name)}</span><em>${LVL[L]}${a.mastery!==null?` · ${pct(a.mastery)}${a.seen<6?' (early read)':''}`:''}</em></div>
      <div class="bar"><i style="width:${Math.round(w*100)}%"></i></div>
      <div class="am">${a.seen} of ${a.total} questions tried${a.att?` · ${a.first} of ${a.att} right first time`:''}${!a.open?' · region not reached yet':''} · <button class="lnk" data-pr="${a.m}">practice</button></div></div>`;}
  h+=`</div>`;
  if(H.length>1){const mx=Math.max(...H.map(x=>x.n));h+=`<h3 class="rh">Practice final history</h3><div class="spark">${H.map(x=>`<i title="${x.s}/${x.n}" style="height:${Math.max(6,x.s/mx*100)}%"><span>${x.s}</span></i>`).join('')}</div>`;}
  h+=`<p class="meta">Mastery uses each question’s last three attempts, so improvement shows up quickly. Areas are rated after 3 different questions. ${mins?`About ${mins} min of question time so far.`:''}</p>`;
  const P=$('report');P.innerHTML=h;$('repClose').onclick=()=>P.classList.add('hidden');
  P.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{P.classList.add('hidden');practiceArea(+b.dataset.pr);});
  P.querySelectorAll('[data-tc]').forEach(b=>b.onclick=()=>Teach.open(b.dataset.tc));
  $('dailyGo')&&($('dailyGo').onclick=()=>{P.classList.add('hidden');openDaily();});
  $('swGo')&&($('swGo').onclick=()=>{P.classList.add('hidden');const ks=shuffle(Object.entries(SAVE.qs).filter(([k,q])=>q.sw&&NODES[k.split('|')[0]]).map(([k])=>k)).slice(0,8);
    startSession('Sure — but missed','Calibration practice',ks.map(k=>{const [node,idx]=k.split('|');return {node,idx:+idx};}),res=>{toast(`${res.filter(x=>!x.missed).length} / ${res.length} right this time`);},'focus');});
}
/* six questions from one area: missed and least-practised first, a few fresh ones mixed in */
function practiceArea(m){
  const Q=SAVE.qs||{},keys=areaQuestions(m);  // every area is open for practice, even before its region is reached
  const score=k=>{const q=Q[k];if(!q)return .55+Math.random()*.2;const h=q.h;return [...h].reduce((s,c)=>s+ +c,0)/h.length+Math.random()*.25;};
  const pickd=keys.map(k=>[k,score(k)]).sort((a,b)=>a[1]-b[1]).slice(0,6).map(x=>x[0]);
  if(!pickd.length){toast('Nothing to practice in that area yet.');return;}
  const items=shuffle(pickd).map(k=>{const [node,idx]=k.split('|');return {node,idx:+idx};});
  startSession(`Focused practice`,AREAS[m],items,res=>{const ok=res.filter(x=>!x.missed).length;
    toast(`Focused practice · ${ok} / ${res.length} on the first try`,3200);setTimeout(()=>{renderReport();$('report').classList.remove('hidden');},400);},'focus');
}
function toggleReport(){const P=$('report');if(P.classList.contains('hidden')){$('log').classList.add('hidden');$('map').classList.add('hidden');$('notes').classList.add('hidden');renderReport();P.classList.remove('hidden');keys.clear();}else P.classList.add('hidden');}
$('repBtn').onclick=toggleReport;
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='p'&&card.classList.contains('hidden')&&!(e.target instanceof HTMLInputElement))toggleReport();if(e.key==='Escape')$('report').classList.add('hidden');});
