import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {COURSE_TYPES,SEARCH_ENTRIES,searchMaterials,searchNormalize} from "../assets/course-search.js";
import {courseSearchHtml,courseSearchInput,courseSearchAction} from "../assets/course-search-ui.js";
const types=["vocabulary","grammar","nouns","verbs","reading","writing","dialogues","listening","phonetics","roleplay"];
test("course reference indexes all curriculum disciplines without API calls",()=>{
 assert.ok(SEARCH_ENTRIES.length>=800,"indexed material count");
 assert.equal(new Set(SEARCH_ENTRIES.map(e=>e.id)).size,SEARCH_ENTRIES.length);
 for(const t of types){
  const subset=SEARCH_ENTRIES.filter(e=>e.type===t);
  assert.ok(subset.length>=10,t+" has too few searchable entries");
 }
 assert.equal(COURSE_TYPES.length,11);
 for(const e of SEARCH_ENTRIES){
  assert.ok(e.id&&e.type&&e.title&&e.href.startsWith("#academy/"),e.id);
  assert.ok(types.includes(e.type));
  assert.ok(["starter","a1","a2","b1","b2"].includes(e.stage),e.id);
 }
});
test("search finds Russian words, English meanings, verb and case forms, and reads ё/e flexibly",()=>{
 assert.equal(searchNormalize("  ЁЖИК  "),"ежик");
 assert.equal(searchNormalize("СЁСТРЫ"),"сестры");
 assert.ok(searchMaterials("книга",{type:"vocabulary"}).some(e=>e.title==="книга"));
 assert.ok(searchMaterials("книгу",{type:"nouns"}).some(e=>e.title==="книга"));
 assert.ok(searchMaterials("читаешь",{type:"verbs"}).some(e=>e.title==="читать"));
 assert.ok(searchMaterials("research",{type:"reading"}).length>0);
 assert.ok(searchMaterials("hotel",{type:"dialogues"}).length>0);
 assert.ok(searchMaterials("sound",{type:"phonetics"}).length>0);
 assert.ok(searchMaterials("я",{type:"all"}).length===0,"single letter needs a more specific query");
 assert.ok(searchMaterials("__missing_secret_word__",{}).length===0);
});
test("search facets, result limits and ordering avoid irrelevant items",()=>{
 const results=searchMaterials("work",{type:"all",limit:12});
 assert.ok(results.length>0&&results.length<=12);
 assert.ok(searchMaterials("work",{type:"verbs"}).every(e=>e.type==="verbs"));
 assert.ok(searchMaterials("work",{type:"xxx"}).length>=results.length);
 const target=searchMaterials("work",{type:"all",limit:100});
 assert.ok(target[0].title.toLowerCase().includes("work")||target[0].subtitle.toLowerCase().includes("work"));
 assert.ok(searchMaterials("сердце",{limit:2}).length<=2);
});
test("search UI applies live English/Russian filtering and keeps user query while changing routes",()=>{
 const originalDoc=globalThis.document;
 const nodes={
  "course-search-results":{innerHTML:""},
  "course-search":{value:"",focus(){}}
 };
 globalThis.document={getElementById:id=>nodes[id]||null};
 try{
  assert.match(courseSearchHtml(),/Search all course materials/);
  assert.ok(courseSearchInput({target:{id:"course-search",value:"работа"}}));
  assert.ok(nodes["course-search-results"].innerHTML.includes("search-hit"));
  assert.ok(courseSearchInput({target:{id:"course-search-filter",value:"nouns"}}));
  assert.ok(!nodes["course-search-results"].innerHTML.includes("search-hit")||
    nodes["course-search-results"].innerHTML.includes("Noun cases"));
  assert.equal(courseSearchInput({target:{id:"other",value:"x"}}),false);
  courseSearchAction({dataset:{search:"example",term:"книга"}});
  assert.equal(nodes["course-search"].value,"книга");
  assert.ok(nodes["course-search-results"].innerHTML.includes("search-hit"));
 }finally{globalThis.document=originalDoc;}
});
test("search is reachable from home, Academy, Practice Centre and every indexed file is cached",()=>{
 const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
 const app=read("assets/app.js"),academy=read("assets/academy-ui.js"),labs=read("assets/learning-labs.js"),cache=read("sw.js");
 assert.ok(app.includes('route==="academy/search"'));
 assert.ok(app.includes("courseSearchInput"));
 assert.ok(academy.includes("#academy/search"));
 assert.ok(labs.includes("#academy/search"));
 for(const name of ["course-search.js","course-search-ui.js","course-search.css"])assert.ok(cache.includes(name));
});
