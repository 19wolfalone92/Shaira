// 30 carefully selected Russian sound/word contrasts for adult listening practice.
// Not all are strict minimal phoneme pairs; later groups train close prefixes and
// meaningful contrasts. Device TTS quality and pronunciation may vary.
const pair=(id,stage,focus,a,b,explain)=>({id,stage,focus,
 a:{ru:a[0],en:a[1]},b:{ru:b[0],en:b[1]},explain});
export const SOUND_PAIRS=[
 pair("luk-lyuk","starter","Hard /л/ vs soft /лʲ/",["лук","onion or bow"],["люк","hatch"],"The letter ю after л signals a soft consonant; лук begins with a hard л."),
 pair("byl-bil","starter","Russian ы vs и",["был","he was"],["бил","he was hitting"],"Russian ы and и are distinct vowels; train them without reading a Latin transcription."),
 pair("nos-nyos","starter","О vs Ё after a consonant",["нос","nose"],["нёс","he carried"],"Ё represents a different vowel and usually softens the preceding consonant."),
 pair("shar-zhar","starter","Voiced Ж vs voiceless Ш",["шар","ball"],["жар","heat"],"Ш is voiceless while Ж is voiced; both are usually hard consonants."),
 pair("dom-tom","starter","Voiced vs voiceless onset",["дом","house"],["том","volume of a book"],"Listen to the first consonant: Russian д is voiced; т is voiceless."),
 pair("myl-mil","starter","Ы vs И in a short word",["мыл","he washed"],["мил","dear / nice (masculine)"],"Contrast the vowels in two meaningful words. Russian и commonly softens preceding consonants."),
 pair("ugol-ugol-soft","a1","The soft sign changes the ending",["угол","corner"],["уголь","coal"],"Ь softens the previous consonant; it is not an extra vowel."),
 pair("el-el-soft","a1","Final soft /лʲ/",["ел","he ate"],["ель","fir tree"],"Final ь signals softness of the preceding л in «ель», unlike the harder final л in «ел»."),
 pair("pit-pet","a1","Different vowels: пить vs петь",["пить","to drink"],["петь","to sing"],"Listen for the stressed vowel: пить has и, петь has е."),
 pair("rad-ryad","a1","Hard Р vs soft Р",["рад","glad (masculine)"],["ряд","row"],"Я after р usually represents a soft consonant plus vowel, unlike а."),
 pair("par-bar","a1","Voicing at the beginning",["пар","steam"],["бар","bar"],"Russian п is voiceless, whereas б is voiced in these positions."),
 pair("ris-rys","a1","И vs Ы and soft sign",["рис","rice"],["рысь","lynx"],"These words use different vowels and the soft sign; distinguish the full sounds."),
 pair("urok-srok","a2","Consonant clusters at word onset",["урок","lesson"],["срок","deadline / term"],"Срок begins with ср-, whereas урок begins with a vowel."),
 pair("snova-slovo","a2","Similar rhythm, different consonants",["снова","again"],["слово","word"],"Focus on the middle consonants: снова contains н; слово contains л."),
 pair("prishel-proshel","a2","Пришёл vs прошёл",["пришёл","he arrived on foot"],["прошёл","he passed / walked through"],"Unstressed vowels in prefixes can reduce; the prefix carries meaning."),
 pair("priekhat-proekhat","a2","Arrival vs passing",["приехать","to arrive by vehicle"],["проехать","to pass or travel by vehicle"],"Russian verb prefixes change the route meaning: при- arrival, про- through/by."),
 pair("zanyat-ponyat","a2","Close syllables and different meanings",["занять","to occupy or borrow"],["понять","to understand"],"Listen for the different initial syllables; neither word is a synonym."),
 pair("proveryat-doveryat","a2","Checking vs trusting",["проверять","to check / verify"],["доверять","to trust"],"The prefixes and initial consonants change the meaning."),
 pair("zamechat-naznachat","b1","Unstressed vowels and consonant order",["замечать","to notice"],["назначать","to appoint"],"Listen to the stressed syllable and the location of м / н / ч."),
 pair("platit-oplatit","b1","Similar verbs, different prefixes",["платить","to pay"],["оплатить","to pay for / settle"],"Оплатить is perfective and usually takes a direct object; платить can govern за."),
 pair("podkhodit-ukhodit","b1","Approaching vs leaving",["подходить","to approach / fit"],["уходить","to leave"],"Под- adds an approach meaning; у- often indicates moving away."),
 pair("davat-zadavat","b1","Prefixed verb difference",["давать","to give"],["задавать","to set / ask (a question)"],"The prefix за- produces a new lexical meaning in задавать вопросы."),
 pair("perepisat-podpisat","b1","Rewriting vs signing",["переписать","to rewrite"],["подписать","to sign"],"Perceived prefix and middle syllables distinguish these common work verbs."),
 pair("vstretit-vstretitsya","b1","Reflexive ending -ся",["встретить","to meet someone"],["встретиться","to meet each other / arrange to meet"],"The suffix -ся changes the verb's valency and meaning."),
 pair("obsuzhdat-osuzhdat","b2","Б in similar abstract verbs",["обсуждать","to discuss"],["осуждать","to condemn"],"The extra б changes meaning drastically; do not confuse discussion with condemnation."),
 pair("predostavit-predstavit","b2","Provide vs present",["предоставить","to provide"],["представить","to present / imagine"],"These formal verbs have different internal sounds and argument structures."),
 pair("vliyat-vyyavlyat","b2","Influence vs reveal",["влиять","to influence"],["выявлять","to identify / reveal"],"Close-looking forms are not synonyms; listen to the full stressed structure."),
 pair("utochnit-uchest","b2","Clarify vs account for",["уточнить","to clarify"],["учесть","to take into account"],"Both occur in analytical reports but express different actions."),
 pair("otsenivat-obestsenivat","b2","Evaluate vs devalue",["оценивать","to evaluate"],["обесценивать","to devalue"],"Adding обес- dramatically alters meaning; check the entire word."),
 pair("sopostavit-sostavit","b2","Compare vs compile",["сопоставить","to compare / juxtapose"],["составить","to compile / draw up"],"Pay attention to the па sound in сопоставить versus составить.")
];
export const SOUND_STAGES=["starter","a1","a2","b1","b2"];
export const soundForStage=stage=>SOUND_PAIRS.filter(p=>p.stage===stage);
