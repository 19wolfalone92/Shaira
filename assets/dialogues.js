import {extraDialogues} from "./extra-dialogues.js";
// Contextual Russian dialogues for shadowing, reading aloud and comprehension.
// Speaker A/B are fictional. Explanations have English and Filipino versions.
const pair=(en,tl)=>({en,tl});
const line=(who,ru,en,tl)=>({who,ru,en,tl});
function scene(id,stage,icon,title,goal,lines,question,choices,answer){
  return {id,stage,icon,title:pair(...title),goal:pair(...goal),
    lines:lines.map(x=>line(...x)),
    question:pair(...question),choices,answer};
}
export const dialogues=[
scene("hello","starter","👋",["Hello!","Kumusta!"],["Say hello and answer.","Bumati at sumagot."],[
["А","Привет! Как дела?","Hi! How are you?","Hi! Kumusta ka?"],
["Б","Хорошо, спасибо! А у тебя?","Good, thanks! And you?","Mabuti, salamat! Ikaw?"],
["А","Тоже хорошо!","I'm good too!","Mabuti rin!"],
["Б","Пока!","Bye!","Paalam!"]],
["Which word means 'thanks'?","Alin ang salitang 'salamat'?",],["спасибо","пока","привет","хорошо"],"спасибо"),
scene("name","starter","💜",["What's your name?","Ano ang pangalan mo?"],["Introduce yourself by name.","Ipakilala ang iyong pangalan."],[
["А","Здравствуйте! Как вас зовут?","Hello! What's your name? (polite)","Kumusta! Ano ang pangalan ninyo?"],
["Б","Меня зовут Шаира.","My name is Shaira.","Shaira ang pangalan ko."],
["А","Очень приятно!","Nice to meet you!","Ikinagagalak kitang makilala!"],
["Б","Мне тоже.","Me too.","Ako rin."]],
["Which phrase introduces Shaira?","Aling parirala ang pagpapakilala ni Shaira?"],["Меня зовут Шаира.","Как дела?","Спасибо!","Мне тоже."],"Меня зовут Шаира."),
scene("yes-no","starter","👍",["Yes or no","Oo o hindi"],["Answer a simple question.","Sumagot sa simpleng tanong."],[
["А","Это твоя книга?","Is this your book?","Aklat mo ba ito?"],
["Б","Да, моя.","Yes, mine.","Oo, akin."],
["А","А это твой телефон?","And is this your phone?","Telepono mo rin ba ito?"],
["Б","Нет, не мой.","No, it isn't mine.","Hindi, hindi akin."]],
["Which answer is 'No, not mine'?","Alin ang 'Hindi, hindi akin'?"],["Нет, не мой.","Да, моя.","Добрый день.","До завтра."],"Нет, не мой."),
scene("tea","starter","☕",["A cup of tea","Isang tasang tsaa"],["Ask politely for a drink.","Magalang na humingi ng inumin."],[
["А","Чай или кофе?","Tea or coffee?","Tsaa o kape?"],
["Б","Чай, пожалуйста.","Tea, please.","Tsaa po, pakiusap."],
["А","С сахаром?","With sugar?","May asukal?"],
["Б","Нет, спасибо.","No, thanks.","Wala, salamat."]],
["What drink does B want?","Anong inumin ang gusto ni B?"],["чай","кофе","воду","сок"],"чай"),
scene("meet","a1","🫶",["Meeting a friend","Pakikipagkita sa kaibigan"],["Ask how and where someone is.","Itanong kung kumusta at nasaan ang tao."],[
["А","Привет, где ты?","Hi, where are you?","Hi, nasaan ka?"],
["Б","Я дома. А ты?","I'm home. And you?","Nasa bahay ako. Ikaw?"],
["А","Я в центре. Давай встретимся?","I'm downtown. Shall we meet?","Nasa sentro ako. Magkita tayo?"],
["Б","Хорошо, через час!","Okay, in an hour!","Sige, sa loob ng isang oras!"]],
["When will they meet?","Kailan sila magkikita?"],["через час","через день","сейчас","завтра"],"через час"),
scene("family","a1","👨‍👩‍👧",["My family","Aking pamilya"],["Ask about someone's family.","Magtanong tungkol sa pamilya."],[
["А","У тебя большая семья?","Do you have a big family?","Malaki ba ang pamilya mo?"],
["Б","Да, у меня есть брат и сестра.","Yes, I have a brother and a sister.","Oo, may kapatid akong lalaki at babae."],
["А","Они живут рядом?","Do they live nearby?","Malapit ba sila nakatira?"],
["Б","Нет, мы живём в разных городах.","No, we live in different cities.","Hindi, magkakaibang lungsod kami nakatira."]],
["Where do they live?","Saan sila nakatira?"],["в разных городах","в одном доме","в одной комнате","в одной школе"],"в разных городах"),
scene("food","a1","🍽️",["At a café","Sa café"],["Order basic food.","Umorder ng simpleng pagkain."],[
["А","Здравствуйте! Что будете заказывать?","Hello! What would you like to order?","Kumusta! Ano ang oorderin ninyo?"],
["Б","Суп и чай, пожалуйста.","Soup and tea, please.","Sopas at tsaa po."],
["А","Что-нибудь ещё?","Anything else?","May iba pa po?"],
["Б","Нет, спасибо. Сколько с меня?","No, thank you. How much do I owe?","Wala na po. Magkano po lahat?"]],
["What did B order?","Ano ang inorder ni B?"],["суп и чай","кофе и торт","рис и воду","сок и салат"],"суп и чай"),
scene("shop","a1","🛍️",["Buying fruit","Pagbili ng prutas"],["Ask the price and quantity.","Itanong ang presyo at dami."],[
["А","Сколько стоит килограмм яблок?","How much is one kilo of apples?","Magkano ang isang kilo ng mansanas?"],
["Б","Сто рублей.","One hundred rubles.","Isang daang rubles."],
["А","Дайте, пожалуйста, два килограмма.","Two kilos, please.","Dalawang kilo po."],
["Б","Пожалуйста, вот ваши яблоки.","Here are your apples.","Narito po ang mga mansanas ninyo."]],
["How many kilos does A buy?","Ilang kilo ang binili ni A?"],["два","один","три","пять"],"два"),
scene("hobbies","a1","🎵",["Hobbies","Mga libangan"],["Talk about favorite activities.","Pag-usapan ang paboritong gawain."],[
["А","Что ты любишь делать?","What do you like doing?","Ano ang gusto mong gawin?"],
["Б","Я люблю музыку и книги.","I like music and books.","Gusto ko ang musika at mga aklat."],
["А","А я люблю спорт.","And I like sports.","Ako naman ay mahilig sa sports."],
["Б","Отлично!","Great!","Ayos!"]],
["What does A like?","Ano ang gusto ni A?"],["спорт","книги","музыку","кино"],"спорт"),
scene("weekend","a1","🌤️",["Weekend plans","Plano sa weekend"],["Invite someone to go out.","Mag-imbita sa paglabas."],[
["А","Что ты делаешь в субботу?","What are you doing on Saturday?","Ano ang gagawin mo sa Sabado?"],
["Б","Пока не знаю. А что?","I don't know yet. Why?","Hindi ko pa alam. Bakit?"],
["А","Пойдём в парк?","Shall we go to the park?","Punta tayo sa parke?"],
["Б","С удовольствием!","I'd love to!","Oo, gusto ko!"]],
["Where is the invitation to?","Saan ang paanyaya?"],["в парк","в музей","в школу","в кафе"],"в парк"),
scene("directions","a2","🗺️",["Finding the station","Paghahanap ng istasyon"],["Understand directions.","Unawain ang direksiyon."],[
["А","Извините, где железнодорожный вокзал?","Excuse me, where is the train station?","Paumanhin, saan ang istasyon ng tren?"],
["Б","Идите прямо до светофора.","Go straight to the traffic light.","Dumiretso hanggang ilaw-trapiko."],
["А","А потом?","And then?","Pagkatapos po?"],
["Б","Поверните направо. Вокзал рядом.","Turn right. The station is nearby.","Kumanan. Malapit na ang istasyon."]],
["Which direction after the traffic light?","Anong direksiyon pagkaraan ng ilaw-trapiko?"],["направо","налево","назад","вниз"],"направо"),
scene("hotel","a2","🏨",["Checking into a hotel","Pag-check in sa hotel"],["Ask about a reservation.","Magtanong tungkol sa reserbasyon."],[
["А","Здравствуйте, у меня бронирование на два дня.","Hello, I have a reservation for two days.","Kumusta, may reserbasyon ako para sa dalawang araw."],
["Б","На какое имя?","Under which name?","Sa anong pangalan?"],
["А","На имя Анна Смирнова.","In the name Anna Smirnova.","Sa pangalang Anna Smirnova."],
["Б","Ваш номер на третьем этаже.","Your room is on the third floor.","Nasa ikatlong palapag ang inyong kuwarto."]],
["Which floor is the room on?","Sa anong palapag ang kuwarto?"],["на третьем","на первом","на втором","на пятом"],"на третьем"),
scene("doctor","a2","🩺",["At the doctor","Sa doktor"],["Explain ordinary symptoms (not medical advice).","Ilarawan ang karaniwang sintomas (hindi payong medikal)."],[
["А","Что вас беспокоит?","What's troubling you?","Ano ang nararamdaman ninyo?"],
["Б","У меня болит горло и высокая температура.","My throat hurts and I have a high temperature.","Masakit ang lalamunan ko at mataas ang lagnat ko."],
["А","Как давно?","For how long?","Gaano na katagal?"],
["Б","Со вчерашнего вечера.","Since yesterday evening.","Simula kahapon ng gabi."]],
["Since when has B felt ill?","Kailan nagsimula ang sakit ni B?"],["со вчерашнего вечера","сегодня утром","неделю назад","с прошлого месяца"],"со вчерашнего вечера"),
scene("work","a2","💼",["A job interview","Panayam sa trabaho"],["Describe experience.","Ilarawan ang karanasan."],[
["А","Расскажите о своём опыте.","Tell me about your experience.","Ikuwento ninyo ang karanasan ninyo."],
["Б","Я работала с клиентами два года.","I worked with customers for two years.","Nagtrabaho ako sa mga kliyente nang dalawang taon."],
["А","Почему хотите сменить работу?","Why do you want to change jobs?","Bakit ninyo gustong magpalit ng trabaho?"],
["Б","Хочу развиваться и изучать новое.","I want to grow and learn new things.","Gusto kong umunlad at matuto ng bago."]],
["For how long did B work with clients?","Gaano katagal nagtrabaho si B sa mga kliyente?"],["два года","один год","пять лет","три месяца"],"два года"),
scene("past-trip","a2","🚆",["A trip last summer","Biyahe noong nakaraang tag-init"],["Discuss a past experience.","Pag-usapan ang nakaraang karanasan."],[
["А","Как прошёл отпуск?","How was your vacation?","Kumusta ang bakasyon?"],
["Б","Отлично! Мы ездили в горы.","Great! We went to the mountains.","Ayos! Pumunta kami sa bundok."],
["А","Какая была погода?","What was the weather like?","Kumusta ang panahon?"],
["Б","Сначала шёл дождь, потом выглянуло солнце.","First it rained, then the sun came out.","Una umulan, pagkatapos ay umaraw."]],
["Where did B travel?","Saan bumiyahe si B?"],["в горы","к морю","в деревню","в столицу"],"в горы"),
scene("explain","b1","💬",["Making a choice","Pagpapaliwanag ng pagpili"],["Give reasons and respond to another view.","Magbigay ng dahilan at tumugon sa ibang opinyon."],[
["А","Почему ты выбрала этот курс?","Why did you choose this course?","Bakit mo pinili ang kursong ito?"],
["Б","Он интересный и подходит моему уровню.","It's interesting and suits my level.","Interesante ito at bagay sa antas ko."],
["А","Но он требует много времени.","But it takes a lot of time.","Pero kailangan nito ng maraming oras."],
["Б","Верно, однако результат того стоит.","True, but the result is worth it.","Totoo, pero sulit ang resulta."]],
["What drawback does A mention?","Anong kahinaan ang binanggit ni A?"],["много времени","высокую цену","плохие книги","сложную дорогу"],"много времени"),
scene("problem","b1","📱",["Resolving a problem","Paglutas ng problema"],["Explain a mistake and request a fix.","Ipaliwanag ang pagkakamali at humiling ng solusyon."],[
["А","Добрый день. Мой заказ доставили не по адресу.","Hello. My order was delivered to the wrong address.","Magandang araw. Naihatid ang order ko sa maling address."],
["Б","Приносим извинения. Уточните номер заказа.","We apologize. Please confirm the order number.","Paumanhin. Pakibigay ang numero ng order."],
["А","Вот номер. Можно исправить адрес?","Here's the number. Can you correct the address?","Narito ang numero. Maaari bang itama ang address?"],
["Б","Конечно. Мы свяжемся с вами сегодня.","Of course. We'll contact you today.","Oo naman. Makikipag-ugnayan kami sa inyo ngayon."]],
["What problem happened?","Anong naging problema?"],["неверный адрес","плохой товар","поздний звонок","потерянный телефон"],"неверный адрес"),
scene("friendship","b1","🤝",["Disagreement and compromise","Hindi pagkakasundo at kompromiso"],["Disagree politely and offer another option.","Magalang na sumalungat at magbigay ng alternatibo."],[
["А","Я думаю, нам стоит выехать пораньше.","I think we should leave earlier.","Sa tingin ko, mas mabuting umalis nang maaga."],
["Б","Я не совсем согласна: утром слишком много машин.","I don't quite agree: there is too much traffic in the morning.","Hindi ako lubos na sang-ayon: masyadong maraming sasakyan sa umaga."],
["А","Тогда поедем после обеда?","Shall we travel after lunch then?","Kung ganoon, bumiyahe tayo pagkatapos ng tanghalian?"],
["Б","Это хороший компромисс.","That's a good compromise.","Magandang kompromiso iyon."]],
["When do they decide to travel?","Kailan sila nagpasyang bumiyahe?"],["после обеда","рано утром","ночью","завтра утром"],"после обеда"),
scene("news","b2","📰",["Discussing a news report","Pagtalakay ng balita"],["Differentiate facts from claims.","Ihiwalay ang katotohanan sa pahayag."],[
["А","Ты читала новость об этом исследовании?","Have you read the news about this study?","Nabasa mo ba ang balita tungkol sa pag-aaral?"],
["Б","Да, но источник кажется сомнительным.","Yes, but the source seems questionable.","Oo, pero kahina-hinala ang pinagmulan."],
["А","Какие данные нужно проверить?","Which data should we verify?","Aling mga datos ang dapat suriin?"],
["Б","Методику, выборку и дату публикации.","The method, sample and publication date.","Pamamaraan, sample at petsa ng paglalathala."]],
["What three things should be checked?","Anong tatlong bagay ang dapat suriin?"],["методику, выборку и дату","сайт, имя и цену","город, карту и язык","автора, билет и время"],"методику, выборку и дату"),
scene("debate","b2","⚖️",["A balanced argument","Balanseng pangangatwiran"],["Concede a point and present a counterargument.","Kilalanin ang punto ng iba at maglahad ng kontra-argumento."],[
["А","Удалённая работа повышает продуктивность.","Remote work improves productivity.","Pinapataas ng remote work ang produktibidad."],
["Б","В некоторых случаях да, однако команде сложнее общаться.","In some cases, yes; however, it's harder for a team to communicate.","Sa ilang kaso, oo; gayunman, mas mahirap ang komunikasyon ng koponan."],
["А","Следовательно, лучше сочетать оба формата?","So would combining both formats be better?","Kung ganoon, mas mabuti bang pagsamahin ang dalawang paraan?"],
["Б","Вероятно, если учитывать потребности сотрудников.","Possibly, if employees' needs are considered.","Posible, kung isasaalang-alang ang pangangailangan ng mga empleyado."]],
["What is proposed as a compromise?","Ano ang mungkahing kompromiso?"],["сочетать оба формата","отказаться от работы","закрыть офис","запретить встречи"],"сочетать оба формата")
];
dialogues.push(...extraDialogues);
