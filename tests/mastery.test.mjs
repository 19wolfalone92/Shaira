import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {studioLessons,studioForUnit,studioQuestionTotal} from "../assets/studio-lessons.js";
import {stageCheckpoints,checkpointForStage,allCheckpointItems} from "../assets/stage-checkpoints.js";
import {units,stages} from "../assets/academy-data.js";
import {grammarDrills} from "../assets/grammar-drills.js";
import {readDayState,beginDay,saveDayState,makeDay,snapshot,stepComplete,dayStatus,markQuick,finishDay} from "../assets/daily-plan.js";
import {loadMastery,gradeStudio,gradeCheckpoint,gradeStatus,normaliseAnswer} from "../assets/mastery-engine.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";

const database=()=>{const mem=new Map();return{
 getItem:k=>mem.get(k)??null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k),
 keys:()=>[...mem.keys()]
};};
const write=(db,k,data)=>db.setItem(k,JSON.stringify(data));

test("all 32 previously authored course units have original teaching, worked examples and drills",()=>{
 assert.equal(studioLessons.length,32);
 assert.equal(studioQuestionTotal,64);
 assert.equal(new Set(studioLessons.map(x=>x.id)).size,32);
 assert.deepEqual(new Set(studioLessons.map(x=>x.id)),new Set(units.map(x=>x.id)));
 for(const unit of units){
  const lesson=studioForUnit(unit.id);
  assert.ok(lesson,unit.id);
  assert.equal(lesson.examples.length,3,unit.id);
  assert.equal(lesson.checks.length,2,unit.id);
  for(const l of ["en","tl"])assert.ok(lesson.rule[l].length>35&&lesson.tip[l].length>25,unit.id+" "+l);
  assert.equal(new Set(lesson.checks.map(q=>q.id)).size,2);
  for(const example of lesson.examples){
   assert.match(example.ru,/[\u0400-\u052F]/u);
   assert.ok(example.en&&example.tl);
  }
  for(const q of lesson.checks){
    assert.equal(q.choices.length,4,q.id);
    assert.equal(new Set(q.choices).size,4,q.id);
    assert.ok(q.choices.includes(q.answer),q.id);
    assert.ok(q.reason.en&&q.reason.tl,q.id);
  }
 }
});
test("five distinct, independently authored stage reviews contain 8 selected and 2 productive responses",()=>{
 assert.equal(stageCheckpoints.length,5);
 assert.equal(allCheckpointItems.length,50);
 assert.deepEqual(stageCheckpoints.map(p=>p.stage),stages.map(s=>s.id));
 const originalPrompts=new Set(grammarDrills.map(x=>x.instruction.en));
 for(const p of stageCheckpoints){
   assert.ok(p.passage.length>=80,p.stage);
   assert.match(p.passage,/[\u0400-\u052F]/u);
   assert.equal(p.questions.length,10,p.stage);
   assert.equal(p.questions.filter(x=>x.type==="type").length,2,p.stage);
   assert.equal(p.questions.filter(x=>x.type==="choice").length,8,p.stage);
   for(const [i,q]of p.questions.entries()){
     assert.ok(q.explanation.en&&q.explanation.tl,p.stage+":"+i);
     if(q.type==="choice"){
       assert.ok(typeof q.prompt==="string"&&q.prompt.length>4);
       assert.equal(q.choices.length,4);
       assert.equal(new Set(q.choices).size,4);
       assert.ok(q.choices.includes(q.answer));
       assert.equal(originalPrompts.has(q.prompt),false,"do not reuse the exact training question");
     }else{
       assert.ok(q.prompt.en&&q.prompt.tl);
       assert.match(q.answer,/[\u0400-\u052F]/u);
     }
   }
 }
});
test("studio practice requires all three correct, saves attempts and keeps old best results",()=>{
 const db=database();
 const id="dative",studio=studioForUnit(id);
 const answers=studio.checks.map(q=>q.answer).concat(studio.examples[1].ru);
 const pass=gradeStudio(id,answers,db,1800000000000);
 assert.equal(pass.score,3);
 assert.equal(pass.passed,true);
 assert.equal(pass.saved,true);
 assert.equal(loadMastery(db).studios[id].best,3);
 const retry=gradeStudio(id,["incorrect",...answers.slice(1)],db,1800000000100);
 assert.equal(retry.score,2);
 assert.equal(retry.passed,false);
 const state=loadMastery(db).studios[id];
 assert.equal(state.attempts,2);
 assert.equal(state.passed,true);
 assert.equal(state.lastScore,2);
 assert.equal(normaliseAnswer("  Я живу в Минске! "),"я живу в минске");
 assert.notEqual(normaliseAnswer("еще"),normaliseAnswer("ещё"),"ё remains distinct");
});
test("stage review needs 8/10 plus correct independent writing and reading",()=>{
 const db=database(),stage="b2",p=checkpointForStage(stage);
 const all=p.questions.map(q=>q.answer);
 const pass=gradeCheckpoint(stage,all,db,1800000000200);
 assert.equal(pass.passed,true);
 assert.equal(pass.score,10);
 assert.equal(pass.correctTyped,2);
 assert.equal(pass.correctReading,2);
 const noWriting=gradeCheckpoint(stage,all.map((x,i)=>i>=8?"incorrect":x),db,1800000000300);
 assert.equal(noWriting.score,8);
 assert.equal(noWriting.correctTyped,0);
 assert.equal(noWriting.passed,false);
 const noReading=gradeCheckpoint(stage,all.map((x,i)=>i===6||i===7?"incorrect":x),db,1800000000400);
 assert.equal(noReading.score,8);
 assert.equal(noReading.correctReading,0);
 assert.equal(noReading.passed,false);
 const s=gradeStatus(db);
 assert.equal(s.stageReviews.find(x=>x.stage==="b2").passed,true);
 assert.equal(loadMastery(db).checkpoints.b2.lastPassed,false);
});
test("the last study day of each stage requires a fresh, passed level review",()=>{
 const db=database();
 const stamp=1800000000000;
 for(let stageNo=0;stageNo<5;stageNo++){
   const index=stageNo*42+41,day=makeDay(index),st=beginDay(db,new Date(stamp));
   st.index=index;st.startedAt=stamp+stageNo*100000;st.startedDate="2027-01-14";
   saveDayState(st,db);
   const c=day.tasks.find(x=>x.kind==="checkpoint");
   assert.ok(c&&c.key===day.stage);
   assert.equal(stepComplete(c,st,snapshot(db)),false);
   const p=checkpointForStage(day.stage);
   gradeCheckpoint(day.stage,p.questions.map(x=>x.answer),db,st.startedAt+100);
   assert.equal(stepComplete(c,st,snapshot(db)),true);
   const changed=p.questions.map((x,i)=>i>=8?"incorrect":x.answer);
   gradeCheckpoint(day.stage,changed,db,st.startedAt+200);
   assert.equal(stepComplete(c,st,snapshot(db)),false,"latest failed review blocks moving forward");
   gradeCheckpoint(day.stage,p.questions.map(x=>x.answer),db,st.startedAt+300);
 }
});
test("all 210 days include meaningful sequential units, new studios and stage gates",()=>{
 const plans=Array.from({length:210},(_,i)=>makeDay(i));
 const masterTasks=plans.flatMap(x=>x.tasks.filter(t=>t.kind==="studio"));
 const covered=new Set(masterTasks.map(x=>x.key));
 assert.equal(covered.size,32);
 assert.deepEqual(covered,new Set(units.map(u=>u.id)));
 for(let i=0;i<5;i++){
   const d=plans[i*42+41];
   assert.equal(d.tasks.filter(x=>x.kind==="checkpoint").length,1);
   assert.equal(d.tasks.at(-1).key,stages[i].id);
   assert.ok(d.tasks.length>=3);
 }
 assert.ok(plans[42].tasks.some(t=>t.kind==="studio"));
 assert.ok(plans[46].tasks.some(t=>t.kind==="studio"));
 for(const d of plans){
  assert.ok(d.tasks.every(t=>t.href.startsWith("#academy/")||t.href.startsWith("#lesson/")));
 }
});
test("the entire daily evidence includes chapter and review success rather than manual checkmarks",()=>{
 const db=database();
 const base=1800000000000,day=makeDay(42);
 const state=beginDay(db,new Date(base));state.index=42;state.startedAt=base;saveDayState(state,db);
 const studioStep=day.tasks.find(x=>x.kind==="studio");
 assert.ok(studioStep);
 assert.equal(stepComplete(studioStep,state,snapshot(db)),false);
 const lesson=studioForUnit(studioStep.key);
 const arr=lesson.checks.map(q=>q.answer).concat(lesson.examples[1].ru);
 gradeStudio(studioStep.key,arr,db,base+5);
 assert.equal(stepComplete(studioStep,state,snapshot(db)),true);
 gradeStudio(studioStep.key,["wrong",...arr.slice(1)],db,base+6);
 assert.equal(stepComplete(studioStep,state,snapshot(db)),false,"a new mistaken retake is not sufficient");
});
test("mastery data are included in portable Shaira backups and older backups still restore",()=>{
 const db=database(),unit="where",p=checkpointForStage("starter"),unitData=studioForUnit(unit);
 gradeStudio(unit,unitData.checks.map(q=>q.answer).concat(unitData.examples[1].ru),db,1800000000200);
 gradeCheckpoint("starter",p.questions.map(q=>q.answer),db,1800000000300);
 const portable=buildBackup(db);
 assert.equal(portable.mastery.studios.where.passed,true);
 assert.equal(portable.mastery.checkpoints.starter.correctTyped,2);
 const restored=database();restoreBackup(JSON.stringify(portable),restored);
 assert.equal(loadMastery(restored).studios.where.best,3);
 assert.equal(loadMastery(restored).checkpoints.starter.passed,true);
 const old=database();
 const older={...portable};
 delete older.mastery;
 restoreBackup(JSON.stringify(older),old);
 assert.equal(Object.keys(loadMastery(old).studios).length,0);
});
test("chapter and stage review HTML and interactions work without paid APIs",async()=>{
 const previousLocal=globalThis.localStorage,previousDocument=globalThis.document;
 const db=database();
 globalThis.localStorage=db;
 let typed={value:""};
 globalThis.document={getElementById:id=>id==="ms-answer"?typed:null};
 try{
  const {masteryHtml,masteryAction,masterySubmit}=await import("../assets/mastery-ui.js");
  const route="academy/mastery/letters-1";
  const api={language:()=>"en",route:()=>route,render(){},speak(){}};
  assert.match(masteryHtml("academy/mastery","en"),/Structured Russian course/);
  assert.match(masteryHtml("academy/mastery","tl"),/Maayos na kurso sa Ruso/);
  for(let qidx=0;qidx<2;qidx++){
   const html=masteryHtml(route,"en"),q=studioForUnit("letters-1").checks[qidx];
   const options=[...html.matchAll(/data-mastery="choose" data-choice="(\d+)"[^>]*>([^<]+)</g)];
   assert.equal(options.length,4);
   const chosen=options.find(x=>x[2]===q.answer);
   assert.ok(chosen,q.prompt);
   masteryAction({dataset:{mastery:"choose",choice:chosen[1]}},api);
   masteryAction({dataset:{mastery:"next"}},api);
  }
  typed.value=studioForUnit("letters-1").examples[1].ru;
  masterySubmit({target:{id:"ms-answer-form"},preventDefault(){}},api);
  assert.match(masteryHtml(route,"en"),/Correct/);
  masteryAction({dataset:{mastery:"next"}},api);
  assert.equal(loadMastery(db).studios["letters-1"].passed,true);
  assert.match(masteryHtml(route,"en"),/3\/3/);
  const examRoute="academy/checkpoint/starter";
  const examApi={...api,route:()=>examRoute};
  for(let i=0;i<8;i++){
    const html=masteryHtml(examRoute,"en"),q=checkpointForStage("starter").questions[i];
    const offered=[...html.matchAll(/data-mastery="choose" data-choice="(\d+)"[^>]*>([^<]+)</g)];
    const correct=offered.find(x=>x[2]===q.answer);
    assert.ok(correct,"review answer offered "+i);
    masteryAction({dataset:{mastery:"choose",choice:correct[1]}},examApi);
  }
  for(let i=8;i<10;i++){
    typed.value=checkpointForStage("starter").questions[i].answer;
    masterySubmit({target:{id:"ms-answer-form"},preventDefault(){}},examApi);
  }
  assert.equal(loadMastery(db).checkpoints.starter.passed,true);
  assert.match(masteryHtml(examRoute,"en"),/10\/10/);
 }finally{globalThis.localStorage=previousLocal;globalThis.document=previousDocument;}
 const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
 for(const path of ["studio-lessons.js","stage-checkpoints.js","mastery-engine.js","mastery-ui.js","mastery.css"])assert.ok(sw.includes(path),path);
});
