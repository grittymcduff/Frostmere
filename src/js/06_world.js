/* ---------- world: scenes, gates, study stones ---------- */
const objects=[], colliders=[], lights=[], chimneys=[], INTER=[], GATES=[];
const occupied=[];
function free(x,y,r){
  if(x<20||y<30||x>W-20||y>H-10)return false;
  {const ex=(x-POND.x)/(POND.rx+r+24),ey=(y-POND.y)/(POND.ry+r+30);if(ex*ex+ey*ey<1)return false;}
  for(const o of occupied){const d=Math.hypot(x-o[0],(y-o[1])*1.3);if(d<r+o[2])return false;}
  return true;
}
function claim(x,y,r){occupied.push([x,y,r]);}
function nearPath(x,y,m){for(let dy=-m;dy<=m;dy+=GC)for(let dx=-m;dx<=m;dx+=GC)if(surfaceAt(x+dx,y+dy)!==0)return true;return false;}
function addObj(o){o.fade=1;o.s=o.s||1;objects.push(o);return o;}
function addLight(x,y,r,col,i,fl){const L={x,y,r,col,i,fl,seed:rand(0,100)};lights.push(L);return L;}

/* --- extra sprites for the quest world --- */
function makeGate(){
  return makeSprite(190,170,95,150,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,6,0,88,14);
    for(const sx of [-1,1]){
      const x=sx*62;
      g.fillStyle='#5b6272';g.fillRect(x-15,-112,30,112);
      for(let r=0;r<9;r++)for(let c=0;c<2;c++){g.fillStyle=pick(['#8b91a0','#7a8090','#979caa','#6f7686']);g.beginPath();g.roundRect(x-14+c*14+(r%2)*4-2,-110+r*12.4,12,11,2);g.fill();}
      g.fillStyle='rgba(20,22,45,.28)';g.fillRect(x+4,-112,11,112);
      g.fillStyle='#fbfdff';g.beginPath();g.roundRect(x-19,-122,38,12,6);g.fill();
      g.fillStyle='#f4f8fc';ell(g,x,-2,22,5);
    }
    // arch beam + banner
    g.fillStyle='#4a3022';g.beginPath();g.roundRect(-84,-132,168,13,4);g.fill();
    g.fillStyle='#6c4630';g.fillRect(-84,-132,168,4);
    g.fillStyle='#f6f9fd';g.beginPath();g.roundRect(-86,-138,172,7,4);g.fill();
    g.fillStyle='#7d2430';g.beginPath();g.moveTo(-26,-119);g.lineTo(26,-119);g.lineTo(26,-78);g.lineTo(0,-88);g.lineTo(-26,-78);g.closePath();g.fill();
    g.strokeStyle='#e2b65a';g.lineWidth=1.6;g.beginPath();g.moveTo(-22,-115);g.lineTo(22,-115);g.stroke();
    g.fillStyle='#e2b65a';g.beginPath();g.moveTo(0,-110);g.lineTo(6,-102);g.lineTo(0,-94);g.lineTo(-6,-102);g.closePath();g.fill();
    // hanging lanterns
    for(const sx of [-1,1]){g.strokeStyle='#2a2420';g.lineWidth=1;g.beginPath();g.moveTo(sx*44,-119);g.lineTo(sx*44,-108);g.stroke();
      g.fillStyle='#2a2420';g.fillRect(sx*44-5,-108,10,2);const lg=g.createLinearGradient(0,-106,0,-96);lg.addColorStop(0,'#fff4c8');lg.addColorStop(1,'#ffae45');g.fillStyle=lg;g.fillRect(sx*44-4,-106,8,10);}
  });
}
function makeStone(){
  return makeSprite(70,110,35,98,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,6,0,26,8);
    g.fillStyle='#e8eff7';ell(g,0,-2,24,7);
    const sg=g.createLinearGradient(-16,0,16,0);sg.addColorStop(0,'#8a93a6');sg.addColorStop(.55,'#5f687c');sg.addColorStop(1,'#3e4558');
    g.fillStyle=sg;g.beginPath();g.moveTo(-16,-4);g.lineTo(-13,-66);g.quadraticCurveTo(0,-82,13,-66);g.lineTo(16,-4);g.closePath();g.fill();
    g.strokeStyle='rgba(20,24,40,.35)';g.lineWidth=1;g.beginPath();g.moveTo(-10,-20);g.lineTo(-4,-30);g.moveTo(8,-12);g.lineTo(11,-24);g.stroke();
    // carved glyph (regression line + dots)
    g.strokeStyle='#ffe0a0';g.lineWidth=1.8;g.lineCap='round';
    g.beginPath();g.moveTo(-8,-26);g.lineTo(8,-52);g.stroke();
    g.fillStyle='#ffe0a0';for(const [dx,dy] of [[-6,-34],[-2,-36],[1,-44],[5,-42],[-4,-28],[7,-50]])circ(g,dx,dy,1.4);
    g.strokeStyle='rgba(255,224,160,.6)';g.lineWidth=1;g.strokeRect(-10,-58,20,36);
    g.fillStyle='#fbfdff';g.beginPath();g.moveTo(-13,-66);g.quadraticCurveTo(0,-86,13,-66);g.quadraticCurveTo(0,-70,-13,-66);g.fill();
  });
}
function makeOwl(){
  return makeSprite(60,100,30,92,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,14,5);
    g.fillStyle='#4e3423';g.fillRect(-3,-46,6,46);g.fillStyle='#5f412c';g.beginPath();g.roundRect(-14,-50,28,6,3);g.fill();
    g.fillStyle='#fbfdff';g.beginPath();g.roundRect(-15,-52,30,3,2);g.fill();
    // body
    const bg=g.createLinearGradient(-14,-80,14,-50);bg.addColorStop(0,'#9a7350');bg.addColorStop(1,'#5e4027');
    g.fillStyle=bg;ell(g,0,-66,14,17);
    g.fillStyle='#ead9b8';ell(g,0,-61,8.5,11);
    g.strokeStyle='rgba(120,90,60,.5)';g.lineWidth=1;for(const y of [-64,-59,-54]){g.beginPath();g.arc(0,y,4,.3,Math.PI-.3);g.stroke();}
    // head
    g.fillStyle='#8a6545';ell(g,0,-84,12,10);
    g.beginPath();g.moveTo(-11,-89);g.lineTo(-13,-98);g.lineTo(-5,-92);g.fill();g.beginPath();g.moveTo(11,-89);g.lineTo(13,-98);g.lineTo(5,-92);g.fill();
    g.fillStyle='#f3e6c8';circ(g,-5,-84,5);circ(g,5,-84,5);
    g.fillStyle='#e9a43a';circ(g,-5,-84,3);circ(g,5,-84,3);
    g.fillStyle='#1b1616';circ(g,-5,-84,1.7);circ(g,5,-84,1.7);g.fillStyle='#fff';circ(g,-5.6,-84.8,.6);circ(g,4.4,-84.8,.6);
    g.fillStyle='#d58b2e';g.beginPath();g.moveTo(-1.5,-80.5);g.lineTo(1.5,-80.5);g.lineTo(0,-77);g.closePath();g.fill();
    // mortarboard
    g.fillStyle='#1f2230';g.beginPath();g.moveTo(-15,-95);g.lineTo(0,-100);g.lineTo(15,-95);g.lineTo(0,-90);g.closePath();g.fill();
    g.fillRect(-6,-95,12,4);g.strokeStyle='#e2b65a';g.lineWidth=1;g.beginPath();g.moveTo(0,-95);g.lineTo(9,-93);g.lineTo(10,-86);g.stroke();
    g.fillStyle='#e2b65a';circ(g,10,-85,1.4);
    // tiny book
    g.fillStyle='#7d2430';g.fillRect(-12,-56,9,7);g.fillStyle='#f3e6c8';g.fillRect(-11,-55,7,1.4);
  });
}

const SPR={};
function initSprites(){
  SPR.pines=[0,1,2,3,4,5].map(i=>makePine(160+i*6+rand(-4,4)));
  SPR.pinesB=[0,1,2].map(i=>makePine(200+i*8));
  SPR.birch=[0,1,2,3].map(()=>makeBirch());
  SPR.rocks=[0,1,2,3,4].map(()=>makeRock());
  SPR.bush=[0,1,2,3].map(()=>makeBush());
  SPR.lamp=makeLamp();SPR.crate=makeCrate();SPR.barrel=makeBarrel();SPR.snowman=makeSnowman();
  SPR.crystals=[0,1,2].map(()=>makeCrystals());SPR.sign=makeSign();SPR.flowers=[0,1,2].map(()=>makeFlowers());
  SPR.firepit=makeFirePit();SPR.fgPine=makeFgPine();
  SPR.gate=makeGate();SPR.stone=makeStone();SPR.owl=makeOwl();
  SPR.cabins=[196,176,170,156,150].map(w=>makeCabin(w));
}

/* --- shared placement helpers --- */
const prop=(spr,x,y,r,kind='prop',s=1)=>{addObj({kind,x,y,spr,s});if(r)colliders.push({t:'c',x,y:y-4,r});claim(x,y,r+6);};
function addLamp(x,y){addObj({kind:'lamp',x,y,spr:SPR.lamp});colliders.push({t:'c',x,y,r:6});claim(x,y,16);addLight(x,y-70,140,[255,190,110],.85,.06);}
function addCampfire(x,y){addObj({kind:'fire',x,y:y+8,spr:SPR.firepit});colliders.push({t:'c',x,y,r:34});addLight(x,y-14,280,[255,150,60],1,.22);}
function addGate(x,y,to,spawnKey){
  const reg=regionById(to);
  const o=addObj({kind:'gate',x,y,spr:SPR.gate,occ:[-90,90,-150,-20]});
  colliders.push({t:'c',x:x-62,y:y-4,r:17},{t:'c',x:x+62,y:y-4,r:17});claim(x,y,90);
  const gate={x,y,to,spawnKey,cool:0};
  o.marker={x,y,h:168,state:()=>regionUnlocked(to)?'none':'sealed'};
  GATES.push(gate);
  const L=addLight(x,y-100,130,[255,200,120],.85,.08);
  gate.light=L;gate.name=reg?reg.name:to;
  return gate;
}
function addStone(x,y,nodeId){
  addObj({kind:'stone',x,y,spr:SPR.stone,marker:{x,y,h:104,state:()=>nodeState(nodeId)}});
  colliders.push({t:'c',x,y:y-4,r:14});claim(x,y,40);
  const L=addLight(x,y-40,120,[255,205,120],.8,.1);L.node=nodeId;
  INTER.push({x,y,r:58,node:nodeId,label:()=>nodeState(nodeId)==='sealed'?'Inspect sealed stone':'Study the stone',act:()=>openNode(nodeId)});
}
function addOwl(x,y,npc){
  addObj({kind:'owl',x,y,spr:SPR.owl,marker:{x,y,h:112,state:()=>SAVE.seen[npc.id]?'none':'talk'}});
  colliders.push({t:'c',x,y:y-2,r:9});claim(x,y,30);
  INTER.push({x,y,r:60,label:()=>'Talk to '+npc.name,act:()=>openDialog(npc)});
}
function scatterForest(count,innerProb,ellipse,hue){
  let placed=0;
  for(let tries=0;tries<6000&&placed<count;tries++){
    const x=rand(0,W),y=rand(20,H+40);
    const ex=(x-ellipse.x)/ellipse.rx,ey=(y-ellipse.y)/ellipse.ry,inside=ex*ex+ey*ey<1;
    if(inside&&R()>innerProb)continue;
    const s=rand(.78,1.35);
    if(nearPath(x,y,40)||!free(x,y,26*s))continue;
    addObj({kind:'pine',x,y,spr:pick(hue?SPR.pinesB:SPR.pines),s,sway:1,phase:rand(0,9),occ:[-44,44,-170,-24]});
    colliders.push({t:'c',x,y:y-2,r:10*s});claim(x,y,26*s);placed++;
  }
}
function scatterSmall(nRocks,nBush,nFlowers){
  for(let i=0,n=0;i<900&&n<nRocks;i++){const x=rand(40,W-40),y=rand(60,H-20);if(nearPath(x,y,20)||!free(x,y,18))continue;prop(pick(SPR.rocks),x,y,13,'rock',rand(.6,1.2));n++;}
  for(let i=0,n=0;i<900&&n<nBush;i++){const x=rand(40,W-40),y=rand(60,H-20);if(nearPath(x,y,20)||!free(x,y,16))continue;addObj({kind:'bush',x,y,spr:pick(SPR.bush),s:rand(.8,1.15),sway:.35,phase:rand(0,9)});claim(x,y,14);n++;}
  for(let i=0,n=0;i<900&&n<nFlowers;i++){const x=rand(300,W-300),y=rand(250,H-200);if(nearPath(x,y,10)||!free(x,y,10))continue;addObj({kind:'flower',x,y,spr:pick(SPR.flowers),sway:.25,phase:rand(0,9)});claim(x,y,8);n++;}
}
function pondRocks(){
  for(let i=0;i<9;i++){const a=rand(0,TAU),x=POND.x+Math.cos(a)*(POND.rx+28),y=POND.y+Math.sin(a)*(POND.ry+22);prop(pick(SPR.rocks),x,y,14,'rock',rand(.7,1.1));}
}

/* --- the hub: Frostmere Village --- */
function buildHub(){
  PLAZA={x:1000,y:770,r:165};POND={x:1565,y:1175,rx:235,ry:128};GROVE={x:1640,y:320};
  PATHS=[
    [[1000,1540],[985,1330],[1012,1110],[995,930]],
    [[1000,610],[978,470],[1004,300],[1024,130],[1000,10]],
    [[840,770],[700,790],[560,765],[380,805],[180,775],[20,790]],
    [[1160,780],[1300,810],[1430,900],[1505,1020]],
    [[1120,660],[1290,560],[1450,480],[1580,450],[1760,440],[1990,430]],
  ];
  CLEARINGS=[];SCENE={fire:true};GROUND_TINT=null;
  buildSurface();paintGround();
  claim(PLAZA.x,PLAZA.y,PLAZA.r);
  addCampfire(PLAZA.x,PLAZA.y);
  const cabins=[[740,640],[1255,625],[690,1040],[1240,350],[600,420]];
  cabins.forEach(([x,y],i)=>{
    const spr=SPR.cabins[i],w=spr.info.w;
    addObj({kind:'cabin',x,y,spr,occ:[-w/2-16,w/2+16,-spr.info.bodyH-spr.info.roofH-6,-70]});
    colliders.push({t:'r',x0:x-w/2-6,x1:x+w/2+6,y0:y-74,y1:y+2});
    claim(x,y-50,w*.65);
    for(const [wx,wy] of spr.info.windows)addLight(x+wx,y+wy+20,95,[255,180,90],.8,.05);
    chimneys.push({x:x+spr.info.chimney[0],y:y+spr.info.chimney[1],acc:rand(0,1)});
  });
  const cr=[[GROVE.x,GROVE.y+20,1],[GROVE.x-95,GROVE.y+50,.7],[GROVE.x+90,GROVE.y-10,.6]];
  cr.forEach(([x,y,s],i)=>{addObj({kind:'crystal',x,y,spr:SPR.crystals[i%3],s});colliders.push({t:'c',x,y:y-4,r:26*s});claim(x,y,50*s);
    addLight(x,y-30*s,150*s+30,[110,200,255],.8,.12);});
  for(const [x,y] of [[945,1250],[1060,1010],[940,560],[1062,300],[810,830],[470,735],[1245,850],[1400,950],[1350,560],[260,735],[955,110],[1820,480]])addLamp(x,y);
  prop(SPR.crate,880,662,13);prop(SPR.crate,905,676,13);prop(SPR.barrel,868,690,10);
  prop(SPR.barrel,1370,640,10);prop(SPR.barrel,1392,652,10);prop(SPR.crate,1150,650,13);
  prop(SPR.crate,800,1066,13);prop(SPR.barrel,580,1070,10);
  prop(SPR.snowman,1150,905,14,'snowman');
  for(const [x,y,len] of [[560,1100,110],[700,1100,60],[1170,420,130],[470,470,90],[1310,690,80]]){
    addObj({kind:'fence',x,y,spr:makeFence(len)});colliders.push({t:'r',x0:x-2,x1:x+len+2,y0:y-6,y1:y+3});claim(x+len/2,y,len/2);
  }
  // signs: welcome + review board
  const sign=(x,y,label,act,state)=>{addObj({kind:'sign',x,y,spr:SPR.sign,marker:{x,y,h:80,state}});colliders.push({t:'c',x,y:y-2,r:7});claim(x,y,30);
    addLight(x,y-78,70,[255,205,110],.8,.1);INTER.push({x,y,r:60,label:()=>label,act});};
  sign(1090,1185,'Read the welcome sign',openWelcome,()=>SAVE.seen.welcome?'none':'todo');
  sign(860,880,'Open the review board',openReview,()=>SAVE.missed.length?'todo':'none');
  addOwl(1120,700,COURSE.hubNpc);
  addGate(1000,70,'woods','fromHub');
  addGate(60,790,'hollow','fromHub');
  addGate(1945,440,'reach','fromHub');
  pondRocks();
  for(const [x,y] of [[1840,1010],[1310,1290],[1880,1300],[1760,980],[300,1050],[360,560],[1440,1380],[180,1240]]){
    if(free(x,y,18)){addObj({kind:'birch',x,y,spr:pick(SPR.birch),s:rand(.85,1.15),sway:.6,phase:rand(0,9)});colliders.push({t:'c',x,y,r:8});claim(x,y,22);}
  }
  scatterForest(150,.06,{x:1000,y:760,rx:760,ry:560});
  scatterSmall(34,40,30);
  return {
    start:{x:1000,y:1240},
    fromHub:{x:1000,y:1240},
    fromWoods:{x:1000,y:180},fromHollow:{x:170,y:800},fromReach:{x:1830,y:470},
  };
}

/* --- a wild region (one per group of modules) --- */
function buildWild(reg){
  const th=reg.theme;
  const nodes=reg.nodes, n=nodes.length;
  PLAZA={x:1000,y:1170,r:120};
  POND={x:1000,y:690,rx:th.lake?.[0]||250,ry:th.lake?.[1]||140};
  GROVE=th.crystals?{x:1000,y:690}:null;
  // nodes ring around the lake, from bottom-left over the top to bottom-right
  const pts=[];
  for(let k=0;k<n;k++){const a=(150+k*(240/Math.max(1,n-1)))*Math.PI/180;pts.push([1000+Math.cos(a)*640+rand(-25,25),690+Math.sin(a)*440+rand(-15,15)]);}
  CLEARINGS=pts.map(([x,y])=>({x,y,r:70}));
  const ring=[[PLAZA.x-60,PLAZA.y-40],...pts,[PLAZA.x+60,PLAZA.y-40]];
  PATHS=[[[1000,1530],[990,1360],[1000,1230]],ring];
  const nextReg=COURSE.regions.find(r=>r.requires===reg.id);
  const top=pts.reduce((a,b)=>b[1]<a[1]?b:a);
  if(nextReg)PATHS.push([[top[0],top[1]],[ (top[0]+1000)/2, top[1]-60],[1000,10]]);
  SCENE={fire:true};GROUND_TINT=th.tint;
  buildSurface();paintGround();
  claim(PLAZA.x,PLAZA.y,PLAZA.r);
  addCampfire(PLAZA.x,PLAZA.y);
  addOwl(PLAZA.x+70,PLAZA.y-30,reg.npc);
  pts.forEach(([x,y],k)=>addStone(x,y,nodes[k]));
  addGate(1000,H-40,'hub','from'+reg.id[0].toUpperCase()+reg.id.slice(1));
  if(nextReg)addGate(1000,70,nextReg.id,'fromPrev');
  // lamps along the ring
  const ringS=sampleCurve(ring,6);
  for(let i=20;i<ringS.length-10;i+=Math.floor(ringS.length/(th.lamps||8))){
    const [x,y]=ringS[i],[x2,y2]=ringS[Math.min(ringS.length-1,i+1)],a=Math.atan2(y2-y,x2-x);
    const lx=x-Math.sin(a)*48,ly=y+Math.cos(a)*48;if(free(lx,ly,16))addLamp(lx,ly);
  }
  if(th.crystals){for(let i=0,c=0;i<400&&c<th.crystals;i++){const a=rand(0,TAU),x=1000+Math.cos(a)*rand(300,820),y=690+Math.sin(a)*rand(220,560);
    if(nearPath(x,y,30)||!free(x,y,50))continue;const s=rand(.55,1.05);addObj({kind:'crystal',x,y,spr:pick(SPR.crystals),s});colliders.push({t:'c',x,y:y-4,r:26*s});claim(x,y,50*s);
    addLight(x,y-30*s,150*s+30,[110,200,255],.8,.12);c++;}}
  pondRocks();
  for(let i=0,b=0;i<600&&b<(th.birch||0);i++){const x=rand(80,W-80),y=rand(120,H-80);if(nearPath(x,y,30)||!free(x,y,22))continue;
    addObj({kind:'birch',x,y,spr:pick(SPR.birch),s:rand(.85,1.15),sway:.6,phase:rand(0,9)});colliders.push({t:'c',x,y,r:8});claim(x,y,22);b++;}
  scatterForest(th.trees||170,.03,{x:1000,y:690,rx:840,ry:620},th.blueTrees);
  scatterSmall(30,th.bushes??30,th.flowers??16);
  return {start:{x:1000,y:1330},fromHub:{x:1000,y:1330},fromPrev:{x:1000,y:1330}};
}

/* --- scene switching --- */
let SPAWNS={}, curScene=null;
function clearScene(){
  objects.length=colliders.length=lights.length=chimneys.length=INTER.length=GATES.length=occupied.length=0;
  parts.length=0;prints.length=0;tapTarget=null;
}
function setScene(id,spawnKey){
  clearScene();
  R=mulberry(hashStr(id)+7);
  const reg=regionById(id);
  SPAWNS=id==='hub'?buildHub():buildWild(reg);
  curScene=id;
  const sp=SPAWNS[spawnKey]||SPAWNS.start;
  Object.assign(player,{x:sp.x,y:sp.y,vx:0,vy:0});
  playerLight=addLight(player.x,player.y,125,[255,196,120],.95,.08);
  for(const gt of GATES)gt.cool=1.2;
  R=mulberry(Date.now()&0xffff);
  cam.x=player.x;cam.y=player.y-24;cam.px=cam.x;cam.py=cam.y;
  todKey=(reg&&reg.theme.tod)||'dusk';syncTodButtons();
}
function hashStr(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
