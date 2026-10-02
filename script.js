/* ✏️ EDIT THESE ✏️ */
const PASS="2105";                 // the secret password
const BF="My Love", YOU="Your baby";
const HINT_AFTER=3;                // show a hint after this many wrong tries
const HINT="hint: it's a date we both remember 💗";
const WRONG=[
 "Excuse me?? 😤 That is NOT it.",
 "Seriously?! You forgot?! 🙄",
 "Wrong. Think harder, mister 😒",
 "Are you even my boyfriend?? 😡",
 "I'm getting offended now… 😤💢",
 "Try AGAIN. I'll wait. 🙃"
];
const LETTER=`Hey ${BF}, 💗

Happy Boyfriend's Day, my favourite person in the whole world.

You remembered the code, so I already know you love me. 😌

If I could, I would take away every bit of your pain, and give it back to you as love.

Every part of me loves every little piece of you — even the parts you sometimes struggle to love yourself.

And no matter how many times I tell you “I love you,” somehow those three words will never be enough… because I will always, always love you so much more than I could ever put into words. ❤️

Forever yours 💋`;

const $=s=>document.querySelector(s);

/* hearts */
const cv=$('#bg'),cx=cv.getContext('2d');let W,H,hs=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
const E=['💗','💖','💕','🌸','✨'];
function mk(x,y,b){return{x:x??Math.random()*W,y:y??H+20,s:12+Math.random()*20,v:b?-(2+Math.random()*4):.4+Math.random()*1,dx:b?(Math.random()-.5)*8:0,e:E[Math.random()*E.length|0],a:b?1:.2+Math.random()*.35,b,ph:Math.random()*6}}
for(let i=0;i<14;i++){const h=mk();h.y=Math.random()*H;hs.push(h)}
(function loop(){cx.clearRect(0,0,W,H);if(hs.length<18&&Math.random()<.03)hs.push(mk());
 hs=hs.filter(h=>h.y>-40&&h.y<H+60&&h.a>0);
 for(const h of hs){if(h.b){h.y+=h.v;h.x+=h.dx;h.v+=.07;h.a-=.008}else{h.y-=h.v;h.x+=Math.sin(h.ph+=.02)*.5}
 cx.globalAlpha=Math.max(h.a,0);cx.font=h.s+'px serif';cx.fillText(h.e,h.x,h.y)}requestAnimationFrame(loop)})();
function burst(x=W/2,y=H/2,n=50){for(let i=0;i<n;i++){const h=mk(x,y,true);h.v=-(Math.random()*9);h.s=16+Math.random()*24;hs.push(h)}}

/* keypad */
const pad=$('#pad');
['1','2','3','4','5','6','7','8','9','⌫','0','💗'].forEach(k=>{const b=document.createElement('button');b.textContent=k;b.onclick=()=>press(k);pad.appendChild(b)});
addEventListener('keydown',e=>{if(/^[0-9]$/.test(e.key))press(e.key);if(e.key==='Backspace')press('⌫')});

let code='',wrong=0,locked=false;
const dots=[...document.querySelectorAll('#dots i')];
function draw(){dots.forEach((d,i)=>d.classList.toggle('f',i<code.length))}
function say(t){const s=$('#speech');s.textContent=t;s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop')}

function press(k){
 if(locked)return;
 if(k==='⌫'){code=code.slice(0,-1);draw();return}
 if(k==='💗'){burst(W/2,H/2,12);say('aww, but I need the code first 🥺');return}
 if(code.length>=4)return;
 code+=k;draw();
 if(code.length===4)setTimeout(check,250)}

function check(){
 if(code===PASS)return success();
 const m=WRONG[wrong%WRONG.length];wrong++;
 $('#msg').textContent=m+(wrong>=HINT_AFTER&&wrong%HINT_AFTER===0?'  '+HINT:'');
 say(m);
 document.body.classList.add('wrong');
 const li=$('#lockicon');li.classList.remove('shake');void li.offsetWidth;li.classList.add('shake');
 navigator.vibrate&&navigator.vibrate(200);
 setTimeout(()=>document.body.classList.remove('wrong'),1800);
 code='';draw()}

function success(){
 locked=true;document.body.classList.add('ok');
 $('#lockicon').textContent='🔓';$('#lockicon').classList.add('open');
 $('#msg').textContent='';say('YAAAY!!! you got it!! 🥰💖');burst(W/2,H/2,90);
 $('#chars2').innerHTML=$('#duo').outerHTML;
 setTimeout(()=>{$('#unlocked').classList.add('on');burst(W/2,H*.7,70)},1500)}

/* letter */
$('#openLetter').onclick=()=>{$('#unlocked').classList.remove('on');$('#letterscreen').classList.add('on');burst(W/2,H*.7,40);typeLetter()};
let typed=false,skip=false;
function typeLetter(){if(typed)return;typed=true;const el=$('#letter');let i=0;el.onclick=()=>{skip=true};
 (function n(){if(skip)i=LETTER.length;el.textContent=LETTER.slice(0,i++);el.parentElement.parentElement.scrollTop=1e5;if(i<=LETTER.length)setTimeout(n,34)})()}


/* ===== BACKGROUND MUSIC =====
   1) Put your song next to index.html and name it  song.mp3
   2) No song.mp3?  A soft built-in music-box melody plays instead.
   Browsers only allow sound after a tap, so it starts on his first tap/keypress.
   The 🔊/🔇 button (top right) turns it on or off. */
const MUSIC_VOLUME=0.6;            // 0 to 1
const bgm=$('#bgm'),mbtn=$('#music');
bgm.volume=MUSIC_VOLUME;
let musicOn=false,musicStarted=false,ac,melody,mstep=0;
const NOTES=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,523.25,659.25,783.99,1046.5,880,783.99,659.25,587.33];
const fileOK=()=>!bgm.error&&bgm.networkState!==3;
function beep(f){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=f;
 g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.18*MUSIC_VOLUME,ac.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+1.4);
 o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+1.5)}
function playMusic(){
 if(fileOK()){bgm.play().catch(()=>{})}
 else{ac=ac||new(window.AudioContext||window.webkitAudioContext)();ac.resume();clearInterval(melody);melody=setInterval(()=>beep(NOTES[mstep++%NOTES.length]),440)}}
function stopMusic(){bgm.pause();clearInterval(melody)}
function setMusic(v){musicOn=v;mbtn.textContent=v?'🔊':'🔇';mbtn.classList.toggle('on',v);v?playMusic():stopMusic()}
function firstTap(){if(musicStarted)return;musicStarted=true;setMusic(true)}
addEventListener('pointerdown',firstTap,{once:true});
addEventListener('keydown',firstTap,{once:true});
mbtn.onclick=e=>{e.stopPropagation();musicStarted=true;setMusic(!musicOn)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();else if(musicOn)playMusic()});