/* ==========================================================================
   MODULE 4 — Regression assumptions for defensible decisions
   Stones: the Seven Lanterns (the classical assumptions) and the Hall of
   Residuals (diagnostics, standardized residuals, BLUE, precision).
   ========================================================================== */
const SEVEN=['Linearity in the coefficients and correct specification, with an additive error','Zero mean error','No endogeneity: X uncorrelated with the error','No serial correlation','Homoskedasticity: constant error variance','No perfect multicollinearity','Normally distributed errors (optional)'];

const RES_PATTERNS={
  random:{d:'Random scatter with roughly constant spread — consistent with homoskedasticity',sd:x=>9},
  spray:{d:'A spray: spread grows as X rises — heteroskedasticity',sd:x=>1+x*.75},
  funnel:{d:'A funnel: spread shrinks as X rises — heteroskedasticity',sd:x=>1+(31-x)*.75},
  bowtie:{d:'A bow-tie: spread shrinks, then grows — heteroskedasticity',sd:x=>1.5+Math.abs(x-15.5)*1.3},
  curve:{d:'A curve: residuals bend systematically — the functional form or a driver is missing',sd:x=>3.5,mean:x=>.14*(x-15.5)**2-11},
};
function genResid(r,key){const P=RES_PATTERNS[key],xs=[],es=[];for(let i=0;i<60;i++){const x=rr(r,1,30);xs.push(x);es.push((P.mean?P.mean(x):0)+rngGauss(r)*P.sd(x));}
  const m=es.reduce((a,b)=>a+b,0)/es.length;return {xs,es:es.map(e=>e-m)};}
const residPlot=(d,xl='X')=>Exhibit.scatter(d.xs,d.es,{xl,yl:'Residual',hline:0,title:'Residual plot'});

NODES['m4-seven']={kicker:'Module 4 · The classical assumptions',title:'The Seven Lanterns',
  intro:'Seven lanterns, seven assumptions. When they all burn, OLS earns its reputation. When one goes out, you need to know which claims you can still make — and which you can’t.',
  lessons:[
   {title:'The seven, in plain language',
    teach:`<div class="ex">${SEVEN.map((s,i)=>`${i+1} · ${s}`).join('<br>')}</div>
    <p><b>Linear</b> means linear in the <b>coefficients</b>, not the variables: Y = β₀ + β₁X², or β₁ln(X), is still fine. Y = β₀ + e^(β₁X) is not.</p>
    <p>Assumption 7 is optional: OLS can be <b>estimated</b> without normality; it matters for exact small-sample <b>inference</b>.</p>`,
    practice:[
     {type:'sort',q:'Is each equation linear in its parameters?',cats:['Linear in parameters','Not linear in parameters'],
      items:[{t:'Y = β₀ + β₁X²',c:0},{t:'Y = β₀ + β₁ln(X)',c:0},{t:'Y = β₀ + e^(β₁X)',c:1},{t:'Y = β₀ + β₁²X',c:1}],
      why:'Transforming X is fine as long as each β enters additively and to the first power.'},
     {type:'mc',q:'Which assumption is <b>not</b> needed just to compute OLS coefficients?',opts:['Normally distributed errors','Linearity in the coefficients','No perfect multicollinearity','An additive error term'],a:0,
      why:'Normality supports exact t and F inference, especially in small samples — not the estimation itself.'},
    ]},
   {title:'What residuals can and can’t tell you',
    teach:`<p>The population error ε is never observed, so we lean on residuals — but some assumptions can’t be checked that way.</p>
    <div class="ex"><b>Zero mean:</b> with an intercept, OLS residuals average zero automatically, so that proves nothing.<br><b>Endogeneity:</b> OLS residuals are uncorrelated with the included X’s by construction — a residual plot can’t reveal it.</div>
    <p>Instead, ask about omitted drivers, reverse causality, measurement error, and how the data were generated. Look for <b>systematic</b> misses: one customer group, big markets, certain periods.</p>`,
    practice:[
     {type:'mc',q:'Your residuals average exactly 0. What does that show about Assumption 2?',opts:['Nothing — OLS with an intercept forces that','It proves the error has mean zero','It proves there’s no endogeneity','It proves errors are normal'],a:0,
      why:'Σeᵢ = 0 is automatic. Look for systematic patterns instead.'},
     {type:'mc',q:'A price coefficient might be soaking up the effect of an omitted product-quality variable. Which assumption is at risk?',opts:['No endogeneity (Cov(X, ε) = 0)','Homoskedasticity','No serial correlation','Normality'],a:0,
      why:'If quality sits in ε and moves with price, price is correlated with the error — endogeneity, and a biased coefficient.'},
    ]},
  ],
  puzzles:[
   {type:'sort',q:'Match each warning sign to the assumption it threatens.',cats:['Endogeneity','Serial correlation','Heteroskedasticity','Perfect multicollinearity'],
    items:[{t:'An omitted driver that affects Y and moves with an included X',c:0},{t:'This month’s forecast miss predicts next month’s miss',c:1},{t:'Residual spread widens for larger stores',c:2},{t:'The model includes temperature in °F and the same temperature in °C',c:3}],
    why:'Endogeneity: X correlated with ε. Serial correlation: errors linked across observations. Heteroskedasticity: non-constant error variance. Perfect multicollinearity: one X is an exact linear combination of others.'},
   {type:'mc',q:'Which equation <b>violates</b> Assumption 1 (linear in the coefficients)?',opts:['Sales = β₀ + e^(β₁·Ads)','Sales = β₀ + β₁·Ads²','Sales = β₀ + β₁·ln(Ads)','ln(Sales) = β₀ + β₁·ln(Ads)'],a:0,
    why:'A β inside an exponent isn’t linear in the parameters. Transforming the variables — squares, logs — is fine.'},
   {type:'mc',q:'Under Assumptions 1–6, the Gauss–Markov theorem says OLS is…',opts:['BLUE — the minimum-variance estimator among linear unbiased estimators','Always unbiased, even with omitted variables','Normally distributed in every sample','The only estimator that gives R² above 0.5'],a:0,
    why:'Best (smallest variance), Linear, Unbiased Estimator. Gauss–Markov does not require normal errors.'},
   {type:'mc',q:'Serial correlation and heteroskedasticity usually leave coefficients unbiased. So why should a manager care?',opts:['Standard errors, t-tests, and confidence intervals become unreliable — confidence can be overstated','They always flip coefficient signs','They make R² negative','They stop Excel from running'],a:0,
    why:'The estimates may be centered right, but the reported precision is wrong — that’s decision risk.'},
   {type:'mc',q:'Your colleague says, “The residual plot looks clean, so there’s no endogeneity.” What’s wrong?',opts:['OLS residuals are uncorrelated with included X’s by construction, so a plot can’t reveal endogeneity','Nothing — clean plots rule it out','Endogeneity only shows up in R²','Residual plots only check normality'],a:0,
    why:'No endogeneity is a defensibility claim built from theory and design: omitted drivers, reverse causality, measurement error.'},
  ]};

NODES['m4-plots']={kicker:'Module 4 · Diagnostics and estimator quality',title:'The Hall of Residuals',
  intro:'In the Hall of Residuals, every model leaves a trace. Read the shapes, flag the unusual, and know how much a sample can tell you.',
  lessons:[
   {title:'Reading a residual plot',
    teach:`<p>Plot residuals against X (or against predicted Y). You want a <b>calm, even band</b> around zero.</p>
    <div class="ex">Even band → consistent with homoskedasticity<br>Spray (widening) · funnel (narrowing) · bow-tie → heteroskedasticity<br>A curve → the model is systematically wrong: functional form or a missing driver</div>
    <p>Individual misses are expected; <b>systematic</b> error is the warning sign.</p>`,
    practice:[
     {make:r=>{const k=pick(['random','spray','funnel']),d=genResid(r,k);const keys=['random','spray','funnel'];return {type:'mc',exhibit:residPlot(d,'Income'),q:'What does this residual plot suggest?',
      opts:keys.map(x=>RES_PATTERNS[x].d),a:keys.indexOf(k),why:'Spread that changes systematically with X signals heteroskedasticity; an even band is what you hope to see.'};}},
     {type:'mc',q:'Residuals are positive for almost every large-market store and negative for small ones. Best interpretation?',opts:['The model is systematically wrong by market size — a missing driver or wrong form','Normal random noise','Proof of heteroskedasticity only','The intercept is wrong, nothing else'],a:0,
      why:'Ask whether the model is systematically wrong for particular groups — that points to specification problems.'},
    ]},
   {title:'Standardized residuals and precision',
    teach:`<p>If errors are roughly normal, about <b>95%</b> of standardized residuals fall between −2 and +2. Flag |z| &gt; 2 for <b>investigation</b> — not automatic deletion.</p>
    <div class="ex">=IF(ABS(StandardizedResidual)&gt;2,"Investigate","Within range")</div>
    <p>Precision grows with sample size: the standard error shrinks roughly with <b>1/√n</b>. Quadruple n → about half the SE.</p>`,
    practice:[
     {make:r=>{const z=Array.from({length:10},()=>round(rngGauss(r)*1.25,2));const a=z.filter(v=>Math.abs(v)>2).length;return {type:'num',exhibit:Exhibit.table(['Obs','Standardized residual'],z.map((v,i)=>[i+1,fmtNum(v,2)])),
      q:'How many observations should be flagged “Investigate”?',a,tol:0,hint:'Count values with absolute value above 2.',solution:`${a} with |z| > 2.`,why:'Flags start a review — they don’t prove an error.'};}},
     {make:r=>{const se=round(rr(r,.4,2.4),2),m=pick([4,9,16]);return {type:'num',q:`A coefficient has SE = <b>${se}</b> with n = 100. Under the same conditions, roughly what SE would you expect with n = <b>${100*m}</b>?`,a:se/Math.sqrt(m),tol:.011,
      hint:'SE scales with 1/√n.',solution:`${se} / √${m} = ${round(se/Math.sqrt(m),3)}.`,why:'More relevant, comparable data narrow the sampling distribution.'};}},
    ]},
  ],
  puzzles:[
   {make:r=>{const keys=['random','spray','funnel','bowtie','curve'],k=pick(keys),d=genResid(r,k);return {type:'mc',exhibit:residPlot(d,'Store size'),q:'Diagnose this residual plot.',
    opts:keys.map(x=>RES_PATTERNS[x].d),a:keys.indexOf(k),why:{random:'An even band around zero is consistent with constant variance.',spray:'Widening spread: the error variance grows with X.',funnel:'Narrowing spread: the error variance falls as X rises.',bowtie:'Spread pinches in the middle and widens at both ends.',curve:'A systematic bend means the model misses a pattern — try a different functional form or a missing driver.'}[k]};}},
   {make:r=>{const z=Array.from({length:12},()=>round(rngGauss(r)*1.3,2));z[ri(r,0,11)]=round((r()<.5?-1:1)*rr(r,2.2,3.4),2);const a=z.filter(v=>Math.abs(v)>2).length;
    return {type:'num',exhibit:Exhibit.table(['Store','Standardized residual'],z.map((v,i)=>[i+1,fmtNum(v,2)])),q:'Using the ±2 rule, how many stores get flagged for investigation?',a,tol:0,
     hint:'Flag any |standardized residual| > 2.',solution:`${a} store${a===1?'':'s'} beyond ±2.`,why:'A flagged store might be an error, a different population, or a rare but valid outcome. Investigate before deciding.'};}},
   {type:'mc',q:'A store is flagged with a standardized residual of 3.1. What should you do first?',opts:['Investigate it — check records for errors, a different population, or a real shock','Delete it','Ignore the flag','Rerun the model until the flag disappears'],a:0,
    why:'Large residuals are risk signals, not mistakes to erase. Exclude only with a documented, defensible reason.'},
   {make:r=>{const se=round(rr(r,1,6),2),n0=pick([25,50,100]),m=4;return {type:'num',q:`With n = ${n0}, a coefficient’s SE is <b>${se}</b>. Roughly what SE would n = <b>${n0*m}</b> produce, other things equal?`,a:se/2,tol:.011,
    hint:'Quadrupling n divides the SE by √4.',solution:`${se} / 2 = ${round(se/2,3)}.`,why:'Standard errors shrink roughly with 1/√n — precision improves, but bias from a bad specification does not go away with more data.'};}},
   {type:'mc',q:'Three sampling distributions of β̂: A is centered on β but wide, B is centered on β and narrow, C is centered away from β. Which describes an unbiased, precise estimator?',opts:['B','A','C','None — precision and unbiasedness conflict'],a:0,
    why:'Unbiased means centered on the true β across samples; precise means tightly clustered. C is biased; A is unbiased but imprecise.'},
  ]};
