import {VERBS,SUBJECTS,PAST_SUBJECTS} from "./verb-paradigms.js";
import {stages} from "./academy-data.js";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function menu(){
 return '<a class="vb-back" href="#academy">← Back to Academy</a>'+
 '<header class="vb-hero"><span>SHAIRA · VERB CONJUGATION</span><h1>Russian Verb Lab</h1>'+
 '<p>24 everyday verbs, with six present-tense person forms and three past-tense patterns each. Review the table, hear the examples, and practise without copying in Variety Lab.</p>'+
 '<div class="vb-count"><b>240</b><span>explicit present/past verb forms</span></div></header>'+
 stages.map(level=>{
  const list=VERBS.filter(v=>v.stage===level.id);
  return '<section class="vb-list"><h2>'+level.label+' · '+esc(level.en)+'</h2>'+
   list.map(v=>'<a href="#academy/verbs/'+v.id+'"><strong lang="ru">'+esc(v.infinitive)+'</strong>'+
    '<span>'+esc(v.en)+'</span><b>›</b></a>').join("")+'</section>';
 }).join("")+
 '<a href="#academy/mix/a1" class="vb-primary">Practise verbs in varied exercises ↗</a>'+
 '<p class="vb-note">These are selected imperfective present/past forms. Russian aspect and future-tense constructions also need separate study.</p>';
}
function detail(id){
 const v=VERBS.find(x=>x.id===id);if(!v)return menu();
 return '<a class="vb-back" href="#academy/verbs">← All 24 verbs</a>'+
 '<section class="vb-hero"><span>'+v.stage.toUpperCase()+' · VERB CONJUGATION</span>'+
 '<h1 lang="ru">'+esc(v.infinitive)+'</h1><p>'+esc(v.en)+'</p>'+
 '<button type="button" data-verb="speak" data-russian="'+esc(v.example)+'" class="vb-hear">🔊 Hear example</button>'+
 '<p class="vb-example" lang="ru">'+esc(v.example)+'</p></section>'+
 '<section class="vb-list"><h2>Present tense: who does the action?</h2><div class="vb-scroll"><table><thead><tr><th>Person</th><th>Russian form</th><th>Hear</th></tr></thead><tbody>'+
 SUBJECTS.map(p=>'<tr><td>'+esc(p.en)+' <span lang="ru">('+p.ru+')</span></td>'+
  '<td lang="ru">'+esc(v.now[p.index])+'</td><td><button type="button" data-verb="speak" data-russian="'+esc(p.ru+" "+v.now[p.index])+'">🔊</button></td></tr>').join("")+
 '</tbody></table></div></section>'+
 '<section class="vb-list"><h2>Past tense: gender and number</h2>'+
 '<p>Past tense forms depend on grammatical gender (singular) or plural number, not grammatical person.</p>'+
 '<div class="vb-scroll"><table><thead><tr><th>Subject</th><th>Russian form</th><th>Hear</th></tr></thead><tbody>'+
 PAST_SUBJECTS.map(p=>'<tr><td>'+esc(p.en)+' <span lang="ru">('+p.ru+')</span></td>'+
  '<td lang="ru">'+esc(v.past[p.index])+'</td><td><button type="button" data-verb="speak" data-russian="'+esc(p.ru+" "+v.past[p.index])+'">🔊</button></td></tr>').join("")+
 '</tbody></table></div></section>'+
 '<a href="#academy/mix/'+v.stage+'" class="vb-primary">Test yourself in Variety Lab ↗</a>'+
 '<p class="vb-note">Conjugation tables are references. Completing a quiz does not establish spontaneous spoken competence.</p>';
}
export function verbHtml(route){
 return route.startsWith("academy/verbs/")?detail(route.split("/")[2]):menu();
}
export function verbAction(btn,api){
 if(btn.dataset.verb==="speak")api.speak(btn.dataset.russian||"");
}
