import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sections, lessons, alphabet, keyboardRows } from "../assets/lessons.js";

test("main interface completes a lesson, switches language, and opens writing canvas", () => {
  const source = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8")
    .replace(/^import .*?;$/gm, "");
  const events = {}, windowEvents = {}, storage = new Map();
  const app = { innerHTML: "" };
  const toast = { hidden: true, textContent: "" };
  const context2d = { setTransform(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, clearRect(){} };
  const canvas = {
    width: 0, height: 0,
    getBoundingClientRect(){ return { width: 300, height: 244, left:0, top:0 }; },
    getContext(){ return context2d; },
    addEventListener(){}, removeEventListener(){}, setPointerCapture(){}
  };
  const document = {
    documentElement: { lang: "en" }, title: "",
    getElementById(id){ return ({ app, toast, "writing-canvas": canvas })[id] || null; },
    addEventListener(type, fn){ events[type] = fn; }
  };
  const window = {
    devicePixelRatio: 2, confirm(){ return true; },
    addEventListener(type, fn){ windowEvents[type] = fn; }
  };
  let hash="#home";
  const location = {
    get hash(){ return hash; },
    set hash(v){ hash = v.startsWith("#") ? v : "#" + v; }
  };
  const localStorage = {
    getItem(key){return storage.get(key)||null;},
    setItem(key,value){storage.set(key,value);}
  };
  const navigator = {};
  const academyStatistics = () => ({completed:0,activities:264,knownWords:0,dueWords:0});
  const labStats = () => ({readingsPassed:0,readingsTotal:20,grammarAttempts:0});
  const run = new Function("sections","lessons","alphabet","keyboardRows","document","window","location","navigator","localStorage","academyStatistics","labStats",source);
  run(sections,lessons,alphabet,keyboardRows,document,window,location,navigator,localStorage,academyStatistics,labStats);
  const click=(action,props={})=>events.click({target:{closest:selector=>selector==="[data-action]"?{dataset:{action,...props}}:null}});
  assert.match(app.innerHTML,/Your learning path/);
  click("open-lesson",{id:"vowels"});
  assert.match(app.innerHTML,/10 Russian vowels/);
  for(let i=0;i<5;i++) click("next-card");
  assert.match(app.innerHTML,/Which letter usually/);
  click("choose",{value:"У"});
  assert.match(app.innerHTML,/Not quite/);
  click("choose",{value:"Я"});
  assert.match(app.innerHTML,/Correct!/);
  assert.deepEqual(JSON.parse(storage.get("shaira-progress-v1")).completed, ["vowels"]);
  click("finish-lesson");
  click("language",{value:"tl"});
  assert.match(app.innerHTML,/Kumusta, Shaira/);
  assert.equal(document.documentElement.lang, "fil");
  location.hash="#write";windowEvents.hashchange();
  assert.match(app.innerHTML,/writing-canvas/);
  assert.ok(canvas.width >= 300);
});
