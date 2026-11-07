// Branching, scenario-based adult Russian dialogue simulations.
// The author-written responses model pragmatic alternatives; free spontaneous
// conversation or nuance is NOT automatically assessed.
import {stages} from "./academy-data.js";
import {scenarioMissions} from "./scenario-missions.js";
export const SCENE_KEY="shaira-scenarios-v1";
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffled=arr=>{const x=arr.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
const safe=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
export function scenarioState(storage=globalThis.localStorage){
 try{const d=JSON.parse(storage.getItem(SCENE_KEY)||"{}");return {records:safe(safe(d).records)};}catch{return{records:{}};}
}
export function recordScene(id,score,storage=globalThis.localStorage,now=Date.now()){
 const sc=scenarioMissions.find(x=>x.id===id);
 if(!sc||!Number.isInteger(score)||score<0||score>sc.turns.length)return null;
 const state=scenarioState(storage),old=safe(state.records[id]);
 const row={attempts:Math.min(100000,(Number(old.attempts)||0)+1),
  best:Math.max(Number(old.best)||0,score),last:now,lastScore:score,
  passed:old.passed===true||score>=2,lastPassed:score>=2};
 state.records[id]=row;
 try{storage.setItem(SCENE_KEY,JSON.stringify(state));return {...row,saved:true};}
 catch{return {...row,saved:false};}
}
export function scenarioStats(storage=globalThis.localStorage){
 const records=scenarioState(storage).records,arr=Object.values(records);
 return {total:scenarioMissions.length,attempted:arr.filter(x=>x?.attempts>0).length,
  passed:arr.filter(x=>x?.passed===true).length};
}
let active=null;
const newSession=id=>{
 const mission=scenarioMissions.find(x=>x.id===id);
 active={id,index:0,options:mission.turns.map(t=>shuffled(t.options.map((text,i)=>({text,index:i})))),
   chosen:null,feedback:null,answers:[],result:null};
 return active;
};
function menu(){
 const s=scenarioStats(),records=scenarioState().records;
 return '<a href="#academy" class="sc-back">← Back to Academy</a>'+
 '<section class="sc-hero"><span>SHAIRA · REAL-LIFE RUSSIAN</span><h1>Choose Your Response</h1>'+
 '<p>Practise Russian decisions in realistic adult situations. Each story has three interactions. Your response changes what the other person says next.</p>'+
 '<div class="sc-score"><strong>'+s.passed+'/'+s.total+'</strong> scenarios passed · '+s.attempted+' attempted</div></section>'+
 stages.map(level=>{
  const rows=scenarioMissions.filter(x=>x.stage===level.id);
  return '<section class="sc-list"><h2>'+level.icon+' '+level.label+' · '+esc(level.en)+'</h2>'+
   rows.map(x=>'<a href="#academy/scenarios/'+x.id+'"><div><strong>'+esc(x.title)+'</strong><small>'+
    esc(x.setting)+'</small></div><b>'+(records[x.id]?.passed?"✓":"›")+'</b></a>').join("")+'</section>';
 }).join("")+
 '<p class="sc-disclaimer">These are guided roleplays with model answers, not an intelligent free conversation or a test of speaking fluency. Speak your chosen response aloud for extra practice.</p>';
}
function scoreView(s,sc){
 return '<section class="sc-result"><span>'+(s.result.lastPassed?"✓":"↻")+'</span>'+
 '<h1>'+s.result.lastScore+' / '+sc.turns.length+'</h1>'+
 '<h2>'+(s.result.lastPassed?"Scenario practice passed":"Review the responses and practise again")+'</h2>'+
 '<p>Two or more context-appropriate model responses count as passing this short scenario. This does not measure free conversation.</p>'+
 (s.result.saved?"":'<p class="sc-warning">Your results could not be saved to this device.</p>')+
 s.answers.map((a,i)=>'<details '+(!a.correct?"open":"")+'><summary>Turn '+(i+1)+': '+(a.correct?"Recommended response":"Needs revision")+'</summary>'+
  '<p><strong lang="ru">'+esc(sc.turns[i].options[sc.turns[i].correct])+'</strong></p>'+
  '<p>'+esc(sc.turns[i].why)+'</p></details>').join("")+
 '<button type="button" data-scenario="restart" class="sc-primary">Try this scenario again ↻</button>'+
 '<a class="sc-link" href="#academy/scenarios">Choose another scenario →</a></section>';
}
function sceneView(id){
 const sc=scenarioMissions.find(x=>x.id===id);
 if(!sc)return menu();
 const s=active?.id===id?active:newSession(id);
 const crumb='<a href="#academy/scenarios" class="sc-back">← All scenarios</a>';
 const header='<section class="sc-hero"><span>'+sc.stage.toUpperCase()+' · REAL-LIFE ROLEPLAY</span>'+
 '<h1>'+esc(sc.title)+'</h1><p>'+esc(sc.setting)+'</p>'+
 '<div class="sc-progress">Conversation '+(s.result?sc.turns.length:s.index+1)+' / '+sc.turns.length+'</div></section>';
 if(s.result)return crumb+header+scoreView(s,sc);
 const t=sc.turns[s.index],options=s.options[s.index];
 return crumb+header+'<section class="sc-chat"><div class="sc-bubble sc-other">'+
 '<span>The other person says</span><strong lang="ru">'+esc(t.speaker)+'</strong>'+
 '<button type="button" data-scenario="speak" data-text="'+esc(t.speaker)+'">🔊 Hear Russian</button></div>'+
 '<div class="sc-instruction"><b>Your goal</b><p>'+esc(t.goal)+'</p></div>'+
 '<h2>Choose your Russian reply</h2><p class="sc-muted">Choose the most context-appropriate model. More than one phrasing may be possible in real life.</p>'+
 '<div class="sc-options">'+options.map((o,i)=>'<button type="button" data-scenario="answer" data-choice="'+i+'" '+
  (s.feedback?"disabled":"")+' class="'+(s.feedback?(o.index===t.correct?"sc-right":s.chosen===i?"sc-wrong":""):"")+'">'+
  '<span lang="ru">'+esc(o.text)+'</span></button>').join("")+'</div>'+
 (s.feedback?'<div class="sc-feedback '+(s.feedback.correct?"good":"bad")+'"><b>'+
   (s.feedback.correct?"Context-appropriate response":"A better response is available")+'</b>'+
   '<p>Recommended: <strong lang="ru">'+esc(t.options[t.correct])+'</strong></p>'+
   '<p>'+esc(t.why)+'</p></div>'+
   '<div class="sc-bubble sc-other"><span>The person responds</span>'+
   '<strong lang="ru">'+esc(s.feedback.correct?t.right:t.wrong)+'</strong>'+
   '<button type="button" data-scenario="speak" data-text="'+esc(s.feedback.correct?t.right:t.wrong)+'">🔊 Hear reply</button></div>'+
   '<button type="button" data-scenario="next" class="sc-primary">'+
    (s.index===sc.turns.length-1?"See conversation result":"Continue conversation →")+'</button>':"")+
 '</section>';
}
export const scenariosHtml=route=>route==="academy/scenarios"?menu():sceneView(route.split("/")[2]);
export function scenariosAction(btn,api){
 const action=btn.dataset.scenario;
 if(action==="speak"){api.speak(btn.dataset.text||"");return;}
 const id=api.route().split("/")[2],mission=scenarioMissions.find(x=>x.id===id);
 if(!mission)return;
 const s=active?.id===id?active:newSession(id);
 if(action==="restart"){newSession(id);api.render();return;}
 if(s.result)return;
 if(action==="answer"&&!s.feedback){
  const i=Number(btn.dataset.choice),option=s.options[s.index][i];
  if(!Number.isInteger(i)||!option)return;
  s.chosen=i;
  const correct=option.index===mission.turns[s.index].correct;
  s.feedback={correct};
  api.render();return;
 }
 if(action==="next"&&s.feedback){
  s.answers.push({correct:s.feedback.correct});
  s.index++;s.chosen=null;s.feedback=null;
  if(s.index>=mission.turns.length)s.result=recordScene(id,s.answers.filter(x=>x.correct).length);
  api.render();
 }
}
