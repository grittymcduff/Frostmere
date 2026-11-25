/* ---------- cloud saves: Google sign-in + Firestore (Firebase) ----------
   Signed out, the game saves in this browser exactly as before. Signed in, every
   save is also written to saves/{uid} and pulled back on sign-in and when the tab
   regains focus. Two saves are merged: newest wins for position/settings/items,
   but finished stones, waypoints, caches and dialogue are kept from both, so
   playing on two devices never loses progress. A reset or an imported code
   replaces the cloud copy instead of merging. */
const FB_VER='13.4.0';
const FB_CONFIG={
  apiKey:'AIzaSyDBFKEXs_d-_7zXu0Gc7m1XOIqeWRbVhkc',
  authDomain:'frostmere-a0ac8.firebaseapp.com',
  projectId:'frostmere-a0ac8',
  storageBucket:'frostmere-a0ac8.firebasestorage.app',
  messagingSenderId:'305259573412',
  appId:'1:305259573412:web:84522271381519448b3631',
};
const PLAY_URL='https://grittymcduff.github.io/Frostmere/';
// sign-in only works on domains authorised in the Firebase console
const CLOUD_OK=/^(grittymcduff\.github\.io|localhost|127\.0\.0\.1)$/.test(location.hostname);
const CLOUD={fb:null,user:null,busy:false,timer:0,last:0,err:''};

async function fbLoad(){
  if(CLOUD.fb)return CLOUD.fb;
  if(window.__FB_MOCK)return CLOUD.fb=window.__FB_MOCK;           // test harness
  const u=m=>`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-${m}.js`;
  const [A,Au,F]=await Promise.all([import(u('app')),import(u('auth')),import(u('firestore'))]);
  const app=A.initializeApp(FB_CONFIG),auth=Au.getAuth(app),db=F.getFirestore(app);
  return CLOUD.fb={
    onUser:cb=>Au.onAuthStateChanged(auth,cb),
    signIn:async()=>{const p=new Au.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
      try{await Au.signInWithPopup(auth,p);}catch(e){if(e.code==='auth/popup-blocked')return Au.signInWithRedirect(auth,p);throw e;}},
    signOut:()=>Au.signOut(auth),
    get:async uid=>{const s=await F.getDoc(F.doc(db,'saves',uid));return s.exists()?s.data():null;},
    put:(uid,data)=>F.setDoc(F.doc(db,'saves',uid),data),
  };
}

/* merge two saves (see header) */
function mergeSaves(a,b){
  if(!b)return a;if(!a)return b;
  if((a.reset||0)!==(b.reset||0))return (a.reset||0)>(b.reset||0)?a:b;
  const [n,o]=(a.t||0)>=(b.t||0)?[a,b]:[b,a];
  const m=JSON.parse(JSON.stringify(n));
  for(const k of ['lessons','caches','seen'])m[k]={...(o[k]||{}),...(n[k]||{})};
  m.done={...(o.done||{})};
  for(const [id,v] of Object.entries(n.done||{}))m.done[id]=m.done[id]?{best:Math.max(m.done[id].best,v.best),ts:Math.min(m.done[id].ts||v.ts,v.ts||m.done[id].ts)}:v;
  m.locked={...(m.locked||{})};for(const id in m.done)delete m.locked[id];
  // items from caches only the older save opened
  for(const cid in o.caches||{})if(!(n.caches||{})[cid]){const it=NODES[cid.slice(0,-2)]?.cache?.item;if(it)m.inv[it]=(m.inv[it]||0)+1;}
  m.qs={...(o.qs||{})};for(const [k,v] of Object.entries(n.qs||{}))if(!m.qs[k]||v.n>=m.qs[k].n)m.qs[k]=v;
  m.days={...(o.days||{})};for(const [k,v] of Object.entries(n.days||{}))m.days[k]=Math.max(v,m.days[k]||0);
  if((o.examHist||[]).length>(n.examHist||[]).length)m.examHist=o.examHist;
  m.stats={answered:Math.max(n.stats?.answered||0,o.stats?.answered||0),first:Math.max(n.stats?.first||0,o.stats?.first||0)};
  return m;
}
const saveKey=s=>JSON.stringify({...s,t:0});

function cloudQueue(){if(!CLOUD.user)return;clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(cloudPush,2500);}
async function cloudPush(){
  if(!CLOUD.user)return;clearTimeout(CLOUD.timer);
  try{await CLOUD.fb.put(CLOUD.user.uid,{save:JSON.stringify(SAVE),t:SAVE.t||Date.now(),name:CLOUD.user.displayName||''});CLOUD.last=Date.now();CLOUD.err='';}
  catch(e){CLOUD.err='Could not reach the cloud — progress is still saved on this device.';}
  renderAcct();
}
async function cloudPull(first){
  if(!CLOUD.user||CLOUD.busy)return;CLOUD.busy=true;
  try{
    const d=await CLOUD.fb.get(CLOUD.user.uid);
    const remote=d?.save?JSON.parse(d.save):null;
    if(remote&&remote.v===1){
      const before=saveKey(SAVE),m=mergeSaves(SAVE,{...blankSave(),...remote,audioV:remote.audioV});
      if(saveKey(m)!==before){SAVE={...blankSave(),...m,inv:{...blankSave().inv,...(m.inv||{})}};migrateAudio();
        try{localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE));}catch(e){}
        syncMusic();syncSfx();renderHud();if(!$('log').classList.contains('hidden'))renderLog();
        if(first)toast('Cloud progress loaded.');}
      if(saveKey(m)!==saveKey(remote))await cloudPush();else{CLOUD.last=Date.now();CLOUD.err='';}
    }else await cloudPush();                                   // first sign-in: upload this device's progress
  }catch(e){CLOUD.err='Could not reach the cloud — progress is still saved on this device.';}
  CLOUD.busy=false;renderAcct();
}

/* ---- UI: top-bar button + account panel inside the quest log ---- */
function renderAcct(){
  const b=$('acctBtn');if(b){const u=CLOUD.user;b.textContent=u?'Signed In':'Sign in';b.title=u?'Signed in — progress saves to your account':'Sign in to save progress to your Google account';}
  const box=$('acctBox');if(!box)return;
  if(!CLOUD_OK){box.innerHTML=`<p class="meta">Cloud saves work on the <a href="${PLAY_URL}" target="_blank" rel="noopener">main game site</a>. Here, progress saves in this browser only.</p>`;return;}
  if(CLOUD.user){
    const ago=CLOUD.last?Math.max(0,Math.round((Date.now()-CLOUD.last)/1000)):null;
    box.innerHTML=`<p class="meta">Signed in as <b>${esc(CLOUD.user.displayName||CLOUD.user.email||'player')}</b>. Progress saves to your account and follows you to any device.${ago!==null?` Last synced ${ago<5?'just now':ago<60?ago+' s ago':Math.round(ago/60)+' min ago'}.`:''}</p>${CLOUD.err?`<p class="meta warn">${CLOUD.err}</p>`:''}<div class="acts"><button class="opt" id="syncNow">Sync now</button><button class="opt" id="signOut">Sign out</button></div>`;
    $('syncNow').onclick=()=>cloudPull(false);
    $('signOut').onclick=async()=>{await cloudPush();await CLOUD.fb.signOut();toast('Signed out. Progress stays on this device.');};
  }else{
    box.innerHTML=`<p class="meta">Sign in with Google to keep your progress in the cloud and play from any device. Your progress on this device comes with you.</p>${CLOUD.err?`<p class="meta warn">${CLOUD.err}</p>`:''}<div class="acts"><button class="opt primary" id="signIn">Sign in with Google</button></div>`;
    $('signIn').onclick=cloudSignIn;
  }
}
async function cloudSignIn(){
  if(!CLOUD_OK){window.open(PLAY_URL,'_blank');return;}
  try{const fb=await fbLoad();await fb.signIn();}
  catch(e){CLOUD.err=e?.code==='auth/popup-closed-by-user'?'':'Sign-in did not finish. Please try again.';renderAcct();}
}
function cloudInit(){
  const b=$('acctBtn');
  b.onclick=()=>{if(CLOUD.user||!CLOUD_OK){if($('log').classList.contains('hidden'))toggleLog();const s=$('acctSec');if(s){s.setAttribute('open','');s.scrollIntoView({block:'end'});}}else cloudSignIn();};
  renderAcct();
  if(!CLOUD_OK)return;
  fbLoad().then(fb=>fb.onUser(u=>{
    const was=CLOUD.user;CLOUD.user=u;renderAcct();
    if(u&&!was){cloudPull(true);if(CLOUD.user)toast(`Signed in as <b>${esc(u.displayName||u.email||'player')}</b> — progress saves to your account.`);}
  })).catch(()=>{CLOUD.err='Cloud saves are unavailable right now — progress is saved on this device.';renderAcct();});
  if(SAVE.seen.intro&&!SAVE.seen.cloudTip)setTimeout(()=>afterWhatsNew(()=>setTimeout(showCloudTip,700)),4000);
  addEventListener('visibilitychange',()=>{if(!CLOUD.user)return;if(document.hidden)cloudPush();else cloudPull(false);});
}

/* ---- one-time walkthrough: signing in to keep progress across devices ----
   Shown right after Quill's intro (and once for players who saw the intro before this existed). */
function showCloudTip(){
  if(SAVE.seen.cloudTip||CLOUD.user||!card.classList.contains('hidden'))return;
  SAVE.seen.cloudTip=true;persist();
  const phone=matchMedia('(max-width:600px)').matches,where=phone?'Open <b>☰ Menu</b> (top right) and tap <b>Sign in</b>':'Click <b>Sign in</b> in the top bar';
  if(!CLOUD_OK){showCard(`<div class="kicker">Saving your progress</div><h2>Play on more than one device?</h2>
    <p class="say">This copy of the game saves progress in this browser only. To keep progress in your Google account and pick it up on any phone or computer, play on the main site:</p>
    <p class="say"><a href="${PLAY_URL}" target="_blank" rel="noopener">${PLAY_URL.replace('https://','')}</a></p>
    <p class="meta">You can also move progress by hand: <b>Quests → Save &amp; transfer</b> gives you a code to paste on another device.</p><div class="acts"></div>`);
    const b=btn('Got it','primary');card.querySelector('.acts').appendChild(b);b.onclick=closeCard;b.focus();return;}
  showCard(`<div class="kicker">Saving your progress</div><h2>Keep your progress on every device</h2>
    <p class="say">Right now your progress lives only in this browser. Sign in once with Google and it follows you to any phone or computer.</p>
    <ol class="steps">
      <li><b>Sign in here.</b> ${where}, then choose your Google account. Everything you’ve done so far moves into your account.</li>
      <li><b>Open the game on your other device</b> at <b>${PLAY_URL.replace('https://','').replace(/\/$/,'')}</b> and sign in with the <b>same</b> Google account.</li>
      <li><b>That’s it.</b> Progress saves to your account as you play, and each device picks up the latest when you open it. Stones and lessons finished on either device are kept.</li>
    </ol>
    <p class="meta">No Google account? <b>Quests → Save &amp; transfer</b> gives you a code you can paste on another device instead. You can sign in or out anytime from <b>Quests → Account &amp; cloud save</b>.</p>
    <div class="acts"></div>`);
  const a=card.querySelector('.acts'),later=btn('Maybe later','sol'),go=btn('Sign in with Google','primary');a.append(later,go);go.focus();
  later.onclick=closeCard;go.onclick=()=>{closeCard();cloudSignIn();};
}
