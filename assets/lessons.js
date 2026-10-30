// Shaira beginner curriculum. Every student-facing explanation has EN and Filipino versions.
export const sections = [
  { id: "alphabet", icon: "Аа", title: { en: "The alphabet", tl: "Alpabetong Ruso" }, subtitle: { en: "Recognise every Cyrillic letter", tl: "Kilalanin ang lahat ng titik Cyrillic" } },
  { id: "reading", icon: "📖", title: { en: "Read & spell", tl: "Bumasa at bumaybay" }, subtitle: { en: "Build sounds into words", tl: "Bumuo ng mga salita mula sa tunog" } },
  { id: "speaking", icon: "💬", title: { en: "Everyday Russian", tl: "Ruso sa araw-araw" }, subtitle: { en: "Useful words and sentences", tl: "Mga salita at pangungusap na magagamit" } },
  { id: "grammar", icon: "✍️", title: { en: "Grammar basics", tl: "Pangunahing gramatika" }, subtitle: { en: "Understand how Russian works", tl: "Unawain ang gramatikang Ruso" } }
];

export const lessons = [
  {
    id:"vowels", section:"alphabet", title:{en:"10 Russian vowels",tl:"10 patinig sa Ruso"},
    goal:{en:"Start with sounds, not English lookalikes. Е, Ё, Ю and Я can add a y-sound.",tl:"Magsimula sa mga tunog, hindi sa kahawig na titik sa Ingles. Maaaring may tunog na y ang Е, Ё, Ю at Я."},
    cards:[
      {ru:"А а · О о",en:"a as in father; o often sounds like a when unstressed",tl:"a gaya sa 'ama'; madalas tunog a ang o kapag walang diin"},
      {ru:"У у · Ы ы",en:"u like 'oo'; ы is a distinct Russian vowel—listen carefully",tl:"u na parang 'oo'; may natatanging tunog ang ы—pakinggang mabuti"},
      {ru:"И и · Э э",en:"i like 'ee'; э like 'e' in 'bed'",tl:"i na parang 'ee'; э na parang e sa 'bed'"},
      {ru:"Е е · Ё ё",en:"е can start with 'ye'; ё sounds like 'yo' and is normally stressed",tl:"maaaring magsimula sa 'ye' ang е; 'yo' ang ё at karaniwang may diin"},
      {ru:"Ю ю · Я я",en:"ю is often 'yu'; я is often 'ya'",tl:"karaniwang 'yu' ang ю; karaniwang 'ya' ang я"}
    ],
    quiz:{type:"choice",prompt:{en:"Which letter usually represents 'ya'?",tl:"Aling titik ang karaniwang may tunog na 'ya'?"},choices:["Я","У","Э","Ы"],answer:"Я"}
  },
  {
    id:"consonants-a",section:"alphabet",title:{en:"Consonants: first group",tl:"Mga katinig: unang pangkat"},
    goal:{en:"Some letters resemble English letters but have different sounds.",tl:"May mga titik na kahawig ng Ingles ngunit magkaiba ang tunog."},
    cards:[
      {ru:"Б б · В в · Г г",en:"b, v, g",tl:"tunog b, v, g"},
      {ru:"Д д · Ж ж · З з",en:"d, zh (as in 'vision'), z",tl:"tunog d, zh (gaya sa 'vision'), z"},
      {ru:"Й й · К к",en:"й is a short y-sound; к is k",tl:"maikling tunog y ang й; k ang к"},
      {ru:"Л л · М м · Н н",en:"l, m, n (Н is not an English H)",tl:"l, m, n (ang Н ay hindi H sa Ingles)"}
    ],
    quiz:{type:"choice",prompt:{en:"Which Cyrillic letter makes the 'n' sound?",tl:"Aling titik Cyrillic ang may tunog na 'n'?"},choices:["Н","Р","В","С"],answer:"Н"}
  },
  {
    id:"consonants-b",section:"alphabet",title:{en:"The rest & two signs",tl:"Ibang katinig at dalawang pananda"},
    goal:{en:"There are 21 consonants and two signs (ь and ъ) in the 33-letter alphabet.",tl:"May 21 katinig at dalawang pananda (ь at ъ) sa 33-titik na alpabeto."},
    cards:[
      {ru:"П п · Р р · С с · Т т",en:"p, rolled r, s, t (Р is not English P)",tl:"p, pinagsasalitang r, s, t (hindi P sa Ingles ang Р)"},
      {ru:"Ф ф · Х х",en:"f; х is a throaty kh",tl:"f; ang х ay tunog kh mula sa lalamunan"},
      {ru:"Ц ц · Ч ч",en:"ts (as in cats); ch (as in chair)",tl:"ts (gaya sa cats); ch (gaya sa chair)"},
      {ru:"Ш ш · Щ щ",en:"sh; щ is a longer softer sh-like sound",tl:"sh; mas mahaba at malambot na tunog sh ang щ"},
      {ru:"Ь ь · Ъ ъ",en:"Soft sign changes the preceding consonant; hard sign separates sounds. Neither has its own vowel sound.",tl:"Pinapalambot ng ь ang katinig; pinaghihiwalay ng ъ ang mga tunog. Walang sariling patinig ang dalawa."}
    ],
    quiz:{type:"choice",prompt:{en:"Which is the soft sign?",tl:"Alin ang malambot na pananda (soft sign)?"},choices:["Ь","Ъ","Ы","И"],answer:"Ь"}
  },
  {
    id:"syllables",section:"reading",title:{en:"Read simple syllables",tl:"Bumasa ng mga pantig"},
    goal:{en:"Read left to right. Combine consonant + vowel.",tl:"Bumasa mula kaliwa pakanan. Pagsamahin ang katinig at patinig."},
    cards:[
      {ru:"М + А = МА",en:"m + a = ma. Tap the sound button and repeat.",tl:"m + a = ma. Pindutin ang tunog at ulitin."},
      {ru:"П + А = ПА",en:"p + a = pa",tl:"p + a = pa"},
      {ru:"Д + О = ДО",en:"d + o = do",tl:"d + o = do"},
      {ru:"МА + МА = МАМА",en:"mama means mum / mother",tl:"ang мама ay ina / nanay"}
    ],
    quiz:{type:"type",prompt:{en:"Type 'mother' in Russian (lowercase).",tl:"Isulat ang 'nanay' sa Ruso (maliliit na titik)."},answer:"мама"}
  },
  {
    id:"first-words",section:"reading",title:{en:"Your first four words",tl:"Unang apat na salita"},
    goal:{en:"Pay attention to each Cyrillic letter—don't rely on English spelling.",tl:"Bigyang-pansin ang bawat titik Cyrillic—huwag umasa sa baybay sa Ingles."},
    cards:[
      {ru:"дом",en:"house / home",tl:"bahay"},
      {ru:"кот",en:"cat (male)",tl:"pusang lalaki"},
      {ru:"мир",en:"world; also peace",tl:"mundo; maaari ring kapayapaan"},
      {ru:"вода",en:"water (unstressed о is reduced in pronunciation)",tl:"tubig (nagbabago ang tunog ng о kapag walang diin)"}
    ],
    quiz:{type:"choice",prompt:{en:"Which Russian word means 'house'?",tl:"Aling salitang Ruso ang ibig sabihin ay 'bahay'?"},choices:["дом","кот","мир","вода"],answer:"дом"}
  },
  {
    id:"listen-spell",section:"reading",title:{en:"Listen and write",tl:"Makinig at sumulat"},
    goal:{en:"Listen to the spoken word, then type the Cyrillic spelling. Audio depends on your device.",tl:"Pakinggan ang salita at isulat sa Cyrillic. Nakadepende ang audio sa iyong device."},
    cards:[
      {ru:"мама",en:"mother — two repeated syllables",tl:"nanay — dalawang inuulit na pantig"},
      {ru:"папа",en:"father — notice the letter П",tl:"tatay — pansinin ang titik П"},
      {ru:"да",en:"yes — two letters",tl:"oo — dalawang titik"}
    ],
    quiz:{type:"dictation",speak:"папа",prompt:{en:"Tap Listen, then type the word you hear.",tl:"Pindutin ang Makinig, saka isulat ang salitang narinig."},answer:"папа"}
  },
  {
    id:"greetings",section:"speaking",title:{en:"Hello and goodbye",tl:"Pagbati at pamamaalam"},
    goal:{en:"Use polite forms with people you don't know well.",tl:"Gamitin ang magalang na paraan sa hindi mo gaanong kakilala."},
    cards:[
      {ru:"Привет!",en:"Hi! (informal)",tl:"Hi! (di-pormal)"},
      {ru:"Здравствуйте!",en:"Hello! (polite)",tl:"Kumusta! (magalang)"},
      {ru:"Пока!",en:"Bye! (informal)",tl:"Paalam! (di-pormal)"},
      {ru:"Спасибо!",en:"Thank you!",tl:"Salamat!"}
    ],
    quiz:{type:"choice",prompt:{en:"Which greeting is polite/formal?",tl:"Aling pagbati ang magalang o pormal?"},choices:["Здравствуйте!","Привет!","Пока!","Да"],answer:"Здравствуйте!"}
  },
  {
    id:"introductions",section:"speaking",title:{en:"Introduce yourself",tl:"Ipakilala ang sarili"},
    goal:{en:"Say your name and ask someone theirs.",tl:"Sabihin ang iyong pangalan at itanong ang pangalan ng kausap."},
    cards:[
      {ru:"Меня зовут Шаира.",en:"My name is Shaira.",tl:"Ang pangalan ko ay Shaira."},
      {ru:"Как тебя зовут?",en:"What's your name? (informal)",tl:"Ano ang pangalan mo? (di-pormal)"},
      {ru:"Очень приятно.",en:"Nice to meet you.",tl:"Ikinagagalak kitang makilala."},
      {ru:"Я учу русский.",en:"I am learning Russian.",tl:"Nag-aaral ako ng Ruso."}
    ],
    quiz:{type:"choice",prompt:{en:"How do you say 'I am learning Russian'?",tl:"Paano sabihin ang 'Nag-aaral ako ng Ruso'?"},choices:["Я учу русский.","Я дома.","Как дела?","До свидания."],answer:"Я учу русский."}
  },
  {
    id:"kind-words",section:"speaking",title:{en:"Kind everyday phrases",tl:"Magiliw na pang-araw-araw na salita"},
    goal:{en:"Practice useful short sentences, not memorised sounds alone.",tl:"Magsanay ng mga maikling pangungusap, hindi lamang tunog."},
    cards:[
      {ru:"Как дела?",en:"How are you?",tl:"Kumusta ka?"},
      {ru:"Хорошо, спасибо.",en:"Good, thank you.",tl:"Mabuti, salamat."},
      {ru:"Пожалуйста.",en:"Please / you're welcome (depends on context)",tl:"Pakiusap / walang anuman (depende sa sitwasyon)"},
      {ru:"Я тебя люблю.",en:"I love you. (informal, personal)",tl:"Mahal kita. (personal, di-pormal)"}
    ],
    quiz:{type:"choice",prompt:{en:"Which phrase means 'How are you?'",tl:"Aling pangungusap ang ibig sabihin ay 'Kumusta ka'?"},choices:["Как дела?","Спасибо.","Пока!","Да."],answer:"Как дела?"}
  },
  {
    id:"pronouns",section:"grammar",title:{en:"I, you, we, they",tl:"Ako, ikaw, tayo, sila"},
    goal:{en:"Russian uses different forms for informal and polite/plural 'you'.",tl:"Iba ang anyo ng 'ikaw' sa di-pormal at sa magalang o maramihang kausap."},
    cards:[
      {ru:"я · ты · вы",en:"I · you (informal singular) · you (polite or plural)",tl:"ako · ikaw (di-pormal, isa) · kayo (magalang o marami)"},
      {ru:"он · она · оно",en:"he · she · it",tl:"siya (lalaki) · siya (babae) · ito"},
      {ru:"мы · они",en:"we · they",tl:"tayo/kami · sila"}
    ],
    quiz:{type:"choice",prompt:{en:"Which word means 'we'?",tl:"Aling salita ang ibig sabihin ay 'tayo/kami'?"},choices:["мы","они","я","он"],answer:"мы"}
  },
  {
    id:"noun-gender",section:"grammar",title:{en:"Noun gender",tl:"Kasarian ng mga pangngalan"},
    goal:{en:"Russian nouns have grammatical gender. Common endings help, but there are exceptions.",tl:"May gramatikal na kasarian ang pangngalan sa Ruso. Nakakatulong ang hulihan, ngunit may mga eksepsiyon."},
    cards:[
      {ru:"стол · дом",en:"table · house — usually masculine (consonant ending)",tl:"mesa · bahay — karaniwang panlalaki (nagtatapos sa katinig)"},
      {ru:"книга · мама",en:"book · mum — usually feminine (-а or -я)",tl:"aklat · nanay — karaniwang pambabae (-а o -я)"},
      {ru:"окно · море",en:"window · sea — usually neuter (-о or -е)",tl:"bintana · dagat — karaniwang neuter (-о o -е)"},
      {ru:"словарь",en:"dictionary — masculine despite ending in -ь; learn with the word",tl:"diksyunaryo — panlalaki kahit nagtatapos sa -ь; tandaan kasama ng salita"}
    ],
    quiz:{type:"choice",prompt:{en:"What is the grammatical gender of окно (window)?",tl:"Ano ang gramatikal na kasarian ng окно (bintana)?"},choices:["Neuter","Masculine","Feminine"],answer:"Neuter"}
  },
  {
    id:"present-tense",section:"grammar",title:{en:"Simple present tense",tl:"Simpleng pangkasalukuyang panahunan"},
    goal:{en:"Verb endings change with the person. Learn a whole example pattern.",tl:"Nagbabago ang hulihan ng pandiwa ayon sa tao. Aralin ang buong halimbawa."},
    cards:[
      {ru:"Я читаю.",en:"I read / am reading.",tl:"Nagbabasa ako."},
      {ru:"Ты читаешь.",en:"You read. (informal singular)",tl:"Nagbabasa ka. (di-pormal)"},
      {ru:"Он читает.",en:"He reads.",tl:"Nagbabasa siya (lalaki)."},
      {ru:"Мы читаем.",en:"We read.",tl:"Nagbabasa tayo/kami."}
    ],
    quiz:{type:"choice",prompt:{en:"Complete: Мы _____. (We are reading.)",tl:"Kumpletuhin: Мы _____. (Nagbabasa tayo.)"},choices:["читаем","читаешь","читаю","читает"],answer:"читаем"}
  },
  {
    id:"first-cases",section:"grammar",title:{en:"A first look at cases",tl:"Panimula sa mga kaso ng pangngalan"},
    goal:{en:"Russian changes word endings to show sentence roles. This lesson introduces the idea, not all six cases.",tl:"Nagbabago ang hulihan ng mga salita ayon sa gamit sa pangungusap. Panimula ito, hindi pa ang anim na kaso."},
    cards:[
      {ru:"Это мама.",en:"This is Mum. мама is the subject form (nominative).",tl:"Ito si Nanay. Ang мама ay anyong simuno (nominative)."},
      {ru:"Я вижу маму.",en:"I see Mum. мама → маму when it is the direct object (accusative).",tl:"Nakikita ko si Nanay. Nagiging маму ang мама kapag tuwirang layon (accusative)."},
      {ru:"Это книга.",en:"This is a book. книга is nominative.",tl:"Ito ay aklat. Nominative ang книга."},
      {ru:"Я читаю книгу.",en:"I'm reading a book. книга → книгу is accusative.",tl:"Nagbabasa ako ng aklat. Nagiging книгу ang книга sa accusative."}
    ],
    quiz:{type:"choice",prompt:{en:"Complete: Я читаю _____. (I'm reading a book.)",tl:"Kumpletuhin: Я читаю _____. (Nagbabasa ako ng aklat.)"},choices:["книгу","книга","книги","книгой"],answer:"книгу"}
  }
];

export const alphabet = Array.from("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ");
export const keyboardRows = ["ЁЙЦУКЕНГШЩЗХЪ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮ"];
