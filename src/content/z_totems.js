/* ==========================================================================
   LEARNING TOTEMS — three per module, hidden off the path near a stone.
   Each holds a short story: where an idea came from, where it shows up in
   business, a classic mistake, or a decision it changes. No questions, no
   score — the story is the reward. Voice: assets/voice/totem_<id>.mp3
   ========================================================================== */
const TOTEMS=[
/* ---- Module 1 · Signpost Woods ---- */
{id:'t1a',m:1,at:'m1-magic',kind:'Origin story',t:'Why it’s called “regression”',lines:[
  'In the 1880s, Francis Galton studied the heights of parents and their grown children. Very tall parents tended to have tall children — but not quite as tall as themselves. Very short parents had children a little closer to average, too.',
  'Galton called this “regression toward mediocrity”: a pull back toward the middle. The method he used to study it kept the name. So every time you run a regression, you’re borrowing a word from a study of family heights.',
  'The lesson still matters. An extreme result this year is often followed by a more ordinary one next year, even when nothing changed. Before you credit a new manager for a rebound, ask whether the bad year was simply unusual.']},
{id:'t1b',m:1,at:'m1-cross',kind:'Classic mistake',t:'More firefighters, more damage',lines:[
  'Here’s a pattern you’ll find in any city’s records: the more firefighters sent to a fire, the more damage the fire does. Should the city send fewer firefighters? Of course not.',
  'A third factor — the size of the fire — drives both. Big fires bring more crews, and big fires cause more damage.',
  'Business data is full of the same trap. Stores with more staff have more sales, but busy stores hire more staff. Before you read a coefficient as cause, ask: what could be driving both of these at once?']},
{id:'t1c',m:1,at:'m1-signs',kind:'Manager’s lens',t:'The price that seemed to raise sales',lines:[
  'Imagine a coffee chain’s data shows that weeks with higher prices also had higher sales. A junior analyst suggests raising prices further.',
  'But look closer. The chain raised prices every summer, when tourists crowd the stores. Demand rose, and prices followed. The data didn’t show customers liking higher prices. It showed busy seasons.',
  'This is why we write the expected signs down before running anything. When a sign comes back backwards, theory is your alarm bell. Don’t act on it — look for the missing factor, like the season, that explains it.']},

/* ---- Module 2 ---- */
{id:'t2a',m:2,at:'m2-ols',kind:'Origin story',t:'A lost planet and the first least squares',lines:[
  'In 1801, astronomers spotted a tiny new world, Ceres — then lost it in the glare of the sun. A young Carl Friedrich Gauss took the handful of messy observations and predicted where it would reappear. Astronomers looked there, and found it.',
  'His method chose the path that made the squared errors as small as possible. Adrien-Marie Legendre was the first to publish least squares, in 1805, and Gauss later said he had been using it for years.',
  'The idea has barely changed since. When the data is noisy, choose the line that misses by the least — squared.']},
{id:'t2b',m:2,at:'m2-andy',kind:'In the wild',t:'One mansion can move the line',lines:[
  'Because least squares squares every miss, one huge miss counts enormously. Picture two hundred ordinary house sales, plus one waterfront mansion that sold for ten times the average.',
  'That single sale can tilt the whole line toward itself, changing the slope for every other house.',
  'That’s not a reason to delete it. It’s a reason to look. Is it a typo? A different kind of property that belongs in its own model? Or a real part of the market you need to understand? Always plot your data before you trust the line.']},
{id:'t2c',m:2,at:'m2-fit',kind:'Manager’s lens',t:'When a low R squared is still useful',lines:[
  'People are messy. A model of what each customer spends might explain only thirty percent of the variation. That sounds weak.',
  'But the price coefficient in that model can still be precise and reliable — and that’s what the pricing decision needs. R squared tells you how much of the scatter you’ve explained, not whether the effect you care about is real.',
  'Forecasting one customer’s spending needs a high R squared. Learning how customers respond to price, on average, often doesn’t. Match the number to the question you’re actually asking.']},

/* ---- Module 3 ---- */
{id:'t3a',m:3,at:'m3-design',kind:'Classic mistake',t:'The Texas sharpshooter',lines:[
  'A cowboy fires at the side of a barn, then paints a target around wherever the bullets landed. Perfect aim, every time.',
  'That’s what happens when you test variable after variable until something looks significant. At the five percent level, if you test twenty variables that truly do nothing, you should expect about one of them to look significant by chance alone.',
  'The fix is to decide what you’re testing, and why, before you see the results. Paint the target first. Then shoot.']},
{id:'t3b',m:3,at:'m3-dummy',kind:'In the wild',t:'Teaching a model about December',lines:[
  'Retail sales jump every holiday season. If your model doesn’t know that, December looks like a mystery — and other variables may grab the credit. Advertising, which also tends to rise in the fall, can look far more powerful than it really is.',
  'A simple fix is a dummy variable: one in the holiday months, zero otherwise. Restaurants do the same with weekends, airlines with holidays, utilities with summer heat.',
  'A dummy lets the model account for a known pattern, so the other coefficients can focus on what they’re meant to measure.']},
{id:'t3c',m:3,at:'m3-design',kind:'Manager’s lens',t:'The week that sold ten times more',lines:[
  'A hardware store’s data shows one week where sales were ten times normal. It’s tempting to delete it and get a tidier fit.',
  'Check the records first. If someone typed an extra zero, fix it. If a hurricane was forecast that week and people stocked up, it’s real — and it’s exactly the kind of week the business needs to plan for.',
  'The rule from class: flag unusual observations, investigate them, and remove one only if you can explain the reason out loud. A cleaner model isn’t worth much if it pretends emergencies never happen.']},

/* ---- Module 4 · Lantern Hollow ---- */
{id:'t4a',m:4,at:'m4-seven',kind:'Origin story',t:'Gauss, Markov, and a famous promise',lines:[
  'The Gauss–Markov theorem is the promise behind ordinary least squares. Gauss proved a version of it in the 1820s. Decades later, the Russian mathematician Andrey Markov presented the result in his own work, and the two names stuck together.',
  'The promise: if the classical assumptions hold, no other linear, unbiased method gives estimates with smaller variance. That’s what BLUE means.',
  'It isn’t a promise that OLS is always right. It’s a promise about what happens when the ground rules hold — which is why we spend so much time checking them.']},
{id:'t4b',m:4,at:'m4-seven',kind:'In the wild',t:'Archers and targets',lines:[
  'Think of an estimator as an archer who gets a fresh sample with every shot. An unbiased archer’s arrows are centered on the bullseye, even if each one lands a little off.',
  'A biased archer’s arrows cluster around the wrong spot — and shooting more arrows doesn’t help. Precision is about how tightly the arrows group. “Best,” in BLUE, means the tightest grouping among the archers who aim true.',
  'When an assumption fails, ask which problem you have: the aim, which is bias, or the spread, which is imprecision. The fixes are different.']},
{id:'t4c',m:4,at:'m4-plots',kind:'Classic mistake',t:'Do the errors have to be normal?',lines:[
  'A common worry: my residuals aren’t perfectly bell-shaped, so my regression is ruined. Not so. Normal errors are the optional seventh assumption. OLS stays unbiased without it.',
  'Normality matters for the exact t and F tests in small samples. As samples grow, the central limit theorem makes those tests approximately right anyway.',
  'So a lopsided residual histogram with a few hundred observations is worth noting, not panicking over. Patterns in the residual plots — curves, funnels, long runs — are usually the bigger warning.']},

/* ---- Module 5 ---- */
{id:'t5a',m:5,at:'m5-tests',kind:'Origin story',t:'The brewer who called himself Student',lines:[
  'The t distribution was born in a brewery. William Sealy Gosset worked for Guinness in Dublin, testing barley and hops with only a few samples at a time.',
  'The usual methods assumed large samples, so Gosset worked out what happens when you only have a handful. Guinness didn’t want staff publishing under their own names, so in 1908 he signed his paper “Student.” That’s why it’s still called Student’s t.',
  'Every time you look up a t critical value, you’re using a tool built to brew better beer from small batches of data.']},
{id:'t5b',m:5,at:'m5-three',kind:'Classic mistake',t:'What a p-value doesn’t say',lines:[
  'A p-value of 0.03 does not mean there’s a three percent chance the null hypothesis is true.',
  'It means: if the null were true, results at least this extreme would show up about three percent of the time. That’s a statement about the data, assuming the null — not about the null itself.',
  'Misreadings like this became common enough that the American Statistical Association issued a formal statement on p-values in 2016. Its message: a p-value is one piece of evidence. It doesn’t measure the size of an effect, or how much it matters.']},
{id:'t5c',m:5,at:'m5-tests',kind:'Manager’s lens',t:'Smoke detectors and false alarms',lines:[
  'A smoke detector is set to go off too often rather than too rarely. Burnt toast is annoying; a missed fire is a disaster. That’s a choice between Type one and Type two errors.',
  'Businesses make the same choice. A card company flags some honest purchases as fraud, because missing real fraud costs more. A food maker recalls a batch at the first sign of contamination.',
  'But a marketing team testing a new slogan may demand strong evidence before switching, because a false alarm just wastes money. Your significance level should reflect what each mistake costs.']},

/* ---- Module 6 ---- */
{id:'t6a',m:6,at:'m6-trial',kind:'Origin story',t:'Fisher’s fields',lines:[
  'In the 1920s, Ronald Fisher worked at an agricultural research station in England, trying to tell which fertilizers really helped crops. Soil varies from plot to plot, so any comparison could be fooled by better land.',
  'Fisher’s answer was to assign treatments to plots at random. Randomization doesn’t make the plots identical. It makes the differences fall by chance rather than by choice, so they balance out on average.',
  'His 1935 book, The Design of Experiments, set out the idea. Today’s business experiments, from store pilots to website tests, follow the same logic.']},
{id:'t6b',m:6,at:'m6-trial',kind:'In the wild',t:'The best idea nobody believed in',lines:[
  'In 2012, an employee working on Microsoft’s Bing suggested a small change to how ad headlines were displayed. It sat in the backlog for months, until an engineer ran a quick randomized test.',
  'Revenue rose about twelve percent — more than a hundred million dollars a year in the United States alone — without hurting the user experience.',
  'Microsoft’s experimentation team has reported that fewer than a third of the ideas they test actually improve the metrics they were designed to move. The lesson: opinions, even expert ones, are a poor guide. A randomized test tells you what really works.']},
{id:'t6c',m:6,at:'m6-omit',kind:'Classic mistake',t:'Does school pay, or do able people stay in school?',lines:[
  'Regress earnings on years of education and you’ll find a strong positive coefficient. But think about what’s missing: ability and motivation.',
  'They likely raise earnings directly, and they’re also linked to staying in school longer. Leave them out, and education takes some of their credit — so the estimate overstates the true effect of schooling.',
  'That’s omitted-variable bias: the missing factor matters for Y, and it moves with an included X. Economists have spent decades on clever designs to separate the two, which tells you how hard this problem is in real data.']},

/* ---- Module 7 · Crystal Reach ---- */
{id:'t7a',m:7,at:'m7-form',kind:'In the wild',t:'Why gas demand barely budges',lines:[
  'When gas prices spike, most people still drive to work the next week. Over months and years they adjust: they buy more efficient cars, move closer, or carpool.',
  'Economists capture this with elasticities — the percentage change in quantity for a one percent change in price. Studies typically find that short-run gasoline demand is quite inelastic, well under one in absolute value, and more responsive in the long run.',
  'A log-log model gives you that elasticity directly as the slope, which is why it’s a favorite for pricing questions.']},
{id:'t7b',m:7,at:'m7-form',kind:'Manager’s lens',t:'The tenth ad isn’t worth the first',lines:[
  'The first dollars of advertising reach people who’ve never heard of you. Later dollars mostly reach the same people again. Each extra dollar does a little less.',
  'A straight line can’t show that; it assumes every dollar works equally hard, forever. A log of advertising captures diminishing returns: the curve rises quickly, then flattens.',
  'For a budget decision, that shape is everything. A linear model might tell you to keep spending. The log model shows where the next dollar stops paying for itself.']},
{id:'t7c',m:7,at:'m7-form',kind:'Origin story',t:'Why earnings curves bend',lines:[
  'In 1974, the economist Jacob Mincer published a model of earnings that’s still used today. Earnings rise with experience, but not in a straight line. They climb quickly early in a career, flatten in midlife, and can dip later on.',
  'Mincer captured that with experience and experience squared. That’s the quadratic from class: a positive first term, a negative squared term, and a peak where the slope reaches zero.',
  'It’s also a warning about extrapolation. A straight line fitted to young workers would predict endless raises. The curve is more honest.']},

/* ---- Module 8 ---- */
{id:'t8a',m:8,at:'m8-multi',kind:'Manager’s lens',t:'The TV budget that looked useless',lines:[
  'A vice president reviews the marketing model. TV spending isn’t significant, so she proposes cutting it.',
  'But TV and online spending have always risen and fallen together, because both are set in the same budget meeting. The model can’t tell which one deserves the credit, so both coefficients look shaky. Together, they’re strongly significant. Cutting TV might hurt sales badly.',
  'The honest answer is: this data can’t separate them. If the question really matters, run a test — change one channel in some markets and hold the other steady.']},
{id:'t8b',m:8,at:'m8-multi',kind:'In the wild',t:'The bedroom that lowers the price',lines:[
  'In house-price models, square footage, bedrooms and bathrooms all move together. Sometimes the bedroom coefficient comes out negative, which seems absurd.',
  'But read it carefully: holding square footage constant, one more bedroom means the same space cut into smaller rooms. Buyers may value that less.',
  'So the sign isn’t necessarily wrong — it answers a narrower question than the one you had in mind. Correlated variables make each coefficient a “holding the others fixed” story, and sometimes that story is surprising.']},
{id:'t8c',m:8,at:'m8-multi',kind:'Classic mistake',t:'Dropping a variable to fix it',lines:[
  'When multicollinearity makes coefficients look weak, the quick fix is to drop one of the correlated variables. The standard errors shrink and everything looks significant.',
  'But if the dropped variable truly belongs in the model, you’ve traded imprecision for bias. The remaining coefficient now carries the effect of both.',
  'Often the better choices are to keep both and report them honestly, combine them into one sensible measure, or gather more data with more independent variation. Precision you get by hiding a variable is precision you can’t trust.']},

/* ---- Module 9 ---- */
{id:'t9a',m:9,at:'m9-serial',kind:'Origin story',t:'Two statisticians and a ratio',lines:[
  'James Durbin, a British statistician, and Geoffrey Watson, an Australian, published their test for serial correlation in a pair of papers in 1950 and 1951.',
  'Their statistic compares how much the residuals change from one period to the next with how big they are overall. If neighboring residuals look alike, the changes are small and the statistic drifts toward zero. If they flip sign every period, it rises toward four.',
  'Their tables of lower and upper critical values, with an inconclusive zone between them, are still printed in textbooks today.']},
{id:'t9b',m:9,at:'m9-serial',kind:'In the wild',t:'Why business data has momentum',lines:[
  'Business time series rarely start fresh each period. Customers have habits. Inventory carries over. A strong economy this quarter usually means a strong economy next quarter.',
  'So when a model misses high one month, it often misses high the next month too. Sometimes that’s pure serial correlation. Often it’s a sign of something missing: a trend, a season, or last period’s value.',
  'Before you reach for a correction, look at what the runs in your residuals are telling you about the business.']},
{id:'t9c',m:9,at:'m9-serial',kind:'Classic mistake',t:'Two trends that fall in love',lines:[
  'Take any two series that grow over time — say, a country’s ice cream sales and its number of streaming subscribers — and regress one on the other. You’ll often get a big R squared and a “significant” slope, even though they have nothing to do with each other.',
  'Clive Granger and Paul Newbold showed in 1974 how easily this happens, and called it spurious regression. One warning sign they pointed to: an R squared higher than the Durbin–Watson statistic.',
  'When both variables trend, ask whether you’re seeing a relationship, or just two things growing at once.']},

/* ---- Module 10 ---- */
{id:'t10a',m:10,at:'m10-hetero',kind:'In the wild',t:'Bigger budgets, bigger surprises',lines:[
  'Look at food spending by household income. Lower-income families spend within a fairly narrow range — there’s only so much room in the budget. Higher-income families vary enormously: some cook simply at home, others dine out every night.',
  'The average rises with income, but so does the spread. That widening fan of residuals is heteroskedasticity, and it’s the textbook example for a reason.',
  'Anywhere size varies a lot — firms, cities, households — expect the errors to grow with it.']},
{id:'t10b',m:10,at:'m10-hetero',kind:'Origin story',t:'The fix that changed economics',lines:[
  'In 1979, Trevor Breusch and Adrian Pagan published a test for changing error variance. In 1980, Halbert White published a paper with a broader test — and a way to correct the standard errors without knowing the exact form of the problem.',
  'Those heteroskedasticity-robust standard errors, often called White standard errors, became one of the most widely used tools in economics.',
  'Today many researchers report robust standard errors by default, as a safety net, whenever their data mixes small and large units.']},
{id:'t10c',m:10,at:'m10-hetero',kind:'Manager’s lens',t:'Same forecast, different confidence',lines:[
  'Your model forecasts next year’s sales for a corner shop and for a flagship store. Both forecasts come with the same plus-or-minus range, because the model assumes every store’s errors are the same size.',
  'But the flagship’s sales swing far more. Its true range is much wider, and the corner shop’s is narrower. Plan inventory with the wrong range and you’ll be caught short at the big store.',
  'Logs, or a per-unit measure like sales per square foot, often tame the problem — and robust standard errors keep your tests honest.']},
];
for(const T of TOTEMS)TEACH[T.id]={t:T.t,k:`Learning totem · Module ${T.m} · ${T.kind}`,lines:T.lines,voice:`totem_${T.id}`};
const totemRegion=T=>COURSE.regions.find(r=>r.nodes.includes(T.at));
