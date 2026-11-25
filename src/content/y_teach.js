/* ==========================================================================
   "TEACH ME" MINI-LECTURES — one per stone, in Warden Quill's voice.
   Each is ~45–75 seconds spoken. Lines are the subtitle chunks and, for the
   voice actor, the script. Voice clips (optional) live at
   assets/voice/teach_<stone-id>.mp3 — without one, the subtitles play alone.
   Written for the ear: numbers and symbols are spelled the way they're said.
   ========================================================================== */
const TEACH={
  'basics':{t:'Start here: the words you’ll hear every week',lines:[
    'Before the stones, a few words you’ll hear in every class. A regression explains one thing — Y, the dependent variable — using others: the Xs, also called explanatory or independent variables. Sales might be Y. Price and advertising, the Xs.',
    'Coded means how a fact was turned into a number. Income coded in hundreds of dollars. Height as inches above five feet. A yes-or-no as one or zero. Always check the coding before you read a result.',
    'The coefficient on an X — its slope — says how much Y changes when that X rises by one unit, holding the other Xs constant. The intercept is the predicted Y when every X is zero. Often it’s just where the line starts, not something to read literally.',
    'Plug values into the equation and you get a prediction, also called a fitted value. Use it for a period you haven’t seen yet, and it’s a forecast. The gap between actual and predicted is the residual.',
    'And everything we calculate from a sample is an estimate. The standard error says how much it might wobble from sample to sample. Significant means it’s unlikely to be zero just by chance — not that it’s large, and not that it’s causal.',
  ]},
'm1-signs':{t:'Signs come from theory',lines:[
 "Before you ever open the data, ask a simple question: which way should each factor push the result?",
 "Raise your own price, and you'd expect fewer sales — a negative sign. If a rival raises theirs, customers drift to you — a positive sign. Give customers bigger budgets, and demand usually rises — positive again.",
 "That is theory's job: direction. The data's job is size — how big the effect is, and how sure we can be.",
 "So write your expected signs down first. And when the estimate arrives with the sign you predicted, don't celebrate yet. Ask the manager's question: is it big enough, and precise enough, to change what we do?"]},
'm1-cross':{t:'Cause, or coincidence?',lines:[
 "When two things move together, there are four stories that could explain it.",
 "One: A causes B. Two: B causes A — reverse causality, like stores getting extra security because they already had more theft. Three: a hidden third factor drives both — hot weather sells both ice cream and sunscreen. Four: pure coincidence.",
 "A regression coefficient can't tell these apart on its own. A careful design can. If you randomly assign who gets a discount, the two groups are alike in every other way — so the difference is the discount.",
 "Remember the difference between the error and the residual, too. The error is the true, unseen miss. The residual — actual minus predicted — is the miss you can actually compute."]},
'm1-magic':{t:'Predictions and residuals',lines:[
 "A fitted line turns an input into a prediction. Plug in the value — coded exactly the way the model was built — and read off the answer.",
 "At the Magic Hill booth, height is measured in inches above five feet. So someone five foot nine is a nine, not sixty-nine. Coding it that way also makes the intercept mean something: the predicted weight of a five-foot customer.",
 "The residual is actual minus predicted. Negative means the model guessed too high. Positive means it guessed too low.",
 "And judge the model in the units that matter. Here, that's dollars: within ten pounds you keep two dollars, miss by more and you lose three."]},
'm1-units':{t:'Reading a coefficient in real units',lines:[
 "A coefficient is a rate, measured in the units of the problem. Read it slowly: one more unit of X goes with this many units of Y, holding the other factors steady.",
 "If income is coded in hundreds of dollars, a slope of ten means each extra hundred dollars of weekly income goes with about ten more dollars of food spending. Not each extra dollar.",
 "To forecast, convert first. Two thousand dollars a week is a twenty in hundreds. Then substitute.",
 "As for the intercept: it's the prediction when every X is zero. If zero is far outside your data — a house with no square feet — don't read it literally. Trust the slope inside the range you actually observed."]},
'm1-ledger':{t:'Reading Excel output in order',lines:[
 "Excel hands you a wall of numbers. Read it in a sensible order, and it becomes a story.",
 "First, the signs and units. Do they make sense? Second, the sizes. Do they matter for the decision? Third, precision — the standard errors, t statistics, and p-values. Fourth, the fit and the residuals. And last, whether the whole specification is believable.",
 "To scale a decision, multiply. If each customer adds about four million dollars a year, five more customers add about twenty million. The intercept drops out of any change.",
 "Then bring back the caution: is it causal, can the operation handle it, and how wide is the uncertainty?"]},
'm2-ols':{t:'How least squares picks the line',lines:[
 "Ordinary least squares chooses the line that makes the sum of the squared residuals as small as possible.",
 "Why square them? Because positive and negative misses would otherwise cancel out — and because squaring punishes big misses more than small ones.",
 "With an intercept, the residuals always add up to zero. That's a built-in property, not evidence that the model is right.",
 "The total variation in Y splits into two parts: what the model explains, and what's left over. R squared is the explained share — regression sum of squares divided by total sum of squares. And remember the words: OLS is the estimator, the recipe. The number it produces is the estimate."]},
'm2-andy':{t:'Holding other factors constant',lines:[
 "In a multiple regression, each coefficient answers one question: what happens to Y when this X rises by one unit, with the others held fixed?",
 "At Big Andy's, sales are in thousands of dollars and price is in dollars. A price coefficient of about minus seven point nine means a one-dollar price increase goes with roughly seven thousand nine hundred dollars less monthly revenue — with advertising held constant.",
 "Scale it to the move you're considering. A ten-cent price cut: point one times seven point nine, about seven hundred ninety dollars more revenue.",
 "But revenue isn't profit. More burgers mean more food and labor. The regression compares expected outcomes; the manager still has to weigh costs and risk."]},
'm2-fit':{t:'R squared and adjusted R squared',lines:[
 "R squared is the share of the variation in Y, in this sample, that the model explains. It describes fit. It does not prove cause, and it doesn't promise good forecasts.",
 "Here's the catch: adding any variable — even random noise — can never lower R squared. So R squared rewards clutter.",
 "Adjusted R squared charges a price for every extra variable. If a new driver doesn't pull its weight, adjusted R squared falls.",
 "Two rules. Only compare these numbers between models with the same dependent variable, in the same units. And even a big jump in fit doesn't earn a variable its place without a sensible reason it belongs."]},
'm3-design':{t:'Building a model, step by step',lines:[
 "Good models are built, not discovered. There are six steps.",
 "One: anchor the question in a real mechanism. Two: specify Y, the Xs, their units, and the shape. Three: write down the expected signs. Four: inspect the data and justify any changes. Five: estimate and evaluate. Six: document it, so someone else could reproduce and challenge it.",
 "Step one matters most. Pulling every column into a regression to see what sticks is mining, not modeling.",
 "And when one observation looks wildly unusual, don't delete it to tidy the fit. Flag it, check the records, and exclude it only with a reason you could defend out loud."]},
'm3-dummy':{t:'Dummy variables',lines:[
 "A dummy variable turns a yes-or-no fact into a number: one if it applies, zero if it doesn't.",
 "Its coefficient is the difference from the baseline group, holding the other factors constant. A degree dummy of two point eight, with salary in thousands, means degree holders earn about two thousand eight hundred dollars more than otherwise similar people without one.",
 "With several categories, you include one fewer dummy than there are groups. The group you leave out is the baseline that every coefficient is compared against.",
 "Include all of them alongside an intercept, and they add up to exactly the intercept's column. That's perfect multicollinearity — the dummy-variable trap. And never code categories as one, two, three. That invents an order that isn't there."]},
'm4-seven':{t:'The seven ground rules',lines:[
 "Regression leans on seven classical assumptions. One: the model is linear in its coefficients. Two: the error averages zero. Three: no endogeneity — the Xs aren't tangled up with the error. Four: no serial correlation. Five: constant error variance. Six: no perfect multicollinearity. Seven, optional: normally distributed errors.",
 "When one through six hold, the Gauss–Markov theorem says OLS is BLUE: the best linear unbiased estimator.",
 "Not all broken rules hurt the same way. Endogeneity — say, an omitted factor that moves with your X — biases the coefficients themselves.",
 "Serial correlation and changing variance usually leave the coefficients centered correctly, but make the standard errors and tests unreliable. Biased means aimed at the wrong target. Imprecise means aimed right, but shaky."]},
'm4-plots':{t:'Reading residual plots',lines:[
 "Plot the residuals against X or against the predictions. What you hope to see is a calm, even band around zero.",
 "A spray that widens as X grows, a funnel that narrows, or a bow-tie — those are changing variance, called heteroskedasticity.",
 "A curve is different. If the residuals bend — negative, then positive, then negative — the model's shape is wrong, or a driver is missing.",
 "For single points, divide each residual by the regression's standard error. Anything beyond plus or minus two gets a closer look — not automatic deletion. And remember: more data shrinks standard errors, roughly with one over the square root of the sample size. It does not cure bias."]},
'm5-tests':{t:'Setting up a hypothesis test',lines:[
 "A test starts with two claims. The null hypothesis is the benchmark — usually, no effect. The alternative is what you'll conclude if the evidence is strong enough.",
 "Let theory choose the tail. If you expect a positive effect, test whether beta is greater than zero. Expect negative, test the left tail. If either direction would matter, use two tails.",
 "The t statistic is the estimate divided by its standard error, with n minus k minus one degrees of freedom. Compare it with the critical value. And we never prove the null — we only reject it, or fail to.",
 "Two ways to be wrong. Type one: rejecting a null that's true — a false alarm. Type two: missing an effect that's real. When a miss could be dangerous, like a safety defect, you may accept more false alarms."]},
'm5-three':{t:'p-values, intervals, and the F-test',lines:[
 "Excel's p-value tests one thing: whether the coefficient is zero, two-sided. If it's at or below your alpha, reject.",
 "A confidence interval says the same thing more usefully: the estimate, plus or minus the critical value times the standard error. If zero sits outside it, reject — and you also see the plausible range.",
 "The F-test asks whether the variables, together, explain anything at all. A significant F says the group matters. It doesn't say which member.",
 "Two last cautions. Significant is not the same as important — a tiny effect can be very precise. And significant is not the same as causal. A small p-value tells you the association is unlikely to be zero, not why it exists."]},
'm6-trial':{t:'Experiments and cause',lines:[
 "To know what something causes, you need to know what would have happened without it. That's the counterfactual — and for any one store, we can never see both versions.",
 "So we build a stand-in: a control group. And the cleanest way to make the control group a fair comparison is random assignment. Flip a coin for which stores get the extra advertising, and the two groups end up alike in everything but the advertising, on average.",
 "Then regress sales on a treatment dummy. The intercept is the control group's average. The coefficient is the treatment average minus the control average.",
 "Randomization earns the causal reading. Sample size still decides how precise it is — ten stores is a lesson, not a verdict."]},
'm6-omit':{t:'Leaving out what matters',lines:[
 "Leave out a variable that matters, and its effect doesn't vanish. It slips into the error term — and if it moves with one of your Xs, that X takes the credit.",
 "Omitted-variable bias needs two things at once: the missing variable affects Y, and it's correlated with an included X. The bias equals its effect times that correlation slope. Same signs, you overestimate. Opposite signs, you underestimate.",
 "Including a useless variable is the gentler mistake. It doesn't bias the others; it just adds noise.",
 "So judge a variable by theory first, then its t test, adjusted R squared, and whether the other coefficients shift when it comes and goes. Checking that a result survives sensible alternatives is sensitivity analysis. Hunting until something looks significant is data mining."]},
'm7-form':{t:'Choosing the right shape',lines:[
 "OLS only needs the model to be linear in its coefficients. You're free to use squares and logs of the variables — so pick the shape that matches how the business works.",
 "A constant effect per unit: linear. A constant percentage response — an elasticity: logs on both sides. Diminishing returns: log of X. Steady percentage growth: log of Y. A rise that peaks and then falls: add a squared term.",
 "In a quadratic, the slope changes with X: beta one plus two times beta two times X. The peak sits at minus beta one over two beta two.",
 "Use a lag when the effect arrives later, like advertising that pays off next month. And be wary of predicting far outside your data. That's where a wrong shape does the most damage."]},
'm8-multi':{t:'When two factors move together',lines:[
 "Perfect multicollinearity means one X is an exact copy of others — square feet and square meters, say. OLS simply can't separate them.",
 "The common case is imperfect: TV and online ad budgets that rise together. OLS still works, and the estimates stay unbiased. But they become imprecise — larger standard errors, smaller t statistics, and coefficients that swing when you add or drop a related variable.",
 "The classic warning sign: a high R squared and a significant F-test, but few significant individual coefficients. Together they matter; the model can't say who deserves the credit.",
 "The variance inflation factor measures it: one divided by one minus the R squared from regressing that X on the others. Above five is a warning; above ten is serious. Often the best response is to do nothing. Dropping a variable that belongs just swaps imprecision for bias."]},
'm9-serial':{t:'Errors that echo over time',lines:[
 "In time-series data, this period's error can spill into the next. Positive serial correlation — the common business case — shows up as long runs of residuals on the same side of zero. Negative shows up as residuals flipping sign every period.",
 "Sometimes it's pure: the model is right, and shocks just take time to fade. Often it's impure: a missing trend, a missing season, a missing lag, or the wrong shape.",
 "Either way, the usual standard errors tend to be too small, so the p-values look more convincing than they should.",
 "The Durbin–Watson statistic checks for it. Near two, no problem. Toward zero, positive correlation. Below the lower critical value, reject. Above the upper value, don't. In between, the test is inconclusive. And it doesn't work when last period's Y is one of your explanatory variables."]},
'm10-hetero':{t:'Errors that grow with size',lines:[
 "Heteroskedasticity means the size of the errors changes across observations — usually growing with scale. Mix corner shops and national chains in one model, and the big ones miss by bigger amounts.",
 "It shows up as a spray, a funnel, or a bow-tie in the residual plot. A curve is a different problem: the wrong functional form.",
 "The coefficients aren't biased by it. But the usual standard errors are wrong, so the t tests, p-values, and confidence intervals can't be trusted as printed.",
 "Two tests check it, by regressing the squared residuals on the explanatory variables. Breusch–Pagan uses the Xs themselves. White adds their squares and products, a wider search, so the two can disagree. The statistic is n times R squared. Fix the shape of the model first; if the spread still changes, use robust standard errors."]},
};
