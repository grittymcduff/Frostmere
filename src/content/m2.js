/* ==========================================================================
   MODULE 2 — Ordinary Least Squares for managerial decisions
   Three stones: the Least-Squares Loom (OLS mechanics), Big Andy's Burger
   Barn (multivariate interpretation), the Mirror of Fit (R² and adjusted R²).
   ========================================================================== */

/* ---- generators ---- */
function genTiny(r){ // 4–5 points and a candidate line, for hand SSE
  const n=ri(r,4,5),b0=ri(r,1,4),b1=ri(r,2,4),x=[],y=[];
  for(let i=1;i<=n;i++){x.push(i);y.push(b0+b1*i+ri(r,-2,2));}
  const e=y.map((v,i)=>v-(b0+b1*x[i]));return {x,y,b0,b1,e,sse:e.reduce((s,v)=>s+v*v,0)};
}
function genAndy(r){
  const P=[],A=[],S=[];
  for(let i=0;i<75;i++){const p=round(rr(r,4.8,6.5),2),a=round(rr(r,.5,3.1),1);P.push(p);A.push(a);S.push(round(118.9-7.9*p+1.86*a+rngGauss(r)*4.9,1));}
  const m=Stats.ols(P.map((p,i)=>[p,A[i]]),S,['PRICE','ADVERT']);return {m,b0:m.b[0],b1:m.b[1],b2:m.b[2]};
}
const andyEx=d=>Exhibit.excel(d.m,'SALES ($1,000s) · PRICE in $ · ADVERT in $1,000s');
function genFitPair(r){ // model A: X1 only; model B: X1 + pure noise. Keep draws where adjusted R² falls.
  for(let t=0;t<40;t++){
    const n=ri(r,18,30),X1=[],Z=[],Y=[];
    for(let i=0;i<n;i++){const x=rr(r,10,60);X1.push(x);Z.push(rr(r,0,100));Y.push(50+2.2*x+rngGauss(r)*22);}
    const A=Stats.ols(X1,Y,['Price']),B=Stats.ols(X1.map((x,i)=>[x,Z[i]]),Y,['Price','Noise']);
    if(B.adjR2<A.adjR2)return {n,A,B};
  }
}

NODES['m2-ols']={kicker:'Module 2 · How OLS works',title:'The Least-Squares Loom',
  intro:'The loom weaves a line through a cloud of points by choosing the coefficients that make the squared misses as small as possible. Excel does the weaving — you need to know what it is optimizing, and what the ANOVA table is telling you.',
  lessons:[
   {title:'What least squares minimizes',
    teach:`<p>OLS picks b₀ and b₁ to minimize the <b>sum of squared residuals</b>:</p><div class="ex">Σeᵢ² = Σ(Yᵢ − Ŷᵢ)²</div>
    <p>Squaring stops positive and negative misses from canceling, and it punishes big misses more than small ones. One handy result: OLS residuals <b>sum to zero</b> — the fitted model doesn’t systematically over- or underpredict within the sample.</p>
    <p>OLS reduces <b>model error</b>, not business risk: demand shifts, policy changes, and competitor moves are still out there.</p>
    <div class="ex"><b>Estimator</b> = the recipe: a procedure applied to sample data. OLS is an estimator.<br><b>Estimate</b> = the result: the number the recipe produces from one sample, like b₁ = 2.4. (Lowercase b’s mean the same as β-hats.)</div>`,
    practice:[
     {make:r=>{const d=genTiny(r);return {type:'num',exhibit:Exhibit.table(['x','y','ŷ = '+d.b0+' + '+d.b1+'x','e = y − ŷ'],d.x.map((x,i)=>[x,d.y[i],d.b0+d.b1*x,d.e[i]])),
       q:'Square each residual and add them up. What is Σe²?',a:d.sse,tol:.01,hint:'Square each value in the last column, then sum.',solution:`${d.e.map(v=>`(${v})²`).join(' + ')} = ${d.sse}.`,why:'This is exactly the quantity OLS makes as small as possible.'};}},
     {type:'mc',q:'Why does OLS square the residuals instead of just adding them?',opts:['So misses don’t cancel, and big misses count more','To make the residuals larger and easier to compare','Because spreadsheets can’t sum negative numbers reliably','So the intercept is always estimated correctly'],a:0,why:'Raw residuals from OLS sum to zero, so their plain sum can’t measure fit.'},
    ]},
   {title:'Explained and unexplained variation',
    teach:`<p>Total variation in Y splits into what the model explains and what it leaves behind:</p>
    <div class="ex"><b>TSS = ESS + RSS</b><br>Excel ANOVA: Total SS = Regression SS + Residual SS</div>
    <p>Degrees of freedom are the price of complexity: Regression df = k, Residual df = n − k − 1, Total df = n − 1 (k = number of predictors).</p>
    <p>The same table gives you fit: <b>R² = ESS / TSS = 1 − RSS / TSS</b>, the share of total variation the model explains (Regression SS ÷ Total SS in Excel).</p>`,
    practice:[
     {make:r=>{const ess=round(rr(r,200,900),1),rss=round(rr(r,80,400),1);return {type:'num',q:`Regression SS = <b>${ess}</b> and Residual SS = <b>${rss}</b>. What is Total SS?`,a:ess+rss,tol:.05,hint:'TSS = ESS + RSS',solution:`${ess} + ${rss} = ${round(ess+rss,1)}.`,why:'Total variation = explained + unexplained.'};}},
     {make:r=>{const n=ri(r,20,80),k=ri(r,1,4);return {type:'num',q:`A model has <b>${n}</b> observations and <b>${k}</b> predictor${k>1?'s':''}. What is the residual df?`,a:n-k-1,tol:0,hint:'n − k − 1',solution:`${n} − ${k} − 1 = ${n-k-1}.`,why:'Each predictor (and the intercept) uses up one degree of freedom.'};}},
    ]},
  ],
  puzzles:[
   {type:'mc',q:'Ordinary Least Squares chooses the coefficients that…',opts:['Minimize the sum of squared residuals','Maximize the number of significant variables','Make every residual equal to zero','Minimize the sum of the residuals'],a:0,
    why:'OLS minimizes Σ(Yᵢ − Ŷᵢ)². (The plain sum of OLS residuals is always zero, so minimizing it would be meaningless.)'},
   {make:r=>{const d=genTiny(r);return {type:'num',exhibit:Exhibit.table(['x','y'],d.x.map((x,i)=>[x,d.y[i]]))+Exhibit.eq(`Candidate line: ŷ = ${d.b0} + ${d.b1}x`),
    q:'Compute the sum of squared residuals for this candidate line.',a:d.sse,tol:.01,hint:'For each row: e = y − ŷ, then square and add.',solution:`Residuals ${d.e.join(', ')} → Σe² = ${d.sse}.`,
    why:'OLS would search over every possible line and keep the one with the smallest Σe².'};}},
   {type:'mc',q:'You run OLS with an intercept and add up all the residuals. You get…',opts:['Zero (up to rounding)','The residual sum of squares','The standard error of the regression','R², the share of variation explained'],a:0,
    why:'Σeᵢ = 0 is a built-in property of OLS with an intercept: no systematic over- or underprediction within the sample.'},
   {make:r=>{const n=ri(r,20,40),X=[],Y=[];for(let i=0;i<n;i++){const x=rr(r,5,50);X.push(x);Y.push(30+3*x+rngGauss(r)*18);}const m=Stats.ols(X,Y,['Traffic']);
    return {type:'num',exhibit:Exhibit.excel(m,'Daily sales ($)').replace(/<tr><td>R Square<\/td>.*?<\/tr>/,'<tr><td>R Square</td><td class="n">?</td></tr>').replace(/<tr><td>Multiple R<\/td>.*?<\/tr>/,'<tr><td>Multiple R</td><td class="n">?</td></tr>').replace(/<tr><td>Adjusted R Square<\/td>.*?<\/tr>/,'<tr><td>Adjusted R Square</td><td class="n">?</td></tr>'),
     q:'The R² cells are hidden. Use the ANOVA table to compute <b>R²</b>.',a:m.R2,tol:.002,hint:'R² = Regression SS / Total SS (or 1 − Residual SS / Total SS).',
     solution:`${Exhibit.xl(m.SSR)} / ${Exhibit.xl(m.SST)} = ${Exhibit.xl(m.R2)}.`,why:'R² is the share of total variation the model explains: ESS / TSS.'};}},
   {type:'mc',q:'A colleague says, “OLS is an estimate and b₁ = 2.4 is the estimator.” What’s the correction?',opts:['Swap them: OLS is the estimator; 2.4 is the estimate','Nothing — the two words mean the same thing here','b₁ = 2.4 is the population parameter, not an estimate','Both are estimators; “estimate” is only for forecasts'],a:0,
    why:'An estimator is the procedure applied to sample data; an estimate is the number it produces. Lowercase b’s are the same as beta-hats.'},
  ]};

NODES['m2-andy']={kicker:'Module 2 · Multiple regression',title:'Big Andy’s Burger Barn',
  intro:'Big Andy runs 75 franchises in similar-sized cities and wants to know how monthly sales relate to menu price and advertising. SALES and ADVERT are in $1,000s; PRICE is in dollars. Each coefficient holds the other driver constant.',
  lessons:[
   {title:'Holding other factors constant',
    teach:`<p>A multiple-regression coefficient answers: <b>what happens to Y when this X rises by one unit, with the other included X’s held fixed?</b></p>
    <div class="ex">SALARY ($000) = 3.17 + 1.40·EXPERIENCE + 0.25·SCORE<br>Holding score constant, one more year of experience ↔ about <b>$1,404</b> more salary.<br>Holding experience constant, one more test point ↔ about <b>$251</b> more.</div>
    <p>Don’t compare coefficient sizes across variables measured in different units.</p>`,
    practice:[
     {type:'mc',q:'In SALARY ($000) = 3.17 + 1.40·EXPERIENCE + 0.25·SCORE, what does 0.25 mean?',opts:['With experience fixed, one more point ≈ $250 more salary','One more point causes exactly $0.25 more salary','Score matters less than experience, since 0.25 < 1.40','Each extra point adds about 25% to salary'],a:0,
      why:'Salary is in thousands, so 0.25 → $250, and the comparison holds experience fixed. Different units mean the sizes aren’t directly comparable.'},
     {type:'mc',q:'Why might a single-variable model of sales on advertising mislead?',opts:['It can mix in drivers, like price, that move with ads','Single-variable models always have too low an R²','Advertising effects are too small to detect alone','One variable can’t produce a significant F-test'],a:0,
      why:'Multiple regression asks whether a driver still matters after accounting for the others.'},
    ]},
   {title:'From coefficient to a pricing move',
    teach:`<p>Translate coefficients into realistic changes and the stated units.</p>
    <div class="ex">b(PRICE) = −7.908, SALES in $1,000s<br>$0.10 price cut: −7.908 × (−0.10) = 0.7908 thousand ≈ <b>+$791</b> monthly revenue</div>
    <p>And remember: extra revenue isn’t profit. $1,000 more advertising that brings $1,863 in revenue leaves $863 <b>before</b> food, labor, and other costs.</p>`,
    practice:[
     {make:r=>{const b=round(rr(r,-9.5,-6.2),3),c=pick([.05,.10,.15,.25]),a=-b*c*1000;return {type:'num',q:`The price coefficient is <b>${b}</b> (SALES in $1,000s). A <b>$${c.toFixed(2)}</b> price <b>cut</b> is associated with how much more monthly revenue, in dollars?`,a,tol:1,pre:'$',
       hint:'coefficient × change in price, then × 1,000',solution:`${b} × (−${c.toFixed(2)}) × 1,000 = ${money(a,0)}.`,why:'Scale the coefficient to the change you are actually considering.'};}},
     {make:r=>{const b=round(rr(r,1.4,2.6),3),a=(b-1)*1000;return {type:'num',q:`Advertising coefficient <b>${b}</b> (both SALES and ADVERT in $1,000s). An extra $1,000 of advertising leaves how much revenue above the ad cost?`,a,tol:1,pre:'$',
       hint:'Extra revenue (b × $1,000) minus the $1,000 spent.',solution:`${money(b*1000,0)} − $1,000 = ${money(a,0)}.`,why:'That amount still isn’t profit — the extra sales carry their own food, labor, and franchise costs.'};}},
    ]},
  ],
  puzzles:[
   {make:r=>{const d=genAndy(r),b=round(d.b1,3);return {type:'mc',exhibit:andyEx(d),q:'How should Big Andy read the PRICE coefficient?',
    opts:[`A $1 price rise goes with about ${money(Math.abs(b)*1000,0)} ${b<0?'less':'more'} monthly revenue, ads fixed`,`A $1 price rise causes revenue to fall by ${Math.abs(b)} dollars, ads fixed`,`A $1,000 price rise goes with ${Math.abs(b)} dollars less revenue, ads fixed`,`Price explains about ${Math.round(Math.abs(b)*10)}% of the variation in revenue`],a:0,
    why:'SALES is in $1,000s, PRICE in dollars, and the reading is conditional on ADVERT. It’s an estimated association, not proof of a causal effect.'};}},
   {make:r=>{const d=genAndy(r),c=pick([.10,.20,.25]),a=-d.b1*c*1000;return {type:'num',exhibit:andyEx(d),q:`Andy cuts price by <b>$${c.toFixed(2)}</b> and keeps advertising unchanged. By how much does predicted monthly revenue change, in dollars?`,a,tol:2,pre:'$',
    hint:'PRICE coefficient × (−change) × 1,000.',solution:`${Exhibit.xl(d.b1)} × (−${c.toFixed(2)}) × 1,000 ≈ ${money(a,0)}.`,why:'Holding advertising constant is what lets you read the price coefficient alone.'};}},
   {make:r=>{const d=genAndy(r),inc=pick([400,500,750]),a=d.b2*inc-inc;return {type:'num',exhibit:andyEx(d),q:`Andy raises advertising by <b>$${inc}</b>. After paying for the ads, how much predicted revenue is left (before food, labor, and other costs)?`,a,tol:2,pre:'$',
    hint:`ADVERT is in $1,000s: $${inc} = ${inc/1000} units. Revenue gain = b(ADVERT) × ${inc/1000} × 1,000, then subtract $${inc}.`,solution:`${Exhibit.xl(d.b2)} × ${inc/1000} × 1,000 − ${inc} ≈ ${money(a,0)}.`,
    why:'An advertising decision should rest on incremental profit, not revenue — and this number still isn’t profit.'};}},
   {make:r=>{const d=genAndy(r),p=pick([5.2,5.5,5.8,6.1]),ad=pick([800,1200,1500,2000]),pred=d.m.predict([p,ad/1000])*1000;return {type:'num',exhibit:andyEx(d),
    q:`Predict monthly sales revenue, in dollars, for PRICE = <b>$${p.toFixed(2)}</b> and ADVERT = <b>$${ad.toLocaleString()}</b>.`,a:pred,tol:15,pre:'$',
    hint:`Convert ADVERT to $1,000s (${ad/1000}), plug both into the equation, then multiply the result by 1,000.`,solution:`(${Exhibit.xl(d.b0)} + ${Exhibit.xl(d.b1)} × ${p} + ${Exhibit.xl(d.b2)} × ${ad/1000}) × 1,000 ≈ ${money(pred,0)}.`,
    why:'A prediction is a planning baseline. Competition, local events, service, and weather can all move the actual result.'};}},
   {type:'mc',exhibit:Exhibit.eq('Course estimates: SALES ($000) = 118.91 − 7.908·PRICE + 1.863·ADVERT ($000)'),q:'Using the course’s Big Andy estimates: Option A (cut price $0.10) leaves ~$791 before other costs; Option B (+$500 ads) leaves ~$432 after the ad spend. What should Andy conclude?',
    opts:['A looks better, but neither figure is profit yet','Choose A — the model shows it earns $791 more profit','Choose B — ads build long-run sales the model can’t see','Either — the regression has already settled it'],a:0,
    why:'Regression compares expected outcomes; managers decide whether the expected gain justifies the cost and the risk.'},
  ]};

NODES['m2-fit']={kicker:'Module 2 · Fit and model selection',title:'The Mirror of Fit',
  intro:'The mirror flatters any model that adds a variable — R² can only go up. Your job is to tell real explanatory power from decoration.',
  lessons:[
   {title:'R² is fit, not proof',
    teach:`<p><b>R² = ESS / TSS = 1 − RSS / TSS</b> — the share of the sample’s variation in Y that the model explains.</p>
    <div class="ex">R² near 0 → a flat line explains almost none of the variation.<br>R² near 1 → a tight cloud — but still <b>no proof of causation</b>.</div>
    <p>Fit describes the sample. It doesn’t guarantee a useful decision rule.</p>`,
    practice:[
     {make:r=>{const tss=round(rr(r,500,1500),0),rss=round(tss*rr(r,.15,.7),0),a=1-rss/tss;return {type:'num',q:`TSS = <b>${tss}</b>, RSS = <b>${rss}</b>. What is R²?`,a,tol:.002,hint:'1 − RSS/TSS',solution:`1 − ${rss}/${tss} = ${round(a,3)}.`,why:'R² is the explained share of total variation.'};}},
     {type:'mc',q:'A model of sales on store traffic has R² = 0.96. What can you say?',opts:['Traffic and sales move closely together in this sample','More traffic definitely causes more sales in these stores','The model will forecast next year almost perfectly','No other variable could add much to the model'],a:0,why:'Strong fit describes the sample; it doesn’t validate a causal story or guarantee forecasts.'},
    ]},
   {title:'Adjusted R² and the price of complexity',
    teach:`<p>Adding any variable — even pure noise — can’t lower R², because TSS stays fixed and RSS can only fall or stay the same. That rewards <b>overfitting</b>.</p>
    <p><b>Adjusted R²</b> charges for each extra coefficient and <b>can fall</b> when a variable adds noise. Use it only to compare models with the <b>same dependent variable</b> in the same units.</p>
    <div class="ex">Adjusted R² = 1 − (1 − R²) × (n − 1) / (n − k − 1)<br>n = observations, k = predictors. A new variable must cut RSS enough to pay for the degree of freedom it uses.</div>
    <div class="ex">Mozzarella = f(Income): adj R² 0.88 → add “boat drownings”: 0.97. Better fit — no credible mechanism. It doesn’t belong.</div>`,
    practice:[
     {type:'mc',q:'You add a variable of random numbers to a model. R² will…',opts:['Stay the same or rise','Definitely fall','Become negative','Stay exactly the same'],a:0,why:'RSS can only decrease or stay the same when you add a regressor, so R² can’t fall.'},
     {type:'mc',q:'Which comparison is valid with adjusted R²?',opts:['Two monthly-sales models, one with an extra driver','A model of monthly sales vs. a model of monthly profit','A model of sales in dollars vs. one of sales in units','A sales model for one product vs. one for another'],a:0,why:'Same dependent variable, same units — otherwise it’s apples and oranges.'},
    ]},
  ],
  puzzles:[
   {type:'mc',q:'What does R² measure?',opts:['The share of Y’s sample variation the model explains','Whether the coefficients can be read as causal effects','The probability that the model is correctly specified','The average size of the prediction error, in Y’s units'],a:0,
    why:'R² = 1 − RSS/TSS describes in-sample fit — not causality or decision value.'},
   {make:r=>{const {n,A,B}=genFitPair(r),x=Exhibit.xl;return {type:'mc',
    exhibit:Exhibit.table(['Model','Variables','R²','Adjusted R²'],[['A','Price',x(A.R2),x(A.adjR2)],['B','Price + Noise',x(B.R2),x(B.adjR2)]])+`<p class="meta">Same ${n} stores, same dependent variable (weekly sales).</p>`,
    q:'Model B adds a variable. What do these results suggest?',opts:['The new variable isn’t earning its place','Model B is better, because its R² is higher','Model A is wrong, because its R² is lower','Adjusted R² can’t compare models with different sizes'],a:0,
    why:'R² can’t fall when a variable is added. Adjusted R² penalizes the extra coefficient and dropped, so the variable adds noise rather than information.'};}},
   {type:'mc',q:'Adding “U.S. deaths from falling off fishing boats” raises a mozzarella-consumption model’s adjusted R² from 0.88 to 0.97. Should it stay?',
    opts:['No — there’s no credible mechanism behind it','Yes — adjusted R² already penalizes useless variables','Yes — any variable that raises adjusted R² belongs','Only if its p-value is also below 0.05'],a:0,
    why:'Statistics are a filter; economic logic and judgment make the final call. A variable doesn’t belong just because it raises adjusted R².'},
   {type:'mc',q:'Model 1 explains <b>sales revenue ($)</b> with adjusted R² = 0.62. Model 2 explains <b>profit margin (%)</b> with adjusted R² = 0.81. What can you conclude?',
    opts:['Nothing — they explain different dependent variables','Model 2 is better, since its adjusted R² is higher','Model 1 is overfit, since its adjusted R² is lower','Profit is generally easier to predict than revenue'],a:0,
    why:'Compare adjusted R² only across models with the same dependent variable in the same units.'},
   {make:r=>{const n=ri(r,25,60),k=ri(r,2,5),R2=round(rr(r,.45,.85),3),a=1-(1-R2)*(n-1)/(n-k-1);return {type:'num',
    q:`A model has R² = <b>${R2}</b> with <b>n = ${n}</b> observations and <b>k = ${k}</b> predictors. Compute adjusted R².`,a,tol:.002,
    hint:'Adjusted R² = 1 − (1 − R²)(n − 1)/(n − k − 1)',solution:`1 − (1 − ${R2}) × ${n-1}/${n-k-1} = ${round(a,4)}.`,
    why:'Every extra predictor shrinks n − k − 1, so a variable must cut RSS enough to pay for the degree of freedom it uses.'};}},
  ]};
