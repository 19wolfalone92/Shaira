import test from "node:test";
import assert from "node:assert/strict";
import {grammarDrills,drillsForStage} from "../assets/grammar-drills.js";
import {readingLibrary,readingsForStage} from "../assets/reading-library.js";
import {writingTasks,writingForStage,writingWordTargets} from "../assets/writing-tasks.js";
import {stages} from "../assets/academy-data.js";
import {readFileSync} from "node:fs";
import {grammarHandbook,handbookForStage} from "../assets/grammar-handbook.js";

const levels=stages.map(s=>s.id);
test("offline grammar handbook covers 30 essential Russian topics",()=>{
 assert.equal(grammarHandbook.length,30);
 assert.equal(new Set(grammarHandbook.map(x=>x.id)).size,30);
 for(const stage of levels)assert.ok(handbookForStage(stage).length>=4,stage);
 for(const item of grammarHandbook){
   for(const l of ["en","tl"])assert.ok(item.title[l]&&item.rule[l]&&item.pitfall[l],item.id);
   assert.ok(item.examples.length>=4,item.id);
   for(const ex of item.examples){
     assert.ok(ex.ru&&ex.en&&ex.tl,item.id);
     assert.match(ex.ru,/[\u0400-\u052F]/u,item.id);
   }
 }
});
test("100 contextual grammar questions are complete and bilingual",()=>{
 assert.equal(grammarDrills.length,100);
 assert.equal(new Set(grammarDrills.map(x=>x.id)).size,100);
 for(const stage of levels)assert.equal(drillsForStage(stage).length,20,stage);
 for(const q of grammarDrills){
   assert.ok(levels.includes(q.stage));
   for(const l of ["en","tl"])assert.ok(q.instruction[l]&&q.context[l]&&q.explanation[l],q.id+" "+l);
   assert.equal(q.choices.length,4,q.id);
   assert.equal(new Set(q.choices).size,4,q.id);
   assert.ok(q.choices.includes(q.answer),q.id);
 }
});
test("20 original reading texts offer contextual comprehension and production tasks",()=>{
 assert.equal(readingLibrary.length,35);
 assert.equal(new Set(readingLibrary.map(x=>x.id)).size,20);
 for(const stage of levels)assert.equal(readingsForStage(stage).length,4,stage);
 for(const r of readingLibrary){
   assert.ok(r.text.length>=({starter:80,a1:250,a2:400,b1:600,b2:900}[r.stage]),r.id+" text length appropriate to stage");
   assert.match(r.text,/[\u0400-\u052F]/u,r.id);
   for(const l of ["en","tl"])assert.ok(r.title[l]&&r.guide[l]&&r.task[l],r.id+" "+l);
   assert.ok(r.glossary.length>=4,r.id);
   for(const word of r.glossary)assert.ok(word.ru&&word.en&&word.tl,r.id);
   assert.ok(r.questions.length>=2,r.id);
   for(const q of r.questions){
     assert.equal(q.choices.length,4,r.id);
     assert.equal(new Set(q.choices).size,4,r.id);
     assert.ok(q.choices.includes(q.answer),r.id);
     for(const l of ["en","tl"])assert.ok(q.ask[l]&&q.explain[l],r.id+" "+l);
   }
 }
});
test("30 adult writing assignments are levelled and have meaningful goals",()=>{
 assert.equal(writingTasks.length,45);
 assert.equal(new Set(writingTasks.map(x=>x.id)).size,30);
 for(const level of levels){
   assert.equal(writingForStage(level).length,6,level);
   assert.ok(writingWordTargets[level][0]<writingWordTargets[level][1]);
 }
 for(const w of writingTasks){
  assert.ok(w.model.length>=({starter:20,a1:45,a2:60,b1:70,b2:80}[w.stage]),w.id+" useful Russian model opening");
  assert.match(w.model,/[\u0400-\u052F]/u,w.id);
  for(const l of ["en","tl"])assert.ok(w.title[l]&&w.brief[l]&&w.check[l],w.id+" "+l);
 }
});
test("grammar and reading routes, feedback and progress work without internet",async()=>{
 const oldLocal=globalThis.localStorage,oldDoc=globalThis.document;
 const db=new Map();
 globalThis.localStorage={getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)};
 let draftContent="";
 globalThis.document={getElementById:id=>id==="lp-studio-draft"?{value:draftContent}:null};
 try{
  const {labHtml,labAction,labStats}=await import("../assets/learning-labs.js");
  assert.match(labHtml("academy/lab","en"),/Grammar trainer/);
  assert.match(labHtml("academy/lab","tl"),/Pagsasanay sa gramatika/);
  assert.match(labHtml("academy/grammar","en"),/Pre-A1/);
  assert.match(labHtml("academy/handbook","en"),/Russian grammar handbook/);
  assert.match(labHtml("academy/handbook/accusative","tl"),/Accusative|layon/i);
  assert.match(labHtml("academy/library","en"),/Reading library/);
  assert.match(labHtml("academy/writing","tl"),/Portfolio/);
  assert.match(labHtml("academy/writing/task/debate-social","en"),/social media/);
  const route="academy/grammar/starter",api={route:()=>route,language:()=>"en",render(){},speak(){},notice(){}};
  labHtml(route,"en");
  for(let i=0;i<10;i++){
    labAction({dataset:{lab:"answer-grammar",choice:"0"}},api);
    labAction({dataset:{lab:"next-grammar"}},api);
  }
  assert.ok(labStats().grammarAttempts===1);
  assert.match(labHtml(route,"en"),/Practice summary/);
  const path="academy/library/first-morning",readApi={...api,route:()=>path};
  labHtml(path,"en");
  for(let i=0;i<2;i++){
    const page=labHtml(path,"en"),answer=readingLibrary.find(x=>x.id==="first-morning").questions[i].answer;
    const offered=[...page.matchAll(/data-lab="answer-read" data-choice="(\d+)"[^>]*>([^<]+)</g)];
    const right=offered.find(x=>x[2]===answer);
    assert.ok(right,"reading options must include a correct answer for question "+i);
    labAction({dataset:{lab:"answer-read",choice:right[1]}},readApi);
    labAction({dataset:{lab:"next-read"}},readApi);
  }
  assert.equal(labStats().readingsPassed,1);
  const writingRoute="academy/writing/task/compare-work-models";
  const writeApi={...api,route:()=>writingRoute};
  draftContent="С одной стороны, работа дома удобнее. С другой стороны, встречаться с коллегами тоже полезно.";
  labAction({dataset:{lab:"save-studio"}},writeApi);
  const saved=JSON.parse(db.get("shaira-labs-v1"));
  assert.equal(saved.drafts["portfolio:compare-work-models"],draftContent);
  assert.match(labHtml(writingRoute,"en"),/textarea/);
 }finally{
  globalThis.localStorage=oldLocal;globalThis.document=oldDoc;
 }
});
test("offline shell references every new lab module",()=>{
 const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
 for(const p of ["grammar-drills.js","reading-library.js","learning-labs.js","writing-tasks.js","adult-theme.css","grammar-handbook.js"])assert.ok(sw.includes(p),p);
});
