/* ---------- world: scenes, gates, study stones ---------- */
const objects=[], colliders=[], lights=[], chimneys=[], INTER=[], GATES=[], STRINGS=[];
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
  SPR.pinesV=[0,1,2,3].map(i=>makePine(282+i*9));
  SPR.birch=[0,1,2,3].map(()=>makeBirch());
  SPR.rocks=[0,1,2,3,4].map(()=>makeRock());
  SPR.bush=[0,1,2,3].map(()=>makeBush());
  SPR.lamp=makeLamp();SPR.crate=makeCrate();SPR.barrel=makeBarrel();SPR.snowman=makeSnowman();
  SPR.crystals=[0,1,2].map(()=>makeCrystals());SPR.sign=makeSign();SPR.flowers=[0,1,2].map(()=>makeFlowers());
  SPR.firepit=makeFirePit();SPR.fgPine=makeFgPine();
  SPR.gate=makeGate();SPR.stone=makeStone();SPR.owl=makeOwl();SPR.lectern=makeLectern();SPR.ice=makeIce();SPR.cache=makeCacheSpr(false);SPR.cacheOpen=makeCacheSpr(true);SPR.totem=makeTotem(false);SPR.totemRead=makeTotem(true);
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
  addObj({kind:'stone',node:nodeId,x,y,spr:SPR.stone,marker:{x,y,h:104,state:()=>nodeState(nodeId)}});
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
    addObj({kind:'pine',x,y,spr:pick(SPR[{blue:'pinesB',violet:'pinesV'}[hue]]||SPR.pines),s,sway:1,phase:rand(0,9),occ:[-44,44,-170,-24]});
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
  const cabins=[[740,640],[1580,735],[690,1040],[1240,350],[600,420]];
  cabins.forEach(([x,y],i)=>{
    const spr=SPR.cabins[i%SPR.cabins.length],w=spr.info.w;
    addObj({kind:'cabin',x,y,spr,occ:[-w/2-16,w/2+16,-spr.info.bodyH-spr.info.roofH-6,-70]});
    colliders.push({t:'r',x0:x-w/2-6,x1:x+w/2+6,y0:y-74,y1:y+2});
    claim(x,y-50,w*.65);
    for(const [wx,wy] of spr.info.windows)addLight(x+wx,y+wy+20,95,[255,180,90],.8,.05);
    chimneys.push({x:x+spr.info.chimney[0],y:y+spr.info.chimney[1],acc:rand(0,1)});
  });
  const cr=[[GROVE.x,GROVE.y+20,1],[GROVE.x-95,GROVE.y+50,.7],[GROVE.x+90,GROVE.y-10,.6]];
  cr.forEach(([x,y,s],i)=>{addObj({kind:'crystal',x,y,spr:SPR.crystals[i%SPR.crystals.length],s});colliders.push({t:'c',x,y:y-4,r:26*s});claim(x,y,50*s);
    addLight(x,y-30*s,150*s+30,[110,200,255],.8,.12);});
  for(const [x,y] of [[945,1250],[1060,1010],[940,560],[1062,300],[810,830],[470,735],[1245,850],[1400,950],[1350,560],[260,735],[955,110],[1820,480]])addLamp(x,y);
  prop(SPR.crate,880,662,13);prop(SPR.crate,905,676,13);prop(SPR.barrel,868,690,10);
  prop(SPR.barrel,1470,750,10);prop(SPR.barrel,1490,764,10);prop(SPR.crate,1150,650,13);
  prop(SPR.crate,800,1066,13);prop(SPR.barrel,580,1070,10);
  prop(SPR.snowman,1150,905,14,'snowman');
  for(const [x,y,len] of [[560,1100,110],[700,1100,60],[1170,420,130],[470,470,90],[1310,690,80]]){
    addObj({kind:'fence',x,y,spr:makeFence(len)});colliders.push({t:'r',x0:x-2,x1:x+len+2,y0:y-6,y1:y+3});claim(x+len/2,y,len/2);
  }
  // signs: welcome + review board
  const sign=(x,y,label,act,state)=>{addObj({kind:'sign',x,y,spr:SPR.sign,marker:{x,y,h:80,state}});colliders.push({t:'c',x,y:y-2,r:7});claim(x,y,30);
    addLight(x,y-78,70,[255,205,110],.8,.1);INTER.push({x,y,r:60,label:()=>label,act});};
  sign(1090,1185,'Read the welcome sign',openWelcome,()=>SAVE.seen.welcome?'none':'todo');
  sign(860,880,'Open the review board',openReview,()=>reviewCount()?'todo':'none');
  addOwl(1120,700,COURSE.hubNpc);
  // interpretation desk: explain-it questions
  {const x=880,y=1040;addObj({kind:'lectern',x,y,spr:SPR.lectern,marker:{x,y,h:72,state:()=>'none'}});
   colliders.push({t:'c',x,y:y-2,r:7});claim(x,y,26);addLight(x,y-60,80,[200,230,255],.65,.1);
   INTER.push({x,y,r:52,label:()=>'Use the interpretation desk',act:()=>openDesk()});}
  // practice final: a lectern by the south path
  {const x=1130,y=1035;addObj({kind:'lectern',x,y,spr:SPR.lectern,marker:{x,y,h:72,state:()=>SAVE.exam?'none':'todo'}});
   colliders.push({t:'c',x,y:y-2,r:7});claim(x,y,26);addLight(x,y-60,80,[255,215,140],.75,.1);
   INTER.push({x,y,r:52,label:()=>'Take the practice final',act:()=>openExam()});}
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
  const th=reg.theme, nodes=reg.nodes, n=nodes.length;
  const cx=W/2, cy=H*.45, RX=W*.36, RY=H*.31;
  PLAZA={x:cx,y:H-330,r:120};
  POND={x:cx,y:cy,rx:th.lake?.[0]||250,ry:th.lake?.[1]||140};
  GROVE=th.crystals?{x:cx,y:cy}:null;
  // stones ring the lake: bottom-left → over the top → bottom-right
  const pts=[];
  for(let k=0;k<n;k++){const a=(150+k*(240/Math.max(1,n-1)))*Math.PI/180;pts.push([cx+Math.cos(a)*RX+rand(-20,20),cy+Math.sin(a)*RY+rand(-12,12)]);}
  CLEARINGS=pts.map(([x,y])=>({x,y,r:62}));
  const ring=[[PLAZA.x-70,PLAZA.y-50],...pts,[PLAZA.x+70,PLAZA.y-50]];
  PATHS=[[[cx,H+30],[cx-10,H-170],[cx,PLAZA.y-60]],ring];
  const nextReg=COURSE.regions.find(r=>r.requires===reg.id);
  const top=pts.reduce((a,b)=>b[1]<a[1]?b:a);
  if(nextReg)PATHS.push([[top[0],top[1]],[(top[0]+cx)/2,top[1]/2+20],[cx,10]]);
  SCENE={fire:true,skyLanterns:th.skyLanterns,aurora:th.aurora};GROUND_TINT=th.tint;
  buildSurface();paintGround();
  claim(PLAZA.x,PLAZA.y,PLAZA.r);
  addCampfire(PLAZA.x,PLAZA.y);
  addOwl(PLAZA.x+75,PLAZA.y-30,reg.npc);
  addGate(cx,H-40,'hub','from'+reg.id[0].toUpperCase()+reg.id.slice(1));
  if(nextReg)addGate(cx,70,nextReg.id,'fromPrev');
  pts.forEach(([x,y],k)=>addStone(x,y,nodes[k]));
  const ringLamps=[];
  // waypoint lecterns: evenly spaced along the path segment that leads to each stone
  const ringS=sampleCurve(ring,6);
  const near=([x,y])=>{let bi=0,bd=1e9;ringS.forEach(([sx,sy],i)=>{const d=(sx-x)**2+(sy-y)**2;if(d<bd){bd=d;bi=i;}});return bi;};
  const idx=pts.map(near);
  nodes.forEach((id,k)=>{
    const L=(NODES[id]?.lessons||[]).length;if(!L)return;
    const i0=k?idx[k-1]:0,i1=idx[k];
    for(let j=0;j<L;j++){
      const i=Math.round(i0+(i1-i0)*(j+1)/(L+1)),[x,y]=ringS[i],[x2,y2]=ringS[Math.min(ringS.length-1,i+1)],a=Math.atan2(y2-y,x2-x);
      const side=(j%2?1:-1)*44;addLesson(x-Math.sin(a)*side,y+Math.cos(a)*side,id,j);
    }
  });
  // hidden things — supply caches and learning totems — spread over the whole region, not just beside the stones
  scatterHidden(reg,pts,nodes,cx,cy);
  for(let i=24;i<ringS.length-12;i+=Math.floor(ringS.length/(th.lamps||8))){
    const [x,y]=ringS[i],[x2,y2]=ringS[Math.min(ringS.length-1,i+1)],a=Math.atan2(y2-y,x2-x);
    const lx=x+Math.sin(a)*52,ly=y-Math.cos(a)*52;if(free(lx,ly,16)){addLamp(lx,ly);ringLamps.push([lx,ly]);}
  }
  if(th.lanternStrings){const cols=['#d9473a','#e9833a','#f1c25c','#c8433a','#e2a03a'];
    for(let i=0;i<ringLamps.length-1;i++){const [x1,y1]=ringLamps[i],[x2,y2]=ringLamps[i+1],d=Math.hypot(x2-x1,y2-y1);if(d>560)continue;
      const n=Math.max(3,Math.round(d/42)),lan=[];
      for(let j=1;j<n;j++){const L={u:j/n,c:cols[(i+j)%cols.length]};L.light=addLight(0,0,j%2?58:0,[255,170,90],.7,.12);lan.push(L);}
      STRINGS.push({x1,y1:y1-92,x2,y2:y2-92,sag:Math.min(46,d*.14),lan});}}
  if(th.crystals){for(let i=0,c=0;i<500&&c<th.crystals;i++){const a=rand(0,TAU),x=cx+Math.cos(a)*rand(RX*.45,RX*1.3),y=cy+Math.sin(a)*rand(RY*.45,RY*1.3);
    if(nearPath(x,y,30)||!free(x,y,50))continue;const s=rand(.55,1.05);addObj({kind:'crystal',x,y,spr:pick(SPR.crystals),s});colliders.push({t:'c',x,y:y-4,r:26*s});claim(x,y,50*s);
    addLight(x,y-30*s,150*s+30,[110,200,255],.8,.12);c++;}}
  pondRocks();
  for(let i=0,b=0;i<700&&b<(th.birch||0);i++){const x=rand(80,W-80),y=rand(120,H-80);if(nearPath(x,y,30)||!free(x,y,22))continue;
    addObj({kind:'birch',x,y,spr:pick(SPR.birch),s:rand(.85,1.15),sway:.6,phase:rand(0,9)});colliders.push({t:'c',x,y,r:8});claim(x,y,22);b++;}
  scatterForest(th.trees||170,.03,{x:cx,y:cy,rx:RX*1.3,ry:RY*1.4},th.treeSet);
  scatterSmall(30,th.bushes??30,th.flowers??16);
  const sp={x:cx,y:H-170};
  return {start:sp,fromHub:sp,fromPrev:sp};
}
function makeLectern(){
  return makeSprite(56,72,28,64,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,16,5);
    g.fillStyle='#4e3423';g.fillRect(-3,-34,6,34);g.fillStyle='#5f412c';g.beginPath();g.roundRect(-9,-4,18,5,2);g.fill();
    g.save();g.translate(0,-38);g.rotate(-.18);
    g.fillStyle='#6c4630';g.beginPath();g.roundRect(-17,-6,34,12,3);g.fill();
    g.fillStyle='#f3e9d2';g.beginPath();g.moveTo(-15,-6);g.quadraticCurveTo(-7,-11,0,-6);g.quadraticCurveTo(7,-11,15,-6);g.lineTo(15,2);g.quadraticCurveTo(7,-2,0,2);g.quadraticCurveTo(-7,-2,-15,2);g.closePath();g.fill();
    g.strokeStyle='rgba(90,70,50,.55)';g.lineWidth=.8;for(const y of [-5,-3,-1]){g.beginPath();g.moveTo(-12,y);g.lineTo(-3,y-1);g.moveTo(3,y-1);g.lineTo(12,y);g.stroke();}
    g.strokeStyle='#7d2430';g.lineWidth=1.4;g.beginPath();g.moveTo(0,-4);g.lineTo(1,6);g.stroke();
    g.restore();
    g.fillStyle='#fbfdff';ell(g,-10,-45,6,2);
  });
}
function makeIce(){
  return makeSprite(84,120,42,104,g=>{
    const shard=(x,y,a,h,w)=>{g.save();g.translate(x,y);g.rotate(a);const sg=g.createLinearGradient(-w,0,w,0);sg.addColorStop(0,'rgba(235,250,255,.9)');sg.addColorStop(.5,'rgba(160,215,245,.65)');sg.addColorStop(1,'rgba(90,150,210,.55)');
      g.fillStyle=sg;g.beginPath();g.moveTo(-w/2,0);g.lineTo(0,-h);g.lineTo(w/2,0);g.closePath();g.fill();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=.8;g.beginPath();g.moveTo(-w*.1,-2);g.lineTo(0,-h);g.stroke();g.restore();};
    g.fillStyle='rgba(190,230,255,.28)';g.beginPath();g.moveTo(-20,-2);g.lineTo(-17,-72);g.quadraticCurveTo(0,-92,17,-72);g.lineTo(20,-2);g.closePath();g.fill();
    for(const [x,y,a,h,w] of [[-18,-2,-.5,38,12],[18,-2,.5,42,12],[-10,-4,-.2,60,11],[10,-3,.25,56,10],[0,-6,0,84,14],[-24,-1,-.9,22,9],[24,-1,.9,24,9]])shard(x,y,a,h,w);
    g.fillStyle='rgba(240,250,255,.9)';ell(g,0,-2,28,6);
  });
}
function makeCacheSpr(open){
  return makeSprite(56,52,28,42,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,22,6);
    const bg=g.createLinearGradient(0,-22,0,0);bg.addColorStop(0,'#8a5a36');bg.addColorStop(1,'#5a3a22');
    g.fillStyle=bg;g.beginPath();g.roundRect(-18,-20,36,20,3);g.fill();
    g.fillStyle='#3a3a46';g.fillRect(-18,-14,36,3);g.fillRect(-9,-20,3,20);g.fillRect(6,-20,3,20);
    if(open){g.fillStyle='#2a1a10';g.beginPath();g.roundRect(-16,-22,32,5,2);g.fill();
      g.fillStyle='#6e4630';g.beginPath();g.moveTo(-18,-22);g.lineTo(18,-22);g.lineTo(15,-36);g.lineTo(-15,-36);g.closePath();g.fill();g.fillStyle='#fbfdff';g.fillRect(-14,-37,28,2);}
    else{g.fillStyle='#7a4e30';g.beginPath();g.moveTo(-19,-20);g.quadraticCurveTo(0,-32,19,-20);g.closePath();g.fill();
      g.fillStyle='#3a3a46';g.fillRect(-9,-27,3,8);g.fillRect(6,-27,3,8);
      g.fillStyle='#e9c260';g.beginPath();g.roundRect(-3.5,-20,7,7,1.5);g.fill();g.fillStyle='#7fd8ff';circ(g,0,-16.5,1.6);
      g.fillStyle='#fbfdff';g.beginPath();g.moveTo(-17,-21);g.quadraticCurveTo(0,-34,17,-21);g.quadraticCurveTo(0,-26,-17,-21);g.fill();}
    g.fillStyle='rgba(250,252,255,.9)';ell(g,-12,-1,9,2.5);ell(g,13,0,7,2);
  });
}
function addCache(x,y,id){
  addObj({kind:'cache',cache:id,x,y,spr:SAVE.caches[id+'#C']?SPR.cacheOpen:SPR.cache});colliders.push({t:'c',x,y:y-4,r:13});claim(x,y,30);
  INTER.push({x,y,r:48,label:()=>SAVE.caches[id+'#C']?'Empty cache':'Open the supply cache',act:()=>openCache(id)});
}
/* Best-candidate sampling: each item goes to the open spot (off the path, clear of the trees still to come)
   that is farthest from everything already placed — stones, gates, the camp and the other hidden items.
   The result covers the whole region evenly, corners and middle alike, and is the same on every visit. */
function scatterHidden(reg,pts,nodes,cx,cy){
  const R2=mulberry(hashStr(reg.id)+911),rnd=(a,b)=>a+(b-a)*R2();
  const items=[];nodes.forEach(id=>{if(NODES[id]?.cache)items.push({k:'cache',id});});
  TOTEMS.filter(T=>reg.nodes.includes(T.at)).forEach(T=>items.push({k:'totem',T}));
  // interleave so caches and totems don't bunch by type
  items.sort((a,b)=>hashStr(reg.id+(a.id||a.T.id))%97-hashStr(reg.id+(b.id||b.T.id))%97);
  const taken=[...pts.map(([x,y])=>[x,y]),[cx,H-40],[cx,70],[PLAZA.x,PLAZA.y],[cx,H-170]];
  const open=(x,y)=>x>=90&&y>=130&&x<=W-90&&y<=H-160&&!nearPath(x,y,70)&&free(x,y,34);
  for(const it of items){let best=null,bs=-1;
    for(let c=0,tries=0;c<60&&tries<3000;tries++){const x=rnd(90,W-90),y=rnd(130,H-160);if(!open(x,y))continue;c++;
      let m=1e9;for(const [tx,ty] of taken)m=Math.min(m,Math.hypot(tx-x,(ty-y)*1.15));if(m>bs){bs=m;best=[x,y];}}
    if(!best)continue;const [x,y]=best;taken.push(best);
    if(it.k==='cache')addCache(x,y,it.id);else addTotem(x,y,it.T);}
}
function addTotem(x,y,T){
  addObj({kind:'totem',totem:T.id,x,y,spr:SAVE.totems?.[T.id]?SPR.totemRead:SPR.totem});colliders.push({t:'c',x,y:y-3,r:10});claim(x,y,34);
  addLight(x,y-58,90,[140,210,255],.6,.1);
  INTER.push({x,y,r:50,label:()=>SAVE.totems?.[T.id]?'Read the totem again':'Read the learning totem',act:()=>openTotem(T.id)});
}
function makeTotem(read){
  return makeSprite(60,110,30,100,g=>{
    g.fillStyle='rgba(40,55,95,.3)';ell(g,4,0,18,5);
    const wood=g.createLinearGradient(-12,0,12,0);wood.addColorStop(0,'#4a3122');wood.addColorStop(.5,'#7a5236');wood.addColorStop(1,'#4a3122');
    g.fillStyle=wood;g.beginPath();g.roundRect(-11,-84,22,84,4);g.fill();
    // carved faces
    for(const [y,c] of [[-18,'#d9a441'],[-44,'#5fa9d9'],[-70,'#c9553f']]){
      g.fillStyle='rgba(30,18,10,.55)';g.fillRect(-11,y+9,22,2);
      g.fillStyle=c;g.beginPath();g.roundRect(-8,y-7,16,13,3);g.fill();
      g.fillStyle='#2a1a10';g.fillRect(-5,y-3,3,3);g.fillRect(2,y-3,3,3);g.fillRect(-3,y+2,6,1.6);}
    // wings at the top
    g.fillStyle='#8a5a36';g.beginPath();g.moveTo(-11,-78);g.lineTo(-26,-86);g.lineTo(-11,-70);g.closePath();g.fill();
    g.beginPath();g.moveTo(11,-78);g.lineTo(26,-86);g.lineTo(11,-70);g.closePath();g.fill();
    // glowing rune
    g.fillStyle=read?'rgba(140,170,200,.55)':'#bfe8ff';g.beginPath();g.arc(0,-94,6,0,TAU);g.fill();
    if(!read){g.fillStyle='rgba(160,220,255,.35)';g.beginPath();g.arc(0,-94,11,0,TAU);g.fill();}
    g.fillStyle='rgba(250,252,255,.95)';ell(g,0,-85,13,3.5);ell(g,-20,-85,5,1.5);ell(g,20,-85,5,1.5);
    g.fillStyle='rgba(250,252,255,.9)';ell(g,-8,-1,9,2.5);ell(g,10,0,7,2);
  });
}
function addLesson(x,y,nodeId,j){
  const lid=lessonId(nodeId,j);
  addObj({kind:'lectern',x,y,spr:SPR.lectern,marker:{x,y,h:72,state:()=>lessonState(nodeId,j)}});
  colliders.push({t:'c',x,y:y-2,r:7});claim(x,y,22);
  INTER.push({x,y,r:46,label:()=>lessonState(nodeId,j)==='blocked'?'Waypoint (finish the previous one first)':'Read the waypoint',act:()=>openLesson(nodeId,j)});
}

/* --- scene switching --- */
let SPAWNS={}, curScene=null;
function clearScene(){
  objects.length=colliders.length=lights.length=chimneys.length=INTER.length=GATES.length=occupied.length=STRINGS.length=0;
  parts.length=0;prints.length=0;tapTarget=null;
}
function setScene(id,spawnKey){
  clearScene();
  R=mulberry(hashStr(id)+7);
  const reg=regionById(id);
  GROUND_IMG=IMG['ground_'+id]||null;
  if(id==='hub')sizeWorld(2000,1500);else sizeWorld(...(reg.theme.size||[2400,1800]));
  SPAWNS=id==='hub'?buildHub():buildWild(reg);
  curScene=id;
  if(typeof Music!=='undefined')Music.setRegion(id);
  Sfx.setRegion(id);
  const sp=SPAWNS[spawnKey]||SPAWNS.start;
  Object.assign(player,{x:sp.x,y:sp.y,vx:0,vy:0});
  playerLight=addLight(player.x,player.y,125,[255,196,120],.95,.08);
  for(const gt of GATES)gt.cool=1.2;
  R=mulberry(Date.now()&0xffff);
  cam.x=player.x;cam.y=player.y-24;cam.px=cam.x;cam.py=cam.y;
  todKey=(reg&&reg.theme.tod)||'dusk';syncTodButtons();
}
function hashStr(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
