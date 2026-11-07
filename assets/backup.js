/* Shaira's explicit user-controlled progress export/import. No cloud, network, analytics or tokens. */
const LEGACY="shaira-progress-v1";
const ACADEMY="shaira-academy-v1";
const LABS="shaira-labs-v1";
export const BACKUP_FORMAT="shaira-learning-backup";
export const BACKUP_VERSION=1;
function object(x){return x!==null&&typeof x==="object"&&!Array.isArray(x);}
function safeObj(x){if(!object(x))return {};const o=Object.create(null);for(const [k,v] of Object.entries(x)){if(k==="__proto__"||k==="constructor"||k==="prototype")continue;o[k]=v;}return o;}
function cleanProgress(x){
  if(!object(x))return {language:"en",completed:[]};
  const completed=Array.isArray(x.completed)?[...new Set(x.completed.filter(v=>typeof v==="string"&&v.length<90))].slice(0,1000):[];
  return {language:x.language==="tl"?"tl":"en",completed};
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
  const grammar=Object.create(null),readings=Object.create(null),drafts=Object.create(null);
  if(!object(x))return {grammar,readings,drafts};
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
      last:Number.isFinite(r.last)&&r.last>=0?r.last:0,items
    };
  }
  for(const [id,r] of Object.entries(safeObj(x.readings)).slice(0,100)){
    if(id.length>100||!object(r))continue;
    readings[id]={
      passed:r.passed===true,
      attempts:Number.isInteger(r.attempts)&&r.attempts>=0&&r.attempts<=100000?r.attempts:0,
      last:Number.isFinite(r.last)&&r.last>=0?r.last:0
    };
  }
  for(const [id,d] of Object.entries(safeObj(x.drafts)).slice(0,200)){
    if(id.length<=180&&typeof d==="string"&&d.length<=100000)drafts[id]=d;
  }
  return {grammar,readings,drafts};
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
    labs:cleanLabs(parseExisting(storage,LABS))
  };
}
export function readBackup(json){
  if(typeof json!=="string"||json.length>3000000)throw new Error("Backup is too large or is not JSON text.");
  let data;try{data=JSON.parse(json);}catch{throw new Error("Invalid JSON backup.");}
  if(!object(data)||data.format!==BACKUP_FORMAT||data.version!==BACKUP_VERSION)throw new Error("Not a compatible Shaira backup.");
  if(!object(data.legacy)||!object(data.academy))throw new Error("The backup is missing required progress data.");
  return {legacy:cleanProgress(data.legacy),academy:cleanAcademy(data.academy),labs:cleanLabs(data.labs)};
}
export function restoreBackup(json,storage=globalThis.localStorage){
  const parsed=readBackup(json); // do all validation before changing device state
  const beforeLegacy=storage.getItem(LEGACY),beforeAcademy=storage.getItem(ACADEMY),beforeLabs=storage.getItem(LABS);
  try{
    storage.setItem(LEGACY,JSON.stringify(parsed.legacy));
    storage.setItem(ACADEMY,JSON.stringify(parsed.academy));
    storage.setItem(LABS,JSON.stringify(parsed.labs));
  }catch(error){
    try{
      if(beforeLegacy===null)storage.removeItem?.(LEGACY);else storage.setItem(LEGACY,beforeLegacy);
      if(beforeAcademy===null)storage.removeItem?.(ACADEMY);else storage.setItem(ACADEMY,beforeAcademy);
      if(beforeLabs===null)storage.removeItem?.(LABS);else storage.setItem(LABS,beforeLabs);
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
