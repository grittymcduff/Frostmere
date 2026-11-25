/* ==========================================================================
   INTERPRETATION DESK — "explain it" questions (one or two per area).
   The player writes a short interpretation, sees a model answer, and ticks
   the key points they covered (2/3 of them counts as a pass).
   ========================================================================== */
const EXPLAIN=(m,title,puzzles)=>{NODES[`m${m}-explain`]={explain:true,kicker:`Interpretation desk · ${AREAS_SHORT[m]}`,title,puzzles:puzzles.map(p=>({type:'explain',...p}))};};
const AREAS_SHORT={1:'Regression basics',2:'Fit and multiple regression',3:'Building a model',4:'Assumptions and residuals',5:'Hypothesis tests',
  6:'Causation and specification',7:'Functional form',8:'Multicollinearity',9:'Serial correlation',10:'Heteroskedasticity'};

EXPLAIN(1,'Explain a coefficient',[
 {exhibit:Exhibit.eq('Sales ($000) = 42.0 + 3.6·Ads ($000) − 1.9·CompetitorStores'),
  q:'Your VP asks what the <b>3.6</b> on Ads means and whether it proves advertising works. Answer in a few sentences.',
  model:'Holding the number of competitor stores constant, each extra $1,000 of advertising is associated with about $3,600 more in sales. That is an estimated association in this sample, not proof that ads cause the sales — other factors that move with advertising could be involved, and we’d want its precision (standard error) and a credible design before treating it as causal.',
  points:['Gives the size in real units ($1,000 of ads ↔ about $3,600 of sales)','Says “holding competitor stores constant” (other included factors fixed)','Calls it an association, not proof of cause','Mentions checking precision or what else could explain it'],
  why:'A complete interpretation covers units, the “holding constant” condition, and what the number can’t prove.'},
]);
EXPLAIN(2,'Explain R² and adjusted R²',[
 {exhibit:Exhibit.table(['Model','Drivers','R²','Adjusted R²'],[['A','Price, Ads','0.71','0.69'],['B','Price, Ads, Day of week code','0.72','0.66']]),
  q:'A colleague wants Model B because its R² is higher. Explain which model you’d prefer and why.',
  model:'R² always rises (or stays the same) when you add a variable, so B’s slightly higher R² doesn’t show the new variable helps. Adjusted R² penalizes extra variables, and it falls from 0.69 to 0.66, so the added driver isn’t earning its place. I’d prefer Model A unless theory gives a strong reason the extra variable belongs — and neither R² says anything about causation.',
  points:['R² can’t fall when a variable is added, so a higher R² alone means little','Adjusted R² falls for B — the extra variable isn’t worth it','Prefers Model A (unless theory says otherwise)','Notes fit is not proof of a good or causal model'],
  why:'Compare models with adjusted R² and theory, not raw R².'},
]);
EXPLAIN(3,'Explain a dummy variable',[
 {exhibit:Exhibit.eq('Margin (%) = 11.2 + 0.4·Size + 3.1·Defense + 1.4·Government &nbsp;·&nbsp; base group: Commercial'),
  q:'Explain what the <b>3.1</b> on Defense means, and why there is no Commercial dummy in the model.',
  model:'Holding contract size constant, Defense contracts have a predicted margin about 3.1 percentage points higher than Commercial contracts — the left-out base group. Commercial has no dummy because including a dummy for every category alongside the intercept would make them sum to the intercept column (perfect multicollinearity, the dummy-variable trap); with k categories you include k − 1 dummies.',
  points:['3.1 percentage points higher margin than the base group','Names Commercial as the comparison (base/reference) group','Holding size constant','Explains the dummy-variable trap / k − 1 dummies'],
  why:'Every dummy coefficient is a comparison with the omitted base group.'},
]);
EXPLAIN(4,'Explain a residual plot',[
 {make:r=>({exhibit:residPlot(genResid(r,'spray'),'Store size'),
  q:'Explain what this residual plot tells you about the model and what it means for a manager reading its p-values.',
  model:'The residuals fan out as store size grows — the errors are much bigger for large stores. That is heteroskedasticity: the constant-variance assumption fails. The coefficients aren’t biased by this alone, but the usual standard errors are wrong, so the reported p-values and confidence intervals can’t be trusted as printed; robust standard errors (after checking the model’s form) are the usual response.',
  points:['Spread grows with store size (a fan / spray)','Names it heteroskedasticity / non-constant variance','Coefficients still unbiased','Standard errors and p-values are unreliable']})},
]);
EXPLAIN(5,'Explain a significance result',[
 {exhibit:Exhibit.table(['','Coefficient','Std. error','t','p-value'],[['Training hours','0.84','0.29','2.90','0.006'],['Bonus ($000)','0.02','0.01','2.10','0.042']]),
  q:'Productivity is measured in units per day. Explain whether each driver is statistically significant and whether that makes it important.',
  model:'Both coefficients are statistically significant at the 5% level (p = 0.006 and 0.042), so the data give evidence that neither effect is zero. Significance isn’t importance, though: an extra training hour goes with about 0.84 more units a day, while $1,000 of bonus goes with only 0.02 — tiny in practical terms. Whether to act depends on size and cost, and significance alone doesn’t prove either one causes productivity.',
  points:['Both are significant at 5% (p below 0.05)','Significance means evidence the effect isn’t zero — not that it’s large','Compares practical size: training 0.84 vs bonus 0.02 units','Notes significance doesn’t prove causation (or that cost matters)'],
  why:'Statistical significance and economic importance are different questions.'},
]);
EXPLAIN(6,'Explain a changing coefficient',[
 {exhibit:Exhibit.table(['Model','Competitors coefficient','t'],[['With population','−10,605','−5.07'],['Without population','−1,684','−0.81']]),
  q:'When population is dropped, the competition coefficient shrinks and loses significance. Explain what’s going on and which model to trust.',
  model:'This is omitted-variable bias. Population affects sales and is correlated with the number of competitors (busy areas attract more competitors), so when it’s left out, the competition coefficient absorbs part of population’s positive effect and is pulled toward zero. The model with population is more credible: theory says population belongs, and its inclusion lets competition show its real negative effect.',
  points:['Names omitted-variable bias','Population affects sales AND moves with competition','The competition estimate is biased toward zero when population is dropped','Trusts the model that includes population, on theory grounds'],
  why:'Bias needs both conditions: the omitted variable matters, and it’s correlated with an included one.'},
]);
EXPLAIN(7,'Explain a log model',[
 {exhibit:Exhibit.eq('ln(Price) = 4.24 + 1.02·ln(SQFT)'),
  q:'Explain what the <b>1.02</b> means in plain language, and one caution about using this model for a very large estate.',
  model:'In a double-log model the coefficient is an elasticity: a 1% increase in square footage is associated with about a 1.02% increase in expected price — roughly proportional. To forecast a price you compute ln(Price) and exponentiate back to dollars. Using it for an estate far bigger than the homes in the data is extrapolation: the constant-elasticity shape may not hold outside the observed range.',
  points:['Calls 1.02 an elasticity','1% more square footage → about 1.02% higher price','Forecasts need converting back from logs (exponentiate)','Warns against extrapolating beyond the data’s range'],
  why:'Interpret in percentages, report in dollars, and stay inside the data.'},
]);
EXPLAIN(8,'Explain multicollinearity',[
 {exhibit:Exhibit.table(['','Coefficient','p-value','VIF'],[['TV ads','2.9','0.31','11.4'],['Online ads','2.1','0.38','11.4'],['Model: R² = 0.91, F-test p < 0.001','','','']]),
  q:'A manager concludes that neither ad channel works because neither is significant. Explain why that’s the wrong conclusion and what you’d do.',
  model:'The overall F-test is highly significant and R² is high, so the two channels matter jointly. Their VIFs above 10 show severe multicollinearity: TV and online spend move together, so the model can’t separate their individual effects and their standard errors are inflated — that’s why the individual p-values look weak. The estimates aren’t biased, just imprecise. I wouldn’t drop a channel to “fix” it (that risks omitted-variable bias); I’d report their combined effect or get more varied data.',
  points:['Jointly significant: F-test and R² show the ads matter together','High VIFs = severe multicollinearity; the two move together','Weak t-tests come from inflated standard errors, not irrelevance','Don’t just drop one — risk of omitted-variable bias'],
  why:'Multicollinearity hides individual effects; it doesn’t erase them.'},
]);
EXPLAIN(9,'Explain a Durbin–Watson result',[
 {exhibit:Exhibit.table(['T','k','DW','dL (5%)','dU (5%)'],[[30,2,'0.94','1.28','1.57']]),
  q:'This is a quarterly sales model. Explain the Durbin–Watson result and what it means for the model’s p-values.',
  model:'DW = 0.94 is below dL = 1.28, so we reject the null and conclude there is positive first-order serial correlation: errors in one quarter tend to carry into the next. The coefficients may still be unbiased, but the standard errors are likely understated, so the p-values look more convincing than they should. First check for something missing — a trend, seasonality, a lag, or the wrong form — before reaching for a statistical correction.',
  points:['DW below dL → reject H₀: positive serial correlation','Errors persist from one period to the next','Standard errors understated → p-values too optimistic','Check for a missing trend, seasonality, lag, or wrong form first'],
  why:'Durbin–Watson is a credibility check on time-series significance.'},
]);
EXPLAIN(10,'Explain two tests that disagree',[
 {exhibit:Exhibit.table(['Test','LM','df','p-value'],[['Breusch–Pagan','2.16','2','0.340'],['White','12.81','5','0.025']]),
  q:'The two heteroskedasticity tests disagree. Explain why that can happen and what you would do next.',
  model:'They aren’t contradicting each other. Breusch–Pagan only looks for error variance that changes linearly with the predictors and found nothing (p = 0.34). White also searches squared and interaction patterns and found one (p = 0.025). Before treating it as pure heteroskedasticity, I’d check the residual plot for a curve — a U-shape points to a missing nonlinear term in the equation. Fix the form, re-test, and if the variance still changes, use robust standard errors.',
  points:['Breusch–Pagan searches only linear patterns','White also searches squared/interaction patterns — a wider search','Not a contradiction: White found something BP couldn’t look for','Check functional form first, then robust standard errors if needed'],
  why:'Don’t choose the test that gives the answer you prefer.'},
]);
