// SHAIRA's true zero-literacy staircase. Each new Cyrillic character is taught
// separately before any written word requiring it. The first 66 steps introduce
// all 33 letters in sets of 3, with a syllable, a simple word and a review
// between sets; the final 12 steps introduce practical conversational phrases.
// These are MICRO-STEPS, not 78 days or validated CEFR levels.
const L=(upper,lower,sound,tip)=>({upper,lower,sound,tip});
export const FIRST_LETTERS=[
 L("А","а","ah, as in father","A Russian vowel. In a stressed syllable, А sounds approximately like ah."),
 L("М","м","m, as in mom","Close your lips to make the same /m/ sound as in English."),
 L("О","о","o, as in more when stressed","In unstressed syllables, Russian О often sounds closer to a reduced 'a'."),
 L("Т","т","t, as in top","The shape is familiar and the sound is approximately English /t/."),
 L("У","у","oo, as in food","Cyrillic У looks like a Latin Y but represents an oo sound."),
 L("К","к","k, as in kite","К usually represents the /k/ sound."),
 L("Н","н","n, as in no","This looks like an English H but its sound is /n/."),
 L("С","с","s, as in sun","This looks like an English C but represents the /s/ sound."),
 L("И","и","ee, as in see","И is a vowel; it commonly softens the consonant before it."),
 L("Р","р","rolled or tapped r","This looks like English P, but represents a Russian r."),
 L("П","п","p, as in pen","Two upright strokes linked at the top. The sound is /p/."),
 L("Л","л","l, as in lamp","Russian л can be hard or soft. Start with the basic /l/ sound."),
 L("В","в","v, as in very","Cyrillic В looks like English B but represents /v/."),
 L("Д","д","d, as in dog","The Cyrillic Д often has a triangular or table-like appearance."),
 L("Б","б","b, as in boy","Russian Б is a voiced /b/ sound."),
 L("Г","г","g, as in go","Russian Г usually sounds like hard g."),
 L("Е","е","ye, as in yes at word start","At the start of words Е often sounds like 'ye'; after a consonant it can indicate softness."),
 L("З","з","z, as in zoo","Russian З is a voiced /z/ sound."),
 L("Й","й","short y, as in boy","Й is a consonant /j/, unlike vowel И."),
 L("Ы","ы","a distinct central Russian vowel","Russian Ы has no close English equivalent. Listen, then practise gently."),
 L("Ж","ж","zh, as in the s of vision","Russian Ж is a voiced, usually hard consonant."),
 L("Ш","ш","sh, as in ship","Russian Ш is generally hard."),
 L("Ч","ч","ch, as in church","Russian Ч is normally soft."),
 L("Х","х","kh, a breathy back-of-mouth sound","Russian Х is unlike English h; listen to its rough /x/ sound."),
 L("Ф","ф","f, as in fish","Ф represents /f/."),
 L("Ц","ц","ts, as in cats","Russian Ц is an affricate, a single letter for /ts/."),
 L("Э","э","e, as in bed","Э represents an /e/-like vowel without the initial 'y' of Е."),
 L("Ё","ё","yo, as in yonder at word start","Ё is generally stressed and can soften the consonant before it."),
 L("Ю","ю","yu, as in use at word start","Ю can represent a 'yu' sound or soften the preceding consonant."),
 L("Я","я","ya, as in yard at word start","Я can begin with 'ya'; it may soften the preceding consonant."),
 L("Щ","щ","a long soft sh-like sound","Щ is typically longer and softer than Ш."),
 L("Ь","ь","soft sign: no sound of its own","The soft sign changes pronunciation or grammar; do not pronounce an extra vowel."),
 L("Ъ","ъ","hard sign: no sound of its own","The hard sign separates a consonant from a following iotated vowel, as in съел.")
];
const G=(blend,pron,word,meaning,notes)=>({blend,pron,word,meaning,notes});
export const FIRST_GROUPS=[
 G("ма","ma","мама","mom / mother","You can now sound out «ма-ма»: two little syllables."),
 G("ко","ko","кот","cat","You already know К, О and Т. Read «ко-т» slowly."),
 G("но","no","нос","nose","All three sounds in «нос» have already been introduced."),
 G("па","pa","папа","dad / father","You can read «па-па» with letters you already know."),
 G("до","do","вода","water","Read «во-да»; the first О is often reduced in natural speech."),
 G("ге","ge / gye","где","where","«Где» means 'where'. In a real conversation the consonants are joined."),
 G("мы","my (Russian ы)","мой","my / mine (masculine)","Distinguish Й (short y) from vowel И; «мой» is a useful possessive."),
 G("ша","sha","наш","our (masculine)","Ш and Ч are different sounds. Here «наш» means 'our'."),
 G("фо","fo","фото","photo","«Фото» is a short international word you can now read in Cyrillic."),
 G("мё","myo","моё","my / mine (neuter)","Ё is usually stressed; the consonant before it is soft."),
 G("щи","shchi","день","day","Ь softens the last consonant in «день». Ъ separates sounds in «съел».")
];
const P=(ru,en,tip)=>({ru,en,tip});
export const FIRST_PHRASES=[
 P("Это мама.","This is Mom.","Это = this is. Begin with a very short complete sentence."),
 P("Это мой дом.","This is my house.","Мой agrees with masculine дом. It means my."),
 P("Меня зовут Шаира.","My name is Shaira.","Say 'Меня зовут…', not 'Я зовут…'. Replace the name with your own."),
 P("Как тебя зовут?","What is your name? (informal)","Тебя is informal. Use this with a friend."),
 P("Привет!","Hi!","An informal greeting for friends and people you know well."),
 P("Здравствуйте!","Hello! (polite)","Use this with people you do not know or in formal situations."),
 P("Спасибо!","Thank you!","A polite expression you can use every day."),
 P("Пожалуйста.","Please / you're welcome.","This can mean please or you're welcome depending on the conversation."),
 P("Да.","Yes.","A very short but useful answer."),
 P("Нет.","No.","Notice that the spelling is short; listen to the vowel."),
 P("Я дома.","I am at home.","In the present tense, Russian usually omits the verb 'to be'."),
 P("Я учу русский.","I am learning Russian.","Учу is the first-person form: я учу.")
];
const x=(id,kind,title,description,model,english,tip,chapter,extra={})=>({
 id,kind,title,description,model,english,tip,chapter,...extra
});
const steps=[],learned=[];
for(let i=0;i<FIRST_GROUPS.length;i++){
 const chapter=i+1,g=FIRST_GROUPS[i],letters=FIRST_LETTERS.slice(i*3,i*3+3);
 for(const letter of letters){
  learned.push(letter.upper);
  steps.push(x("letter-"+letter.upper,"letter","One new letter: "+letter.upper,
   "Meet a single Russian letter and its lowercase form. Do not memorise the whole alphabet today.",
   letter.upper,letter.sound,letter.tip,chapter,{letter,known:learned.slice()}));
 }
 steps.push(x("blend-"+i,"blend","Join two sounds: "+g.blend,
  "Blend only the Russian letters you have just learned. Say the two sounds slowly and join them.",
  g.blend,g.pron,g.notes,chapter,{group:g,known:learned.slice()}));
 steps.push(x("word-"+i,"word","Your tiny Russian word: "+g.word,
  "Read one short Russian word, understand its English meaning, then recognise it again.",
  g.word,g.meaning,g.notes,chapter,{group:g,known:learned.slice()}));
 steps.push(x("review-"+i,"review","Tiny review · "+(i+1)+"/11",
  "Recognise the latest letters, blend and word. Review is meant to be easy and confidence-building.",
  g.word,g.meaning,"If you make a mistake, review the model and try once more. There is no penalty.",chapter,{group:g,known:learned.slice()}));
}
for(let i=0;i<FIRST_PHRASES.length;i++){
 const p=FIRST_PHRASES[i];
 steps.push(x("phrase-"+i,"phrase","A useful phrase: "+p.en,
   "Learn one everyday Russian phrase. Listen, understand and try saying it aloud. Full-sentence typing is optional.",
   p.ru,p.en,p.tip,12+Math.floor(i/6),{phrase:p,known:learned.slice()}));
}
export const FIRST_STEPS=steps;
export const MICRO_TOTAL=FIRST_STEPS.length;
export const MICRO_LETTERS=FIRST_LETTERS.length;
export const FIRST_MODES=["gentle","steady","challenge"];
export const modeInfo={
 gentle:{name:"Gentle",questions:2,description:"2 short recognition questions per step. Recommended if you know no Russian."},
 steady:{name:"Steady",questions:3,description:"2 recognition questions + 1 short Russian typing task."},
 challenge:{name:"Challenge",questions:4,description:"More demanding recognition and 2 Russian typing tasks on each step."}
};
export const microStepAt=index=>Number.isInteger(index)&&index>=0&&index<MICRO_TOTAL?FIRST_STEPS[index]:null;
const vowels="АОУИЕЫЭЁЮЯ";
const selectDifferent=(primary,candidates,count=3)=>{
 const out=[primary];
 for(const c of candidates)if(c!==primary&&!out.includes(c)&&out.length<count)out.push(c);
 return out;
};
const priorLetters=(step)=>FIRST_LETTERS.filter(x=>step.known.includes(x.upper));
const priorWords=(step)=>{
 const chapter=step.chapter, upto=Math.min(FIRST_GROUPS.length,chapter);
 return FIRST_GROUPS.slice(0,upto);
};
const lowerDistractors=step=>priorLetters(step).map(x=>x.lower);
const upperDistractors=step=>priorLetters(step).map(x=>x.upper);
const question=(id,prompt,answer,options,explanation,kind="choice")=>({
 id,prompt,answer,options,explanation,kind
});
export function microQuestions(step){
 if(!step)return[];
 const known=priorLetters(step),g=step.group;
 if(step.kind==="letter"){
  const l=step.letter,upper=selectDifferent(l.upper,[...upperDistractors(step).reverse(),...FIRST_LETTERS.map(x=>x.upper)],3);
  const lower=selectDifferent(l.lower,[...lowerDistractors(step).reverse(),...FIRST_LETTERS.map(x=>x.lower)],3);
  return [
   question("recognise","Tap the Russian letter for the sound: "+l.sound,l.upper,upper,"This letter is «"+l.upper+"»; "+l.tip),
   question("lowercase","Which is the lowercase form of «"+l.upper+"»?",l.lower,lower,"The lowercase form is «"+l.lower+"»."),
   question("write","Type the uppercase Cyrillic letter for: "+l.sound,l.upper,null,"Write the Cyrillic «"+l.upper+"».","type"),
   question("write-lower","Type the lowercase form of «"+l.upper+"».",l.lower,null,"The lowercase Russian form is «"+l.lower+"».","type")
  ];
 }
 if(["blend","word","review"].includes(step.kind)){
  const wordPool=priorWords(step),syllables=FIRST_GROUPS.slice(0,step.chapter);
  const opts=selectDifferent(g.word,wordPool.map(x=>x.word).reverse().concat(["мама","кот","нос","папа"]),3);
  const meaningOpts=selectDifferent(g.meaning,wordPool.map(x=>x.meaning).reverse().concat(["dog","car","table"]),3);
  const blendOpts=selectDifferent(g.blend,syllables.map(x=>x.blend).reverse().concat(["мо","та","на"]),3);
  if(step.kind==="blend")return [
   question("blend-recognise","Tap the two-letter Russian syllable for: "+g.pron,g.blend,blendOpts,"The model is «"+g.blend+"». "+g.notes),
   question("blend-sound","Choose the printed syllable you just studied.",g.blend,selectDifferent(g.blend,[g.blend.split("").reverse().join(""),...blendOpts.slice(1),"ми"],3),"«"+g.blend+"» matches the taught Russian sounds."),
   question("blend-type","Type the Russian syllable for: "+g.pron,g.blend,null,"Write «"+g.blend+"» from memory.","type"),
   question("blend-type-again","Write the same syllable in Cyrillic: "+g.pron,g.blend,null,"Build the sounds as «"+g.blend+"».","type")
  ];
  if(step.kind==="word")return [
   question("meaning","What does «"+g.word+"» mean?",g.meaning,meaningOpts,"«"+g.word+"» means "+g.meaning+"."),
   question("find-word","Which Russian word means: "+g.meaning+"?",g.word,opts,"The Russian word for "+g.meaning+" is «"+g.word+"»."),
   question("write-word","Type the Russian word for: "+g.meaning,g.word,null,"Write «"+g.word+"».","type"),
   question("write-word2","Recall and type this word in Cyrillic: "+g.meaning,g.word,null,"The model word is «"+g.word+"».","type")
  ];
  return [
   question("review-meaning","Review: what is the English meaning of «"+g.word+"»?",g.meaning,meaningOpts,"«"+g.word+"» means "+g.meaning+"."),
   question("review-blend","Review: select the syllable for "+g.pron,g.blend,blendOpts,"The syllable is «"+g.blend+"»."),
   question("review-type","From memory, type the Russian word for: "+g.meaning,g.word,null,"The word is «"+g.word+"».","type"),
   question("review-type2","From memory, type this Russian syllable: "+g.pron,g.blend,null,"The syllable is «"+g.blend+"».","type")
  ];
 }
 const p=step.phrase,earlier=FIRST_PHRASES.slice(0,Number(step.id.split("-")[1])+1);
 const ruOptions=selectDifferent(p.ru,earlier.map(x=>x.ru).reverse().concat(["Это мама.","Да.","Нет."]),3);
 const enOptions=selectDifferent(p.en,earlier.map(x=>x.en).reverse().concat(["Please help me.","Good evening.","Goodbye!"]),3);
 return [
  question("phrase-meaning","What does the Russian phrase «"+p.ru+"» mean?",p.en,enOptions,p.tip),
  question("phrase-find","Which Russian phrase means: "+p.en,p.ru,ruOptions,"The model is «"+p.ru+"». "+p.tip),
  question("phrase-write","Type the complete Russian phrase: "+p.en,p.ru,null,"Model phrase: «"+p.ru+"».","type"),
  question("phrase-write2","Write from memory: "+p.en,p.ru,null,"Use this Russian phrase: «"+p.ru+"».","type")
 ];
}
