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
     theme:{tint:'#e3d8ef',tod:'night',lamps:16,birch:6,trees:150,flowers:30,lake:[230,130]},
     nodes:['m4-seven','m4-plots','m5-tests','m5-three','m6-trial','m6-omit'],
     npc:{id:'owl-hollow',name:'Warden Quill',role:'Modules 4–6 guide',lines:['Lantern Hollow keeps the rules that make regression trustworthy. Six stones ring the pond: two for the classical assumptions, two for hypothesis testing, two for causation and choosing variables.','Remember the theme of this place: a clean-looking table can still be wrong. Assumptions decide which claims are credible; tests measure evidence, not truth; design — not regression — earns the word “causal.”','Same rules as the woods: waypoints before each stone, at most one miss, and a stone that freezes if you rush it.']}},
    {id:'reach',name:'Crystal Reach',sub:'Modules 7–10 · Functional form & model diagnostics',requires:'hollow',
     theme:{tint:'#d2e5f2',tod:'night',lamps:6,birch:4,trees:140,crystals:14,blueTrees:true,bushes:16,lake:[270,150]},
     nodes:['m7','m8','m9','m10'],
     npc:{id:'owl-reach',name:'Warden Quill',role:'Guide',lines:['Crystal Reach is where broken models come to be diagnosed: wrong shapes, tangled drivers, echoing errors, and fanning residuals.','These stones open in a later build.']}},
  ],
};
const sealed=(id,m,title,blurb)=>NODES[id]={sealed:true,kicker:`Module ${m}`,title,sealedText:`<b>${title}.</b> ${blurb} This stone's quests are added in a later build.`};
sealed('m7',7,'Choosing the Functional Form','Linear, log, semilog, polynomial, and lagged models.');
sealed('m8',8,'Multicollinearity','When explanatory variables tell almost the same story.');
sealed('m9',9,'Serial Correlation','When today’s residual helps predict tomorrow’s.');
sealed('m10',10,'Heteroskedasticity','When the error variance changes across observations.');
