// Independent (not reused verbatim in learning drills) format-aware stage reviews.
// These check only selected taught skills; they are NOT a CEFR certificate or proof
// of spontaneous listening, pronunciation or free-writing proficiency.
const b=(en,tl)=>({en,tl});
const choice=(ru,choices,correct,whyEn,whyTl,kind="choice")=>({
 type:kind,prompt:ru,choices,answer:correct,explanation:b(whyEn,whyTl)
});
const type=(en,tl,answer,whyEn,whyTl,variants=[])=>({
 type:"type",prompt:b(en,tl),answer,variants,explanation:b(whyEn,whyTl)
});
const STAGE_PROMPTS_TL={
 starter:[
  "Aling titik sa «русский» ang tunog /s/?","Aling titik Cyrillic ang tunog /v/?",
  "Piliin ang salitang nangangahulugang 'nanay'.","Alin ang nangangahulugang 'salamat'?",
  "Aling pagbati ang magalang para sa hindi kilalang matanda?","Batay sa teksto, sino ang nag-aaral ng Ruso?",
  "Batay sa teksto, ano ang «мой дом»?","Aling salita ang may malambot na panandang ь?"
 ],
 a1:[
  "Punan: «Это ___ комната».","Punan: «Мы ___ по-русски каждый день».","Punan: «Я сейчас вижу ___».",
  "Punan: «Она работает ___ Казани».","Punan: «Кто ___ дома?»","Punan: «У неё ___ брат».",
  "Batay sa binasa, saan nagtatrabaho si Olga?","Batay sa binasa, ano ang ginagawa niya sa gabi?"
 ],
 a2:[
  "Punan: «У нас нет ___».","Punan: «Я отправила письмо ___».","Punan: «Она открыла дверь ___».",
  "Punan: «Вчера мы ___ в музей».","Punan: «Завтра я ___ новый телефон».","Punan: «Здесь три ___».",
  "Bakit huli nang umuwi si Marina?","Ano ang bibilhin ni Marina bukas?"
 ],
 b1:[
  "Punan: «Каждый день я ___ на занятия пешком».","Punan: «Я уже ___ это письмо и отправила его».",
  "Punan: «Если бы мы ___ раньше, мы бы успели».","Punan: «Он спросил, есть ___ свободные места».",
  "Punan: «Я подготовила документы, ___ ничего не забыть».","Punan: «___ усталость, он закончил работу».",
  "Batay sa teksto, ano ang paulit-ulit na ginawa ni Katya matapos lumipat?",
  "Ano ang haka-hakang mangyayari ayon sa huling pangungusap?"
 ],
 b2:[
  "Punan: «Решение, ___ на совещании, потребует проверки».",
  "Punan: «___ исследование, авторы опубликовали отчёт».",
  "Punan: «Источники, ___ мы доверяем, необходимо проверить».",
  "Punan: «___ имеющимся данным, изменения пока незначительны».",
  "Punan: «Учитывая ограничения, ___».",
  "Piliin ang pinakaangkop na pormal na pangdugtong para sa makatwirang konklusyon.",
  "Ano ang pinakamalaking limitasyon sa paggamit ng resulta para sa lahat ng organisasyon?",
  "Ano ang pangunahing posisyon ng may-akda?"
 ]
};
const STAGE_CHOICES_TL={
 starter:{
  6:["aking bahay","aking paaralan","aking aklat","aking nanay"]
 },
 a1:{
  6:["sa café","sa paaralan","sa ospital","sa bahay"],
  7:["nagbabasa ng aklat","nagsusulat ng liham","bumibiyahe","naglalaro ng tennis"]
 },
 a2:{
  6:["naantala ang tren","nawala ang telepono niya","namili siya","hindi siya umabot sa pulong"],
  7:["bagong tiket","aklat","bag","tren"]
 },
 b1:{
  6:["nagpapadala ng résumé","bumibisita sa museo","sumusulat ng nobela","nagtatrabaho sa café"],
  7:["kung hindi lumipat, hindi niya makikilala ang grupo","nakilala niya ang grupo sa paaralan","gusto niyang bumalik","umiwas siya sa lahat ng panayam"]
 },
 b2:{
  6:["isang kompanya at dalawang buwan lang","walang iniulat na kasiyahan ng empleyado","sampung taong pag-aaral","ilang bansa"],
  7:["kawili-wili ang datos ngunit kulang para sa pangkalahatang konklusyon","kailangang ipatupad ang reporma saanman","tiyak na bigo ang reporma","pareho ang resulta sa lahat ng kompanya"]
 }
};
const pack=(stage,title,passage,questions)=>({
 stage,title:b(...title),passage,
 questions:questions.map((q,i)=>q.type==="choice"?
  {...q,prompt:b(q.prompt,STAGE_PROMPTS_TL[stage][i]),choicesTl:STAGE_CHOICES_TL[stage]?.[i]}:q)
});
export const stageCheckpoints=[
 pack("starter",["First steps in Russian","Mga unang hakbang sa Ruso"],
 "Анна: Привет! Меня зовут Анна. Я учу русский. Это мой дом. Здесь мама и папа. Пока!",
 [
 choice("Which printed letter in «русский» represents /s/?",["с","к","р","у"],"с","С represents /s/, while Р is /r/ and У a vowel.","Ang С ay /s/, ang Р ay /r/, at patinig ang У."),
 choice("Which Cyrillic letter is pronounced /v/?",["В","Н","Р","Ы"],"В","В is /v/; Н is /n/.","Ang В ay /v/, ang Н ay /n/."),
 choice("Choose the word for 'mother'.",["мама","книга","вода","папа"],"мама","Мама means mother; папа means father.","Ang мама ay nanay; ang папа ay tatay."),
 choice("Which word below means 'thank you'?",["Спасибо","Пока","Нет","Сейчас"],"Спасибо","Спасибо thanks someone; Пока means goodbye.","Pasasalamat ang Спасибо; paalam ang Пока."),
 choice("Which phrase is appropriate when meeting an unfamiliar adult formally?",["Здравствуйте!","Пока!","Эй!","Спокойной ночи!"],"Здравствуйте!","Здравствуйте is a conventional polite greeting.","Pormal na pagbati ang Здравствуйте."),
 choice("From the reading: who studies Russian?",["Анна","папа","мама","никто"],"Анна","«Я учу русский» is spoken by Anna.","Si Anna ang nagsabi ng «Я учу русский»."),
 choice("From the reading: what is 'мой дом'?",["my house","my school","my book","my mother"],"my house","Мой дом is my house.","Ang мой дом ay aking bahay."),
 choice("Which word is written with the soft sign ь?",["день","дом","кот","сыр"],"день","День ends with ь, which softens the preceding consonant.","May ь sa hulihan ng день."),
 type("Type 'mother' in Cyrillic without copying.","Isulat ang 'nanay' sa Cyrillic.", "мама","The Russian word for mother is мама.","Ang salita sa Ruso para sa nanay ay мама."),
 type("Write the Russian phrase 'This is a house'.","Isulat sa Ruso ang 'Ito ay bahay'.","Это дом","Это is 'this is' and дом is 'house'.","Ang Это ay 'ito' at ang дом ay 'bahay'.")
 ]),
 pack("a1",["Everyday sentences and communication","Mga pang-araw-araw na pangungusap"],
 "Ольга живёт в Минске. Её дом находится недалеко от центра. Утром она работает в небольшом кафе и встречает гостей. Днём Ольга обедает с коллегами. Вечером она возвращается домой и читает книги. У неё есть брат Андрей. Он учится в университете. По выходным Ольга и Андрей часто ходят в парк. Иногда они покупают кофе и разговаривают о планах на следующую неделю.",
 [
 choice("«Это ___ комната».",["моя","мой","моё","мои"],"моя","Комната is feminine singular, so the possessive is моя.","Pambabaeng isahan ang комната kaya моя."),
 choice("«Мы ___ по-русски каждый день».",["говорим","говорит","говоришь","говорю"],"говорим","The мы subject requires first-person plural говорим.","Ang мы ay nangangailangan ng говорим."),
 choice("«Я сейчас вижу ___».",["сестру","сестра","сестре","сестрой"],"сестру","The direct object of видеть is accusative: сестру.","Accusative ang layon: сестру."),
 choice("«Она работает ___ Казани».",["в","на","от","под"],"в","The city name Казань takes в with prepositional Казани for a static location.","Sa lungsod ng Казань ginagamit ang в Казани."),
 choice("«Кто ___ дома?»",["работает","работают","работаешь","работаю"],"работает","Кто normally agrees with third-person singular работает.","Ang кто ay madalas isahan: работает."),
 choice("«У неё ___ брат».",["есть","нету бы","будут","был есть"],"есть","«У неё есть брат» means she has a brother.","Ang У неё есть брат ay 'may kapatid siyang lalaki'."),
 choice("According to the reading, where does Olga work?",["in a café","at a school","in a hospital","at home"],"in a café","«Она работает в кафе» names her workplace.","Nasa café siya nagtatrabaho."),
 choice("According to the reading, what does she do in the evening?",["reads books","writes letters","travels","plays tennis"],"reads books","«вечером читает книги» describes her evening routine.","Sa gabi nagbabasa siya ng aklat."),
 type("Translate into Russian: I read a book.","Isulat sa Ruso: Nagbabasa ako ng aklat.","Я читаю книгу","Direct object книга changes to книгу.","Ang книга ay nagiging книгу bilang layon."),
 type("Write: Where do you live? (informal, singular).","Isulat sa Ruso: Saan ka nakatira? (impormal).","Где ты живёшь","Ты takes живёшь; где asks about a place.","Ang ты ay may pandiwang живёшь.")
 ]),
 pack("a2",["Life events, cases and future plans","Mga pangyayari, kaso at plano"],
 "Вчера Марина вернулась домой поздно, потому что её поезд задержался на два часа. Она ехала из другого города, где навещала сестру. На вокзале пассажиры долго ждали информацию, но сотрудник сообщил о задержке только вечером. Марина устала и решила не искать другой транспорт. Утром она позвонила другу и рассказала о поездке. Он посоветовал ей обратиться в службу поддержки. Днём Марина написала вежливое письмо и попросила объяснить причину задержки. Она надеется получить ответ на этой неделе. Завтра Марина собирается купить новый билет, потому что в субботу ей снова нужно поехать в другой город.",
 [
 choice("«У нас нет ___».",["сахара","сахар","сахаром","сахару"],"сахара","After нет, genitive is typical: сахара.","Genitive pagkatapos ng нет: сахара."),
 choice("«Я отправила письмо ___».",["коллеге","коллега","коллегой","коллегу"],"коллеге","A recipient takes dative: коллеге.","Dative ang tatanggap: коллеге."),
 choice("«Она открыла дверь ___».",["ключом","ключ","ключу","ключа"],"ключом","A tool uses instrumental: ключом.","Instrumental kapag kagamitan: ключом."),
 choice("«Вчера мы ___ в музей».",["ходили","ходим","ходить","ходит"],"ходили","Past plural form ходили describes a completed visit in context.","Past plural ang ходили."),
 choice("«Завтра я ___ новый телефон».",["куплю","купила","покупаю вчера","купить"],"куплю","Куплю is a perfective future for a planned purchase.","Ang куплю ay perfective future."),
 choice("«Здесь три ___».",["стула","стульев","стульями","стульях"],"стула","With три, стул takes genitive singular стула.","Pagkatapos ng три, genitive singular стула."),
 choice("From the passage, why did Marina return home late?",["her train was delayed","she lost her phone","she went shopping","she missed a meeting"],"her train was delayed","«Поезд задержался» explains the delay.","Naantala ang tren: поезд задержался."),
 choice("From the passage, what will Marina buy tomorrow?",["a new ticket","a book","a bag","a train"],"a new ticket","«Завтра ... купить новый билет».","Bukas bibili siya ng bagong tiket."),
 type("Translate: I'm writing with a pen.","Isulat sa Ruso: Nagsusulat ako gamit ang bolpen.","Я пишу ручкой","Ручкой is the instrumental tool.","Instrumental ang ручкой."),
 type("Translate: She worked yesterday.","Isulat: Nagtrabaho siya kahapon. (babae)","Вчера она работала","Past singular feminine uses работала.","Past pambabaeng isahan ang работала.")
 ]),
 pack("b1",["Connected stories, conditions and explanations","Magkakaugnay na kuwento at paliwanag"],
 "Когда Катя переехала в другой город, ей пришлось заново устраивать свою жизнь. Раньше она жила рядом с родителями и работала в небольшой компании. После переезда у неё не было ни знакомых, ни постоянной работы. Первые недели оказались труднее, чем она ожидала: многие работодатели не отвечали на письма. Сначала Катя каждый день отправляла резюме, а по вечерам готовилась к собеседованиям и изучала город. Через месяц её пригласили на встречу в организацию, которая занималась образовательными проектами. Несмотря на волнение, Катя сумела объяснить, почему её опыт будет полезен. Через несколько дней ей предложили работу. Постепенно она познакомилась с коллегами и стала чувствовать себя увереннее. Сейчас Катя понимает, что решение о переезде было рискованным, но важным. Если бы она не решилась на переезд, она не познакомилась бы с новой командой и не получила бы такой опыт.",
 [
 choice("«Каждый день я ___ на занятия пешком».",["хожу","иду сейчас","пойду вчера","езжу на машине"],"хожу","Repeated walking trips call for ходить: я хожу.","Nakagawiang paglalakad: хожу."),
 choice("«Я уже ___ это письмо и отправила его».",["написала","писала","пишу","буду писать"],"написала","Here the action is finished, so perfective написала.","Natapos na ang liham: написала."),
 choice("«Если бы мы ___ раньше, мы бы успели».",["вышли","выйдем","выходим","выходить"],"вышли","A hypothetical uses past form with бы; вышли applies to мы.","Past form ang вышли sa haka-haka."),
 choice("«Он спросил, есть ___ свободные места».",["ли","что","бы","чтобы"],"ли","An indirect yes/no question uses ли.","Ginagamit ang ли sa di-tuwirang oo/hindi na tanong."),
 choice("«Я подготовила документы, ___ ничего не забыть».",["чтобы","поэтому","однако","хотя"],"чтобы","Чтобы introduces purpose: in order not to forget.","Layunin ang ipinapahayag ng чтобы."),
 choice("«___ усталость, он закончил работу».",["Несмотря на","По словам","Вместо","Из-за"],"Несмотря на","Несмотря на marks contrast ('despite').","Ang несмотря на ay 'sa kabila ng'."),
 choice("According to the passage, what did Katya do repeatedly after the move?",["sent résumés","visited museums","wrote a novel","worked at a café"],"sent résumés","«Каждый день отправляла резюме» shows repeated effort.","Araw-araw siyang nagpapadala ng résumé."),
 choice("What is the hypothetical result in the passage?",["without the move, she would not have met the team","she met the team at school","she wanted to move back","she avoided all interviews"],"without the move, she would not have met the team","Если бы ... не познакомилась бы describes an unreal alternative.","Haka-haka ang hindi pagkikita sa grupo kung hindi siya lumipat."),
 type("Translate: If I had time, I would read. (female speaker)","Isulat sa Ruso: Kung may oras, magbabasa sana ako. (babae)","Если бы у меня было время я бы читала","Time is neuter; было. Hypothetical result uses я бы читала.","Neuter ang время kaya было; я бы читала ang resulta."),
 type("Translate: I am interested in history.","Isulat sa Ruso: Interesado ako sa kasaysayan.","Я интересуюсь историей","Интересоваться takes instrumental историей.","Instrumental ang историей pagkatapos ng интересуюсь.")
 ]),
 pack("b2",["Nuanced comprehension and formal argument","Mas malalim na pag-unawa at pormal na argumento"],
 "В общественной дискуссии о сокращении рабочего дня часто приводят результаты небольших экспериментальных проектов. Авторы одного условного исследования утверждают, что после перехода на более короткий рабочий день сотрудники стали чаще сообщать об удовлетворённости работой. Руководство компании также отметило снижение числа пропущенных рабочих дней. На первый взгляд эти данные свидетельствуют в пользу реформы: у работников появляется больше времени для семьи, отдыха и обучения.\n\nОднако при оценке результатов необходимо учитывать методологические ограничения. Выборка включала лишь одну компанию, а период наблюдения длился два месяца. Участники знали, что участвуют в эксперименте, поэтому их поведение могло временно измениться. Кроме того, исследователи не сравнили полученные показатели с данными других организаций, в которых продолжительность рабочего дня осталась прежней. Неясно также, как изменились качество услуг и распределение нагрузки между сотрудниками.\n\nСторонники сокращения рабочего времени справедливо замечают, что экономическую эффективность нельзя измерять только числом часов, проведённых на рабочем месте. Противники, в свою очередь, указывают на возможный рост издержек в отраслях, где требуется постоянное присутствие персонала. Обе позиции заслуживают внимания, но ни одна из них сама по себе не заменяет проверяемых данных.\n\nСледовательно, результаты описанного эксперимента представляют интерес, однако не позволяют делать выводы обо всех организациях. Прежде чем рекомендовать подобную реформу, необходимо провести более длительные наблюдения, учесть различия между профессиями и изучить долгосрочные последствия. Обоснованная политика должна опираться не на отдельный удачный пример, а на сопоставление независимых исследований.",
 [
 choice("«Решение, ___ на совещании, потребует проверки».",["принятое","принятый","принявший","приняв"],"принятое","The participle agrees with neuter решение.","Neuter ang решение kaya принятое."),
 choice("«___ исследование, авторы опубликовали отчёт».",["Завершив","Завершая уже","Завершён","Завершили"],"Завершив","Perfective adverbial participle denotes completed prior action with the same subject.","Natapos muna ang pananaliksik bago ang ulat."),
 choice("«Источники, ___ мы доверяем, необходимо проверить».",["которым","которые","которых","которыми"],"которым","Доверять takes dative; plural relative pronoun = которым.","Dative ang которым dahil sa доверять."),
 choice("«___ имеющимся данным, изменения пока незначительны».",["Согласно","Вопреки без","Несмотря","По"],"Согласно","Согласно takes dative имеющимся данным.","Dative ang имеющимся данным pagkatapos ng согласно."),
 choice("«Учитывая ограничения, ___».",["мы осторожно оцениваем выводы","выводы были забыты нами","возникли дополнительные данные","данные оказываются недостаточны сами"],"мы осторожно оцениваем выводы","An adverbial participle must share the subject performing the act of considering.","Dapat pareho ang gumagawa ng kilos at nag-aaral ng limitasyon."),
 choice("Choose the best formal transition to introduce a justified conclusion.",["Таким образом,","Эй,","Ну вот,","Кстати, приятель,"],"Таким образом,","Таким образом frames a formal synthesis; others change register.","Ang таким образом ay pormal na konklusyon."),
 choice("What most limits the study's generalisability?",["one company and only two months","no reported employee satisfaction","a ten-year follow-up","several countries"],"one company and only two months","The passage names a one-company sample and a two-month observation period.","Isang kompanya lang at dalawang buwan ang obserbasyon."),
 choice("What is the author's main position?",["interesting findings but insufficient evidence for general conclusions","the reform must be adopted everywhere","the reform definitively fails","every company shows identical results"],"interesting findings but insufficient evidence for general conclusions","The passage weighs evidence and limitations without a universal conclusion.","Tinimbang ng teksto ang ebidensiya at limitasyon."),
 type("Write formally: It is necessary to take the limitations into account.","Isulat nang pormal: Kailangang isaalang-alang ang mga limitasyon.","Необходимо учитывать ограничения","Необходимо + infinitive учитывать + direct object ограничения.","Infinitive ang учитывать pagkatapos ng необходимо."),
 type("Write the formal connector 'however' in Russian.","Isulat ang pormal na pangdugtong na 'gayunman' sa Ruso.","Однако","Однако introduces a conflicting observation, common in formal argument.","Ang однако ay pormal na pagsalungat.")
 ])
];
export const checkpointForStage=stage=>stageCheckpoints.find(p=>p.stage===stage);
export const allCheckpointItems=stageCheckpoints.flatMap(p=>p.questions);
