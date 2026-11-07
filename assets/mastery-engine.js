// Structured educational assessments, stored only in localStorage.
// No server, account, AI scoring or claim of externally certified CEFR.
import {studioLessons,studioForUnit} from "./studio-lessons.js";
import {stageCheckpoints,checkpointForStage} from "./stage-checkpoints.js";

export const MASTERY_KEY="shaira-mastery-v1";
const validObject=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const obj=x=>validObject(x)?x:{};
export const normaliseAnswer=s=>String(s??"").normalize("NFC").toLocaleLowerCase("ru-RU")
 .replace(/[\u0300-\u036f]/gu,"").replace(/[«»„”“"!?.,;:—–\-()\s]+/gu," ").trim();
export const answerMatches=(entered,q)=>[q.answer,...(q.variants||[])].some(s=>normaliseAnswer(entered)===normaliseAnswer(s));
const time=v=>typeof v==="number"&&Number.isFinite(v)&&v>=0?v:0;
const nonnegative=v=>Number.isInteger(v)&&v>=0&&v<=100000?v:0;
export function loadMastery(storage=globalThis.localStorage){
 try{
  const raw=obj(JSON.parse(storage.getItem(MASTERY_KEY)||"{}"));
  const studios={},checkpoints={};
  for(const x of studioLessons){
   const record=obj(obj(raw.studios)[x.id]);
   if(!Object.keys(record).length)continue;
   studios[x.id]={last:time(record.last),passed:record.passed===true,
     best:Math.min(3,nonnegative(record.best)),lastScore:Math.min(3,nonnegative(record.lastScore)),
     attempts:nonnegative(record.attempts)};
  }
  for(const pack of stageCheckpoints){
   const rec=obj(obj(raw.checkpoints)[pack.stage]);
   if(!Object.keys(rec).length)continue;
   checkpoints[pack.stage]={last:time(rec.last),passed:rec.passed===true,
     lastPassed:rec.lastPassed===true,best:Math.min(10,nonnegative(rec.best)),
     lastScore:Math.min(10,nonnegative(rec.lastScore)),attempts:nonnegative(rec.attempts),
     correctTyped:Math.min(2,nonnegative(rec.correctTyped)),
     correctReading:Math.min(2,nonnegative(rec.correctReading))};
  }
  return {studios,checkpoints};
 }catch{return {studios:{},checkpoints:{}};}
}
export function writeMastery(data,storage=globalThis.localStorage){
 try{storage.setItem(MASTERY_KEY,JSON.stringify(data));return true;}catch{return false;}
}
function nextRecord(before,score,max,passed,extra={},now=Date.now()){
 return {last:now,passed:before.passed===true||passed,lastPassed:passed,
   best:Math.max(nonnegative(before.best),score),
   lastScore:score,attempts:nonnegative(before.attempts)+1,...extra};
}
export function gradeStudio(unitId,answers,storage=globalThis.localStorage,now=Date.now()){
 const lesson=studioForUnit(unitId);
 if(!lesson||!Array.isArray(answers)||answers.length!==3)return null;
 const results=lesson.checks.map((q,i)=>({correct:answerMatches(answers[i],q),question:q,entered:String(answers[i]??"")}));
 const model=lesson.examples[1];
 results.push({correct:normaliseAnswer(answers[2])===normaliseAnswer(model.ru),
   question:{prompt:{en:model.en,tl:model.tl},answer:model.ru,reason:lesson.tip},entered:String(answers[2]??"")});
 const score=results.filter(r=>r.correct).length,passed=score===3;
 const record=loadMastery(storage),previous=obj(record.studios[unitId]);
 record.studios[unitId]=nextRecord(previous,score,3,passed,{},now);
 return {score,passed,results,saved:writeMastery(record,storage),record:record.studios[unitId]};
}
export function gradeCheckpoint(stage,answers,storage=globalThis.localStorage,now=Date.now()){
 const pack=checkpointForStage(stage);
 if(!pack||!Array.isArray(answers)||answers.length!==pack.questions.length)return null;
 const results=pack.questions.map((q,i)=>({
   correct:answerMatches(answers[i],q),question:q,entered:String(answers[i]??"")
 }));
 const score=results.filter(r=>r.correct).length;
 const correctTyped=results.filter((r,i)=>pack.questions[i].type==="type"&&r.correct).length;
 const correctReading=results.filter((r,i)=>i>=6&&i<=7&&r.correct).length;
 // At least one productive written answer and at least one fresh reading comprehension answer.
 const passed=score>=8&&correctTyped>=1&&correctReading>=1;
 const record=loadMastery(storage),previous=obj(record.checkpoints[stage]);
 record.checkpoints[stage]=nextRecord(previous,score,10,passed,{correctTyped,correctReading},now);
 return {score,passed,results,correctTyped,correctReading,saved:writeMastery(record,storage),
  record:record.checkpoints[stage]};
}
export function gradeStatus(storage=globalThis.localStorage){
 const state=loadMastery(storage);
 return {
  studiosCompleted:Object.values(state.studios).filter(x=>x.passed).length,
  studiosTotal:studioLessons.length,
  stageReviews:stageCheckpoints.map(p=>({stage:p.stage,...obj(state.checkpoints[p.stage])}))
 };
}
