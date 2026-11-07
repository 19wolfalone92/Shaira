// Interactive Russian sound contrasts with bundled synthetic Russian models.
// A correct choice is listening *practice*, not native pronunciation assessment.
import {SOUND_PAIRS,SOUND_STAGES,soundForStage} from "./phonetics-content.js";
import {stages} from "./academy-data.js";
export const SOUND_KEY="shaira-phonetics-v1";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const DAY=86400000,INT=[1,3,7,14,30];
export function loadSounds(storage=globalThis.localStorage){
 try{return{items:safe(safe(JSON.parse(storage.getItem(SOUND_KEY)||"{}")).items)};}
 catch{return{items:{}};}
}
export function recordSound(pairId,target,correct,storage=globalThis.localStorage,now=Date.now()){
 if(!SOUND_PAIRS.some(p=>p.id===pairId)||![0,1].includes(target)||typeof correct!=="boolean")return false;
 const d=loadSounds(storage),key=pairId+":"+target,old=safe(d.items[key]);
 const seen=Math.min(100000,(Number(old.seen)||0)+1),good=Math.min(seen,(Number(old.correct)||0)+Number(correct));
 const streak=correct?Math.min(5,(Number(old.streak)||0)+1):0;
 d.items[key]={seen,correct:good,last:now,lastCorrect:correct,streak,due:now+(correct?INT[streak-1]:1)*DAY};
 try{storage.setItem(SOUND_KEY,JSON.stringify(d));return true;}catch{return false;}
}
export function soundStats(storage=globalThis.localStorage,now=Date.now()){
 const d=loadSounds(storage).items,records=Object.values(d).filter(x=>x&&Number(x.seen)>0);
 return {pairs:SOUND_PAIRS.length,targets:records.length,correct:records.filter(x=>x.lastCorrect).length,
 due:records.filter(x=>Number(x.due)<=now).length};
}
let active=null;
const nextTarget=(id)=>{
 const history=loadSounds().items;
 const left=history[id+":0"],right=history[id+":1"];
 const a=left?Number(left.seen)||0:0,b=right?Number(right.seen)||0:0;
 return a===b?Math.random()<0.5?0:1:a<b?0:1;
};
function start(id){
 active={id,target:nextTarget(id),played:false,answer:null,saved:false,notice:""};
 return active;
}
function list(){
 const stats=soundStats(),items=loadSounds().items;
 return '<a class="ph-back" href="#academy">← Back to Academy</a>'+
 '<section class="ph-hero"><span>SHAIRA · RUSSIAN PHONETICS</span><h1>Hear the Difference</h1>'+
 '<p>Learn to distinguish meaningful Russian sounds: hard and soft consonants, vowels, word openings and tricky advanced vocabulary. Listen before choosing a word.</p>'+
 '<div class="ph-stats"><div><strong>'+stats.pairs+'</strong><small>sound contrasts</small></div>'+
 '<div><strong>'+stats.targets+'/60</strong><small>sound targets attempted</small></div>'+
 '<div><strong>'+stats.due+'</strong><small>review due</small></div></div>'+
 '<p class="ph-note">The built-in audio uses a synthetic Russian voice.</p></section>'+
 stages.map(s=>'<section class="ph-stage"><h2>'+s.icon+' '+s.label+' · '+esc(s.en)+'</h2>'+
 soundForStage(s.id).map(p=>{
  const seen=[0,1].filter(i=>Number(items[p.id+":"+i]?.seen)>0).length;
  return '<a href="#academy/sounds/'+p.id+'"><div><strong>'+esc(p.focus)+'</strong>'+
    '<small lang="ru">'+esc(p.a.ru)+' ↔ '+esc(p.b.ru)+'</small></div>'+
    '<b>'+seen+'/2 →</b></a>';
 }).join("")+'</section>').join("")+
 '<p class="ph-note">This trainer tests two-choice auditory discrimination when Russian speech works. It does not score accent, oral fluency, or CEFR proficiency.</p>';
}
function detail(id){
 const p=SOUND_PAIRS.find(x=>x.id===id);
 if(!p)return list();
 const s=active?.id===id?active:start(id);
 const target=s.target===0?p.a:p.b;
 return '<a class="ph-back" href="#academy/sounds">← All sound contrasts</a>'+
 '<section class="ph-hero"><span>'+p.stage.toUpperCase()+' · SOUND CONTRAST</span><h1>'+esc(p.focus)+'</h1>'+
 '<p>Listen without looking for a translation. Choose which Russian word the voice says.</p>'+
 '<div class="ph-audio"><button type="button" data-sound="play">🔊 Hear the Russian word</button>'+
 '<button type="button" data-sound="slow">0.7× Slow playback</button></div>'+
 (s.notice?'<p class="ph-warning" role="status">'+esc(s.notice)+'</p>':"")+'</section>'+
 '<section class="ph-challenge"><h2>Which Russian word did you hear?</h2>'+
 (s.played?'<p class="ph-note">Choose the word that matches the recording.</p>':'<p class="ph-note">Play the word before answering. You may replay it.</p>')+
 '<div class="ph-choices">'+[p.a,p.b].map((w,i)=>'<button type="button" data-sound="answer" data-answer="'+i+'" '+
 (s.played&&!s.answer?"":"disabled")+' class="'+(s.answer?(i===s.target?"right":s.answer.selected===i?"wrong":""):"")+'">'+
 '<span lang="ru">'+esc(w.ru)+'</span></button>').join("")+'</div>'+
 (s.answer?'<div class="ph-feedback '+(s.answer.correct?"good":"bad")+'"><strong>'+(s.answer.correct?"✓ Correct listening choice":"Not quite — listen to the difference")+'</strong>'+
 '<p>The spoken word was <b lang="ru">'+esc(target.ru)+'</b> — '+esc(target.en)+'.</p>'+
 '<p>'+esc(p.explain)+'</p>'+
 (s.saved?"":'<p>Your attempt could not be saved locally.</p>')+
 '<button type="button" data-sound="retry" class="ph-primary">Practise another target ↻</button></div>':"")+
 '<details class="ph-comparison"><summary>Study both words and their meanings (reading reference)</summary>'+
 [p.a,p.b].map((w,i)=>'<div><button type="button" data-sound="compare" data-word="'+i+'" aria-label="Hear '+esc(w.ru)+'">🔊</button>'+
 '<strong lang="ru">'+esc(w.ru)+'</strong><span>'+esc(w.en)+'</span></div>').join("")+
 '<p>'+esc(p.explain)+'</p></details></section>';
}
export const phoneticsHtml=route=>route==="academy/sounds"?list():detail(route.split("/")[2]);
export function phoneticsAction(btn,api){
 const action=btn.dataset.sound,id=api.route().split("/")[2],pair=SOUND_PAIRS.find(x=>x.id===id);
 if(!pair)return;
 const s=active?.id===id?active:start(id);
 if(action==="retry"){start(id);api.render();return;}
 if(action==="compare"){
  const index=Number(btn.dataset.word);
  if(index!==0&&index!==1)return;
  api.speak(index===0?pair.a.ru:pair.b.ru,1,undefined,pair.id+"-"+index);return;
 }
 if(action==="play"||action==="slow"){
  const target=s.target===0?pair.a:pair.b,route=api.route();
  api.speak(target.ru,action==="slow"?0.7:1,ok=>{
   if(active!==s||api.route()!==route)return;
   if(ok)s.played=true;
   s.notice=ok?"":"Could not play this example. Try again or study the two written words below.";
   api.render();
  },pair.id+"-"+s.target);
  return;
 }
 if(action==="answer"&&s.played&&!s.answer){
  const i=Number(btn.dataset.answer);
  if(![0,1].includes(i))return;
  s.answer={selected:i,correct:i===s.target};
  s.saved=recordSound(pair.id,s.target,s.answer.correct);
  api.render();
 }
}
