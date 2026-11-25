/* ==========================================================================
   MODULE 7 — Choosing the functional form
   Stone: the Bending Crystal (linear, double-log, semilog, quadratic, lags,
   extrapolation, curved residuals).
   ========================================================================== */
NODES['m7-form']={kicker:'Module 7 · Choosing the functional form',title:'The Bending Crystal',
  intro:'The crystal bends light the way the right equation bends a line: to match how the business actually works. Pick the shape from the mechanism, read the coefficients in the right units, and beware of what happens past the edge of the data.',
  lessons:[
   {title:'Shape follows the mechanism',
    teach:`<p>OLS needs the equation to be linear in the <b>coefficients</b>, not in the variables. X², ln(X), and ln(Y) are all fine, because each coefficient still just multiplies something and gets added.</p>
    <div class="ex"><b>Linear</b> Y = β₀ + β₁X → each extra unit of X adds β₁ (constant effect)<br>
    <b>Double-log</b> ln Y = β₀ + β₁ln X → β₁ is the <b>elasticity</b>: 1% more X → about β₁% more Y<br>
    <b>Semilog on X</b> Y = β₀ + β₁ln X → slope = β₁ / X (diminishing effect)<br>
    <b>Semilog on Y</b> ln Y = β₀ + β₁X → one more unit of X → about 100·β₁% more Y<br>
    <b>Quadratic</b> Y = β₀ + β₁X + β₂X² → slope = β₁ + 2β₂X (the effect changes with X)</div>
    <p>In a <b>linear</b> model the slope is constant but the elasticity is not: elasticity = β₁·X̄/Ȳ. Don’t choose a form just for a slightly higher R² — and you can’t compare R² at all once Y is logged in one model and not the other.</p>`,
    practice:[
     {type:'sort',q:'Which form tells each business story?',cats:['Linear','Double-log','Semilog on X (ln X)','Quadratic'],
      items:[{t:'Each extra delivery truck adds the same $4,000 of weekly revenue',c:0},{t:'A 1% price cut always lifts unit sales by about 1.8%, at any price level',c:1},{t:'The first $100 of extra income adds more food spending than the tenth $100',c:2},{t:'Crowding: output rises with staff up to a point, then falls',c:3}],
      why:'Constant unit effect → linear; constant elasticity → double-log; diminishing effect → ln X; a turning point → quadratic.'},
     {make:r=>{const b=round(rr(r,8,14),2),xb=round(rr(r,15,25),1),yb=round(rr(r,250,360),0),e=b*xb/yb;return {type:'num',
      exhibit:Exhibit.eq(`FoodExp = 92.3 + ${b}·Income &nbsp;·&nbsp; Income in $100s · mean Income = ${xb} · mean FoodExp = $${yb}`),
      q:'Compute the <b>elasticity at the means</b> for this linear model.',a:e,tol:.006,hint:'Elasticity = β₁ × X̄ / Ȳ',
      solution:`${b} × ${xb} / ${yb} = ${round(e,3)}.`,why:`A 1% rise in income is associated with about a ${round(e,2)}% rise in food spending — at the means. In a linear model the elasticity changes along the line.`};}},
    ]},
   {title:'Curves, lags, and the edge of the data',
    teach:`<p><b>Quadratic:</b> with Y = β₀ + β₁X + β₂X², the slope at a point is <b>β₁ + 2β₂X</b>. If β₁ > 0 and β₂ < 0 the curve rises then falls, peaking at <b>X* = −β₁ / (2β₂)</b>.</p>
    <p><b>Lags:</b> when cause and effect don’t happen together — advertising this month, sales next month — model the delay: Salesₜ = β₀ + β₁Advertisingₜ₋₁ + εₜ. The lag should come from how the business works, not a search for significance.</p>
    <p><b>Extrapolation:</b> every form is only checked inside the range you observed. Outside it, a polynomial can swing wildly, a log model can flatten too soon, and a straight line can miss a turning point.</p>
    <div class="ex">Residuals that <b>curve</b> systematically around zero (negative → positive → negative) say the shape is wrong: add the missing curve and re-estimate before trusting anything else.</div>`,
    practice:[
     {make:r=>{const b1=round(rr(r,40,90),1),b2=-round(rr(r,.8,2.5),2),X=ri(r,5,15),s=b1+2*b2*X;return {type:'num',
      exhibit:Exhibit.eq(`Profit = 120 + ${b1}·Ads − ${-b2}·Ads² &nbsp;·&nbsp; Ads in $000s`),
      q:`What is the slope — the change in predicted profit from one more $1,000 of ads — when Ads = <b>${X}</b>?`,a:s,tol:.02,hint:'Slope = β₁ + 2β₂X',
      solution:`${b1} + 2 × (−${-b2}) × ${X} = ${round(s,2)}.`,why:'In a quadratic the payoff from one more unit depends on where you start.'};}},
     {type:'mc',q:'A model of sales on house size was fit to homes from 800 to 3,000 sq. ft. A developer asks for a forecast for a 9,000 sq. ft. estate. Best response?',
      opts:['Warn that it’s far outside the data — the chosen shape may not hold there','Use the forecast; the R² is high','Switch to whichever form gives the biggest number','Extrapolation is safe if the form is quadratic'],a:0,
      why:'Predictions outside the observed range are where a wrong functional form does the most damage.'},
    ]},
  ],
  puzzles:[
   {type:'sort',q:'Match each mechanism to the functional form that fits it.',cats:['Linear','Double-log','Semilog on X (ln X)','Semilog on Y (ln Y)','Quadratic'],
    items:[{t:'Every extra customer adds the same $35 in revenue',c:0},{t:'Price responds to square footage with a stable elasticity',c:1},{t:'Training hours help, but each extra hour helps less',c:2},{t:'Each extra year of experience raises salary by about 4%',c:3},{t:'Delivery time falls with more drivers until congestion makes it rise',c:4}],
    why:'Pick the form that matches the mechanism — constant effect, constant elasticity, diminishing returns, constant % growth, or a turning point — not the prettiest R².'},
   {make:r=>{const b1=round(rr(r,6,14),2),b2=-round(rr(r,.15,.45),3),xs=-b1/(2*b2);return {type:'num',
    exhibit:Exhibit.eq(`Output = 40 + ${b1}·Staff − ${-b2}·Staff²`),
    q:'At what staffing level does predicted output <b>peak</b>?',a:xs,tol:.06,unit:'staff',hint:'The peak is where the slope β₁ + 2β₂X equals zero: X* = −β₁ / (2β₂).',
    solution:`X* = −${b1} / (2 × −${-b2}) = ${round(xs,2)}.`,why:'Past the peak, adding staff lowers predicted output — something a linear model could never show.'};}},
   {type:'mc',q:'Why can OLS estimate Y = β₀ + β₁X + β₂X² even though the relationship is curved?',
    opts:['It is still linear in the coefficients — X² is just another variable','OLS automatically bends the line','Because R² is higher','It can’t; you need a different estimator'],a:0,
    why:'OLS requires linearity in the coefficients, not in the variables. Y = β₀ + X^β₁ would not qualify.'},
   {make:r=>{const a=round(rr(r,3.8,4.6),4),b=round(rr(r,.92,1.12),4),S=ri(r,15,32)*100,p=Math.exp(a+b*Math.log(S));return {type:'num',
    exhibit:Exhibit.eq(`ln(Price) = ${a} + ${b}·ln(SQFT)`),
    q:`Predict the price, in dollars, of a <b>${S.toLocaleString()}</b> sq. ft. house.`,a:p,tol:p*.01,pre:'$',hint:'Compute ln(SQFT), plug it in to get ln(Price), then exponentiate: Price = e^(ln Price).',
    solution:`ln(${S}) = ${round(Math.log(S),4)}; ln(Price) = ${a} + ${b} × ${round(Math.log(S),4)} = ${round(a+b*Math.log(S),4)}; Price ≈ e^${round(a+b*Math.log(S),4)} ≈ ${money(p,0)}.`,
    why:`Interpret in logs, report in dollars. Here ${b} is the elasticity: 1% more space → about ${b}% higher price.`};}},
   {type:'mc',q:'Advertising runs this month, but customers take weeks to notice, compare, and buy. Which model fits the mechanism?',
    opts:['Salesₜ = β₀ + β₁Advertisingₜ₋₁ + εₜ','Salesₜ = β₀ + β₁Advertisingₜ + εₜ, because it’s simpler','Drop advertising — it isn’t significant this month','Salesₜ₋₁ = β₀ + β₁Advertisingₜ + εₜ'],a:0,
    why:'A lag represents the real timing of the decision; using only current advertising can understate the campaign.'},
   {make:r=>{const d=genResid(r,'curve');return {type:'mc',exhibit:residPlot(d,'Fitted value'),
    q:'A straight-line model leaves these residuals. What should you do first?',
    opts:['Revise the shape — add the missing curve (e.g. an X² or log term) and re-estimate','Nothing; residuals average zero','Drop the observations at both ends','Report robust standard errors and move on'],a:0,
    why:'A systematic curve means the average relationship is misspecified. Fixing standard errors can’t repair the wrong shape.'};}},
   {type:'mc',q:'Model A (linear) has R² = 0.41; Model B (Y on ln X) has R² = 0.39. Theory predicts diminishing returns. Which should you prefer?',
    opts:['Model B — it matches the mechanism, and the fit difference is trivial','Model A — higher R² always wins','Neither — R² below 0.5 is useless','Average the two forecasts'],a:0,
    why:'With the same Y, R² is comparable — but a tiny fit gap is no reason to pick a form that contradicts the theory.'},
  ]};
