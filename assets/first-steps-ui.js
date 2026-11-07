// The first screen new adult beginners should see: micro-lessons, not an
// A1 grammar exam. Progress belongs to each small step, not to elapsed days.
import {FIRST_STEPS,MICRO_TOTAL,modeInfo,microStepAt,microAudioId} from "./first-steps-data.js";
import {readMicro,changeMicroMode,needsMicroStart,finishMicroRung,microSkipRungs,
 recordMicroMistake,matchesMicroAnswer,microQuestionsFor,fastTrackQuestions,finishMicroReview,enrolInMicroPath} from "./first-steps-engine.js";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=list=>{const v=list.slice();for(let i=v.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[v[i],v[j]]=[v[j],v[i]];}return v;};
export const isFirstStepsStart=needsMicroStart;
let active=null;
export const microCelebrationPending=()=>!active?.review&&readMicro().index===MICRO_TOTAL&&
 (active?.complete?.to===MICRO_TOTAL||active?.test?.result?.to===MICRO_TOTAL);
function makeSession(state,index=state.index){
 active={index,base:state.index,review:index<state.index,mode:state.mode,phase:"study",
  answers:[],question:0,feedback:null,typed:"",options:[],test:null,complete:null,error:""};
 return active;
}
function getSession(state){
 if(!active||(active.complete?.to??active.test?.result?.to??active.base)!==state.index||active.mode!==state.mode)
  return makeSession(state);
 return active;
}
const keyboard=q=>'<details class="ms-keyboard"><summary>⌨ Russian letters (optional keyboard)</summary>'+
 ['ё й ц у к е н г ш щ з х ъ','ф ы в а п р о л д ж э','я ч с м и т ь б ю'].map(row=>
  '<div>'+row.split(" ").map(letter=>{
   const ch=q.letterCase==="upper"?letter.toUpperCase():letter;
   return '<button type="button" lang="ru" data-micro="letter-key" data-char="'+ch+'">'+ch+'</button>';
  }).join("")+'</div>').join("")+
 '<div><button type="button" data-micro="letter-key" data-char=" " class="ms-space">Space</button>'+
 '<button type="button" data-micro="delete-key" aria-label="Backspace">⌫</button></div></details>';
function studyCard(step){
 const letter=step.letter,trans=step.english;
 const detail=step.kind==="letter"?
  '<div class="ms-large" lang="ru" aria-label="Russian letter '+esc(letter.upper)+'">'+esc(letter.upper)+
   '<span>'+esc(letter.lower)+'</span></div>'+
  '<div class="ms-pronounce"><strong>Sound:</strong> '+esc(letter.sound)+'</div>'+
  '<p><strong>Letter focus:</strong> '+esc(letter.tip)+'</p>':
  '<div class="ms-large ms-word" lang="ru">'+esc(step.model)+'</div>'+
   '<div class="ms-pronounce"><strong>'+(
     step.kind==="blend"?"Join these sounds":step.kind==="phrase"?"English meaning":"Meaning")+
     ':</strong> '+esc(trans)+'</div>'+
   '<p>'+esc(step.tip)+'</p>';
 return '<section class="ms-study"><div class="ms-section-label">1 · LEARN ONE TINY THING</div>'+
 '<h2 tabindex="-1">'+esc(step.title)+'</h2><p>'+esc(step.description)+'</p>'+
 detail+
 '<div class="ms-study-buttons"><button type="button" data-micro="hear" class="ms-outline">🔊 '+
 (letter?"Hear the letter name":"Hear it")+'</button>'+
 '<button type="button" data-micro="hear-slow" class="ms-outline">0.7× Slowly</button></div>'+
 (letter?'<p class="ms-hint">The audio gives the letter’s name. Use the sound above when you read words.</p>':"")+
 '<p class="ms-hint">Spend a minute looking and listening. You do not need to rush. Say the model aloud if you feel comfortable.</p>'+
 (letter?'<div class="ms-trace-box"><strong>Optional: trace this one letter</strong>'+
 '<p>Use your finger or stylus. Handwriting is free practice and is not automatically marked.</p>'+
 '<div class="ms-trace-pad"><span lang="ru" aria-hidden="true">'+esc(letter.upper)+'</span>'+
 '<canvas id="micro-trace" aria-label="Freehand Cyrillic letter tracing pad" role="img"></canvas></div>'+
 '<button type="button" data-micro="clear-trace" class="ms-outline">Clear drawing ↻</button></div>':"")+
 '<button type="button" class="ms-primary" data-micro="start">I am ready for a tiny check →</button></section>';
}
function questionCard(q,index,total,session,fast=false){
 const opts=(fast?session.test?.options:session.options)||[];
 const choices=q.options?'<div class="ms-choices">'+opts.map((value,i)=>
  '<button type="button" data-micro="'+(fast?"skip-choice":"choice")+'" data-choice="'+i+'" '+
    (session.feedback?"disabled ":"")+(/[А-Яа-яЁё]/u.test(value)?'lang="ru"':"")+'>'+esc(value)+'</button>').join("")+'</div>':
  '<form id="micro-answer-form"><label for="micro-typed">Write in Russian</label>'+
   '<input id="micro-typed" lang="ru" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" required value="'+esc(session.typed)+'" '+(session.feedback?"disabled":"")+'/>'+
   (session.feedback?"":'<button type="submit" class="ms-primary">'+(fast?"Submit answer":"Check my answer")+'</button>'+keyboard(q))+'</form>';
 return '<section class="ms-question"><div class="ms-section-label">'+(fast?"OPTIONAL FAST-TRACK TEST":"2 · YOUR TINY CHECK")+
 '</div><span class="ms-qlabel">Question '+(index+1)+' / '+total+'</span>'+
 '<div class="ms-qbar"><i style="width:'+Math.round(index/Math.max(1,total)*100)+'%"></i></div>'+
 '<h2 tabindex="-1">'+esc(q.prompt)+'</h2>'+choices+
 (!fast&&session.feedback?'<div class="ms-feedback '+(session.feedback.correct?"good":"retry")+'" role="status"><strong>'+
 (session.feedback.correct?"✓ You got it!":"↺ It takes practice — no penalty")+'</strong>'+
 '<p>'+esc(q.explanation)+'</p>'+
 '<p><strong>Model:</strong> <span lang="'+(/[\u0400-\u052F]/u.test(q.answer)?"ru":"en")+'">'+esc(q.answer)+'</span></p>'+
 '<button type="button" data-micro="'+(session.feedback.correct?"continue":"retry")+'" class="ms-primary">'+
 (session.feedback.correct?"Continue →":"Practise this again ↻")+'</button></div>':"")+
 (fast?'<p class="ms-hint">All six answers must be correct to skip ahead.</p>':
   !session.feedback?'<button type="button" class="ms-outline" data-micro="show-model">Back to the example</button>':"")+
 '</section>';
}
function summary(state){
 const chapters=Array.from({length:13},(_,i)=>({number:i+1,count:0,total:0}));
 FIRST_STEPS.forEach((step,index)=>{
  const chapter=chapters[step.chapter-1];chapter.total++;
  if(index<state.index)chapter.count++;
 });
 const mistakes=Object.keys(state.mistakes).map(Number).filter(index=>index<state.index)
  .sort((a,b)=>state.mistakes[b]-state.mistakes[a]||b-a);
 const revisit=state.index?'<details class="ms-roadmap ms-revisit"><summary>Review a past step'+
  (mistakes.length?' · '+mistakes.length+' to revisit':"")+'</summary><section>'+
  (mistakes.length?'<p class="ms-hint">Recommended from earlier mistakes</p>'+
    mistakes.slice(0,3).map(i=>'<button type="button" class="ms-outline" data-micro="review" data-value="'+i+'">'+esc(FIRST_STEPS[i].title)+'</button>').join(""):"")+
  '<form id="micro-review-form"><label for="micro-review-step">Choose any completed step</label><select id="micro-review-step">'+
  FIRST_STEPS.slice(0,state.index).map((step,i)=>'<option value="'+i+'" '+(i===state.index-1?"selected":"")+'>'+
    (i+1)+' · '+esc(step.title)+'</option>').join("")+'</select><button type="submit" class="ms-outline">Open step</button></form></section></details>':"";
 return '<details class="ms-roadmap"><summary>Your learning staircase · '+state.index+'/'+MICRO_TOTAL+' tiny steps</summary>'+
 '<div>'+chapters.map(c=>'<div><span>'+(c.number<=11?"Letter family "+c.number:"First conversations "+(c.number-11))+
 '</span><b>'+c.count+'/'+c.total+'</b><i><em style="width:'+Math.round(c.count/c.total*100)+'%"></em></i></div>').join("")+'</div>'+
 '</details>'+revisit;
}
function startHeader(state,step,hidden=false){
 const pct=Math.round(state.index/MICRO_TOTAL*100);
 return '<section class="ms-hero"><span>SHAIRA · RUSSIAN FROM ABSOLUTE ZERO</span>'+
 '<h1>One small step at a time.</h1>'+
 '<p>No Russian knowledge is required. We will teach <strong>one new letter</strong>, then a sound, a syllable, a tiny word and finally short phrases. You choose the pace.</p>'+
 '<div class="ms-progress-numbers"><strong>'+state.index+' / '+MICRO_TOTAL+'</strong><span>tiny steps completed</span></div>'+
 '<div class="ms-progress" role="progressbar" aria-label="Foundation steps completed" aria-valuemin="0" aria-valuemax="'+MICRO_TOTAL+'" aria-valuenow="'+state.index+'"><i style="width:'+pct+'%"></i></div>'+
 (step?'<p class="ms-next">Next: <b>'+esc(hidden?'A tiny Russian check':step.title)+'</b> · about 2–5 minutes</p>':"")+
 '</section>';
}
function modes(state){
 return '<section class="ms-mode"><h2>Choose how challenging this feels</h2>'+
 '<p>Start with Gentle. Change the difficulty at any time. Changing it restarts only the current unfinished check — your completed steps stay saved.</p>'+
 '<div class="ms-mode-row">'+Object.entries(modeInfo).map(([key,data])=>
 '<button type="button" data-micro="mode" data-value="'+key+'" aria-pressed="'+(state.mode===key)+'" class="'+(state.mode===key?"selected":"")+'">'+
 '<strong>'+data.name+'</strong><small>'+data.questions+' checks</small></button>').join("")+'</div>'+
 '<p class="ms-hint"><strong>Current mode:</strong> '+esc(modeInfo[state.mode].description)+'</p></section>';
}
function success(state,session){
 const old=FIRST_STEPS[session.index];
 if(session.review)return '<section class="ms-success"><span>✓</span><h1 tabindex="-1">Review complete.</h1><p>You revisited <strong>'+
  esc(old.title)+'</strong>. Your place in the course is saved.</p>'+
  '<button type="button" data-micro="back" class="ms-primary">Return to my place →</button></section>';
 return '<section class="ms-success"><span>✓</span><h1 tabindex="-1">Well done — one tiny step.</h1>'+
 '<p>You practised <strong>'+esc(old.title)+'</strong>. You can continue immediately or return later. Your progress is saved.</p>'+
 '<p class="ms-hint">Small, repeatable successes matter more than speed.</p>'+
 '<button type="button" data-micro="next" class="ms-primary">'+
 (state.index>=MICRO_TOTAL?"Open your full Russian course":"Learn one more small thing →")+'</button></section>';
}
function fastPanel(session){
 const test=session.test;
 if(test.result)return '<section class="ms-success '+(test.result.ok?"":"ms-almost")+'"><span>'+(test.result.ok?"✓":"↺")+'</span>'+
 '<h1 tabindex="-1">'+(test.result.ok?"Three steps checked!":"Keep building your foundations")+'</h1>'+
 '<p>'+test.result.score+'/6 correct. '+(test.result.ok?
 "You proved the next three small skills and can continue from a later rung.":
 test.result.saveError?"Could not save the result. Try again when storage is available.":
 "Skipping requires six correct answers. Your place in the course is saved.")+'</p>'+
 '<button type="button" data-micro="back" class="ms-primary">'+
 (test.result.ok?"Continue from my new step →":"Return to my small lesson →")+'</button></section>';
 const q=test.questions[test.question];
 return '<section class="ms-fast-intro"><h2>Optional: prove you are ready for faster steps</h2>'+
 '<p>Answer six questions about the next three steps, including three answers typed in Russian. All six must be correct to advance.</p>'+
 '<button type="button" data-micro="cancel-skip" class="ms-back">← Keep the gentle path</button></section>'+
 questionCard(q,test.question,test.questions.length,{...session,test:{...test,options:test.options[test.question]}},true);
}
export function firstStepsHtml(){
 const state=readMicro(),s=getSession(state),step=microStepAt(s.index);
 if(s.test)return startHeader(state,microStepAt(state.index),true)+fastPanel(s);
 if(s.complete)return startHeader(state,microStepAt(state.index),true)+success(state,s)+summary(state);
 if(!step)return '<section class="ms-success"><span>🎓</span><h1>Your Cyrillic foundation is ready.</h1>'+
 '<p>You have practised all 33 letters, 11 syllables, tiny Russian words and twelve first phrases in small steps.</p>'+
 '<p>This is not a Russian proficiency certificate. Your full guided course now develops longer vocabulary, grammar, listening, reading, writing and conversation.</p>'+
 '<a href="#today" class="ms-primary ms-link">Continue to the full Russian course →</a></section>'+summary(state);
 const questions=microQuestionsFor(step,s.mode);
 const review=s.review?'<section class="ms-fast-intro"><h2>Reviewing step '+(s.index+1)+'</h2>'+
   '<button type="button" data-micro="back" class="ms-back">← Return to my place</button></section>':"";
 return startHeader(state,s.review?null:step,s.phase!=="study")+review+modes(state)+
 (s.error?'<p class="ms-feedback retry" role="status">'+esc(s.error)+'</p>':"")+
 (s.phase==="study"?studyCard(step):
    questionCard(questions[s.question],s.question,questions.length,{...s,options:s.options[s.question]||[]}))+
 (s.phase==="study"&&!s.review&&state.index>=3&&state.index<=MICRO_TOTAL-3?
 '<div class="ms-fast-cta"><strong>Already very easy?</strong><p>You can choose harder questions above, or prove the next three tiny steps in an optional six-question test.</p>'+
 '<button type="button" data-micro="fast-track" class="ms-outline">Optional: test ahead by 3 steps →</button></div>':"")+
 summary(state);
}
function resetOptions(session,question,fast=false){
 if(!question?.options)return;
 const arr=shuffle(question.options);
 if(fast)session.test.options[session.test.question]=arr;
 else session.options[session.question]=arr;
}
function mainAnswer(value,api){
 const state=readMicro(),s=getSession(state);
 if(s.phase!=="quiz"||s.feedback||s.complete)return;
 const q=microQuestionsFor(microStepAt(s.index),s.mode)[s.question];
 if(!q)return;
 const correct=matchesMicroAnswer(q,value);
 s.feedback={correct};if(!correct)recordMicroMistake(undefined,s.index);
 if(correct)s.answers.push({id:q.id,value:String(value)});
 api.render(".ms-feedback .ms-primary");
}
function fastAnswer(value,api){
 const state=readMicro(),s=getSession(state),test=s.test;
 if(!test||test.result||state.index!==test.start)return;
 const q=test.questions[test.question];
 test.answers.push({id:q.id,value:String(value)});
 s.typed="";test.question++;
 if(test.question>=test.questions.length){
  const score=test.questions.filter((q,i)=>matchesMicroAnswer(q,test.answers[i].value)).length;
  const pass=score===test.questions.length;
  const result=pass?microSkipRungs(test.start,test.answers):{ok:false};
  test.result={ok:pass&&result.ok,score,saveError:pass&&!result.ok,to:result.ok?result.state.index:test.start};
 }else resetOptions(s,test.questions[test.question],true);
 api.render(test.result?".ms-success h1":".ms-question h2");
}
export function firstStepsAction(button,api){
 const action=button.dataset.micro,state=readMicro(),s=getSession(state);
 if(action==="mode"){
  const mode=button.dataset.value;
  if(mode===state.mode)return;
  if(changeMicroMode(mode)){makeSession(readMicro(),s.index);api.render();}
  else api.notice?.("Could not save your difficulty preference.");
  return;
 }
 if(action==="clear-trace"){
  const canvas=document.getElementById("micro-trace"),ctx=canvas?.getContext?.("2d");
  if(canvas&&ctx){const b=canvas.getBoundingClientRect();ctx.clearRect(0,0,b.width,b.height);}
  return;
 }
 if(action==="hear"||action==="hear-slow"){
  const step=microStepAt(s.index);
  if(step)api.speak(step.model,action==="hear-slow"?0.7:1,undefined,microAudioId(step));
  return;
 }
 if(action==="next"||action==="back"){
  makeSession(readMicro());api.render();return;
 }
 if(action==="review"){openReview(Number(button.dataset.value),state,api);return;}
 if(action==="show-model"&&!s.test){makeSession(state,s.index);api.render(".ms-study h2");return;}
 if(action==="cancel-skip"){s.test=null;s.typed="";api.render();return;}
 if(action==="fast-track"&&!s.review&&s.phase==="study"){
  const questions=fastTrackQuestions(state.index);
  if(!questions.length)return;
  s.test={start:state.index,questions,answers:[],options:[],question:0,result:null};
  resetOptions(s,questions[0],true);api.render(".ms-question h2");return;
 }
 if(action==="start"&&s.phase==="study"&&!s.test){
  if(!s.review)enrolInMicroPath();
  s.phase="quiz";s.options=[];s.question=0;s.feedback=null;s.answers=[];s.error="";
  resetOptions(s,microQuestionsFor(microStepAt(s.index),s.mode)[0]);api.render(".ms-question h2");return;
 }
 if(action==="choice"&&!s.test&&s.phase==="quiz"){
  const q=microQuestionsFor(microStepAt(s.index),s.mode)[s.question],
   choices=s.options[s.question]||[],i=Number(button.dataset.choice);
  if(!q||q.kind!=="choice"||!Number.isInteger(i)||i<0||i>=choices.length)return;
  mainAnswer(choices[i],api);return;
 }
 if(action==="skip-choice"&&s.test){
  const test=s.test,q=test.questions[test.question],opts=test.options[test.question]||[],
   i=Number(button.dataset.choice);
  if(!q||q.kind!=="choice"||!Number.isInteger(i)||i<0||i>=opts.length)return;
  fastAnswer(opts[i],api);return;
 }
 if(action==="retry"&&s.feedback&&!s.feedback.correct){
  s.feedback=null;s.typed="";resetOptions(s,microQuestionsFor(microStepAt(s.index),s.mode)[s.question]);api.render(".ms-question h2");return;
 }
 if(action==="continue"&&s.feedback?.correct){
  s.feedback=null;s.typed="";s.question++;
  const q=microQuestionsFor(microStepAt(s.index),s.mode);
  if(s.question>=q.length){
   const result=s.review?{ok:finishMicroReview(s.index,s.answers)}:finishMicroRung(s.index,s.answers);
   if(result.ok)s.complete={to:result.state?.index??state.index};
   else{s.error=result.reason||"Could not save this review.";s.phase="study";s.answers=[];s.question=0;}
   api.render(result.ok?".ms-success h1":".ms-study h2");
  }else {resetOptions(s,q[s.question]);api.render(".ms-question h2");}
  return;
 }
 if(action==="letter-key"||action==="delete-key"){
  const input=document.getElementById("micro-typed");
  if(!input||typeof input.setRangeText!=="function")return;
  const a=input.selectionStart??input.value.length,b=input.selectionEnd??a;
  if(action==="letter-key")input.setRangeText(button.dataset.char||"",a,b,"end");
  else if(a!==b)input.setRangeText("",a,b,"end");
  else if(a>0)input.setRangeText("",a-1,a,"end");
  s.typed=input.value;input.focus();
 }
}
function openReview(index,state,api){
 if(!Number.isInteger(index)||index<0||index>=state.index)return;
 makeSession(state,index);api.render(".ms-study h2");
}
export function firstStepsSubmit(event,api){
 if(event.target.id==="micro-review-form"){
  event.preventDefault();
  openReview(Number(document.getElementById("micro-review-step")?.value),readMicro(),api);
  return true;
 }
 if(event.target.id!=="micro-answer-form")return false;
 event.preventDefault();
 const state=readMicro(),s=getSession(state),input=document.getElementById("micro-typed");
 if(!input)return true;
 if(s.test&&!s.test.result&&s.test.questions[s.test.question]?.kind==="type")fastAnswer(input.value,api);
 else if(s.phase==="quiz"&&!s.test&&!s.feedback&&microQuestionsFor(microStepAt(s.index),s.mode)[s.question]?.kind==="type")
  mainAnswer(input.value,api);
 return true;
}
export function firstStepsInput(event){
 if(event.target.id!=="micro-typed")return false;
 if(active)active.typed=String(event.target.value||"");
 return true;
}
export function firstStepsHomePreview(){
 const state=readMicro();
 if(!needsMicroStart())return "";
 const step=microStepAt(state.index);
 return '<a href="#today" class="ms-home-preview"><strong>🌱 Start with absolute zero · '+state.index+'/'+MICRO_TOTAL+'</strong>'+
 '<span>Next tiny step: '+esc(step?.title||"First Russian letter")+' · '+modeInfo[state.mode].name+' mode</span></a>';
}
