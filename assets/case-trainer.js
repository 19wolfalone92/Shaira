import {CASES,NOUNS,CASE_ITEMS,formOf,formKey} from "./declension-tables.js";

export const CASE_STORE="shaira-case-practice-v1";
export const CASE_SESSION_LENGTH=10;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const normalise=s=>String(s??"").normalize("NFC").toLocaleLowerCase("ru-RU").replace(/[«»"„”“!?.,:;\s]+/gu," ").trim();
const obj=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
const read=(storage=globalThis.localStorage)=>{try{
 const x=obj(JSON.parse(storage.getItem(CASE_STORE)||"{}"));
 return {items:obj(x.items),sessions:Array.isArray(x.sessions)?x.sessions:[]};
}catch{return{items:{},sessions:[]};}};
export const caseStatistics=(storage=globalThis.localStorage)=>{
 const data=read(storage);
 return {total:CASE_ITEMS.length,studied:CASE_ITEMS.filter(x=>Number(data.items[x.id]?.seen)>0).length,
   lastScore:Number(data.sessions.at(-1)?.score)||0,passed:data.sessions.filter(x=>x.passed).length,
   last:Number(data.sessions.at(-1)?.last)||0};
};
const save=(data,storage=globalThis.localStorage)=>{try{storage.setItem(CASE_STORE,JSON.stringify(data));return true;}catch{return false;}};
function randomize(items){
 const copy=items.slice();
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy;
}
export function selectCaseQuestions(storage=globalThis.localStorage){
 const data=read(storage),picked=[],used=new Set();
 const leastSeen=(items)=>randomize(items).sort((a,b)=>(Number(data.items[a.id]?.seen)||0)-(Number(data.items[b.id]?.seen)||0));
 for(const c of CASES){
   const candidates=leastSeen(CASE_ITEMS.filter(x=>x.caseId===c.id&&
    !picked.some(old=>old.noun.id===x.noun.id)));
   if(candidates.length){picked.push(candidates[0]);used.add(candidates[0].id);}
 }
 const ordered=leastSeen(CASE_ITEMS.filter(x=>!used.has(x.id)));
 for(const item of ordered){
   if(picked.length>=CASE_SESSION_LENGTH)break;
   if(picked.some(x=>x.noun.id===item.noun.id))continue;
   picked.push(item);
 }
 return randomize(picked);
}
export function recordCaseQuiz(questions,answers,storage=globalThis.localStorage,now=Date.now()){
 if(!Array.isArray(questions)||questions.length!==CASE_SESSION_LENGTH||
   !Array.isArray(answers)||answers.length!==CASE_SESSION_LENGTH||
   !questions.every(x=>CASE_ITEMS.some(q=>q.id===x.id)))return null;
 const data=read(storage),outcomes=questions.map((q,i)=>({
   item:q,entered:String(answers[i]??""),correct:normalise(answers[i])===normalise(q.answer)
 }));
 for(const x of outcomes){
   const record=obj(data.items[x.item.id]);
   data.items[x.item.id]={
    seen:Math.min(100000,(Number(record.seen)||0)+1),
    correct:Math.min(100000,(Number(record.correct)||0)+Number(x.correct)),
    last:now
   };
 }
 const score=outcomes.filter(x=>x.correct).length,passed=score>=8;
 data.sessions.push({score,passed,last:now});
 data.sessions=data.sessions.slice(-100);
 return {score,passed,outcomes,saved:save(data,storage)};
}
const TXT={
 en:{
  back:"Back to Academy",title:"Russian case trainer",intro:"Noun endings change with grammatical role. Learn the six cases, compare singular and plural forms, and practise without copying the table.",
  total:"individual noun forms",known:"forms practised",passed:"practice sessions passed",notCertified:"Case practice checks chosen forms; it is not a CEFR level or proof of spontaneous language use.",
  explore:"Study the noun tables",practice:"Practise 10 endings",new:"Start a new set",review:"Review noun forms",table:"Singular and plural forms",guide:"Learn by role, not just by memorising endings.",
  noun:"Noun",number:"Number",singular:"singular",plural:"plural",case:"Case",meaning:"Meaning",
  question:"Write the correct case form",type:"Type in Russian",check:"Check this form",next:"Next form",
  why:"Grammar clue",answer:"Correct form",right:"Correct",wrong:"Not yet",progress:"Question",score:"Session score",
  success:"Case practice passed",retry:"Review and try another set",mistakes:"Review your answers",last:"Last practice",
  keyboard:"Russian on-screen keyboard",note:"Stress is not consistently written in Russian. Type the standard word form with correct letters; ё and е are distinct.",
  prompt:"Give the {case} {number} of «{noun}» ({meaning}).",result:"This drill checks inflections only; use the forms in meaningful conversations and writing."
 },
 tl:{
  back:"Bumalik sa Akademya",title:"Pagsasanay sa mga kaso sa Ruso",intro:"Nagbabago ang hulihan ng pangngalan ayon sa papel nito. Aralin ang anim na kaso, isahan at maramihan, at magsanay nang hindi nangongopya.",
  total:"anyo ng pangngalan",known:"anyong nasanay",passed:"napasa na sesyon",notCertified:"Sinusuri ang ilang anyo, hindi opisyal na CEFR o kusang paggamit ng wika.",
  explore:"Aralin ang mga talahanayan",practice:"Magsanay ng 10 hulihan",new:"Magsimula ng bagong set",review:"Balikan ang anyo",table:"Isahan at maramihang anyo",guide:"Unawain ang papel ng kaso, hindi hulihan lamang.",
  noun:"Pangngalan",number:"Bilang",singular:"isahan",plural:"maramihan",case:"Kaso",meaning:"Kahulugan",
  question:"Isulat ang tamang anyo ng kaso",type:"Sumulat sa Ruso",check:"Suriin ang anyo",next:"Susunod na anyo",
  why:"Pahiwatig sa gramatika",answer:"Tamang anyo",right:"Tama",wrong:"Hindi pa",progress:"Tanong",score:"Puntos",
  success:"Napasa ang pagsasanay",retry:"Balikan at subukan ang bagong set",mistakes:"Balikan ang sagot",last:"Huling pagsasanay",
  keyboard:"Keyboard sa Ruso",note:"Hindi laging nakasulat ang diin sa Ruso. Gamitin ang tamang titik; magkaiba ang ё at е.",
  prompt:"Isulat ang {case} {number} ng «{noun}» ({meaning}).",result:"Hulihan lamang ang sinusuri; gamitin ang mga anyo sa tunay na usapan at pagsulat."
 }
};
const keys=["ё й ц у к е н г ш щ з х ъ","ф ы в а п р о л д ж э","я ч с м и т ь б ю"];
let session=null;
const keyBoard=l=>'<details class="cs-keyboard"><summary>⌨ '+TXT[l].keyboard+'</summary>'+
 keys.map(row=>'<div>'+row.split(" ").map(ch=>'<button type="button" data-case="key" data-char="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+
 '<div><button type="button" data-case="key" data-char=" " class="cs-space">Space</button><button type="button" data-case="delete">⌫</button></div></details>';
function main(l){
 const t=TXT[l],stats=caseStatistics();
 return '<a class="cs-back" href="#academy">← '+t.back+'</a>'+
 '<section class="cs-hero"><span>SHAIRA · RUSSIAN MORPHOLOGY</span><h1>'+t.title+'</h1><p>'+t.intro+'</p>'+
 '<div class="cs-metrics"><div><strong>'+stats.total+'</strong><small>'+t.total+'</small></div>'+
 '<div><strong>'+stats.studied+'</strong><small>'+t.known+'</small></div>'+
 '<div><strong>'+stats.passed+'</strong><small>'+t.passed+'</small></div></div>'+
 '<a class="cs-primary" href="#academy/cases/quiz">'+t.practice+' →</a><p class="cs-muted">'+t.note+'</p></section>'+
 '<section class="cs-info"><h2>'+t.explore+'</h2><p>'+t.guide+'</p>'+
 '<div class="cs-cases">'+CASES.map((c,i)=>'<div><b>'+String(i+1)+'</b><strong>'+esc(c[l])+'</strong>'+
  '<small>'+esc(c.purpose[l])+'</small><p>'+esc(c.cue[l])+'</p></div>').join("")+'</div></section>'+
 '<section class="cs-info"><h2>'+t.review+'</h2><div class="cs-noun-grid">'+NOUNS.map(noun=>
 '<a href="#academy/cases/noun/'+noun.id+'"><strong lang="ru">'+esc(noun.forms.sg[0])+'</strong>'+
 '<small>'+esc(noun[l])+' · '+noun.gender.toUpperCase()+'</small><span>›</span></a>').join("")+'</div></section>'+
 '<p class="cs-muted">'+t.notCertified+'</p>';
}
function nounView(id,l){
 const noun=NOUNS.find(x=>x.id===id);if(!noun)return main(l);
 const t=TXT[l];
 return '<a href="#academy/cases" class="cs-back">← '+t.back+'</a>'+
 '<section class="cs-info"><span>SHAIRA · '+t.noun+'</span><h1 lang="ru">'+esc(noun.forms.sg[0])+'</h1>'+
 '<p>'+esc(noun[l])+' · '+noun.gender.toUpperCase()+' · '+(noun.animate?"animate":"inanimate")+'</p>'+
 '<h2>'+t.table+'</h2><table class="cs-table"><thead><tr><th>'+t.case+'</th><th>'+t.singular+'</th><th>'+t.plural+'</th></tr></thead><tbody>'+
 CASES.map((c,i)=>'<tr><td>'+esc(c[l])+'</td><td lang="ru">'+esc(noun.forms.sg[i])+'</td><td lang="ru">'+esc(noun.forms.pl[i])+'</td></tr>').join("")+
 '</tbody></table></section>'+
 '<a href="#academy/cases/quiz" class="cs-primary">'+t.practice+' →</a><p class="cs-muted">'+t.note+'</p>';
}
function setupQuiz(){
 session={items:selectCaseQuestions(),answers:[],index:0,feedback:null,result:null,typed:""};
}
function quiz(l){
 const t=TXT[l];if(!session)setupQuiz();
 const s=session;
 const back='<a class="cs-back" href="#academy/cases">← '+t.back+'</a>';
 if(s.result)return back+'<section class="cs-result"><span>'+(s.result.passed?"✓":"↻")+'</span>'+
  '<h1>'+t.score+': '+s.result.score+'/'+CASE_SESSION_LENGTH+'</h1><h2>'+(s.result.passed?t.success:t.retry)+'</h2>'+
  '<div class="cs-corrections">'+s.result.outcomes.map((x,i)=>
    '<details '+(!x.correct?"open":"")+'><summary>'+(x.correct?"✓":"○")+' '+(i+1)+'. '+esc(x.item.noun.forms.sg[0])+' · '+
    esc(CASES.find(c=>c.id===x.item.caseId)[l])+'</summary><p>'+t.answer+': <b lang="ru">'+esc(x.item.answer)+'</b></p>'+
    '<p>'+t.why+': '+esc(CASES.find(c=>c.id===x.item.caseId).purpose[l])+'</p></details>').join("")+'</div>'+
  '<button class="cs-primary" data-case="restart">'+t.new+'</button><p class="cs-muted">'+t.result+'</p></section>';
 const question=s.items[s.index],caseInfo=CASES.find(c=>c.id===question.caseId);
 const prompt=t.prompt.replace("{case}",caseInfo[l]).replace("{number}",question.number==="sg"?t.singular:t.plural)
  .replace("{noun}",question.noun.forms.sg[0]).replace("{meaning}",question.noun[l]);
 return back+'<section class="cs-info"><div class="cs-quiz-top"><span>'+t.progress+' '+(s.index+1)+' / '+CASE_SESSION_LENGTH+'</span>'+
 '<span>'+t.case+': '+caseInfo[l]+'</span></div><div class="cs-meter"><i style="width:'+Math.round(100*s.index/CASE_SESSION_LENGTH)+'%"></i></div>'+
 '<h1>'+t.question+'</h1><p>'+esc(prompt)+'</p><div class="cs-help"><b>'+t.why+':</b> '+esc(caseInfo.purpose[l])+'</div>'+
 (s.feedback?'<div class="cs-feedback '+(s.feedback.correct?"good":"wrong")+'">'+(s.feedback.correct?t.right:t.wrong)+
   '<p>'+t.answer+': <strong lang="ru">'+esc(question.answer)+'</strong></p>'+
   '<button type="button" class="cs-primary" data-case="next">'+t.next+'</button></div>':
 '<form id="cs-form"><label for="cs-answer">'+t.type+'</label><input id="cs-answer" lang="ru" autocomplete="off" spellcheck="false" autocorrect="off" required value="'+esc(s.typed)+'" />'+
 '<button type="submit" class="cs-primary">'+t.check+'</button></form>'+keyBoard(l))+
 '</section>';
}
export function caseHtml(route,l="en"){
 if(!TXT[l])l="en";
 if(route==="academy/cases/quiz")return quiz(l);
 if(route.startsWith("academy/cases/noun/"))return nounView(route.split("/")[3],l);
 return main(l);
}
export function caseAction(btn,api){
 const action=btn.dataset.case,route=api.route();
 if(action==="restart"){setupQuiz();api.render();return;}
 if(action==="key"||action==="delete"){
   if(!session||session.feedback)return;
   const input=document.getElementById("cs-answer");if(!input)return;
   const a=input.selectionStart??input.value.length,z=input.selectionEnd??a;
   if(action==="key")input.setRangeText(btn.dataset.char||"",a,z,"end");
   else if(a!==z)input.setRangeText("",a,z,"end");
   else if(a>0)input.setRangeText("",a-1,a,"end");
   session.typed=input.value;input.focus();return;
 }
 if(action==="next"&&session?.feedback){
   session.answers.push(session.feedback.entered);
   session.index++;session.typed="";session.feedback=null;
   if(session.index>=CASE_SESSION_LENGTH)session.result=recordCaseQuiz(session.items,session.answers);
   api.render();
 }
}
export function caseSubmit(event,api){
 if(event.target.id!=="cs-form")return false;
 event.preventDefault();
 if(!session||session.feedback)return true;
 const input=document.getElementById("cs-answer");if(!input)return true;
 const question=session.items[session.index],entered=input.value;
 session.feedback={entered,correct:normalise(entered)===normalise(question.answer)};
 api.render();return true;
}
