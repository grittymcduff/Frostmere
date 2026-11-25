/* ==========================================================================
   COURSE MAP — Applied Business Research Tools
   Regions, guides, and placeholder stones. Each module's quests live in their
   own file (m1.js, m2.js …) and register themselves in NODES.
   A stone listed here without content shows as "sealed" until its file exists.
   ========================================================================== */
const COURSE={
  hubName:'Frostmere Village',
  hubSub:'Home base · Applied Business Research Tools',
  welcome:{id:'welcome',name:'Welcome to Frostmere',role:'Village notice',lines:[
    'Beyond these three gates lie the study stones of <b>Applied Business Research Tools</b>. Each stone holds a handful of challenges drawn from one part of the course.',
    'Restore every stone in a region to unseal the next gate. <b>Signpost Woods</b> (north gate) is open now.',
    'On the path before each stone stand small <b>waypoints</b> — lecterns with a short lesson and practice. Skip them and challenge the stone if you feel ready, but miss two or more and the stone <b>freezes</b> until you finish its waypoints in order.',
    'Miss a question and it gets pinned to the <b>review board</b> by the fire. It comes back with fresh numbers until you get it right first time.',
    'Ready to test yourself? The lectern on the south path holds a <b>practice final</b>: 20 questions, two from each module, with a clock and a score.',
    'Press <b>Q</b> (or the Quests button) for the course map and your save code. Walk with WASD, arrows, a tap, or the joystick.',
  ]},
  hubNpc:{id:'owl-hub',name:'Warden Quill',role:'Keeper of the study stones',lines:[
    'Hoo — a new analyst. Good. The stones went dark when people started treating regression output as a verdict instead of evidence.',
    'Every stone you restore is one idea you can defend: what a model supports, what it cannot prove, and what uncertainty remains.',
    'Start north, in Signpost Woods. Its stones hold Module 1, and later Modules 2 and 3. I will meet you by their fire.',
  ]},
  regions:[
    {id:'woods',name:'Signpost Woods',sub:'Modules 1–3 · Regression foundations',requires:null,
     theme:{size:[2600,1900],tint:'#dde9e4',tod:'dusk',lamps:8,birch:16,trees:170,lake:[250,140]},
     nodes:['m1-signs','m1-cross','m1-magic','m1-units','m1-ledger','m2-ols','m2-andy','m2-fit','m3-design','m3-dummy'],
     npc:{id:'owl-woods',name:'Warden Quill',role:'Module 1 guide',lines:[
       'Module 1 in one line: use evidence to organize uncertainty before a commitment — not to manufacture certainty.',
       'Ten stones ring the lake. The first five are Module 1: signs, causes, the Magic Hill booth, the Units Mill, and the Guild Ledger. Past the top of the lake, Modules 2 and 3 take over: least squares, Big Andy’s Burger Barn, the Mirror of Fit, the Architect’s Stone, and the Fork of Categories.',
       'Before each stone you’ll pass a pair of waypoint lecterns. Read them if you want a warm-up. Challenge a stone cold and miss twice, and it freezes until you’ve worked through them.',
       'Read output in this order: signs and units, size, precision, fit and residuals, then whether the whole specification is plausible. Off you go.',
     ]}},
    {id:'hollow',name:'Lantern Hollow',sub:'Modules 4–6 · Assumptions, testing, causation',requires:'woods',
     theme:{tint:'#e6d0ee',tod:'festival',lamps:20,birch:6,trees:150,flowers:30,lake:[230,130],treeSet:'violet',lanternStrings:true,skyLanterns:true},
     nodes:['m4-seven','m4-plots','m5-tests','m5-three','m6-trial','m6-omit'],
     npc:{id:'owl-hollow',name:'Warden Quill',role:'Modules 4–6 guide',lines:['Lantern Hollow keeps the rules that make regression trustworthy. Six stones ring the pond: two for the classical assumptions, two for hypothesis testing, two for causation and choosing variables.','Remember the theme of this place: a clean-looking table can still be wrong. Assumptions decide which claims are credible; tests measure evidence, not truth; design — not regression — earns the word “causal.”','Same rules as the woods: waypoints before each stone, at most one miss, and a stone that freezes if you rush it.']}},
    {id:'reach',name:'Crystal Reach',sub:'Modules 7–10 · Functional form & model diagnostics',requires:'hollow',
     theme:{tint:'#cfe6f2',tod:'aurora',lamps:6,birch:4,trees:140,crystals:14,treeSet:'blue',aurora:true,bushes:16,lake:[270,150]},
     nodes:['m7-form','m8-multi','m9-serial','m10-hetero'],
     npc:{id:'owl-reach',name:'Warden Quill',role:'Modules 7–10 guide',lines:['Crystal Reach is where broken models come to be diagnosed: wrong shapes, tangled drivers, echoing errors, and fanning residuals. Four stones, one for each module.','The Bending Crystal asks whether your equation has the right <b>shape</b>. The Twin Prisms ask whether two drivers overlap so much the model can’t credit either. The Echoing Ice asks whether errors repeat over time. The Widening Fan asks whether the errors grow with scale.','A theme for this place: most of these problems leave the coefficients standing but make the model <b>overconfident</b>. Diagnose first, fix the specification before patching standard errors, and let theory — not p-values — decide what stays. Same rules as before: waypoints, at most one miss, and stones that freeze if you rush.']}},
  ],
};

/* plain-language map text: what each place and stone is about */
COURSE.plain={
  hub:'Home base. Talk to Warden Quill, retry missed questions at the review board, and take the practice final.',
  woods:'The basics: what a regression says, how to read its output, and how to build one sensibly.',
  hollow:'Can you trust it? The ground rules behind a regression, testing whether an effect is real, and cause versus coincidence.',
  reach:'Fixing problem models: the wrong shape, factors that overlap, and errors that follow a pattern.',
};
COURSE.about={
  'm1-signs':'Predicting which way each factor should push the result — before touching any data',
  'm1-cross':'Telling cause from coincidence: hidden third factors, reverse cause, and experiments',
  'm1-magic':'Turning an equation into predictions, and what a miss (a residual) means',
  'm1-units':'Reading an effect in real-world units, and when the starting value (intercept) means anything',
  'm1-ledger':'Reading Excel’s regression output in a sensible order',
  'm2-ols':'How the “line of best fit” is chosen, and how much of the story it explains',
  'm2-andy':'Reading one factor’s effect while holding the others steady, to compare business options',
  'm2-fit':'What R² and adjusted R² can — and can’t — tell you about a model',
  'm3-design':'The six steps of building a model, and what to do with odd data points',
  'm3-dummy':'Putting yes/no and category information into a model without the dummy trap',
  'm4-seven':'The seven ground rules a regression relies on, and what breaks when one fails',
  'm4-plots':'Reading leftover-error (residual) plots and spotting data points worth a second look',
  'm5-tests':'Setting up a test of whether an effect is real, and the two ways a test can be wrong',
  'm5-three':'p-values, confidence ranges, and the overall F-test — and “significant” versus “important”',
  'm6-trial':'Why randomized experiments can prove cause and effect when ordinary data can’t',
  'm6-omit':'What goes wrong when an important factor is left out — or a useless one is added',
  'm7-form':'Choosing the right shape: a straight line, a curve, percentages (logs), or a time delay',
  'm8-multi':'When two factors move together so closely the model can’t tell which one matters',
  'm9-serial':'When this period’s error spills into the next — a time-series problem',
  'm10-hetero':'When errors grow with the size of the company or project — and the model gets overconfident',
};
