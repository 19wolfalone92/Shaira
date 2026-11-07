import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FIRST_STEPS,FIRST_LETTERS,FIRST_GROUPS,FIRST_PHRASES,
 MICRO_TOTAL,modeInfo,microQuestions,microStepAt} from "../assets/first-steps-data.js";
import {readMicro,changeMicroMode,needsMicroStart,finishMicroRung,microSkipRungs,
 recordMicroMistake,matchesMicroAnswer,microNormal,MICRO_KEY} from "../assets/first-steps-engine.js";
import {firstStepsHtml,firstStepsAction,firstStepsSubmit,firstStepsInput,firstStepsHomePreview,microCelebrationPending} from "../assets/first-steps-ui.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";
const db=()=>{const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),
 removeItem:k=>m.delete(k),entries:()=>[...m]}};
const answerFor=(step,mode="gentle")=>microQuestions(step).slice(0,modeInfo[mode].questions).map(q=>({id:q.id,value:q.answer}));
test("the true zero staircase introduces all 33 Cyrillic letters individually before full phrases",()=>{
 assert.equal(FIRST_LETTERS.length,33);
 assert.equal(FIRST_GROUPS.length,11);
 assert.equal(FIRST_PHRASES.length,12);
 assert.equal(MICRO_TOTAL,78);
 assert.equal(FIRST_STEPS.length,MICRO_TOTAL);
 assert.equal(new Set(FIRST_STEPS.map(s=>s.id)).size,MICRO_TOTAL);
 assert.deepEqual(FIRST_STEPS.slice(0,6).map(s=>s.kind),
  ["letter","letter","letter","blend","word","review"]);
 assert.deepEqual(FIRST_STEPS.slice(0,6).map(s=>s.model),["А","М","О","ма","мама","мама"]);
 assert.ok(FIRST_STEPS.slice(0,66).every(s=>!["phrase"].includes(s.kind)));
 assert.ok(FIRST_STEPS.slice(66).every(s=>s.kind==="phrase"));
 assert.equal(FIRST_STEPS.filter(s=>s.kind==="letter").length,33);
 assert.equal(FIRST_STEPS.filter(s=>s.kind==="blend").length,11);
 assert.equal(FIRST_STEPS.filter(s=>s.kind==="word").length,11);
 assert.equal(FIRST_STEPS.filter(s=>s.kind==="review").length,11);
 assert.equal(new Set(FIRST_LETTERS.map(x=>x.upper)).size,33);
 assert.equal(new Set(FIRST_LETTERS.map(x=>x.lower)).size,33);
 assert.equal(new Set(FIRST_LETTERS.map(x=>x.upper)).size,new Set("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("")).size);
 for(const symbol of "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ")
  assert.ok(FIRST_LETTERS.some(x=>x.upper===symbol),"missing "+symbol);
});
test("early beginner content never requires an unintroduced Cyrillic letter in a compulsory word or syllable",()=>{
 for(const step of FIRST_STEPS){
  assert.ok(step.chapter>=1&&step.chapter<=13);
  assert.ok(step.title&&step.description&&step.tip,step.id);
  if(["blend","word","review"].includes(step.kind)){
   const known=new Set(step.known);
   for(const target of [step.group.blend,step.group.word]){
    for(const letter of target.toLocaleUpperCase("ru-RU")){
     assert.ok(known.has(letter),step.id+" introduces "+letter+" before learning it in "+target);
    }
   }
  }
  if(step.kind==="letter")assert.ok(step.known.includes(step.letter.upper));
 }
 assert.equal(microStepAt(-1),null);
 assert.equal(microStepAt(78),null);
 assert.equal(microStepAt(0).model,"А");
 assert.equal(microStepAt(66).kind,"phrase");
});
test("every rung offers two accessible checks plus optional harder Cyrillic typing",()=>{
 for(const step of FIRST_STEPS){
  const q=microQuestions(step);
  assert.equal(q.length,4,step.id);
  assert.equal(new Set(q.map(x=>x.id)).size,4,step.id);
  for(let i=0;i<q.length;i++){
   const item=q[i];
   assert.ok(item.prompt&&item.answer&&item.explanation,step.id+" "+i);
   assert.equal(item.kind,i>=2?"type":"choice");
   if(item.options){
    assert.ok(item.options.includes(item.answer),step.id+" "+item.id);
    assert.equal(new Set(item.options).size,item.options.length,step.id+" "+item.id);
    assert.ok(item.options.length>=3,step.id+" "+item.id);
   }
  }
 }
 assert.deepEqual([modeInfo.gentle.questions,modeInfo.steady.questions,modeInfo.challenge.questions],[2,3,4]);
 assert.ok(microQuestions(FIRST_STEPS[0]).slice(0,2).every(q=>q.kind==="choice"));
 assert.ok(microQuestions(FIRST_STEPS[0]).slice(2).every(q=>q.kind==="type"));
});
test("no progress by merely pressing a button, changing modes, or giving incorrect answers",()=>{
 const storage=db();
 assert.equal(readMicro(storage).mode,"gentle");
 assert.equal(needsMicroStart(storage),true);
 assert.equal(finishMicroRung(0,[],storage).ok,false);
 assert.equal(finishMicroRung(1,answerFor(FIRST_STEPS[1]),storage).ok,false);
 assert.equal(finishMicroRung(0,[{id:"fake",value:"А"}],storage).ok,false);
 assert.equal(changeMicroMode("challenger",storage),false);
 assert.equal(changeMicroMode("challenge",storage),true);
 assert.equal(readMicro(storage).mode,"challenge");
 assert.equal(finishMicroRung(0,answerFor(FIRST_STEPS[0]),storage).ok,false);
 assert.equal(recordMicroMistake(storage),true);
 assert.equal(readMicro(storage).wrong,1);
 const result=finishMicroRung(0,answerFor(FIRST_STEPS[0],"challenge"),storage,1800000000000);
 assert.equal(result.ok,true);
 assert.equal(readMicro(storage).index,1);
 assert.equal(readMicro(storage).finished[0].method,"learned");
 assert.equal(readMicro(storage).totalPractice,4);
 assert.equal(needsMicroStart(storage),true);
 assert.equal(finishMicroRung(0,answerFor(FIRST_STEPS[0],"challenge"),storage).ok,false);
});
test("fast-track explicitly requires 6/6 previously unmastered checks and records demonstrated progress",()=>{
 const storage=db();
 assert.equal(microSkipRungs(0,[],storage).ok,false);
 const steps=FIRST_STEPS.slice(0,3);
 const questions=steps.flatMap(s=>microQuestions(s).slice(0,2).map(q=>({id:s.id+":"+q.id,value:q.answer})));
 const wrong=questions.map(x=>({...x}));
 wrong[1]={...wrong[1],value:"a completely wrong answer"};
 assert.equal(microSkipRungs(0,wrong,storage).ok,false);
 assert.equal(readMicro(storage).index,0);
 const result=microSkipRungs(0,questions,storage,1800000000000);
 assert.equal(result.ok,true);
 assert.equal(readMicro(storage).index,3);
 assert.equal(readMicro(storage).totalPractice,6);
 assert.deepEqual(readMicro(storage).finished.map(x=>x.method),["tested","tested","tested"]);
 assert.equal(microSkipRungs(0,questions,storage).ok,false,"cannot replay old test to progress");
});
test("string normalisation preserves ё and Cyrillic vs Latin code points while ignoring punctuation",()=>{
 assert.equal(microNormal("МОЁ!"),"моё");
 assert.notEqual(microNormal("е"),microNormal("ё"));
 assert.notEqual(microNormal("A"),microNormal("А"));
 assert.equal(matchesMicroAnswer({answer:"Мама."},"мама!"),true);
 assert.equal(matchesMicroAnswer({answer:"Ё"},"Е"),false);
 assert.equal(matchesMicroAnswer({answer:"А"},"A"),false);
});
test("new users enter micro-steps, existing course users keep previous progress and are never reset",()=>{
 const fresh=db();assert.equal(needsMicroStart(fresh),true);
 const daily=db();daily.setItem("shaira-daily-v1",JSON.stringify({index:3}));
 assert.equal(needsMicroStart(daily),false);
 const legacy=db();legacy.setItem("shaira-progress-v1",JSON.stringify({completed:["vowels"]}));
 assert.equal(needsMicroStart(legacy),false);
 const known=db();known.setItem("shaira-academy-v1",JSON.stringify({done:{"letters-1/words":150}}));
 assert.equal(needsMicroStart(known),false);
 const labs=db();labs.setItem("shaira-labs-v1",JSON.stringify({drafts:{"portfolio:test":"привет"}}));
 assert.equal(needsMicroStart(labs),false);
 const started=db();started.setItem(MICRO_KEY,JSON.stringify({index:4,mode:"steady"}));
 started.setItem("shaira-academy-v1",JSON.stringify({done:{"other/words":150}}));
 assert.equal(needsMicroStart(started),true,"manual beginner preference persists after other exercises");
 const complete=db();complete.setItem(MICRO_KEY,JSON.stringify({index:78,mode:"gentle"}));
 assert.equal(needsMicroStart(complete),false);
});
test("portable backups preserve tiny-step progress/difficulty, reject malformed payload and prototype data",()=>{
 const storage=db();changeMicroMode("steady",storage);
 finishMicroRung(0,answerFor(FIRST_STEPS[0],"steady"),storage,1800000000000);
 const file=buildBackup(storage);
 assert.equal(file.micro.index,1);
 assert.equal(file.micro.mode,"steady");
 const other=db();restoreBackup(JSON.stringify(file),other);
 assert.equal(readMicro(other).index,1);
 assert.equal(readMicro(other).mode,"steady");
 const corrupted={...file,micro:{index:999,mode:"super-secret",wrong:-5,totalPractice:999999999,finished:[
  {index:1,method:"fake",at:10},{index:0,method:"learned",at:14},{index:2,method:"tested",at:-1}]}};
 const target=db();restoreBackup(JSON.stringify(corrupted),target);
 assert.equal(readMicro(target).index,0);
 assert.equal(readMicro(target).mode,"gentle");
 assert.equal(readMicro(target).finished.length,1);
 assert.equal(readMicro(target).wrong,0);
});
test("English-first micro UI finishes actual first-letter practice and allows opting into challenge",()=>{
 const oldStorage=globalThis.localStorage,oldWindow=globalThis.window,oldDoc=globalThis.document;
 const storage=db();globalThis.localStorage=storage;globalThis.window={};
 let typed={value:"",selectionStart:0,selectionEnd:0,setRangeText(x){this.value+=x;},focus(){}};
 globalThis.document={getElementById:id=>id==="micro-typed"?typed:null};
 const api={render(){},speak(){},notice(){}};
 try{
  const initial=firstStepsHtml();
  assert.match(initial,/RUSSIAN FROM ABSOLUTE ZERO/);
  assert.match(initial,/One new letter: А/);
  assert.match(initial,/Gentle/);
  assert.match(initial,/micro-trace/);
  assert.match(initial,/78/);
  assert.match(firstStepsHomePreview(),/Start with absolute zero/);
  firstStepsAction({dataset:{micro:"start"}},api);
  for(let i=0;i<2;i++){
   const html=firstStepsHtml(),q=microQuestions(FIRST_STEPS[0])[i];
   assert.match(html,new RegExp("Question "+(i+1)+" / 2"));
   const choices=[...html.matchAll(/data-micro="choice" data-choice="(\d+)"[^>]*>([^<]+)<\/button>/g)];
   assert.equal(choices.length,3);
   const correct=choices.find(c=>c[2]===q.answer);
   assert.ok(correct,"correct choice must appear: "+q.answer);
   firstStepsAction({dataset:{micro:"choice",choice:correct[1]}},api);
   assert.match(firstStepsHtml(),/You got it!/);
   firstStepsAction({dataset:{micro:"continue"}},api);
  }
  assert.equal(readMicro(storage).index,1);
  assert.match(firstStepsHtml(),/one tiny step/i);
  firstStepsAction({dataset:{micro:"next"}},api);
  assert.match(firstStepsHtml(),/One new letter: М/);
  assert.match(firstStepsHtml(),/Clear drawing/);
  firstStepsAction({dataset:{micro:"mode",value:"challenge"}},api);
  assert.equal(readMicro(storage).mode,"challenge");
  assert.match(firstStepsHtml(),/4 checks/);
  firstStepsAction({dataset:{micro:"start"}},api);
  assert.match(firstStepsHtml(),/Question 1 \/ 4/);
 }finally{globalThis.localStorage=oldStorage;globalThis.window=oldWindow;globalThis.document=oldDoc;}
});
test("optional UI fast-track is hidden at the beginning and verifies six choices before a skip",()=>{
 const oldStorage=globalThis.localStorage,oldWindow=globalThis.window;
 const storage=db();globalThis.localStorage=storage;globalThis.window={};
 const api={render(){},speak(){},notice(){}};
 try{
  assert.doesNotMatch(firstStepsHtml(),/data-micro="fast-track"/);
  for(let i=0;i<3;i++)assert.equal(finishMicroRung(i,answerFor(FIRST_STEPS[i]),storage).ok,true);
  firstStepsHtml();
  assert.match(firstStepsHtml(),/data-micro="fast-track"/);
  firstStepsAction({dataset:{micro:"fast-track"}},api);
  for(let i=0;i<6;i++){
   const html=firstStepsHtml();
   const step=FIRST_STEPS[3+Math.floor(i/2)],q=microQuestions(step)[i%2];
   const choices=[...html.matchAll(/data-micro="skip-choice" data-choice="(\d+)"[^>]*>([^<]+)<\/button>/g)];
   assert.equal(choices.length,3);
   const correct=choices.find(c=>c[2]===q.answer);
   assert.ok(correct,step.id+" "+q.id);
   firstStepsAction({dataset:{micro:"skip-choice",choice:correct[1]}},api);
  }
  assert.equal(readMicro(storage).index,6);
  assert.match(firstStepsHtml(),/Three steps checked!/);
  firstStepsAction({dataset:{micro:"back"}},api);
  assert.match(firstStepsHtml(),/One new letter: Т/);
 }finally{globalThis.localStorage=oldStorage;globalThis.window=oldWindow;}
});
test("new iPhone student routing, curriculum links, CSS and offline precache all include micro-stairs",()=>{
 const get=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
 const app=get("assets/app.js"),academy=get("assets/academy-ui.js"),sw=get("sw.js");
 assert.match(app,/needsMicroStart\(\)\|\|microCelebrationPending\(\)/);
 assert.match(app,/route==="academy\/first-steps"/);
 assert.match(app,/firstStepsSubmit/);
 assert.match(app,/firstStepsInput/);
 assert.match(app,/firstStepsAction/);
 assert.ok(academy.includes("#academy/first-steps"));
 for(const f of ["first-steps-data.js","first-steps-engine.js","first-steps-ui.js","first-steps.css"])assert.ok(sw.includes(f),f);
 const html=get("index.html");assert.ok(html.includes("first-steps.css"));
});
