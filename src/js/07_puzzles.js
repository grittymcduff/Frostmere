/* ---------- statistics: OLS with Excel-style output ---------- */
const Stats=(()=>{
  function lgamma(x){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.1208650973866179e-2,-.5395239384953e-5];
    let y=x,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(const v of c)s+=v/++y;return -t+Math.log(2.5066282746310005*s/x);}
  function betacf(a,b,x){const MAXIT=200,EPS=3e-14,FPMIN=1e-300;let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<FPMIN)d=FPMIN;d=1/d;let h=d;
    for(let m=1;m<=MAXIT;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;h*=d*c;
      aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<EPS)break;}return h;}
  function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x));
    return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b;}
  const tcdf=(t,v)=>{const p=.5*ibeta(v/(v+t*t),v/2,.5);return t>0?1-p:p;};
  const tinv=(p,v)=>{let lo=-60,hi=60;for(let i=0;i<120;i++){const m=(lo+hi)/2;if(tcdf(m,v)<p)lo=m;else hi=m;}return (lo+hi)/2;};
  const fsf=(F,d1,d2)=>ibeta(d2/(d2+d1*F),d2/2,d1/2);
  const p2=(t,v)=>ibeta(v/(v+t*t),v/2,.5); // two-sided p, computed directly (no cancellation)
  function inv(A){const n=A.length,M=A.map((r,i)=>[...r,...r.map((_,j)=>i===j?1:0)]);
    for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;[M[i],M[p]]=[M[p],M[i]];
      const d=M[i][i];for(let j=0;j<2*n;j++)M[i][j]/=d;for(let r=0;r<n;r++)if(r!==i){const f=M[r][i];for(let j=0;j<2*n;j++)M[r][j]-=f*M[i][j];}}
    return M.map(r=>r.slice(n));}
  /** X: array of rows (no intercept column), y: array. Returns Excel-like regression summary. */
  function ols(X,y,names){
    const n=y.length,rows=X.map(r=>[1,...(Array.isArray(r)?r:[r])]),k=rows[0].length;
    const XtX=Array.from({length:k},(_,i)=>Array.from({length:k},(_,j)=>rows.reduce((s,r)=>s+r[i]*r[j],0)));
    const Xty=Array.from({length:k},(_,i)=>rows.reduce((s,r,t)=>s+r[i]*y[t],0));
    const XI=inv(XtX),b=XI.map(r=>r.reduce((s,v,j)=>s+v*Xty[j],0));
    const fit=rows.map(r=>r.reduce((s,v,j)=>s+v*b[j],0)),res=y.map((v,i)=>v-fit[i]);
    const ybar=y.reduce((a,c)=>a+c,0)/n,SST=y.reduce((s,v)=>s+(v-ybar)**2,0),SSE=res.reduce((s,v)=>s+v*v,0),SSR=SST-SSE;
    const df=n-k,s2=SSE/df,tc=tinv(.975,df);
    const coef=b.map((v,j)=>{const se=Math.sqrt(s2*XI[j][j]),t=v/se;return {name:j?(names?.[j-1]||'X'+j):'Intercept',b:v,se,t,p:p2(t,df),lo:v-tc*se,hi:v+tc*se};});
    const R2=SSR/SST,F=(SSR/(k-1))/s2;
    return {n,k,df,b,coef,fit,res,SST,SSE,SSR,R2,adjR2:1-(1-R2)*(n-1)/df,multR:Math.sqrt(R2),se:Math.sqrt(s2),F,pF:fsf(F,k-1,df),
      predict:x=>[1,...(Array.isArray(x)?x:[x])].reduce((s,v,j)=>s+v*b[j],0)};
  }
  return {ols,tcdf,tinv,fsf,p2};
})();

/* seeded helpers for generated datasets */
function rngGauss(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v);}
const rr=(r,a,b)=>a+r()*(b-a);
const ri=(r,a,b)=>Math.floor(rr(r,a,b+1));
const round=(v,d=2)=>Math.round(v*10**d)/10**d;
const money=(v,d=2)=>(v<0?'−$':'$')+Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtNum=(v,d=2)=>(v<0?'−':'')+Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});

/* ---------- exhibits (rendered as HTML/SVG inside the puzzle card) ---------- */
const Exhibit={
  xl(v){if(!isFinite(v))return '#N/A';const a=Math.abs(v);if(a!==0&&(a<1e-4||a>=1e9))return v.toExponential(2).replace('e','E').replace('E+','E+').replace(/E-(\d)$/,'E-0$1');
    return String(Number(v.toPrecision(a>=1000?8:6)));},
  excel(res,yName){
    const x=Exhibit.xl,row=(c)=>`<tr>${c.map((v,i)=>`<td${i?' class="n"':''}>${v}</td>`).join('')}</tr>`;
    return `<div class="xl"><div class="xlh">SUMMARY OUTPUT <span>· dependent variable: ${yName}</span></div>
<table><tr><th colspan="2">Regression Statistics</th></tr>
${row(['Multiple R',x(res.multR)])}${row(['R Square',x(res.R2)])}${row(['Adjusted R Square',x(res.adjR2)])}${row(['Standard Error',x(res.se)])}${row(['Observations',res.n])}</table>
<table><tr><th>ANOVA</th><th class="n">df</th><th class="n">SS</th><th class="n">MS</th><th class="n">F</th><th class="n">Significance F</th></tr>
${row(['Regression',res.k-1,x(res.SSR),x(res.SSR/(res.k-1)),x(res.F),x(res.pF)])}${row(['Residual',res.df,x(res.SSE),x(res.SSE/res.df),'',''])}${row(['Total',res.n-1,x(res.SST),'','',''])}</table>
<div class="scroll"><table><tr><th></th><th class="n">Coefficients</th><th class="n">Standard Error</th><th class="n">t Stat</th><th class="n">P-value</th><th class="n">Lower 95%</th><th class="n">Upper 95%</th></tr>
${res.coef.map(c=>row([c.name,x(c.b),x(c.se),x(c.t),x(c.p),x(c.lo),x(c.hi)])).join('')}</table></div></div>`;
  },
  scatter(xs,ys,o={}){
    const w=340,h=210,m={l:44,r:12,t:12,b:34};
    const nice=(a,b)=>{const raw=(b-a)/4,mag=10**Math.floor(Math.log10(raw)),st=[1,2,2.5,5,10].map(k=>k*mag).find(k=>k>=raw);return [Math.floor(a/st)*st,Math.ceil(b/st)*st,st];};
    const [xmin,xmax,xs_]=nice(o.xmin??Math.min(...xs),o.xmax??Math.max(...xs)),[ymin,ymax,ys_]=nice(o.ymin??Math.min(...ys),o.ymax??Math.max(...ys));
    const px=x=>m.l+(x-xmin)/(xmax-xmin)*(w-m.l-m.r),py=y=>h-m.b-(y-ymin)/(ymax-ymin)*(h-m.t-m.b);
    const ticks=(a,b,st)=>{const o=[];for(let v=a;v<=b+st*1e-6;v+=st)o.push(v);return o;};
    let svg=`<svg viewBox="0 0 ${w} ${h}" class="sc" role="img" aria-label="${o.title||'scatter plot'}">`;
    for(const t of ticks(ymin,ymax,ys_))svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${py(t)}" y2="${py(t)}" class="gl"/><text x="${m.l-6}" y="${py(t)+4}" text-anchor="end">${round(t,2)}</text>`;
    for(const t of ticks(xmin,xmax,xs_))svg+=`<text x="${px(t)}" y="${h-m.b+14}" text-anchor="middle">${round(t,2)}</text>`;
    if(o.connect)svg+=`<polyline class="cn" fill="none" points="${xs.map((x,i)=>px(x)+','+py(ys[i])).join(' ')}"/>`;
    xs.forEach((x,i)=>svg+=`<circle cx="${px(x)}" cy="${py(ys[i])}" r="3.4" class="pt"/>`);
    if(o.hline!==undefined)svg+=`<line x1="${m.l}" x2="${w-m.r}" y1="${py(o.hline)}" y2="${py(o.hline)}" class="fit" stroke-dasharray="5 4"/>`;
    if(o.line){const [b0,b1]=o.line;svg+=`<line x1="${px(xmin)}" y1="${py(b0+b1*xmin)}" x2="${px(xmax)}" y2="${py(b0+b1*xmax)}" class="fit"/>`;}
    svg+=`<text x="${(w+m.l)/2}" y="${h-4}" text-anchor="middle" class="al">${o.xl||'X'}</text><text x="12" y="${(h-m.b)/2}" text-anchor="middle" class="al" transform="rotate(-90 12 ${(h-m.b)/2})">${o.yl||'Y'}</text>`;
    if(o.eq)svg+=`<text x="${w-m.r-4}" y="${m.t+14}" text-anchor="end" class="eq">${o.eq}</text>`;
    return `<div class="fig">${svg}</svg></div>`;
  },
  table(head,rows){return `<div class="scroll"><table class="tb"><tr>${head.map((h,i)=>`<th${i?' class="n"':''}>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((v,i)=>`<td${i?' class="n"':''}>${v}</td>`).join('')}</tr>`).join('')}</table></div>`;},
  eq(s){return `<div class="eqbox">${s}</div>`;},
};

/* ---------- puzzle runner ---------- */
const NODES={};           // filled by content files
const card=document.getElementById('card');
let run=null;             // active puzzle session
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function shuffle(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function showCard(html){card.innerHTML=`<button class="close" aria-label="Close">×</button>${html}`;card.classList.remove('hidden');card.scrollTop=0;
  card.querySelector('.close').onclick=closeCard;keys.clear();tapTarget=null;}
function closeCard(){card.classList.add('hidden');if(run)clearInterval(run.qTimer);run=null;calcEl.classList.add('hidden');}

function instantiate(p,seed){
  if(!p.make)return {...p};
  return {...p,...p.make(mulberry(seed)),make:undefined,_seed:seed};
}

const fmtClock=ms=>{const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
function startSession(title,kicker,items,onDone,mode='practice'){
  // items: [{node, idx}] ; each instantiated with a fresh seed
  run={title,kicker,items:items.map(it=>({...it,p:instantiate(NODES[it.node].puzzles[it.idx],(Math.random()*1e9)|0),missed:false})),i:0,onDone,mode,t0:Date.now()};
  renderPuzzle();
}
function header(){const n=run.items.length,i=run.i;
  const EC=run.mode==='examc';
  return `<div class="kicker">${esc(run.kicker)}${run.mode==='exam'?` · question ${i+1} of ${n} <span class="clock" id="exClock">${fmtClock(Date.now()-run.t0)}</span>`:EC?` · question ${i+1} of ${n} <span class="clock" id="qClock"></span>`:''}</div><h2>${esc(run.title)}</h2>
  <div class="prog">${run.items.map((it,k)=>`<i class="${k<i?(EC?'dn':it.missed?'m':'ok'):k===i?'cur':''}"></i>`).join('')}</div>`;}
function renderPuzzle(){
  const it=run.items[run.i],p=it.p;it.t0=it.t0||Date.now();
  const askConf=SAVE.confOn!==false&&p.type!=='explain';
  let body=`${header()}${p.exhibit||''}<div class="ptools" id="ptools"></div><p class="q">${p.q}</p>${askConf?`<div class="conf" id="conf"><span>How sure are you?</span><button data-c="1">Sure</button><button data-c="0">Not sure</button></div>`:''}<div id="pz"></div><div id="fb" class="fb"></div><div class="acts" id="acts"></div>`;
  showCard(body);
  const pz=card.querySelector('#pz'),acts=card.querySelector('#acts');
  card.querySelectorAll('#conf button').forEach(b=>b.onclick=()=>{const v=+b.dataset.c;it.conf=it.conf===v?undefined:v;card.querySelectorAll('#conf button').forEach(x=>x.classList.toggle('on',+x.dataset.c===it.conf));});
  // exam conditions: one attempt, no feedback, a countdown per question
  const EC=run.mode==='examc';
  const commit=ok=>{if(it.done)return;it.done=true;clearInterval(run.qTimer);it.missed=!ok;stat(ok?1:0,it);if(!ok)noteMiss(it);next();};
  if(EC){const lim=(p.type==='num'?150:p.type==='mc'?75:120)*1000,end=Date.now()+lim;clearInterval(run.qTimer);
    const tick=()=>{const left=end-Date.now(),c=card.querySelector('#qClock');if(c){c.textContent='⏱ '+fmtClock(Math.max(0,left));c.classList.toggle('low',left<15000);}if(left<=0){it.timedOut=true;commit(false);}};
    tick();run.qTimer=setInterval(tick,250);}
  const fail=EC?()=>commit(false):(msg)=>{
    if(it.charm){it.charm=false;feedback('no','<b>Your Warding Charm absorbed that miss</b> — it won’t count. '+(msg||p.hint||'Try again.'));drawTools();return;}
    if(!it.missed){it.missed=true;noteMiss(it);}feedback('no',msg||p.hint||'Not quite — try again.');drawTools();};
  const drawTools=()=>{
    const tb=card.querySelector('#ptools');if(!tb)return;const solved=card.querySelector('#fb').classList.contains('ok');
    let h=`<button class="tool" data-t="calc">Calculator</button>`;
    if(!['exam','examc'].includes(run.mode)&&TEACH[stoneOfNode(it.node)])h+=`<button class="tool" data-t="teach">🎓 Teach me</button>`;
    if(run.mode==='stone'&&!solved){
      const inv=SAVE.inv,hasHint=!!p.hint;
      if(p.type==='mc')h+=`<button class="tool item" data-t="lens" ${inv.lens&&!it.lens?'':'disabled'}>Lens <i>${inv.lens}</i></button>`;
      if(p.type!=='mc')h+=`<button class="tool item" data-t="feather" ${inv.feather&&!it.feather&&hasHint?'':'disabled'} title="${hasHint?'Reveal the first step':'No first step to reveal here'}">Feather <i>${inv.feather}</i></button>`;
      h+=`<button class="tool item${it.charm?' armed':''}" data-t="charm" ${inv.charm&&!it.charm&&!it.missed?'':'disabled'}>${it.charm?'Charm armed':'Warding Charm'} <i>${inv.charm}</i></button>`;
    }
    tb.innerHTML=h;
    tb.querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=b.dataset.t;
      if(k==='calc'){toggleCalc();return;}
      if(k==='teach'){Teach.open(stoneOfNode(it.node));return;}
      if(!SAVE.inv[k])return;SAVE.inv[k]--;persist();
      if(k==='lens'){const wrong=[...pz.querySelectorAll('button.opt')].filter(x=>!x.disabled&&x.dataset.k!=String(p.a));const g=pick(wrong);if(g){g.disabled=true;g.classList.add('gone');}it.lens=true;feedback('', '<b>Lens:</b> one wrong answer struck out.');}
      if(k==='feather'){it.feather=true;feedback('', `<b>Feather — first step:</b> ${p.hint}`);}
      if(k==='charm'){it.charm=true;feedback('', '<b>Warding Charm armed:</b> your next miss on this question won’t count.');}
      drawTools();});
  };
  const pass=EC?()=>commit(true):()=>{feedback('ok',p.why||'Correct.');drawTools();acts.innerHTML='';const b=btn(run.i<run.items.length-1?'Continue':'Finish','primary');acts.appendChild(b);b.onclick=next;b.focus();stat(it.missed?0:1,it);};
  if(p.type==='mc'){
    const order=shuffle(p.opts.map((o,k)=>k));
    order.forEach(k=>{const b=btn(p.opts[k],'opt');b.dataset.k=k;pz.appendChild(b);b.onclick=()=>{if(b.disabled)return;
      if(k===p.a){b.classList.add('ok');pz.querySelectorAll('button').forEach(x=>x.disabled=true);pass();}
      else{b.classList.add('no');b.disabled=true;fail(p.hints?.[k]);}};});
  }else if(p.type==='num'){
    pz.innerHTML=`<div class="numrow">${p.pre?`<span>${p.pre}</span>`:''}<input id="numIn" inputmode="decimal" autocomplete="off" aria-label="Your answer">${p.unit?`<span>${p.unit}</span>`:''}</div>`;
    const inp=pz.querySelector('#numIn');let tries=0;
    const chk=btn('Check','primary');acts.appendChild(chk);
    const go=()=>{const v=parseFloat(inp.value.replace(/[,$\s]/g,'').replace('−','-'));if(!isFinite(v)){feedback('no','Enter a number.');return;}
      if(Math.abs(v-p.a)<=(p.tol??.01)){inp.disabled=true;pass();}
      else{tries++;fail((p.hint||'Not quite — check your units and arithmetic.')+(tries>=2?'':''));if(tries>=2&&!acts.querySelector('.sol')){const s=btn('Show solution','sol');acts.appendChild(s);
        s.onclick=()=>{inp.value=p.fmt?p.fmt(p.a):round(p.a,2);inp.disabled=true;feedback('ok',`<b>Solution:</b> ${p.solution||''} ${p.why||''}`);acts.innerHTML='';const b=btn(run.i<run.items.length-1?'Continue':'Finish','primary');acts.appendChild(b);b.onclick=next;stat(0,it);};}}};
    chk.onclick=go;inp.addEventListener('keydown',e=>{if(e.key==='Enter')go();e.stopPropagation();});setTimeout(()=>inp.focus(),50);
  }else if(p.type==='sort'){
    const items=shuffle(p.items.map((x,k)=>({...x,k}))),pick={};
    pz.innerHTML=items.map(x=>`<div class="srow" data-k="${x.k}"><div class="st">${x.t}</div><div class="chips">${p.cats.map((c,ci)=>`<button class="chip" data-c="${ci}">${c}</button>`).join('')}</div></div>`).join('');
    pz.querySelectorAll('.srow').forEach(row=>row.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{row.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));ch.classList.add('on');pick[row.dataset.k]=+ch.dataset.c;row.classList.remove('bad','good');}));
    const chk=btn('Check','primary');acts.appendChild(chk);
    chk.onclick=()=>{if(Object.keys(pick).length<p.items.length){feedback('no','Sort every item first.');return;}
      let bad=0;pz.querySelectorAll('.srow').forEach(row=>{const ok=pick[row.dataset.k]===p.items[row.dataset.k].c;row.classList.toggle('bad',!ok);row.classList.toggle('good',ok);if(!ok)bad++;});
      if(!bad){pz.querySelectorAll('.chip').forEach(c=>c.disabled=true);pass();}else fail(`${bad} of ${p.items.length} ${bad>1?'are':'is'} in the wrong place — fix the red rows.`);};
  }else if(p.type==='order'){
    let cur=shuffle(p.items.map((t,k)=>k));if(cur.every((v,i)=>v===i))cur.reverse();
    const draw=()=>{pz.innerHTML=`<ol class="ord">${cur.map((k,i)=>`<li data-i="${i}"><span>${p.items[k]}</span><button class="mv" data-d="-1" aria-label="Move up" ${i?'':'disabled'}>▲</button><button class="mv" data-d="1" aria-label="Move down" ${i<cur.length-1?'':'disabled'}>▼</button></li>`).join('')}</ol>`;
      pz.querySelectorAll('.mv').forEach(b=>b.onclick=()=>{const i=+b.closest('li').dataset.i,j=i+ +b.dataset.d;[cur[i],cur[j]]=[cur[j],cur[i]];draw();});};
    draw();const chk=btn('Check order','primary');acts.appendChild(chk);
    chk.onclick=()=>{const wrong=cur.filter((k,i)=>k!==i).length;pz.querySelectorAll('li').forEach((li,i)=>{li.classList.toggle('good',cur[i]===i);li.classList.toggle('bad',cur[i]!==i);});
      if(!wrong){pz.querySelectorAll('.mv').forEach(b=>b.disabled=true);pass();}else fail(`${wrong} step${wrong>1?'s are':' is'} out of place.`);};
  }else if(p.type==='explain'){
    pz.innerHTML=`<textarea id="exIn" rows="5" placeholder="Write 2–4 sentences, the way you would on the exam…" aria-label="Your answer"></textarea>`;
    const ta=pz.querySelector('#exIn');ta.addEventListener('keydown',e=>e.stopPropagation());setTimeout(()=>ta.focus(),50);
    const chk=btn('Compare with the model answer','primary');acts.appendChild(chk);
    chk.onclick=()=>{if(ta.value.trim().length<15){feedback('no','Write a few sentences first — a rough answer is fine.');return;}
      ta.readOnly=true;acts.innerHTML='';feedback('','');
      pz.insertAdjacentHTML('beforeend',`<div class="model"><b>Model answer</b><p>${p.model}</p><b>Tick each key point your answer covered:</b>${p.points.map((t,i)=>`<label class="kp"><input type="checkbox" data-i="${i}"> <span>${t}</span></label>`).join('')}</div>`);
      const done=btn('Done','primary');acts.appendChild(done);done.focus();
      done.onclick=()=>{const got=pz.querySelectorAll('.kp input:checked').length,need=Math.ceil(p.points.length*2/3);
        pz.querySelectorAll('.kp input').forEach(x=>x.disabled=true);
        if(got>=need){p.why=`You covered ${got} of ${p.points.length} key points. ${p.why||''}`;pass();}
        else{it.missed=true;noteMiss(it);feedback('no',`You covered ${got} of ${p.points.length} key points — aim for at least ${need}. ${p.why||''}`);acts.innerHTML='';
          const b=btn(run.i<run.items.length-1?'Continue':'Finish','primary');acts.appendChild(b);b.onclick=next;b.focus();stat(0,it);}};};
  }
  function feedback(kind,msg){const fb=card.querySelector('#fb');fb.className='fb '+(kind||'info');fb.innerHTML=msg;}
  drawTools();
}
function btn(label,cls){const b=document.createElement('button');b.className=cls;b.innerHTML=label;return b;}
function stat(correctFirst,it){SAVE.stats.answered++;SAVE.stats.first+=correctFirst;if(it)recordQ(it,correctFirst);}
/* per-question history for the study report: attempts, first-try hits, last 3 outcomes, time, calc vs concept */
function recordQ(it,c){
  const k=it.node+'|'+it.idx,Q=SAVE.qs||(SAVE.qs={}),q=Q[k]||(Q[k]={n:0,ok:0,h:'',ms:0});
  q.n++;q.ok+=c;q.h=(q.h+c).slice(-3);q.ts=Date.now();
  // spaced review: right first time → next review further out (1, 3, 7, 16, 35 days); a miss → due again now
  q.box=c?Math.min((q.box||0)+1,5):0;q.due=Date.now()+[0,1,3,7,16,35][q.box]*864e5;
  // calibration: how often 'sure' answers are actually right
  if(it.conf!==undefined){const C=SAVE.cal||(SAVE.cal={s:{n:0,ok:0},u:{n:0,ok:0}}),b=it.conf?C.s:C.u;b.n++;b.ok+=c;q.sw=it.conf===1&&!c?1:(c?0:q.sw||0);}q.ms+=Math.min(600000,Date.now()-(it.t0||Date.now()));q.c=it.p.type==='num'?1:0;
  const d=new Date().toLocaleDateString('en-CA'),D=SAVE.days||(SAVE.days={});D[d]=(D[d]||0)+1;
  const ks=Object.keys(D).sort();while(ks.length>60)delete D[ks.shift()];
}
function noteMiss(it){if(!['stone','exam','focus','examc'].includes(run.mode))return;if(!SAVE.missed.some(m=>m.node===it.node&&m.idx===it.idx))SAVE.missed.push({node:it.node,idx:it.idx});persist();}
function next(){
  if(run.i<run.items.length-1){run.i++;renderPuzzle();return;}
  const r=run;if(r.mode==='exam'||r.mode==='examc')examTime=Date.now()-r.t0;closeCard();r.onDone&&r.onDone(r.items);persist();
}

/* questions whose spaced-review date has come round */
function dueKeys(){const now=Date.now(),Q=SAVE.qs||{};return Object.keys(Q).filter(k=>{const q=Q[k],[node,idx]=k.split('|');return q.due&&q.due<=now&&q.box>0&&NODES[node]?.puzzles?.[+idx];}).sort((a,b)=>Q[a].due-Q[b].due);}
