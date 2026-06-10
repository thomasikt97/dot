
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score');
const levelEl=document.getElementById('level');
const bestEl=document.getElementById('best');

function resize(){
 canvas.width=Math.floor(window.innerWidth*0.95);
 canvas.height=Math.floor(window.innerHeight*0.70);
}
resize();
window.addEventListener('resize',resize);

let player, obstacles=[], score=0, level=1, left=false, right=false, gameOver=false;

bestEl.textContent='Rekord: '+(localStorage.getItem('best')||0);

function startGame(){
 player={x:canvas.width/2,y:canvas.height-60,r:14,speed:8};
 obstacles=[];
 score=0;
 level=1;
 gameOver=false;
 requestAnimationFrame(loop);
}

function spawnObstacle(){
 obstacles.push({
  x:Math.random()*(canvas.width-40),
  y:-40,w:40,h:40
 });
}

function update(){
 if(gameOver) return;

 score++;
 level=Math.floor(score/250)+1;

 if(left) player.x-=player.speed;
 if(right) player.x+=player.speed;

 player.x=Math.max(player.r,Math.min(canvas.width-player.r,player.x));

 if(Math.random()<0.03+level*0.002) spawnObstacle();

 for(const o of obstacles){
  o.y+=3+level;

  if(player.x+player.r>o.x &&
     player.x-player.r<o.x+o.w &&
     player.y+player.r>o.y &&
     player.y-player.r<o.y+o.h){

      gameOver=true;
      const best=Math.max(score, Number(localStorage.getItem('best')||0));
      localStorage.setItem('best',best);
      bestEl.textContent='Rekord: '+best;
  }
 }

 obstacles=obstacles.filter(o=>o.y<canvas.height+60);

 scoreEl.textContent='Poeng: '+score;
 levelEl.textContent='Level: '+level;
}

function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 ctx.beginPath();
 ctx.arc(player.x,player.y,player.r,0,Math.PI*2);
 ctx.fillStyle='deepskyblue';
 ctx.fill();

 ctx.fillStyle='red';
 for(const o of obstacles){
   ctx.fillRect(o.x,o.y,o.w,o.h);
 }

 if(gameOver){
   ctx.fillStyle='white';
   ctx.font='28px Arial';
   ctx.fillText('Game Over',canvas.width/2-70,canvas.height/2);
 }
}

function loop(){
 update();
 draw();
 if(!gameOver) requestAnimationFrame(loop);
}

document.getElementById('start').addEventListener('click',startGame);

document.addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft') left=true;
 if(e.key==='ArrowRight') right=true;
});
document.addEventListener('keyup',e=>{
 if(e.key==='ArrowLeft') left=false;
 if(e.key==='ArrowRight') right=false;
});

document.getElementById('left').addEventListener('touchstart',e=>{e.preventDefault();left=true;});
document.getElementById('left').addEventListener('touchend',e=>{e.preventDefault();left=false;});
document.getElementById('right').addEventListener('touchstart',e=>{e.preventDefault();right=true;});
document.getElementById('right').addEventListener('touchend',e=>{e.preventDefault();right=false;});
