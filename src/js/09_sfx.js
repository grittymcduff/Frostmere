/* ---------- ambient sound + footsteps (Web Audio, from recorded clips) ----------
   - Footsteps: one crunch per step from a sprite of 10 slices per surface
     (snow / gravel on paths and the plaza; none while gliding on ice), pitch and
     level varied a little so it never sounds like a loop; louder when jogging.
   - Wind: two seamless wind/room-tone loops layered; level per region.
   - Birds: an occasional distant bird call in the woods, hollow and village,
     not at night or under the aurora.
   Controlled by "Ambient sounds" in the Effects panel (saved). */
const Sfx=(()=>{
  let ac=null,master=null,started=false,on=true,vol=.7,lastSlot=-1,birdT=0,region='hub';
  const B={};const SLOT=.4,NSLOT=10;
  const FILES={snow:'sfx_steps_snow.mp3',gravel:'sfx_steps_gravel.mp3',wind1:'amb_wind_1.mp3',wind2:'amb_wind_2.mp3',
               birds1:'amb_birds_1.mp3',birds2:'amb_birds_2.mp3',birds3:'amb_birds_3.mp3'};
  const WIND={hub:[.55,.35],woods:[.6,.5],hollow:[.4,.3],reach:[.75,.6]};
  const BIRDS={hub:.5,woods:.8,hollow:.6,reach:0};
  const wind=[];
  async function load(k){try{const r=await fetch(ART.base+FILES[k]);B[k]=await ac.decodeAudioData(await r.arrayBuffer());}catch(e){}}
  function startWind(){for(const [i,k] of ['wind1','wind2'].entries()){if(!B[k]||wind[i])continue;
    const s=ac.createBufferSource(),g=ac.createGain();s.buffer=B[k];s.loop=true;g.gain.value=0;s.connect(g).connect(master);
    s.start(0,i*7.3);wind[i]=g;}setRegion(region,true);}
  function setRegion(id,force){if(id===region&&!force)return;region=id;if(!ac)return;
    const w=WIND[id]||WIND.hub;wind.forEach((g,i)=>g&&g.gain.setTargetAtTime(w[i],ac.currentTime,2.5));}
  function level(){if(master)master.gain.setTargetAtTime(on?vol:0,ac.currentTime,.3);}
  function tick(dt){
    if(!ac||!on)return;birdT-=dt;
    if(birdT<=0){birdT=25+Math.random()*45;
      const g=BIRDS[region]||0,dark=todKey==='night'||todKey==='aurora',ks=['birds1','birds2','birds3'].filter(k=>B[k]);
      if(g&&!dark&&ks.length){const k=ks[Math.floor(Math.random()*ks.length)],s=ac.createBufferSource(),gn=ac.createGain(),p=ac.createStereoPanner();
        s.buffer=B[k];gn.gain.value=g*(.6+Math.random()*.4);p.pan.value=Math.random()*1.4-.7;s.connect(gn).connect(p).connect(master);
        const off=Math.random()*Math.max(0,s.buffer.duration-12);s.start(0,off,10+Math.random()*6);
        gn.gain.setValueAtTime(0,ac.currentTime);gn.gain.linearRampToValueAtTime(g,ac.currentTime+1.5);
        gn.gain.setTargetAtTime(0,ac.currentTime+8,1.5);}}
  }
  return{
    async start(){if(started)return;started=true;
      ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=0;master.connect(ac.destination);level();
      birdT=8+Math.random()*10;
      await Promise.all(Object.keys(FILES).map(load));startWind();},
    step(surface,speed,side){
      if(!ac||!on||surface===2)return;const k=surface===1?'gravel':'snow',b=B[k];if(!b)return;
      let slot=Math.floor(Math.random()*NSLOT);if(slot===lastSlot)slot=(slot+1)%NSLOT;lastSlot=slot;
      const s=ac.createBufferSource(),g=ac.createGain(),p=ac.createStereoPanner();
      s.buffer=b;s.playbackRate.value=.9+Math.random()*.18+(speed>200?.06:0);
      g.gain.value=(surface===1?.3:.45)*Math.min(1,.45+speed/260)*(.85+Math.random()*.3);p.pan.value=side*.12;
      s.connect(g).connect(p).connect(master);s.start(0,slot*SLOT,SLOT-.02);},
    set(o,v){on=o;vol=v;if(ac&&ac.state==='suspended')ac.resume();level();},
    setRegion,tick,get started(){return started;},
  };
})();
const sfxOn=$('sfxOn'),sfxVol=$('sfxVol');
function syncSfx(){const s=SAVE.sfx||{on:true,vol:.7};sfxOn.checked=s.on;sfxVol.value=Math.round(s.vol*100);Sfx.set(s.on,s.vol);}
sfxOn.onchange=()=>{SAVE.sfx={...(SAVE.sfx||{}),on:sfxOn.checked};Sfx.start();syncSfx();persist();};
sfxVol.oninput=()=>{SAVE.sfx={...(SAVE.sfx||{}),vol:sfxVol.value/100};Sfx.start();syncSfx();};
sfxVol.onchange=persist;
{const go=()=>{removeEventListener('pointerdown',go);removeEventListener('keydown',go);Sfx.start();syncSfx();Sfx.setRegion(curScene||'hub');};
 addEventListener('pointerdown',go);addEventListener('keydown',go);}
syncSfx();
