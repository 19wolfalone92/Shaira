// Tiny, verified learner-led staircase before the 210-session adult Russian curriculum.
// Default Gentle: no mandatory typing, one letter or tiny word per rung.
// More difficulty is always optional; skipping requires a fresh mastery check.
import {FIRST_STEPS,MICRO_TOTAL,FIRST_MODES,modeInfo,microQuestions} from "./first-steps-data.js";
export const MICRO_KEY="shaira-microsteps-v1";
export const MICRO_SKIP_SIZE=3;
const safe=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const parse=(storage,key)=>{try{return safe(JSON.parse(storage.getItem(key)||"{}"));}catch{return{};}};
const normalized=s=>String(s??"").normalize("NFC").replace(/[«»„”“"!?.,;:—–\s]+/gu," ").trim();
export const microNormal=s=>normalized(s).toLocaleLowerCase("ru-RU");
const validMode=v=>FIRST_MODES.includes(v)?v:"gentle";
const validIndex=v=>Number.isInteger(v)&&v>=0&&v<=MICRO_TOTAL?v:0;
export function normalizeMicroState(raw){
 const data=safe(raw),index=validIndex(data.index),mistakes={};
 for(const [key,count] of Object.entries(safe(data.mistakes))){
  if(/^\d{1,2}$/.test(key)&&Number(key)<MICRO_TOTAL&&Number(key)<=index&&
     Number.isInteger(count)&&count>0&&count<=100000)mistakes[Number(key)]=count;
 }
 return {index,mode:validMode(data.mode),enrolled:data.enrolled===true,mistakes,
  finished:Array.isArray(data.finished)?data.finished.slice(-MICRO_TOTAL).filter(x=>
   x&&Number.isInteger(x.index)&&x.index>=0&&x.index<MICRO_TOTAL&&
   ["learned","tested"].includes(x.method)&&Number.isFinite(x.at)&&x.at>=0).map(({index,method,at})=>({index,method,at})):[],
  wrong:Number.isInteger(data.wrong)&&data.wrong>=0&&data.wrong<=100000?data.wrong:0,
  totalPractice:Number.isInteger(data.totalPractice)&&data.totalPractice>=0&&data.totalPractice<=100000?data.totalPractice:0};
}
export const readMicro=(storage=globalThis.localStorage)=>normalizeMicroState(parse(storage,MICRO_KEY));
export function saveMicro(state,storage=globalThis.localStorage){
 try{storage.setItem(MICRO_KEY,JSON.stringify(state));return true;}catch{return false;}
}
export function changeMicroMode(mode,storage=globalThis.localStorage){
 if(!FIRST_MODES.includes(mode))return false;
 const state=readMicro(storage);state.mode=mode;
 return saveMicro(state,storage);
}
export const microQuestionsFor=(rung,mode)=>microQuestions(rung).slice(0,modeInfo[validMode(mode)].questions);
export function matchesMicroAnswer(question,value){
 if(!question)return false;
 const normalize=question.letterCase?normalized:microNormal;
 return normalize(question.answer)===normalize(value);
}
function validateAnswers(steps,answers){
 return Array.isArray(answers)&&answers.length===steps.length&&
   steps.every((q,i)=>answers[i]?.id===q.id&&matchesMicroAnswer(q,answers[i]?.value));
}
export function finishMicroRung(index,answers,storage=globalThis.localStorage,now=Date.now()){
 const state=readMicro(storage);
 if(!Number.isInteger(index)||index!==state.index||index>=MICRO_TOTAL)return {ok:false,reason:"This is not your current step."};
 const rung=FIRST_STEPS[index],questions=microQuestionsFor(rung,state.mode);
 if(!validateAnswers(questions,answers))return {ok:false,reason:"Finish the questions correctly first."};
 const next={...state,index:index+1,enrolled:true,finished:[...state.finished,{index,method:"learned",at:now}].slice(-MICRO_TOTAL),
  totalPractice:Math.min(100000,state.totalPractice+questions.length)};
 return saveMicro(next,storage)?{ok:true,state:next}:{ok:false,reason:"Could not save your step on this device."};
}
export function fastTrackQuestions(start){
 if(!Number.isInteger(start)||start<3||start>MICRO_TOTAL-MICRO_SKIP_SIZE)return [];
 return FIRST_STEPS.slice(start,start+MICRO_SKIP_SIZE).flatMap(step=>{
  const questions=microQuestions(step);
  return [questions[2],questions[step.kind==="letter"?1:0]].map(q=>({...q,id:step.id+":"+q.id}));
 });
}
export function microSkipRungs(start,answers,storage=globalThis.localStorage,now=Date.now()){
 const state=readMicro(storage);
 const questions=fastTrackQuestions(start);
 if(start!==state.index||!questions.length)
  return {ok:false,reason:"Fast-track opens after three steps and needs three more steps ahead."};
 if(!validateAnswers(questions,answers))return {ok:false,reason:"To fast-track, answer all six unseen checks correctly."};
 const finished=[...state.finished];
 for(let i=start;i<start+MICRO_SKIP_SIZE;i++)finished.push({index:i,method:"tested",at:now});
 const next={...state,index:start+MICRO_SKIP_SIZE,finished:finished.slice(-MICRO_TOTAL),
  totalPractice:Math.min(100000,state.totalPractice+questions.length)};
 return {ok:saveMicro(next,storage),state:next};
}
export function recordMicroMistake(storage=globalThis.localStorage,step){
 const state=readMicro(storage);state.wrong=Math.min(100000,state.wrong+1);
 const index=step??state.index;
 if(Number.isInteger(index)&&index>=0&&index<MICRO_TOTAL&&index<=state.index)
  state.mistakes[index]=Math.min(100000,(state.mistakes[index]||0)+1);
 return saveMicro(state,storage);
}
export function finishMicroReview(index,answers,storage=globalThis.localStorage){
 const state=readMicro(storage);
 if(!Number.isInteger(index)||index<0||index>=state.index||
    !validateAnswers(microQuestionsFor(FIRST_STEPS[index],state.mode),answers))return false;
 delete state.mistakes[index];
 return saveMicro(state,storage);
}
export function enrolInMicroPath(storage=globalThis.localStorage){
 const state=readMicro(storage);
 return state.enrolled||state.index>=MICRO_TOTAL||saveMicro({...state,enrolled:true},storage);
}
export function needsMicroStart(storage=globalThis.localStorage){
 const state=readMicro(storage);
 if(state.index>=MICRO_TOTAL)return false;
 const daily=parse(storage,"shaira-daily-v1");
 if(Number(daily.index)>0)return false;
 if(state.enrolled||state.index>0)return true;
 const legacy=parse(storage,"shaira-progress-v1"),
  academy=parse(storage,"shaira-academy-v1"),labs=parse(storage,"shaira-labs-v1"),
  mastery=parse(storage,"shaira-mastery-v1");
 if(Number(daily.startedAt)>0||(Array.isArray(daily.finished)&&daily.finished.length>0))return false;
 if(Array.isArray(legacy.completed)&&legacy.completed.length>0)return false;
 if(Object.keys(safe(academy.done)).length||Object.keys(safe(academy.memory)).length)return false;
 if(Object.keys(safe(labs.grammar)).length||Object.keys(safe(labs.readings)).length||
  Object.keys(safe(labs.drafts)).length)return false;
 if(Object.keys(safe(mastery.studios)).length||Object.keys(safe(mastery.checkpoints)).length)return false;
 return true;
}
