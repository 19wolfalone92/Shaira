/* Diverse offline Russian practice assembled from curated, verified material.
 * Each question has a stable id, type, answer and English explanation.
 * The generator never claims to assess free conversation, pronunciation or essays.
 */
import {firstWordPacks} from "./first-words.js";
import {grammarDrills} from "./grammar-drills.js";
import {readingLibrary} from "./reading-library.js";
import {NOUNS,CASES,CASE_ITEMS} from "./declension-tables.js";
import {VERBS,VERB_FORMS} from "./verb-paradigms.js";
import {sentencePatterns,corrections} from "./practice-content.js";
export const MIX_KEY="shaira-mixed-practice-v1";
export const MIX_LENGTH=12;
export const MIX_STAGES=["starter","a1","a2","b1","b2"];
export const MIX_TYPES=["recognize","recall","spell","grammar","case","verb","order","translate","repair","read","match","hear","dictate"];
const DAY=86400000, INTERVALS=[1,3,7,14,30];
const safe=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
const finite=x=>Number.isFinite(x)&&x>=0?x:0;
const int=x=>Number.isInteger(x)&&x>=0&&x<=100000?x:0;
export function normalizeRussian(s){return String(s??"").normalize("NFC").toLocaleLowerCase("ru-RU").replace(/[«»“”„"!?.,;:—–\-\s()]+/gu," ").trim();}
export function loadMix(storage=globalThis.localStorage){
 try{
  const raw=safe(JSON.parse(storage.getItem(MIX_KEY)||"{}"));
  return {items:safe(raw.items),sessions:Array.isArray(raw.sessions)?raw.sessions:[]};
 }catch{return {items:{},sessions:[]};}
}
const write=(data,storage)=>{try{storage.setItem(MIX_KEY,JSON.stringify(data));return true;}catch{return false;}};
export function mixStats(storage=globalThis.localStorage,now=Date.now()){
 const {items,sessions}=loadMix(storage),rows=Object.values(items).filter(x=>x&&Number(x.seen)>0);
 return {practised:rows.length,accuracy:rows.length?Math.round(100*rows.reduce((a,r)=>a+int(r.correct),0)/Math.max(1,rows.reduce((a,r)=>a+int(r.seen),0))):0,
  due:rows.filter(r=>Number(r.due)<=now).length,
  passed:sessions.filter(r=>r.passed).length,last:sessions.at(-1)||null};
}
export function recordMixAnswer(itemId,correct,storage=globalThis.localStorage,now=Date.now()){
 if(!/^[a-z]{3,10}:[a-z0-9:_-]{1,150}$/u.test(itemId)||typeof correct!=="boolean")return false;
 const data=loadMix(storage),old=safe(data.items[itemId]),seen=int(old.seen)+1;
 const streak=correct?Math.min(5,int(old.streak)+1):0;
 data.items[itemId]={seen:Math.min(100000,seen),correct:Math.min(100000,int(old.correct)+Number(correct)),
  streak,last:now,due:now+(correct?INTERVALS[streak-1]*DAY:DAY)};
 return write(data,storage);
}
export function recordMixSession(stage,answers,storage=globalThis.localStorage,now=Date.now()){
 if(!MIX_STAGES.includes(stage)||!Array.isArray(answers)||answers.length!==MIX_LENGTH)return null;
 const score=answers.filter(a=>a.correct===true).length;
 const productive=answers.filter(a=>a.correct===true&&["spell","case","verb","order","translate","dictate"].includes(a.mode)).length;
 const passed=score>=9&&productive>=2;
 const d=loadMix(storage);
 const result={stage,score,productive,passed,last:now};
 d.sessions.push(result);d.sessions=d.sessions.slice(-150);
 return {...result,saved:write(d,storage)};
}
function shuffled(items,random=Math.random){
 const arr=items.slice();
 for(let i=arr.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
 return arr;
}
function choicesFor(item,pool,value,random=Math.random){
 const seen=new Set([value]),extras=[];
 for(const candidate of shuffled(pool,random)){
  const v=String(candidate);if(v&& !seen.has(v)){seen.add(v);extras.push(v);if(extras.length===3)break;}
 }
 return extras.length===3?shuffled([value,...extras],random):null;
}
const make=(mode,id,prompt,answer,explanation,options=null,additional={})=>
 ({id:mode+":"+id,mode,prompt,answer,explanation,options,...additional});
export function bankForStage(stage,{audio=false,random=Math.random}={}){
 if(!MIX_STAGES.includes(stage))return [];
 const idx=MIX_STAGES.indexOf(stage),out=[];
 const allCards=firstWordPacks.flatMap((p,i)=>p.words.map((w,j)=>({id:p.id+"-"+j,ru:w.ru,en:w.en,stage:p.stage||(i<20?"starter":"a1")})));
 const cards=allCards.filter(w=>w.stage===stage);
 const poolRu=cards.map(x=>x.ru),poolEn=cards.map(x=>x.en);
 // Use the full in-level pool, not the six items in one learning pack.
 for(const w of cards){
  if(!w.en||!w.ru)continue;
  const enChoices=choicesFor(w,poolEn,w.en,random),ruChoices=choicesFor(w,poolRu,w.ru,random);
  if(enChoices)out.push(make("recognize",w.id,"What does this Russian word mean?",w.en,
   "«"+w.ru+"» means "+w.en+".",enChoices,{display:w.ru,source:w.id}));
  if(ruChoices)out.push(make("recall",w.id,"Choose Russian for: "+w.en,w.ru,
   "The Russian equivalent of “"+w.en+"” is «"+w.ru+"».",ruChoices,{source:w.id}));
  if(!/\s/u.test(w.ru))out.push(make("spell",w.id,"Type in Russian: "+w.en,w.ru,
   "Write the Cyrillic form «"+w.ru+"». This checks one listed translation, not all synonyms.",null,{source:w.id}));
  if(audio&&enChoices)out.push(make("hear",w.id,"Listen, then choose the English meaning.",w.en,
   "You heard «"+w.ru+"», meaning "+w.en+".",enChoices,{audio:w.ru,source:w.id}));
 }
 for(const q of grammarDrills.filter(x=>x.stage===stage)){
  out.push(make("grammar",q.id,q.instruction.en,q.answer,q.explanation.en,shuffled(q.choices,random),
   {display:q.context.en}));
 }
 if(idx>=1){
  for(const f of CASE_ITEMS){
   const cas=CASES.find(x=>x.id===f.caseId);
   const number=f.number==="sg"?"singular":"plural";
   out.push(make("case",f.id,
    "Write the "+cas.en.toLowerCase()+" "+number+" form of «"+f.noun.forms.sg[0]+"» ("+f.noun.en+").",
    f.answer,cas.purpose.en+". "+cas.cue.en,null,{source:f.noun.id,display:"Base: "+f.noun.forms.sg[0]}));
  }
 }
 for(const f of VERB_FORMS.filter(x=>idx>=MIX_STAGES.indexOf(x.verb.stage))){
  out.push(make("verb",f.id,"Conjugate «"+f.verb.infinitive+"» ("+f.verb.en+") for "+f.subject.ru+
   " in the "+(f.tense==="present"?"present":"past")+" tense.",f.answer,
   "This is the recorded "+f.tense+" form of «"+f.verb.infinitive+"» for "+f.subject.ru+".",null,
   {display:f.subject.ru+" + ______",source:f.verb.id}));
 }
 for(const [i,s]of sentencePatterns.entries())if(s.stage===stage){
  const tokens=s.ru.replace(/[.!?]+$/u,"").split(/\s+/u).filter(Boolean);
  if(tokens.length>=3){
   out.push(make("order",stage+"-"+i,"Put the Russian words in order: "+s.en,s.ru,
    s.tip,null,{tokens:shuffled(tokens.map((word,occ)=>({id:occ,word})),random),source:stage+"-"+i}));
  }
  out.push(make("translate",stage+"-"+i,"Write the full Russian sentence: "+s.en,s.ru,
   s.tip,null,{source:stage+"-"+i}));
  if(audio)out.push(make("dictate",stage+"-"+i,"Listen carefully and type the Russian sentence.",s.ru,
   "The spoken model was: «"+s.ru+"». "+s.tip,null,{audio:s.ru,source:stage+"-"+i}));
 }
 for(const [i,s]of corrections.entries())if(s.stage===stage){
  out.push(make("repair",stage+"-"+i,"Which of these Russian sentences is grammatically correct?",s.correct,
   s.explain,shuffled([s.correct,s.wrong],random),{source:stage+"-"+i}));
 }
 for(const p of readingLibrary.filter(x=>x.stage===stage))
  p.questions.forEach((q,i)=>out.push(make("read",p.id+"-"+i,q.ask.en,q.answer,q.explain.en,
   shuffled(q.choices,random),{display:p.text,source:p.id})));
 const matchPacks=firstWordPacks.filter((p,i)=>(p.stage||(i<20?"starter":"a1"))===stage);
 for(const p of matchPacks){
  const words=p.words.slice(0,4);
  if(words.length<4||new Set(words.map(x=>x.en)).size!==4||new Set(words.map(x=>x.ru)).size!==4)continue;
  out.push(make("match",p.id,"Match each Russian word with its English meaning.","4 correct pairs",
   "All four Russian words were correctly matched.",null,{
    pairs:words.map(x=>({ru:x.ru,en:x.en})),source:p.id}));
 }
 return out;
}
export function selectMix(stage,history=loadMix(),{audio=false,random=Math.random,count=MIX_LENGTH}={}){
 const bank=bankForStage(stage,{audio,random}),old=safe(history.items);
 const groups=new Map();
 for(const item of bank){
  if(!groups.has(item.mode))groups.set(item.mode,[]);
  groups.get(item.mode).push(item);
 }
 const scorer=q=>{
  const rec=safe(old[q.id]),n=int(rec.seen),due=Number(rec.due)||0;
  return (n===0?-100:due<=Date.now()?-50:35)+n*4+
   (n>0&&int(rec.correct)<n?-20:0)+random()*12;
 };
 const result=[],usedSources=new Set(),usedIds=new Set();
 const sortedTypes=shuffled([...groups.keys()],random);
 for(const mode of sortedTypes){
  if(result.length>=count)break;
  const candidates=groups.get(mode).slice().sort((a,b)=>scorer(a)-scorer(b));
  const picked=candidates.find(x=>!usedSources.has(x.source||x.id));
  if(!picked)continue;
  result.push(picked);usedSources.add(picked.source||picked.id);usedIds.add(picked.id);
 }
 // Fill any remaining slots with weak/due items, avoiding repetition of exact source in one session.
 const remaining=bank.filter(x=>!usedIds.has(x.id)&&!usedSources.has(x.source||x.id))
  .sort((a,b)=>scorer(a)-scorer(b));
 for(const item of remaining){
  if(result.length>=count)break;
  if(usedSources.has(item.source||item.id))continue;
  result.push(item);usedSources.add(item.source||item.id);
 }
 return shuffled(result,random);
}
export function gradeMixAnswer(q,answer){
 if(!q||!MIX_TYPES.includes(q.mode))return false;
 if(q.mode==="match")return Array.isArray(answer)&&answer.length===4&&
  q.pairs.every(p=>answer.some(a=>a.ru===p.ru&&a.en===p.en));
 if(q.mode==="order")return normalizeRussian(answer)===normalizeRussian(q.answer);
 if(["spell","case","verb","translate","dictate"].includes(q.mode))
  return normalizeRussian(answer)===normalizeRussian(q.answer);
 return String(answer)===String(q.answer);
}
