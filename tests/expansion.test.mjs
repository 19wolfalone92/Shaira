import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {firstWordPacks} from "../assets/first-words.js";
import {extendedWordPacks} from "../assets/extended-word-packs.js";
import {readingLibrary} from "../assets/reading-library.js";
import {extraReadings} from "../assets/extra-readings.js";
import {writingTasks} from "../assets/writing-tasks.js";
import {extraWritingTasks} from "../assets/extra-writing-tasks.js";
import {dialogues} from "../assets/dialogues.js";
import {extraDialogues} from "../assets/extra-dialogues.js";
import {listeningClips,listeningForStage} from "../assets/listening-clips.js";
import {listeningHtml,listeningAction,recordListening,listeningStats,loadListening} from "../assets/listening-ui.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";
import {readDayState,beginDay,saveDayState,makeDay,snapshot,stepComplete,chooseReadingAlternative} from "../assets/daily-plan.js";
const storage=()=>{const rows=new Map();return{
 getItem:key=>rows.get(key)??null,setItem:(key,value)=>rows.set(key,String(value)),removeItem:key=>rows.delete(key),get map(){return rows}
};};
test("new adult lexical collection doubles useful word-card scope with English instructions",()=>{
 assert.equal(extendedWordPacks.length,41);
 assert.equal(firstWordPacks.length,81);
 assert.equal(firstWordPacks.flatMap(x=>x.words).length,486);
 assert.equal(new Set(firstWordPacks.map(x=>x.id)).size,81);
 const expected=["starter","a1","a2","b1","b2"];
 for(const stage of expected)assert.ok(extendedWordPacks.filter(x=>x.stage===stage).length>=4);
 for(const p of extendedWordPacks){
  assert.equal(p.words.length,6,p.id);
  assert.ok(p.title.en&&p.title.en===p.title.tl);
  assert.equal(new Set(p.words.map(w=>w.ru)).size,6,p.id);
  for(const w of p.words){
   assert.match(w.ru,/[\u0400-\u052F]/u,p.id);
   assert.ok(w.en&&w.tl===w.en&&w.icon,p.id);
  }
 }
});
test("15 extra levelled readings add authentic Russian-language paragraphs and 30 new comprehension questions",()=>{
 assert.equal(extraReadings.length,15);
 assert.equal(readingLibrary.length,35);
 assert.equal(new Set(readingLibrary.map(p=>p.id)).size,35);
 for(const stage of ["starter","a1","a2","b1","b2"])
   assert.equal(extraReadings.filter(p=>p.stage===stage).length,3);
 for(const p of extraReadings){
  assert.ok(p.title.en&&p.guide.en&&p.task.en,p.id);
  assert.equal(p.title.tl,p.title.en);
  assert.match(p.text,/[\u0400-\u052F]/u,p.id);
  assert.ok(p.glossary.length>=4,p.id);
  assert.equal(p.questions.length,2,p.id);
  for(const q of p.questions){
   assert.ok(q.ask.en&&q.explain.en,p.id);
   assert.equal(q.choices.length,4,p.id);
   assert.equal(new Set(q.choices).size,4,p.id);
   assert.ok(q.choices.includes(q.answer),p.id+" "+q.ask.en);
  }
 }
 const stages=["starter","a1","a2","b1","b2"];
 const minimum=[35,150,300,450,600];
 for(let i=0;i<5;i++){
   const selected=extraReadings.filter(p=>p.stage===stages[i]);
   assert.ok(selected.every(p=>p.text.length>=minimum[i]),"stage reading depth: "+stages[i]);
 }
});
test("15 extra adult writing and 10 role-play dialogues offer productive skills at every stage",()=>{
 assert.equal(extraWritingTasks.length,15);
 assert.equal(writingTasks.length,45);
 assert.equal(extraDialogues.length,10);
 assert.equal(dialogues.length,30);
 assert.equal(new Set(writingTasks.map(x=>x.id)).size,45);
 assert.equal(new Set(dialogues.map(x=>x.id)).size,30);
 for(const level of ["starter","a1","a2","b1","b2"]){
   assert.equal(extraWritingTasks.filter(x=>x.stage===level).length,3);
   assert.equal(extraDialogues.filter(x=>x.stage===level).length,2);
 }
 for(const x of extraWritingTasks){
  assert.ok(x.title.en&&x.brief.en.length>45&&x.check.en.length>20);
  assert.match(x.model,/[\u0400-\u052F]/u);
 }
 for(const d of extraDialogues){
  assert.ok(d.lines.length>=6,d.id);
  assert.ok(d.title.en&&d.goal.en&&d.question.en);
  assert.equal(d.choices.length,4,d.id);
  assert.equal(new Set(d.choices).size,4,d.id);
  assert.ok(d.choices.includes(d.answer),d.id);
  for(const line of d.lines)assert.ok(line.ru&&line.en);
 }
});
test("30 listening clips contain 6 original comprehension tasks per stage with valid English answer keys",()=>{
 assert.equal(listeningClips.length,30);
 assert.equal(new Set(listeningClips.map(x=>x.id)).size,30);
 for(const level of ["starter","a1","a2","b1","b2"]){
  assert.equal(listeningForStage(level).length,6);
 }
 for(const clip of listeningClips){
  assert.match(clip.russian,/[\u0400-\u052F]/u,clip.id);
  assert.ok(clip.title&&clip.question&&clip.why.length>15,clip.id);
  assert.equal(clip.choices.length,4,clip.id);
  assert.equal(new Set(clip.choices).size,4,clip.id);
  assert.ok(clip.choices.includes(clip.answer),clip.id);
 }
});
test("English-only app entry and settings do not let imported Tagalog switch instructions",()=>{
 const source=readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
 assert.match(source,/return \{ language: "en"/);
 assert.match(source,/dictionary.en\[key\]/);
 assert.match(source,/document.documentElement.lang = "en"/);
 assert.doesNotMatch(source,/data-action="language" data-value="tl"/);
 const index=readFileSync(new URL("../index.html",import.meta.url),"utf8");
 assert.match(index,/<html lang="en">/);
 assert.doesNotMatch(index,/Pag-aaral ng Ruso/);
 const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
 for(const file of ["extended-word-packs.js","extra-readings.js","extra-writing-tasks.js","extra-dialogues.js","listening-ui.js","listening-clips.js","listening.css"])assert.ok(sw.includes(file),file);
});
test("listening practice cannot be passed before playback and keeps the transcript hidden",()=>{
 const oldStorage=globalThis.localStorage,oldWin=globalThis.window,oldSpeech=globalThis.SpeechSynthesisUtterance;
 const db=storage(),id=listeningClips[0].id;
 globalThis.localStorage=db;
 globalThis.window={speechSynthesis:{cancel(){},speak(){}}};
 globalThis.SpeechSynthesisUtterance=function(){};
 try{
  let played=0,complete;
  const api={route:()=>"academy/listening/"+id,render(){},speak(_text,_rate,done,clip){played++;complete=done;assert.equal(clip,id);}};
  assert.match(listeningHtml("academy/listening"),/Listen to Russian/);
  assert.match(listeningHtml("academy/listening/"+id),/The transcript stays hidden until you have answered/);
  const clip=listeningClips[0];
  const first=listeningHtml("academy/listening/"+id);
  assert.doesNotMatch(first,/Привет! Меня зовут Анна/);
  const options=[...first.matchAll(/data-listening="answer" data-choice="(\d+)"[^>]*>([^<]+)</g)];
  assert.equal(options.length,4);
  listeningAction({dataset:{listening:"answer",choice:"0"}},api);
  assert.equal(listeningStats(db).practised,0);
  listeningAction({dataset:{listening:"play"}},api);
  assert.equal(played,1);
  const good=options.find(o=>o[2]===clip.answer);
  assert.ok(good);
  listeningAction({dataset:{listening:"answer",choice:good[1]}},api);
  assert.equal(listeningStats(db).correct,0);
  complete(true);
  assert.doesNotMatch(listeningHtml("academy/listening/"+id),/data-listening="answer"[^>]*disabled/);
  listeningAction({dataset:{listening:"answer",choice:good[1]}},api);
  assert.equal(listeningStats(db).correct,1);
  assert.match(listeningHtml("academy/listening/"+id),/Привет! Меня зовут Анна/);
  listeningAction({dataset:{listening:"retry"}},api);
  const original=listeningHtml("academy/listening/"+id);
  assert.doesNotMatch(original,/Привет! Меня зовут Анна/);
 }finally{
  globalThis.localStorage=oldStorage;globalThis.window=oldWin;globalThis.SpeechSynthesisUtterance=oldSpeech;
 }
});
test("revealing Russian text cancels a graded listening attempt; unsupported audio must not fake success",()=>{
 const db=storage(),id=listeningClips[1].id;
 const oldStorage=globalThis.localStorage,oldWin=globalThis.window,oldSpeech=globalThis.SpeechSynthesisUtterance;
 globalThis.localStorage=db;globalThis.window={};
 delete globalThis.SpeechSynthesisUtterance;
 try{
  const api={route:()=>"academy/listening/"+id,render(){},speak(_text,_rate,done){done(false);}};
  listeningAction({dataset:{listening:"play"}},api);
  assert.match(listeningHtml("academy/listening/"+id),/Could not play this clip/);
  listeningAction({dataset:{listening:"reveal"}},api);
  listeningAction({dataset:{listening:"answer",choice:"0"}},api);
  assert.equal(listeningStats(db).correct,0);
  assert.match(listeningHtml("academy/listening/"+id),/no longer a listening test/);
 }finally{
  globalThis.localStorage=oldStorage;globalThis.window=oldWin;globalThis.SpeechSynthesisUtterance=oldSpeech;
 }
});
test("daily progression only records current-session listening evidence, with honest fallback",()=>{
 const db=storage(),day=makeDay(16),t=1800000000000;
 const state=beginDay(db,new Date(t));state.index=day.index;state.startedAt=t;saveDayState(state,db);
 const step=day.tasks.find(x=>x.kind==="audio");
 assert.ok(step,"the new audio check must be present on the speaking day");
 assert.equal(stepComplete(step,state,snapshot(db)),false);
 assert.equal(recordListening(step.key,true,db,t+10),true);
 assert.equal(stepComplete(step,state,snapshot(db)),true);
 recordListening(step.key,false,db,t+20);
 assert.equal(stepComplete(step,state,snapshot(db)),false);
 assert.equal(stepComplete(step,state,snapshot(db),false),false);
 db.setItem("shaira-academy-v1",JSON.stringify({done:{[step.fallback]:t+30}}));
 assert.equal(stepComplete(step,state,snapshot(db),false),false);
 assert.equal(chooseReadingAlternative(step.id,db),true);
 assert.equal(stepComplete(step,readDayState(db),snapshot(db),true),true);
});
test("English-only backup preserves real listening achievements and rejects arbitrary ids",()=>{
 const db=storage(),id=listeningClips[0].id;
 db.setItem("shaira-progress-v1",JSON.stringify({language:"tl",completed:["vowels"]}));
 recordListening(id,true,db,1800000000000);
 const file=buildBackup(db);
 assert.equal(file.legacy.language,"en");
 assert.equal(file.listening.items[id].passed,true);
 const next=storage();
 restoreBackup(JSON.stringify(file),next);
 assert.equal(loadListening(next).items[id].passed,true);
 const altered={...file,listening:{items:JSON.parse('{"__proto__":{"attempts":5},"audio-nonsense":{"attempts":1,"passed":true,"last":55},"audio-hello":{"attempts":2,"passed":false,"last":44}}')}};
 const other=storage();
 restoreBackup(JSON.stringify(altered),other);
 const safe=JSON.parse(other.getItem("shaira-listening-v1")).items;
 assert.equal(Object.prototype.hasOwnProperty.call(safe,"__proto__"),false);
 assert.ok(safe["audio-hello"]);
});
