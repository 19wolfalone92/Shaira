import {
  GUIDED_STUDY_DAYS,makeDay,beginDay,readDayState,snapshot,dayStatus,
  markQuick,addMistake,markReference,changeGoal,finishDay,skillsReport,
  normalizedRussian,wordTotal,skillOverview
} from "./daily-plan.js";
import {goals} from "./daily-content.js";

const TXT={
 en:{
  eyebrow:"YOUR PERSONAL RUSSIAN TEACHER",today:"Today's Russian lesson",intro:"Every study day combines real practice in words, grammar, reading, speaking and writing. Continue at your own pace.",
  progress:"Guided study route",day:"Study day",of:"of",stage:"Topic level (not tested)",goal:"Preferred study time",goalNote:"Choose a comfortable target. You can split the lesson across several sessions; no streaks or punishments.",
  minutes:"min",teacher:"Teacher's objective",note:"Teaching tip",yourPath:"Your practice for this day",
  mission:"Open practice",done:"Completed",notDone:"Still to practise",status:"Progress",lesson:"Lesson",
  practice:"Three daily mini-exercises",first:"1. Understand a rule",second:"2. Spell in Russian",third:"3. Speak aloud",
  pick:"Choose the correct answer",type:"Type the exact model",typeHint:"Use your phone's Russian keyboard or the Cyrillic keyboard below. This exercise checks the supplied model, not all valid answers.",
  check:"Check answer",try:"Try again after reading the explanation.",correct:"Correct — you can continue.",reveal:"Model answer",
  explanation:"Why?",speak:"Listen to the Russian model",speakTip:"Say the model aloud two or three times; try once without reading. Speaking is self-confirmed, not automatically graded.",
  spoke:"I said it aloud",spoken:"Speaking practice logged",soundFail:"Audio unavailable? Read the visible Russian sentence aloud. This is not a listening grade.",
  quizDone:"Grammar microcheck completed",spellDone:"Spelling microcheck completed",
  resume:"Continue practice",step1:"Open learning activity",review:"Memory review",reviewDue:"words due for spaced review",reviewHint:"Reviewing earlier words is recommended before new material; it is not counted as a new grammar lesson.",
  optional:"Optional: deeper study",moreTime:"Use extra time to revise the writing portfolio or read a graded text.",
  shortTime:"Short session? Complete one activity, then return later; your progress stays here.",
  grammarFocus:"Recent mistakes suggest extra grammar repetition.",spellingFocus:"Recent mistakes suggest more Cyrillic spelling practice.",
  finish:"Complete this study day",finishLocked:"Finish the activities and all three mini-exercises to complete today's study.",
  ready:"Everything on today's practice list is done.",saved:"Study day completed and saved.",
  celebrate:"One more step in Russian!",celebrateText:"Your practice is recorded. Keeping a steady learning habit is more useful than rushing through levels.",
  nextDay:"Start the next study day",rest:"You can take a break and return whenever you're ready.",
  completeTitle:"Guided practice route finished",completeText:"You have worked through the first guided sequence. This is not a B2 language certificate. Continue independent reading, writing and real speaking with more varied material.",
  fullCourse:"Explore the complete lesson library",history:"Your recent study days",nothing:"Your course begins with Cyrillic. Just one small step first.",
  weakness:"Areas to revisit",ongoing:"In progress",wordReview:"Review earlier words",start:"Start",
  handbookConfirm:"I studied these examples",handbookInfo:"This note is self-reported. The independent grammar trainer checks your understanding.",
  fallback:"No audio detected. Use the reading comprehension activity instead; it does not count as listening.",
  recent:"Recent practice",noSkip:"Learning progress is practice evidence, not a CEFR qualification.",
  notSaved:"The browser could not save progress. Check storage permissions.",
  keyboard:"Cyrillic typing help",listenWord:"Listen before spelling",word:"word",words:"words",
  sample:"Say this Russian phrase",notebook:"Private drafts and progress stay on this device. Export a backup from Settings.",
  checkpoint:"Checkpoint",newTopic:"Learning",skills:"Skills practised",repeat:"Review grammar and spelling mistakes rather than rushing onward."
 },
 tl:{
  eyebrow:"PERSONAL NA GURO SA RUSO",today:"Aralin sa Ruso ngayong araw",intro:"May tunay na pagsasanay sa salita, gramatika, pagbasa, pagsasalita at pagsusulat bawat araw. Sa sarili mong bilis.",
  progress:"Landas ng pag-aaral",day:"Araw ng pag-aaral",of:"sa",stage:"Antas ng paksa (hindi nasusukat)",goal:"Gustong haba ng pag-aaral",goalNote:"Pumili ng komportableng oras. Puwedeng hati-hatiin ang aralin; walang parusa o streak.",
  minutes:"min",teacher:"Layunin ng guro",note:"Payo ng guro",yourPath:"Pagsasanay para sa araw na ito",
  mission:"Buksan ang pagsasanay",done:"Natapos",notDone:"Kailangan pang sanayin",status:"Pag-usad",lesson:"Aralin",
  practice:"Tatlong munting pagsasanay araw-araw",first:"1. Unawain ang tuntunin",second:"2. Sumulat sa Ruso",third:"3. Magsalita nang malakas",
  pick:"Piliin ang tamang sagot",type:"Isulat ang eksaktong modelo",typeHint:"Gamitin ang Russian keyboard o ang mga titik sa ibaba. Eksaktong modelo lamang ang sinusuri, hindi lahat ng posibleng sagot.",
  check:"Suriin ang sagot",try:"Subukan uli pagkatapos basahin ang paliwanag.",correct:"Tama — magpatuloy.",reveal:"Halimbawang sagot",
  explanation:"Bakit?",speak:"Pakinggan ang modelong Ruso",speakTip:"Ulitin ang pangungusap nang ilang beses, saka subukan nang hindi tumitingin. Sariling pag-amin ang pagsasanay, hindi awtomatikong pagsusuri.",
  spoke:"Nasabi ko nang malakas",spoken:"Naitala ang pagsasalita",soundFail:"Walang audio? Basahin nang malakas ang tekstong Ruso. Hindi ito grado sa pakikinig.",
  quizDone:"Natapos ang munting pagsusuri sa gramatika",spellDone:"Natapos ang baybay",
  resume:"Magpatuloy",step1:"Buksan ang gawain",review:"Balikan ang mga salita",reviewDue:"salitang dapat balikan",reviewHint:"Mahalagang balikan ang dating salita bago ang bago. Hindi ito bagong pagsusuri sa gramatika.",
  optional:"Opsyonal: mas malalim na aralin",moreTime:"Kung may oras, i-edit ang sinulat o magbasa ng teksto.",
  shortTime:"Maikling oras? Tapusin ang isang gawain at bumalik; naka-save ang pag-usad.",
  grammarFocus:"Kailangan pang balikan ang ilang tuntunin.",spellingFocus:"Magsanay pa sa baybay ng Cyrillic.",
  finish:"Tapusin ang araw ng pag-aaral",finishLocked:"Tapusin ang mga gawain at tatlong munting pagsasanay.",
  ready:"Natapos ang lahat ng gawain ngayong araw.",saved:"Na-save ang natapos na aralin.",
  celebrate:"Isa pang hakbang sa Ruso!",celebrateText:"Naitala ang pagsasanay. Mas mabuti ang tuloy-tuloy na pag-aaral kaysa pagmamadali.",
  nextDay:"Simulan ang susunod na aralin",rest:"Maaari kang magpahinga at bumalik kung handa ka na.",
  completeTitle:"Natapos ang gabay na pagsasanay",completeText:"Natapos ang unang sunod-sunod na pagsasanay. Hindi ito B2 na sertipiko. Magpatuloy sa pagbasa, pagsusulat at tunay na pakikipag-usap.",
  fullCourse:"Tingnan ang lahat ng aralin",history:"Mga nakaraang araw",nothing:"Magsimula sa Cyrillic. Isang maliit na hakbang muna.",
  weakness:"Mga dapat balikan",ongoing:"Isinasagawa",wordReview:"Balikan ang dating salita",start:"Magsimula",
  handbookConfirm:"Nabasa ko ang mga halimbawa",handbookInfo:"Sariling ulat ito. Sa grammar trainer sinusuri ang pag-unawa.",
  fallback:"Walang audio. Gamitin muna ang pagbabasa; hindi ito grado sa pakikinig.",
  recent:"Kamakailang pagsasanay",noSkip:"Ang pag-usad ay ebidensiya ng pagsasanay, hindi sertipikasyon ng CEFR.",
  notSaved:"Hindi ma-save sa browser. Suriin ang mga pahintulot.",
  keyboard:"Tulong sa Cyrillic keyboard",listenWord:"Pakinggan bago baybayin",word:"salita",words:"mga salita",
  sample:"Sabihin ang pariralang Ruso",notebook:"Pribado ang mga draft sa device. Mag-export ng backup sa Settings.",
  checkpoint:"Pagsusuri",newTopic:"Pag-aaral",skills:"Mga kasanayang nasanay",repeat:"Balikan ang mga pagkakamali sa gramatika at baybay."
 }
};
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const text=(v,l)=>typeof v==="string"?v:v?.[l]||v?.en||"";
const audioAvailable=()=>typeof window!=="undefined"&&"speechSynthesis" in window&&typeof SpeechSynthesisUtterance!=="undefined";
const letters=["ё й ц у к е н г ш щ з х ъ","ф ы в а п р о л д ж э","я ч с м и т ь б ю"];
let ephemeral={index:-1,quiz:"",spell:"",entered:"",revealed:false,success:0};
const stateMessage=(k,l)=>TXT[l][k]||k;
const optionsFor=day=>{
  const array=day.quiz.choices.slice();
  // deterministic shuffle per day, so authoring the correct answer as first doesn't leak the answer
  let seed=(day.index+41)*1103515245+12345;
  for(let i=array.length-1;i>0;i--){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const j=seed%(i+1);[array[i],array[j]]=[array[j],array[i]];
  }
  return array;
};
function todayHeader(day,state,summary,l){
 const pct=Math.round(summary.done/Math.max(1,summary.total)*100);
 return '<div class="daily-hero"><span class="daily-overline">'+TXT[l].eyebrow+'</span>'+
  '<h1>'+TXT[l].today+'</h1><p>'+TXT[l].intro+'</p>'+
  '<div class="daily-main-facts"><span><b>'+TXT[l].day+' '+day.number+'</b> / '+GUIDED_STUDY_DAYS+'</span><span>'+day.stageLabel+' · '+TXT[l].stage+'</span></div></div>'+
  '<section class="daily-status" aria-label="'+TXT[l].progress+'"><div><strong>'+TXT[l].progress+'</strong><span>'+day.number+'/'+GUIDED_STUDY_DAYS+'</span></div>'+
   '<div class="daily-total-bar" role="progressbar" aria-label="'+TXT[l].status+'" aria-valuemin="0" aria-valuemax="'+summary.total+'" aria-valuenow="'+summary.done+'"><i style="width:'+pct+'%"></i></div>'+
   '<div class="daily-steps-head"><span>'+summary.done+'/'+summary.total+' '+TXT[l].done+'</span><span>'+day.estimatedMinutes+' '+TXT[l].minutes+' '+TXT[l].lesson+'</span></div></section>';
}
function preferences(state,l){
 return '<section class="daily-preferences"><h2>'+TXT[l].goal+'</h2><div class="daily-goals" role="group" aria-label="'+TXT[l].goal+'">'+
 [20,40,60].map(n=>'<button type="button" data-daily="goal" data-value="'+n+'" aria-pressed="'+(state.goal===n)+'" class="'+(state.goal===n?"daily-selected":"")+'">'+n+' '+TXT[l].minutes+'</button>').join("")+
 '</div><p>'+TXT[l].goalNote+'</p></section>';
}
function focusPanel(day,l){
 const aim=day.intro.aim?text(day.intro.aim,l):text(day.target,l);
 return '<section class="daily-focus"><div class="daily-week-label">'+day.stageLabel+' · '+TXT[l][day.weekday===6?"checkpoint":"newTopic"]+' · '+day.week+'</div>'+
  '<h2>'+text(day.intro,l)+'</h2><p><strong>'+TXT[l].teacher+':</strong> '+esc(aim)+'</p>'+
  '<div class="daily-note"><strong>'+TXT[l].note+'</strong><p>'+esc(text(day.intro.note,l))+'</p></div></section>';
}
function studyTasks(day,summary,l){
 const firstUnfinished=summary.steps.find(s=>!s.complete);
 return '<section class="daily-task-area"><h2>'+TXT[l].yourPath+'</h2>'+
  '<div class="daily-task-list">'+summary.steps.map((step,i)=>{
    const href=["listen","audio","sound"].includes(step.kind)&&!audioAvailable()?"#academy/lesson/"+step.unitId+"/read":step.href;
    return '<div class="daily-task '+(step.complete?"daily-task-done":"")+'"><span class="daily-task-number">'+(step.complete?"✓":i+1)+'</span>'+
      '<div class="daily-task-info"><strong>'+esc(text(step.title,l))+'</strong><small>'+step.minutes+' '+TXT[l].minutes+
      ' · '+TXT[l][step.complete?"done":"notDone"]+'</small>'+
      (["listen","audio","sound"].includes(step.kind)&&!audioAvailable()?'<p class="daily-warning">'+TXT[l].fallback+'</p>':"")+
      (step.kind==="handbook"&&!step.complete?'<p class="daily-caution">'+TXT[l].handbookInfo+'</p>':"")+
      '</div><div class="daily-task-actions"><a href="'+esc(href)+'">'+TXT[l].mission+' ↗</a>'+
      (step.kind==="handbook"&&!step.complete?'<button type="button" data-daily="confirm-reference" data-id="'+esc(step.id)+'">'+TXT[l].handbookConfirm+'</button>':"")+
      '</div></div>';
  }).join("")+'</div>'+
  (firstUnfinished?'<a class="daily-primary daily-resume" href="'+esc(["listen","audio","sound"].includes(firstUnfinished.kind)&&!audioAvailable()?"#academy/lesson/"+firstUnfinished.unitId+"/read":firstUnfinished.href)+'">'+TXT[l].resume+' →</a>':"")+'</section>';
}
function dailyKeyboard(l){
 return '<details class="daily-keyboard"><summary>⌨ '+TXT[l].keyboard+'</summary><div class="daily-board">'+
 letters.map(row=>'<div>'+row.split(" ").map(ch=>'<button type="button" data-daily="insert" data-char="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+
 '<div><button type="button" data-daily="insert" data-char=" " class="daily-space">Space</button><button type="button" data-daily="delete">⌫</button></div></div></details>';
}
function miniExercises(day,summary,l){
 const q=day.quiz,ordered=optionsFor(day);
 const answerDone=summary.quiz,spellDone=summary.spell,oralDone=summary.oral;
 const quizResult=ephemeral.quiz ? '<p class="daily-feedback '+(ephemeral.quiz==="correct"?"ok":"wrong")+'" role="status">'+
  (ephemeral.quiz==="correct"?TXT[l].correct:TXT[l].try)+
  (ephemeral.quiz==="wrong"?'<br>'+TXT[l].reveal+': <b lang="ru">'+esc(q.answer)+'</b>':'')+
  '<br><strong>'+TXT[l].explanation+': </strong>'+esc(text(q.explanation,l))+'</p>':"";
 const spellResult=ephemeral.spell ? '<p class="daily-feedback '+(ephemeral.spell==="correct"?"ok":"wrong")+'" role="status">'+
  (ephemeral.spell==="correct"?TXT[l].correct:TXT[l].try)+(ephemeral.spell==="wrong"?'<br>'+TXT[l].reveal+': <b lang="ru">'+esc(day.spelling.ru)+'</b>':"")+'</p>':"";
 return '<section class="daily-micro"><h2>'+TXT[l].practice+'</h2>'+
  '<article class="daily-exercise"><div class="daily-exercise-caption"><span>01</span><strong>'+TXT[l].first+'</strong><b>'+(answerDone?"✓":"")+'</b></div>'+
    '<p class="daily-question">'+esc(text(q.instruction,l))+'</p><p class="daily-hint">'+esc(text(q.context,l))+'</p>'+
    (answerDone?'<p class="daily-passed">✓ '+TXT[l].quizDone+'</p>':'<div class="daily-choices">'+
      ordered.map((choice,i)=>'<button type="button" data-daily="quiz" data-choice="'+i+'">'+esc(choice)+'</button>').join("")+'</div>')+
    quizResult+'</article>'+
  '<article class="daily-exercise"><div class="daily-exercise-caption"><span>02</span><strong>'+TXT[l].second+'</strong><b>'+(spellDone?"✓":"")+'</b></div>'+
    '<p class="daily-question">'+esc(text(day.spelling.prompt,l))+'</p>'+
    (spellDone?'<p class="daily-passed">✓ '+TXT[l].spellDone+'</p>':
       '<button data-daily="play" data-text="'+esc(day.spelling.ru)+'" class="daily-play">🔊 '+TXT[l].listenWord+'</button>'+
       '<form id="daily-spell-form"><label for="daily-spell">'+TXT[l].type+'</label>'+
       '<input type="text" lang="ru" id="daily-spell" autocomplete="off" autocapitalize="off" spellcheck="false" required placeholder="По-русски…" value="'+esc(ephemeral.entered)+'"/>'+
       '<small>'+TXT[l].typeHint+'</small>'+
       '<button type="submit" class="daily-primary">'+TXT[l].check+'</button></form>'+dailyKeyboard(l))+
    spellResult+'</article>'+
  '<article class="daily-exercise"><div class="daily-exercise-caption"><span>03</span><strong>'+TXT[l].third+'</strong><b>'+(oralDone?"✓":"")+'</b></div>'+
    '<p class="daily-hint">'+TXT[l].speakTip+'</p>'+
    '<p class="daily-ru" lang="ru">'+esc(day.voiceLine)+'</p>'+
    '<button class="daily-play" data-daily="play" data-text="'+esc(day.voiceLine)+'">🔊 '+TXT[l].speak+'</button>'+
    (oralDone?'<p class="daily-passed">✓ '+TXT[l].spoken+'</p>':
      '<button data-daily="oral" class="daily-secondary" type="button">'+TXT[l].spoke+'</button>')+
    (!audioAvailable()?'<p class="daily-hint">'+TXT[l].soundFail+'</p>':"")+
    '</article></section>';
}
function progressHistory(state,l){
 const report=skillsReport(state),skills=skillOverview(snapshot());
 const skillsNames=l==="tl"?{words:"Mga salita",grammar:"Gramatika",listen:"Pakikinig",reading:"Pagbasa",writing:"Pagsulat",speaking:"Pagsasalita"}:
   {words:"Vocabulary",grammar:"Grammar",listen:"Listening practice",reading:"Reading",writing:"Writing drafts",speaking:"Speaking practice"};
 const skillBar='<h3 class="daily-skill-title">'+(l==="tl"?"Iyong anim na kasanayan":"Your six language skills")+'</h3>'+
   '<div class="daily-skill-grid">'+skills.map(row=>'<div><div><strong>'+skillsNames[row.id]+'</strong><span>'+row.count+'/'+row.total+'</span></div>'+
   '<i><em style="width:'+Math.min(100,Math.round(100*row.count/Math.max(1,row.total)))+'%"></em></i></div>').join("")+'</div>'+
   '<p class="daily-hint">'+(l==="tl"?"Bilang lamang ito ng nasanay at nasubukang gawain. Ang pagsasalita at mga draft ay hindi awtomatikong sinusuri.":
      "These figures show practice coverage, not proficiency. Speaking and free writing are not automatically assessed.")+'</p>';
 return '<section class="daily-history"><h2>'+TXT[l].recent+'</h2><div class="daily-levels">'+report.stageRows.map(r=>
  '<div><strong>'+r.label+'</strong><span>'+r.days+'/'+r.total+'</span><i><em style="width:'+Math.round(100*r.days/r.total)+'%"></em></i></div>').join("")+'</div>'+
  skillBar+
  (report.days?'<p class="daily-hint">'+TXT[l].history+': '+state.finished.slice(-5).map(r=>
   '<span class="daily-date">'+esc(r.date)+' · '+(r.day+1)+'</span>').join(" ")+'</p>':"")+
  (report.grammarNeedsPractice?'<p class="daily-guidance">✳ '+TXT[l].grammarFocus+'</p>':"")+
  (report.spellingNeedsPractice?'<p class="daily-guidance">✎ '+TXT[l].spellingFocus+'</p>':"")+
  '<p class="daily-hint">'+TXT[l].noSkip+'</p></section>';
}
let lastCompleted=null;
export function todayHtml(l="en"){
 if(!TXT[l])l="en";
 const state=beginDay(),day=makeDay(state.index);
 if(lastCompleted!==null){
  return '<section class="daily-complete"><span class="daily-complete-icon">✓</span><h1>'+TXT[l].celebrate+'</h1>'+
    '<p>'+TXT[l].celebrateText+'</p><strong>'+TXT[l].day+' '+lastCompleted+' / '+GUIDED_STUDY_DAYS+'</strong>'+
    '<div><button type="button" data-daily="next-session" class="daily-primary">'+TXT[l].nextDay+' →</button></div>'+
    '<p class="daily-hint">'+TXT[l].rest+'</p></section>'+progressHistory(state,l);
 }
 if(!day){
  return '<section class="daily-complete"><span class="daily-complete-icon">✓</span><h1>'+TXT[l].completeTitle+'</h1><p>'+TXT[l].completeText+'</p>'+
   '<a href="#academy" class="daily-primary">'+TXT[l].fullCourse+' →</a></section>'+progressHistory(state,l);
 }
 if(ephemeral.index!==day.index)ephemeral={index:day.index,quiz:"",spell:"",entered:"",revealed:false,success:0};
 const summary=dayStatus(day,state,snapshot(),audioAvailable());
 const academy=snapshot().academy||{},memory=academy.memory||{};
 const reviewDue=Object.values(memory).filter(rec=>rec?.seen>0&&Number(rec.due)<=Date.now()).length;
 const review='<a class="daily-review" href="#academy/review"><span>↺</span><div><strong>'+TXT[l].review+'</strong><small>'+reviewDue+' '+TXT[l].reviewDue+' · '+TXT[l].reviewHint+'</small></div><b>›</b></a>';
 const goalExtra=state.goal===60?'<div class="daily-extra"><h3>'+TXT[l].optional+'</h3><p>'+TXT[l].moreTime+'</p><a href="#academy/library">'+TXT[l].fullCourse+' ↗</a></div>':
   state.goal===20?'<p class="daily-guidance">'+TXT[l].shortTime+'</p>':"";
 return todayHeader(day,state,summary,l)+preferences(state,l)+focusPanel(day,l)+review+
   studyTasks(day,summary,l)+miniExercises(day,summary,l)+goalExtra+
   '<section class="daily-finish"><p class="'+(summary.complete?"daily-done-text":"daily-hint")+'">'+TXT[l][summary.complete?"ready":"finishLocked"]+'</p>'+
   '<button class="daily-primary" type="button" data-daily="finish" '+(!summary.complete?"disabled":"")+'>'+TXT[l].finish+' →</button></section>'+
   progressHistory(state,l)+'<p class="daily-hint">'+TXT[l].notebook+'</p>';
}
export function todayPreview(l="en"){
 const state=readDayState(),day=makeDay(state.index);
 if(!day)return '<a href="#today" class="daily-home-link">✓ '+TXT[l==="tl"?"tl":"en"].completeTitle+'</a>';
 const v=TXT[l==="tl"?"tl":"en"];
 return '<a href="#today" class="daily-home-link"><span>◷</span><div><strong>'+v.today+' · '+v.day+' '+day.number+'</strong><small>'+
  esc(text(day.intro,l))+' · '+day.stageLabel+'</small></div><b>→</b></a>';
}
export function todayAction(button,api){
 const action=button.dataset.daily,l=api.language()==="tl"?"tl":"en";
 const state=beginDay(),day=makeDay(state.index);
 if(action==="next-session"){lastCompleted=null;api.render();return;}
 if(!day)return;
 if(action==="goal"){
   if(!changeGoal(Number(button.dataset.value)))api.notice?.(TXT[l].notSaved);
   api.render();return;
 }
 if(action==="play"){api.speak(button.dataset.text||"");return;}
 if(action==="quiz"){
   const chosen=optionsFor(day)[Number(button.dataset.choice)];
   if(chosen===undefined)return;
   if(chosen===day.quiz.answer){
     if(!markQuick("quiz"))api.notice?.(TXT[l].notSaved);
     ephemeral.quiz="correct";
   }else{
     addMistake("Quiz");ephemeral.quiz="wrong";
   }
   api.render();return;
 }
 if(action==="oral"){
   if(!markQuick("oral"))api.notice?.(TXT[l].notSaved);
   api.render();return;
 }
 if(action==="confirm-reference"){
   const match=day.tasks.find(step=>step.id===button.dataset.id&&step.kind==="handbook");
   if(match){
     if(!markReference(match))api.notice?.(TXT[l].notSaved);
     api.render();
   }
   return;
 }
 if(action==="insert"||action==="delete"){
   const input=document.getElementById("daily-spell");if(!input)return;
   const a=input.selectionStart??input.value.length,b=input.selectionEnd??a;
   if(action==="insert")input.setRangeText(button.dataset.char||"",a,b,"end");
   else if(a!==b)input.setRangeText("",a,b,"end");
   else if(a>0)input.setRangeText("",a-1,a,"end");
   ephemeral.entered=input.value;input.focus();return;
 }
 if(action==="finish"){
   const result=finishDay(undefined,new Date(),audioAvailable());
   if(result.success){lastCompleted=day.number;ephemeral={index:-1,quiz:"",spell:"",entered:"",success:0};api.render();}
   else api.notice?.(result.reason||TXT[l].notSaved);
   return;
 }
}
export function todaySubmit(event,api){
 if(event.target.id!=="daily-spell-form")return false;
 event.preventDefault();
 const state=beginDay(),day=makeDay(state.index);
 if(!day)return true;
 const input=document.getElementById("daily-spell");
 const entered=input?.value||"";ephemeral.entered=entered;
 if(normalizedRussian(entered)===normalizedRussian(day.spelling.ru)){
   if(!markQuick("spell"))api.notice?.(TXT[api.language()==="tl"?"tl":"en"].notSaved);
   ephemeral.spell="correct";
 }else{
   addMistake("Spell");ephemeral.spell="wrong";
 }
 api.render();return true;
}
export function todayInput(event){
 if(event.target.id==="daily-spell"){ephemeral.entered=event.target.value;return true;}
 return false;
}
