/* ==========================================================================
   MODULE 3 — Regression design for managerial decisions
   Two stones: the Architect's Stone (six-step design, signs, units, outliers)
   and the Fork of Categories (dummy variables).
   ========================================================================== */
const SIX_STEPS=['Anchor the question in an economic mechanism','Specify Y, X, units, and functional form','Predict the expected signs','Inspect the data and justify any changes','Estimate and evaluate in Excel','Document the model and defend the recommendation'];

function genSalary(r){
  const E=[],S=[],D=[],Y=[];
  for(let i=0;i<20;i++){const e=ri(r,0,10),s=ri(r,70,100),d=r()<.5?1:0;E.push(e);S.push(s);D.push(d);Y.push(round(8+1.15*e+.197*s+2.3*d+rngGauss(r)*2.4,1));}
  if(D.every(v=>v===D[0]))D[0]=1-D[0];
  const m=Stats.ols(E.map((e,i)=>[e,S[i],D[i]]),Y,['Experience','Score','Degree']);return {m};
}
function genLaunch(r){
  for(;;){const C=[],Dd=[],M=[];
    for(let i=0;i<40;i++){const u=r(),c=u>.45&&u<=.85?1:0,d=u>.85?1:0;C.push(c);Dd.push(d);M.push(round(18.5+2.4*c+5.5*d+rngGauss(r)*2.2,2));}
    const nc=C.reduce((a,b)=>a+b,0),nd=Dd.reduce((a,b)=>a+b,0);if(nd<3||nc<3||40-nc-nd<3)continue;
    const m=Stats.ols(C.map((c,i)=>[c,Dd[i]]),M,['Commercial','Defense']);return {m};}
}

NODES['m3-design']={kicker:'Module 3 · Designing a regression',title:'The Architect’s Stone',
  intro:'The most important regression work happens before Excel. The architect wants to see your blueprint: mechanism, specification, expected signs, and a disciplined look at the data — then a model you can defend.',
  lessons:[
   {title:'Six steps, mechanism first',
    teach:`<div class="ex">${SIX_STEPS.map((s,i)=>`${i+1} · ${s}`).join('<br>')}</div>
    <p>Step 1 is the anchor: explain <b>why</b> the outcome should respond to each driver before you open the spreadsheet. Data can’t supply missing business logic. Pick variables because the mechanism supports them, not because they’re available — and write down the expected signs <b>before</b> you see results.</p>
    <p><b>Step 6, documenting</b>, means reporting enough for another manager to reproduce and challenge the model: coefficients with units, standard errors or confidence intervals, t-statistics and p-values, R² and adjusted R², sample size N, any data changes or exclusions, and the assumptions and limitations — inconvenient results included.</p>`,
    practice:[
     {type:'mc',q:'A manager wants to start by pulling every column in the data warehouse into a regression to “see what sticks.” Which step did they skip?',opts:['Anchoring the question in an economic mechanism','Documenting the model','Estimating in Excel','Inspecting the residuals'],a:0,
      why:'Choose drivers because the business mechanism supports them — not because they’re available. Mining until something “works” is the opposite of step 1.'},
     {type:'mc',q:'When should you record the expected sign of each coefficient?',opts:['Before you estimate the model','After you see which ones are significant','Only if a result surprises you','Never — the data decide the sign'],a:0,
      why:'Expected signs turn reasoning into testable predictions. Writing them afterwards just rationalizes the output.'},
    ]},
   {title:'Units and unusual observations',
    teach:`<p>Read every coefficient in the stated units of <b>both</b> variables.</p>
    <div class="ex">Sales ($000) = 420 + 18 × Advertising ($000)<br>$1,000 more advertising → 18 × $1,000 = <b>$18,000</b><br>$1 more advertising → 0.018 × $1,000 = <b>$18</b></div>
    <p>An outlier may be a data-entry error, an observation from a different population, or a rare but valid outcome. <b>Flag, investigate, document</b> — and exclude only with a defensible reason, never because it weakens your result.</p>`,
    practice:[
     {make:r=>{const c=ri(r,6,40);return {type:'num',exhibit:Exhibit.eq(`Sales ($000) = ${ri(r,200,600)} + ${c} × Advertising ($000)`),q:'How many <b>dollars</b> of extra predicted sales go with <b>$1</b> more advertising?',a:c,tol:.01,pre:'$',
       hint:'$1 is 1/1,000 of an advertising unit, and sales are in thousands.',solution:`${c} × (1/1,000) × $1,000 = $${c}.`,why:'When Y and X share the same scaling, the coefficient also reads as dollars per dollar.'};}},
     {type:'mc',q:'Which is a defensible reason to drop an observation?',opts:['Records confirm it was a data-entry error','It makes the coefficient insignificant','It lowers R²','It looks unusual on the scatterplot'],a:0,
      why:'Exclude only with documentation and a defensible reason — like a verified error or a store from a different population.'},
    ]},
  ],
  puzzles:[
   {type:'order',q:'Put the six steps of applied regression in order.',items:SIX_STEPS,
    why:'Mechanism → specification → expected signs → data inspection → estimation → documentation. The process is iterative: new information can send you back a step.'},
   {type:'sort',q:'A restaurant chain models <b>annual store sales</b>. Sort each driver by its expected sign.',cats:['Negative','Positive','Ambiguous'],
    items:[{t:'Number of direct competitors nearby',c:0},{t:'Residents in the market area',c:1},{t:'Average household income',c:2},{t:'Students per teacher (in a model of test scores)',c:0}],
    why:'More competitors split customers (−); more residents grow the market (+); income depends on the restaurant’s positioning (±, likely +). More students per teacher may reduce attention, lowering scores (−).'},
   {make:r=>{const c=round(rr(r,.25,.6),3),k=pick([1000,5000,10000]),a=c*k;return {type:'num',
    exhibit:Exhibit.eq(`Predicted SALES ($) = 102,192 − 9,075·COMPETITION + ${c}·POPULATION + 1.288·INCOME`),
    q:`The chain is choosing between two sites. One has <b>${k.toLocaleString()}</b> more residents. Holding competition and income constant, how much higher are its predicted annual sales?`,a,tol:.6,pre:'$',
    hint:'The population coefficient is dollars per resident.',solution:`${c} × ${k.toLocaleString()} = ${money(a,0)}.`,
    why:'A per-resident coefficient looks tiny until you scale it to a managerially meaningful change.'};}},
   {type:'mc',q:'One store in the data reports annual sales ten times larger than any other. What’s the disciplined response?',
    opts:['Flag it and check operating records — it could be an error, a different kind of store, or a real outlier','Delete it so the model fits better','Keep it but don’t mention it','Duplicate it so the model learns from it'],a:0,
    why:'Inspect and justify — never clean automatically. Dropping an observation changes the estimates, the standard errors, the fit, and the degrees of freedom.'},
   {type:'mc',q:'Which of these belongs in Step 6, documenting the model?',
    opts:['Coefficients with units, standard errors, R² and adjusted R², N, data exclusions, and limitations','Only the coefficients that came out significant','Only R², since it summarizes everything','Nothing — a good model speaks for itself'],a:0,
    why:'Documentation makes the analysis reproducible, challengeable, and defensible — including inconvenient results.'},
  ]};

NODES['m3-dummy']={kicker:'Module 3 · Dummy variables',title:'The Fork of Categories',
  intro:'At the fork, the road splits by category — degree or no degree, government or commercial or defense. Categories can enter a regression only as 0/1 switches, measured against a baseline.',
  lessons:[
   {title:'Categories as 0/1 switches',
    teach:`<p>A <b>dummy variable</b> turns a two-category condition into a number: 1 if present, 0 if absent.</p>
    <div class="ex">Salary = b₀ + b₁·Experience + b₂·Score + b₃·Degree<br>Degree = 1 with a relevant graduate degree, 0 otherwise</div>
    <p>b₃ is the predicted salary <b>difference from the baseline</b> (Degree = 0), holding experience and score constant. A dummy <b>shifts the intercept</b>; the slopes stay the same.</p>`,
    practice:[
     {make:r=>{const b=round(rr(r,1.5,4),2);return {type:'mc',q:`In a salary model (salary in $000), the Degree coefficient is <b>${b}</b>. What does it mean?`,
      opts:[`Holding experience and score constant, degree holders are predicted to earn about $${Math.round(b*1000).toLocaleString()} more than those without`,`A degree raises salary by ${b}%`,`Everyone in the sample earns $${Math.round(b*1000).toLocaleString()} more`,`Degree holders earn ${b} times as much`],a:0,
      why:'A dummy coefficient is an adjusted difference from the 0 (baseline) category, in Y’s units.'};}},
     {type:'mc',q:'On a chart of salary against experience, adding a Degree dummy does what to the fitted lines?',opts:['Shifts the line up or down — same slope, different intercept','Changes the slope only','Rotates the line around the origin','Nothing visible'],a:0,why:'A dummy changes the intercept while the slopes are held constant.'},
    ]},
   {title:'k − 1 dummies and the trap',
    teach:`<p>A category with <b>k</b> groups needs <b>k − 1</b> dummies. The omitted group is the <b>baseline</b>.</p>
    <div class="ex">Government (baseline) · Commercial · Defense<br>D₁ = 1 if Commercial · D₂ = 1 if Defense<br>Margin = β₀ + β₁D₁ + β₂D₂ → β₀ = Government’s predicted margin; β₂ = Defense minus Government</div>
    <p>Include all three dummies with an intercept and they always sum to 1 — exactly the intercept’s column. That’s <b>perfect multicollinearity</b>, the <b>dummy-variable trap</b>. Never code categories 1, 2, 3 either — that implies a ranking and equal spacing.</p>`,
    practice:[
     {make:r=>{const k=ri(r,3,6);return {type:'num',q:`A variable has <b>${k}</b> categories. How many dummy variables go into a model with an intercept?`,a:k-1,tol:0,hint:'k − 1',solution:`${k} − 1 = ${k-1}.`,why:'The omitted category is the baseline every coefficient is compared against.'};}},
     {type:'mc',q:'Why not code customer type as Government = 1, Commercial = 2, Defense = 3 in one variable?',opts:['It implies a ranking and equal distances between types that don’t exist','Excel can’t read numbers above 2','It would make R² too high','It is the same as using dummies'],a:0,why:'Categories have no numeric order; dummies let each group have its own shift from the baseline.'},
    ]},
  ],
  puzzles:[
   {make:r=>{const d=genSalary(r),b=d.m.b[3];return {type:'mc',exhibit:Exhibit.excel(d.m,'Salary ($000) · Degree = 1 with graduate degree'),
    q:'How should you read the Degree coefficient?',
    opts:[`Holding experience and score constant, degree holders are predicted to earn about ${money(Math.abs(b)*1000,0)} ${b>=0?'more':'less'} than non-holders`,`A degree causes a ${round(Math.abs(b),2)}% raise`,`Degree holders earn ${round(Math.abs(b),2)} thousand dollars in total`,`The Degree coefficient is the baseline salary`],a:0,
    why:'The dummy coefficient is an adjusted difference from the Degree = 0 baseline. Check its p-value too: a difference can be economically sizable yet estimated imprecisely.'};}},
   {make:r=>{const d=genSalary(r),e=ri(r,1,10),s=ri(r,72,98),deg=r()<.5?1:0,a=d.m.predict([e,s,deg]);return {type:'num',exhibit:Exhibit.excel(d.m,'Salary ($000)'),
    q:`Predict the salary (in $000) of a programmer with <b>${e}</b> years of experience, an aptitude score of <b>${s}</b>, and <b>${deg?'a':'no'}</b> graduate degree.`,a,tol:.05,unit:'thousand',
    hint:`Degree = ${deg}. Use Intercept + Exp×${e} + Score×${s} + Degree×${deg}.`,solution:`${Exhibit.xl(d.m.b[0])} + ${Exhibit.xl(d.m.b[1])}×${e} + ${Exhibit.xl(d.m.b[2])}×${s} + ${Exhibit.xl(d.m.b[3])}×${deg} ≈ ${fmtNum(a,2)}.`,
    why:'For the dummy, plug in 0 or 1 — it simply switches the degree shift on or off.'};}},
   {make:r=>{const d=genLaunch(r),pickT=pick(['Government','Commercial','Defense']),a=pickT==='Government'?d.m.b[0]:pickT==='Commercial'?d.m.b[0]+d.m.b[1]:d.m.b[0]+d.m.b[2];return {type:'num',
    exhibit:Exhibit.excel(d.m,'Launch margin (%) · Government is the baseline'),q:`What is the predicted launch margin for a <b>${pickT}</b> contract?`,a,tol:.02,unit:'%',
    hint:pickT==='Government'?'Government is the baseline: both dummies are 0.':`Baseline (intercept) plus the ${pickT} coefficient.`,
    solution:pickT==='Government'?`Intercept = ${fmtNum(a,2)}%.`:`${Exhibit.xl(d.m.b[0])} + ${Exhibit.xl(pickT==='Commercial'?d.m.b[1]:d.m.b[2])} = ${fmtNum(a,2)}%.`,
    why:'The intercept is the baseline group’s level; each dummy coefficient is that group’s difference from the baseline.'};}},
   {type:'mc',q:'An analyst includes Government, Commercial, and Defense dummies <b>and</b> an intercept. Excel balks. Why?',
    opts:['The three dummies always sum to 1 — the same as the intercept column — creating perfect multicollinearity (the dummy-variable trap)','There are too few observations','Dummy variables can’t be used with an intercept','Excel can only handle two dummies'],a:0,
    why:'Drop one category to serve as the baseline: k categories → k − 1 dummies.'},
   {make:r=>{const k=ri(r,3,7);return {type:'num',q:`A bank models loan losses across <b>${k}</b> regions and includes an intercept. How many region dummies should it use?`,a:k-1,tol:0,
    hint:'Categories minus one.',solution:`${k} − 1 = ${k-1}; the omitted region is the baseline.`,why:'Each coefficient then reads as that region’s difference from the baseline region.'};}},
  ]};
