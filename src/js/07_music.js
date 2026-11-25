/* ---------- music: original ambient score, generated live with Web Audio ----------
   Low drone + soft string pad + plucked harp arpeggios + an occasional flute line,
   through a long synthetic reverb. Each region gets its own chords and colour.
   Starts on the player's first click/key (browsers block audio before that). */
const Music=(()=>{
  let ac=null,master=null,verb=null,dry=null,timer=null,next=0,step=0,on=true,vol=.5,region='hub',started=false;
  const midi=n=>440*2**((n-69)/12);
  // chord progressions (MIDI roots + chord tones), tempo, and timbre per region
  const SCORES={
    hub:   {bpm:56,scale:[62,64,65,67,69,70,72,74],prog:[[50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64]],cut:900,flute:.35},
    woods: {bpm:52,scale:[62,64,65,67,69,71,72,74],prog:[[50,57,62,65],[48,55,60,64],[46,53,58,62],[45,52,57,61]],cut:800,flute:.3},
    hollow:{bpm:58,scale:[60,62,64,66,67,69,71,72],prog:[[48,55,60,64],[50,57,62,66],[43,50,55,59],[45,52,57,60]],cut:1100,flute:.45},
    reach: {bpm:48,scale:[64,66,67,69,71,72,74,76],prog:[[52,59,64,67],[48,55,60,64],[50,57,62,66],[47,54,59,62]],cut:1400,flute:.25},
  };
  function impulse(sec){const n=ac.sampleRate*sec,b=ac.createBuffer(2,n,ac.sampleRate);
    for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6);}return b;}
  function init(){
    ac=new (window.AudioContext||window.webkitAudioContext)();
    master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=3;comp.connect(master);
    verb=ac.createConvolver();verb.buffer=impulse(4.5);const wet=ac.createGain();wet.gain.value=.55;verb.connect(wet);wet.connect(comp);
    dry=ac.createGain();dry.gain.value=.5;dry.connect(comp);
  }
  const out=(node,send=.8)=>{node.connect(dry);const s=ac.createGain();s.gain.value=send;node.connect(s);s.connect(verb);};
  function pad(notes,t,dur,cut){
    for(const n of notes){for(const det of [-6,6]){
      const o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();
      o.type='sawtooth';o.frequency.value=midi(n);o.detune.value=det;
      f.type='lowpass';f.frequency.value=cut;f.Q.value=.4;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.018,t+dur*.35);g.gain.linearRampToValueAtTime(.014,t+dur*.8);g.gain.linearRampToValueAtTime(0,t+dur+1.5);
      o.connect(f);f.connect(g);out(g,.9);o.start(t);o.stop(t+dur+1.6);}}
  }
  function drone(root,t,dur){
    for(const [n,a] of [[root-12,.05],[root-5,.025]]){
      const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=midi(n);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a,t+2);g.gain.setValueAtTime(a,t+dur-.5);g.gain.linearRampToValueAtTime(0,t+dur+2);
      o.connect(g);out(g,.5);o.start(t);o.stop(t+dur+2.1);}
  }
  function harp(n,t,a=.07){
    const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();
    o.type='triangle';o2.type='sine';o.frequency.value=midi(n);o2.frequency.value=midi(n+12);
    f.type='lowpass';f.frequency.setValueAtTime(3200,t);f.frequency.exponentialRampToValueAtTime(700,t+1.2);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a,t+.008);g.gain.exponentialRampToValueAtTime(.0005,t+2.6);
    const g2=ac.createGain();g2.gain.value=.25;o.connect(f);o2.connect(g2);g2.connect(f);f.connect(g);out(g,1);
    o.start(t);o2.start(t);o.stop(t+2.7);o2.stop(t+2.7);
  }
  function flute(n,t,dur){
    const o=ac.createOscillator(),v=ac.createOscillator(),vg=ac.createGain(),g=ac.createGain(),f=ac.createBiquadFilter();
    o.type='sine';o.frequency.value=midi(n);v.frequency.value=5;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(midi(n)*.006,t+dur*.6);
    v.connect(vg);vg.connect(o.frequency);f.type='lowpass';f.frequency.value=2400;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.25);g.gain.setValueAtTime(.03,t+dur-.3);g.gain.linearRampToValueAtTime(0,t+dur+.4);
    o.connect(f);f.connect(g);out(g,1.1);o.start(t);v.start(t);o.stop(t+dur+.5);v.stop(t+dur+.5);
  }
  let phrase=[];
  function schedule(){
    const S=SCORES[region]||SCORES.hub,beat=60/S.bpm,bar=beat*4;
    while(next<ac.currentTime+1.5){
      const t=next,chord=S.prog[Math.floor(step/16)%S.prog.length],inBar=step%16;
      if(step%16===0){pad(chord.slice(1),t,bar*.98,S.cut);if(Math.floor(step/16)%2===0)drone(chord[0],t,bar*2);}
      // harp: gentle broken chord on eighth notes, with rests
      if(inBar%2===0&&Math.random()<.62){const pool=[...chord.slice(1).map(n=>n+12),chord[1]+24];harp(pool[(inBar/2+Math.floor(step/16))%pool.length],t+Math.random()*.03,.05+Math.random()*.03);}
      // flute: a short phrase every few bars
      if(inBar===0&&!phrase.length&&Math.random()<S.flute){let k=Math.floor(Math.random()*4)+2;const len=3+Math.floor(Math.random()*3);
        for(let i=0;i<len;i++){k=Math.max(0,Math.min(S.scale.length-1,k+[-1,1,1,-2,2,0][Math.floor(Math.random()*6)]));phrase.push({n:S.scale[k]+12,beats:[2,2,4,3][Math.floor(Math.random()*4)]});}
        let tt=t+beat*2;for(const p of phrase){flute(p.n,tt,p.beats*beat*.9);tt+=p.beats*beat;}setTimeout(()=>phrase=[],(tt-ac.currentTime)*1000);}
      next+=beat/2;step+=2;
    }
  }
  function level(){if(!ac)return;const target=on?vol*2.4:0;master.gain.cancelScheduledValues(ac.currentTime);master.gain.setTargetAtTime(target,ac.currentTime,.8);}
  return {
    start(){if(started)return;started=true;init();next=ac.currentTime+.2;timer=setInterval(schedule,250);schedule();level();},
    setRegion(id){if(id===region)return;region=id;if(ac){master.gain.setTargetAtTime(0,ac.currentTime,.4);setTimeout(()=>{step=0;next=Math.max(next,ac.currentTime+.6);level();},1400);}},
    set(onV,volV){on=onV;vol=volV;if(ac&&ac.state==='suspended')ac.resume();level();},
    get started(){return started;},
  };
})();
