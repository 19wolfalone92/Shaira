// Offline Russian writing coach: strictly rule-based, non-semantic feedback.
// It notices some exact, high-confidence recurring errors and structure signals.
// It NEVER grades a free Russian essay, invents corrections or infers CEFR mastery.
export const WRITING_COACH_VERSION=1;
export const WRITING_RUBRIC={
 starter:{minimum:10,maximum:25,paragraphs:1,connectors:0,focus:"Use Cyrillic, one idea per sentence and basic punctuation."},
 a1:{minimum:35,maximum:60,paragraphs:1,connectors:0,focus:"Write connected everyday sentences and use agreement and verbs deliberately."},
 a2:{minimum:75,maximum:110,paragraphs:1,connectors:1,focus:"Connect events, give reasons and review tense, case and verb aspect."},
 b1:{minimum:120,maximum:180,paragraphs:2,connectors:2,focus:"Develop an argument or story with reasons, examples and a conclusion."},
 b2:{minimum:180,maximum:250,paragraphs:3,connectors:3,focus:"Develop a clear position, consider an alternative view and qualify your conclusion."}
};
// Patterns use narrowly bounded fixed constructions: don't flag every form of a
// word or attempt linguistic parsing with regex. Context may make any suggestion inapplicable.
const rules=[
 ["incorrect-name",/(?:^|[.!?]\s*|\n)\s*(я зовут)\b/giu,"Меня зовут","To give your name, use «Меня зовут …», not «Я зовут …»."],
 ["incorrect-self",/(?:^|[.!?]\s*|\n)\s*(меня зовут меня)\b/giu,"Меня зовут","The name formula does not repeat «меня»."],
 ["first-person-read",/\bя\s+(читать)(?=\s|[.!?]|$)/giu,"читаю","After «я», use the first-person present «читаю», not an infinitive."],
 ["first-person-speak",/\bя\s+(говорить)(?=\s|[.!?]|$)/giu,"говорю","After «я», use «говорю» in the present tense."],
 ["first-person-work",/\bя\s+(работать)(?=\s|[.!?]|$)/giu,"работаю","After «я», use «работаю» in the present tense."],
 ["we-speaks",/\bмы\s+(говорит)(?=\s|[.!?]|$)/giu,"говорим","With «мы», use the plural verb form «говорим»."],
 ["he-write",/\bон\s+(пишут)(?=\s|[.!?]|$)/giu,"пишет","With «он», use singular «пишет»."],
 ["you-read",/\bты\s+(читает)(?=\s|[.!?]|$)/giu,"читаешь","With informal «ты», use «читаешь»."],
 ["my-book",/\b(мой книга)\b/giu,"моя книга","«Книга» is feminine; its possessive is «моя»."],
 ["my-house",/\b(моя дом)\b/giu,"мой дом","«Дом» is masculine; its possessive is «мой»."],
 ["good-day",/\b(доброе день)\b/giu,"добрый день","«День» is masculine; this greeting is «Добрый день»."],
 ["no-sugar",/\b(без сахар)(?=\s|[.!?]|$)/giu,"без сахара","«Без» takes genitive: «без сахара»."],
 ["no-brother",/\b(нет брат)(?=\s|[.!?]|$)/giu,"нет брата","«Нет» takes genitive: «нет брата»."],
 ["location-city",/\b(жив[уюёеимтш][а-яё]*)\s+(в минск)(?=\s|[.!?]|$)/giu,"в Минске","Static location in Minsk uses the prepositional «в Минске»."],
 ["past-female",/\b(она работал)(?=\s|[.!?]|$)/giu,"она работала","Past singular verb forms agree with a feminine subject."],
 ["past-sister",/\b(сестра пришёл)(?=\s|[.!?]|$)/giu,"сестра пришла","Past singular feminine uses «пришла»."],
 ["past-robot",/\b(машина сломался)(?=\s|[.!?]|$)/giu,"машина сломалась","«Машина» is feminine; use «сломалась»."],
 ["want-future",/\b(буду работаю)(?=\s|[.!?]|$)/giu,"буду работать","Analytic imperfective future uses «буду» + infinitive."],
 ["need-subject",/\b(меня нужно)(?=\s|[.!?]|$)/giu,"мне нужно","Necessity about yourself normally uses dative «мне нужно»."],
 ["according-report",/\b(согласно отчёт)(?=\s|[,.!?]|$)/giu,"согласно отчёту","«Согласно» governs the dative: «согласно отчёту»."],
 ["despite-delay",/\b(несмотря задержку)(?=\s|[,.!?]|$)/giu,"несмотря на задержку","«Несмотря на» is a fixed preposition taking accusative."],
 ["contrary",/\b(вопреки ожидания)(?=\s|[,.!?]|$)/giu,"вопреки ожиданиям","«Вопреки» governs dative plural: «ожиданиям»."],
 ["you-need",/\b(мне нужен вода)(?=\s|[,.!?]|$)/giu,"мне нужна вода","«Вода» is feminine; use «нужна»."],
 ["with-key",/\b(дверь ключ)(?=\s|[,.!?]|$)/giu,"дверь ключом","The instrumental case «ключом» expresses the tool."],
 ["in-park",/\b(в парку)(?=\s|[,.!?]|$)/giu,"в парке","Static location in a park is «в парке»."],
 ["go-moscow",/\b(ехать в москва)(?=\s|[,.!?]|$)/giu,"ехать в Москву","Destination towards Moscow uses accusative «в Москву»."],
 ["some-words",/\b(пять книги)(?=\s|[,.!?]|$)/giu,"пять книг","After «пять», the counted noun is genitive plural: «книг»."],
 ["i-know",/\b(я знает)(?=\s|[,.!?]|$)/giu,"я знаю","With «я», use first-person «знаю»."],
 ["he-lives",/\b(он живут)(?=\s|[,.!?]|$)/giu,"он живёт","With «он», use third-person singular «живёт»."]
];
const RU=/[\u0400-\u052F]/u, LATIN=/[A-Za-z]/u;
const connectors=/\b(?:однако|поэтому|потому\s+что|хотя|поскольку|следовательно|во-первых|во-вторых|наконец|несмотря\s+на|вопреки|таким\s+образом|с\s+другой\s+стороны|в\s+то\s+же\s+время|вместе\s+с\s+тем|кроме\s+того|например|в\s+частности|прежде\s+чем|следует|итак)\b/giu;
const mayConnect=s=>s.match(connectors)||[];
export const russianWords=text=>String(text??"").match(/[\u0400-\u052F]+(?:[-'][\u0400-\u052F]+)*/gu)||[];
export function inspectRussianDraft(text,stage="starter"){
 const draft=String(text??"").slice(0,18000);
 const level=WRITING_RUBRIC[stage]||WRITING_RUBRIC.starter,words=russianWords(draft);
 const n=words.length,unique=new Set(words.map(w=>w.toLocaleLowerCase("ru-RU"))).size;
 const paragraphs=draft.trim()?draft.trim().split(/\n\s*\n/u).filter(Boolean).length:0;
 const sentenceCount=draft.split(/[.!?…]+(?:\s|$)/u).filter(p=>RU.test(p)).length;
 const cohesion=[...new Set(mayConnect(draft).map(x=>x.toLocaleLowerCase("ru-RU")))];
 const findings=[],seen=new Set();
 for(const [id,regex,replacement,description]of rules){
  regex.lastIndex=0;
  let match;while((match=regex.exec(draft))!==null){
   const erroneous=(match[1]||match[0]).trim();
   const offset=match.index+match[0].indexOf(erroneous);
   if(!erroneous||seen.has(id+":"+offset))continue;
   findings.push({id,found:erroneous,position:offset,suggestion:replacement,explanation:description});
   seen.add(id+":"+offset);
   if(findings.length>=30)break;
  }
  if(findings.length>=30)break;
 }
 findings.sort((a,b)=>a.position-b.position);
 const checks=[
  {id:"cyrillic",pass:RU.test(draft),label:"Use Cyrillic for the Russian text."},
  {id:"length-min",pass:n>=level.minimum,label:"Write at least "+level.minimum+" Russian words."},
  {id:"punctuation",pass:/[.!?…]\s*$/u.test(draft),label:"End your text with punctuation."}
 ];
 if(level.paragraphs>1)checks.push({id:"paragraphs",pass:paragraphs>=level.paragraphs,
  label:"Organise the response into at least "+level.paragraphs+" paragraphs."});
 if(level.connectors>0)checks.push({id:"connectors",pass:cohesion.length>=level.connectors,
  label:"Use at least "+level.connectors+" different logical linking expressions."});
 if(n>=level.minimum*1.6)checks.push({id:"range",pass:n<=level.maximum*1.5,
  label:"Check whether the draft fits the suggested "+level.minimum+"–"+level.maximum+" word range."});
 const suggestions=[];
 if(!n)suggestions.push("Write a few original Russian sentences before requesting a review.");
 if(n&&n<level.minimum)suggestions.push("Expand your response with a concrete detail, reason or example.");
 if(n&&!/[.!?…]\s*$/u.test(draft))suggestions.push("Check end punctuation and separate complete sentences.");
 if(level.paragraphs>1&&paragraphs<level.paragraphs)suggestions.push("Separate the main claim, supporting detail and conclusion into readable paragraphs.");
 if(level.connectors>0&&cohesion.length<level.connectors)suggestions.push("Try logical connectors such as «однако», «поэтому», «например» or «следовательно» where the meaning requires them.");
 if(LATIN.test(draft))suggestions.push("Review Latin letters: keep Russian sentences in Cyrillic; names and quoted English may be appropriate.");
 if(n>10&&unique/Math.max(1,n)<0.45)suggestions.push("Look for repetitive wording; consider varied vocabulary where appropriate.");
 if(findings.length)suggestions.push("Review the exact phrase suggestions below; verify each against its context before editing.");
 return {stage,wordCount:n,uniqueWords:unique,sentences:sentenceCount,paragraphs,cohesion,
  findings,checks,suggestions,range:[level.minimum,level.maximum],focus:level.focus,
  warning:"Automated structural hints and narrow pattern matches only. This is not Russian grammar, meaning, stylistic, or CEFR assessment."};
}
