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
    'Miss a question and it gets pinned to the <b>review board</b> by the fire. It comes back with fresh numbers until you get it right first time.',
    'Press <b>Q</b> (or the Quests button) for the course map and your save code. Walk with WASD, arrows, a tap, or the joystick.',
  ]},
  hubNpc:{id:'owl-hub',name:'Warden Quill',role:'Keeper of the study stones',lines:[
    'Hoo — a new analyst. Good. The stones went dark when people started treating regression output as a verdict instead of evidence.',
    'Every stone you restore is one idea you can defend: what a model supports, what it cannot prove, and what uncertainty remains.',
    'Start north, in Signpost Woods. Its stones hold Module 1, and later Modules 2 and 3. I will meet you by their fire.',
  ]},
  regions:[
    {id:'woods',name:'Signpost Woods',sub:'Modules 1–3 · Regression foundations',requires:null,
     theme:{tint:'#dde9e4',tod:'dusk',lamps:8,birch:16,trees:170,lake:[250,140]},
     nodes:['m1-signs','m1-cross','m1-magic','m1-units','m1-ledger','m2','m3'],
     npc:{id:'owl-woods',name:'Warden Quill',role:'Module 1 guide',lines:[
       'Module 1 in one line: use evidence to organize uncertainty before a commitment — not to manufacture certainty.',
       'Five stones ring the lake: theory and signs, causes and coincidences, a booth at Magic Hill, a mill that grinds units, and a guild ledger full of Excel output.',
       'Read output in this order: signs and units, size, precision, fit and residuals, then whether the whole specification is plausible. Off you go.',
     ]}},
    {id:'hollow',name:'Lantern Hollow',sub:'Modules 4–6 · Assumptions, testing, causation',requires:'woods',
     theme:{tint:'#e3d8ef',tod:'night',lamps:16,birch:6,trees:150,flowers:30,lake:[230,130]},
     nodes:['m4','m5','m6'],
     npc:{id:'owl-hollow',name:'Warden Quill',role:'Guide',lines:['The lanterns here mark the classical assumptions, hypothesis tests, and the road from correlation to causation.','These stones open in a later build.']}},
    {id:'reach',name:'Crystal Reach',sub:'Modules 7–10 · Functional form & model diagnostics',requires:'hollow',
     theme:{tint:'#d2e5f2',tod:'night',lamps:6,birch:4,trees:140,crystals:14,blueTrees:true,bushes:16,lake:[270,150]},
     nodes:['m7','m8','m9','m10'],
     npc:{id:'owl-reach',name:'Warden Quill',role:'Guide',lines:['Crystal Reach is where broken models come to be diagnosed: wrong shapes, tangled drivers, echoing errors, and fanning residuals.','These stones open in a later build.']}},
  ],
};
const sealed=(id,m,title,blurb)=>NODES[id]={sealed:true,kicker:`Module ${m}`,title,sealedText:`<b>${title}.</b> ${blurb} This stone's quests are added in a later build.`};
sealed('m2',2,'Ordinary Least Squares','Estimating β with OLS in Excel and judging model fit.');
sealed('m3',3,'Regression Design','The six steps from business mechanism to a defensible model.');
sealed('m4',4,'The Classical Assumptions','Seven assumptions that make OLS estimates trustworthy.');
sealed('m5',5,'Hypothesis Testing','t-tests, p-values, confidence intervals, and F-tests as decision evidence.');
sealed('m6',6,'Regression and Causation','Research designs that move from association toward causation.');
sealed('m7',7,'Choosing the Functional Form','Linear, log, semilog, polynomial, and lagged models.');
sealed('m8',8,'Multicollinearity','When explanatory variables tell almost the same story.');
sealed('m9',9,'Serial Correlation','When today’s residual helps predict tomorrow’s.');
sealed('m10',10,'Heteroskedasticity','When the error variance changes across observations.');
