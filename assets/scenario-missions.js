// Fifteen independent adult role-play situations, with three decisions per scene.
// Correct answers are context-bound pragmatic models, not the only valid free-form Russian.
// Each reply leads to a distinct consequence, not a fake ungraded 'chatbot'.
const turn=(speaker,goal,options,correct,why,right,wrong)=>({
 speaker,goal,options,correct,why,right,wrong
});
const mission=(id,stage,title,setting,turns)=>({id,stage,title,setting,turns});
export const scenarioMissions=[
mission("new-neighbour","starter","Meet a new neighbour","You enter the hallway and meet someone for the first time.",[
turn("Здравствуйте!","Reply politely to someone you do not know.",["Здравствуйте!","Пока!","Спокойной ночи!"],0,"Здравствуйте is a polite greeting for an unfamiliar adult.","Очень приятно!","Простите, я вас не понял."),
turn("Как вас зовут?","Say that your name is Shaira.",["Я зовут Шаира.","Меня зовут Шаира.","Ты Шаира?"],1,"The Russian name formula is Меня зовут + name.","Очень приятно, Шаира!","Как вас всё-таки зовут?"),
turn("Вы живёте здесь?","Confirm that you live here.",["Да, я живу здесь.","Нет, книга.","Меня живёт здесь."],0,"Я живу здесь means I live here.","Тогда до встречи!","Извините, я не понимаю ответа.")
]),
mission("request-water","starter","Ask for drinking water","You are visiting a small café and need a glass of water.",[
turn("Добрый день! Чем могу помочь?","Ask politely for water.",["Вода!","Мне нужна вода, пожалуйста.","Я вода."],1,"Мне нужна вода, пожалуйста is a polite everyday request.","Конечно, сейчас принесу.","Простите, можно уточнить заказ?"),
turn("Вот ваша вода.","Thank the server.",["Спасибо большое!","Пока вода.","Нет спасибо нет."],0,"Спасибо большое is a natural way to express gratitude.","Пожалуйста!","Извините, я не понял."),
turn("Вам ещё что-нибудь нужно?","Say you don't need anything else.",["Да, окно.","Нет, спасибо.","Я нужен."],1,"Нет, спасибо is a conventional polite refusal.","Хорошего дня!","Простите, что именно вам нужно?")
]),
mission("small-library","starter","Find a book","You want to borrow a Russian book in a library.",[
turn("Здравствуйте! Что вы ищете?","Say you're looking for a book.",["Я ищу книгу.","Я книге ищет.","Это молоко."],0,"Я ищу книгу uses the first-person verb and accusative noun.","Какая книга вам нужна?","Не могли бы вы повторить?"),
turn("Вы учите русский язык?","Answer that you are learning Russian.",["Да, я учу русский.","Нет, метро большое.","Я русская учит."],0,"Я учу русский means I am studying Russian.","У нас есть простые книги.","Я вас не понимаю."),
turn("Вот простая книга. Возьмёте?","Accept the book and thank the librarian.",["Да, спасибо!","Нет, работать.","Есть мой книга."],0,"Да, спасибо is a polite acceptance.","Хорошего чтения!","Вы хотите книгу или нет?")
]),
mission("restaurant","a1","Order lunch at a restaurant","You are at a restaurant with an English-speaking friend.",[
turn("Здравствуйте! Что будете заказывать?","Order soup politely.",["Мне, пожалуйста, суп.","Суп заказал завтра.","Я суп нравится."],0,"Мне, пожалуйста, суп is a natural polite order.","Хорошо. Что будете пить?","Извините, я не понял заказ."),
turn("Что будете пить?","Order tea without sugar.",["Чай без сахара, пожалуйста.","Чай сахару есть.","Я сахар без чай."],0,"Без + genitive: без сахара.","Хорошо, принесу чай.","Уточните, пожалуйста."),
turn("Всё понравилось?","Say that everything was delicious.",["Всё было очень вкусно, спасибо.","Меня вкусное всё.","Это вкусно вчера завтра."],0,"Всё было очень вкусно is a natural way to compliment the food.","Очень рады!","Простите, я не понял.")
]),
mission("day-off","a1","Make weekend plans","A friend proposes meeting, but you work on Saturday.",[
turn("Давай встретимся в субботу!","Explain that you work on Saturday.",["В субботу я работаю.","Суббота я работать.","В субботу работал вчера."],0,"В субботу я работаю is correct present tense.","Тогда давай в воскресенье.","Ты сможешь встретиться или нет?"),
turn("Тогда давай в воскресенье!","Agree and suggest a park.",["Отлично! Пойдём в парк?","Согласна парк книга.","Парк работает вода."],0,"Пойдём в парк? suggests going to the park together.","Давай! Во сколько?","Какое место ты предлагаешь?"),
turn("Во сколько встретимся?","Suggest five o'clock.",["В пять часов.","Пять вчера.","Я пять минут."],0,"В пять часов states a meeting time.","До встречи в пять!","Я всё ещё не знаю время.")
]),
mission("store-return","a1","Return the wrong product","You bought a charger that does not fit your phone.",[
turn("Здравствуйте! Чем я могу помочь?","Explain that the charger doesn't fit.",["Эта зарядка не подходит к моему телефону.","Телефон зарядка вчера.","Я подходит зарядка."],0,"Подходит к + dative: к моему телефону.","Можете показать чек?","Не понял, в чём проблема."),
turn("У вас есть чек?","Confirm and show the receipt.",["Да, вот чек.","Нет, это парк.","Чек есть вчера где."],0,"Да, вот чек is concise and natural.","Спасибо. Можем обменять товар.","Без чека будет сложно оформить возврат."),
turn("Вы хотите обменять товар?","Ask for another charger.",["Да, мне нужна другая зарядка.","Да, я другое зарядка.","Нет, я лето."],0,"Другая agrees with feminine зарядка.","Сейчас подберём подходящую.","Какой товар вам нужен?")
]),
mission("hotel-date","a2","Change a hotel reservation","You must move a reservation from Friday to Saturday.",[
turn("Здравствуйте. У вас есть бронирование?","Confirm that you have a reservation for Friday.",["Да, у меня бронь на пятницу.","Да, я бронь пятница.","Нет, я куплю воду."],0,"Бронь на пятницу is a natural booking phrase.","Назовите, пожалуйста, фамилию.","Уточните дату бронирования."),
turn("Можно изменить дату?","Ask to move the booking to Saturday.",["Можно перенести бронь на субботу?","Мне бронь суббота перенос.","Я субботу бронирую вчера."],0,"Перенести бронь на субботу correctly expresses the change.","Сейчас проверю наличие номеров.","Не понимаю, какую дату вы хотите."),
turn("Стоимость будет немного выше. Подходит?","Politely ask how much higher the price is.",["Подскажите, пожалуйста, насколько выше?","Цена сколько повысил раньше?","Нет, мой поезд."],0,"Насколько выше is the natural question about the difference.","На десять процентов.","Простите, что именно вы хотите уточнить?")
]),
mission("repair-visit","a2","Book an appliance repair","Your washing machine stopped working yesterday.",[
turn("Добрый день. Опишите проблему.","Say when the washing machine broke.",["Вчера сломалась стиральная машина.","Вчера сломался стиральная машина.","Вчера я машина работать."],0,"Стиральная машина is feminine, so сломалась.","Понимаю. Какую модель вы используете?","Пожалуйста, уточните, что произошло."),
turn("Когда вам удобно принять мастера?","Request an appointment tomorrow morning.",["Можете приехать завтра утром?","Можете приехала завтра утро?","Я завтра в ремонте была."],0,"Можете приехать завтра утром? is a polite request.","Да, завтра утром есть время.","Пожалуйста, уточните день и время."),
turn("Мастер приедет к десяти. Всё верно?","Confirm the appointment time.",["Да, к десяти меня всё устраивает.","К десять я устраивал.","Нет, вчера десять."],0,"К десяти is the correct expression for by ten.","Хорошо, записала вашу заявку.","Повторите, пожалуйста, время.")
]),
mission("medical-questions","a2","Prepare for a medical appointment","You have a fictional appointment and need to describe symptoms.",[
turn("Здравствуйте. Что вас беспокоит?","Explain that your throat has hurt for two days.",["У меня два дня болит горло.","У меня горло два дня болел.","Я болит горло два."],0,"У меня болит горло is the usual symptom expression.","Я вас выслушал. Есть температура?","Пожалуйста, опишите симптомы ещё раз."),
turn("У вас есть температура?","Say that you don't have a fever.",["Нет, температуры нет.","Нет, температура нет.","У меня есть нет температуры."],0,"Нет температуры uses genitive after нет.","Хорошо. Есть ещё жалобы?","Не понял, есть ли у вас температура."),
turn("У вас есть вопросы?","Ask how to prepare for the tests.",["Как подготовиться к анализам?","Как анализы подготовиться меня?","Я вчера готовил анализы?"],0,"Как подготовиться к анализам? is a direct, clear question.","Сейчас объясню порядок подготовки.","Пожалуйста, уточните ваш вопрос.")
]),
mission("team-meeting","b1","Negotiate a meeting time","Your team must find an alternative to a Friday meeting.",[
turn("Я предлагаю провести совещание в пятницу.","Disagree politely because some colleagues are busy.",["Хорошая идея, однако часть коллег занята.","Нет, ты плохой.","Хорошо однако занятый часть."],0,"A concession followed by however gives a polite disagreement.","Тогда предложи другое время.","Пожалуйста, объясни причину."),
turn("Как насчёт четверга утром?","Agree but ask for preparation time.",["Четверг подойдёт, если успеем подготовить материалы.","Четверг, потому что нет.","Утром материалы уже были завтра."],0,"Если introduces a condition; подойдёт is natural for suitability.","Договорились. Отправлю материалы заранее.","Уточни, на каких условиях согласна."),
turn("Подтвердим встречу?","Confirm Thursday morning.",["Да, подтверждаю четверг утром.","Я подтверждает четверг.","Я подтверждённый вчера."],0,"Подтверждаю is a clear, professional first-person verb.","Пришлю приглашение.","Мне всё ещё нужен точный ответ.")
]),
mission("park-compromise","b1","Find a community compromise","Residents disagree about replacing a playground with parking.",[
turn("Нам нужно больше парковочных мест.","Acknowledge this concern but mention children.",["Это важно, однако детям тоже нужна площадка.","Ты неправ, молчи.","Детям нужна площадку вчера."],0,"Это важно, однако ... acknowledges the concern and introduces another.","Согласен. Как можно решить обе задачи?","Пожалуйста, объясни своё предложение."),
turn("Как можно решить обе задачи?","Suggest examining alternative parking locations.",["Предлагаю изучить другие места для парковки.","Нужно парковка вместо.","Я парковал другие место."],0,"Предлагаю + infinitive is a constructive suggestion.","Давайте сравним варианты.","Я не понял предложенный вариант."),
turn("Когда примем решение?","Suggest waiting for the results.",["После публикации результатов.","Завтра до результаты.","Вчера решений нет будет."],0,"После takes genitive: публикации результатов.","Согласны, сначала изучим данные.","Пожалуйста, уточни сроки.")
]),
mission("learning-progress","b1","Discuss language learning progress","A tutor asks how you handle difficult vocabulary.",[
turn("Как ты учишь новые слова?","Explain that you revise a little every day.",["Каждый день повторяю небольшую группу слов.","Я повторял завтра весь год.","Слова я вчера каждый завтра."],0,"The present imperfective повторяю describes a regular habit.","А как используешь их в речи?","Пожалуйста, объясни свою систему."),
turn("Как используешь их в речи?","Explain that you try to use them in conversation.",["Стараюсь применять их в разговорах.","Стараюсь разговор использует.","Я применяла разговоров будущий."],0,"Стараться + infinitive is a natural expression of effort.","Хорошая стратегия. Есть трудности?","Можешь привести конкретный пример?"),
turn("Что тебе пока труднее всего?","Admit that understanding fast speech is difficult.",["Пока мне трудно понимать быструю речь.","Мне понимать быстрый речь.","У меня быстрого речь нет трудно."],0,"Мне трудно + infinitive expresses difficulty.","Это нормальный этап, будем тренироваться.","Пожалуйста, уточни, с чем именно проблемы.")
]),
mission("research-critique","b2","Critically assess a research claim","A colleague presents results from a short, uncontrolled study.",[
turn("Исследование доказывает эффективность метода.","Identify a methodological limitation politely.",["Вывод преждевременен: отсутствует контрольная группа.","Это безусловно доказанный факт.","Твои аргументы смешные."],0,"A missing control group weakens causal inference.","Согласен, данные требуют уточнения.","Тогда какие ограничения ты видишь?"),
turn("Но показатели действительно улучшились.","Acknowledge an association without asserting causality.",["Связь есть, но причинность пока не установлена.","Значит, причина доказана безусловно.","Это не имеет никакого значения."],0,"Association alone is not proof of causation.","Тогда нужны дополнительные сравнения.","Как нам интерпретировать результаты?"),
turn("Как сформулировать осторожный вывод?","Give a cautious, evidence-based conclusion.",["Результаты многообещающие, но необходима дальнейшая проверка.","Метод эффективен абсолютно во всех случаях.","Данные ничего не значат."],0,"A balanced statement acknowledges findings and limitations.","Сформулируем именно так.","Я бы предложил более точную формулировку.")
]),
mission("transport-policy","b2","Debate public transport policy","A city committee discusses free public transport.",[
turn("Бесплатный транспорт решит проблему пробок.","Qualify the claim by mentioning service quality.",["Не обязательно: важны частота и надёжность рейсов.","Разумеется, это решит абсолютно все проблемы.","Ни один пассажир не пользуется автобусами."],0,"Frequency and reliability influence mode choice even when fares are removed.","Верно. Нужно оценить спрос.","Уточни, почему этого недостаточно."),
turn("Но программа улучшит доступность поездок.","Acknowledge benefit while mentioning financing.",["Да, однако потребуется устойчивое финансирование.","Нет, доступность не существует.","Значит, расходы исчезнут."],0,"A good counterargument concedes access benefits and notes operating costs.","Тогда проверим финансовую модель.","Пожалуйста, объясни ограничения."),
turn("Что лучше сделать сначала?","Recommend a measurable pilot and an evaluation.",["Провести пилот и заранее определить показатели успеха.","Принять решение без расчётов и обсуждения.","Ничего не проверять."],0,"A measured pilot can test costs, demand and service outcomes.","Согласны, это обоснованный путь.","Не уверен, что такое решение обоснованно.")
]),
mission("professional-email","b2","Write tactfully to management","A director asks for a professional summary of a delayed project.",[
turn("Почему проект не завершён в срок?","Explain the cause without blaming colleagues.",["Сроки сдвинулись из-за задержки поставок и дополнительных проверок.","Никто ничего не умеет, все виноваты.","Потому что просто так получилось."],0,"Specific causes and neutral tone are appropriate to professional reporting.","Понятно. Какие меры уже приняты?","Пожалуйста, сформулируйте объективные причины."),
turn("Какие меры уже приняты?","Describe a concrete mitigation step.",["Мы пересмотрели график и согласовали новые контрольные даты.","Мы ничего не сделали и не планируем.","Проблемы больше никогда не возникнут."],0,"A concrete action and measurable check dates are clearer than absolute promises.","Хорошо. Какие риски остаются?","Не хватает информации о действиях."),
turn("Какие риски остаются?","Mention uncertainty and a plan to monitor it.",["Риски сохраняются; мы будем еженедельно проверять ход работ.","Никаких рисков не существует.","Данные не нужны, всё будет идеально."],0,"Formal professional language distinguishes monitoring from guarantees.","Спасибо за взвешенный отчёт.","Уточните, как будете отслеживать ситуацию.")
])
];
