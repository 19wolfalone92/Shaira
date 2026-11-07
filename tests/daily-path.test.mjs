import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 GUIDED_STUDY_DAYS,DAYS_PER_STAGE,LEGACY_DAYS,DAILY_KEY,makeDay,
 beginDay,readDayState,saveDayState,snapshot,stepComplete,dayStatus,
 markQuick,addMistake,markReference,changeGoal,finishDay,skillsReport,
 normalizedRussian,dateKey
} from "../assets/daily-plan.js";
import {stages,units} from "../assets/academy-data.js";
import {lessons} from "../assets/lessons.js";
import {firstWordPacks} from "../assets/first-words.js";
import {dialogues} from "../assets/dialogues.js";
import {grammarDrills} from "../assets/grammar-drills.js";
import {grammarHandbook} from "../assets/grammar-handbook.js";
import {readingLibrary} from "../assets/reading-library.js";
import {writingTasks} from "../assets/writing-tasks.js";
import {openingDays} from "../assets/daily-content.js";

const mem=()=>{const m=new Map();return{
 getItem:k=>m.get(k)??null,
 setItem:(k,v)=>m.set(k,String(v)),
 removeItem:k=>m.delete(k),
 map:m
};};
const storeObj=(storage,key,x)=>storage.setItem(key,JSON.stringify(x));

test("210 real guided study days are connected to authored learning material, not placeholders",()=>{
 assert.equal(GUIDED_STUDY_DAYS,210);
 assert.equal(DAYS_PER_STAGE,42);
 assert.equal(LEGACY_DAYS,13);
 assert.equal(openingDays.length,14);
 assert.equal(makeDay(210),null);
 assert.equal(makeDay(-1),null);
 assert.equal(makeDay(1.5),null);
 const countByKind={},usedPacks=new Set(),usedUnits=new Set();
 for(let i=0;i<GUIDED_STUDY_DAYS;i++){
   const d=makeDay(i);
   assert.equal(d.number,i+1);
   assert.equal(d.stage,stages[Math.floor(i/42)].id);
   assert.equal(d.tasks.length,2,i+" task count");
   assert.ok(d.intro.en&&d.intro.tl&&d.intro.note?.en&&d.intro.note?.tl);
   assert.ok(d.voiceLine&&/[\u0400-\u052F]/u.test(d.voiceLine));
   assert.ok(d.quiz.choices.includes(d.quiz.answer));
   assert.ok(grammarDrills.some(q=>q.id===d.quiz.id&&q.stage===d.stage));
   assert.ok(d.spelling.ru&&/[\u0400-\u052F]/u.test(d.spelling.ru));
   assert.ok(d.spelling.prompt.en&&d.spelling.prompt.tl);
   for(const t of d.tasks){
     assert.ok(t.id&&t.href.startsWith("#"),i+" "+t.id);
     assert.ok(t.title.en&&t.title.tl,i+" "+t.id);
     countByKind[t.kind]=(countByKind[t.kind]||0)+1;
     if(t.kind==="pack")assert.ok(firstWordPacks.some(p=>p.id===t.key.split("/")[0]));
     if(t.kind==="legacy")assert.ok(lessons.some(l=>l.id===t.key));
     if(t.kind==="dialogue")assert.ok(dialogues.some(x=>"dialogue/"+x.id+"/complete"===t.key));
     if(t.kind==="reading")assert.ok(readingLibrary.some(x=>x.id===t.key));
     if(t.kind==="writing")assert.ok(writingTasks.some(x=>"portfolio:"+x.id===t.key));
     if(t.kind==="handbook")assert.ok(grammarHandbook.some(x=>x.id===t.key));
     if(t.kind==="unit"||t.kind==="speak"||t.kind==="listen")
       assert.ok(units.some(x=>t.key.startsWith(x.id+"/")),i+" "+t.id);
   }
   usedPacks.add(d.pack.id);usedUnits.add(d.unit.id);
 }
 assert.equal(makeDay(0).tasks[0].href,"#lesson/vowels");
 assert.equal(makeDay(12).tasks[0].href,"#lesson/first-cases");
 assert.equal(makeDay(13).tasks[1].kind,"grammar");
 for(const stage of stages)assert.equal(Array.from({length:210},(_,i)=>makeDay(i)).filter(x=>x.stage===stage.id).length,42);
 for(const kind of ["legacy","pack","unit","handbook","grammar","reading","writing","dialogue","speak","listen"])
   assert.ok(countByKind[kind]>0,"step kind is exercised: "+kind);
 assert.ok(usedPacks.size>=30,"broad word packs across the course");
 assert.equal(usedUnits.size,32);
});
test("a study day cannot be completed just by tapping; it requires real activity evidence and three quick checks",()=>{
 const db=mem();
 const now=new Date("2026-11-07T08:20:00.000Z");
 const s=beginDay(db,now),day=makeDay(0);
 assert.equal(s.index,0);
 assert.equal(s.startedDate,"2026-11-07");
 assert.equal(s.startedAt,now.getTime());
 assert.equal(dayStatus(day,s,snapshot(db)).done,0);
 assert.equal(finishDay(db,now).success,false);
 storeObj(db,"shaira-progress-v1",{language:"en",completed:[day.tasks[0].key]});
 storeObj(db,"shaira-academy-v1",{done:{[day.tasks[1].key]:now.getTime()+1},memory:{},drafts:{},points:10});
 let status=dayStatus(day,readDayState(db),snapshot(db));
 assert.equal(status.done,2);
 assert.equal(status.complete,false);
 assert.equal(markQuick("quiz",db),true);
 assert.equal(markQuick("spell",db),true);
 assert.equal(markQuick("oral",db),true);
 status=dayStatus(day,readDayState(db),snapshot(db));
 assert.equal(status.done,status.total);
 const result=finishDay(db,new Date(now.getTime()+1000));
 assert.equal(result.success,true);
 assert.equal(readDayState(db).index,1);
 assert.equal(readDayState(db).startedAt,0);
 assert.equal(readDayState(db).finished[0].day,0);
 assert.equal(skillsReport(readDayState(db)).days,1);
 assert.equal(beginDay(db,new Date(now.getTime()+2000)).index,1);
 assert.equal(dayStatus(makeDay(1),readDayState(db),snapshot(db)).complete,false);
});
test("grammar checkpoints require a fresh score of at least 8/10, not an old best score",()=>{
 const db=mem(),now=new Date("2026-11-07T08:20:00.000Z");
 let state=beginDay(db,now);
 state.index=13;state.startedAt=now.getTime();saveDayState(state,db);
 const day=makeDay(13),step=day.tasks[1];
 storeObj(db,"shaira-labs-v1",{grammar:{starter:{best:10,lastScore:5,last:now.getTime()+50}},readings:{},drafts:{}});
 assert.equal(stepComplete(step,state,snapshot(db)),false);
 storeObj(db,"shaira-labs-v1",{grammar:{starter:{best:10,lastScore:8,last:now.getTime()-10}},readings:{},drafts:{}});
 assert.equal(stepComplete(step,state,snapshot(db)),false);
 storeObj(db,"shaira-labs-v1",{grammar:{starter:{best:10,lastScore:8,last:now.getTime()+500}},readings:{},drafts:{}});
 assert.equal(stepComplete(step,state,snapshot(db)),true);
});
test("reading and writing tasks require recent comprehension and sufficiently long saved work",()=>{
 const db=mem(),t=1773000000000;
 let state=beginDay(db,new Date(t)),reading=makeDay(42+3),writ=makeDay(42+4);
 state.index=reading.index;state.startedAt=t;saveDayState(state,db);
 const readStep=reading.tasks.find(x=>x.kind==="reading");
 storeObj(db,"shaira-labs-v1",{grammar:{},readings:{[readStep.key]:{passed:true,lastPassed:false,last:t+1}},drafts:{},draftUpdated:{}});
 assert.equal(stepComplete(readStep,state,snapshot(db)),false);
 storeObj(db,"shaira-labs-v1",{grammar:{},readings:{[readStep.key]:{passed:true,lastPassed:true,last:t+1}},drafts:{},draftUpdated:{}});
 assert.equal(stepComplete(readStep,state,snapshot(db)),true);
 const writeStep=writ.tasks.find(x=>x.kind==="writing");
 assert.ok(writeStep.minimum>=35);
 state.index=writ.index;
 storeObj(db,"shaira-labs-v1",{grammar:{},readings:{},drafts:{[writeStep.key]:"Я работаю."},draftUpdated:{[writeStep.key]:t+2}});
 assert.equal(stepComplete(writeStep,state,snapshot(db)),false);
 const draft="Я пишу по-русски каждый день. Мне нравится новая книга. Я живу в большом городе. У меня есть друзья. По утрам я читаю рассказы и учу новые слова. Вечером я повторяю грамматику и слушаю русскую речь.";
 assert.ok(draft.split(/\s+/).length>=35);
 storeObj(db,"shaira-labs-v1",{grammar:{},readings:{},drafts:{[writeStep.key]:draft},draftUpdated:{[writeStep.key]:t+2}});
 assert.equal(stepComplete(writeStep,state,snapshot(db)),true);
});
test("listen fallback requires real reading practice when device voice is unavailable",()=>{
 const db=mem(),t=1773000000000;
 const day=makeDay(42+2),step=day.tasks.find(t=>t.kind==="listen");
 const state=beginDay(db,new Date(t));state.index=day.index;state.startedAt=t;
 storeObj(db,"shaira-academy-v1",{done:{[step.fallback]:t+10},memory:{},drafts:{},points:0});
 assert.equal(stepComplete(step,state,snapshot(db),false),true);
 assert.equal(stepComplete(step,state,snapshot(db),true),false);
});
test("fast repeated progress and wrong attempts do not falsely count mastery",()=>{
 const db=mem(),s=beginDay(db,new Date(1773000000000));
 addMistake("Quiz",db);addMistake("Spell",db);addMistake("Spell",db);
 assert.equal(readDayState(db).challenges["0"].wrongQuiz,1);
 assert.equal(readDayState(db).challenges["0"].wrongSpell,2);
 assert.equal(dayStatus(makeDay(0),readDayState(db),snapshot(db)).quiz,false);
 assert.equal(markQuick("random",db),false);
 assert.equal(changeGoal(60,db),true);
 assert.equal(readDayState(db).goal,60);
 assert.equal(normalizedRussian("  Я учу русский!  "),normalizedRussian("я учу русский."));
 assert.notEqual(normalizedRussian("ёлка"),normalizedRussian("елка"),"ё must remain distinct");
 const day=makeDay(42+1);const step=day.tasks.find(x=>x.kind==="handbook");
 const state={...readDayState(db),index:day.index};
 saveDayState(state,db);
 assert.equal(markReference(step,db),true);
 assert.equal(stepComplete(step,readDayState(db),snapshot(db)),true);
});
test("daily UI and the offline shell include all new materials and interaction points",async()=>{
 const oldLocal=globalThis.localStorage,oldWindow=globalThis.window,oldDoc=globalThis.document;
 const db=mem();
 globalThis.localStorage=db;
 globalThis.window={speechSynthesis:{cancel(){},speak(){},getVoices(){return[]}}};
 let currentSpell={value:"",selectionStart:0,selectionEnd:0};
 globalThis.document={getElementById:id=>id==="daily-spell"?currentSpell:null};
 try{
   const {todayHtml,todayAction,todayPreview,todaySubmit}=await import("../assets/daily-ui.js");
   const api={language:()=>"en",route:()=>"today",render(){},speak(){},notice(){}};
   assert.match(todayHtml("en"),/Today's Russian lesson/);
   assert.match(todayHtml("tl"),/Aralin sa Ruso ngayong araw/);
   assert.match(todayPreview("en"),/Study day 1/);
   const day=makeDay(0);
   const page=todayHtml("en");
   const options=[...page.matchAll(/data-daily="quiz" data-choice="(\d+)"[^>]*>([^<]+)</g)];
   assert.equal(options.length,4);
   const hit=options.find(x=>x[2]===day.quiz.answer);
   assert.ok(hit);
   todayAction({dataset:{daily:"quiz",choice:hit[1]}},api);
   assert.equal(dayStatus(day,readDayState(db),snapshot(db)).quiz,true);
   currentSpell.value=day.spelling.ru;
   todaySubmit({target:{id:"daily-spell-form"},preventDefault(){}},api);
   assert.equal(dayStatus(day,readDayState(db),snapshot(db)).spell,true);
   todayAction({dataset:{daily:"oral"}},api);
   const now=readDayState(db).startedAt;
   storeObj(db,"shaira-progress-v1",{language:"en",completed:[day.tasks[0].key]});
   storeObj(db,"shaira-academy-v1",{done:{[day.tasks[1].key]:now+1000},memory:{},drafts:{},points:0});
   todayAction({dataset:{daily:"finish"}},api);
   assert.equal(readDayState(db).index,1);
   assert.match(todayHtml("en"),/One more step in Russian/);
   todayAction({dataset:{daily:"next-session"}},api);
   assert.match(todayHtml("en"),/Study day 2/);
 }finally{
   globalThis.localStorage=oldLocal;globalThis.window=oldWindow;globalThis.document=oldDoc;
 }
 const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
 for(const file of ["daily-plan.js","daily-content.js","daily-ui.js","daily.css"])assert.ok(sw.includes(file),file);
 const app=readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
 assert.match(app,/route === "today" \? todayHtml/);
});
