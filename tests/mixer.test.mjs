import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {VERBS,VERB_FORMS,SUBJECTS,PAST_SUBJECTS} from "../assets/verb-paradigms.js";
import {sentencePatterns,corrections} from "../assets/practice-content.js";
import {bankForStage,selectMix,gradeMixAnswer,recordMixAnswer,recordMixSession,loadMix,mixStats,MIX_TYPES,MIX_LENGTH} from "../assets/practice-engine.js";
import {mixerHtml,mixerAction,mixerSubmit} from "../assets/practice-ui.js";
import {verbHtml,verbAction} from "../assets/verb-ui.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";
import {makeDay,beginDay,saveDayState,snapshot,stepComplete} from "../assets/daily-plan.js";
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
const stageIds=["starter","a1","a2","b1","b2"];
test("24 manually authored verbs cover 240 conjugated forms and irregular Russian patterns",()=>{
 assert.equal(VERBS.length,24);
 assert.equal(VERB_FORMS.length,240);
 assert.equal(new Set(VERB_FORMS.map(x=>x.id)).size,240);
 assert.equal(SUBJECTS.length,7);
 assert.equal(PAST_SUBJECTS.length,3);
 for(const v of VERBS){
  assert.ok(stageIds.includes(v.stage)&&v.now.length===6&&v.past.length===3);
  for(const form of [...v.now,...v.past])assert.match(form,/[\u0400-\u052F]/u,v.id);
  assert.match(v.example,/[\u0400-\u052F]/u,v.id);
 }
 const verb=id=>VERBS.find(x=>x.id===id);
 assert.equal(verb("speak").now[5],"говорят");
 assert.equal(verb("write").now[0],"пишу");
 assert.equal(verb("live").now[1],"живёшь");
 assert.equal(verb("want").now[3],"хотим");
 assert.equal(verb("be-able").past[1],"могла");
 assert.equal(verb("go-foot").past[0],"шёл");
 assert.equal(verb("go-foot").past[1],"шла");
 assert.equal(verb("eat").now[3],"едим");
 assert.equal(verb("drink").now[0],"пью");
 assert.equal(verb("sleep").now[5],"спят");
});
test("all 80 authored construction/repair examples are distinct and stage-appropriate",()=>{
 assert.equal(sentencePatterns.length,40);
 assert.equal(corrections.length,40);
 assert.equal(new Set(sentencePatterns.map(p=>p.ru)).size,40);
 for(const stage of stageIds){
  assert.equal(sentencePatterns.filter(x=>x.stage===stage).length,8);
  assert.equal(corrections.filter(x=>x.stage===stage).length,8);
 }
 for(const c of corrections){
  assert.ok(c.correct!==c.wrong&&c.explain.length>20);
  assert.match(c.correct,/[\u0400-\u052F]/u);
  assert.match(c.wrong,/[\u0400-\u052F]/u);
 }
});
test("verb reference exposes every person and Russian sample in English",()=>{
 const list=verbHtml("academy/verbs");
 assert.match(list,/Russian Verb Lab/);
 assert.match(list,/24 everyday verbs/);
 for(const v of VERBS){
  assert.ok(list.includes('#academy/verbs/'+v.id));
  const html=verbHtml("academy/verbs/"+v.id);
  for(const form of [...v.now,...v.past])assert.ok(html.includes(form),v.id+" "+form);
  assert.match(html,/data-verb="speak"/);
 }
 let spoken="";
 verbAction({dataset:{verb:"speak",russian:"Я живу в Минске."}},{speak:x=>spoken=x});
 assert.equal(spoken,"Я живу в Минске.");
});
test("the adaptive bank spans up to 13 different meaningful tasks per stage",()=>{
 for(const stage of stageIds){
  const bank=bankForStage(stage,{audio:true,random:()=>0.33});
  const types=new Set(bank.map(x=>x.mode));
  assert.equal(types.has("grammar"),true,stage);
  assert.equal(types.has("order"),true,stage);
  assert.equal(types.has("translate"),true,stage);
  assert.equal(types.has("repair"),true,stage);
  assert.equal(types.has("read"),true,stage);
  assert.equal(types.has("match"),true,stage);
  assert.equal(types.has("verb"),true,stage);
  assert.ok(types.size>=11,stage+" modes "+[...types].join(","));
  assert.ok(bank.length>95,stage+" tasks");
  assert.equal(new Set(bank.map(x=>x.id)).size,bank.length,stage+" unique question IDs");
  for(const q of bank){
   assert.ok(MIX_TYPES.includes(q.mode));
   assert.ok(q.id&&q.prompt&&q.explanation);
   assert.ok(q.answer);
   if(q.options){
    assert.ok(q.options.includes(q.answer),q.id);
    assert.equal(new Set(q.options).size,q.options.length,q.id);
   }
   if(q.mode==="match"){
    assert.equal(q.pairs.length,4);
    assert.equal(new Set(q.pairs.map(x=>x.en)).size,4);
    assert.equal(new Set(q.pairs.map(x=>x.ru)).size,4);
   }
   if(q.mode==="order"){
    assert.ok(q.tokens.length>=3);
    assert.equal(new Set(q.tokens.map(x=>x.id)).size,q.tokens.length);
    assert.equal(q.tokens.map(x=>x.word).sort().join(" "),q.answer.replace(/[.!?]+$/u,"").split(" ").sort().join(" "));
   }
   if(["hear","dictate"].includes(q.mode))assert.ok(q.audio);
  }
 }
});
test("adapted 12-question rounds sample many different modes without repeating the same source",()=>{
 for(const stage of stageIds){
  for(let seed=1;seed<=5;seed++){
   let i=seed*21;
   const random=()=>{i=(i*1664525+1013904223)>>>0;return i/4294967296;};
   const a=selectMix(stage,{items:{}},{audio:false,random});
   assert.equal(a.length,MIX_LENGTH,stage);
   assert.equal(new Set(a.map(x=>x.id)).size,MIX_LENGTH);
   assert.equal(new Set(a.map(x=>x.source||x.id)).size,MIX_LENGTH);
   assert.ok(new Set(a.map(x=>x.mode)).size>=9,stage+" must include varied skill types");
   assert.ok(a.filter(x=>["spell","case","verb","order","translate","dictate"].includes(x.mode)).length>=2);
   assert.ok(a.every(q=>!["hear","dictate"].includes(q.mode)));
  }
 }
});
test("typing, word ordering and matching are graded with explicit model answers, not guesses",()=>{
 const bank=bankForStage("a1",{audio:false});
 for(const q of bank.slice(0,40)){
  const entered=q.mode==="match"?q.pairs:q.mode==="order"?q.answer:q.answer;
  assert.equal(gradeMixAnswer(q,entered),true,q.id);
  if(q.mode!=="match")assert.equal(gradeMixAnswer(q,"definitely incorrect"),false,q.id);
 }
 const order=bank.find(x=>x.mode==="order");
 assert.ok(order);
 assert.equal(gradeMixAnswer(order,order.answer.toUpperCase().replace(/\./g," !")),true);
 assert.equal(gradeMixAnswer(order,"Я не умею говорить"),false);
 const matcher=bank.find(x=>x.mode==="match");
 assert.ok(matcher);
 assert.equal(gradeMixAnswer(matcher,matcher.pairs),true);
 assert.equal(gradeMixAnswer(matcher,[]),false);
});
test("incorrect answers return sooner and all results survive backup and restore",()=>{
 const db=store(),id="verb:read:present:ya",start=1800000000000;
 assert.equal(recordMixAnswer(id,false,db,start),true);
 let first=loadMix(db).items[id];
 assert.equal(first.seen,1);
 assert.equal(first.correct,0);
 assert.equal(first.streak,0);
 assert.equal(first.due,start+86400000);
 assert.equal(recordMixAnswer(id,true,db,start+5000),true);
 first=loadMix(db).items[id];
 assert.equal(first.streak,1);
 const passed=recordMixSession("starter",
  Array.from({length:12},(_,i)=>({mode:i<3?"verb":"grammar",correct:i<10})),db,start+10000);
 assert.equal(passed.passed,true);
 assert.equal(passed.productive,3);
 assert.equal(mixStats(db).practised,1);
 assert.equal(mixStats(db).passed,1);
 const file=buildBackup(db);
 assert.equal(file.mixer.sessions.length,1);
 const other=store();restoreBackup(JSON.stringify(file),other);
 assert.equal(loadMix(other).items[id].correct,1);
 assert.equal(loadMix(other).sessions[0].passed,true);
});
test("malformed custom backup mixer results cannot inject prototype keys or bypass pass thresholds",()=>{
 const db=store(),base=buildBackup(db);
 const altered={...base,mixer:{items:JSON.parse('{"__proto__":{"seen":1,"correct":1,"streak":1,"last":1,"due":1},"verb:read:present:ya":{"seen":2,"correct":1,"streak":1,"last":20,"due":90000000},"invalid id":{"seen":1}}'),
  sessions:[{stage:"b1",score:0,productive:0,passed:true,last:4},{stage:"b2",score:11,productive:0,passed:true,last:5},{stage:"a2",score:11,productive:3,passed:true,last:6}]}};
 restoreBackup(JSON.stringify(altered),db);
 const data=loadMix(db);
 assert.equal(Object.prototype.hasOwnProperty.call(data.items,"__proto__"),false);
 assert.equal(data.items["verb:read:present:ya"].correct,1);
 assert.equal(data.sessions[0].passed,false);
 assert.equal(data.sessions[1].passed,false);
 assert.equal(data.sessions[2].passed,true);
});
test("weekly mix exercise must be freshly passed at 9/12 with two productive correct answers",()=>{
 const db=store(),t=1800000000000,day=makeDay(20);
 const rec=day.tasks.find(x=>x.kind==="mix");
 assert.ok(rec, "weekly review day 21");
 assert.equal(rec.key,"starter");
 const st=beginDay(db,new Date(t));st.index=20;st.startedAt=t;saveDayState(st,db);
 assert.equal(stepComplete(rec,st,snapshot(db)),false);
 const a=Array.from({length:12},(_,i)=>({mode:i<2?"verb":"grammar",correct:i<9}));
 recordMixSession("starter",a,db,t+100);
 assert.equal(stepComplete(rec,st,snapshot(db)),true);
 recordMixSession("starter",Array.from({length:12},(_,i)=>({mode:"grammar",correct:true})),db,t+200);
 assert.equal(stepComplete(rec,st,snapshot(db)),false);
 const another=makeDay(83).tasks.find(x=>x.kind==="mix");
 assert.equal(another.key,"a1");
});
test("end-to-end English UI answers a round of 12 mixed exercises and records scores",()=>{
 const oldStorage=globalThis.localStorage,oldWindow=globalThis.window,oldDoc=globalThis.document,
   oldSpeech=globalThis.SpeechSynthesisUtterance;
 const db=store();
 let input={value:"",selectionStart:0,selectionEnd:0,setRangeText(){},focus(){}};
 globalThis.localStorage=db;globalThis.window={};delete globalThis.SpeechSynthesisUtterance;
 globalThis.document={getElementById:id=>id==="mx-answer"?input:null};
 try{
  const api={route:()=>"academy/mix/starter",render(){},speak(){}};
  assert.match(mixerHtml("academy/mix"),/Variety Lab/);
  for(let i=0;i<MIX_LENGTH;i++){
   const html=mixerHtml("academy/mix/starter");
   assert.match(html,new RegExp("Question "+(i+1)+"/12"));
   const form=html.includes('id="mx-answer-form"');
   if(form){
    const prompt=html.match(/<h2>([\s\S]*?)<\/h2>/);
    input.value="not a real answer";
    mixerSubmit({target:{id:"mx-answer-form"},preventDefault(){}},api);
   }else if(html.includes('data-mix="submit-order"')){
    // Choose all remaining tokens, even if the order is not correct.
    let remaining=html.matchAll(/data-mix="token" data-token="(\d+)"/g);
    for(const x of remaining)mixerAction({dataset:{mix:"token",token:x[1]}},api);
    mixerAction({dataset:{mix:"submit-order"}},api);
   }else if(html.includes('data-mix="pick-ru"')){
    // Dynamically choose matching Russian and English words using the visible pairs.
    // Test that a matching task can at least be rendered, then score it via a synthetic choice.
    assert.match(html,/mx-match/);
    // In a session match options have correct English choices; choose every Russian then
    // try all English candidates until a correct pair is found.
    for(let r=0;r<4;r++){
      let now=mixerHtml("academy/mix/starter");
      const ru=[...now.matchAll(/data-mix="pick-ru" data-item="(\d+)"[^>]*>/g)];
      const available=ru.filter(x=>!x[0].includes("disabled"));
      if(!available.length)break;
      mixerAction({dataset:{mix:"pick-ru",item:available[0][1]}},api);
      for(let k=0;k<4;k++){
        const x=mixerHtml("academy/mix/starter");
        if(x.includes('class="mx-feedback'))break;
        const en=[...x.matchAll(/data-mix="pick-en" data-item="(\d+)"([^>]*)>/g)];
        if(en[k]&&!en[k][2].includes("disabled")){
          mixerAction({dataset:{mix:"pick-en",item:en[k][1]}},api);
        }
        if(mixerHtml("academy/mix/starter").includes("4/4 pairs matched."))break;
      }
    }
   }else{
    const opts=[...html.matchAll(/data-mix="choice" data-choice="(\d+)"/g)];
    assert.ok(opts.length>=2);
    mixerAction({dataset:{mix:"choice",choice:opts[0][1]}},api);
   }
   const result=mixerHtml("academy/mix/starter");
   assert.match(result,/mx-feedback/, "exercise has a scored answer: "+i);
   mixerAction({dataset:{mix:"next"}},api);
  }
  const result=mixerHtml("academy/mix/starter");
  assert.match(result,/12 correct/);
  assert.equal(loadMix(db).sessions.length,1);
 }finally{globalThis.localStorage=oldStorage;globalThis.window=oldWindow;globalThis.document=oldDoc;globalThis.SpeechSynthesisUtterance=oldSpeech;}
});
