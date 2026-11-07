import {stages} from "./academy-data.js";
import {grammarDrills,drillsForStage} from "./grammar-drills.js";
import {readingLibrary,readingsForStage} from "./reading-library.js";
import {writingTasks,writingForStage,writingWordTargets} from "./writing-tasks.js";
import {grammarHandbook,handbookForStage} from "./grammar-handbook.js";
import {inspectRussianDraft} from "./writing-coach.js";

const KEY="shaira-labs-v1";
const TXT={
  en:{
    go:"Back to Academy",question:"Question",learn:"Independent practice",home:"Practice centre",intro:"Study a rule, try new examples, read authentic-style texts, then write your own answer. No rushing.",grammar:"Grammar trainer",reading:"Reading library",
    grammarDesc:"100 separate, explained questions in realistic Russian contexts.",readingDesc:"35 graded Russian texts, comprehension and independent writing.",
    choose:"Choose one answer",questions:"questions",next:"Next question",finish:"Practice summary",again:"Practise again",done:"Correct",wrong:"Learn from this answer",
    explanation:"Why?",answer:"Correct answer",best:"Best score",progress:"Your result",review:"Try more",mastered:"Practice checkpoint passed",notCertified:"This is a practice result, not a certified CEFR level.",
    first:"Choose a level",start:"Practise 10 questions",beginReading:"Open text",readText:"Read the text",showGlossary:"Key vocabulary",listen:"Listen to the text",
    translation:"Reading guide",toggle:"Show / hide guide",comprehension:"Check your understanding",writing:"Your writing",prompt:"Writing task",save:"Save draft",saved:"Saved on this device",draft:"Write in Russian here...",
    copy:"Copy useful words into your own sentences.",wordCount:"words",target:"Suggested length",note:"Your text is saved privately. The app counts words but does not assess grammar or ideas. Compare with the task and revise.",
    readingPassed:"Reading check completed",readingRepeat:"Some answers were missed. Re-read the passage and try again.",nextReading:"Back to reading library",
    correctCount:"Correct answers",unlocked:"Available now",content:"Lesson content",guide:"Learning goals",noAudio:"Audio is not available on this device. Read the text aloud.",
    tips:"Self-editing checklist",selfCheck:"Check tense, case endings, spelling, punctuation, structure and clarity.",continue:"Keep learning",
    beginner:"Read carefully: Russian is new",reviewText:"Read the passage again",startRead:"Check understanding",set:"Set",more:"More tasks at this level",
    lessonProgress:"Reading progress",introAdvice:"Suggested routine: 15 minutes of grammar, a short reading, 5 minutes of writing, plus due vocabulary.",
    saveError:"Could not save to this device.",practiceCount:"exercises",activity:"Activity",examples:"Target stages, not official certification.",
    audioLabel:"Play Russian text"
  },
  tl:{
    go:"Bumalik sa Akademya",question:"Tanong",learn:"Sariling pagsasanay",home:"Sentro ng pagsasanay",intro:"Aralin ang tuntunin, subukan ang halimbawa, basahin ang teksto, at sumulat ng sarili mong sagot. Walang pagmamadali.",grammar:"Pagsasanay sa gramatika",reading:"Aklatan sa pagbabasa",
    grammarDesc:"100 magkakaibang tanong na may paliwanag at makatotohanang konteksto.",readingDesc:"20 orihinal na teksto; pag-unawa at sariling pagsusulat.",
    choose:"Pumili ng isang sagot",questions:"tanong",next:"Susunod na tanong",finish:"Buod ng pagsasanay",again:"Magsanay muli",done:"Tama",wrong:"Matuto mula sa sagot",
    explanation:"Bakit?",answer:"Tamang sagot",best:"Pinakamataas na marka",progress:"Iyong resulta",review:"Subukan uli",mastered:"Natapos ang pagsasanay",notCertified:"Pagsasanay lamang ito, hindi sertipikasyon ng CEFR.",
    first:"Pumili ng antas",start:"Subukan ang 10 tanong",beginReading:"Buksan ang teksto",readText:"Basahin ang teksto",showGlossary:"Mahahalagang salita",listen:"Pakinggan ang teksto",
    translation:"Gabay sa pagbasa",toggle:"Ipakita / itago ang gabay",comprehension:"Suriin ang pag-unawa",writing:"Iyong pagsusulat",prompt:"Gawain sa pagsusulat",save:"I-save ang draft",saved:"Na-save sa device na ito",draft:"Sumulat sa Ruso...",
    copy:"Gumamit ng bagong salita sa sarili mong pangungusap.",wordCount:"salita",target:"Iminungkahing haba",note:"Pribadong naka-save ang sulat. Bilang ng salita lamang ang sinusuri, hindi ang gramatika o ideya.",
    readingPassed:"Natapos ang pagsusuri sa pagbasa",readingRepeat:"May maling sagot. Basahing muli at subukan ulit.",nextReading:"Bumalik sa aklatan",
    correctCount:"Tamang sagot",unlocked:"Magagamit na",content:"Nilalaman ng aralin",guide:"Layunin",noAudio:"Walang audio sa device. Basahin nang malakas.",
    tips:"Listahan sa pag-eedit",selfCheck:"Suriin ang panahunan, hulihan, baybay, bantas, istruktura at linaw.",continue:"Magpatuloy",
    beginner:"Magbasa nang dahan-dahan: bago ang Ruso",reviewText:"Basahin muli ang teksto",startRead:"Suriin ang pag-unawa",set:"Set",more:"Ibang gawain sa antas na ito",
    lessonProgress:"Pag-usad sa pagbasa",introAdvice:"Mungkahi: 15 minuto ng gramatika, maikling pagbasa at 5 minutong pagsulat, kasama ang pagbabalik-aral.",
    saveError:"Hindi ma-save sa device.",practiceCount:"pagsasanay",activity:"Gawain",examples:"Mga target na antas, hindi sertipikasyon.",
    audioLabel:"Pakinggan ang tekstong Ruso"
  }
};
const b=(en,tl,l)=>l==="tl"?tl:en;
const loc=(o,l)=>o?.[l]||o?.en||"";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const words=s=>String(s||"").trim().split(/\s+/).filter(Boolean).length;
const init=()=>({grammar:{},readings:{},drafts:{},draftUpdated:{}});
function load(){
  try{
    const data=JSON.parse(localStorage.getItem(KEY)||"{}");
    if(!data||typeof data!=="object"||Array.isArray(data))return init();
    return {grammar:data.grammar&&typeof data.grammar==="object"?data.grammar:{},
      readings:data.readings&&typeof data.readings==="object"?data.readings:{},
      drafts:data.drafts&&typeof data.drafts==="object"?data.drafts:{},draftUpdated:data.draftUpdated&&typeof data.draftUpdated==="object"?data.draftUpdated:{}};
  }catch{return init();}
}
const data=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));return true;}catch{return false;}}
const link=(route,text,style="lp-link")=>'<a class="'+style+'" href="#'+route+'">'+esc(text)+'</a>';
const back=l=>link("academy","← "+TXT[l].go);
const top=(cap,title,sub)=>'<div class="lp-heading"><span>'+esc(cap)+'</span><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div>';
const stageLabel=stage=>stages.find(s=>s.id===stage)?.label||"Pre-A1";
const listStages=(path,l)=>'<div class="lp-level-grid">'+stages.map(s=>{
 const done=path==="grammar"?data.grammar[s.id]?.best:readingsForStage(s.id).filter(x=>data.readings[x.id]?.passed).length;
 const total=path==="grammar"?10:readingsForStage(s.id).length;
 return '<a class="lp-level" href="#academy/'+path+'/'+s.id+'"><span>'+s.icon+'</span><strong>'+s.label+'</strong><small>'+esc(loc(s,l))+'</small><em>'+ (path==="grammar"?(done!==undefined?done+"/10":b("Not tried","Hindi pa nasubukan",l)):done+"/"+total+' '+TXT[l].activity)+'</em></a>';
 }).join("")+'</div>';
function overview(l){
  return back(l)+top("SHAIRA · STUDY",TXT[l].home,TXT[l].intro)+
  '<div class="lp-advice">'+esc(TXT[l].introAdvice)+'</div>'+
  '<div class="lp-paths"><a href="#academy/scenarios"><span>💬</span><div><strong>Interactive Russian roleplay</strong><p>15 adult situations with context-sensitive responses and branching dialogue outcomes.</p></div><b>›</b></a>'+
  '<a href="#academy/verbs"><span>Я</span><div><strong>Russian Verb Lab</strong><p>Learn 240 authentic conjugated forms and hear each verb pattern.</p></div><b>›</b></a>'+ 
  '<a href="#academy/mix"><span>✦</span><div><strong>Variety Lab</strong><p>13 different formats, adaptive practice and targeted review of mistakes.</p></div><b>›</b></a>'+
  '<a href="#academy/grammar"><span>✳</span><div><strong>'+TXT[l].grammar+'</strong><p>'+TXT[l].grammarDesc+'</p></div><b>›</b></a>'+
  '<a href="#academy/library"><span>▤</span><div><strong>'+TXT[l].reading+'</strong><p>'+TXT[l].readingDesc+'</p></div><b>›</b></a>'+
  '<a href="#academy/writing"><span>✎</span><div><strong>'+b("Writing portfolio","Portfolio ng pagsusulat",l)+'</strong><p>'+b("45 adult writing tasks, from simple notes to balanced essays.","30 gawain sa pagsusulat: mula mensahe hanggang sanaysay.",l)+'</p></div><b>›</b></a>'+  '<a href="#academy/cases"><span>Аа</span><div><strong>'+b("Russian case trainer","Pagsasanay sa mga kaso",l)+'</strong><p>'+b("288 singular/plural noun forms and independent endings practice.","288 anyo ng pangngalan at pagsasanay sa hulihan.",l)+'</p></div><b>›</b></a>'+
  '<a href="#academy/handbook"><span>А</span><div><strong>'+b("Grammar handbook","Manwal sa gramatika",l)+'</strong><p>'+b("30 illustrated grammar explanations, from Cyrillic to B2 prose.","30 paliwanag sa gramatika, mula Cyrillic hanggang B2.",l)+'</p></div><b>›</b></a></div>'+
  '<small class="lp-muted">'+TXT[l].examples+'</small>';
}
function grammarMenu(l){
  return link("academy/lab","← "+TXT[l].go)+top("Pre-A1 → B2",TXT[l].grammar,TXT[l].grammarDesc)+listStages("grammar",l);
}
let session=null;
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[j],a[i]]=[a[i],a[j]];}return a;}
function getSession(route,stage){
  if(session?.route===route)return session;
  const prior=data.grammar[stage]?.items||{};
  const bank=drillsForStage(stage);
  const questions=shuffle(bank).sort((a,b)=>(prior[a.id]?.seen||0)-(prior[b.id]?.seen||0)).slice(0,10).map(q=>({...q,options:shuffle(q.choices)}));
  session={route,stage,kind:"grammar",questions,index:0,correct:0,answered:false,selection:null,complete:false,missed:[],started:Date.now()};
  return session;
}
function grammarPage(stage,l){
  if(!stages.some(x=>x.id===stage))return grammarMenu(l);
  const route="academy/grammar/"+stage, s=getSession(route,stage),history=data.grammar[stage]||{};
  const title=TXT[l].grammar+" · "+stageLabel(stage);
  const nav=link("academy/grammar","← "+TXT[l].first)+top(stageLabel(stage),title,TXT[l].grammarDesc)+
    '<div class="lp-meter"><i style="width:'+Math.round(100*s.index/Math.max(1,s.questions.length))+'%"></i></div>';
  if(s.complete){
    const pct=Math.round(s.correct/s.questions.length*100);
    const passed=s.correct>=8;
    return nav+'<section class="lp-result"><span>'+(passed?"✓":"↻")+'</span><h2>'+TXT[l].finish+'</h2>'+
      '<p class="lp-score">'+s.correct+"/"+s.questions.length+' · '+pct+'%</p>'+
      '<p>'+TXT[l][passed?"mastered":"review"]+'. '+TXT[l].notCertified+'</p>'+
      (s.missed.length?'<details class="lp-review-mistakes"><summary>'+b("Review missed rules","Balikan ang mga nagkamali",l)+' ('+s.missed.length+')</summary>'+
      s.missed.map(q=>'<div><strong lang="ru">'+esc(q.instruction.en)+'</strong><p>'+esc(loc(q.explanation,l))+'</p></div>').join("")+'</details>':"")+
      '<button type="button" class="lp-primary" data-lab="restart-grammar">'+TXT[l].again+'</button>'+
      link("academy/grammar",TXT[l].more,"lp-action-link")+'</section>';
  }
  const q=s.questions[s.index];
  return nav+'<section class="lp-question"><div class="lp-meta"><b>'+TXT[l].question+" "+(s.index+1)+"/"+s.questions.length+'</b><small>'+stageLabel(stage)+'</small></div>'+
    '<h2>'+esc(loc(q.instruction,l))+'</h2><p>'+esc(loc(q.context,l))+'</p>'+
    '<div class="lp-options">'+q.options.map((v,i)=>
      '<button type="button" data-lab="answer-grammar" data-choice="'+i+'" '+(s.answered?"disabled":"")+' class="'+(s.answered&&v===q.answer?"lp-right":s.answered&&i===s.selection?"lp-wrong":"")+'">'+esc(v)+'</button>').join("")+'</div>'+
    (s.answered?'<div class="lp-explanation" role="status"><strong>'+(s.questions[s.index].options[s.selection]===q.answer?TXT[l].done:TXT[l].wrong)+'</strong>'+
      '<p>'+TXT[l].answer+': <span lang="ru">'+esc(q.answer)+'</span></p><p>'+esc(loc(q.explanation,l))+'</p>'+
      '<button type="button" data-lab="next-grammar" class="lp-primary">'+TXT[l].next+'</button></div>':"")+
    '</section>';
}
function libraryMenu(l){
 return link("academy/lab","← "+TXT[l].go)+top("Pre-A1 → B2",TXT[l].reading,TXT[l].readingDesc)+
  stages.map(stage=>{
   const books=readingsForStage(stage.id);
   return '<section class="lp-shelf"><div><strong>'+stage.icon+' '+stage.label+'</strong><small>'+books.filter(x=>data.readings[x.id]?.passed).length+'/'+books.length+' '+TXT[l].lessonProgress+'</small></div>'+
     books.map(p=>'<a href="#academy/library/'+p.id+'"><span>'+p.icon+'</span><div><strong>'+esc(loc(p.title,l))+'</strong><small>'+stageLabel(p.stage)+' · '+words(p.text)+' '+TXT[l].wordCount+'</small></div><b>'+(data.readings[p.id]?.passed?"✓":"›")+'</b></a>').join("")+
   '</section>';
  }).join("");
}
function readingPage(id,l){
 const p=readingLibrary.find(x=>x.id===id);if(!p)return libraryMenu(l);
 const route="academy/library/"+id;
 if(!session||session.route!==route)session={route,kind:"reading",id,translation:false,answered:[],selection:null,feedback:null,complete:false,options:p.questions.map(q=>shuffle(q.choices))};
 const s=session, saved=data.readings[id]||{};
 const q=p.questions[s.answered.length];
 const stage=stageLabel(p.stage);
 const nav=link("academy/library","← "+TXT[l].reading)+top(stage+" · "+p.icon,loc(p.title,l),loc(p.guide,l));
 let question="";
 if(!s.complete){
   question='<section class="lp-question"><div class="lp-meta">'+TXT[l].comprehension+' · '+(s.answered.length+1)+"/"+p.questions.length+'</div>'+
   '<h2>'+esc(loc(q.ask,l))+'</h2><div class="lp-options">'+s.options[s.answered.length].map((x,i)=>
     '<button type="button" data-lab="answer-read" data-choice="'+i+'" '+(s.feedback?"disabled":"")+
     ' class="'+(s.feedback&&x===q.answer?"lp-right":s.feedback&&i===s.selection?"lp-wrong":"")+'">'+esc(x)+'</button>').join("")+'</div>'+
   (s.feedback?'<div class="lp-explanation" role="status"><strong>'+(s.feedback.good?TXT[l].done:TXT[l].wrong)+'</strong><p>'+loc(q.explain,l)+'</p>'+
     '<button data-lab="next-read" class="lp-primary">'+TXT[l].next+'</button></div>':"")+'</section>';
 }else{
   const correct=s.answered.filter(x=>x).length,ok=correct===p.questions.length;
   question='<section class="lp-result"><h2>'+TXT[l].finish+' · '+correct+'/'+p.questions.length+'</h2><p>'+TXT[l][ok?"readingPassed":"readingRepeat"]+'</p>'+
   '<button class="lp-primary" data-lab="repeat-read">'+TXT[l].reviewText+'</button>'+link("academy/library",TXT[l].nextReading,"lp-action-link")+'</section>';
 }
 const writing='<section class="lp-writing"><h2>✍️ '+TXT[l].writing+'</h2><p>'+esc(loc(p.task,l))+'</p><div class="lp-writing-label">'+TXT[l].target+': '+({starter:"10–25",a1:"35–60",a2:"75–110",b1:"120–180",b2:"180–250"}[p.stage])+' '+TXT[l].wordCount+'</div>'+
 '<label for="lp-draft">'+TXT[l].prompt+'</label><textarea id="lp-draft" rows="8" lang="ru" spellcheck="true" placeholder="'+TXT[l].draft+'">'+esc(data.drafts[p.id]||"")+'</textarea>'+
 '<div class="lp-writing-actions"><span id="lp-wordcount">'+words(data.drafts[p.id]||"")+' '+TXT[l].wordCount+'</span><button type="button" class="lp-primary" data-lab="save-writing">'+TXT[l].save+'</button></div>'+
 '<div class="lp-writing-actions"><button type="button" class="lp-secondary" data-lab="review-writing">✦ Review with Writing Coach</button>'+
 '<button type="button" class="lp-secondary" data-lab="listen-draft">🔊 Hear my Russian draft</button></div>'+
 russianWriterKeyboard()+'<div id="lp-reading-writing-feedback" aria-live="polite"></div>'+
 '<p class="lp-muted">Pattern-based suggestions are not automatic correction or an exam grade.</p><details><summary>'+TXT[l].tips+'</summary><p>'+TXT[l].selfCheck+'</p></details></section>';
 const glossary='<section class="lp-gloss"><h2>'+TXT[l].showGlossary+'</h2><div>'+p.glossary.map(w=>
  '<div><strong lang="ru">'+esc(w.ru)+'</strong><span>'+esc(loc(w,l))+'</span></div>').join("")+'</div></section>';
 return nav+'<article class="lp-text"><div><h2>'+TXT[l].readText+'</h2><button type="button" data-lab="play-reading" class="lp-sound">🔊 '+TXT[l].listen+'</button></div>'+
    '<p lang="ru">'+esc(p.text).replace(/\n/g,"<br>")+'</p>'+
    '<button type="button" class="lp-toggle" data-lab="toggle-guide">'+TXT[l].toggle+'</button>'+
    (s.translation?'<div class="lp-reading-guide">'+TXT[l].translation+': '+esc(loc(p.guide,l))+'</div>':"")+
   '</article>'+glossary+question+writing;
}

function writingMenu(l){
 return link("academy/lab","← "+TXT[l].go)+
  top("✎ "+b("WRITE IN RUSSIAN","SUMULAT SA RUSO",l),b("Writing portfolio","Portfolio ng pagsusulat",l),
    b("45 guided writing assignments from short notes to structured B2 essays. Save, revise and compare models.","30 gawain mula unang pangungusap hanggang sanaysay sa B2. I-save, baguhin at ihambing ang modelo.",l))+
  stages.map(stage=>{
    const tasks=writingForStage(stage.id);
    const done=tasks.filter(t=>String(data.drafts["portfolio:"+t.id]||"").trim().length>0).length;
    return '<section class="lp-shelf"><div><strong>'+stage.icon+' '+stage.label+'</strong><small>'+done+'/'+tasks.length+'</small></div>'+
      tasks.map(t=>'<a href="#academy/writing/task/'+t.id+'"><span>✎</span><div><strong>'+esc(loc(t.title,l))+'</strong>'+
        '<small>'+esc(loc(t.brief,l))+'</small></div><b>'+((data.drafts["portfolio:"+t.id]||"").trim()?"✓":"›")+'</b></a>').join("")+
      '</section>';
  }).join("");
}
function getWritingEvaluation(text,task,l){
 const n=words(text),range=writingWordTargets[task.stage]||[10,50];
 const hasCyr=/[\u0400-\u052f]/u.test(text);
 const ends=/[.!?…]\s*$/u.test(text.trim());
 const paragraphCount=text.trim()?text.split(/\n\s*\n/).filter(x=>x.trim()).length:0;
 const connective=/\b(однако|поэтому|поскольку|следовательно|во-первых|во-вторых|хотя|несмотря|таким образом|с другой стороны)\b/iu.test(text);
 const checks=[
  {pass:hasCyr,label:b("Russian Cyrillic is used","May ginamit na Russian Cyrillic",l)},
  {pass:n>=range[0],label:b("Target length: at least ","Target na haba: hindi bababa sa ",l)+range[0]+" "+TXT[l].wordCount},
  {pass:ends,label:b("The text ends with punctuation","May bantas sa huling pangungusap",l)}
 ];
 if(["b1","b2"].includes(task.stage))
  checks.push({pass:connective,label:b("An argument connector appears","May pangdugtong sa pangangatwiran",l)});
 if(task.stage==="b2")
  checks.push({pass:paragraphCount>=2,label:b("At least two paragraphs","Hindi bababa sa dalawang talata",l)});
 return {count:n,checks,range};
}
function writingStudioPage(id,l){
 const task=writingTasks.find(t=>t.id===id);
 if(!task)return writingMenu(l);
 const content=data.drafts["portfolio:"+task.id]||"",ev=getWritingEvaluation(content,task,l);
 return link("academy/writing","← "+b("Writing portfolio","Portfolio ng pagsusulat",l))+
 top("✎ "+stageLabel(task.stage),loc(task.title,l),loc(task.brief,l))+
 '<section class="lp-text"><h2>'+b("An opening you can adapt","Halimbawang panimula na maaaring baguhin",l)+'</h2>'+
 '<p lang="ru" class="lp-sample-sentence">'+esc(task.model)+'</p>'+
 '<div class="lp-advice">'+esc(loc(task.check,l))+'</div></section>'+
 '<section class="lp-writing"><h2>'+b("Your own draft","Iyong sariling sulat",l)+'</h2>'+
 '<p>'+b("Write independently before comparing with the sample. There is no automatic language marking.","Sumulat nang mag-isa bago ihambing ang halimbawa. Walang awtomatikong pagsusuri sa gramatika.",l)+'</p>'+
 '<label for="lp-studio-draft">'+b("Your Russian text","Iyong tekstong Ruso",l)+'</label>'+
 '<textarea id="lp-studio-draft" lang="ru" spellcheck="true" rows="10" placeholder="'+TXT[l].draft+'">'+esc(content)+'</textarea>'+
 '<div class="lp-writing-actions"><span id="lp-studio-count">'+ev.count+' '+TXT[l].wordCount+'</span>'+
 '<button type="button" data-lab="save-studio" class="lp-primary">'+TXT[l].save+'</button></div>'+
 '<button type="button" class="lp-secondary" data-lab="review-studio">✦ Review with Writing Coach</button>'+
 '<button type="button" class="lp-secondary" data-lab="listen-draft">🔊 Hear my Russian draft</button>'+russianWriterKeyboard()+
 '<div id="lp-studio-feedback" aria-live="polite"></div>'+
 '<div class="lp-advice">The Writing Coach offers selected grammar-pattern hints and structural suggestions. It cannot grade meaning, fluency, style or CEFR level.</div></section>';
}
function writingFeedback(task,l,text){
 const r=inspectRussianDraft(text,task.stage);
 const items=r.findings.slice(0,15).map(f=>'<li><strong lang="ru">'+esc(f.found)+'</strong> → <b lang="ru">'+esc(f.suggestion)+'</b><p>'+esc(f.explanation)+'</p></li>').join("");
 return '<section class="lp-selfcheck"><h3>✦ English-guided Writing Coach</h3>'+
  '<p><strong>'+r.wordCount+'</strong> Russian words · '+r.sentences+' sentence fragments · '+r.paragraphs+' paragraphs · '+r.uniqueWords+' distinct Russian word forms</p>'+
  '<p><strong>Current learning focus:</strong> '+esc(r.focus)+'</p>'+
  '<ul>'+r.checks.map(c=>'<li><strong>'+(c.pass?"✓":"○")+'</strong> '+esc(c.label)+'</li>').join("")+'</ul>'+
  (r.findings.length?'<h4>Specific phrases worth checking ('+r.findings.length+')</h4><ul class="lp-coach-errors">'+items+'</ul>':
    '<p>No matching errors found in the limited pattern list. This does <strong>not</strong> mean the grammar is correct.</p>')+
  (r.suggestions.length?'<h4>Next revision steps</h4><ol class="lp-coach-suggestions">'+r.suggestions.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>':'')+
  '<p class="lp-coach-warning">'+esc(r.warning)+'</p>'+
  '<p>Ask a qualified Russian speaker to review meaning, word choice, aspect, cases and argument quality in longer work.</p></section>';
}
const russianWriterKeyboard=()=>'<details class="lp-writer-keyboard"><summary>⌨ On-screen Russian keyboard</summary>'+
 ['ё й ц у к е н г ш щ з х ъ','ф ы в а п р о л д ж э','я ч с м и т ь б ю'].map(row=>
 '<div>'+row.split(" ").map(k=>'<button type="button" data-lab="writer-key" data-character="'+k+'">'+k+'</button>').join("")+'</div>').join("")+
 '<div><button type="button" class="lp-space" data-lab="writer-key" data-character=" ">Space</button>'+
 '<button type="button" data-lab="writer-backspace">⌫</button></div></details>';
function handbookMenu(l){
 return link("academy/lab","← "+TXT[l].go)+
  top("АБВ · GRAMMAR",b("Russian grammar handbook","Manwal sa gramatikang Ruso",l),
  b("An offline reference for rules and examples. Read it, listen and then practise in the grammar trainer.","Gabay sa mga tuntunin at halimbawa na magagamit offline. Basahin, pakinggan at magsanay.",l))+
  stages.map(stage=>{
    const entries=handbookForStage(stage.id);
    return '<section class="lp-shelf"><div><strong>'+stage.icon+' '+stage.label+'</strong><small>'+entries.length+' '+b("topics","paksa",l)+'</small></div>'+
      entries.map(entry=>'<a href="#academy/handbook/'+entry.id+'"><span>А</span><div><strong>'+esc(loc(entry.title,l))+'</strong>'+
       '<small>'+esc(loc(entry.rule,l).slice(0,110))+'…</small></div><b>›</b></a>').join("")+'</section>';
  }).join("");
}
function handbookPage(id,l){
 const topic=grammarHandbook.find(x=>x.id===id);
 if(!topic)return handbookMenu(l);
 const index=grammarHandbook.indexOf(topic),next=grammarHandbook[index+1],prev=grammarHandbook[index-1];
 return link("academy/handbook","← "+b("Handbook","Manwal",l))+
   top(stageLabel(topic.stage),loc(topic.title,l),loc(topic.rule,l))+
   '<section class="lp-text"><h2>'+b("Examples in context","Mga halimbawa sa konteksto",l)+'</h2>'+
   '<div class="lp-handbook-examples">'+topic.examples.map(e=>
      '<div><button data-lab="play-example" data-text="'+esc(e.ru)+'" class="lp-sound" type="button" aria-label="'+TXT[l].listen+'">🔊</button>'+
      '<strong lang="ru">'+esc(e.ru)+'</strong><p>'+esc(loc(e,l))+'</p></div>').join("")+'</div></section>'+
   '<div class="lp-advice"><strong>'+b("Common pitfall","Karaniwang pagkakamali",l)+'</strong><p>'+esc(loc(topic.pitfall,l))+'</p></div>'+
   '<nav class="lp-handbook-nav">'+(prev?link("academy/handbook/"+prev.id,"← "+loc(prev.title,l),"lp-action-link"):'')+
     (next?link("academy/handbook/"+next.id,loc(next.title,l)+" →","lp-action-link"):'')+'</nav>'+
   link("academy/grammar/"+topic.stage,b("Practise this level","Magsanay sa antas na ito",l),"lp-action-link");
}
export function labHtml(route,l="en"){
 if(!TXT[l])l="en";
 if(route==="academy/lab")return overview(l);
 if(route==="academy/handbook")return handbookMenu(l);
 if(route.startsWith("academy/handbook/"))return handbookPage(route.split("/")[2],l);
 if(route==="academy/grammar")return grammarMenu(l);
 if(route.startsWith("academy/grammar/"))return grammarPage(route.split("/")[2],l);
 if(route==="academy/writing")return writingMenu(l);
 if(route.startsWith("academy/writing/task/"))return writingStudioPage(route.split("/")[3],l);
 if(route==="academy/library")return libraryMenu(l);
 if(route.startsWith("academy/library/"))return readingPage(route.split("/")[2],l);
 return overview(l);
}
export function labAction(button,api){
 const a=button.dataset.lab,route=api.route(),l=api.language()==="tl"?"tl":"en";
 if(a==="writer-key"||a==="writer-backspace"){
   const input=document.getElementById("lp-studio-draft")||document.getElementById("lp-draft");
   if(!input||typeof input.setRangeText!=="function")return;
   const from=input.selectionStart??input.value.length,to=input.selectionEnd??from;
   if(a==="writer-key")input.setRangeText(button.dataset.character||"",from,to,"end");
   else if(from!==to)input.setRangeText("",from,to,"end");
   else if(from>0)input.setRangeText("",from-1,from,"end");
   const counter=document.getElementById(input.id==="lp-studio-draft"?"lp-studio-count":"lp-wordcount");
   if(counter)counter.textContent=words(input.value)+" "+TXT[l].wordCount;
   input.focus();return;
 }
 if(a==="listen-draft"){
   const input=document.getElementById("lp-studio-draft")||document.getElementById("lp-draft");
   if(input?.value.trim())api.speak(input.value.slice(0,1600));
   else api.notice?.("Write a Russian draft first.");
   return;
 }
 if(a==="review-writing"){
   const id=route.split("/")[2],p=readingLibrary.find(x=>x.id===id);
   const input=document.getElementById("lp-draft"),node=document.getElementById("lp-reading-writing-feedback");
   if(p&&input&&node)node.innerHTML=writingFeedback({stage:p.stage},l,input.value);
   return;
 }
 if(a==="play-example"){api.speak(button.dataset.text||"");return;}
 if(a==="play-reading"){
   const id=route.split("/")[2],p=readingLibrary.find(x=>x.id===id);if(p)api.speak(p.text);return;
 }
 if(a==="toggle-guide"){if(session){session.translation=!session.translation;api.render();}return;}
 if(a==="save-studio"||a==="review-studio"){
   const id=route.split("/")[3],task=writingTasks.find(t=>t.id===id),input=document.getElementById("lp-studio-draft");
   if(!task||!input)return;
   const draft=input.value;
   if(a==="save-studio"){
     data.drafts["portfolio:"+id]=draft;
     data.draftUpdated["portfolio:"+id]=Date.now();
     api.notice?.(save()?TXT[l].saved:TXT[l].saveError);
   }else{
     const node=document.getElementById("lp-studio-feedback");
     if(node)node.innerHTML=writingFeedback(task,l,draft);
   }
   return;
 }
 if(a==="save-writing"){
   const id=route.split("/")[2],input=document.getElementById("lp-draft");if(!input)return;
   data.drafts[id]=input.value;
   data.draftUpdated[id]=Date.now();
   const okay=save();
   api.notice?.(okay?TXT[l].saved:TXT[l].saveError);
   return;
 }
 if(a==="answer-grammar"&&session?.kind==="grammar"&&!session.answered){
   const s=session,q=s.questions[s.index],choice=Number(button.dataset.choice);
   if(!Number.isInteger(choice)||choice<0||choice>=q.options.length)return;
   const good=q.options[choice]===q.answer;
   s.selection=choice;s.answered=true;s.correct+=Number(good);
   if(!good)s.missed.push(q);
   const existing=data.grammar[s.stage]||{best:0,attempts:0,items:{}};
   const rec=existing.items[q.id]||{seen:0,correct:0};
   existing.items[q.id]={seen:rec.seen+1,correct:rec.correct+Number(good),last:Date.now()};
   data.grammar[s.stage]=existing;save();api.render();return;
 }
 if(a==="next-grammar"&&session?.kind==="grammar"&&session.answered){
   session.answered=false;session.selection=null;session.index++;
   if(session.index>=session.questions.length){
     session.complete=true;
     const rec=data.grammar[session.stage];
     rec.best=Math.max(rec.best||0,session.correct);rec.lastScore=session.correct;rec.attempts=(rec.attempts||0)+1;
     rec.last=Date.now();save();
   }
   api.render();return;
 }
 if(a==="restart-grammar"&&session?.kind==="grammar"){session=null;api.render();return;}
 if(a==="answer-read"&&session?.kind==="reading"&&!session.feedback){
   const s=session,p=readingLibrary.find(x=>x.id===s.id),q=p.questions[s.answered.length];
   const choice=Number(button.dataset.choice);
   if(!Number.isInteger(choice)||choice<0||choice>=s.options[s.answered.length].length)return;
   s.selection=choice;s.feedback={good:s.options[s.answered.length][choice]===q.answer};
   api.render();return;
 }
 if(a==="next-read"&&session?.kind==="reading"&&session.feedback){
   const s=session; s.answered.push(s.feedback.good);s.feedback=null;s.selection=null;
   const p=readingLibrary.find(x=>x.id===s.id);
   if(s.answered.length===p.questions.length){
     s.complete=true;
     const old=data.readings[s.id]||{attempts:0,passed:false};
     data.readings[s.id]={attempts:old.attempts+1,passed:old.passed||s.answered.every(Boolean),lastPassed:s.answered.every(Boolean),lastScore:s.answered.filter(Boolean).length,last:Date.now()};
     save();
   }
   api.render();return;
 }
 if(a==="repeat-read"&&session?.kind==="reading"){
   session.answered=[];session.feedback=null;session.selection=null;session.complete=false;
   session.options=readingLibrary.find(x=>x.id===session.id).questions.map(q=>shuffle(q.choices));
   api.render();return;
 }
}
export function labInput(event,api){
 if(event.target.id==="lp-studio-draft"){
   const count=document.getElementById("lp-studio-count");if(count)count.textContent=words(event.target.value)+" "+TXT[api.language()==="tl"?"tl":"en"].wordCount;
   return true;
 }
 if(event.target.id==="lp-draft"){
   const count=document.getElementById("lp-wordcount");if(count)count.textContent=words(event.target.value)+" "+TXT[api.language()==="tl"?"tl":"en"].wordCount;
   return true;
 }
 return false;
}
export function labStats(){
 return {grammarTotal:grammarDrills.length,readingsTotal:readingLibrary.length,writingTotal:writingTasks.length,
  grammarAttempts:Object.values(data.grammar).reduce((v,x)=>v+(x.attempts||0),0),
  readingsPassed:Object.values(data.readings).filter(x=>x.passed).length};
}
