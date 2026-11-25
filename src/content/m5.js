/* ==========================================================================
   MODULE 5 — Hypothesis testing
   Stones: the Tribunal (hypotheses, errors, t-tests, critical values) and
   the Three Keys (critical value, p-value, confidence interval, F-test).
   ========================================================================== */
const tc1=(a,df)=>Stats.tinv(1-a,df), tc2=(a,df)=>Stats.tinv(1-a/2,df);
function genTestCase(r){ // a multiple regression with a meaningful mix of strong and weak coefficients
  const n=ri(r,25,40),X=[],Y=[];
  for(let i=0;i<n;i++){const c=ri(r,1,9),p=rr(r,20,90),inc=rr(r,30,90);X.push([c,p,inc]);Y.push(120-6*c+1.1*p+rr(r,-.3,.6)*inc+rngGauss(r)*18);}
  return {n,m:Stats.ols(X,Y,['Competitors','Population (000s)','Income ($000s)'])};
}

NODES['m5-tests']={kicker:'Module 5 · Hypotheses and t-tests',title:'The Tribunal',
  intro:'In the Tribunal, every coefficient stands trial. H₀ is presumed until the evidence is strong enough to reject it — and every verdict carries a risk of error.',
  lessons:[
   {title:'H₀, Hₐ, and choosing the tail',
    teach:`<p><b>H₀</b> is the benchmark or no-effect claim; <b>Hₐ</b> is what you conclude if the evidence rejects H₀. We <b>reject</b> or <b>fail to reject</b> H₀ — we never prove it.</p>
    <div class="ex">Expect a positive effect → H₀: β ≤ 0, Hₐ: β &gt; 0 (right tail)<br>Expect a negative effect → H₀: β ≥ 0, Hₐ: β &lt; 0 (left tail)<br>Either direction matters → H₀: β = 0, Hₐ: β ≠ 0 (two tails)</div>
    <p>Pick the direction from <b>theory and the decision</b>, before you see the estimate.</p>`,
    practice:[
     {type:'mc',q:'Theory says more competitors should <b>lower</b> sales. Which hypotheses?',opts:['H₀: β ≥ 0, Hₐ: β < 0','H₀: β ≤ 0, Hₐ: β > 0','H₀: β = 0, Hₐ: β ≠ 0','H₀: β < 0, Hₐ: β ≥ 0'],a:0,
      why:'The alternative holds the values you expect (negative); the null holds the ones you don’t.'},
     {type:'mc',q:'You fail to reject H₀: β = 0. What can you say?',opts:['The data don’t give strong evidence against H₀','The true β is zero, so X has no effect','The variable should be deleted from the model','The model must be misspecified'],a:0,
      why:'Failing to reject is not proof of no effect — the evidence just isn’t strong enough at your α.'},
    ]},
   {title:'The t-statistic and the rejection region',
    teach:`<p>The t-statistic scales the estimate by its uncertainty:</p>
    <div class="ex">t = (b − β₀) / SE(b) → for H₀: β = 0, t = b / SE(b)<br>df = n − k − 1</div>
    <p>With df = 29 and α = 0.05: one-tailed critical value 1.699; two-tailed 2.045. Right tail: reject if t &gt; 1.699. Left: if t &lt; −1.699. Two-sided: if |t| &gt; 2.045.</p>
    <p><b>Type I</b> error = rejecting a true H₀ (probability α). <b>Type II</b> = failing to reject a false H₀.</p>`,
    practice:[
     {make:r=>{const b=round(rr(r,-12,12),2)||3.1,se=round(rr(r,1.2,5),2),a=b/se;return {type:'num',q:`b = <b>${b}</b>, SE(b) = <b>${se}</b>. Compute t for H₀: β = 0.`,a,tol:.011,hint:'t = b / SE(b)',solution:`${b} / ${se} = ${round(a,3)}.`,why:'A coefficient can be large yet statistically weak if its SE is large too.'};}},
     {type:'sort',q:'Classify each mistake.',cats:['Type I error','Type II error'],
      items:[{t:'Concluding automation cuts costs when it doesn’t',c:0},{t:'Missing a real safety defect',c:1},{t:'Convicting an innocent defendant',c:0},{t:'Rejecting a valuable investment because evidence looked weak',c:1}],
      why:'Type I rejects a true H₀ (a false positive); Type II fails to reject a false H₀ (a false negative). Which is worse depends on the stakes.'},
    ]},
  ],
  puzzles:[
   {type:'sort',q:'Choose the right test for each claim.',cats:['Right-tailed','Left-tailed','Two-tailed'],
    items:[{t:'More residents nearby should raise restaurant sales',c:0},{t:'Each extra competitor should cut sales',c:1},{t:'A new uniform policy might raise or lower productivity — either would matter',c:2},{t:'Higher household income should increase spending',c:0}],
    why:'One-sided tests follow a directional theory; two-sided tests fit when an effect in either direction matters.'},
   {make:r=>{const n=33,k=3,df=n-k-1,b=-round(rr(r,4000,12000),0),se=round(rr(r,1500,5500),0),t=b/se,c=tc1(.05,df),rej=t<-c;return {type:'mc',
    exhibit:Exhibit.eq(`Competition coefficient b = ${b.toLocaleString()} · SE = ${se.toLocaleString()} · n = ${n}, k = ${k} · α = 0.05 · one-tailed critical value = ${round(c,3)}`),
    q:'Test H₀: β ≥ 0 against Hₐ: β < 0. What’s the verdict?',
    opts:[`t = ${round(t,2)}; reject H₀ because t < −${round(c,3)}`,`t = ${round(t,2)}; fail to reject H₀ because t > −${round(c,3)}`,`Reject H₀ because b is negative`,`Fail to reject H₀ because the SE is positive`],a:rej?0:1,
    hints:{2:'A negative estimate isn’t enough — compare t to the critical value.',3:'Compute t = b / SE first.'},
    why:`t = ${b.toLocaleString()} / ${se.toLocaleString()} = ${round(t,2)}. ${rej?'It falls in the left-tail rejection region, so the evidence supports a negative relationship.':'It doesn’t reach the rejection region, so the evidence isn’t strong enough at α = 0.05.'}`};}},
   {make:r=>{const n=ri(r,20,60),k=ri(r,1,4);return {type:'num',q:`A regression has n = <b>${n}</b> and k = <b>${k}</b> explanatory variables. What df do you use for its t-tests?`,a:n-k-1,tol:0,hint:'n − k − 1',solution:`${n} − ${k} − 1 = ${n-k-1}.`,why:'The degrees of freedom set the shape of the t-distribution and the critical value.'};}},
   {type:'mc',q:'A firm tests whether a defect creates a serious safety risk (Hₐ). Which error should it fear most, and what follows?',opts:['Type II — missing a real hazard; accept a larger α','Type I — always the worst; use the smallest α possible','Neither — the standard α = 0.05 settles it','Type I — false alarms cost more than injuries'],a:0,
    why:'When safety is at stake, a false negative can be catastrophic. α = 0.05 is a starting point, not an automatic rule.'},
   {make:r=>{const b=round(rr(r,.15,.6),3),se=round(b/rr(r,1.2,5),3),df=ri(r,25,40),t=b/se,c=tc1(.05,df);return {type:'num',
    exhibit:Exhibit.eq(`Population coefficient b = ${b} · SE = ${se} · df = ${df} · right-tailed critical value (α = 0.05) = ${round(c,3)}`),
    q:'Compute t for H₀: β ≤ 0 vs Hₐ: β > 0. (Then think: reject or not?)',a:t,tol:.011,hint:'t = b / SE',
    solution:`${b} / ${se} = ${round(t,3)} — ${t>c?'above':'below'} ${round(c,3)}, so ${t>c?'reject':'fail to reject'} H₀.`,why:'Compare the t-statistic with the critical value for the chosen tail, α, and df.'};}},
  ]};

NODES['m5-three']={kicker:'Module 5 · Three methods and the F-test',title:'The Three Keys',
  intro:'Three keys open the same lock: the critical value, the p-value, and the confidence interval. Use the same test, α, and tail, and they always agree. A fourth key — the F-test — opens the whole model at once.',
  lessons:[
   {title:'p-values and confidence intervals',
    teach:`<p>Excel’s P-value tests <b>H₀: β = 0 against a two-sided Hₐ</b> — nothing else. Reject when p ≤ α.</p>
    <div class="ex">Confidence interval: b ± t<sub>α/2</sub> × SE(b)<br>Income: 10.21 ± 2.024 × 2.093 = [5.97, 14.45] → 0 is outside → reject H₀</div>
    <p>Report the interval with the estimate — managers need the plausible range, not just yes or no.</p>`,
    practice:[
     {make:r=>{const b=round(rr(r,2,15),3),se=round(rr(r,.8,4),3),df=ri(r,20,45),c=tc2(.05,df),lo=b-c*se;return {type:'num',
      exhibit:Exhibit.eq(`b = ${b} · SE = ${se} · two-tailed critical value (α = 0.05, df = ${df}) = ${round(c,3)}`),q:'Compute the <b>lower</b> bound of the 95% confidence interval.',a:lo,tol:.02,
      hint:'b − t × SE',solution:`${b} − ${round(c,3)} × ${se} = ${round(lo,3)}.`,why:`${lo>0?'Zero is below the interval, so you would reject H₀: β = 0.':'Zero sits inside the interval, so you would fail to reject H₀: β = 0.'}`};}},
     {type:'mc',q:'Excel reports p = 0.031 for a coefficient. At α = 0.05, two-sided test of β = 0:',opts:['Reject H₀','Fail to reject H₀','Accept H₀','The p-value says the effect is large'],a:0,why:'0.031 ≤ 0.05. A small p-value is about evidence, not size.'},
    ]},
   {title:'The F-test and significance vs importance',
    teach:`<p>The <b>F-test</b> asks whether the explanatory variables, jointly, explain anything: H₀: β₁ = β₂ = … = βₖ = 0.</p>
    <div class="ex">F = (ESS / k) / (RSS / (n − k − 1))<br>Salary: (500.32 / 2) / (99.45 / 17) = 42.7 &gt; F<sub>crit</sub> 3.59 → reject H₀</div>
    <p>A significant F doesn’t say <b>which</b> variable matters — look at the t-tests. And statistical significance isn’t economic importance: b = 0.03 with p = 0.001 may be too small to act on; b = 12 with p = 0.28 is large but unreliable.</p>`,
    practice:[
     {make:r=>{const k=ri(r,2,4),n=ri(r,20,45),ess=round(rr(r,200,900),1),rss=round(rr(r,80,500),1),F=(ess/k)/(rss/(n-k-1));return {type:'num',q:`ESS = <b>${ess}</b>, RSS = <b>${rss}</b>, k = <b>${k}</b>, n = <b>${n}</b>. Compute F.`,a:F,tol:.02,
      hint:'(ESS/k) / (RSS/(n − k − 1))',solution:`(${ess}/${k}) / (${rss}/${n-k-1}) = ${round(F,3)}.`,why:'F compares explained variation per predictor with unexplained variation per residual df.'};}},
     {type:'mc',q:'Automation’s coefficient is 0.03 (p = 0.001). The project costs millions. Best reading?',opts:['Clearly nonzero, but maybe too small to be worth it','A huge effect — p = 0.001 means invest now','Unreliable — a coefficient that small is noise','Proof that automation drives productivity'],a:0,why:'Evaluate statistical evidence and business magnitude together.'},
    ]},
  ],
  puzzles:[
   {make:r=>{const {m}=genTestCase(r),ix=pick([1,2,3]),c=m.coef[ix],rej=c.p<=.05;return {type:'mc',exhibit:Exhibit.excel(m,'Annual sales ($000)'),
    q:`Using the p-value method (two-sided, α = 0.05), what do you conclude about <b>${c.name}</b>?`,
    opts:[`Reject H₀: β = 0 — p = ${Exhibit.xl(c.p)} ≤ 0.05`,`Fail to reject H₀: β = 0 — p = ${Exhibit.xl(c.p)} > 0.05`,'Reject H₀ because the coefficient is not zero','Fail to reject H₀ because R² is below 0.9'],a:rej?0:1,
    why:'Excel’s P-value is for a two-sided test of β = 0. Compare it with α; ignore R² for this question.'};}},
   {make:r=>{const {m}=genTestCase(r),ix=pick([1,2,3]),c=m.coef[ix],t=tc2(.05,m.df);return {type:'num',exhibit:Exhibit.excel(m,'Annual sales ($000)').replace(/<th class="n">Lower 95%<\/th><th class="n">Upper 95%<\/th>/,'').replace(/(<tr><td>[^<]+<\/td>(?:<td class="n">[^<]*<\/td>){4})(?:<td class="n">[^<]*<\/td>){2}<\/tr>/g,'$1</tr>'),
    q:`The interval columns are hidden. Build the <b>upper</b> 95% bound for <b>${c.name}</b>. Two-tailed critical value (df = ${m.df}) = <b>${round(t,3)}</b>.`,a:c.hi,tol:.02,
    hint:'b + t × SE, using the Coefficients and Standard Error columns.',solution:`${Exhibit.xl(c.b)} + ${round(t,3)} × ${Exhibit.xl(c.se)} = ${round(c.hi,3)}.`,
    why:`The 95% interval is [${round(c.lo,3)}, ${round(c.hi,3)}] — ${c.lo>0||c.hi<0?'zero is outside, so reject H₀: β = 0':'zero is inside, so fail to reject H₀: β = 0'}. All three methods agree.`};}},
   {make:r=>{const {m}=genTestCase(r);return {type:'num',exhibit:Exhibit.excel(m,'Annual sales ($000)').replace(/(<tr><td>Regression<\/td><td class="n">\d+<\/td><td class="n">[^<]*<\/td><td class="n">[^<]*<\/td>)<td class="n">[^<]*<\/td><td class="n">[^<]*<\/td>/,'$1<td class="n">?</td><td class="n">?</td>'),
    q:'F and Significance F are hidden. Compute the <b>F-statistic</b> from the ANOVA table.',a:m.F,tol:.02,
    hint:'F = (Regression SS / k) / (Residual SS / residual df) — or Regression MS / Residual MS.',solution:`${Exhibit.xl(m.SSR/(m.k-1))} / ${Exhibit.xl(m.SSE/m.df)} = ${round(m.F,3)}.`,
    why:`H₀: all slopes are zero. Here F = ${round(m.F,2)} with p = ${Exhibit.xl(m.pF)} — ${m.pF<=.05?'at least one driver adds explanatory power':'no joint evidence at α = 0.05'}. The F-test doesn’t say which one; the t-tests do.`};}},
   {type:'mc',q:'Your F-test rejects H₀ at 1%, but two of three t-tests are not significant. Which statement is right?',opts:['Jointly they matter; individually, less clearly','The F-test must be wrong if the t-tests disagree','All three drivers matter about equally','The model should be discarded as unreliable'],a:0,
    why:'The F-test asks whether the group adds explanatory power; it doesn’t identify the responsible coefficient.'},
   {type:'mc',q:'Infrastructure spending has b = 12 with p = 0.28. A manager wants to cite it as proof of a big payoff. Your response?',opts:['Too imprecise — the true effect could be zero','Significant, because an effect of 12 is large','Solid — p = 0.28 means a 28% effect','It shows spending has the opposite effect'],a:0,
    why:'Size without precision is fragile evidence. Report both magnitude and uncertainty before acting.'},
  ]};

/* exam-guide gap: statistical significance is not causation */
NODES['m5-three'].puzzles.push({type:'mc',q:'Customers who use the loyalty app spend more, and the app dummy is highly significant (p < 0.001). Does the app <b>cause</b> the extra spending?',
  opts:['Not necessarily — heavy spenders may choose the app','Yes — p < 0.001 rules out other explanations','Yes, as long as the model’s R² is also high','No — significant coefficients are never causal'],a:0,
  why:'A tiny p-value measures evidence against β = 0, not why the association exists. Causal claims need a design — like random assignment — that rules out self-selection and confounders.'});
