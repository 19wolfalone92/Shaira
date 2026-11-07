// Adult practical-language vocabulary packs. Each has six curated bilingual word cards.
// These supplement, not replace, alphabet-first learning.
const pack=(id,title,icon,rows)=>({id,title:{en:title[0],tl:title[1]},icon,
  words:rows.map(r=>({ru:r[0],en:r[1],tl:r[2],icon:r[3]}))});
export const adultWordPacks=[
pack("adult-time",["Time words","Mga salita sa oras"],"◷",[
["сейчас","now","ngayon","◷"],["позже","later","mamaya","◷"],["сегодня","today","ngayon araw","◷"],["завтра","tomorrow","bukas","◷"],["вчера","yesterday","kahapon","◷"],["скоро","soon","malapit na","◷"]]),
pack("adult-feelings",["Describing feelings","Paglalarawan ng damdamin"],"♡",[
["радостный","joyful (masculine)","masaya (panlalaki)","♡"],["грустный","sad (masculine)","malungkot (panlalaki)","♡"],["тревожно","anxiously / uneasy","balisa","♡"],["спокойно","calmly","kalmado","♡"],["устала","tired (female speaker)","pagod (babae)","♡"],["интересно","interesting","kawili-wili","♡"]]),
pack("adult-polite",["Useful polite words","Mga magagalang na salita"],"✦",[
["извините","excuse me / sorry (polite)","paumanhin","✦"],["простите","forgive me / sorry","patawad","✦"],["помогите","help me (polite command)","tulungan po","✦"],["повторите","repeat (polite command)","pakiulit","✦"],["медленно","slowly","dahan-dahan","✦"],["понимаю","I understand","naiintindihan ko","✦"]]),
pack("adult-messaging",["Messaging and calls","Mensahe at tawag"],"✉",[
["сообщение","message","mensahe","✉"],["звонок","call","tawag","✉"],["ответ","reply / answer","sagot","✉"],["перезвонить","to call back","tumawag muli","✉"],["связь","connection","koneksiyon","✉"],["интернет","internet","internet","✉"]]),
pack("adult-travel",["Travel essentials","Mga kailangan sa biyahe"],"➤",[
["паспорт","passport","pasaporte","➤"],["билет","ticket","tiket","➤"],["вокзал","rail station","istasyon ng tren","➤"],["аэропорт","airport","paliparan","➤"],["отправление","departure","pag-alis","➤"],["прибытие","arrival","pagdating","➤"]]),
pack("adult-payments",["Money and payment","Pera at pagbabayad"],"₽",[
["цена","price","presyo","₽"],["сдача","change (money)","sukli","₽"],["карта","payment card","kard","₽"],["наличные","cash","salaping papel","₽"],["чек","receipt","resibo","₽"],["дорого","expensive","mahal","₽"]]),
pack("adult-purchases",["Shopping and services","Pamimili at serbisyo"],"▣",[
["покупать","to buy (imperfective)","bumili","▣"],["выбирать","to choose","pumili","▣"],["платить","to pay","magbayad","▣"],["вернуть","to return an item","ibalik ang bagay","▣"],["размер","size","sukat","▣"],["скидка","discount","diskuwento","▣"]]),
pack("adult-health",["Health and appointments","Kalusugan at appointment"],"✚",[
["аптека","pharmacy","botika","✚"],["врач","doctor","doktor","✚"],["приём","appointment","appointment","✚"],["температура","temperature / fever","temperatura / lagnat","✚"],["голова","head","ulo","✚"],["болит","hurts / aches","masakit","✚"]]),
pack("adult-housing",["Renting a home","Pagrenta ng tirahan"],"⌂",[
["аренда","rent / rental","renta","⌂"],["квартира","apartment","apartment","⌂"],["сосед","neighbour (male)","kapitbahay na lalaki","⌂"],["договор","contract","kontrata","⌂"],["адрес","address","tirahan / address","⌂"],["ключ","key","susi","⌂"]]),
pack("adult-work",["Workplace essentials","Mga salita sa trabaho"],"▥",[
["проект","project","proyekto","▥"],["встреча","meeting","pulong","▥"],["коллега","colleague","katrabaho","▥"],["срок","deadline / term","takdang panahon","▥"],["документ","document","dokumento","▥"],["отчёт","report","ulat","▥"]]),
pack("adult-learning",["Studying a language","Pag-aaral ng wika"],"А",[
["учебник","textbook","aklat-aralin","А"],["правило","rule","tuntunin","А"],["упражнение","exercise","pagsasanay","А"],["задание","task","gawain","А"],["ошибка","mistake","pagkakamali","А"],["объяснение","explanation","paliwanag","А"]]),
pack("adult-calendar",["Calendar and schedule","Kalendaryo at iskedyul"],"▦",[
["час","hour","oras","▦"],["минута","minute","minuto","▦"],["неделя","week","linggo","▦"],["месяц","month","buwan","▦"],["расписание","schedule","iskedyul","▦"],["выходной","day off","araw na pahinga","▦"]]),
pack("adult-food",["Eating out","Pagkain sa labas"],"◈",[
["завтрак","breakfast","almusal","◈"],["обед","lunch","tanghalian","◈"],["ужин","dinner","hapunan","◈"],["меню","menu","menu","◈"],["счёт","bill (restaurant)","bayarin","◈"],["официант","server / waiter","tagapagsilbi","◈"]]),
pack("adult-relationships",["People and relationships","Tao at ugnayan"],"♡",[
["доверие","trust","tiwala","♡"],["уважение","respect","paggalang","♡"],["общение","communication","komunikasyon","♡"],["знакомство","acquaintance / meeting","pagkakakilala","♡"],["поддержка","support","suporta","♡"],["понимание","understanding","pag-unawa","♡"]]),
pack("adult-technology",["Technology and apps","Teknolohiya at mga app"],"⌘",[
["телефон","phone","telepono","⌘"],["ноутбук","laptop","laptop","⌘"],["клавиатура","keyboard","keyboard","⌘"],["почта","email / post","email / koreo","⌘"],["пароль","password","password","⌘"],["экран","screen","screen","⌘"]]),
pack("adult-directions",["City directions","Mga direksiyon sa lungsod"],"↗",[
["улица","street","kalye","↗"],["светофор","traffic light","ilaw-trapiko","↗"],["остановка","stop","hintuan","↗"],["поворот","turn","liko","↗"],["налево","to the left","pakaliwa","↗"],["направо","to the right","pakanan","↗"]]),
pack("adult-weather",["Weather for plans","Panahon para sa plano"],"☼",[
["облачно","cloudy","maulap","☼"],["дождливо","rainy","maulan","☼"],["ветрено","windy","mahangin","☼"],["тепло","warm","mainit-init","☼"],["холодно","cold","malamig","☼"],["солнечно","sunny","maaraw","☼"]]),
pack("adult-culture",["Culture and leisure","Kultura at libangan"],"♬",[
["фильм","film","pelikula","♬"],["театр","theatre","teatro","♬"],["музей","museum","museo","♬"],["выставка","exhibition","eksibisyon","♬"],["автор","author","may-akda","♬"],["концерт","concert","konsiyerto","♬"]]),
pack("adult-thinking",["Opinions and evidence","Opinyon at ebidensiya"],"?",[
["мнение","opinion","opinyon","?"],["причина","reason","dahilan","?"],["довод","argument","pangangatuwiran","?"],["источник","source","pinagmulan","?"],["вывод","conclusion","konklusyon","?"],["сомнение","doubt","pag-aalinlangan","?"]]),
pack("adult-society",["Society and change","Lipunan at pagbabago"],"◇",[
["общество","society","lipunan","◇"],["закон","law","batas","◇"],["право","right / law","karapatan / batas","◇"],["ответственность","responsibility","pananagutan","◇"],["политика","policy / politics","patakaran / politika","◇"],["изменение","change","pagbabago","◇"]])
];
