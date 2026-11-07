import test from "node:test";
import assert from "node:assert/strict";
import {NOUNS,CASES,CASE_ITEMS,formOf,formKey} from "../assets/declension-tables.js";
import {caseStatistics,selectCaseQuestions,recordCaseQuiz,caseHtml,caseSubmit,caseAction} from "../assets/case-trainer.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";
import {makeDay,beginDay,readDayState,saveDayState,snapshot,stepComplete} from "../assets/daily-plan.js";
const db=()=>{const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
test("24 adult Russian nouns have all 288 explicit accurate-case structures",()=>{
 assert.equal(NOUNS.length,24);
 assert.equal(CASES.length,6);
 assert.equal(CASE_ITEMS.length,288);
 assert.equal(new Set(NOUNS.map(x=>x.id)).size,24);
 assert.equal(new Set(CASE_ITEMS.map(x=>x.id)).size,288);
 for(const n of NOUNS){
   assert.ok(n.en&&n.tl&&["m","f","n"].includes(n.gender),n.id);
   assert.equal(n.forms.sg.length,6,n.id);
   assert.equal(n.forms.pl.length,6,n.id);
   for(const number of ["sg","pl"])for(const form of n.forms[number])assert.match(form,/[\u0400-\u052F]/u,n.id);
 }
 for(const c of CASES){
  assert.ok(c.en&&c.tl&&c.purpose.en&&c.purpose.tl);
 }
 const word=name=>NOUNS.find(n=>n.id===name);
 assert.equal(formOf(word("book"),"sg","acc"),"книгу");
 assert.equal(formOf(word("book"),"pl","gen"),"книг");
 assert.equal(formOf(word("friend"),"pl","acc"),"друзей");
 assert.equal(formOf(word("friend"),"pl","ins"),"друзьями");
 assert.equal(formOf(word("person"),"pl","nom"),"люди");
 assert.equal(formOf(word("mother"),"pl","acc"),"мам");
 assert.equal(formOf(word("sister"),"pl","nom"),"сёстры");
 assert.equal(formOf(word("letter"),"pl","gen"),"писем");
 assert.equal(formOf(word("night"),"sg","ins"),"ночью");
 assert.equal(formOf(word("family"),"sg","acc"),"семью");
});
test("case trainer selects 10 unseen forms across all six cases and distinct nouns",()=>{
 const storage=db(),q=selectCaseQuestions(storage);
 assert.equal(q.length,10);
 assert.equal(new Set(q.map(x=>x.id)).size,10);
 assert.equal(new Set(q.map(x=>x.caseId)).size,6);
 assert.equal(new Set(q.map(x=>x.noun.id)).size,10);
 const record=recordCaseQuiz(q,q.map(x=>x.answer),storage,1790000000000);
 assert.equal(record.score,10);
 assert.equal(record.passed,true);
 assert.equal(caseStatistics(storage).studied,10);
 assert.equal(caseStatistics(storage).passed,1);
 const second=selectCaseQuestions(storage);
 assert.ok(second.every(x=>!q.some(old=>old.id===x.id)), "a new practice round should prioritise unstudied forms");
 const wrong=recordCaseQuiz(second,second.map((x,i)=>i===0?"xxx":x.answer),storage,1790000000010);
 assert.equal(wrong.score,9);
 assert.equal(wrong.passed,true);
 const fail=recordCaseQuiz(second,second.map(()=>"wrong"),storage,1790000000020);
 assert.equal(fail.score,0);
 assert.equal(fail.passed,false);
 assert.equal(caseStatistics(storage).lastScore,0);
});
test("A1 and A2 guided study checks require new 8/10 case quiz and reject earlier scores",()=>{
 const storage=db(),t=1800000000000,day=makeDay(42+2*7+1),step=day.tasks.find(x=>x.kind==="case-quiz");
 assert.ok(step,"third A1 week must practise all noun cases");
 let state=beginDay(storage,new Date(t));state.index=day.index;state.startedAt=t;saveDayState(state,storage);
 assert.equal(stepComplete(step,state,snapshot(storage)),false);
 const q=selectCaseQuestions(storage);
 recordCaseQuiz(q,q.map(x=>x.answer),storage,t+100);
 assert.equal(stepComplete(step,state,snapshot(storage)),true);
 recordCaseQuiz(q,q.map(()=>"wrong"),storage,t+200);
 assert.equal(stepComplete(step,state,snapshot(storage)),false);
 const dayA2=makeDay(84+1);
 assert.ok(dayA2.tasks.some(x=>x.kind==="case-quiz"));
 assert.ok(!makeDay(14+1).tasks.some(x=>x.kind==="case-quiz"),"Pre-A1 does not demand formal inflections");
});
test("case results survive secure export and import; input scores are bounded",()=>{
 const source=db(),q=selectCaseQuestions(source);
 recordCaseQuiz(q,q.map(x=>x.answer),source,1800000000000);
 const backup=buildBackup(source),target=db();
 assert.equal(backup.cases.sessions[0].score,10);
 restoreBackup(JSON.stringify(backup),target);
 assert.equal(caseStatistics(target).studied,10);
 assert.equal(caseStatistics(target).passed,1);
 const malicious={...backup,cases:{
   items:JSON.parse('{"__proto__":{"seen":100,"correct":99,"last":1},"friend:sg:gen":{"seen":3,"correct":2,"last":44}}'),
   sessions:[{score:500,passed:true,last:1},{score:7,passed:false,last:22}]
 }};
 const other=db();
 restoreBackup(JSON.stringify(malicious),other);
 assert.equal(caseStatistics(other).passed,0);
 assert.equal(JSON.parse(other.getItem("shaira-case-practice-v1")).items["friend:sg:gen"].correct,2);
 assert.equal(Object.prototype.hasOwnProperty.call(JSON.parse(other.getItem("shaira-case-practice-v1")).items,"__proto__"),false);
});
test("case tables and productive quiz UI render in both languages and persist answers",()=>{
 const oldLocal=globalThis.localStorage,oldDoc=globalThis.document;
 const storage=db();globalThis.localStorage=storage;
 let input={value:""};
 globalThis.document={getElementById:id=>id==="cs-answer"?input:null};
 try{
   assert.match(caseHtml("academy/cases","en"),/Russian case trainer/);
   assert.match(caseHtml("academy/cases","tl"),/Pagsasanay sa mga kaso/);
   assert.match(caseHtml("academy/cases/noun/book","en"),/книгой/);
   assert.match(caseHtml("academy/cases/noun/person","tl"),/людьми/);
   const api={route:()=>"academy/cases/quiz",render(){}};
   for(let i=0;i<10;i++){
     const html=caseHtml("academy/cases/quiz","en");
     assert.match(html,/cs-answer/);
     const expected=html.match(/value=""[^>]*\/>/);
     // Read the answer from the visible prompt only through the question session.
     // This test intentionally enters the wrong form to check feedback flow.
     input.value="incorrect";
     caseSubmit({target:{id:"cs-form"},preventDefault(){}},api);
     assert.match(caseHtml("academy/cases/quiz","en"),/Correct form/);
     caseAction({dataset:{case:"next"}},api);
   }
   assert.equal(caseStatistics(storage).lastScore,0);
   assert.match(caseHtml("academy/cases/quiz","en"),/0\/10/);
   caseAction({dataset:{case:"restart"}},api);
   assert.match(caseHtml("academy/cases/quiz","en"),/cs-answer/);
 }finally{globalThis.localStorage=oldLocal;globalThis.document=oldDoc;}
});
