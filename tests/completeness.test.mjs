import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SOUND_PAIRS,SOUND_STAGES,soundForStage} from "../assets/phonetics-content.js";
import {phoneticsHtml,phoneticsAction,loadSounds,recordSound,soundStats} from "../assets/phonetics-ui.js";
import {studyCoachData,coachHtml} from "../assets/study-coach.js";
import {WRITING_RUBRIC,inspectRussianDraft,russianWords} from "../assets/writing-coach.js";
import {makeDay,beginDay,readDayState,saveDayState,snapshot,stepComplete,chooseReadingAlternative} from "../assets/daily-plan.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";
const db=()=>{const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};
test("30 original Russian sound contrasts cover 5 stages and 60 distinct target positions",()=>{
 assert.equal(SOUND_PAIRS.length,30);
 assert.equal(new Set(SOUND_PAIRS.map(x=>x.id)).size,30);
 for(const stage of SOUND_STAGES)assert.equal(soundForStage(stage).length,6,stage);
 for(const p of SOUND_PAIRS){
  assert.ok(p.focus.length>12&&p.explain.length>50,p.id);
  assert.match(p.a.ru,/[\u0400-\u052F]/u,p.id);
  assert.match(p.b.ru,/[\u0400-\u052F]/u,p.id);
  assert.notEqual(p.a.ru,p.b.ru);
  assert.ok(p.a.en&&p.b.en,p.id);
 }
});
test("sound discrimination only grades recorded attempts for one of two valid targets",()=>{
 const s=db(),t=1800000000000,id=SOUND_PAIRS[0].id;
 assert.equal(recordSound("fake-id",0,true,s,t),false);
 assert.equal(recordSound(id,2,true,s,t),false);
 assert.equal(recordSound(id,0,"true",s,t),false);
 assert.equal(recordSound(id,0,true,s,t),true);
 assert.equal(recordSound(id,1,false,s,t+50),true);
 const data=loadSounds(s).items;
 assert.equal(data[id+":0"].seen,1);
 assert.equal(data[id+":0"].correct,1);
 assert.equal(data[id+":0"].lastCorrect,true);
 assert.equal(data[id+":1"].lastCorrect,false);
 assert.equal(soundStats(s).targets,2);
 assert.equal(data[id+":1"].due,t+50+86400000);
 assert.equal(data[id+":0"].due,t+86400000);
});
test("phonetics listing, playback gating and offline fallback distinguish practice from reading",()=>{
 const originalStorage=globalThis.localStorage,originalWindow=globalThis.window,originalSpeech=globalThis.SpeechSynthesisUtterance;
 const storage=db();globalThis.localStorage=storage;globalThis.window={};
 delete globalThis.SpeechSynthesisUtterance;
 const id=SOUND_PAIRS[0].id;
 try{
  assert.match(phoneticsHtml("academy/sounds"),/Hear the Difference/);
  assert.match(phoneticsHtml("academy/sounds/"+id),/data-sound="answer"[^>]*disabled/);
  const api={route:()=>"academy/sounds/"+id,render(){},speak(_text,_rate,done){done(false);}};
  phoneticsAction({dataset:{sound:"answer",answer:"0"}},api);
  assert.equal(soundStats(storage).targets,0);
  phoneticsAction({dataset:{sound:"play"}},api);
  assert.equal(soundStats(storage).targets,0);
  assert.match(phoneticsHtml("academy/sounds/"+id),/Could not play this example/);
  let heard="";
  const liveApi={...api,speak(text,_rate,done,clip){heard=text;assert.match(clip,/^luk-lyuk-[01]$/);done(true);}};
  phoneticsAction({dataset:{sound:"play"}},liveApi);
  assert.ok([SOUND_PAIRS[0].a.ru,SOUND_PAIRS[0].b.ru].includes(heard));
  const visible=phoneticsHtml("academy/sounds/"+id);
  assert.match(visible,/data-sound="answer"/);
  phoneticsAction({dataset:{sound:"answer",answer:"0"}},liveApi);
  assert.equal(soundStats(storage).targets,1);
  assert.match(phoneticsHtml("academy/sounds/"+id),/The spoken word was/);
  const prior=JSON.stringify(loadSounds(storage));
  phoneticsAction({dataset:{sound:"answer",answer:"1"}},liveApi);
  assert.equal(JSON.stringify(loadSounds(storage)),prior,"cannot grade repeatedly in same session");
  phoneticsAction({dataset:{sound:"retry"}},liveApi);
  assert.match(phoneticsHtml("academy/sounds/"+id),/Which Russian word did you hear/);
 }finally{globalThis.localStorage=originalStorage;globalThis.window=originalWindow;globalThis.SpeechSynthesisUtterance=originalSpeech;}
});
test("guided session uses a new phonetic discrimination on each listening-focused week",()=>{
 for(const stage of SOUND_STAGES){
  const i=SOUND_STAGES.indexOf(stage);
  for(let week=0;week<6;week++){
   const day=makeDay(i*42+week*7+2);
   const task=day.tasks.find(x=>x.kind==="sound");
   assert.ok(task,stage+":"+week);
   assert.equal(task.key,soundForStage(stage)[week].id);
   assert.ok(task.href.startsWith("#academy/sounds/"));
  }
 }
 const s=db(),t=1800000000000,day=makeDay(2),step=day.tasks.find(x=>x.kind==="sound");
 const state=beginDay(s,new Date(t));state.index=2;state.startedAt=t;saveDayState(state,s);
 assert.equal(stepComplete(step,state,snapshot(s)),false);
 recordSound(step.key,0,true,s,t+10);
 assert.equal(stepComplete(step,state,snapshot(s)),true);
 recordSound(step.key,0,false,s,t+20);
 assert.equal(stepComplete(step,state,snapshot(s)),false);
 assert.equal(stepComplete(step,state,snapshot(s),false),false);
 s.setItem("shaira-academy-v1",JSON.stringify({done:{[step.fallback]:t+30}}));
 assert.equal(stepComplete(step,state,snapshot(s),false),false,"built-in audio works without a system voice");
 assert.equal(chooseReadingAlternative(step.id,s),true);
 assert.equal(stepComplete(step,readDayState(s),snapshot(s),true),true);
});
test("phonetics practice survives portable backup and prototype keys cannot be restored",()=>{
 const s=db(),id=SOUND_PAIRS[0].id;
 recordSound(id,1,true,s,1800000000000);
 const file=buildBackup(s);
 assert.equal(file.phonetics.items[id+":1"].lastCorrect,true);
 const target=db();restoreBackup(JSON.stringify(file),target);
 assert.equal(loadSounds(target).items[id+":1"].correct,1);
 const corrupted={...file,phonetics:{items:JSON.parse('{"__proto__":{"seen":1,"correct":1,"last":1,"streak":1,"due":1},"abc:9":{"seen":1,"correct":1,"last":1,"streak":1,"due":1},"luk-lyuk:0":{"seen":1,"correct":2,"last":1,"streak":1,"due":1}}')}};
 const fresh=db();restoreBackup(JSON.stringify(corrupted),fresh);
 const data=loadSounds(fresh).items;
 assert.equal(Object.prototype.hasOwnProperty.call(data,"__proto__"),false);
 assert.equal(data["abc:9"],undefined);
 assert.equal(data["luk-lyuk:0"],undefined);
});
test("Russian Writing Coach identifies high-confidence grammatical model errors with Cyrillic word boundaries",()=>{
 const text="Я зовут Шаира. Я читать книгу. Это мой книга. Мы говорит по-русски. Я пью чай без сахар.";
 const r=inspectRussianDraft(text,"starter");
 const ids=new Set(r.findings.map(x=>x.id));
 for(const id of ["incorrect-name","first-person-read","my-book","we-speaks","no-sugar"]){
   assert.ok(ids.has(id),id+" absent in "+JSON.stringify(r.findings));
 }
 assert.ok(r.suggestions.length);
 assert.equal(r.checks.find(x=>x.id==="cyrillic").pass,true);
 assert.deepEqual(russianWords("Привет, Шаира!"),["Привет","Шаира"]);
 const correct=inspectRussianDraft("Меня зовут Шаира. Я читаю книгу. Это моя книга.","starter");
 assert.equal(correct.findings.length,0);
});
test("writing checker does not make CEFR proficiency claims and gives stage-specific guidance",()=>{
 const words=Object.keys(WRITING_RUBRIC);
 assert.deepEqual(words,["starter","a1","a2","b1","b2"]);
 const text="В этом отчёте представлена позиция автора. Однако результаты исследования ограничены. "+
 "С одной стороны, следует учитывать стоимость. С другой стороны, важно качество. "+
 "Таким образом, необходимо проверить данные и выводы.";
 const r=inspectRussianDraft(text,"b2");
 assert.equal(r.paragraphs,1);
 assert.ok(r.cohesion.length>=2,r.cohesion.join(", "));
 assert.ok(r.checks.some(x=>x.id==="paragraphs"&&!x.pass));
 assert.ok(r.suggestions.some(x=>x.includes("paragraphs")));
 assert.match(r.warning,/not Russian grammar/);
 assert.match(r.focus,/conclusion/);
 const none=inspectRussianDraft("","b2");
 assert.equal(none.wordCount,0);
 assert.ok(none.suggestions.some(x=>x.includes("Write a few")));
});
test("Study Coach computes seven real coverage categories and recommends missed activities",()=>{
 const s=db(),t=1800000000000;
 s.setItem("shaira-daily-v1",JSON.stringify({index:168}));
 s.setItem("shaira-academy-v1",JSON.stringify({memory:{"word:foo":{seen:1,due:t-10}}}));
 const first=studyCoachData(s,t);
 assert.equal(first.stage,"b2");
 assert.equal(first.coverage.length,7);
 assert.equal(first.due,1);
 assert.equal(first.suggestions[0].id,"review");
 assert.ok(first.suggestions.some(x=>x.id==="writing"));
 assert.ok(first.suggestions.some(x=>x.id==="audio"));
 assert.ok(first.suggestions.some(x=>x.id==="sounds"));
 const chosen=first.suggestions.find(x=>x.id==="writing");
 assert.ok(chosen.href.startsWith("#academy/writing/task/"));
 const saved=db();
 saved.setItem("shaira-labs-v1",JSON.stringify({grammar:{b2:{lastScore:9}}}));
 const second=studyCoachData(saved,t);
 assert.equal(second.coverage.find(x=>x.id==="grammar").current,0,"starter is independent of B2");
});
test("English-first Writing Coach, Phonetics, Study Coach are integrated, cached and script-checked",()=>{
 const repo=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
 const app=repo("assets/app.js"),labs=repo("assets/learning-labs.js"),sw=repo("sw.js");
 assert.match(app,/academy\/sounds/);
 assert.match(app,/academy\/coach/);
 assert.match(labs,/review-writing/);
 assert.match(labs,/writingFeedback/);
 assert.match(labs,/russianWriterKeyboard/);
 assert.match(labs,/listen-draft/);
 assert.match(labs,/inspectRussianDraft/);
 for(const filename of ["phonetics-content.js","phonetics-ui.js","phonetics.css","study-coach.js","study-coach.css","writing-coach.js"]){
  assert.ok(sw.includes(filename),filename);
 }
});
