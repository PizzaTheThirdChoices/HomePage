'use strict';
/* PIZZA OR DIE prototype. Replace these optional URLs when official assets arrive.
   The music cues are seconds from the beginning of each track. */
const GAME_ASSETS = {
  character: '', // e.g. assets/game/character.png
  music: {
    play: {src:'',cue:0},
    fever:{src:'',cue:0},
    over: {src:'',cue:0}
  }
};
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const W=canvas.width,H=canvas.height;
const $=id=>document.getElementById(id);
const overlay=$('game-overlay'),start=$('start-game'),pause=$('pause-game'),mute=$('mute-game');
const character=new Image();let characterReady=false;
if(GAME_ASSETS.character){character.onload=()=>characterReady=true;character.src=GAME_ASSETS.character;}
const audio=new Audio();audio.preload='none';
let soundOn=false,phase='ready',last=0,elapsed=0,score=0,combo=0,maxCombo=0,near=0,totalNear=0,hunger=100,fever=0,spawnClock=0,objects=[],nextId=1,held={left:false,right:false},pointer=null,playerX=W/2,reason='',raf=0;
const player={y:H-76,w:48,h:52};
const random=(a,b)=>a+Math.random()*(b-a);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const isPlaying=()=>phase==='playing';
function playMusic(kind){
  const cfg=GAME_ASSETS.music[kind];
  if(!soundOn||!cfg||!cfg.src){audio.pause();return;}
  try{
    if(audio.dataset.track!==kind){audio.src=cfg.src;audio.dataset.track=kind;audio.loop=kind!=='over';audio.currentTime=0;audio.addEventListener('loadedmetadata',()=>{if(audio.dataset.track===kind)audio.currentTime=Math.min(cfg.cue||0,Math.max(0,audio.duration-.1));},{once:true});}
    else if(kind==='fever')audio.currentTime=Math.min(cfg.cue||0,Math.max(0,(audio.duration||999)-.1));
    audio.play().catch(()=>{});
  }catch(_){}
}
function reset(){
  cancelAnimationFrame(raf);
  elapsed=score=combo=maxCombo=near=totalNear=fever=spawnClock=0;hunger=100;objects=[];nextId=1;playerX=W/2;last=0;reason='';
  phase='playing';overlay.hidden=true;pause.disabled=false;pause.textContent='PAUSE';$('results').hidden=true;
  playMusic('play');updateHud();raf=requestAnimationFrame(frame);
}
function finish(why){
  if(phase==='over')return;
  phase='over';reason=why;pause.disabled=true;playMusic('over');
  $('overlay-title').textContent='GAME OVER';
  $('overlay-message').textContent=why;
  $('result-summary').textContent='SCORE  '+score.toLocaleString()+'\nTIME  '+elapsed.toFixed(1)+'s\nMAX COMBO  '+maxCombo+'\nNEAR MISS  '+totalNear;
  $('results').hidden=false;start.textContent='TRY AGAIN';overlay.hidden=false;
  updateHud();
}
function addObject(){
  const golden=fever>0;
  const pineapple=!golden&&Math.random()<Math.min(.32,.18+elapsed*.0007);
  const radius=pineapple?20:golden?21:19;
  objects.push({id:nextId++,x:random(radius+8,W-radius-8),y:-radius-5,r:radius,kind:pineapple?'pineapple':golden?'gold':'pizza',speed:Math.min(510,175+elapsed*2.1)*random(.88,1.13),nearCandidate:false,judged:false});
}
function updateHud(){
  $('score').textContent=score.toLocaleString();$('combo').textContent=String(combo);$('near').textContent=near+'/5';$('time').textContent=elapsed.toFixed(1)+'s';$('hunger').value=Math.max(0,hunger);
}
function startFever(){
  fever=8;near=0;
  // Clear pre-existing pineapples so fever is completely hazard-free.
  objects=objects.filter(o=>o.kind!=='pineapple');
  playMusic('fever');
}
function step(dt){
  elapsed+=dt;hunger-=dt*8.3;
  if(hunger<=0){hunger=0;finish('HUNGER ZERO — ピザを食べ続けよう！');return;}
  if(held.left)playerX-=300*dt;
  if(held.right)playerX+=300*dt;
  playerX=clamp(playerX,player.w/2+4,W-player.w/2-4);
  if(fever>0){fever=Math.max(0,fever-dt);if(fever===0)playMusic('play');}
  spawnClock-=dt;
  if(spawnClock<=0){
    addObject();
    spawnClock=(fever>0?.19:Math.max(.37,.83-elapsed*.004))*random(.85,1.16);
  }
  const px=playerX,py=player.y;
  const playerLeft=px-player.w*.36,playerRight=px+player.w*.36;
  const playerTop=py-player.h*.42,playerBottom=py+player.h*.42;
  for(const o of objects){
    o.y+=o.speed*dt;
    // Rectangle/circle collision: narrower than the visible artwork for fairness.
    const dx=Math.max(playerLeft-o.x,0,o.x-playerRight);
    const dy=Math.max(playerTop-o.y,0,o.y-playerBottom);
    const collided=dx*dx+dy*dy<(o.r*.79)**2;
    if(collided){
      o.judged=true;
      if(o.kind==='pineapple'){finish('PINEAPPLE!');return;}
      combo++;maxCombo=Math.max(maxCombo,combo);
      const points=o.kind==='gold'?500:100;
      score+=points*Math.min(5,1+Math.floor((combo-1)/5));
      hunger=clamp(hunger+(o.kind==='gold'?13:29),0,100);
      o.y=H+100;
    }else if(o.kind==='pineapple'&&!o.judged){
      // A near miss counts only after the obstacle fully passes the player.
      if(o.y-o.r>playerBottom){
        const gap=Math.max(playerLeft-(o.x+o.r*.79), (o.x-o.r*.79)-playerRight);
        if(gap>=0&&gap<=18){
          near++;totalNear++;score+=200;
          if(near>=5)startFever();
        }else near=0; // A normal dodge interrupts the near-miss streak.
        o.judged=true;
      }
    }else if(o.kind!=='pineapple'&&!o.judged&&o.y-o.r>playerBottom){
      combo=0;o.judged=true;
    }
  }
  objects=objects.filter(o=>o.y<H+40);
  updateHud();
}
function draw(){
  ctx.fillStyle='#141414';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#2c2c2c';ctx.lineWidth=1;
  for(let x=35;x<W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  if(fever>0){ctx.fillStyle='rgba(255,190,30,.10)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#ffda54';ctx.font='bold 26px Arial';ctx.textAlign='center';ctx.fillText('FEVER TIME  '+fever.toFixed(1),W/2,60);}
  for(const o of objects){
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=(o.kind==='pineapple'?43:43)+'px sans-serif';
    if(o.kind==='pineapple')ctx.fillText('🍍',o.x,o.y);
    else if(o.kind==='gold'){ctx.fillText('🍕',o.x,o.y);ctx.strokeStyle='#ffe15d';ctx.lineWidth=4;ctx.beginPath();ctx.arc(o.x,o.y,25,0,Math.PI*2);ctx.stroke();}
    else ctx.fillText('🍕',o.x,o.y);
  }
  if(characterReady){ctx.drawImage(character,playerX-player.w/2,player.y-player.h/2,player.w,player.h);}
  else{ctx.font='49px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('😈',playerX,player.y);}
  if(near>0&&fever===0){ctx.font='bold 16px Arial';ctx.textAlign='center';ctx.fillStyle='#ffcc64';ctx.fillText('NEAR MISS × '+near,playerX,player.y-54);}
}
function frame(t){
  if(!isPlaying())return;
  const dt=last?Math.min((t-last)/1000,.035):0;last=t;
  if(dt)step(dt);
  draw();
  if(isPlaying())raf=requestAnimationFrame(frame);
}
start.addEventListener('click',()=>{$('overlay-title').textContent='PIZZA OR DIE';reset();});
pause.addEventListener('click',()=>{
  if(phase==='playing'){phase='paused';pause.textContent='RESUME';audio.pause();overlay.hidden=false;$('overlay-title').textContent='PAUSED';$('overlay-message').textContent='PAUSEボタンで再開';start.hidden=true;}
  else if(phase==='paused'){phase='playing';pause.textContent='PAUSE';overlay.hidden=true;start.hidden=false;last=0;playMusic(fever>0?'fever':'play');raf=requestAnimationFrame(frame);}
});
mute.addEventListener('click',()=>{soundOn=!soundOn;mute.textContent=soundOn?'SOUND ON':'SOUND OFF';mute.setAttribute('aria-pressed',String(soundOn));if(soundOn&&isPlaying())playMusic(fever>0?'fever':'play');else audio.pause();});
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){if(isPlaying()){e.preventDefault();held[e.key==='ArrowLeft'?'left':'right']=true;}}else if(e.key==='Escape'&&phase==='playing')pause.click();});
document.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight')held[e.key==='ArrowLeft'?'left':'right']=false;});
window.addEventListener('blur',()=>{held.left=held.right=false;if(isPlaying())pause.click();});
canvas.addEventListener('pointerdown',e=>{if(!isPlaying())return;pointer={id:e.pointerId,x:e.clientX};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!isPlaying()||!pointer||pointer.id!==e.pointerId)return;const scale=W/canvas.getBoundingClientRect().width;playerX=clamp(playerX+(e.clientX-pointer.x)*scale,player.w/2+4,W-player.w/2-4);pointer.x=e.clientX;});
const endPointer=e=>{if(pointer&&pointer.id===e.pointerId)pointer=null;};
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
function resultImage(){
  const c=document.createElement('canvas');c.width=1080;c.height=1920;const g=c.getContext('2d');
  g.fillStyle='#151515';g.fillRect(0,0,c.width,c.height);g.textAlign='center';
  g.fillStyle='#ffcf5e';g.font='bold 100px Impact,Arial';g.fillText('PIZZA OR DIE',540,310);
  g.font='150px Arial';g.fillText('🍕',540,540);
  g.fillStyle='#fff';g.font='48px Arial';g.fillText('PIZZA THE THIRD CHOICES',540,700);
  g.fillStyle='#ffcf5e';g.font='bold 175px Arial';g.fillText(score.toLocaleString(),540,1020);
  g.fillStyle='#fff';g.font='48px Arial';g.fillText('SCORE',540,1100);
  g.font='52px Arial';g.fillText('TIME  '+elapsed.toFixed(1)+'s',540,1270);
  g.fillText('MAX COMBO  '+maxCombo,540,1370);
  g.fillText('NEAR MISS  '+totalNear,540,1470);
  g.font='35px Arial';g.fillStyle='#aaa';g.fillText('Pizza The Third Choices / Official Website',540,1770);
  return c;
}
$('share-game').addEventListener('click',async()=>{
  const c=resultImage();const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));
  if(!blob)return;
  const file=new File([blob],'pizza-or-die-score.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:'PIZZA OR DIE',text:'SCORE '+score});return;}catch(e){if(e.name==='AbortError')return;}
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
});
draw();updateHud();
