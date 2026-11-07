// The first screen new adult beginners should see: micro-lessons, not an
// A1 grammar exam. Progress belongs to each small step, not to elapsed days.
import {FIRST_STEPS,FIRST_LETTERS,MICRO_TOTAL,modeInfo,microQuestions,microStepAt} from "./first-steps-data.js";
import {readMicro,changeMicroMode,needsMicroStart,finishMicroRung,microSkipRungs,
 recordMicroMistake,matchesMicroAnswer,MICRO_SKIP_SIZE} from "./first-steps-engine.js";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=list=>{const v=list.slice();for(let i=v.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[v[i],v[j]]=[v[j],v[i]];}return v;};
const hasAudio=()=>typeof window!=="undefined"&&"speechSynthesis" in window&&typeof SpeechSynthesisUtterance!=="undefined";
export const isFirstStepsStart=needsMicroStart;
let active=null;
function makeSession(state){
 active={index:state.index,mode:state.mode,phase:"study",answers:[],question:0,feedback:null,typed:"",
  options:[],test:null,complete:false,error:""};
 return active;
}
function getSession(state){
 if(!active||active.index!==state.index||active.mode!==state.mode&&active.complete===false)
  return makeSession(state);
 return active;
}
const keyboard=(target="micro-typed")=>'<details class="ms-keyboard"><summary>⌨ Russian letters (optional keyboard)</summary>'+
 ['ё й ц у к е н г ш щ з х ъ','ф ы в а п р о л д ж э','я ч с м и т ь б ю'].map(row=>
  '<div>'+row.split(" ").map(ch=>'<button type="button" data-micro="letter-key" data-char="'+ch+'">'+ch+'</button>').join("")+'</div>').join("")+
 '<div><button type="button" data-micro="letter-key" data-char=" " class="ms-space">Space</button>'+
 '<button type="button" data-micro="delete-key">⌫</button></div></details>';
function currentQuestions(step,mode){
 return microQuestions(step).slice(0,modeInfo[mode].questions);
}
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
 '<h2>'+esc(step.title)+'</h2><p>'+esc(step.description)+'</p>'+
 detail+
 '<div class="ms-study-buttons"><button type="button" data-micro="hear" class="ms-outline" '+
 (hasAudio()?"":"disabled")+' aria-label="Listen to the Russian model">🔊 Hear it</button>'+
 '<button type="button" data-micro="hear-slow" class="ms-outline" '+(hasAudio()?"":"disabled")+'>'+
 '0.7× Slowly</button></div>'+
 (!hasAudio()?'<p class="ms-hint">Russian audio is unavailable here. Look at the Russian letters and read them aloud if you can. This is not scored as listening.</p>':"")+
 '<p class="ms-hint">Spend a minute looking and listening. You do not need to rush. Say the model aloud if you feel comfortable.</p>'+
 '<button type="button" class="ms-primary" data-micro="start">I am ready for a tiny check →</button></section>';
}
function questionCard(q,index,total,session,fast=false){
 const opts=(fast?session.test?.options:session.options)||[];
 const choices=q.options?'<div class="ms-choices">'+opts.map((value,i)=>
  '<button type="button" data-micro="'+(fast?"skip-choice":"choice")+'" data-choice="'+i+'" '+
    (session.feedback?"disabled":"")+'>'+esc(value)+'</button>').join("")+'</div>':
  '<form id="micro-answer-form"><label for="micro-typed">Write in Russian</label>'+
   '<input id="micro-typed" lang="ru" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" required value="'+esc(session.typed)+'"/>'+
   '<button type="submit" class="ms-primary">Check my answer</button>'+keyboard()+'</form>';
 return '<section class="ms-question"><div class="ms-section-label">'+(fast?"OPTIONAL FAST-TRACK TEST":"2 · YOUR TINY CHECK")+
 '</div><span class="ms-qlabel">Question '+(index+1)+' / '+total+'</span>'+
 '<div class="ms-qbar"><i style="width:'+Math.round(index/Math.max(1,total)*100)+'%"></i></div>'+
 '<h2>'+esc(q.prompt)+'</h2>'+choices+
 (!fast&&session.feedback?'<div class="ms-feedback '+(session.feedback.correct?"good":"retry")+'" role="status"><strong>'+
 (session.feedback.correct?"✓ You got it!":"↺ It takes practice — no penalty")+'</strong>'+
 '<p>'+esc(q.explanation)+'</p>'+
 '<p><strong>Model:</strong> <span lang="'+(/[\u0400-\u052F]/u.test(q.answer)?"ru":"en")+'">'+esc(q.answer)+'</span></p>'+
 '<button type="button" data-micro="'+(session.feedback.correct?"continue":"retry")+'" class="ms-primary">'+
 (session.feedback.correct?"Continue →":"Practise this again ↻")+'</button></div>':"")+
 (fast?'<p class="ms-hint">All six answers must be correct to skip ahead. No answers are shown during the test. If you miss one, you can keep learning normally.</p>':"")+
 '</section>';
}
function summary(state){
 const chapters=Array.from({length:13},(_,i)=>{
  const list=FIRST_STEPS.filter(s=>s.chapter===i+1),count=list.filter(s=>FIRST_STEPS.indexOf(s)<state.index).length;
  return {number:i+1,count,total:list.length};
 });
 return '<details class="ms-roadmap"><summary>Your learning staircase · '+state.index+'/'+MICRO_TOTAL+' tiny steps</summary>'+
 '<div>'+chapters.map(c=>'<div><span>'+(c.number<=11?"Letter family "+c.number:"First conversations "+(c.number-11))+
 '</span><b>'+c.count+'/'+c.total+'</b><i><em style="width:'+Math.round(c.count/c.total*100)+'%"></em></i></div>').join("")+'</div>'+
 '</details>';
}
function startHeader(state,step){
 const pct=Math.round(state.index/MICRO_TOTAL*100);
 return '<section class="ms-hero"><span>SHAIRA · RUSSIAN FROM ABSOLUTE ZERO</span>'+
 '<h1>One small step at a time.</h1>'+
 '<p>No Russian knowledge is required. We will teach <strong>one new letter</strong>, then a sound, a syllable, a tiny word and finally short phrases. You choose the pace.</p>'+
 '<div class="ms-progress-numbers"><strong>'+state.index+' / '+MICRO_TOTAL+'</strong><span>tiny steps completed</span></div>'+
 '<div class="ms-progress"><i style="width:'+pct+'%"></i></div>'+
 (step?'<p class="ms-next">Next: <b>'+esc(step.title)+'</b> · about 2–5 minutes</p>':"")+
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
 return '<section class="ms-success"><span>✓</span><h1>Well done — one tiny step.</h1>'+
 '<p>You practised <strong>'+esc(old.title)+'</strong>. You can continue immediately or return later. Your progress is saved.</p>'+
 '<p class="ms-hint">Small, repeatable successes matter more than speed.</p>'+
 '<button type="button" data-micro="next" class="ms-primary">'+
 (state.index>=MICRO_TOTAL?"Open your full Russian course":"Learn one more small thing →")+'</button></section>';
}
function fastPanel(state,session){
 const test=session.test;
 if(test.result)return '<section class="ms-success '+(test.result.ok?"":"ms-almost")+'"><span>'+(test.result.ok?"✓":"↺")+'</span>'+
 '<h1>'+(test.result.ok?"Three steps checked!":"Keep building your foundations")+'</h1>'+
 '<p>'+test.result.score+'/6 correct. '+(test.result.ok?
 "You proved the next three small skills and can continue from a later rung.":
 "Skipping requires six correct answers. Nothing was lost. The normal lessons will teach you every missing skill.")+'</p>'+
 '<button type="button" data-micro="back" class="ms-primary">'+
 (test.result.ok?"Continue from my new step →":"Return to my small lesson →")+'</button></section>';
 const q=test.questions[test.question];
 return '<section class="ms-fast-intro"><h2>Optional: prove you are ready for faster steps</h2>'+
 '<p>This is not the default route. Answer six short questions about the next three rungs with no clues. All six must be correct to skip them.</p>'+
 '<button type="button" data-micro="cancel-skip" class="ms-back">← Keep the gentle path</button></section>'+
 questionCard(q,test.question,test.questions.length,{...session,test:{...test,options:test.options[test.question]}},true);
}
export function firstStepsHtml(){
 const state=readMicro(),step=microStepAt(state.index);
 const s=getSession(state);
 if(s.complete&&s.index<state.index)return startHeader(state,step)+success(state,s)+summary(state);
 if(state.index>=MICRO_TOTAL)return '<section class="ms-success"><span>🎓</span><h1>Your Cyrillic foundation is ready.</h1>'+
 '<p>You have practised all 33 letters, 11 syllables, tiny Russian words and twelve first phrases in small steps.</p>'+
 '<p>This is not a Russian proficiency certificate. Your full guided course now develops longer vocabulary, grammar, listening, reading, writing and conversation.</p>'+
 '<a href="#today" class="ms-primary ms-link">Continue to the full Russian course →</a></section>'+summary(state);
 return startHeader(state,step)+modes(state)+
 (s.test?fastPanel(state,s):s.phase==="study"?studyCard(step):
    questionCard(microQuestions(step).slice(0,modeInfo[state.mode].questions)[s.question],
      s.question,modeInfo[state.mode].questions,{...s,options:s.options[s.question]||[]},false))+
 (s.phase==="study"&&!s.test&&state.index>=3&&state.index<=MICRO_TOTAL-MICRO_SKIP_SIZE?
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
 const questions=microQuestions(microStepAt(s.index)).slice(0,modeInfo[state.mode].questions),
  q=questions[s.question];
 if(!q)return;
 const correct=matchesMicroAnswer(q,value);
 s.feedback={correct};if(!correct)recordMicroMistake();
 if(correct)s.answers.push({id:q.id,value:String(value)});
 api.render();
}
function fastAnswer(value,api){
 const state=readMicro(),s=getSession(state),test=s.test;
 if(!test||test.result||state.index!==test.start)return;
 const q=test.questions[test.question];
 test.answers.push({id:q.id,value:String(value)});
 test.question++;
 if(test.question>=test.questions.length){
  const score=test.questions.filter((q,i)=>matchesMicroAnswer(q,test.answers[i].value)).length;
  const pass=score===test.questions.length;
  const result=pass?microSkipRungs(test.start,test.answers):{ok:false};
  test.result={ok:pass&&result.ok,score};
  if(pass&&!result.ok)s.error="Could not save your fast-track result. Try again.";
 }else resetOptions(s,test.questions[test.question],true);
 api.render();
}
export function firstStepsAction(button,api){
 const action=button.dataset.micro,state=readMicro(),s=getSession(state);
 if(action==="mode"){
  const mode=button.dataset.value;
  if(changeMicroMode(mode)){makeSession(readMicro());api.render();}
  else api.notice?.("Could not save your difficulty preference.");
  return;
 }
 if(action==="hear"||action==="hear-slow"){
  if(!hasAudio())return;
  const step=microStepAt(state.index);
  if(step)api.speak(step.model,action==="hear-slow"?0.6:0.78);
  return;
 }
 if(action==="next"||action==="back"){
  makeSession(readMicro());api.render();return;
 }
 if(action==="cancel-skip"){s.test=null;api.render();return;}
 if(action==="fast-track"&&state.index>=3&&state.index<=MICRO_TOTAL-MICRO_SKIP_SIZE){
  const questions=FIRST_STEPS.slice(state.index,state.index+MICRO_SKIP_SIZE)
   .flatMap(step=>microQuestions(step).slice(0,2).map(q=>({...q,id:step.id+":"+q.id})));
  s.test={start:state.index,questions,answers:[],options:[],question:0,result:null};
  resetOptions(s,questions[0],true);api.render();return;
 }
 if(action==="start"&&s.phase==="study"&&!s.test){
  s.phase="quiz";s.options=[];s.question=0;s.feedback=null;s.answers=[];
  resetOptions(s,microQuestions(microStepAt(state.index))[0]);api.render();return;
 }
 if(action==="choice"&&!s.test&&s.phase==="quiz"){
  const q=microQuestions(microStepAt(state.index))[s.question],
   choices=s.options[s.question]||[],i=Number(button.dataset.choice);
  if(!q||q.kind!=="choice"||!Number.isInteger(i)||i<0||i>=choices.length)return;
  mainAnswer(choices[i],api);return;
 }
 if(action==="skip-choice"&&s.test){
  const test=s.test,q=test.questions[test.question],opts=test.options[test.question]||[],
   i=Number(button.dataset.choice);
  if(!q||!Number.isInteger(i)||i<0||i>=opts.length)return;
  fastAnswer(opts[i],api);return;
 }
 if(action==="retry"&&s.feedback&&!s.feedback.correct){
  s.feedback=null;s.typed="";resetOptions(s,microQuestions(microStepAt(state.index))[s.question]);api.render();return;
 }
 if(action==="continue"&&s.feedback?.correct){
  s.feedback=null;s.typed="";s.question++;
  const q=microQuestions(microStepAt(state.index)).slice(0,modeInfo[state.mode].questions);
  if(s.question>=q.length){
   const result=finishMicroRung(state.index,s.answers);
   if(result.ok){s.complete=true;api.render();}
   else {s.error=result.reason;s.phase="study";s.answers=[];s.question=0;api.notice?.(result.reason);api.render();}
  }else {resetOptions(s,q[s.question]);api.render();}
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
export function firstStepsSubmit(event,api){
 if(event.target.id!=="micro-answer-form")return false;
 event.preventDefault();
 const state=readMicro(),s=getSession(state);
 if(s.phase!=="quiz"||s.test||s.feedback)return true;
 const input=document.getElementById("micro-typed");
 if(input)mainAnswer(input.value,api);
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
