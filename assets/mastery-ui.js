import {stages,units} from "./academy-data.js";
import {studioLessons,studioForUnit} from "./studio-lessons.js";
import {stageCheckpoints,checkpointForStage} from "./stage-checkpoints.js";
import {loadMastery,gradeStudio,gradeCheckpoint,gradeStatus,normaliseAnswer} from "./mastery-engine.js";

const M={
 en:{
  back:"Back to Russian Academy",title:"Structured Russian course",intro:"Learn the pattern, see Russian in context, practise without copying, and review earlier topics. The stages are study targets, not certificates.",
  introDay:"Start with the alphabet. Each chapter builds on earlier ideas; a level review comes after its study sequence.",
  count:"skill chapters",review:"Independent stage review",reviews:"Stage reviews",note:"This is practice-based feedback. It does not measure unprepared listening, spontaneous conversation or full B2 competence.",
  start:"Study the chapter",finished:"Passed practice check",notYet:"Not yet completed",examples:"Russian in context",common:"Common mistake to avoid",
  steps:"Check your understanding",of:"of",answer:"Choose one answer",spell:"Type the Russian sentence for this meaning",
  enter:"Type in Cyrillic",next:"Next",confirm:"Check my answer",correct:"Correct",wrong:"Not yet",explain:"Why?",
  repeat:"Practice again",model:"Model answer",score:"Your practice result",threshold:"Complete all three checks correctly to record chapter practice.",
  success:"Chapter practice passed",failure:"Try the difficult parts again",goBack:"Return to chapters",
  examTitle:"Stage review",examInfo:"Ten previously unseen review questions: grammar, reading and Russian writing. This is a learning check, not an official CEFR exam.",
  read:"Read the passage before answering",prompt:"Choose the best response",noFeedback:"Answers will be explained at the end of the review.",passed:"Stage review checkpoint passed",
  notPassed:"Study the mistakes and try again",examConditions:"To pass: at least 8/10 overall, including at least one correct written Russian answer and one correct comprehension question.",
  examWriting:"Write your Russian answer",examCount:"correct answers",typed:"written answers",reading:"reading answers",change:"Return to the chapter list",
  field:"Your written response",keyboard:"On-screen Russian keyboard",retry:"Retake this stage review",listen:"Listen to Russian",
  saved:"Stored on this device",notSaved:"The browser could not save progress. Export your backup from Settings after storage is restored.",
  skillNote:"A passed chapter means those three specific questions were answered, not that the whole subject is mastered.",
  formHelp:"Enter a complete Russian sentence or form; punctuation and case are checked only against listed answers.",
  unlock:"Study earlier topics before advanced content",finish:"Finish review",nextChapter:"Next chapter",
  teacher:"Adult learning rule"
 },
 tl:{
  back:"Bumalik sa Akademya ng Ruso",title:"Maayos na kurso sa Ruso",intro:"Aralin ang tuntunin, halimbawa at pagsasanay. Balikan ang mga dating paksa. Mga layuning antas ito, hindi sertipiko.",
  introDay:"Magsimula sa alpabeto. May batayan ang bawat paksa sa nauna at may pagsusuri sa dulo ng antas.",
  count:"paksa sa pagsasanay",review:"Pagsusuri sa antas",reviews:"Mga pagsusuri sa antas",note:"Pagsasanay lang ang resulta. Hindi nito sinusukat ang di-inaasahang pakikinig, kusang pakikipag-usap o buong B2.",
  start:"Aralin ang paksa",finished:"Pumasa sa pagsasanay",notYet:"Hindi pa natatapos",examples:"Ruso sa konteksto",common:"Karaniwang pagkakamali",
  steps:"Suriin ang pag-unawa",of:"sa",answer:"Pumili ng sagot",spell:"Isulat sa Ruso ang kahulugang ito",
  enter:"Isulat sa Cyrillic",next:"Susunod",confirm:"Suriin ang sagot",correct:"Tama",wrong:"Hindi pa",explain:"Bakit?",
  repeat:"Magsanay muli",model:"Halimbawang sagot",score:"Resulta ng pagsasanay",threshold:"Sagutin nang tama ang tatlong tanong para maitala ang aralin.",
  success:"Natapos ang pagsasanay",failure:"Balikan ang mahihirap na bahagi",goBack:"Bumalik sa mga paksa",
  examTitle:"Pagsusuri sa antas",examInfo:"Sampung bagong tanong sa gramatika, pagbasa at pagsulat. Hindi opisyal na CEFR na eksamen.",
  read:"Basahin muna ang teksto",prompt:"Piliin ang angkop na sagot",noFeedback:"May paliwanag ng sagot pagkatapos ng pagsusuri.",passed:"Pumasa sa pagsusuri sa antas",
  notPassed:"Balikan ang pagkakamali at subukan uli",examConditions:"Para pumasa: 8/10, may tamang sagot sa pagsulat at pag-unawa sa binasa.",
  examWriting:"Isulat ang sagot sa Ruso",examCount:"tamang sagot",typed:"nakasulat na sagot",reading:"tamang sagot sa pagbasa",change:"Bumalik sa listahan",
  field:"Iyong sagot sa Ruso",keyboard:"Keyboard sa Ruso",retry:"Subukan muli ang pagsusuri",listen:"Pakinggan ang Ruso",
  saved:"Na-save sa device",notSaved:"Hindi ma-save sa browser. Gumawa ng backup kapag naayos ang storage.",
  skillNote:"Ang pagpasa sa tatlong tanong ay hindi awtomatikong mastery ng buong paksa.",
  formHelp:"Isulat ang buong pangungusap o anyo sa Ruso; mga nakatalang sagot lamang ang sinusuri.",
  unlock:"Aralin muna ang mas madaling paksa",finish:"Tapusin ang pagsusuri",nextChapter:"Susunod na paksa",
  teacher:"Tuntunin sa pag-aaral ng matanda"
 }
};
const tr=(x,l)=>typeof x==="string"?x:x?.[l]||x?.en||"";
const e=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const lin=(route,title,css="ms-link")=>'<a class="'+css+'" href="#'+e(route)+'">'+e(title)+'</a>';
const ord=a=>{let x=[...a];for(let i=x.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
const isValid=stage=>stages.some(x=>x.id===stage);
let active=null;
function newSession(route,lang,kind,id){
 const resource=kind==="studio"?studioForUnit(id):checkpointForStage(id);
 const questions=kind==="studio"?[...resource.checks,{type:"type",prompt:{en:resource.examples[1].en,tl:resource.examples[1].tl},answer:resource.examples[1].ru}]:resource.questions;
 const choices=questions.map(q=>q.type==="type"?null:ord(q.choices));
 return {route,lang,kind,id,questions,choices,answers:[],index:0,selected:null,feedback:null,result:null};
}
function state(route,lang,kind,id){
 if(active?.route!==route||active?.lang!==lang||active?.kind!==kind)active=newSession(route,lang,kind,id);
 return active;
}
export function masteryMenu(lang="en"){
 const m=M[lang==="tl"?"tl":"en"],records=loadMastery(),stats=gradeStatus();
 return lin("academy","← "+m.back)+
 '<section class="ms-heading"><span>SHAIRA · COURSE MAP</span><h1>'+m.title+'</h1><p>'+m.intro+'</p>'+
 '<p class="ms-message">'+m.introDay+'</p>'+
 '<div class="ms-overview-score">'+stats.studiosCompleted+'/'+stats.studiosTotal+' '+m.count+' · '+
 stats.stageReviews.filter(x=>x.passed).length+'/5 '+m.reviews+'</div></section>'+
 stages.map(level=>{
   const chapterList=units.filter(u=>u.stage===level.id);
   const completed=chapterList.filter(u=>records.studios[u.id]?.passed).length;
   const c=records.checkpoints[level.id];
   return '<section class="ms-stage"><div class="ms-stage-top"><div><span>'+level.icon+' '+level.label+'</span><strong>'+e(tr(level,lang))+'</strong>'+
   '<small>'+completed+'/'+chapterList.length+' '+m.finished+'</small></div>'+
   lin("academy/checkpoint/"+level.id,m.review+' '+(c?.passed?"✓":"→"),"ms-checklink")+'</div>'+
   '<div class="ms-chapters">'+chapterList.map((u,i)=>
    '<a href="#academy/mastery/'+u.id+'"><span class="ms-chapter-index">'+String(i+1).padStart(2,"0")+'</span>'+
    '<div><strong>'+e(tr(u.title,lang))+'</strong><small>'+e(tr(u.rule,lang).slice(0,115))+'…</small></div>'+
    '<b>'+(records.studios[u.id]?.passed?"✓":"›")+'</b></a>').join("")+'</div></section>';
 }).join("")+'<p class="ms-disclaimer">'+m.note+'</p>';
}
function introStudio(u,lesson,l,m){
 return lin("academy/mastery","← "+m.goBack)+
 '<div class="ms-heading"><span>'+u.stage.toUpperCase()+' · SHAIRA STUDIO</span><h1>'+e(tr(u.title,l))+'</h1>'+
 '<p>'+e(tr(lesson.rule,l))+'</p></div>'+
 '<section class="ms-info"><h2>'+m.examples+'</h2><div class="ms-examples">'+lesson.examples.map(example=>
   '<div><button type="button" data-mastery="audio" data-text="'+e(example.ru)+'">🔊</button>'+
   '<strong lang="ru">'+e(example.ru)+'</strong><p>'+e(tr(example,l))+'</p></div>').join("")+'</div></section>'+
 '<div class="ms-warning"><b>'+m.common+'</b><p>'+e(tr(lesson.tip,l))+'</p></div>';
}
const russianKeys=["ё й ц у к е н г ш щ з х ъ","ф ы в а п р о л д ж э","я ч с м и т ь б ю"];
function keyboard(m){
 return '<details class="ms-keyboard"><summary>⌨ '+m.keyboard+'</summary>'+
 russianKeys.map(row=>'<div>'+row.split(" ").map(ch=>
   '<button type="button" data-mastery="key" data-char="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+
 '<div><button type="button" data-mastery="key" data-char=" " class="ms-key-space">Space</button>'+
 '<button type="button" data-mastery="backspace">⌫</button></div></details>';
}
function question(s,l,m){
 const q=s.questions[s.index],isType=q.type==="type";
 const prompt=typeof q.prompt==="string"?q.prompt:tr(q.prompt,l);
 const choices=s.choices[s.index];
 return '<section class="ms-quiz"><div class="ms-quiz-top"><span>'+m.steps+'</span><b>'+String(s.index+1)+' / '+s.questions.length+'</b></div>'+
 '<div class="ms-meter"><i style="width:'+Math.round(100*s.index/s.questions.length)+'%"></i></div>'+
 '<h2>'+e(prompt)+'</h2>'+
 (isType?'<form id="ms-answer-form"><label for="ms-answer">'+m.field+'</label>'+
   '<input id="ms-answer" name="answer" lang="ru" autocomplete="off" autocorrect="off" spellcheck="false" required placeholder="'+m.enter+'" value="'+e(s.selected??"")+'" '+(s.feedback?"disabled":"")+'/>'+
   '<p class="ms-muted">'+m.formHelp+'</p>'+(s.feedback?"":'<button type="submit" class="ms-primary">'+m.confirm+'</button>'+keyboard(m))+'</form>':
   '<div class="ms-options">'+choices.map((v,i)=>
     '<button type="button" data-mastery="choose" data-choice="'+i+'" '+(s.kind==="studio"&&s.feedback?"disabled":"")+
     ' class="'+(s.kind==="studio"&&s.feedback?(v===q.answer?"ms-good":s.selected===v?"ms-bad":""):"")+'">'+e(v)+'</button>').join("")+'</div>')+
 (s.kind==="studio"&&s.feedback?'<section class="ms-feedback '+(s.feedback.correct?"ms-feedback-good":"ms-feedback-bad")+'" role="status">'+
   '<strong>'+(s.feedback.correct?m.correct:m.wrong)+'</strong><p>'+m.model+': <span lang="ru">'+e(q.answer)+'</span></p>'+
   '<p>'+e(tr(q.reason||{en:"Read the model and repeat with your own example.",tl:"Basahin ang halimbawa at ulitin sa sariling pangungusap."},l))+'</p>'+
   '<button data-mastery="next" class="ms-primary">'+m.next+'</button></section>':
 (s.kind==="checkpoint"?'<p class="ms-muted">'+m.noFeedback+'</p>':""))+'</section>';
}
function scorePage(s,l,m){
 const outcome=s.result;const items=outcome.results;const nextIdx=studioLessons.findIndex(x=>x.id===s.id)+1;
 const next=studioLessons[nextIdx];
 return '<section class="ms-result"><span>'+(outcome.passed?"✓":"↻")+'</span>'+
 '<h2>'+m.score+': '+outcome.score+'/'+items.length+'</h2>'+
 '<h3>'+(outcome.passed?m.success:m.failure)+'</h3>'+
 (s.kind==="studio"?'<p>'+m.skillNote+'</p>':
  '<p>'+m.examConditions+'</p><p>'+outcome.correctTyped+'/2 '+m.typed+' · '+outcome.correctReading+'/2 '+m.reading+'</p>')+
 '<p class="ms-muted">'+(outcome.saved?m.saved:m.notSaved)+'</p>'+
 '<div class="ms-corrections">'+items.map((a,i)=>
   '<details '+(!a.correct?"open":"")+'><summary><span>'+(a.correct?"✓":"○")+'</span> '+String(i+1)+'. '+e(typeof a.question.prompt==="string"?a.question.prompt:tr(a.question.prompt,l))+'</summary>'+
   '<p>'+m.model+': <strong lang="ru">'+e(a.question.answer)+'</strong></p>'+
   '<p>'+e(tr(a.question.explanation||a.question.reason,l))+'</p></details>').join("")+'</div>'+
 '<button class="ms-primary" type="button" data-mastery="retry">'+m.repeat+'</button>'+
 (next&&s.kind==="studio"?lin("academy/mastery/"+next.id,m.nextChapter+' →',"ms-out-link"):"")+
 lin(s.kind==="studio"?"academy/mastery":"academy/mastery",m.change,"ms-out-link")+'</section>';
}
export function masteryHtml(route,l="en"){
 if(!M[l])l="en";const m=M[l];
 if(route==="academy/mastery")return masteryMenu(l);
 if(route.startsWith("academy/mastery/")){
   const id=route.split("/")[2],lesson=studioForUnit(id),u=units.find(x=>x.id===id);
   if(!lesson||!u)return masteryMenu(l);
   const s=state(route,l,"studio",id);
   return introStudio(u,lesson,l,m)+(s.result?scorePage(s,l,m):question(s,l,m))+
     '<p class="ms-disclaimer">'+m.threshold+'</p>';
 }
 if(route.startsWith("academy/checkpoint/")){
   const stage=route.split("/")[2],p=checkpointForStage(stage);
   if(!p||!isValid(stage))return masteryMenu(l);
   const s=state(route,l,"checkpoint",stage);
   return lin("academy/mastery","← "+m.change)+
     '<div class="ms-heading"><span>'+stage.toUpperCase()+' · SHAIRA</span><h1>'+m.examTitle+' · '+stage.toUpperCase()+'</h1>'+
     '<p>'+m.examInfo+'</p></div>'+
     '<section class="ms-info"><h2>'+m.read+'</h2><p class="ms-passage" lang="ru">'+e(p.passage)+'</p>'+
     '<button type="button" class="ms-listen" data-mastery="audio" data-text="'+e(p.passage)+'">🔊 '+m.listen+'</button></section>'+
     (s.result?scorePage(s,l,m):question(s,l,m))+
     '<p class="ms-disclaimer">'+m.examConditions+' '+m.note+'</p>';
 }
 return masteryMenu(l);
}
function advance(s){
 s.answers.push(String(s.selected??""));
 s.index++;
 s.selected=null;s.feedback=null;
}
export function masteryAction(button,api){
 const action=button.dataset.mastery,route=api.route(),l=api.language()==="tl"?"tl":"en";
 if(action==="audio"){api.speak(button.dataset.text||"");return;}
 const kind=route.startsWith("academy/checkpoint/")?"checkpoint":"studio";
 const id=route.split("/")[2],target=kind==="studio"?studioForUnit(id):checkpointForStage(id);
 if(!target)return;
 const s=state(route,l,kind,id);
 if(action==="key"||action==="backspace"){
   if(s.feedback||s.result)return;
   const input=document.getElementById("ms-answer");if(!input)return;
   const a=input.selectionStart??input.value.length,z=input.selectionEnd??a;
   if(action==="key")input.setRangeText(button.dataset.char||"",a,z,"end");
   else if(a!==z)input.setRangeText("",a,z,"end");
   else if(a>0)input.setRangeText("",a-1,a,"end");
   s.selected=input.value;input.focus();return;
 }
 if(action==="retry"){active=null;api.render();return;}
 if(action==="choose"&&!s.result&&!s.feedback){
   const idx=Number(button.dataset.choice),q=s.questions[s.index];
   if(!Number.isInteger(idx)||idx<0||idx>=s.choices[s.index].length)return;
   s.selected=s.choices[s.index][idx];
   if(kind==="studio"){
     s.feedback={correct:normaliseAnswer(s.selected)===normaliseAnswer(q.answer)};
   }else{
     advance(s);
     if(s.index===s.questions.length)s.result=gradeCheckpoint(s.id,s.answers);
   }
   api.render();return;
 }
 if(action==="next"&&kind==="studio"&&s.feedback&&!s.result){
   advance(s);
   if(s.index===s.questions.length)s.result=gradeStudio(s.id,s.answers);
   api.render();return;
 }
}
export function masterySubmit(event,api){
 if(event.target.id!=="ms-answer-form")return false;
 event.preventDefault();
 const route=api.route(),l=api.language()==="tl"?"tl":"en";
 const kind=route.startsWith("academy/checkpoint/")?"checkpoint":"studio";
 const id=route.split("/")[2],s=state(route,l,kind,id);
 if(s.result||s.feedback||s.index>=s.questions.length)return true;
 const input=document.getElementById("ms-answer");if(!input)return true;
 s.selected=input.value;
 if(kind==="studio"){
   s.feedback={correct:normaliseAnswer(s.selected)===normaliseAnswer(s.questions[s.index].answer)};
 }else{
   advance(s);if(s.index===s.questions.length)s.result=gradeCheckpoint(s.id,s.answers);
 }
 api.render();return true;
}
