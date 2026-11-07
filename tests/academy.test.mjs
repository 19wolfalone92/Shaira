import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stages, units, activityModes, academyLessonTotal } from "../assets/academy-data.js";
import { firstWordPacks } from "../assets/first-words.js";
import { dialogues } from "../assets/dialogues.js";

const langs=["en","tl"];
test("five real course stages and teaching modes are populated",()=>{
  assert.deepEqual(stages.map(s=>s.id),["starter","a1","a2","b1","b2"]);
  assert.equal(units.length,32);
  assert.equal(academyLessonTotal,32*activityModes.length);
  assert.deepEqual(activityModes.map(m=>m.id),["words","listen","grammar","read","write","journal","speak"]);
  assert.equal(new Set(units.map(u=>u.id)).size,units.length);
  for(const stage of stages){
    assert.ok(units.filter(u=>u.stage===stage.id).length>=6,stage.id);
    for(const lang of langs) assert.ok(stage[lang]&&stage.target[lang]);
  }
});
test("each unit contains authentic RU teaching material in both learner languages",()=>{
  for(const u of units){
    assert.ok(stages.some(s=>s.id===u.stage),u.id);
    assert.equal(u.words.length,6,u.id);
    for(const lang of langs){
      assert.ok(u.title[lang],u.id+" title "+lang);
      assert.ok(u.rule[lang],u.id+" rule "+lang);
      assert.ok(u.example[lang],u.id+" model "+lang);
      assert.ok(u.reading[lang],u.id+" reading "+lang);
      assert.ok(u.question.prompt[lang],u.id+" question "+lang);
      assert.ok(u.writing.prompt[lang],u.id+" writing "+lang);
      assert.ok(u.journal.prompt[lang],u.id+" journal "+lang);
    }
    for(const w of u.words)for(const prop of ["ru","en","tl"])assert.ok(w[prop],u.id+" word "+prop);
    assert.match(u.example.ru,/[\u0400-\u04FF]/,u.id+" example Cyrillic");
    assert.match(u.reading.ru,/[\u0400-\u04FF]/,u.id+" reading Cyrillic");
    assert.match(u.writing.answer,/[\u0400-\u04FF]/,u.id+" target Cyrillic");
    assert.match(u.journal.model,/[\u0400-\u04FF]/,u.id+" model Cyrillic");
    assert.equal(u.question.choices.length,4,u.id+" options");
    assert.equal(new Set(u.question.choices).size,4,u.id+" distinct options");
    assert.ok(u.question.choices.includes(u.question.answer),u.id+" correct answer");
  }
});
test("beginner and adult picture-word sets preserve 40 themes and 240 cards",()=>{
  assert.equal(firstWordPacks.length,40);
  assert.equal(firstWordPacks.flatMap(p=>p.words).length,240);
  assert.equal(new Set(firstWordPacks.map(p=>p.id)).size,40);
  for(const p of firstWordPacks){
    assert.equal(p.words.length,6);
    assert.ok(p.title.en&&p.title.tl);
    for(const w of p.words){
      assert.ok(w.ru&&w.en&&w.tl&&w.icon, p.id);
      assert.match(w.ru,/[\u0400-\u04FF]/,p.id);
    }
  }
});
test("20 conversations each test one answer grounded in a readable script",()=>{
  assert.equal(dialogues.length,20);
  for(const d of dialogues){
    assert.ok(stages.some(s=>s.id===d.stage));
    assert.ok(d.lines.length>=4);
    for(const lang of langs) assert.ok(d.title[lang]&&d.goal[lang]&&d.question[lang]);
    for(const turn of d.lines){
      assert.ok(turn.ru&&turn.en&&turn.tl);
      assert.match(turn.ru,/[\u0400-\u04FF]/);
    }
    assert.equal(new Set(d.choices).size,4,d.id+" options");
    assert.ok(d.choices.includes(d.answer),d.id+" key");
  }
});
test("offline shell caches the complete connected academy",()=>{
  const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
  for(const filename of ["academy-data.js","academy-ui.js","academy.css","first-words.js","dialogues.js"])
    assert.ok(sw.includes(filename),filename);
  const index=readFileSync(new URL("../index.html",import.meta.url),"utf8");
  assert.match(index,/academy.css/);
});
test("academy routes, two teaching languages, exercises and writing panels render",async()=>{
  const prevLocalStorage=globalThis.localStorage;
  const prevWindow=globalThis.window;
  const records=new Map();
  globalThis.localStorage={getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)};
  globalThis.window={speechSynthesis:{cancel(){},speak(){},getVoices(){return[]}}};
  try{
    const {academyHtml,handleAcademyAction,academyStatistics}=await import("../assets/academy-ui.js");
    assert.match(academyHtml("academy","en"),/Russian Academy/);
    assert.match(academyHtml("academy","tl"),/Akademya ng Ruso/);
    assert.match(academyHtml("academy/first-words","en"),/First friends/);
    assert.match(academyHtml("academy/first-words/fw-01","tl"),/nanay/);
    assert.match(academyHtml("academy/dialogues/hello","en"),/Как дела/);
    assert.match(academyHtml("academy/level/b2","en"),/Argument/);
    assert.match(academyHtml("academy/lesson/advanced-writing/journal","en"),/<textarea/);
    assert.match(academyHtml("academy/lesson/advanced-writing/write","en"),/id="aca-answer"/);
    assert.match(academyHtml("academy/lesson/letters-1/speak","tl"),/Magsalita/);
    const grammar=academyHtml("academy/lesson/letters-1/grammar","en");
    assert.equal((grammar.match(/data-aca="single"/g)||[]).length,4);
    const mode="academy/first-words/fw-01";
    const api={route:()=>mode,language:()=>"en",render(){},speak(){},navigate(){}};
    const act=(name,choice=0)=>handleAcademyAction({dataset:{aca:name,choice:String(choice)}},api);
    act("start-quiz");
    for(let i=0;i<6;i++){
      const page=academyHtml(mode,"en");
      const russian=page.match(/class="aca-word-big" lang="ru">([^<]+)/)?.[1];
      const current=firstWordPacks[0].words.find(w=>w.ru===russian);
      assert.ok(current, "present word challenge");
      const opts=[...page.matchAll(/data-aca="answer" data-choice="(\d+)">([^<]+)<\/button>/g)];
      const hit=opts.find(x=>x[2]===current.en);
      assert.ok(hit, "matching translation");
      act("answer",hit[1]);
      act("next-task");
    }
    assert.ok(academyStatistics().completed>=1);
    assert.ok(academyStatistics().knownWords>=6);
    const snapshot=JSON.parse(records.get("shaira-academy-v1"));
    assert.ok(snapshot.done["fw-01/words"]);
    assert.ok(Object.keys(snapshot.memory).some(k=>k.startsWith("fw-01:")));
  }finally{
    globalThis.localStorage=prevLocalStorage;
    globalThis.window=prevWindow;
  }
});

test("a single due review word still has four distinct options; answers cannot be guessed by default",async()=>{
  const oldLocal=globalThis.localStorage,oldWindow=globalThis.window;
  const storage=new Map();
  storage.set("shaira-academy-v1",JSON.stringify({
    done:{},drafts:{},points:0,memory:{"fw-01:кошка":{stage:0,due:1,seen:1,correct:1}}
  }));
  globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
  globalThis.window={speechSynthesis:{cancel(){},speak(){},getVoices(){return []}}};
  try{
    const mod=await import("../assets/academy-ui.js?one-due="+Math.random());
    const html=mod.academyHtml("academy/review","en");
    const options=[...html.matchAll(/data-aca="answer" data-choice="\d+"[^>]*>([^<]+)</g)].map(m=>m[1]);
    assert.equal(options.length,4);
    assert.equal(new Set(options).size,4);
    assert.ok(options.includes("cat"));
  }finally{globalThis.localStorage=oldLocal;globalThis.window=oldWindow;}
});
