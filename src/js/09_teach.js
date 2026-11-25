/* ---------- "Teach me": Quill's one-minute mini-lectures, one per stone ----------
   Plays assets/voice/teach_<id>.mp3 if it exists; otherwise the transcript plays as
   paced subtitles. The current paragraph is highlighted; music dips while it plays. */
const Teach=(()=>{
  const P=$('lecture');let id=null,i=0,au=null,timer=0,playing=false,useAudio=false,pending=false,starts=[];
  const words=s=>s.split(/\s+/).length,paceMs=s=>Math.max(3500,words(s)*430);
  function render(){const T=TEACH[id];if(!T)return;
    P.innerHTML=`<button class="close" id="lecClose" aria-label="Close">×</button><div class="kicker">${esc(T.k||'Warden Quill · teach me')}</div><h2>${esc(T.t)}</h2>
      <div class="lec">${T.lines.map((l,k)=>`<p data-k="${k}" class="${k===i?'on':k<i?'past':''}">${esc(l)}</p>`).join('')}</div>
      <div class="lacts"><button class="go" id="lecPlay">${playing?'❚❚ Pause':'▶ Play'}</button><button class="go ghost" id="lecRe">↺ From the start</button><span class="meta">${useAudio||pending?'':'Subtitles only — no recording for this one yet'}</span></div>`;
    $('lecClose').onclick=close;$('lecPlay').onclick=()=>playing?pause():play();$('lecRe').onclick=()=>{i=0;if(au)au.currentTime=0;play();};
    P.querySelectorAll('.lec p').forEach(p=>p.onclick=()=>{i=+p.dataset.k;if(useAudio&&au)au.currentTime=starts[i]*(au.duration||0);play();});
    const cur=P.querySelector('.lec p.on');cur&&cur.scrollIntoView({block:'nearest',behavior:'smooth'});}
  function step(){clearTimeout(timer);const T=TEACH[id];if(!playing||!T)return;
    if(useAudio){const f=au.duration?au.currentTime/au.duration:0;let k=0;starts.forEach((s,j)=>{if(f>=s)k=j;});if(k!==i){i=k;render();}timer=setTimeout(step,300);return;}
    timer=setTimeout(()=>{if(i<T.lines.length-1){i++;render();step();}else{playing=false;Music.duck(false);render();}},paceMs(T.lines[i]));}
  function play(){playing=true;Music.duck(true);if(useAudio&&au){au.play().catch(()=>{useAudio=false;step();});}render();step();}
  function pause(){playing=false;clearTimeout(timer);if(au)au.pause();Music.duck(false);render();}
  function close(){if(id)pause();P.classList.add('hidden');if(au){au.pause();au=null;}}
  function open(sid){
    if(!TEACH[sid])return;if(typeof Narr!=='undefined'&&Narr.playing)Narr.stop(false);
    close();id=sid;i=0;playing=false;useAudio=false;
    const T=TEACH[sid],tot=T.lines.reduce((s,l)=>s+words(l),0);let acc=0;starts=T.lines.map(l=>{const s=acc/tot;acc+=words(l);return s;});
    au=new Audio(`assets/voice/${T.voice||'teach_'+sid}.mp3`);au.preload='auto';
    au.addEventListener('ended',()=>{playing=false;Music.duck(false);i=T.lines.length-1;render();});
    P.classList.remove('hidden');
    SAVE.taught=SAVE.taught||{};SAVE.taught[sid]=(SAVE.taught[sid]||0)+1;persist();
    // start the clip inside the tap itself (phones block audio otherwise); if there's no clip, fall back to paced subtitles
    pending=true;playing=true;Music.duck(true);render();const mine=au;
    au.play().then(()=>{if(au!==mine)return;pending=false;useAudio=true;render();step();})
      .catch(()=>{if(au!==mine)return;pending=false;useAudio=false;render();step();});
  }
  return {open,close,get open_(){return !P.classList.contains('hidden');}};
})();
const stoneOfNode=node=>String(node).split('#')[0];
function addTeach(id){const sid=stoneOfNode(id);if(!TEACH[sid])return;const a=card.querySelector('.acts');if(!a)return;
  const t=btn('🎓 Teach me','sol');t.title='A one-minute refresher from Warden Quill';t.onclick=()=>Teach.open(sid);a.prepend(t);}
// Esc closes the lecture first, leaving the card underneath open
addEventListener('keydown',e=>{if(e.key==='Escape'&&Teach.open_){Teach.close();e.stopImmediatePropagation();e.preventDefault();}},true);
