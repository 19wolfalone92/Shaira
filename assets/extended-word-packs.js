// Advanced adult Russian vocabulary. English is the learner's instruction language.
// Six words per topic; these are vocabulary cards, not proof of a CEFR level.
const pack=(id,title,stage,icon,items)=>({
 id:"lex-"+id,title:{en:title,tl:title},stage,icon,
 words:items.map(([ru,en])=>({ru,en,tl:en,icon}))
});
export const extendedWordPacks=[
pack("meeting-people","Meeting people","starter","🤝",[
["знакомиться","to get acquainted"],["представиться","to introduce oneself"],["фамилия","surname"],["возраст","age"],["гражданство","citizenship"],["родной","native / one's own"]
]),
pack("basic-actions","Essential everyday actions","starter","🔁",[
["просыпаться","to wake up"],["умываться","to wash one's face"],["завтракать","to have breakfast"],["собираться","to get ready"],["выходить","to go out"],["возвращаться","to return"]
]),
pack("asking","Useful questions","starter","❔",[
["почему","why"],["зачем","what for"],["сколько","how much / many"],["чей","whose (masculine)"],["какой","which / what kind"],["откуда","from where"]
]),
pack("food-market","At the grocery store","starter","🥬",[
["огурец","cucumber"],["капуста","cabbage"],["свёкла","beetroot"],["сметана","sour cream"],["гречка","buckwheat"],["творог","curd cheese / tvorog"]
]),
pack("cooking","Cooking dinner","starter","🍳",[
["варить","to boil / cook"],["жарить","to fry"],["нарезать","to slice"],["перемешивать","to stir"],["посолить","to add salt"],["разогреть","to heat up"]
]),
pack("measurements","Amounts and measurements","a1","⚖️",[
["килограмм","kilogram"],["грамм","gram"],["литр","litre"],["половина","half"],["четверть","quarter"],["порция","portion"]
]),
pack("personal-items","Personal belongings","a1","👜",[
["кошелёк","wallet"],["ключи","keys"],["расчёска","comb"],["зонт","umbrella"],["наушники","headphones"],["зарядка","charger"]
]),
pack("home-spaces","Rooms and spaces","a1","🏠",[
["прихожая","hallway"],["коридор","corridor"],["кладовая","storage room"],["подъезд","apartment building entrance"],["двор","courtyard"],["лестница","staircase"]
]),
pack("housework","Household chores","a1","🧺",[
["убираться","to clean up"],["пылесосить","to vacuum"],["стирать","to wash clothes"],["гладить","to iron"],["мыть посуду","to wash dishes"],["выносить мусор","to take out the rubbish"]
]),
pack("clothing-fit","Clothing and fit","a1","👕",[
["куртка","jacket"],["пальто","coat"],["брюки","trousers"],["примерка","fitting / trying on"],["размер","size"],["подходить","to fit / suit"]
]),
pack("colours-descriptions","Describing things","a1","🎨",[
["светлый","light-coloured (masculine)"],["тёмный","dark (masculine)"],["широкий","wide (masculine)"],["узкий","narrow (masculine)"],["удобный","comfortable (masculine)"],["лёгкий","light / easy (masculine)"]
]),
pack("time-management","Time and schedules","a1","⏰",[
["расписание","timetable / schedule"],["назначить","to schedule / appoint"],["перенести","to reschedule / move"],["заранее","in advance"],["вовремя","on time"],["опоздать","to be late"]
]),
pack("directions-advanced","Finding your way","a1","🧭",[
["прямо","straight ahead"],["обратно","back / in the opposite direction"],["перекрёсток","intersection"],["пешеходный переход","pedestrian crossing"],["здание","building"],["вход","entrance"]
]),
pack("transport-tickets","Using transport","a1","🚌",[
["пересадка","transfer / connection"],["маршрут","route"],["проезд","fare / passage"],["касса","ticket office"],["туда-обратно","round trip"],["платформа","platform"]
]),
pack("appointments","Making arrangements","a1","📆",[
["встреча","meeting"],["договориться","to arrange / agree"],["подтвердить","to confirm"],["отменить","to cancel"],["освободиться","to become available"],["задержаться","to be delayed"]
]),
pack("restaurants","At a restaurant","a1","🍽️",[
["меню","menu"],["закуска","starter / appetizer"],["основное блюдо","main course"],["счёт","bill / check"],["чаевые","tip / gratuity"],["заказать","to order"]
]),
pack("work-day","At work","a2","💼",[
["сотрудник","employee"],["руководитель","manager / supervisor"],["обязанность","duty / responsibility"],["задание","task / assignment"],["отчёт","report"],["срок","deadline / period"]
]),
pack("work-meeting","Professional meetings","a2","📋",[
["повестка","agenda"],["обсуждать","to discuss"],["согласовать","to coordinate / approve"],["замечание","comment / criticism"],["решение","decision"],["итог","result / outcome"]
]),
pack("study-skills","Learning and study","a2","📘",[
["упражнение","exercise"],["объяснение","explanation"],["повторение","revision / repetition"],["ошибка","mistake"],["правило","rule"],["усвоить","to assimilate / master"]
]),
pack("university","Higher education","a2","🎓",[
["лекция","lecture"],["семинар","seminar"],["исследование","research"],["экзамен","exam"],["диплом","degree / diploma"],["специальность","field of study"]
]),
pack("health","Talking about health","a2","🏥",[
["самочувствие","how one feels / condition"],["боль","pain"],["кашель","cough"],["температура","fever / temperature"],["врачебный","medical (masculine)"],["выздороветь","to recover"]
]),
pack("pharmacy","At the pharmacy","a2","💊",[
["рецепт","prescription"],["лекарство","medicine"],["дозировка","dosage"],["таблетка","tablet / pill"],["инструкция","instructions"],["побочный эффект","side effect"]
]),
pack("travel-hotel","Staying in a hotel","a2","🏨",[
["бронирование","booking / reservation"],["регистрация","check-in / registration"],["стойка регистрации","reception desk"],["заселение","checking in / occupancy"],["выезд","check-out / departure"],["проживание","accommodation / stay"]
]),
pack("airport","At the airport","a2","✈️",[
["вылет","departure (flight)"],["прилёт","arrival (flight)"],["посадка","boarding / landing"],["багаж","luggage"],["досмотр","security screening"],["рейс","flight"]
]),
pack("banking","Banking and payments","a2","🏦",[
["перевод","bank transfer / translation"],["сбережения","savings"],["баланс","balance"],["комиссия","commission / fee"],["погашение","repayment"],["задолженность","debt / amount due"]
]),
pack("documents","Documents and forms","a2","📄",[
["заявление","application / statement"],["подпись","signature"],["удостоверение","identity certificate"],["свидетельство","certificate / testimony"],["подтверждение","confirmation"],["действительный","valid (masculine)"]
]),
pack("online-messages","Digital communication","a2","💬",[
["вложение","email attachment"],["уведомление","notification"],["черновик","draft"],["отправитель","sender"],["получатель","recipient"],["переслать","to forward / resend"]
]),
pack("daily-problems","Describing a problem","b1","🛠️",[
["поломка","breakdown / fault"],["неисправность","malfunction"],["устранить","to eliminate / resolve"],["возникнуть","to arise / emerge"],["проверка","inspection / check"],["исправить","to correct / repair"]
]),
pack("relationships","Relationships and trust","b1","💜",[
["доверие","trust"],["уважение","respect"],["общение","communication"],["обида","resentment / hurt feeling"],["примирение","reconciliation"],["поддерживать","to support / maintain"]
]),
pack("feelings-nuanced","Nuanced emotions","b1","🌿",[
["разочарование","disappointment"],["вдохновение","inspiration"],["беспокойство","worry / concern"],["сочувствие","sympathy / empathy"],["уверенность","confidence"],["благодарность","gratitude"]
]),
pack("planning","Plans and priorities","b1","🎯",[
["цель","goal"],["задача","task / objective"],["приоритет","priority"],["возможность","opportunity / possibility"],["обстоятельство","circumstance"],["результат","result"]
]),
pack("negotiation","Polite negotiation","b1","🤝",[
["уступка","concession"],["предложение","proposal / offer"],["условие","condition"],["договорённость","agreement / arrangement"],["компромисс","compromise"],["возражение","objection"]
]),
pack("public-services","Public services","b1","🏛️",[
["учреждение","institution"],["ведомство","agency / department"],["очередь","queue"],["приём","appointment / reception"],["запрос","request / query"],["обращение","formal request / appeal"]
]),
pack("science-methods","Research methods","b1","🔬",[
["наблюдение","observation"],["гипотеза","hypothesis"],["эксперимент","experiment"],["метод","method"],["измерение","measurement"],["показатель","indicator / metric"]
]),
pack("environment","Environmental issues","b1","🌍",[
["загрязнение","pollution"],["выбросы","emissions"],["отходы","waste"],["ресурсы","resources"],["устойчивый","sustainable / stable (masculine)"],["сокращение","reduction"]
]),
pack("economics","Economy and work","b1","📉",[
["производительность","productivity"],["доход","income"],["расход","expense"],["издержки","costs"],["конкуренция","competition"],["потребитель","consumer"]
]),
pack("media-literacy","Media and sources","b2","📰",[
["достоверность","reliability / credibility"],["предвзятость","bias"],["доказательство","evidence / proof"],["публикация","publication"],["опровержение","refutation"],["утверждение","claim / assertion"]
]),
pack("argument-structure","Building an argument","b2","⚖️",[
["тезис","thesis"],["предпосылка","premise / prerequisite"],["контраргумент","counterargument"],["обоснование","justification"],["следствие","consequence / implication"],["сопоставление","comparison / juxtaposition"]
]),
pack("formal-writing","Formal Russian writing","b2","🖋️",[
["соответствие","compliance / correspondence"],["предусмотреть","to provide for / anticipate"],["уточнение","clarification"],["необходимость","necessity"],["осуществлять","to carry out / implement"],["взаимодействие","interaction / cooperation"]
]),
pack("abstract-thinking","Abstract concepts","b2","🧩",[
["противоречие","contradiction"],["зависимость","dependence"],["обобщение","generalisation"],["закономерность","regularity / pattern"],["неопределённость","uncertainty"],["обоснованность","soundness / justification"]
]),
pack("b2-connectors","Logical connectors","b2","🔗",[
["вследствие","owing to / as a result of"],["вопреки","contrary to / despite"],["несмотря на","despite / notwithstanding"],["при условии","provided that / on condition"],["тем не менее","nevertheless"],["таким образом","thus / in this way"]
])
];
