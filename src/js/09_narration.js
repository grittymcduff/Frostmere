/* ---------- Warden Quill's narrated intro ----------
   Plays once on the first visit (after the first click/key, since browsers block
   audio before that), with subtitles in a bar at the bottom. The game stays
   playable while he talks; music dips under his voice. Skip ends it; the speaker
   button turns the voice off (subtitles keep going) and is remembered, as is the
   Narration switch in Effects. Replay from the welcome sign. */
const NARR=[
  ['quill_01_welcome',"Ah… a traveler. Welcome to Frostmere, where the snow keeps old secrets, and the stones keep older ones. I am Warden Quill, keeper of this village.",11.8],
  ['quill_02_move',"Walk with the arrow keys, or W, A, S, D… or simply tap the ground where you wish to go. Mind the ice by the pond. It has opinions about stopping.",11.5],
  ['quill_03_stones',"Beyond the gates lie three regions, and in each stand the Study Stones. Every stone guards one idea of the craft: reading data, testing claims, and building models that tell the truth.",13.7],
  ['quill_04_waypoints',"Along the path to each stone, you'll find lecterns. These are waypoints: short lessons, taken in order. They are the gentle road.",9.6],
  ['quill_05_freeze',"You may challenge a stone directly, if you are bold. But miss twice, and it will freeze over, and stay frozen until you have walked its waypoints. There is no shame in the gentle road.",12.4],
  ['quill_06_caches',"Wander off the path, and you may find hidden caches. Solve the puzzle within, and you'll earn a charm: a lens, a feather, a ward. Their magic works only before the stones.",12.6],
  ['quill_07_calc',"Some questions want real arithmetic. A calculator waits at every challenge, so use it freely. Wisdom is knowing which numbers matter, not carrying them all in your head.",12.1],
  ['quill_08_farewell',"And when you wish to sharpen what you've learned, the review board here in the square will help you practice. Now go. The first gate is just ahead. The snow waits for no one… and neither, I'm afraid, does the exam.",13.0],
];
const Narr=(()=>{
  const bar=$('narr'),txt=bar.querySelector('p'),muteB=$('narrMute'),skipB=$('narrSkip');
  let i=-1,au=null,timer=0,playing=false;
  const voiceOn=()=>SAVE.voice!==false;
  const clip=k=>{const a=new Audio(`assets/voice/${NARR[k][0]}.mp3`);a.preload='auto';return a;};
  let nextAu=null;
  function show(k){
    i=k;clearTimeout(timer);if(au){au.onended=null;au.pause();}
    if(k>=NARR.length){stop(true);return;}
    txt.textContent=NARR[k][1];bar.classList.remove('hidden');bar.classList.remove('fadeIn');void bar.offsetWidth;bar.classList.add('fadeIn');
    au=nextAu&&nextAu.src.endsWith(NARR[k][0]+'.mp3')?nextAu:clip(k);
    nextAu=k+1<NARR.length?clip(k+1):null;
    const advance=()=>{clearTimeout(timer);timer=setTimeout(()=>show(i+1),700);};
    au.onended=advance;
    if(voiceOn()){au.volume=1;au.play().catch(()=>{timer=setTimeout(()=>show(i+1),NARR[k][2]*1000+700);});}
    else timer=setTimeout(()=>show(i+1),NARR[k][2]*1000+700);
    // safety net in case 'ended' never fires (slow network, autoplay quirks)
    setTimeout(()=>{if(i===k&&playing&&au&&au.paused&&voiceOn())advance();},(NARR[k][2]+4)*1000);
  }
  function stop(finished){
    playing=false;clearTimeout(timer);if(au){au.onended=null;au.pause();}au=null;i=-1;
    bar.classList.add('hidden');Music.duck(false);SAVE.seen.intro=true;settleMusic();persist();
  }
  function syncMute(){muteB.textContent=voiceOn()?'🔊':'🔇';muteB.title=voiceOn()?'Turn the narrator voice off (subtitles continue)':'Turn the narrator voice on';
    const v=$('voiceOn');if(v)v.checked=voiceOn();}
  function setVoice(on){SAVE.voice=on;persist();syncMute();Music.duck(playing&&on);
    if(!playing||!au)return;if(on){clearTimeout(timer);au.currentTime=0;au.play().catch(()=>{});}else au.pause();
    if(!on){clearTimeout(timer);const left=Math.max(1.5,NARR[i][2]-(au.currentTime||0));timer=setTimeout(()=>show(i+1),left*1000+700);}}
  muteB.onclick=()=>setVoice(!voiceOn());
  skipB.onclick=()=>stop(false);
  syncMute();
  return{
    play(){Music.start();playing=true;Music.duck(voiceOn());show(0);},
    stop,setVoice,syncMute,get playing(){return playing;},get line(){return i;},
  };
})();
// first visit: start after the first gesture (audio unlock), only in the village
{const go=()=>{removeEventListener('pointerdown',go);removeEventListener('keydown',go);
   if(!SAVE.seen.intro&&curScene==='hub')setTimeout(()=>{if(!Narr.playing&&!SAVE.seen.intro)Narr.play();},400);};
 addEventListener('pointerdown',go);addEventListener('keydown',go);}
$('voiceOn').onchange=e=>Narr.setVoice(e.target.checked);
// after the intro the score steps back: music settles to 30% of its level (once; the slider can raise it again)
// (music now starts at 8%, so there is nothing to settle; kept for saves that still carry settled:false)
function settleMusic(now){if(SAVE.music.settled)return;SAVE.music.settled=true;SAVE.music.vol=Math.min(SAVE.music.vol,.08);
  musOn.checked=SAVE.music.on;musVol.value=Math.round(SAVE.music.vol*100);Music.set(SAVE.music.on&&!SAVE.muted,SAVE.music.vol,now?.1:4);}
