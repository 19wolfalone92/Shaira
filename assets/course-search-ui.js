import {SEARCH_ENTRIES,COURSE_TYPES,searchMaterials,searchNormalize} from "./course-search.js";
let query="",type="all";
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function results(){
 const q=query.trim();
 if(searchNormalize(q).length<2)
  return '<div class="search-empty"><span>⌕</span><p>Enter at least two letters in Russian or English. You can search words, verb forms, grammar rules, story topics and conversation situations.</p></div>';
 const matches=searchMaterials(q,{type,limit:50});
 if(!matches.length)return '<div class="search-empty"><p>No exact matches in the current offline course library. Try an English meaning, shorter term or another category.</p></div>';
 return '<p class="search-count">Showing '+matches.length+(matches.length===50?" most relevant":"")+' result'+(matches.length===1?"":"s")+' for <strong>'+esc(q)+'</strong></p>'+
 '<div class="search-results">'+matches.map(e=>
 '<a href="'+esc(e.href)+'" class="search-hit"><div><small>'+esc(COURSE_TYPES.find(t=>t.id===e.type)?.label||e.type)+' · '+esc(e.stage.toUpperCase())+'</small>'+
 '<strong '+(/[\u0400-\u052F]/u.test(e.title)?'lang="ru"':'')+'>'+esc(e.title)+'</strong>'+
 '<span>'+esc(e.subtitle.slice(0,180))+'</span></div><b>›</b></a>').join("")+'</div>';
}
export function courseSearchHtml(){
 return '<a href="#academy" class="search-back">← Back to Academy</a>'+
 '<section class="search-hero"><span>SHAIRA · YOUR RUSSIAN REFERENCE</span><h1>Search all course materials</h1>'+
 '<p>Find a Russian word, English meaning, grammatical form, story, exercise or dialogue. Everything works offline and stays on your device.</p>'+
 '<div class="search-count-box"><strong>'+SEARCH_ENTRIES.length+'</strong><span>searchable lesson entries · 11 material categories</span></div></section>'+
 '<section class="search-panel"><label for="course-search">Russian or English search</label>'+
 '<input id="course-search" type="search" maxlength="100" autocomplete="off" spellcheck="false" placeholder="Example: объяснить, time, genitive, doctor" value="'+esc(query)+'"/>'+
 '<label for="course-search-filter">Search in</label><select id="course-search-filter">'+
 COURSE_TYPES.map(t=>'<option value="'+t.id+'" '+(type===t.id?"selected":"")+'>'+esc(t.label)+'</option>').join("")+'</select>'+
 '<div class="search-examples"><span>Try:</span>'+["работа","время","why","argument"].map(term=>
 '<button type="button" data-search="example" data-term="'+esc(term)+'">'+esc(term)+'</button>').join("")+'</div>'+
 '<div id="course-search-results" aria-live="polite">'+results()+'</div></section>'+
 '<p class="search-disclaimer">Search is an index of the existing lesson library, not an automatic translation service or a complete Russian dictionary. Grammar and lexical suggestions require context.</p>';
}
export function courseSearchInput(event){
 if(event.target.id==="course-search")query=String(event.target.value||"").slice(0,100);
 else if(event.target.id==="course-search-filter")type=COURSE_TYPES.some(t=>t.id===event.target.value)?event.target.value:"all";
 else return false;
 const node=document.getElementById("course-search-results");
 if(node)node.innerHTML=results();
 return true;
}
export function courseSearchAction(button){
 if(button.dataset.search!=="example")return;
 query=String(button.dataset.term||"").slice(0,100);
 const field=document.getElementById("course-search");
 if(field){field.value=query;field.focus();}
 const result=document.getElementById("course-search-results");
 if(result)result.innerHTML=results();
}
