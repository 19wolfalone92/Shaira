import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {scenarioMissions} from "../assets/scenario-missions.js";
import {scenariosHtml,scenariosAction,scenarioStats,scenarioState,recordScene} from "../assets/scenario-ui.js";
import {buildBackup,restoreBackup} from "../assets/backup.js";
const storage=()=>{const map=new Map();return{
 getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),map}};
test("15 adult role-play scenarios cover five levels with 45 authored decisions and alternate consequences",()=>{
 assert.equal(scenarioMissions.length,15);
 assert.equal(new Set(scenarioMissions.map(x=>x.id)).size,15);
 const stages=["starter","a1","a2","b1","b2"];
 for(const level of stages)assert.equal(scenarioMissions.filter(x=>x.stage===level).length,3,level);
 for(const s of scenarioMissions){
  assert.ok(s.title&&s.setting.length>30,s.id);
  assert.equal(s.turns.length,3,s.id);
  for(const [i,t]of s.turns.entries()){
   assert.ok(t.goal.length>=20,s.id+":"+i);
   assert.match(t.speaker,/[\u0400-\u052F]/u);
   assert.equal(t.options.length,3);
   assert.equal(new Set(t.options).size,3);
   assert.ok(Number.isInteger(t.correct)&&t.correct>=0&&t.correct<3);
   assert.match(t.options[t.correct],/[\u0400-\u052F]/u);
   assert.match(t.right,/[\u0400-\u052F]/u);
   assert.match(t.wrong,/[\u0400-\u052F]/u);
   assert.ok(t.why.length>=25,s.id+":"+i);
  }
 }
});
test("completed scenario scores are verified and survive portable backup",()=>{
 const db=storage();
 assert.equal(recordScene("new-neighbour",3,db,1800000000000).passed,true);
 assert.equal(recordScene("new-neighbour",1,db,1800000000100).lastPassed,false);
 assert.equal(scenarioState(db).records["new-neighbour"].best,3);
 assert.equal(scenarioStats(db).passed,1);
 assert.equal(recordScene("nonexistent",3,db),null);
 assert.equal(recordScene("new-neighbour",9,db),null);
 const backup=buildBackup(db);assert.equal(backup.scenarios.records["new-neighbour"].lastScore,1);
 const other=storage();restoreBackup(JSON.stringify(backup),other);
 assert.equal(scenarioState(other).records["new-neighbour"].passed,true);
 assert.equal(scenarioState(other).records["new-neighbour"].lastPassed,false);
});
test("scenario import rejects forged scores, malformed ids and prototype pollution",()=>{
 const base=buildBackup(storage());
 const malicious={...base,scenarios:{records:JSON.parse('{"__proto__":{"attempts":1,"best":3,"last":5,"lastScore":3},"new-neighbour":{"attempts":1,"best":1,"last":9,"lastScore":1,"passed":true,"lastPassed":true},"bad id":{"attempts":10,"best":3,"last":9,"lastScore":3}}')}};
 const target=storage();restoreBackup(JSON.stringify(malicious),target);
 const data=JSON.parse(target.getItem("shaira-scenarios-v1")).records;
 assert.equal(Object.prototype.hasOwnProperty.call(data,"__proto__"),false);
 assert.equal(data["new-neighbour"].passed,false);
 assert.equal(data["new-neighbour"].lastPassed,false);
 assert.equal(data["bad id"],undefined);
});
test("branching conversation speaks Russian and chooses different character responses",()=>{
 const oldStorage=globalThis.localStorage,db=storage();
 globalThis.localStorage=db;
 try{
  const menu=scenariosHtml("academy/scenarios");
  assert.match(menu,/Choose Your Response/);
  assert.match(menu,/15/);
  let utterance="",count=0;
  const api={route:()=>"academy/scenarios/new-neighbour",speak:x=>utterance=x,render(){count++}};
  for(let i=0;i<3;i++){
   const html=scenariosHtml("academy/scenarios/new-neighbour");
   assert.match(html,new RegExp("Conversation "+(i+1)+" / 3"));
   assert.match(html,/data-scenario="speak"/);
   const t=scenarioMissions[0].turns[i];
   scenariosAction({dataset:{scenario:"speak",text:t.speaker}},api);
   assert.equal(utterance,t.speaker);
   const alternatives=[...html.matchAll(/data-scenario="answer" data-choice="(\d+)"[^>]*>\s*<span lang="ru">([^<]+)</g)];
   assert.equal(alternatives.length,3);
   const correct=alternatives.find(x=>x[2]===t.options[t.correct]);
   assert.ok(correct);
   scenariosAction({dataset:{scenario:"answer",choice:correct[1]}},api);
   const after=scenariosHtml("academy/scenarios/new-neighbour");
   assert.match(after,/Context-appropriate response/);
   assert.ok(after.includes(t.right));
   scenariosAction({dataset:{scenario:"next"}},api);
  }
  assert.match(scenariosHtml("academy/scenarios/new-neighbour"),/3 \/ 3/);
  assert.equal(scenarioState(db).records["new-neighbour"].passed,true);
  scenariosAction({dataset:{scenario:"restart"}},api);
  assert.match(scenariosHtml("academy/scenarios/new-neighbour"),/Conversation 1 \/ 3/);
  // A different reply must lead to a different scripted reaction, not invisible feedback.
  const html=scenariosHtml("academy/scenarios/new-neighbour");
  const alts=[...html.matchAll(/data-scenario="answer" data-choice="(\d+)"[^>]*>\s*<span lang="ru">([^<]+)</g)];
  const wrong=alts.find(x=>x[2]!==scenarioMissions[0].turns[0].options[0]);
  scenariosAction({dataset:{scenario:"answer",choice:wrong[1]}},api);
  assert.ok(scenariosHtml("academy/scenarios/new-neighbour").includes(scenarioMissions[0].turns[0].wrong));
 }finally{globalThis.localStorage=oldStorage;}
});
test("roleplay is in both Academy and Study Centre, with all static content available offline",()=>{
 const app=readFileSync(new URL("../assets/app.js",import.meta.url),"utf8");
 const academy=readFileSync(new URL("../assets/academy-ui.js",import.meta.url),"utf8");
 const labs=readFileSync(new URL("../assets/learning-labs.js",import.meta.url),"utf8");
 const sw=readFileSync(new URL("../sw.js",import.meta.url),"utf8");
 assert.ok(app.includes('route==="academy/scenarios"'));
 assert.ok(academy.includes('#academy/scenarios'));
 assert.ok(labs.includes('#academy/scenarios'));
 for(const file of ["scenario-missions.js","scenario-ui.js","scenario.css"])assert.ok(sw.includes(file),file);
});
