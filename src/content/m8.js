/* ==========================================================================
   MODULE 8 — Multicollinearity
   Stone: the Twin Prisms (perfect vs imperfect, consequences, high R² with
   weak t-tests, correlations and VIFs, remedies and their risks).
   ========================================================================== */
// two predictors that move together: a regression with a strong F-test but weak individual t-tests
function genCollinear(r){
  for(let tries=0;tries<300;tries++){
    const n=ri(r,12,16),tv=[],on=[],y=[];
    for(let i=0;i<n;i++){const a=round(rr(r,10,60),1);tv.push(a);on.push(round(a*rr(r,.55,.65)+rngGauss(r)*1.2,1));}
    for(let i=0;i<n;i++)y.push(round(200+3.1*tv[i]+2.4*on[i]+rngGauss(r)*22,1));
    const res=Stats.ols(tv.map((v,i)=>[v,on[i]]),y,['TV_Ads','Online_Ads']);
    if(res.pF<.001&&res.coef[1].p>.12&&res.coef[2].p>.12&&res.R2>.85)return {res,tv,on,y};
  }
  return null;
}
NODES['m8-multi']={kicker:'Module 8 · Multicollinearity',title:'The Twin Prisms',
  intro:'Two prisms, nearly identical, split the same beam of light. When two drivers tell almost the same story, the regression still fits — but it can’t tell who deserves the credit.',
  lessons:[
   {title:'Perfect, imperfect, and what it costs',
    teach:`<p><b>Perfect</b> multicollinearity: one X is an exact linear function of others — distance in miles <i>and</i> kilometers, or a dummy for every category plus an intercept. OLS can’t estimate separate coefficients at all. It’s rare and easy to spot.</p>
    <p><b>Imperfect</b> multicollinearity: Xs move strongly together but not exactly — TV and online ad budgets. OLS still works, and if the other assumptions hold the estimates stay <b>unbiased</b>. The cost is <b>precision</b>:</p>
    <div class="ex">Standard errors rise → |t| falls → p-values rise<br>Coefficients swing when you add or drop a related variable or a few observations<br>Overall fit (R²) barely changes</div>
    <p>The classic warning sign: <b>high R² and a significant F-test, but few or no significant individual t-tests</b>. Together the variables clearly matter; the model just can’t separate them.</p>`,
    practice:[
     {type:'sort',q:'Perfect or imperfect multicollinearity?',cats:['Perfect','Imperfect'],
      items:[{t:'Store size in square feet and in square meters',c:0},{t:'TV and online ad spending, which usually rise together',c:1},{t:'Dummies for North, South, East, and West, plus an intercept',c:0},{t:'Household income and years of education',c:1}],
      why:'Perfect = an exact linear relationship (same information twice); imperfect = strong but not exact overlap.'},
     {type:'mc',q:'Two related ad variables are both in the model. Compared with a model where they were unrelated, their coefficients are…',
      opts:['Still unbiased, but less precise — larger standard errors','Biased toward zero','Biased away from zero','Exactly the same, with the same standard errors'],a:0,
      why:'Multicollinearity is a precision problem, not automatically a bias problem: the aim is still on target, just shakier.'},
    ]},
   {title:'Detecting it — and deciding what to do',
    teach:`<p><b>Correlation</b> between pairs of Xs is a quick screen (worry above about |r| = 0.7–0.8), but a <i>group</i> of variables can overlap without any single high pair.</p>
    <p>A <b>VIF</b> (variance inflation factor) asks how predictable one X is from all the others. Regress that X on the other Xs (an auxiliary regression) and take its R²:</p>
    <div class="ex">VIF = 1 / (1 − R²<sub>aux</sub>) &nbsp;·&nbsp; above 5 = warning, above 10 = serious (no universal cutoff)</div>
    <p><b>Remedies, in order:</b> 1 · often <b>do nothing</b> — if signs are right and the estimates are useful, leave it. 2 · drop a variable only if theory says it’s <b>redundant</b> — otherwise you trade imprecision for omitted-variable bias. 3 · get more data, if you can.</p>`,
    practice:[
     {make:r=>{const R=round(rr(r,.55,.95),2),v=1/(1-R);return {type:'num',q:`Regressing Cadence on the other explanatory variables gives an auxiliary R² of <b>${R}</b>. What is Cadence’s VIF?`,a:v,tol:.02,
      hint:'VIF = 1 / (1 − auxiliary R²)',solution:`1 / (1 − ${R}) = ${round(v,2)}.`,why:v>10?'Above 10: serious multicollinearity for Cadence.':v>5?'Above 5: a warning sign.':'Below 5: usually not a concern on its own.'};}},
     {type:'mc',q:'Price has a VIF of 8, the expected negative sign, and p = 0.002. What should you do about the multicollinearity?',
      opts:['Probably nothing — the estimate is still useful for the decision','Drop price to lower the VIF','Drop every variable with a VIF above 5','Collect a new sample before using the model'],a:0,
      why:'A high VIF doesn’t automatically mean removing a variable. Adjust only if multicollinearity is actually damaging the estimates you need.'},
    ]},
  ],
  puzzles:[
   {make:r=>{const d=genCollinear(r);if(!d)return {type:'mc',q:'High R² and a significant F-test, but no individual t-test is significant. What is the classic explanation?',opts:['Multicollinearity — the variables matter jointly but can’t be separated','The model is useless','Heteroskedasticity','A coding error'],a:0,why:'Joint significance with individual weakness is the signature of overlapping predictors.'};
    return {type:'mc',exhibit:Exhibit.excel(d.res,'Sales ($000)'),
     q:`The F-test is highly significant and R² = ${round(d.res.R2,2)}, but neither ad coefficient is significant on its own. Best reading?`,
     opts:['The two ad budgets matter jointly but overlap so much the model can’t separate their effects','Advertising has no effect on sales','The model is misspecified and should be discarded','One of the variables must be dropped to fix the bias'],a:0,
     why:'High R² + significant F + weak t-tests is the classic warning sign of multicollinearity: precision, not bias.'};}},
   {make:r=>{const rr_=round(rr(r,.80,.97),2),v=1/(1-rr_*rr_);return {type:'num',
    q:`A model has just two explanatory variables, and their correlation is <b>r = ${rr_}</b>. With only two Xs, the auxiliary R² is r². What is the VIF for each?`,a:v,tol:.05,
    hint:'Auxiliary R² = r²; then VIF = 1 / (1 − r²).',solution:`r² = ${round(rr_*rr_,4)}; VIF = 1 / (1 − ${round(rr_*rr_,4)}) = ${round(v,2)}.`,
    why:`${v>10?'Serious':v>5?'A warning-level':'Mild'} multicollinearity. Note how fast VIF climbs as r approaches 1.`};}},
   {type:'mc',q:'Which statement about the consequences of imperfect multicollinearity is correct?',
    opts:['Coefficients stay unbiased, but standard errors rise and estimates become sensitive to specification','Coefficients become biased and R² falls sharply','OLS can no longer be computed','t-scores rise, so everything looks more significant'],a:0,
    why:'Not bias — less precision, larger p-values, unexpected signs more likely, and big swings when related variables are added or dropped.'},
   {type:'mc',q:'Dropping Infrastructure makes Cadence’s p-value fall from 0.80 to 0.0002. What’s the risk in celebrating?',
    opts:['If Infrastructure truly matters and moves with Cadence, Cadence now carries omitted-variable bias','None — a lower p-value means a better model','Cadence’s coefficient can’t change','R² will collapse'],a:0,
    why:'Better significance is not automatically a better specification. Theory decides whether a variable belongs.'},
   {type:'sort',q:'Sort each response to multicollinearity.',cats:['Defensible','Not defensible'],
    items:[{t:'Leave it alone: signs are as expected and the key estimate is precise enough to decide',c:0},{t:'Drop whichever variable has the weaker p-value in this sample',c:1},{t:'Drop one of two variables that measure the same concept, keeping the one theory favors',c:0},{t:'Remove every variable with a VIF above 5',c:1},{t:'Collect more observations if that’s feasible',c:0}],
    why:'Diagnose first; adjust only if it’s hurting the model you need — and let theory, not p-values, choose what stays.'},
   {type:'mc',q:'Why does multicollinearity damage interpretation more than forecasting?',
    opts:['Overall fit and predictions can stay good while the separate coefficients are unstable and imprecise','Forecasts become biased while coefficients don’t','It lowers R², which only affects forecasts','It doesn’t affect either'],a:0,
    why:'If the Xs keep moving together as they did in the sample, joint predictions still work; it’s the “who gets the credit” question that suffers.'},
   {type:'mc',q:'No pair of explanatory variables has a correlation above 0.5, yet one VIF is 14. How is that possible?',
    opts:['A combination of several other variables predicts it well, even though no single pair is highly correlated','The VIF must be wrong','VIFs only use pairwise correlations','It means perfect multicollinearity'],a:0,
    why:'Correlation is a pairwise screen; VIF uses all the other Xs at once, so it catches group overlap.'},
  ]};
