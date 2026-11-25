/* ==========================================================================
   MODULE 1 — WAYPOINTS (mini-lessons on the path before each stone)
   Each lesson: a short teaching card + practice questions. Completing a
   stone's waypoints thaws it if it froze; they are optional otherwise.
   ========================================================================== */
const W1=(id,lessons)=>{NODES[id].lessons=lessons;};

W1('m1-signs',[
  {title:'Signs come from theory',
   teach:`<p>Before you look at any data, economic logic tells you which <b>direction</b> each driver should push the outcome.</p>
   <div class="ex">Q = β₀ + β₁P + β₂Pᶜ + β₃Y<br>β₁ &lt; 0 · your price up → quantity down<br>β₂ &gt; 0 · competitor’s price up → your quantity up<br>β₃ &gt; 0 · customer budget up → demand up</div>
   <p>Theory gives you the sign. It does <b>not</b> tell you whether the effect is large, reliable, or useful — that is what the data estimate.</p>`,
   practice:[
    {type:'mc',q:'A rival coffee shop raises its prices. Theory says your quantity demanded should…',opts:['Rise — the rival is a substitute, so β₂ > 0','Fall — all prices move together','Stay the same — only your own price matters','Be impossible to predict without data'],a:0,
     why:'A substitute getting more expensive pushes customers toward you, so the competitor-price coefficient is expected to be positive.'},
    {type:'mc',q:'Which question can economic theory answer on its own?',opts:['Which direction the effect should go','How many dollars the effect is worth','How precise the estimate is','Whether the effect is big enough to act on'],a:0,
     why:'Theory predicts direction; data estimate magnitude and precision.'},
  ]},
  {title:'Reading a coefficient like a manager',
   teach:`<p>A coefficient is a <b>marginal relationship in the units of the problem</b>, holding the other included factors constant.</p>
   <div class="ex">Income coefficient = 0.23 → a one-unit rise in income is associated with 0.23 more units demanded, holding the other included factors constant.</div>
   <p>Then ask the manager’s questions: is it <b>large enough</b> to matter, <b>precise enough</b> for the stakes, and likely to <b>survive</b> changes in competitors, technology, or policy? A correct sign alone never settles a decision.</p>
   <div class="ex"><b>What a regression model is:</b> a disciplined way to structure assumptions, a method for comparing evidence with claims, and one input into a decision under uncertainty.<br><b>What it is not:</b> a proof-generating machine, a substitute for business judgment, or a guarantee that the future will look like the past.</div>
   <p>The model can keep you from a blind bet, but it can’t decide for you.</p>`,
   practice:[
    {make:r=>{const b=round(rr(r,1.1,3.9),1);return {type:'mc',q:`An advertising coefficient is <b>${b}</b> (sales in units, advertising in $1,000s). Which reading is right?`,
      opts:[`Each extra $1,000 of ads goes with about ${b} more units sold, others held fixed`,`Each extra $1 of advertising causes ${b} more units sold, others held fixed`,`Advertising explains about ${Math.round(b*10)}% of the variation in units sold`,`Sales rise by exactly ${b} units every time advertising rises by $1,000`],a:0,
      why:'Read it in the stated units, as an association, conditional on the other included variables.'};}},
    {type:'mc',q:'Your model gives the sign you expected. Which follow-up matters most for a pricing decision?',opts:['Is the effect big and precise enough to change what we do?','Is the intercept positive, as a baseline sanity check?','Is R² high enough to call the model reliable?','Is the coefficient larger than the intercept?'],a:0,
     why:'Sign ≠ decision. Materiality and precision decide whether the evidence should move resources.'},
  ]},
]);

W1('m1-cross',[
  {title:'Four stories behind a correlation',
   teach:`<p>When A and B move together, any of four stories can be true:</p>
   <div class="ex"><b>A → B</b> · A causes B<br><b>B → A</b> · reverse causality<br><b>C → A and B</b> · a third factor drives both<br><b>Coincidence</b> · an unstable pattern with no mechanism</div>
   <p>A regression coefficient alone cannot tell these apart. Theory and research design have to.</p>`,
   practice:[
    {type:'mc',q:'Cities with more firefighters on duty report more fire damage. What’s the most likely story?',opts:['A third factor — bigger fires bring both crews and damage','Causation — more firefighters lead to more water damage','Coincidence — the two just happen to move together here','Measurement — damage is overcounted where crews are large'],a:0,
     why:'Fire size (C) drives both the staffing (A) and the damage (B). The association is real; the causal reading is wrong.'},
    {type:'mc',q:'Stores that spend more on loss-prevention staff report more shoplifting. A manager who knows high-theft stores were the ones given extra staff should suspect…',opts:['Reverse causality — theft drove the staffing','Causation — more staff somehow invite more theft','Coincidence — the two just happen to move together','A data-entry error in the shoplifting reports'],a:0,
     why:'B → A: the outcome (theft) caused the “driver” (staffing).'},
  ]},
  {title:'Design, errors, and residuals',
   teach:`<p><b>Controlled experiments</b> change one factor across comparable groups — ideally by random assignment (price tests, regional ads, service offers). <b>Observational</b> settings study outcomes as they happen — interest rates, competitor moves, and economy-wide demand usually can’t be randomized.</p>
   <div class="ex"><b>Error</b> εᵢ = Yᵢ − E(Yᵢ|Xᵢ) — the true deviation, never observed.<br><b>Residual</b> eᵢ = Yᵢ − Ŷᵢ — the miss you can see from your fitted model.</div>`,
   practice:[
    {type:'mc',q:'Which study is a controlled experiment?',opts:['Randomly offering free shipping to half of new customers','Comparing sales before and after a regional recession','Tracking our sales after a competitor cuts its prices','Comparing regions that have different interest rates'],a:0,
     why:'You chose who got the offer, at random — that is what makes it an experiment.'},
    {type:'mc',q:'Which one can you actually compute from your data?',opts:['The residual, eᵢ = Yᵢ − Ŷᵢ','The true error term, εᵢ','The population β₁','The exact causal effect'],a:0,
     why:'Residuals are observed misses; they approximate the unobservable errors.'},
  ]},
]);

W1('m1-magic',[
  {title:'From equation to prediction',
   teach:`<p>A fitted line turns an input into an <b>expected</b> outcome. Code X exactly as the model was estimated, then substitute.</p>
   <div class="ex">Predicted weight = 103.40 + 6.377 × (inches above 5 ft)<br>5 ft 9 in → X = 9 → 103.40 + 6.377 × 9 = <b>160.8 lb</b></div>
   <p>The coding matters: X = 0 means a five-foot customer, so the intercept is a sensible reference point.</p>`,
   practice:[
    {make:r=>{const b0=round(rr(r,98,108),2),b1=round(rr(r,5.6,7.2),3),x=ri(r,3,13),a=b0+b1*x;return {type:'num',
      exhibit:Exhibit.eq(`Predicted weight = ${b0} + ${b1} × (inches above 5 feet)`),q:`Predict the weight of a customer who is <b>${ftin(x)}</b>.`,a,tol:.15,unit:'lb',
      hint:`${ftin(x)} is X = ${x}.`,solution:`${b0} + ${b1} × ${x} = ${fmtNum(a,1)} lb.`,why:'Code first, then substitute.'};}},
    {type:'mc',q:'If the model had used total height in inches instead, what would the intercept mean?',opts:['Predicted weight at zero inches tall — not meaningful','Predicted weight of a five-foot person, the usual baseline','The average weight of everyone in the sample','The extra weight that goes with each added inch'],a:0,
     why:'Coding X so that 0 is a real, relevant value is what makes an intercept interpretable.'},
  ]},
  {title:'Residuals pay the bills',
   teach:`<p><b>Residual = actual − predicted.</b> Negative means the model <b>over</b>predicted; positive means it <b>under</b>predicted.</p>
   <div class="ex">Predicted 160.8 lb, actual 157 lb → residual = 157 − 160.8 = <b>−3.8 lb</b> (overpredicted)</div>
   <p>At the booth, what matters is the size of the miss: |residual| ≤ 10 lb earns $2; anything bigger costs $3. Judge a model in the units of the decision.</p>`,
   practice:[
    {make:r=>{const pred=round(rr(r,135,195),1),off=round((r()<.5?-1:1)*rr(r,1,14),1),W_=round(pred+off,0),a=W_-pred;return {type:'num',
      q:`The model predicts <b>${fmtNum(pred,1)} lb</b>; the customer weighs <b>${W_} lb</b>. What is the residual?`,a,tol:.06,unit:'lb',
      hint:'actual − predicted',solution:`${W_} − ${fmtNum(pred,1)} = ${fmtNum(a,1)} lb.`,why:`${Math.abs(a)<=10?'Within 10 lb: +$2.':'More than 10 lb off: −$3.'}`};}},
    {type:'mc',q:'Five customers have residuals of −4, +12, +3, −11, and +7 lb. What does the booth earn?',opts:['$0 — three wins and two losses','+$10 — three wins and two small losses','−$15 — five misses at $3 each','+$4 — four wins and one loss'],a:0,
     why:'|−4|, |3|, |7| ≤ 10 → 3 × $2 = $6. |12| and |−11| > 10 → 2 × −$3 = −$6. Net $0.'},
  ]},
]);

W1('m1-units',[
  {title:'Coded units',
   teach:`<p>Analysts often rescale a variable so the coefficient is readable. Weekly income coded in <b>$100 units</b> means X = 1 is $100.</p>
   <div class="ex">Food = 83.42 + 10.21 × Income ($100s)<br>✔ “A <b>$100</b> rise in weekly income is associated with $10.21 more expected weekly food spending.”<br>✘ “A $1 rise … $10.21 more.”</div>
   <p>To forecast, convert first: $2,000 a week → X = 20.</p>`,
   practice:[
    {make:r=>{const b0=round(rr(r,70,95),2),b1=round(rr(r,8.5,11.5),2),inc=pick([1200,1800,2400,3100]),a=b0+b1*inc/100;return {type:'num',
      exhibit:Exhibit.eq(`Food = ${b0} + ${b1} × Income <small>($100 units)</small>`),q:`Forecast weekly food spending at a weekly income of <b>$${inc.toLocaleString()}</b>.`,a,tol:.06,pre:'$',
      hint:`$${inc.toLocaleString()} → X = ${inc/100}.`,solution:`${b0} + ${b1} × ${inc/100} = ${money(a)}.`,why:'Convert the natural unit into the coded unit before you substitute.'};}},
    {type:'mc',q:'You rescale income from $100 units to $1 units. What happens?',opts:['The coefficient’s number changes; the relationship doesn’t','The relationship gets stronger because the numbers are bigger','R² changes, because income now varies more','The sign flips to keep the units consistent'],a:0,
     why:'Scaling changes the number you report, not the underlying relationship.'},
  ]},
  {title:'Intercepts and the relevant range',
   teach:`<p>The intercept is the prediction when every X = 0. Often zero is <b>far outside the data</b>, so the intercept is mathematically needed but has no literal business meaning.</p>
   <div class="ex">PRICE = −102,871 + 129.22 × SIZE<br>A 0 sq ft house “selling” for −$102,871 is an extrapolation, not a fact.</div>
   <p>Trust the slope inside the observed range; reality-check anything outside it.</p>`,
   practice:[
    {type:'mc',q:'A model of store revenue uses data from stores with 40–300 employees. The intercept is negative. Best response?',opts:['Ignore its literal value — zero employees is outside the data','Conclude that very small stores lose money','Throw the model out — a negative intercept is impossible','Force the intercept to zero and re-estimate the model'],a:0,
     why:'Zero is outside the relevant range, so the intercept is an extrapolated anchor, not a forecast.'},
    {type:'mc',q:'When IS an intercept meaningful?',opts:['When X = 0 is plausible and near the observed data','Whenever it is positive and statistically significant','Whenever R² is high enough to trust the model','Never — the intercept only makes the math work'],a:0,
     why:'That’s why the booth model codes height as inches above 5 feet — so X = 0 is a real customer.'},
  ]},
]);

W1('m1-ledger',[
  {title:'The Excel workflow',
   teach:`<p><b>Data → Data Analysis → Regression.</b> Select the Y range (outcome) and the X range (drivers), tick Labels, and choose where the output goes.</p>
   <p>Before clicking OK, check the outcome, the predictors, the units, the sample, and the business logic. Then read the output in order:</p>
   <div class="ex">1 Signs and units → 2 Magnitudes → 3 Standard errors, t, p → 4 Fit and residuals → 5 Plausibility of the specification</div>
   <p>Two numbers you’ll see in every output, covered properly in later modules: <b>R Square</b> (0 to 1) is the share of the outcome’s variation the model explains in this sample — fit, not proof. A coefficient’s <b>P-value</b> measures how surprising the estimate would be if the true effect were zero; smaller means stronger evidence. The <b>Standard Error</b> is how much the estimate would bounce around from sample to sample.</p>`,
   practice:[
    {type:'mc',q:'What should you read first in a regression output?',opts:['Coefficient signs and units','R Square, to see whether the model is worth reading','The p-values, to see which drivers are significant','The residual plot, to spot problems early'],a:0,
     why:'Signs and units first: if the direction or units don’t make sense, nothing after it matters yet.'},
    {type:'mc',q:'In Excel’s Regression dialog, where does “annual revenue” go if it’s the outcome?',opts:['Input Y Range','Input X Range','Output Range','Residuals box'],a:0,
     why:'Y is the outcome you want to explain; X holds the drivers.'},
  ]},
  {title:'Scaling a slope to a decision',
   teach:`<p>The slope is a rate: <b>change in Y per one unit of X</b>. For a realistic change, multiply.</p>
   <div class="ex">Revenue ($M) = 36.28 + 4.009 × Customers<br>+5 customers → 5 × 4.009 ≈ <b>$20.0M</b> more expected annual revenue</div>
   <p>Then restore the uncertainty: is it causal, can operations serve them, and how wide is the prediction band?</p>`,
   practice:[
    {make:r=>{const b1=round(rr(r,2.4,6.2),3),k=ri(r,2,12),a=k*b1;return {type:'num',exhibit:Exhibit.eq(`Revenue ($M) = ${round(rr(r,20,50),2)} + ${b1} × Customers`),
      q:`How much does expected revenue change if the branch adds <b>${k}</b> customers?`,a,tol:.02,pre:'$',unit:'M',hint:'k × slope',solution:`${k} × ${b1} = ${fmtNum(a,3)}.`,why:'The intercept drops out of a change; only the slope matters.'};}},
    {type:'mc',q:'You computed a +$20M revenue change from adding customers. What’s the right next step?',opts:['Check capacity, causality, and uncertainty first','Book the $20M in next year’s budget as expected revenue','Report it to leadership as a reliable gain','Add variables until R² is close to 1, then decide'],a:0,
     why:'A point prediction is the beginning of a managerial conversation — not the end.'},
  ]},
]);
