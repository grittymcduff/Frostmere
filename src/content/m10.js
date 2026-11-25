/* ==========================================================================
   MODULE 10 — Heteroskedasticity
   Stone: the Widening Fan (residual-spread patterns, functional form vs
   changing variance, Breusch–Pagan and White, what it does and doesn't harm).
   ========================================================================== */
const CHI5={1:3.841,2:5.991,3:7.815,4:9.488,5:11.070,9:16.919};   // χ² critical values at α = .05

NODES['m10-hetero']={kicker:'Module 10 · Heteroskedasticity',title:'The Widening Fan',
  intro:'Frost fans out from the stone, thin at one end and wide at the other. When the size of the errors grows with the size of the observation, the average relationship can be fine — but the model’s confidence in itself is not.',
  lessons:[
   {title:'Constant spread versus a fan',
    teach:`<p><b>Homoskedasticity:</b> the error variance is the same for every observation (Var(εᵢ) = σ²). <b>Heteroskedasticity:</b> it changes systematically (Var(εᵢ) = σᵢ²) — usually growing with scale. It is most common in <b>cross-sectional</b> data that mixes small and large firms, stores, or missions.</p>
    <div class="ex">Residual plot warning shapes: a <b>spray</b> (widening), a <b>funnel</b> (narrowing), or a <b>bow-tie</b>.<br>A residual pattern that <b>curves</b> around zero is different: that points to the wrong <b>functional form</b> (a mean problem), not changing variance.</div>
    <p><b>Pure</b> heteroskedasticity: the equation is right, the variance still changes. <b>Impure</b>: caused by misspecification — an omitted variable or the wrong form. Check the equation first.</p>
    <p><b>Consequences:</b> coefficients are <b>not biased</b>, but OLS is no longer BLUE and the usual <b>standard errors are wrong</b>, so t-tests, p-values, and confidence intervals are unreliable.</p>`,
    practice:[
     {make:r=>{const k=pick(['spray','funnel','random']),d=genResid(r,k),keys=['random','spray','funnel'];return {type:'mc',exhibit:residPlot(d,'Store size'),
      q:'Residuals from a cross-section of stores. What does the plot suggest?',opts:keys.map(x=>RES_PATTERNS[x].d),a:keys.indexOf(k),
      why:'A spread that grows or shrinks with X is the visual signature of heteroskedasticity; an even band is what you hope to see.'};}},
     {type:'sort',q:'Under pure heteroskedasticity, which of these still hold?',cats:['Still OK','No longer trustworthy'],
      items:[{t:'Coefficient estimates are unbiased',c:0},{t:'The usual standard errors',c:1},{t:'p-values and confidence intervals from Excel’s default output',c:1},{t:'OLS is the minimum-variance (BLUE) estimator',c:1}],
      why:'Heteroskedasticity is a credibility problem for inference, not mainly a coefficient problem.'},
    ]},
   {title:'Breusch–Pagan and White',
    teach:`<p>Both tests regress the <b>squared residuals</b> on explanatory variables and ask whether anything explains the error size. H₀: constant variance.</p>
    <div class="ex"><b>Breusch–Pagan:</b> e² on the original Xs (a <i>narrow</i>, linear search). df = number of Xs.<br>
    <b>White:</b> e² on the Xs, their <b>squares</b>, and their <b>cross-products</b> (a <i>wide</i> search). With 2 Xs, df = 5.<br>
    Test statistic: <b>LM = n × R²</b> of that auxiliary regression → compare with χ²(df). Reject H₀ if LM &gt; critical value (or p ≤ .05).</div>
    <p>They can disagree without contradicting each other: in the course’s space-mission data, Breusch–Pagan found nothing (LM = 2.16, p = .34) while White did (LM = 12.81, p = .025). White simply looked for more kinds of patterns.</p>
    <p><b>Response:</b> fix the mean equation first (a U-shaped residual plot means a missing curve), re-estimate, re-test. If the variance still changes, use <b>robust standard errors</b>. Don’t pick the test that gives the answer you prefer.</p>`,
    practice:[
     {make:r=>{const n=pick([24,30,40,50]),R=round(rr(r,.05,.35),3),lm=n*R;return {type:'num',q:`A Breusch–Pagan auxiliary regression on <b>n = ${n}</b> observations has R² = <b>${R}</b>. What is the LM statistic?`,a:lm,tol:.02,
      hint:'LM = n × R² of the auxiliary regression',solution:`${n} × ${R} = ${round(lm,3)}.`,why:'Compare LM with the χ² critical value for the test’s degrees of freedom.'};}},
     {type:'mc',q:'Breusch–Pagan says “no heteroskedasticity” (p = .34); White says “yes” (p = .025) on the same data. Why?',
      opts:['White also searches squared and interaction patterns','One of the two tests must have been run incorrectly','White is always right; Breusch–Pagan is obsolete','They test different hypotheses about the coefficients'],a:0,
      why:'Narrow search found nothing; wider search found a pattern. That’s not a contradiction.'},
    ]},
  ],
  puzzles:[
   {make:r=>{const k=pick(['curve','spray']),d=genResid(r,k);return {type:'mc',exhibit:residPlot(d,'Fitted value'),
    q:'What is the first problem to address in this residual plot?',
    opts:k==='curve'?['The functional form — the residuals curve around zero','Heteroskedasticity — switch to robust standard errors','Serial correlation — run a Durbin–Watson test','Nothing — the residuals still average zero']
                    :['Heteroskedasticity — the spread widens with the fit','The functional form — the residuals bend around zero','Multicollinearity between the explanatory variables','Nothing — the residuals still average zero'],a:0,
    why:k==='curve'?'A systematic curve is a mean problem. Fix the equation before testing the variance — robust SEs can’t repair the wrong shape.':'A widening spread with no curve is the classic heteroskedasticity signature: the uncertainty grows with scale.'};}},
   {make:r=>{const test=pick(['BP','White']),df=test==='BP'?2:5,n=pick([24,30,40]),R=round(rr(r,.05,.45),3),lm=n*R,crit=CHI5[df];
    return {type:'mc',exhibit:Exhibit.table(['Test','n','Auxiliary R²','df','χ² critical (5%)'],[[test==='BP'?'Breusch–Pagan':'White',n,R,df,crit]]),
     q:`Compute LM = n × R² and decide at the 5% level.`,
     opts:[`LM = ${round(lm,2)} ${lm>crit?'>':'<'} ${crit} → ${lm>crit?'reject H₀: evidence of heteroskedasticity':'do not reject H₀: no convincing evidence'}`,
           `LM = ${round(lm,2)} ${lm>crit?'>':'<'} ${crit} → ${lm>crit?'do not reject H₀: no convincing evidence':'reject H₀: evidence of heteroskedasticity'}`,
           `LM = ${round(R/n,4)} → do not reject H₀`,`LM = ${round(n*(1-R),2)} → reject H₀`],a:0,
     why:`${n} × ${R} = ${round(lm,2)}, which is ${lm>crit?'above':'below'} the χ²(${df}) critical value of ${crit}.`};}},
   {type:'mc',q:'Why might White detect heteroskedasticity that Breusch–Pagan misses?',
    opts:['White also tests squared and cross-product terms','White uses the original Y instead of squared residuals','Breusch–Pagan only works with time-series data','White has fewer degrees of freedom, so it’s stricter'],a:0,
    why:'Two flashlights: Breusch–Pagan a narrow beam, White a wider one.'},
   {type:'mc',q:'Payload mass looks highly significant (p = 0.001), but residual spread widens sharply for heavier missions. What should the program manager conclude?',
    opts:['Its direction may be fine; its precision is suspect','The coefficient is biased, so payload may not matter','The wider spread makes the estimate more reliable','Nothing changes — p = 0.001 settles the question'],a:0,
    why:'The danger is false confidence: understated uncertainty exactly where the stakes are largest.'},
   {type:'order',q:'Put the response to a suspicious residual plot in order.',
    items:['Plot the residuals against fitted values or key Xs','If they curve, fix the mean equation (add the justified nonlinear term) and re-estimate','Re-check the new residuals and run Breusch–Pagan / White','If the variance still changes, use robust standard errors'],
    why:'Specification first, variance testing second, robust inference third.'},
   {type:'sort',q:'Where is heteroskedasticity most likely?',cats:['Likely','Less likely'],
    items:[{t:'Profits of a mix of corner shops and national chains',c:0},{t:'Cost overruns across routine launches and first-of-a-kind missions',c:0},{t:'Daily output of identical machines in one plant',c:1},{t:'Household spending across incomes from $20k to $2M',c:0}],
    why:'Whenever the size of the observation changes dramatically, ask whether the size of the error changes too.'},
   {type:'mc',q:'Which statement is correct?',
    opts:['Heteroskedasticity harms inference; wrong form harms the fit','Both problems bias the coefficients in the same direction','Robust standard errors repair a wrong functional form too','Heteroskedasticity only arises in time-series data'],a:0,
    why:'Mean problem vs variance problem: fixing standard errors cannot repair an incorrectly specified equation.'},
  ]};
