import test from "node:test";
import assert from "node:assert/strict";
import {BACKUP_FORMAT,BACKUP_VERSION,buildBackup,readBackup,restoreBackup} from "../assets/backup.js";
const memory=initial=>{
  const map=new Map(Object.entries(initial||{}));
  return {getItem:key=>map.has(key)?map.get(key):null,setItem:(key,v)=>map.set(key,String(v)),removeItem:key=>map.delete(key),map};
};
test("progress and writing drafts survive backup round-trip",()=>{
 const source=memory({
  "shaira-progress-v1":JSON.stringify({language:"tl",completed:["vowels","greetings"]}),
  "shaira-academy-v1":JSON.stringify({
    done:{"fw-01/words":1700000000000,"aspect/read":1700000000001},
    memory:{"fw-01:мама":{stage:2,due:1790000000000,seen:4,correct:3}},
    drafts:{"advanced-writing":"Мой собственный текст о русском языке."},points:55
  })
 });
 const backup=buildBackup(source);
 assert.equal(backup.format,BACKUP_FORMAT);
 assert.equal(backup.version,BACKUP_VERSION);
 assert.equal(backup.legacy.language,"tl");
 assert.equal(backup.academy.drafts["advanced-writing"],"Мой собственный текст о русском языке.");
 const destination=memory();
 restoreBackup(JSON.stringify(backup),destination);
 assert.deepEqual(JSON.parse(destination.getItem("shaira-progress-v1")).completed,["vowels","greetings"]);
 const restored=JSON.parse(destination.getItem("shaira-academy-v1"));
 assert.equal(restored.memory["fw-01:мама"].stage,2);
 assert.equal(restored.points,55);
 assert.ok(restored.drafts["advanced-writing"].includes("русском"));
});
test("reject malformed, unsupported or oversized imports without changing progress",()=>{
 const target=memory({"shaira-progress-v1":JSON.stringify({language:"en",completed:["vowels"]})});
 const original=target.getItem("shaira-progress-v1");
 for(const bad of ["not-json","{}","[]",JSON.stringify({format:BACKUP_FORMAT,version:99,legacy:{},academy:{}}),"x".repeat(3000001)]){
   assert.throws(()=>restoreBackup(bad,target));
   assert.equal(target.getItem("shaira-progress-v1"),original);
 }
});
test("untrusted backup fields are filtered and no arbitrary keys are restored",()=>{
 const s=memory();
 const backup=JSON.stringify({format:BACKUP_FORMAT,version:1,legacy:{language:"invalid",completed:["a","a",100]},
  academy:{points:-5,done:{"foo/bar":1700000000000,"bad":"wrong"},
    memory:{"bad":{stage:900,due:0,seen:0,correct:0},"ok":{stage:1,due:1790000000000,seen:2,correct:1}},
    drafts:{"essay":"Привет", "too-big":"x".repeat(100001)},secrets:"abc"}});
 const restored=restoreBackup(backup,s);
 assert.equal(restored.legacy.language,"en");
 assert.deepEqual(restored.legacy.completed,["a"]);
 assert.equal(restored.academy.points,0);
 assert.equal(restored.academy.memory.bad,undefined);
 assert.equal(restored.academy.memory.ok.stage,1);
 assert.equal(restored.academy.drafts["too-big"],undefined);
 assert.equal(restored.academy.secrets,undefined);
});

test("adult lab grammar, reading and portfolio records are included in backup",()=>{
  const source=memory({"shaira-labs-v1":JSON.stringify({
    grammar:{a2:{best:9,attempts:2,last:1790000000000,items:{"a2-04":{seen:3,correct:2,last:1790000000000}}}},
    readings:{"remote-balance":{passed:true,attempts:2,last:1790000000000}},
    drafts:{"portfolio:debate-social":"На мой взгляд, это важная проблема. Однако есть другая сторона."}
  })});
  const backup=buildBackup(source),restored=memory();
  assert.equal(backup.labs.grammar.a2.best,9);
  restoreBackup(JSON.stringify(backup),restored);
  const labs=JSON.parse(restored.getItem("shaira-labs-v1"));
  assert.equal(labs.grammar.a2.items["a2-04"].seen,3);
  assert.equal(labs.readings["remote-balance"].passed,true);
  assert.match(labs.drafts["portfolio:debate-social"],/Однако/);
});
test("old compatible backups without lab data restore with an empty lab record",()=>{
  const old={format:BACKUP_FORMAT,version:BACKUP_VERSION,legacy:{language:"en",completed:[]},academy:{done:{},memory:{},drafts:{},points:0}};
  const target=memory();
  restoreBackup(JSON.stringify(old),target);
  assert.deepEqual(Object.keys(JSON.parse(target.getItem("shaira-labs-v1")).drafts),[]);
});
