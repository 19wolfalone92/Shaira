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
