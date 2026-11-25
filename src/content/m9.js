/* ==========================================================================
   MODULE 9 — Serial correlation
   Stone: the Echoing Ice (positive vs negative, residuals over time, pure vs
   impure, Durbin–Watson and its limits, effect on standard errors).
   ========================================================================== */
// Durbin–Watson 5% critical values [dL, dU] by sample size T and number of predictors k
const DWT={20:{1:[1.20,1.41],2:[1.10,1.54],3:[1.00,1.68]},25:{1:[1.29,1.45],2:[1.21,1.55],3:[1.12,1.65]},
           30:{1:[1.35,1.49],2:[1.28,1.57],3:[1.21,1.65]},40:{1:[1.44,1.54],2:[1.39,1.60],3:[1.34,1.66]}};
const SC_KIND={pos:'Positive serial correlation — residuals stay on one side in long runs',none:'No serial correlation — residuals jump around with no pattern',neg:'Negative serial correlation — residuals tend to flip sign every period'};
function genAR(r,rho,n=30){
  const lag1=e=>{let a=0,b=0;for(let i=0;i<e.length;i++){b+=e[i]*e[i];if(i)a+=e[i]*e[i-1];}return a/b;};
  for(let k=0;k<40;k++){const e=genAR1(r,rho,n),c=lag1(e);if(rho>0?c>.45:rho<0?c<-.45:Math.abs(c)<.15)return e;}
  return genAR1(r,rho,n);}
function genAR1(r,rho,n){const e=[];let prev=0;for(let t=0;t<n;t++){prev=rho*prev+rngGauss(r)*(rho?Math.sqrt(1-rho*rho):1);e.push(prev);}
  const m=e.reduce((a,b)=>a+b,0)/n;return e.map(v=>round((v-m)*10,2));}
const timePlot=e=>Exhibit.scatter(e.map((_,i)=>i+1),e,{xl:'Time period',yl:'Residual',hline:0,connect:true,title:'Residuals over time'});
const dwOf=e=>{let num=0,den=0;e.forEach((v,i)=>{den+=v*v;if(i)num+=(v-e[i-1])**2;});return num/den;};

NODES['m9-serial']={kicker:'Module 9 · Serial correlation',title:'The Echoing Ice',
  intro:'Shout into the ice and it answers a moment later. When today’s residual helps predict tomorrow’s, the model’s “noise” isn’t really noise — and its p-values claim more certainty than they’ve earned.',
  lessons:[
   {title:'When errors echo over time',
    teach:`<p>In time-series data, the error in one period can be related to the error in the next. That breaks Classical Assumption 4 (no serial correlation).</p>
    <div class="ex"><b>Positive</b> (ρ &gt; 0): residuals keep the same sign for runs of periods — the common business case, because shocks take time to work through.<br>
    <b>Negative</b> (ρ &lt; 0): residuals tend to flip sign each period. Possible, but less common.<br>ρ is estimated as the correlation between eₜ and eₜ₋₁.</div>
    <p><b>Pure</b> serial correlation: the model is correctly specified but the errors still persist. <b>Impure</b>: the pattern is a <i>symptom</i> of a specification error — an omitted variable that moves over time, a missing <b>trend</b> or <b>seasonality</b>, a missing <b>lag</b>, or the wrong <b>functional form</b>.</p>
    <p><b>Consequences (pure case):</b> coefficients stay unbiased, but OLS is no longer BLUE and the usual <b>standard errors are biased — typically too small</b>, so t-statistics look too big and p-values too optimistic.</p>`,
    practice:[
     {make:r=>{const k=pick(['pos','none','neg']),rho={pos:.85,none:0,neg:-.75}[k],e=genAR(r,rho,24);const keys=['pos','none','neg'];return {type:'mc',exhibit:timePlot(e),
      q:'Residuals from a monthly sales model, in time order. What do they show?',opts:keys.map(x=>SC_KIND[x]),a:keys.indexOf(k),
      why:'Runs of same-signed residuals mean positive serial correlation; sign-flipping every period means negative; no pattern means none.'};}},
     {type:'sort',q:'Pure or impure serial correlation?',cats:['Pure','Impure (a specification problem)'],
      items:[{t:'A correctly specified model where supply shocks take several quarters to fade',c:0},{t:'Quarterly sales model with no holiday-quarter dummy',c:1},{t:'A straight line fit to costs that fall fast and then level off',c:1},{t:'Retail sales model that omits a slowly cycling consumer-confidence index',c:1}],
      why:'Impure serial correlation is the model telling you something is missing: a seasonal pattern, the right shape, or a persistent variable.'},
    ]},
   {title:'The Durbin–Watson test',
    teach:`<div class="ex">DW = Σ(eₜ − eₜ₋₁)² / Σeₜ² &nbsp;·&nbsp; ≈ 0 strong positive · ≈ 2 none · ≈ 4 strong negative</div>
    <p>To test for <b>positive</b> first-order serial correlation (H₀: ρ ≤ 0, Hₐ: ρ &gt; 0), look up <b>dL</b> and <b>dU</b> for your sample size T and number of predictors k:</p>
    <div class="ex">DW &lt; dL → <b>reject H₀</b> (positive serial correlation)<br>DW &gt; dU → <b>do not reject</b><br>dL ≤ DW ≤ dU → <b>inconclusive</b> — proceed with caution</div>
    <p><b>Limits:</b> DW requires an intercept, only checks <b>first-order</b> correlation, and is <b>not valid when a lagged dependent variable</b> (Yₜ₋₁) is an explanatory variable. The inconclusive zone is part of the test, not a mistake.</p>
    <p><b>Response:</b> diagnose first — look for an omitted trend, seasonality, a missing lag, or the wrong form. Advanced fixes (GLS, Newey–West standard errors) are for pure serial correlation and are beyond this course.</p>`,
    practice:[
     {make:r=>{const num=round(rr(r,20,140),1),den=round(rr(r,60,110),1),dw=num/den;return {type:'num',q:`For a regression’s residuals, Σ(eₜ − eₜ₋₁)² = <b>${num}</b> and Σeₜ² = <b>${den}</b>. What is the Durbin–Watson statistic?`,a:dw,tol:.006,
      hint:'DW = Σ(eₜ − eₜ₋₁)² ÷ Σeₜ²',solution:`${num} / ${den} = ${round(dw,3)}.`,why:dw<1.2?'Well below 2 — a sign of positive serial correlation (check dL/dU to decide).':dw>2.6?'Well above 2 — a hint of negative serial correlation.':'Fairly close to 2 — compare with dU before relaxing.'};}},
     {type:'mc',q:'Which equation makes the Durbin–Watson test unreliable?',
      opts:['Salesₜ = β₀ + β₁Priceₜ + β₂Salesₜ₋₁ + εₜ','Salesₜ = β₀ + β₁Priceₜ + β₂Incomeₜ + εₜ','Salesₜ = β₀ + β₁Advertisingₜ₋₁ + εₜ','Salesₜ = β₀ + β₁Priceₜ + β₂Q4ₜ + εₜ'],a:0,
      why:'DW is not valid when the lagged dependent variable (Salesₜ₋₁) is an explanatory variable. A lagged X like Advertisingₜ₋₁ is fine.'},
    ]},
  ],
  puzzles:[
   {make:r=>{const k=pick(['pos','neg','none']),rho={pos:.88,none:0,neg:-.8}[k],e=genAR(r,rho,28),keys=['pos','none','neg'];return {type:'mc',exhibit:timePlot(e),
    q:'Quarterly residuals in time order. Which pattern is this?',opts:keys.map(x=>SC_KIND[x]),a:keys.indexOf(k),
    why:k==='pos'?'Long runs above and below zero: positive serial correlation — the most common case in business time series.':k==='neg'?'Residuals keep flipping sign: negative serial correlation.':'No visible persistence — consistent with independent errors.'};}},
   {make:r=>{const n=8,rho=pick([.75,.6,-.5]);let e=genAR(r,rho,n).map(v=>round(v/4,2));const d=e.map((v,i)=>i?round(v-e[i-1],2):'—');
    const num=d.slice(1).reduce((s,v)=>s+v*v,0),den=e.reduce((s,v)=>s+v*v,0),dw=num/den;return {type:'num',
    exhibit:Exhibit.table(['t','eₜ','eₜ − eₜ₋₁'],e.map((v,i)=>[i+1,fmtNum(v),d[i]==='—'?'—':fmtNum(d[i])])),
    q:'Compute the Durbin–Watson statistic for these residuals.',a:dw,tol:.012,
    hint:'Square and add the differences (skip t = 1), square and add the residuals, then divide: DW = Σ(eₜ − eₜ₋₁)² / Σeₜ². The calculator’s sumsq(…) helps.',
    solution:`Σ(eₜ − eₜ₋₁)² = ${round(num,4)}; Σeₜ² = ${round(den,4)}; DW = ${round(dw,3)}.`,
    why:dw<1.5?'Low DW: residuals move together from one period to the next.':dw>2.5?'High DW: residuals tend to reverse each period.':'Near 2: little first-order pattern.'};}},
   {make:r=>{const T=pick([20,25,30,40]),k=pick([1,2,3]),[dL,dU]=DWT[T][k],zone=pick(['rej','inc','no']);
    const dw=zone==='rej'?round(rr(r,.4,dL-.08),2):zone==='inc'?round(rr(r,dL+.03,dU-.03),2):round(rr(r,dU+.08,2.3),2);
    const opts=['Reject H₀ — evidence of positive serial correlation','Inconclusive — don’t over-trust the p-values','Do not reject H₀ — no evidence of positive serial correlation'];
    return {type:'mc',exhibit:Exhibit.table(['T','k','DW','dL (5%)','dU (5%)'],[[T,k,dw,dL.toFixed(2),dU.toFixed(2)]]),
     q:'Test for positive first-order serial correlation at the 5% level. Decision?',opts,a:{rej:0,inc:1,no:2}[zone],
     why:`DW = ${dw} is ${zone==='rej'?`below dL = ${dL}: reject H₀`:zone==='inc'?`between dL = ${dL} and dU = ${dU}: inconclusive`:`above dU = ${dU}: do not reject H₀`}.`};}},
   {type:'mc',q:'A time-series demand model shows strong positive serial correlation, but every coefficient has p < 0.01. What should a manager conclude?',
    opts:['The p-values are probably too optimistic','The model is extra reliable, since all are significant','The coefficients must be biased; ignore the signs','Serial correlation only affects R², not the tests'],a:0,
    why:'Serial correlation can make weak evidence look strong. In the pure case the coefficients are unbiased; the reported precision is what you can’t trust.'},
   {type:'sort',q:'Sort each statement about pure serial correlation.',cats:['True','False'],
    items:[{t:'OLS coefficients are still unbiased',c:0},{t:'OLS is still the minimum-variance (BLUE) estimator',c:1},{t:'The usual standard errors and t-tests become unreliable',c:0},{t:'It always means a variable was omitted',c:1}],
    why:'Pure serial correlation hurts efficiency and inference, not the center of the estimates. Impure serial correlation is the one caused by specification errors.'},
   {type:'mc',q:'Monthly ice-cream sales residuals are positive every summer and negative every winter. What’s the best first move?',
    opts:['Add seasonal dummies and re-estimate','Apply a standard-error correction right away','Drop the summer months from the sample','Ignore it — DW only matters for annual data'],a:0,
    why:'That pattern is impure serial correlation from missing seasonality. Fix the specification before reaching for statistical patches.'},
   {type:'mc',q:'DW = 1.31 with T = 25 and k = 3 (dL = 1.12, dU = 1.65). What does “inconclusive” mean for a decision?',
    opts:['It can’t confirm or rule it out — proceed with caution','There is no meaningful serial correlation to worry about','There is positive serial correlation, just weaker','The test was set up or run incorrectly'],a:0,
    why:'The inconclusive zone is part of the Durbin–Watson test, not an error.'},
  ]};
