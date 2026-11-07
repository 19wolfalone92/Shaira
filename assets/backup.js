/* Shaira's explicit user-controlled progress export/import. No cloud, network, analytics or tokens. */
const LEGACY="shaira-progress-v1";
const ACADEMY="shaira-academy-v1";
const LABS="shaira-labs-v1";
const DAILY="shaira-daily-v1";
const MASTERY="shaira-mastery-v1";
const CASES="shaira-case-practice-v1";
const LISTENING="shaira-listening-v1";
const MIXER="shaira-mixed-practice-v1";
const SCENARIOS="shaira-scenarios-v1";
export const BACKUP_FORMAT="shaira-learning-backup";
export const BACKUP_VERSION=1;
function object(x){return x!==null&&typeof x==="object"&&!Array.isArray(x);}
function safeObj(x){if(!object(x))return {};const o=Object.create(null);for(const [k,v] of Object.entries(x)){if(k==="__proto__"||k==="constructor"||k==="prototype")continue;o[k]=v;}return o;}
function cleanProgress(x){
  if(!object(x))return {language:"en",completed:[]};
  const completed=Array.isArray(x.completed)?[...new Set(x.completed.filter(v=>typeof v==="string"&&v.length<90))].slice(0,1000):[];
  return {language:"en",completed};
}
function cleanAcademy(x){
  if(!object(x))return {done:{},memory:{},drafts:{},points:0};
  const done=Object.create(null),memory=Object.create(null),drafts=Object.create(null);
  for(const [id,t] of Object.entries(safeObj(x.done)).slice(0,3000)){
    if(id.length<=180&&typeof t==="number"&&Number.isFinite(t)&&t>=0)done[id]=t;
  }
  for(const [id,r] of Object.entries(safeObj(x.memory)).slice(0,8000)){
    if(id.length>180||!object(r))continue;
    const stage=Number(r.stage),due=Number(r.due),seen=Number(r.seen),correct=Number(r.correct);
    if(Number.isInteger(stage)&&stage>=-1&&stage<=4&&Number.isFinite(due)&&due>=0&&
      Number.isInteger(seen)&&seen>=0&&Number.isInteger(correct)&&correct>=0&&correct<=seen){
      memory[id]={stage,due,seen,correct};
    }
  }
  for(const [id,s] of Object.entries(safeObj(x.drafts)).slice(0,500)){
    if(id.length<=180&&typeof s==="string"&&s.length<=100000)drafts[id]=s;
  }
  const points=Number.isInteger(x.points)&&x.points>=0&&x.points<=10000000?x.points:0;
  return {done,memory,drafts,points};
}
function cleanLabs(x){
  const grammar=Object.create(null),readings=Object.create(null),drafts=Object.create(null),draftUpdated=Object.create(null);
  if(!object(x))return {grammar,readings,drafts,draftUpdated};
  for(const [id,r] of Object.entries(safeObj(x.grammar)).slice(0,30)){
    if(!["starter","a1","a2","b1","b2"].includes(id)||!object(r))continue;
    const items=Object.create(null);
    for(const [qid,record] of Object.entries(safeObj(r.items)).slice(0,300)){
      if(qid.length>80||!object(record))continue;
      const seen=Number(record.seen),correct=Number(record.correct),last=Number(record.last)||0;
      if(Number.isInteger(seen)&&seen>=0&&Number.isInteger(correct)&&correct>=0&&correct<=seen&&Number.isFinite(last)&&last>=0){
        items[qid]={seen,correct,last};
      }
    }
    grammar[id]={
      best:Number.isInteger(r.best)&&r.best>=0&&r.best<=10?r.best:0,
      attempts:Number.isInteger(r.attempts)&&r.attempts>=0&&r.attempts<=100000?r.attempts:0,
      last:Number.isFinite(r.last)&&r.last>=0?r.last:0,
      lastScore:Number.isInteger(r.lastScore)&&r.lastScore>=0&&r.lastScore<=10?r.lastScore:0,items
    };
  }
  for(const [id,r] of Object.entries(safeObj(x.readings)).slice(0,100)){
    if(id.length>100||!object(r))continue;
    readings[id]={
      passed:r.passed===true,
      lastPassed:r.lastPassed===true,
      lastScore:Number.isInteger(r.lastScore)&&r.lastScore>=0&&r.lastScore<=10?r.lastScore:0,
      attempts:Number.isInteger(r.attempts)&&r.attempts>=0&&r.attempts<=100000?r.attempts:0,
      last:Number.isFinite(r.last)&&r.last>=0?r.last:0
    };
  }
  for(const [id,d] of Object.entries(safeObj(x.drafts)).slice(0,200)){
    if(id.length<=180&&typeof d==="string"&&d.length<=100000)drafts[id]=d;
  }
  for(const [id,t] of Object.entries(safeObj(x.draftUpdated)).slice(0,200)){
    if(id.length<=180&&Number.isFinite(t)&&t>=0&&id in drafts)draftUpdated[id]=t;
  }
  return {grammar,readings,drafts,draftUpdated};
}
function cleanDaily(x){
  const result={index:0,startedAt:0,startedDate:"",goal:40,marks:{},challenges:{},finished:[],errors:{}};
  if(!object(x))return result;
  if(Number.isInteger(x.index)&&x.index>=0&&x.index<=210)result.index=x.index;
  if(Number.isFinite(x.startedAt)&&x.startedAt>=0)result.startedAt=x.startedAt;
  if(typeof x.startedDate==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x.startedDate))result.startedDate=x.startedDate;
  if([20,40,60].includes(x.goal))result.goal=x.goal;
  const marks=Object.create(null),challenges=Object.create(null);
  for(const [id,on] of Object.entries(safeObj(x.marks)).slice(0,1000)){
    if(id.length<=150&&on===true)marks[id]=true;
  }
  for(const [id,record] of Object.entries(safeObj(x.challenges)).slice(0,250)){
    if(!/^\d{1,3}$/.test(id)||Number(id)>209||!object(record))continue;
    challenges[id]={
      quiz:record.quiz===true,spell:record.spell===true,oral:record.oral===true,
      wrongQuiz:Number.isInteger(record.wrongQuiz)&&record.wrongQuiz>=0&&record.wrongQuiz<=10000?record.wrongQuiz:0,
      wrongSpell:Number.isInteger(record.wrongSpell)&&record.wrongSpell>=0&&record.wrongSpell<=10000?record.wrongSpell:0
    };
  }
  result.marks=marks;result.challenges=challenges;
  if(Array.isArray(x.finished)){
    result.finished=x.finished.slice(-210).filter(item=>object(item)&&
      Number.isInteger(item.day)&&item.day>=0&&item.day<210&&
      ["starter","a1","a2","b1","b2"].includes(item.stage)&&
      typeof item.date==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)).map(item=>({
        day:item.day,stage:item.stage,date:item.date,
        completedAt:Number.isFinite(item.completedAt)&&item.completedAt>=0?item.completedAt:0,
        wrongQuiz:Number.isInteger(item.wrongQuiz)&&item.wrongQuiz>=0?Math.min(10000,item.wrongQuiz):0,
        wrongSpell:Number.isInteger(item.wrongSpell)&&item.wrongSpell>=0?Math.min(10000,item.wrongSpell):0
    }));
  }
  return result;
}

function cleanMastery(x){
  const studios=Object.create(null),checkpoints=Object.create(null),data=safeObj(x);
  const cleanRecord=(r,max)=>({
    passed:r.passed===true,lastPassed:r.lastPassed===true,
    last:Number.isFinite(r.last)&&r.last>=0?r.last:0,
    attempts:Number.isInteger(r.attempts)&&r.attempts>=0&&r.attempts<=100000?r.attempts:0,
    best:Number.isInteger(r.best)&&r.best>=0&&r.best<=max?r.best:0,
    lastScore:Number.isInteger(r.lastScore)&&r.lastScore>=0&&r.lastScore<=max?r.lastScore:0
  });
  for(const [id,v] of Object.entries(safeObj(data.studios)).slice(0,60)){
    if(!/^[a-z0-9][a-z0-9-]{0,70}$/.test(id)||!object(v))continue;
    studios[id]=cleanRecord(v,3);
  }
  for(const [id,v] of Object.entries(safeObj(data.checkpoints))){
    if(!["starter","a1","a2","b1","b2"].includes(id)||!object(v))continue;
    checkpoints[id]={...cleanRecord(v,10),
      correctTyped:Number.isInteger(v.correctTyped)&&v.correctTyped>=0&&v.correctTyped<=2?v.correctTyped:0,
      correctReading:Number.isInteger(v.correctReading)&&v.correctReading>=0&&v.correctReading<=2?v.correctReading:0
    };
  }
  return {studios,checkpoints};
}

function cleanCasePractice(x){
 const data=safeObj(x),items=Object.create(null),sessions=[];
 for(const [id,v]of Object.entries(safeObj(data.items)).slice(0,350)){
   if(!/^[a-z-]{1,40}:(?:sg|pl):(?:nom|gen|dat|acc|ins|pre)$/.test(id)||!object(v))continue;
   const seen=Number(v.seen),correct=Number(v.correct),last=Number(v.last);
   if(Number.isInteger(seen)&&seen>=0&&seen<=100000&&Number.isInteger(correct)&&correct>=0&&correct<=seen&&Number.isFinite(last)&&last>=0){
     items[id]={seen,correct,last};
   }
 }
 if(Array.isArray(data.sessions)){
   for(const v of data.sessions.slice(-100)){
     if(!object(v)||!Number.isInteger(v.score)||v.score<0||v.score>10||!Number.isFinite(v.last)||v.last<0)continue;
     sessions.push({score:v.score,passed:v.passed===true,last:v.last});
   }
 }
 return {items,sessions};
}
function cleanListening(x){
  const items=Object.create(null);
  const clips=safeObj(safeObj(x).items);
  for(const [id,v] of Object.entries(clips).slice(0,100)){
    if(!/^audio-[a-z0-9-]{1,60}$/.test(id)||!object(v))continue;
    const attempts=Number(v.attempts),last=Number(v.last);
    if(!Number.isInteger(attempts)||attempts<0||attempts>100000||!Number.isFinite(last)||last<0)continue;
    items[id]={attempts,last,passed:v.passed===true,lastPassed:v.lastPassed===true};
  }
  return {items};
}
function cleanMixer(x){
  const data=safeObj(x),items=Object.create(null),sessions=[];
  for(const [id,v] of Object.entries(safeObj(data.items)).slice(0,7000)){
    if(!/^[a-z]{3,10}:[a-z0-9:_-]{1,150}$/.test(id)||!object(v))continue;
    const seen=Number(v.seen),correct=Number(v.correct),streak=Number(v.streak),
      last=Number(v.last),due=Number(v.due);
    if(!Number.isInteger(seen)||seen<0||seen>100000||
       !Number.isInteger(correct)||correct<0||correct>seen||
       !Number.isInteger(streak)||streak<0||streak>5||
       !Number.isFinite(last)||last<0||!Number.isFinite(due)||due<0)continue;
    items[id]={seen,correct,streak,last,due};
  }
  if(Array.isArray(data.sessions))for(const v of data.sessions.slice(-150)){
    if(!object(v)||!["starter","a1","a2","b1","b2"].includes(v.stage)||
     !Number.isInteger(v.score)||v.score<0||v.score>12||
     !Number.isInteger(v.productive)||v.productive<0||v.productive>v.score||
     !Number.isFinite(v.last)||v.last<0)continue;
    sessions.push({stage:v.stage,score:v.score,productive:v.productive,
      passed:v.passed===true&&v.score>=9&&v.productive>=2,last:v.last});
  }
  return {items,sessions};
}
function cleanScenarios(x){
 const records=Object.create(null);
 const data=safeObj(safeObj(x).records);
 for(const [id,v]of Object.entries(data).slice(0,40)){
  if(!/^[a-z][a-z0-9-]{1,60}$/.test(id)||!object(v))continue;
  const attempts=Number(v.attempts),best=Number(v.best),score=Number(v.lastScore),last=Number(v.last);
  if(!Number.isInteger(attempts)||attempts<0||attempts>100000||
     !Number.isInteger(best)||best<0||best>3||
     !Number.isInteger(score)||score<0||score>3||
     !Number.isFinite(last)||last<0)continue;
  records[id]={attempts,best,last,lastScore:score,passed:v.passed===true&&best>=2,
    lastPassed:score>=2};
 }
 return {records};
}
function parseExisting(storage,key){
  try{return JSON.parse(storage.getItem(key)||"{}");}
  catch{return {};}
}
export function buildBackup(storage=globalThis.localStorage){
  return {
    format:BACKUP_FORMAT,version:BACKUP_VERSION,exportedAt:new Date().toISOString(),
    legacy:cleanProgress(parseExisting(storage,LEGACY)),
    academy:cleanAcademy(parseExisting(storage,ACADEMY)),
    labs:cleanLabs(parseExisting(storage,LABS)),
    daily:cleanDaily(parseExisting(storage,DAILY)),
    mastery:cleanMastery(parseExisting(storage,MASTERY)),
    cases:cleanCasePractice(parseExisting(storage,CASES)),
    listening:cleanListening(parseExisting(storage,LISTENING)),
    mixer:cleanMixer(parseExisting(storage,MIXER)),
    scenarios:cleanScenarios(parseExisting(storage,SCENARIOS))
  };
}
export function readBackup(json){
  if(typeof json!=="string"||json.length>3000000)throw new Error("Backup is too large or is not JSON text.");
  let data;try{data=JSON.parse(json);}catch{throw new Error("Invalid JSON backup.");}
  if(!object(data)||data.format!==BACKUP_FORMAT||data.version!==BACKUP_VERSION)throw new Error("Not a compatible Shaira backup.");
  if(!object(data.legacy)||!object(data.academy))throw new Error("The backup is missing required progress data.");
  return {legacy:cleanProgress(data.legacy),academy:cleanAcademy(data.academy),labs:cleanLabs(data.labs),daily:cleanDaily(data.daily),mastery:cleanMastery(data.mastery),cases:cleanCasePractice(data.cases),listening:cleanListening(data.listening),mixer:cleanMixer(data.mixer),scenarios:cleanScenarios(data.scenarios)};
}
export function restoreBackup(json,storage=globalThis.localStorage){
  const parsed=readBackup(json); // do all validation before changing device state
  const beforeLegacy=storage.getItem(LEGACY),beforeAcademy=storage.getItem(ACADEMY),beforeLabs=storage.getItem(LABS),beforeDaily=storage.getItem(DAILY),beforeMastery=storage.getItem(MASTERY),beforeCases=storage.getItem(CASES),beforeListening=storage.getItem(LISTENING),beforeMixer=storage.getItem(MIXER),beforeScenarios=storage.getItem(SCENARIOS);
  try{
    storage.setItem(LEGACY,JSON.stringify(parsed.legacy));
    storage.setItem(ACADEMY,JSON.stringify(parsed.academy));
    storage.setItem(LABS,JSON.stringify(parsed.labs));
    storage.setItem(DAILY,JSON.stringify(parsed.daily));
    storage.setItem(MASTERY,JSON.stringify(parsed.mastery));
    storage.setItem(CASES,JSON.stringify(parsed.cases));
    storage.setItem(LISTENING,JSON.stringify(parsed.listening));
    storage.setItem(MIXER,JSON.stringify(parsed.mixer));
    storage.setItem(SCENARIOS,JSON.stringify(parsed.scenarios));
  }catch(error){
    try{
      if(beforeLegacy===null)storage.removeItem?.(LEGACY);else storage.setItem(LEGACY,beforeLegacy);
      if(beforeAcademy===null)storage.removeItem?.(ACADEMY);else storage.setItem(ACADEMY,beforeAcademy);
      if(beforeLabs===null)storage.removeItem?.(LABS);else storage.setItem(LABS,beforeLabs);
      if(beforeDaily===null)storage.removeItem?.(DAILY);else storage.setItem(DAILY,beforeDaily);
      if(beforeMastery===null)storage.removeItem?.(MASTERY);else storage.setItem(MASTERY,beforeMastery);
      if(beforeCases===null)storage.removeItem?.(CASES);else storage.setItem(CASES,beforeCases);
      if(beforeListening===null)storage.removeItem?.(LISTENING);else storage.setItem(LISTENING,beforeListening);
      if(beforeMixer===null)storage.removeItem?.(MIXER);else storage.setItem(MIXER,beforeMixer);
      if(beforeScenarios===null)storage.removeItem?.(SCENARIOS);else storage.setItem(SCENARIOS,beforeScenarios);
    }catch{}
    throw new Error("Could not write backup to this device: "+error.message);
  }
  return parsed;
}
export function downloadBackup(){
  const json=JSON.stringify(buildBackup(),null,2);
  const blob=new Blob([json],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;
  anchor.download="shaira-progress-"+new Date().toISOString().slice(0,10)+".json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
  return true;
}
