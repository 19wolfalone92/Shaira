// 24 hand-reviewed basic nouns × 6 cases × 2 numbers = 288 explicit forms.
// Order per form vector: nominative, genitive, dative, accusative,
// instrumental, prepositional. Animacy controls accusative patterns.
// All examples are pedagogical, not an exhaustive reference for all irregular Russian nouns.
export const CASES=[
 {id:"nom",en:"Nominative",tl:"Nominative",purpose:{en:"subject / dictionary form",tl:"simuno / anyo sa diksyunaryo"},cue:{en:"Who or what does the action?",tl:"Sino o ano ang gumagawa?"}},
 {id:"gen",en:"Genitive",tl:"Genitive",purpose:{en:"absence, possession, quantity",tl:"kawalan, pag-aari, dami"},cue:{en:"Whose? Of whom? There is no…",tl:"Kanino? Walang…"}},
 {id:"dat",en:"Dative",tl:"Dative",purpose:{en:"recipient or experiencer",tl:"tatanggap o nakararamdam"},cue:{en:"To whom / to what?",tl:"Kanino o para sa ano?"}},
 {id:"acc",en:"Accusative",tl:"Accusative",purpose:{en:"direct object / destination",tl:"tuwirang layon / patutunguhan"},cue:{en:"Whom or what is acted upon?",tl:"Sino o ano ang tinutukoy ng kilos?"}},
 {id:"ins",en:"Instrumental",tl:"Instrumental",purpose:{en:"with whom / by what means",tl:"kasama sino / gamit ang ano"},cue:{en:"With whom? By what means?",tl:"Kasama sino? Gamit ang ano?"}},
 {id:"pre",en:"Prepositional",tl:"Prepositional",purpose:{en:"topic or static place",tl:"paksa o lokasyon"},cue:{en:"About whom/what? At which place?",tl:"Tungkol kanino/ano? Saang lugar?"}}
];
const row=(id,en,tl,gender,animate,sg,pl)=>({id,en,tl,gender,animate,
 forms:{sg,pl}});
export const NOUNS=[
 row("table","table","mesa","m",false,["стол","стола","столу","стол","столом","столе"],["столы","столов","столам","столы","столами","столах"]),
 row("house","house","bahay","m",false,["дом","дома","дому","дом","домом","доме"],["дома","домов","домам","дома","домами","домах"]),
 row("phone","phone","telepono","m",false,["телефон","телефона","телефону","телефон","телефоном","телефоне"],["телефоны","телефонов","телефонам","телефоны","телефонами","телефонах"]),
 row("friend","friend (male)","kaibigang lalaki","m",true,["друг","друга","другу","друга","другом","друге"],["друзья","друзей","друзьям","друзей","друзьями","друзьях"]),
 row("brother","brother","kapatid na lalaki","m",true,["брат","брата","брату","брата","братом","брате"],["братья","братьев","братьям","братьев","братьями","братьях"]),
 row("doctor","doctor","doktor","m",true,["врач","врача","врачу","врача","врачом","враче"],["врачи","врачей","врачам","врачей","врачами","врачах"]),
 row("book","book","aklat","f",false,["книга","книги","книге","книгу","книгой","книге"],["книги","книг","книгам","книги","книгами","книгах"]),
 row("work","work / job","trabaho","f",false,["работа","работы","работе","работу","работой","работе"],["работы","работ","работам","работы","работами","работах"]),
 row("mother","mother","nanay","f",true,["мама","мамы","маме","маму","мамой","маме"],["мамы","мам","мамам","мам","мамами","мамах"]),
 row("sister","sister","kapatid na babae","f",true,["сестра","сестры","сестре","сестру","сестрой","сестре"],["сёстры","сестёр","сёстрам","сестёр","сёстрами","сёстрах"]),
 row("night","night","gabi","f",false,["ночь","ночи","ночи","ночь","ночью","ночи"],["ночи","ночей","ночам","ночи","ночами","ночах"]),
 row("door","door","pinto","f",false,["дверь","двери","двери","дверь","дверью","двери"],["двери","дверей","дверям","двери","дверями","дверях"]),
 row("notebook","notebook","kuwaderno","f",false,["тетрадь","тетради","тетради","тетрадь","тетрадью","тетради"],["тетради","тетрадей","тетрадям","тетради","тетрадями","тетрадях"]),
 row("window","window","bintana","n",false,["окно","окна","окну","окно","окном","окне"],["окна","окон","окнам","окна","окнами","окнах"]),
 row("letter","letter","liham","n",false,["письмо","письма","письму","письмо","письмом","письме"],["письма","писем","письмам","письма","письмами","письмах"]),
 row("sea","sea","dagat","n",false,["море","моря","морю","море","морем","море"],["моря","морей","морям","моря","морями","морях"]),
 row("place","place","lugar","n",false,["место","места","месту","место","местом","месте"],["места","мест","местам","места","местами","местах"]),
 row("person","person","tao","m",true,["человек","человека","человеку","человека","человеком","человеке"],["люди","людей","людям","людей","людьми","людях"]),
 row("city","city","lungsod","m",false,["город","города","городу","город","городом","городе"],["города","городов","городам","города","городами","городах"]),
 row("park","park","parke","m",false,["парк","парка","парку","парк","парком","парке"],["парки","парков","паркам","парки","парками","парках"]),
 row("family","family","pamilya","f",false,["семья","семьи","семье","семью","семьёй","семье"],["семьи","семей","семьям","семьи","семьями","семьях"]),
 row("language","language","wika","m",false,["язык","языка","языку","язык","языком","языке"],["языки","языков","языкам","языки","языками","языках"]),
 row("museum","museum","museo","m",false,["музей","музея","музею","музей","музеем","музее"],["музеи","музеев","музеям","музеи","музеями","музеях"]),
 row("teacher","teacher (male)","guro (lalaki)","m",true,["учитель","учителя","учителю","учителя","учителем","учителе"],["учителя","учителей","учителям","учителей","учителями","учителях"])
];
export const formKey=(noun,number,caseId)=>noun.id+":"+number+":"+caseId;
export const formOf=(noun,number,caseId)=>{
 const i=CASES.findIndex(c=>c.id===caseId);
 return i===-1?null:noun.forms[number]?.[i]??null;
};
export const CASE_ITEMS=NOUNS.flatMap(noun=>["sg","pl"].flatMap(number=>
 CASES.map(c=>({id:formKey(noun,number,c.id),noun,number,caseId:c.id,answer:formOf(noun,number,c.id)}))));
