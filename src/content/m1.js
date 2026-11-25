/* ==========================================================================
   MODULE 1 — Econometrics for managerial decisions under uncertainty
   Puzzle types: mc | num | sort | order. Puzzles with make(r) generate fresh,
   seeded data every time; answers are computed from that data in code.
   ========================================================================== */

/* ---- Stone 1: theory predicts direction ---- */
NODES['m1-signs']={kicker:'Module 1 · Theory and evidence',title:'Stone of Signs',
  intro:'Economic theory tells you which way a driver should push the outcome. Data tell you how hard. This stone tests whether you can keep those two jobs apart.',
  puzzles:[
  {type:'sort',q:'Demand model: <b>Q = β₀ + β₁P + β₂Pᶜ + β₃Y + …</b> Sort each driver by the sign theory predicts, holding the other included factors constant.',
   cats:['Expected β < 0','Expected β > 0'],
   items:[{t:'Your own price (P)',c:0},{t:'A competitor’s price (Pᶜ)',c:1},{t:'Customer budget or income (Y)',c:1},{t:'Price of a complement customers must buy with your product',c:0}],
   why:'Higher own price lowers quantity demanded; a pricier competitor or a bigger customer budget raises it. A complement works like your own price — when it gets dearer, demand for the pair falls.'},
  {type:'mc',q:'Theory and data play different roles in a regression. Which split is right?',
   opts:['Theory predicts the direction (sign); data estimate the magnitude','Data predict the direction; theory estimates the magnitude','Theory tells you how reliable an effect is; data tell you its sign','Data decide which variables belong; theory just labels them'],a:0,
   why:'Theory predicts direction; data estimate magnitude. Theory cannot tell you whether an effect is large, reliable, or useful — that is the data’s job.'},
  {type:'mc',q:'Which of these is <b>not</b> a fair description of what a regression model is?',
   opts:['A proof-generating machine that decides for you','A disciplined way to structure assumptions','A method for comparing evidence with claims','An input into a decision under uncertainty'],a:0,
   why:'The model can keep you from a blind bet, but it cannot decide for you. Models reduce analytical risk; leaders still own business risk.'},
  {make:r=>{const b=round(rr(r,.12,.48),2);return {type:'mc',q:`Your demand model estimates an income coefficient of <b>${b}</b>. What is the correct managerial reading?`,
   opts:[`Expected demand rises by ${b} units for a one-unit rise in income, holding the included factors constant`,`A one-unit rise in income causes demand to rise by ${Math.round(b*100)}%`,`Demand rises by ${b} units whenever income rises, no matter what else changes`,`${Math.round(b*100)}% of the variation in demand is explained by income`],a:0,
   why:'A coefficient is a marginal relationship in the units of the problem, conditional on the other included factors. It is evidence about a relationship — not proof of a causal mechanism, and not a share of variance explained.'};}},
  {type:'mc',q:'Your price coefficient has the sign theory predicted. What should a manager ask next?',
   opts:['Is the effect large enough — and precise enough — to change the decision?','Nothing; the expected sign settles the question','Whether R² is above 0.9','Whether the intercept is positive'],a:0,
   why:'Sign ≠ decision. Ask whether the estimate is economically material, precise enough for the stakes, sensible given market structure, and likely to survive changes in competitors, technology, or policy.'},
]};

/* ---- Stone 2: causes and coincidences ---- */
NODES['m1-cross']={kicker:'Module 1 · Causality and design',title:'Crossroads of Causes',
  intro:'When A and B move together, four stories are possible. Regression alone cannot tell them apart — design and theory have to do that work.',
  puzzles:[
  {type:'sort',q:'Match each pattern to the story most likely behind it.',
   cats:['A causes B','Reverse causality','Third factor','Coincidence'],
   items:[
    {t:'A firm randomly assigned a discount offer to half its customers; that half bought more.',c:0},
    {t:'Branches with the most service errors got extra staff training last year — and now training “predicts” errors.',c:1},
    {t:'Weekly ice-cream sales and sunscreen sales rise and fall together all summer.',c:2},
    {t:'Over six years, revenue tracked the number of letters in the CEO’s favorite word of the year.',c:3}],
   why:'Random assignment supports A → B. Errors driving training is B → A. Hot weather drives both ice cream and sunscreen (C → A and B). A pattern with no mechanism is likely coincidence — and unstable.'},
  {type:'mc',q:'Which of these could a manager realistically run as a controlled experiment?',
   opts:['A regional price test','A change in interest rates','A competitor’s pricing strategy','An economy-wide shift in demand'],a:0,
   why:'Price tests, regional advertising, and service offers can be assigned to comparable groups. Interest rates, competitor strategy, supply disruptions, and economy-wide demand usually cannot — so managers often work with observational data.'},
  {type:'mc',q:'An estimated regression coefficient is best described as…',
   opts:['Evidence about a relationship — not proof of a causal mechanism','Proof that X causes Y, if the sample is large','The exact change in Y that will follow a change in X','A measure of how much of Y is explained by X'],a:0,
   why:'Coefficients turn market logic into measurable effects, but the design determines how confidently you can move from association toward causation.'},
  {type:'mc',q:'What do causal claims actually require?',
   opts:['Theory, a credible research design, and evidence — not a coefficient alone','A p-value below 0.05','An R² above 0.8','At least 100 observations'],a:0,
   why:'Statistical significance, fit, and sample size do not establish causality. Theory plus a credible design plus evidence do.'},
  {type:'mc',q:'What is the difference between the error term εᵢ and the residual eᵢ?',
   opts:['ε is the true, unobservable deviation from the conditional mean; e = Y − Ŷ is the observed miss from the fitted model','They are the same thing measured in different units','ε is the miss on the training data; e is the miss on new data','e is unobservable; ε is what Excel reports'],a:0,
   why:'εᵢ = Yᵢ − E(Yᵢ|Xᵢ) can’t be observed. eᵢ = Yᵢ − Ŷᵢ can, and residuals approximate the errors — large or patterned residuals are risk signals to investigate, not mistakes to erase.'},
]};

/* ---- Stone 3: the Magic Hill booth (prediction → residual → payoff) ---- */
function genMagic(r,n=20){
  const h=[],w=[];for(let i=0;i<n;i++){const x=ri(r,4,15);h.push(x);w.push(Math.round(103+6.4*x+rngGauss(r)*9));}
  const m=Stats.ols(h,w,['Height']);return {h,w,m,b0:round(m.b[0],2),b1:round(m.b[1],3)};
}
const ftin=x=>x<12?`5 ft ${x} in`:`6 ft ${x-12} in`;
const magicExhibit=d=>Exhibit.scatter(d.h,d.w,{line:[d.b0,d.b1],xl:'Height: inches above 5 feet',yl:'Weight (lb)',eq:`ŷ = ${d.b0} + ${d.b1}x`,title:'Weight against height'})
  +Exhibit.eq(`Predicted weight = ${d.b0} + ${d.b1} × (inches above 5 feet)`);
NODES['m1-magic']={kicker:'Module 1 · Fitted values and residuals',title:'The Magic Hill Booth',
  intro:'Summer job: you guess customers’ weights at Magic Hill. Within 10 lb, you keep the customer’s $2. Miss by more and you refund the $2 and hand over a $3 prize. Can a height model make the booth pay?',
  puzzles:[
  {make:r=>{const d=genMagic(r),x=ri(r,5,14),a=d.b0+d.b1*x;return {type:'num',exhibit:magicExhibit(d),
    q:`A customer is <b>${ftin(x)}</b>. Using the fitted equation, what weight should you guess?`,a,tol:.15,unit:'lb',
    hint:`Code height as inches above 5 feet first — ${ftin(x)} is X = ${x}.`,
    solution:`X = ${x}, so ${d.b0} + ${d.b1} × ${x} = ${fmtNum(a,1)} lb.`,
    why:'Coding height as inches above 5 feet makes the intercept the predicted weight of a five-foot customer — a sensible reference point.'};}},
  {make:r=>{const d=genMagic(r),x=ri(r,5,14),pred=d.b0+d.b1*x,off=(r()<.5?-1:1)*rr(r,3,15),W=Math.round(pred+off),a=W-pred;return {type:'num',exhibit:magicExhibit(d),
    q:`A customer who is <b>${ftin(x)}</b> actually weighs <b>${W} lb</b>. What is the residual?`,a,tol:.15,unit:'lb',
    hint:'Residual = actual − predicted. Predict first, then subtract.',
    solution:`Predicted = ${d.b0} + ${d.b1} × ${x} = ${fmtNum(pred,1)}. Residual = ${W} − ${fmtNum(pred,1)} = ${fmtNum(a,1)} lb.`,
    why:`${a<0?'A negative residual means the model overpredicted':'A positive residual means the model underpredicted'} this customer’s weight. ${Math.abs(a)<=10?'Within 10 lb — you keep the $2.':'More than 10 lb off — that costs you $3.'}`};}},
  {make:r=>{const e=round((r()<.5?-1:1)*rr(r,2,9),1),neg=e<0;return {type:'mc',q:`A customer’s residual is <b>${e>0?'+':''}${fmtNum(e,1)} lb</b>. What does that tell you?`,
    opts:['The model overpredicted this customer’s weight','The model underpredicted this customer’s weight','Height does not help predict weight','The guess lost money'],a:neg?0:1,
    hints:{2:'One residual says nothing about whether height is useful overall.',3:`Is |${fmtNum(e,1)}| more than 10 lb?`},
    why:`e = Y − Ŷ. ${neg?'Negative means the actual weight was below the prediction — an overprediction.':'Positive means the actual weight was above the prediction — an underprediction.'} Within 10 lb, so the booth still earns $2.`};}},
  {make:r=>{const d=genMagic(r),rows=[];let net=0,wins=0;
    for(let i=0;i<8;i++){const x=ri(r,5,15),pred=round(d.b0+d.b1*x,1);let off=rngGauss(r)*9;if(i===2)off=(r()<.5?-1:1)*rr(r,12,17);if(i===5)off=(r()<.5?-1:1)*rr(r,1,7);
      const W=Math.round(pred+off),win=Math.abs(W-pred)<=10;net+=win?2:-3;wins+=win;rows.push([i+1,x,W,fmtNum(pred,1)]);}
    return {type:'num',exhibit:Exhibit.table(['Customer','Inches above 5 ft','Actual weight','Predicted weight'],rows),
      q:'Eight customers today. You keep <b>$2</b> when your guess is within 10 lb, and lose <b>$3</b> when it misses by more. What is the booth’s net gain?',a:net,tol:.01,pre:'$',
      hint:'Compute each residual (actual − predicted), count how many are within ±10 lb, then wins × $2 − misses × $3.',
      solution:`${wins} within 10 lb × $2 − ${8-wins} misses × $3 = ${money(net,0)}.`,
      why:'Judge the model in the units of the decision — dollars at the booth — not only by statistical fit.'};}},
  {type:'mc',q:'Why does the booth model code height as <b>inches above 5 feet</b> instead of total inches?',
   opts:['So the intercept becomes the predicted weight of a five-foot customer — a meaningful reference point','Because Excel cannot handle numbers above 60','To make the slope larger','So that residuals are always positive'],a:0,
   why:'With total inches, X = 0 means a person zero inches tall, and the intercept is meaningless. The coding of X decides whether the intercept has a sensible meaning; the slope is unchanged.'},
]};

/* ---- Stone 4: the Units Mill (coding, intercepts, scenarios) ---- */
function genFood(r){const inc=[],food=[];for(let i=0;i<40;i++){const x=round(rr(r,3.5,33.5),2);inc.push(x);food.push(round(Math.max(55+rr(r,0,25),83+10.2*x+rngGauss(r)*70),2));}
  const m=Stats.ols(inc,food,['Income']);return {inc,food,m,b0:round(m.b[0],2),b1:round(m.b[1],2)};}
const foodEq=d=>Exhibit.eq(`Predicted weekly food spending = ${d.b0} + ${d.b1} × Income <small>(weekly income in $100 units)</small>`);
function genHouse(r){const sz=[],pr=[];for(let i=0;i<30;i++){const s=Math.round(rr(r,1100,3200));sz.push(s);pr.push(Math.round(Math.max(45000,-100000+128*s+rngGauss(r)*28000)));}
  const m=Stats.ols(sz,pr,['Size']);return {m,b0:Math.round(m.b[0]),b1:round(m.b[1],2),min:Math.min(...sz),max:Math.max(...sz)};}
NODES['m1-units']={kicker:'Module 1 · Units, coding, and the relevant range',title:'The Units Mill',
  intro:'Most coefficient mistakes are unit mistakes or overclaims about causality — not arithmetic. The mill grinds raw numbers into sentences a manager can use.',
  puzzles:[
  {make:r=>{const d=genFood(r);return {type:'mc',exhibit:Exhibit.scatter(d.inc,d.food,{line:[d.m.b[0],d.m.b[1]],xl:'Weekly income ($100 units)',yl:'Weekly food ($)',eq:`ŷ = ${d.b0} + ${d.b1}x`})+foodEq(d),
    q:'Forty three-person households. Which interpretation of the slope is correct?',
    opts:[`A $100 increase in weekly income is associated with about $${d.b1} more expected weekly food spending`,`A $1 increase in weekly income is associated with $${d.b1} more weekly food spending`,`Every household that earns $100 more will spend exactly $${d.b1} more on food`,`A household with zero income spends $${d.b0} a week on food`],a:0,
    hints:{1:'Check how income is coded.',2:'The slope is an average relationship, not a promise for each household.',3:'Is zero income anywhere near the observed data?'},
    why:'Translate the coded unit back into the manager’s natural unit. Scaling income to $100 units changes the coefficient’s number, not the economic relationship.'};}},
  {make:r=>{const d=genFood(r),inc=pick([1500,2000,2500,3000]),x=inc/100,a=d.b0+d.b1*x;return {type:'num',exhibit:foodEq(d),
    q:`Forecast expected weekly food spending for a household with weekly income of <b>$${inc.toLocaleString()}</b>.`,a,tol:.06,pre:'$',
    hint:`Code income first: $${inc.toLocaleString()} is X = ${x}, not ${inc}.`,
    solution:`X = ${x}: ${d.b0} + ${d.b1} × ${x} = ${money(a)}.`,
    why:'Prediction is straightforward only once the units, coding, and relevant range are understood.'};}},
  {make:r=>{const d=genFood(r),N=pick([5000,8000,10000,12000,15000]),a=N*d.b1;return {type:'num',exhibit:foodEq(d),
    q:`A supermarket’s area has <b>${N.toLocaleString()}</b> comparable households, and weekly income rises by $100 in each. Roughly how much more weekly food spending should the store plan for, across the area?`,a,tol:1,pre:'$',
    hint:'A $100 rise is one unit of X, so each household adds about β₁.',
    solution:`${N.toLocaleString()} × ${money(d.b1)} = ${money(a,0)}.`,
    why:'Regression gives a scenario input. Whether the store captures that spending depends on comparability, prices, competition, and how stable the relationship is.'};}},
  {make:r=>{const d=genHouse(r);return {type:'mc',exhibit:Exhibit.eq(`Predicted PRICE = ${d.b0<0?'−':''}${Math.abs(d.b0).toLocaleString()} + ${d.b1} × SIZE <small>(square feet; sample ${d.min.toLocaleString()}–${d.max.toLocaleString()})</small>`),
    q:`The intercept is ${money(d.b0,0)}. How should you read it?`,
    opts:['It is the prediction at zero square feet — far outside the data, so it has no literal business meaning','Empty lots in this market sell for a negative price','The model is broken and the slope cannot be trusted','Every house loses that much value at sale'],a:0,
    why:'A coefficient can be mathematically necessary without having a useful stand-alone interpretation. The slope is useful inside the relevant range; the intercept needs a reality check.'};}},
  {make:r=>{const d=genHouse(r),s=Math.round(rr(r,d.min+200,d.max-200)/50)*50,a=d.b0+d.b1*s;return {type:'num',
    exhibit:Exhibit.eq(`Predicted PRICE = ${d.b0<0?'−':''}${Math.abs(d.b0).toLocaleString()} + ${d.b1} × SIZE`),
    q:`What is the predicted price of a <b>${s.toLocaleString()} sq ft</b> house?`,a,tol:1,pre:'$',
    hint:'Substitute SIZE and keep the intercept’s sign.',
    solution:`${d.b0.toLocaleString()} + ${d.b1} × ${s.toLocaleString()} = ${money(a,0)}.`,
    why:'Forecast ≠ appraisal. The prediction is an average conditional on size alone; neighborhood, condition, age, and amenities sit in the error term.'};}},
]};

/* ---- Stone 5: the Guild Ledger (reading Excel output) ---- */
function genService(r){const c=[],y=[];for(let i=0;i<20;i++){const x=ri(r,12,50);c.push(x);y.push(round(36+4.0*x+rngGauss(r)*3.5,1));}
  const m=Stats.ols(c,y,['Customers']);return {c,y,m};}
const svcEx=d=>Exhibit.excel(d.m,'Annual service revenue ($M)');
NODES['m1-ledger']={kicker:'Module 1 · Reading Excel output',title:'The Guild Ledger',
  intro:'The Service Guild ran Data → Data Analysis → Regression on 20 branches: annual service revenue ($M) against active customers. Excel did the arithmetic. Your job is judgment.',
  puzzles:[
  {type:'order',q:'Put the recommended order for reading regression output into sequence.',
   items:['Coefficient signs and units','Magnitudes and practical importance','Standard errors, t statistics, and p-values','Fit and residual behavior','Plausibility of the specification'],
   why:'Signs and units first, then size, then precision, then fit and residuals, and finally whether the whole specification is believable.'},
  {make:r=>{const d=genService(r),k=pick([3,5,8,10]),a=k*d.m.b[1];return {type:'num',exhibit:svcEx(d),
    q:`The guild adds <b>${k} active customers</b> to a branch. By how much does expected annual service revenue change?`,a,tol:.06,pre:'$',unit:'M',
    hint:'Use the Customers coefficient: it is $M per additional active customer.',
    solution:`${k} × ${Exhibit.xl(d.m.b[1])} ≈ ${money(a)}M.`,
    why:'A point prediction starts the conversation. Is the link causal? Can operations serve the new customers? Would price or customer mix change? How wide is the uncertainty?'};}},
  {make:r=>{const d=genService(r),lo=Math.min(...d.c),hi=Math.max(...d.c);return {type:'mc',exhibit:svcEx(d),
    q:`Branches in the sample have between ${lo} and ${hi} customers. What does the intercept (≈ ${round(d.m.b[0],1)}) tell you?`,
    opts:['An extrapolated baseline at zero customers — outside the observed range, not a meaningful operating forecast','A branch with no customers will earn that much revenue','Fixed revenue every branch earns regardless of customers','It is insignificant, so the model should be dropped'],a:0,
    why:'The slope is useful inside the relevant range; the intercept requires a business reality check.'};}},
  {make:r=>{const d=genService(r),x=ri(r,18,45),pred=d.m.predict(x),act=round(pred+(r()<.5?-1:1)*rr(r,2,7),1),a=act-pred;return {type:'num',exhibit:svcEx(d),
    q:`A branch with <b>${x} customers</b> earned <b>$${act}M</b>. What is its residual?`,a,tol:.1,pre:'$',unit:'M',
    hint:'Residual = actual − (Intercept + Customers coefficient × customers).',
    solution:`Predicted = ${Exhibit.xl(d.m.b[0])} + ${Exhibit.xl(d.m.b[1])} × ${x} = ${fmtNum(pred,2)}. Residual = ${act} − ${fmtNum(pred,2)} = ${fmtNum(a,2)}.`,
    why:'A residual tells you how far the model missed — not why. Large or patterned residuals point to demand shifts, outages, churn, missing variables, or the wrong functional form.'};}},
  {make:r=>{const d=genService(r);return {type:'mc',exhibit:svcEx(d),
    q:`R Square is ${Exhibit.xl(d.m.R2)}. Which conclusion is justified?`,
    opts:['Customers and revenue are strongly associated in this sample — but fit alone doesn’t prove that adding customers causes revenue','The model proves that adding customers causes revenue to rise','Every future branch will land almost exactly on the fitted line','A high R² means the intercept can now be read literally'],a:0,
    why:'The goal is not to celebrate a high R² but to interpret what the model does and does not support. The teaching data are deliberately clean; real operating data are noisier.'};}},
]};

/* exam-guide gap: why managers use econometrics */
NODES['m1-signs'].puzzles.push({type:'mc',q:'What is econometrics mainly for in a managerial setting?',
  opts:['Putting numbers — and honest uncertainty — on relationships so decisions under uncertainty are better informed','Proving that a theory is true','Replacing managerial judgment with a formula','Finding whichever variables are significant in the data'],a:0,
  why:'Regression quantifies a relationship and its uncertainty; theory supplies the story and judgment makes the decision.'});
