/* ==========================================================================
   MODULE 6 — Regression and causation; choosing independent variables
   Stones: the Trial Orchard (random assignment, treatment effects) and the
   Missing Variable (omitted-variable bias, irrelevant variables, criteria).
   ========================================================================== */
function genTrial(r){
  const n=ri(r,4,6),T=[],C=[],eff=ri(r,8,22)*1000;
  for(let i=0;i<n;i++){T.push(Math.round((125000+eff+rngGauss(r)*5500)/100)*100);C.push(Math.round((125000+rngGauss(r)*5500)/100)*100);}
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;return {T,C,diff:mean(T)-mean(C),mT:mean(T),mC:mean(C)};
}

NODES['m6-trial']={kicker:'Module 6 · From association to causation',title:'The Trial Orchard',
  intro:'In the orchard, half the trees get the new fertilizer — by coin flip. Regression measures the size of the effect; the research design is what lets you call it causal.',
  lessons:[
   {title:'The counterfactual and random assignment',
    teach:`<p>Causation needs a credible comparison: what happened versus <b>what would have happened otherwise</b>. We can’t see both outcomes for the same store, so we build a control group.</p>
    <p><b>Random assignment</b> makes treatment and control similar in size, location, customers, and management — so the main systematic difference is the treatment itself.</p>
    <div class="ex">Regression estimates the size; the design supplies the causal interpretation.</div>`,
    practice:[
     {type:'mc',q:'Why randomize which stores get extra advertising?',opts:['So the groups are similar in everything except the advertising','So the sample is larger','So R² goes up','So Excel can run the model'],a:0,why:'Randomization balances observed and unobserved factors on average.'},
     {type:'mc',q:'A manager lets regional directors choose which stores get the new loyalty program. Why is a causal claim weaker?',opts:['Directors may pick stores that would have done well anyway','The sample is too small','The program can’t be measured','Regression can’t use 0/1 variables'],a:0,why:'Self-selected treatment means the groups may differ systematically — the coefficient could reflect that, not the program.'},
    ]},
   {title:'Treatment dummies measure the difference',
    teach:`<p>After the experiment, regress the outcome on a 0/1 treatment indicator:</p>
    <div class="ex">SALESᵢ = β₀ + β₁·TREATMENTᵢ + εᵢ<br>β₀ = control-group average · β₁ = treatment average − control average</div>
    <p>With 5 stores each: treatment average $143,000, control average $126,400 → β₁ = <b>$16,600</b>. Because assignment was random, that difference is evidence of a causal effect (with only 10 stores, it’s a classroom illustration).</p>`,
    practice:[
     {make:r=>{const mT=ri(r,130,160)*1000,mC=ri(r,110,mT/1000-4)*1000;return {type:'num',q:`Treatment stores average <b>$${mT.toLocaleString()}</b> in sales; control stores average <b>$${mC.toLocaleString()}</b>. What is β₁ in SALES = β₀ + β₁·TREATMENT?`,a:mT-mC,tol:1,pre:'$',
      hint:'Treatment mean − control mean',solution:`${money(mT,0)} − ${money(mC,0)} = ${money(mT-mC,0)}.`,why:'With a single 0/1 regressor, OLS returns the difference in group means.'};}},
     {type:'mc',q:'In that model, what does β₀ represent?',opts:['The control group’s average sales','The treatment group’s average sales','The total effect of advertising','Nothing meaningful'],a:0,why:'TREATMENT = 0 is the baseline, so the intercept is the control-group mean.'},
    ]},
  ],
  puzzles:[
   {make:r=>{const d=genTrial(r);return {type:'num',exhibit:Exhibit.table(['Store','Treatment','Sales'],[...d.T.map((v,i)=>[i+1,1,money(v,0)]),...d.C.map((v,i)=>[d.T.length+i+1,0,money(v,0)])]),
    q:'Stores were randomly assigned to extra advertising (Treatment = 1). Estimate β₁ in SALES = β₀ + β₁·TREATMENT.',a:d.diff,tol:2,pre:'$',
    hint:'β₁ equals the treatment-group average minus the control-group average.',solution:`${money(d.mT,0)} − ${money(d.mC,0)} ≈ ${money(d.diff,0)}.`,
    why:'Because treatment was randomly assigned, β₁ has a much stronger causal interpretation than the same number from observational data.'};}},
   {type:'mc',q:'What gives a regression coefficient a causal interpretation?',opts:['A research design — like random assignment — that creates a credible counterfactual','A p-value below 0.01','An R² above 0.9','Including many control variables'],a:0,
    why:'Regression is not what makes the conclusion causal; the design is.'},
   {type:'sort',q:'Which designs support a causal reading of the coefficient?',cats:['Stronger causal design','Association only'],
    items:[{t:'Coin-flip assignment of a price discount across comparable stores',c:0},{t:'Comparing stores whose managers chose to adopt a new system',c:1},{t:'Random assignment of a training program to half the call-center agents',c:0},{t:'Regressing sales on advertising across all stores last year',c:1}],
    why:'Random assignment balances other factors; self-selection and ordinary observational data leave confounders in play.'},
   {type:'mc',q:'Why can’t you just compare a store’s sales with and without extra advertising?',opts:['You can’t observe the same store both ways at the same time — you need a comparison group','Because sales are measured in dollars','Because advertising has no effect','You can, if you run the regression twice'],a:0,
    why:'The counterfactual for the same unit is unobservable, so a control group stands in for it.'},
   {type:'mc',q:'A 10-store experiment finds β₁ = $16,600. What’s the honest caveat?',opts:['With so few stores, the estimate is noisy — check its standard error before acting','Nothing; randomization makes it exact','The effect must be negative','Random assignment guarantees significance'],a:0,
    why:'Randomization supports a causal interpretation; sample size still governs precision.'},
  ]};

NODES['m6-omit']={kicker:'Module 6 · Choosing independent variables',title:'The Missing Variable',
  intro:'Something is missing from the model, and its effect has slipped into the error term. Find out when that creates bias, which way it pushes, and why stuffing in extra variables isn’t the cure.',
  lessons:[
   {title:'Omitted-variable bias',
    teach:`<p>Drop X₂ from the true model Y = β₀ + β₁X₁ + β₂X₂ + ε and its effect moves into the error. If X₂ moves with X₁, then X₁ is correlated with the error — Assumption 3 breaks.</p>
    <div class="ex">β₁* = β₁ + β₂·α₁ → <b>Bias = β₂·α₁</b><br>β₂ = effect of the omitted X₂ on Y · α₁ = slope of X₂ on X₁</div>
    <p>No bias if β₂ = 0 (X₂ doesn’t affect Y) <b>or</b> α₁ = 0 (X₂ unrelated to X₁). More data doesn’t fix it.</p>`,
    practice:[
     {make:r=>{const b2=round(rr(r,.2,1.5),2)*(r()<.3?-1:1),a1=round(rr(r,-.8,.8),2)||.4,bias=b2*a1;return {type:'num',q:`Omitted variable effect β₂ = <b>${b2}</b>; its relationship with the included X, α₁ = <b>${a1}</b>. What is the bias in β₁*?`,a:bias,tol:.006,
      hint:'Bias = β₂ × α₁',solution:`${b2} × ${a1} = ${round(bias,4)}.`,why:`${bias>0?'Positive bias: the estimate overstates β₁.':'Negative bias: the estimate understates β₁.'}`};}},
     {type:'mc',q:'Coffee and sleep both affect productivity, and heavy coffee drinkers sleep less. You omit sleep. The coffee coefficient…',opts:['Absorbs part of sleep’s effect and is biased','Stays unbiased','Becomes exactly zero','Only gets a larger standard error'],a:0,
      why:'Sleep affects productivity (β₂ ≠ 0) and moves with coffee (α₁ ≠ 0), so both bias conditions hold.'},
    ]},
   {title:'Irrelevant variables and the four criteria',
    teach:`<p>An <b>irrelevant</b> variable (true β = 0) doesn’t bias the others, but it adds noise: higher variance, larger SEs, smaller |t|, and often lower adjusted R².</p>
    <div class="ex"><b>Omitting something important → bias. Adding something useless → noise.</b></div>
    <p>To judge a variable, use all four criteria together: <b>1 Theory</b> · <b>2 t-test</b> (significant, expected sign) · <b>3 Adjusted R²</b> · <b>4 Coefficient stability</b> when it enters or leaves.</p>`,
    practice:[
     {type:'sort',q:'Which consequence goes with which mistake?',cats:['Omitted relevant variable','Included irrelevant variable'],
      items:[{t:'Biased coefficients that can even flip sign',c:0},{t:'Larger standard errors, but still unbiased',c:1},{t:'Breaks “holding other factors constant”',c:0},{t:'Adjusted R² slips slightly',c:1}],
      why:'Omission threatens validity; irrelevance threatens precision.'},
     {type:'mc',q:'Which criterion should carry the most weight when deciding if a variable belongs?',opts:['Theory','The t-score','Adjusted R²','Whether the other coefficients move'],a:0,why:'Theory first, statistics second — then use all four together.'},
    ]},
  ],
  puzzles:[
   {type:'sort',q:'Predict the direction of omitted-variable bias on β₁.',cats:['Overestimate (positive bias)','Underestimate (negative bias)'],
    items:[{t:'Omitted variable raises Y and moves with X₁',c:0},{t:'Omitted variable raises Y and moves against X₁',c:1},{t:'Omitted variable lowers Y and moves with X₁',c:1},{t:'Omitted variable lowers Y and moves against X₁',c:0}],
    why:'Bias = β₂·α₁. Same signs → positive bias (overestimate); opposite signs → negative bias (underestimate).'},
   {make:r=>{const b1=round(rr(r,1,4),2),b2=round(rr(r,.5,2.5),2),a1=round(rr(r,.2,.9),2),est=b1+b2*a1;return {type:'num',
    q:`True model: Y = β₀ + <b>${b1}</b>X₁ + <b>${b2}</b>X₂. You leave out X₂, and X₂ = α₀ + <b>${a1}</b>X₁ + v. What coefficient on X₁ should you expect to estimate?`,a:est,tol:.006,
    hint:'β₁* = β₁ + β₂·α₁',solution:`${b1} + ${b2} × ${a1} = ${round(est,4)}.`,why:'The included variable gets credit for part of the omitted variable’s effect.'};}},
   {type:'mc',q:'Dropping population from Woody’s model moves the competition coefficient from −10,605 (t = −5.07) to −1,684 (t = −0.81). What’s the likely explanation?',
    opts:['Omitted-variable bias — population affects sales and is correlated with competition','Population was irrelevant all along','Competition never mattered','A data-entry error in competition'],a:0,
    why:'Large coefficient changes across defensible specifications deserve investigation — here, the classic omitted-variable story.'},
   {type:'mc',q:'In a Brazilian-coffee demand model, its own price has a positive, insignificant coefficient. What’s the theory-first move?',
    opts:['Keep price and look for a missing substitute price, like Colombian coffee','Drop price — it isn’t significant','Conclude demand ignores price','Flip the sign by hand'],a:0,
    why:'Adding the substitute price restored the negative own-price coefficient. Don’t drop a variable theory says belongs just because one sample gives it a weak t.'},
   {type:'sort',q:'Sensitivity analysis or data mining?',cats:['Sensitivity analysis','Data mining'],
    items:[{t:'Start from theory, then check whether the key result survives reasonable alternatives',c:0},{t:'Add and drop variables until p-values look good',c:1},{t:'Report the model with and without SAT to test robustness',c:0},{t:'Search 40 variables and keep whichever three are significant',c:1}],
    why:'Sensitivity analysis tests a story; data mining creates one from the sample. Document the specifications you tried.'},
  ]};
