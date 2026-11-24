/* ---------- calculator: safe expression parser (no eval) + panel ---------- */
const Calc=(()=>{
  const FN={sqrt:Math.sqrt,ln:Math.log,log:Math.log10,exp:Math.exp,abs:Math.abs,
    sum:(...a)=>a.reduce((s,v)=>s+v,0),mean:(...a)=>a.reduce((s,v)=>s+v,0)/a.length,
    sumsq:(...a)=>a.reduce((s,v)=>s+v*v,0),
    var:(...a)=>{const m=a.reduce((s,v)=>s+v,0)/a.length;return a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1);},
    sd:(...a)=>Math.sqrt(FN.var(...a)),min:Math.min,max:Math.max,round:(x,d=0)=>Math.round(x*10**d)/10**d};
  function tokenize(s){
    s=s.replace(/[×✕]/g,'*').replace(/[÷]/g,'/').replace(/[−–]/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\$/g,'');
    const t=[];let i=0;
    while(i<s.length){const c=s[i];
      if(/\s/.test(c)){i++;continue;}
      const m=s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i);
      if(m){t.push({k:'n',v:parseFloat(m[0])});i+=m[0].length;continue;}
      const w=s.slice(i).match(/^[a-z]+/i);
      if(w){t.push({k:'w',v:w[0].toLowerCase()});i+=w[0].length;continue;}
      if('+-*/^(),%'.includes(c)){t.push({k:c});i++;continue;}
      throw new Error(`Unexpected “${c}”`);}
    return t;
  }
  function evaluate(src,ans=0){
    const t=tokenize(src);let p=0;
    const peek=()=>t[p],eat=k=>{if(t[p]&&t[p].k===k){p++;return true;}return false;};
    const expr=()=>{let v=term();for(;;){if(eat('+'))v+=term();else if(eat('-'))v-=term();else return v;}};
    const term=()=>{let v=unary();for(;;){if(eat('*'))v*=unary();else if(eat('/'))v/=unary();
      else if(peek()&&(peek().k==='('||peek().k==='w'||peek().k==='n'))v*=unary(); // implicit ×, e.g. 2(3+4)
      else return v;}};
    const unary=()=>{if(eat('-'))return -unary();if(eat('+'))return unary();return power();};
    const power=()=>{let b=postfix();if(eat('^'))return b**unary();return b;};
    const postfix=()=>{let v=atom();while(eat('%'))v/=100;return v;};
    const atom=()=>{const x=t[p];if(!x)throw new Error('Incomplete expression');
      if(x.k==='n'){p++;return x.v;}
      if(eat('(')){const v=expr();if(!eat(')'))throw new Error('Missing “)”');return v;}
      if(x.k==='w'){p++;const n=x.v;
        if(n==='pi')return Math.PI;if(n==='e'&&!(t[p]&&t[p].k==='('))return Math.E;if(n==='ans')return ans;
        const f=FN[n];if(!f)throw new Error(`Unknown “${n}”`);
        if(!eat('(')){return f(atom());}
        const args=[];if(!eat(')')){do{args.push(expr());}while(eat(','));if(!eat(')'))throw new Error('Missing “)”');}
        return f(...args);}
      throw new Error('Unexpected symbol');};
    const v=expr();if(p<t.length)throw new Error('Unexpected input');if(!isFinite(v))throw new Error('Not a finite number');return v;
  }
  const fmt=v=>{const a=Math.abs(v);if(a!==0&&(a<1e-6||a>=1e12))return v.toExponential(6);return String(Number(v.toPrecision(12)));};
  return {evaluate,fmt};
})();

const calcEl=document.getElementById('calc');
let calcAns=0;
function buildCalc(){
  const keys=[['(',')','^','√(','⌫'],['7','8','9','÷','C'],['4','5','6','×','ln('],['1','2','3','−','exp('],['0','.',',','+','='],['x²','1/x','ANS','sum(','mean('],['sumsq(','var(','sd(','log(','π']];
  calcEl.innerHTML=`<div class="ch"><b>Calculator</b><button class="cx" aria-label="Close calculator">×</button></div>
  <input id="cIn" autocomplete="off" spellcheck="false" aria-label="Expression" placeholder="e.g. (12.4-9.8)^2 + sumsq(1,-2,3)">
  <div id="cOut" class="cout">&nbsp;</div>
  <div class="keys">${keys.flat().map(k=>`<button data-k="${k}"${k==='='?' class="eqk"':''}>${k.replace('(','')==='√'?'√':k}</button>`).join('')}</div>
  <div class="hist" id="cHist"></div>
  <button id="cUse" class="use hidden">Use result as my answer</button>
  <p class="chelp">Lists: <code>mean(4,7,9)</code> · <code>sumsq(1,-2,3)</code> = Σx² · <code>var()</code> and <code>sd()</code> use n − 1 · <code>ln</code> natural log · <code>log</code> base 10.</p>`;
  const inp=calcEl.querySelector('#cIn'),out=calcEl.querySelector('#cOut'),hist=calcEl.querySelector('#cHist');
  const run=()=>{const s=inp.value.trim();if(!s)return;try{const v=Calc.evaluate(s,calcAns);calcAns=v;out.textContent='= '+Calc.fmt(v);out.className='cout ok';
      const row=document.createElement('div');row.textContent=`${s} = ${Calc.fmt(v)}`;hist.prepend(row);while(hist.children.length>5)hist.lastChild.remove();
      inp.value=Calc.fmt(v);syncUse();}catch(e){out.textContent=e.message;out.className='cout err';}};
  const ins=s=>{const a=inp.selectionStart??inp.value.length,b=inp.selectionEnd??a;inp.value=inp.value.slice(0,a)+s+inp.value.slice(b);inp.focus();inp.setSelectionRange(a+s.length,a+s.length);};
  calcEl.querySelectorAll('.keys button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;
    if(k==='=')run();else if(k==='C'){inp.value='';out.innerHTML='&nbsp;';out.className='cout';}
    else if(k==='⌫'){inp.value=inp.value.slice(0,-1);inp.focus();}
    else if(k==='x²')ins('^2');else if(k==='1/x'){inp.value=`1/(${inp.value||'ans'})`;}
    else if(k==='ANS')ins('ans');else if(k==='√(')ins('sqrt(');else ins(k);});
  inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();run();}if(e.key==='Escape')toggleCalc(false);});
  inp.addEventListener('keyup',e=>e.stopPropagation());
  calcEl.querySelector('.cx').onclick=()=>toggleCalc(false);
  calcEl.querySelector('#cUse').onclick=()=>{const n=document.getElementById('numIn');if(n&&!n.disabled){n.value=Calc.fmt(calcAns);n.focus();toggleCalc(false);}};
}
function syncUse(){const n=document.getElementById('numIn');calcEl.querySelector('#cUse').classList.toggle('hidden',!(n&&!n.disabled));}
function toggleCalc(on){if(!calcEl.innerHTML)buildCalc();const show=on??calcEl.classList.contains('hidden');calcEl.classList.toggle('hidden',!show);if(show){syncUse();setTimeout(()=>calcEl.querySelector('#cIn').focus(),30);}}
