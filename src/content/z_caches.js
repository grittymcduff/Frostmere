/* ==========================================================================
   SUPPLY CACHES — one hidden near each stone. Each lock is a short problem
   that needs real arithmetic (the calculator helps). Reward: one item.
     lens    → strike out a wrong answer (multiple choice)
     feather → reveal the first step (calculation questions)
     charm   → the next miss on a question doesn't count
   ========================================================================== */
const CACHE=(id,item,puzzle)=>{NODES[id].cache={item,puzzle};};

/* ---- Signpost Woods: Modules 1–3 ---- */
CACHE('m1-signs','lens',{make:r=>{const a=ri(r,400,700),bp=ri(r,25,60),bc=ri(r,12,35),by=round(rr(r,.4,1.2),1),P=round(rr(r,3,6),2),Pc=round(rr(r,3.5,6.5),2),Y=ri(r,200,400),q=a-bp*P+bc*Pc+by*Y;
  return {type:'num',exhibit:Exhibit.eq(`Q = ${a} − ${bp}P + ${bc}Pᶜ + ${by}Y`),q:`A café’s weekly demand model is above. Predict Q when your price P = <b>$${P}</b>, the rival’s price Pᶜ = <b>$${Pc}</b>, and customer budget Y = <b>${Y}</b>.`,a:q,tol:.05,unit:'cups',
   hint:`${a} − ${bp}×${P} + ${bc}×${Pc} + ${by}×${Y}`,solution:`${a} − ${round(bp*P,2)} + ${round(bc*Pc,2)} + ${round(by*Y,2)} = ${round(q,2)}.`,why:'The signs carry the theory: own price pulls Q down, a pricier rival and a bigger budget push it up.'};}});
CACHE('m1-cross','charm',{make:r=>{const n=ri(r,150,300),t=ri(r,Math.round(n*.18),Math.round(n*.3)),c=ri(r,Math.round(n*.1),Math.round(n*.2)),d=100*(t-c)/n;
  return {type:'num',q:`A retailer <b>randomly</b> offered free shipping to ${n} customers; ${t} reordered. Of ${n} customers not offered it, ${c} reordered. By how many <b>percentage points</b> did the offer raise the reorder rate?`,a:d,tol:.06,unit:'pts',
   hint:`Rate with offer = ${t}/${n}; without = ${c}/${n}; subtract and × 100.`,solution:`(${t} − ${c}) / ${n} × 100 = ${round(d,2)} points.`,why:'Random assignment is what lets you read this difference as the offer’s effect, not a coincidence or a third factor.'};}});
CACHE('m1-magic','feather',{make:r=>{const p=ri(r,62,90),N=ri(r,60,200),e=N*(2*p/100-3*(1-p/100));
  return {type:'num',q:`Your height model guesses within 10 lb for <b>${p}%</b> of customers. Each hit earns $2; each miss costs $3. What should the booth expect to earn from <b>${N}</b> customers?`,a:e,tol:.6,pre:'$',
   hint:`Per customer: 0.${String(p).padStart(2,'0')} × $2 − ${round(1-p/100,2)} × $3; then × ${N}.`,solution:`${N} × (${p/100}×2 − ${round(1-p/100,2)}×3) = ${money(e)}.`,why:'Judge a model in the units of the decision — here, expected dollars per customer.'};}});
CACHE('m1-units','lens',{make:r=>{const b=round(rr(r,8,12),2),k=pick([500,1000,1500]),a=b*k/100;
  return {type:'num',exhibit:Exhibit.eq(`Food = 83.42 + ${b} × Income <small>(weekly income in $100 units)</small>`),q:`By how much does expected weekly food spending change when weekly income rises by <b>$${k.toLocaleString()}</b>?`,a,tol:.02,pre:'$',
   hint:`$${k.toLocaleString()} is ${k/100} income units.`,solution:`${k/100} × ${b} = ${money(a)}.`,why:'Convert the change into the coded unit, then multiply by the slope.'};}});
CACHE('m1-ledger','charm',{make:r=>{const b0=round(rr(r,25,45),2),b1=round(rr(r,3.2,4.8),3),T=ri(r,180,260),x=(T-b0)/b1;
  return {type:'num',exhibit:Exhibit.eq(`Revenue ($M) = ${b0} + ${b1} × Customers`),q:`A branch wants expected revenue of <b>$${T}M</b>. How many active customers does the model say it needs? (Give the exact value — don’t round.)`,a:x,tol:.02,
   hint:`Solve ${T} = ${b0} + ${b1}·X for X.`,solution:`(${T} − ${b0}) / ${b1} = ${round(x,3)}.`,why:'Inverting a fitted line is fine inside the observed range — outside it, you’re extrapolating.'};}});
CACHE('m2-ols','feather',{make:r=>{const x=[1,2,3,4,5],y=x.map(v=>ri(r,2,4)*v+ri(r,-2,3)),xb=3,yb=y.reduce((a,b)=>a+b,0)/5,sxy=x.reduce((s,v,i)=>s+(v-xb)*(y[i]-yb),0),sxx=10,b1=sxy/sxx;
  return {type:'num',exhibit:Exhibit.table(['x','y'],x.map((v,i)=>[v,y[i]]))+Exhibit.eq('b₁ = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²'),q:'Compute the OLS slope b₁ by hand for these five points.',a:b1,tol:.006,
   hint:`x̄ = 3 and ȳ = ${yb}. Σ(x − x̄)² = 10.`,solution:`Σ(x − x̄)(y − ȳ) = ${round(sxy,3)}; b₁ = ${round(sxy,3)} / 10 = ${round(b1,4)}.`,why:'This is the slope that minimizes Σe² — the same number Excel would report.'};}});
CACHE('m2-andy','lens',{make:r=>{const b2=round(rr(r,1.6,2.4),3),cs=ri(r,35,55),inc=b2*1000,pr=inc*(1-cs/100)-1000;
  return {type:'num',q:`Advertising coefficient = <b>${b2}</b> (SALES and ADVERT in $1,000s). Food, labor, and franchise costs eat <b>${cs}%</b> of each extra revenue dollar. What is the incremental profit from an extra <b>$1,000</b> of advertising?`,a:pr,tol:.6,pre:'$',
   hint:`Extra revenue = ${b2} × $1,000. Keep (1 − ${cs/100}) of it, then subtract the $1,000 ad cost.`,solution:`${money(inc,0)} × ${round(1-cs/100,2)} − $1,000 = ${money(pr)}.`,why:'Revenue above ad cost isn’t profit — the extra sales carry their own costs.'};}});
CACHE('m2-fit','charm',{make:r=>{const n=ri(r,30,60),R2a=round(rr(r,.55,.7),3),R2b=round(R2a+rr(r,.002,.012),3),ka=2,kb=3,adj=(R2,k)=>1-(1-R2)*(n-1)/(n-k-1),a=adj(R2b,kb);
  return {type:'num',q:`Model A (2 predictors) has R² = ${R2a}. Model B adds a third predictor: R² = <b>${R2b}</b>, n = <b>${n}</b>. Compute Model B’s adjusted R².`,a,tol:.0015,
   hint:'1 − (1 − R²)(n − 1)/(n − k − 1), with k = 3.',solution:`1 − (1 − ${R2b}) × ${n-1}/${n-4} = ${round(a,4)} (Model A: ${round(adj(R2a,ka),4)}).`,
   why:`${a<adj(R2a,ka)?'Adjusted R² fell, so the third predictor isn’t earning its degree of freedom.':'Adjusted R² rose slightly — but theory still decides whether it belongs.'}`};}});
CACHE('m3-design','feather',{make:r=>{const N=[ri(r,2,7),ri(r,2,7)],P=[ri(r,40,160)*1000,ri(r,40,160)*1000],I=[ri(r,40,95)*1000,ri(r,40,95)*1000],f=k=>102192-9075*N[k]+.355*P[k]+1.288*I[k],d=f(0)-f(1);
  return {type:'num',exhibit:Exhibit.eq('SALES = 102,192 − 9,075·N + 0.355·P + 1.288·I')+Exhibit.table(['Site','Competitors N','Population P','Income I'],[['A',N[0],P[0].toLocaleString(),money(I[0],0)],['B',N[1],P[1].toLocaleString(),money(I[1],0)]]),
   q:'How much higher are predicted annual sales at Site A than at Site B? (Negative if B is higher.)',a:d,tol:2,pre:'$',
   hint:'The intercept cancels: −9,075·ΔN + 0.355·ΔP + 1.288·ΔI, with Δ = A − B.',solution:`−9,075×${N[0]-N[1]} + 0.355×${(P[0]-P[1]).toLocaleString()} + 1.288×${(I[0]-I[1]).toLocaleString()} = ${money(d,0)}.`,why:'Comparing two scenarios only needs the coefficients times the differences.'};}});
CACHE('m3-dummy','lens',{make:r=>{const b0=round(rr(r,17,20),2),b1=round(rr(r,1.5,3.2),2),b2=round(rr(r,4,7),2),d=b2-b1;
  return {type:'num',exhibit:Exhibit.eq(`Margin (%) = ${b0} + ${b1}·Commercial + ${b2}·Defense <small>(Government is the baseline)</small>`),q:'How many percentage points higher is the predicted margin for a <b>Defense</b> contract than for a <b>Commercial</b> one?',a:d,tol:.006,unit:'pts',
   hint:'Defense = b₀ + b₂; Commercial = b₀ + b₁. Subtract.',solution:`(${b0} + ${b2}) − (${b0} + ${b1}) = ${round(d,2)}.`,why:'Both dummies are measured against Government, so their difference compares the two non-baseline groups directly.'};}});

/* ---- Lantern Hollow: Modules 4–6 ---- */
CACHE('m4-seven','charm',{make:r=>{const a=round(rr(r,1.2,2.6),2),b=round(rr(r,.25,.6),2),X=pick([50,100,200,400]),y=Math.exp(a+b*Math.log(X));
  return {type:'num',exhibit:Exhibit.eq(`ln(Sales) = ${a} + ${b}·ln(Ads)`),q:`A multiplicative model Sales = A·Ads^β becomes linear in its parameters after taking logs. Predict <b>Sales</b> (not ln Sales) when Ads = <b>${X}</b>.`,a:y,tol:Math.max(.05,y*.002),
   hint:`Compute ${a} + ${b}·ln(${X}), then take e^ of the result.`,solution:`exp(${a} + ${b} × ln ${X}) = exp(${round(a+b*Math.log(X),4)}) = ${round(y,3)}.`,why:'Transforming the variables keeps the model linear in β — so OLS still applies.'};}});
CACHE('m4-plots','lens',{make:r=>{const s=round(rr(r,4,12),2),e=round((r()<.5?-1:1)*rr(r,s*1.2,s*3),2),z=e/s;
  return {type:'num',q:`A store’s residual is <b>${e}</b>, and the regression’s standard error is <b>${s}</b>. Compute its standardized residual. (Then ask: flag it?)`,a:z,tol:.006,
   hint:'standardized residual ≈ residual / standard error',solution:`${e} / ${s} = ${round(z,3)} → ${Math.abs(z)>2?'beyond ±2: investigate':'within ±2'}.`,why:'About 95% should fall within ±2 if errors are roughly normal. A flag starts an investigation, not a deletion.'};}});
CACHE('m5-tests','feather',{make:r=>{const b=-round(rr(r,3000,12000),0),se=round(rr(r,1500,4500),0),t=b/se;
  return {type:'num',q:`Competition coefficient b = <b>${b.toLocaleString()}</b>, SE = <b>${se.toLocaleString()}</b>, df = 29. Compute t for H₀: β ≥ 0. (Left-tail critical value: −1.699.)`,a:t,tol:.006,
   hint:'t = b / SE',solution:`${b.toLocaleString()} / ${se.toLocaleString()} = ${round(t,3)} → ${t<-1.699?'reject H₀':'fail to reject H₀'}.`,why:'The rejection rule depends on the tail, α, and df — set before you look at the result.'};}});
CACHE('m5-three','charm',{make:r=>{const b=round(rr(r,4,14),3),se=round(rr(r,1,3),3),df=ri(r,30,45),tc=Stats.tinv(.975,df),w=tc*se;
  return {type:'num',q:`b = <b>${b}</b>, SE = <b>${se}</b>, df = ${df}. The two-tailed critical value is <b>${round(tc,3)}</b>. How wide is the 95% confidence interval (upper − lower)?`,a:2*round(tc,3)*se,tol:.02,
   hint:'Width = 2 × t × SE',solution:`2 × ${round(tc,3)} × ${se} = ${round(2*round(tc,3)*se,3)}.`,why:'A wider interval means less precision — it’s the plausible range managers need alongside the point estimate.'};}});
CACHE('m6-trial','lens',{make:r=>{const n=4,T=[],C=[];const eff=ri(r,6,18)*1000;for(let i=0;i<n;i++){T.push(Math.round((118000+eff+rngGauss(r)*4000)/100)*100);C.push(Math.round((118000+rngGauss(r)*4000)/100)*100);}
  const m=a=>a.reduce((s,v)=>s+v,0)/a.length,d=m(T)-m(C);
  return {type:'num',exhibit:Exhibit.table(['Group','Store sales'],[...T.map(v=>['Treatment',money(v,0)]),...C.map(v=>['Control',money(v,0)])]),q:'Stores were randomly assigned. Estimate the treatment effect β₁ (treatment mean − control mean).',a:d,tol:1,pre:'$',
   hint:'Average each group with mean(…), then subtract.',solution:`${money(m(T),0)} − ${money(m(C),0)} = ${money(d,0)}.`,why:'With a single 0/1 regressor, OLS’s slope is exactly this difference in means.'};}});
CACHE('m6-omit','feather',{make:r=>{const est=round(rr(r,1.5,3.5),2),b2=round(rr(r,.4,1.2),2),a1=round(rr(r,.3,.9),2),tru=est-b2*a1;
  return {type:'num',q:`Omitting X₂ gave an estimated β₁* = <b>${est}</b>. You know β₂ = <b>${b2}</b> and α₁ = <b>${a1}</b>. What is the true β₁?`,a:tru,tol:.006,
   hint:'β₁* = β₁ + β₂·α₁, so β₁ = β₁* − β₂·α₁.',solution:`${est} − ${b2} × ${a1} = ${round(tru,4)}.`,why:'Positive β₂ and positive α₁ make the bias positive — the short model overstated β₁.'};}});
