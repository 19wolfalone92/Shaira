// Ten additional adult role-play dialogues. All directions and translations in English.
// Speaker names are fictional; text is for study, not native conversation assessment.
const en=x=>({en:x,tl:x});
const dialogue=(id,stage,icon,title,goal,lines,question,choices,answer)=>({
 id:"extra-"+id,stage,icon,title:en(title),goal:en(goal),
 lines:lines.map(([who,ru,meaning])=>({who,ru,en:meaning,tl:meaning})),
 question:en(question),choices,answer
});
export const extraDialogues=[
dialogue("introducing","starter","👋","Meeting a neighbour",
 "Practice a polite introduction and simple question.",[
 ["А","Здравствуйте! Меня зовут Анна.","Hello! My name is Anna."],
 ["Б","Очень приятно. Меня зовут Мария.","Nice to meet you. My name is Maria."],
 ["А","Вы живёте здесь?","Do you live here?"],
 ["Б","Да, я живу в этом доме.","Yes, I live in this building."],
 ["А","Хорошего дня!","Have a nice day!"],
 ["Б","Спасибо! Вам тоже.","Thank you! You too."]
],"Where does Maria live?",["в этом доме","в другом городе","в гостинице","в школе"],"в этом доме"),
dialogue("water","starter","💧","Asking for water",
 "Make a simple request and say thank you.",[
 ["А","Добрый день!","Good afternoon!"],
 ["Б","Здравствуйте!","Hello!"],
 ["А","Можно стакан воды, пожалуйста?","May I have a glass of water, please?"],
 ["Б","Конечно. Вот вода.","Of course. Here is the water."],
 ["А","Большое спасибо!","Thank you very much!"],
 ["Б","Пожалуйста!","You're welcome!"]
],"What does the customer request?",["стакан воды","бутылку молока","чашку кофе","тарелку супа"],"стакан воды"),
dialogue("ordering-lunch","a1","🥗","Ordering a simple lunch",
 "Order food and ask for a bill.",[
 ["А","Здравствуйте! Можно меню?","Hello! May I see the menu?"],
 ["Б","Конечно. Что будете заказывать?","Of course. What will you order?"],
 ["А","Салат и чай, пожалуйста.","A salad and tea, please."],
 ["Б","С сахаром?","With sugar?"],
 ["А","Нет, без сахара. И счёт, пожалуйста.","No, without sugar. And the bill, please."],
 ["Б","Хорошо. Сейчас принесу.","Certainly. I'll bring it now."]
],"How does the customer want the tea?",["без сахара","с лимоном","с молоком","очень холодный"],"без сахара"),
dialogue("meeting-time","a1","🕒","Arranging a meeting",
 "Suggest a time and explain a schedule conflict.",[
 ["А","Давай встретимся в субботу.","Let's meet on Saturday."],
 ["Б","Во сколько?","At what time?"],
 ["А","В три часа дня.","At three in the afternoon."],
 ["Б","В три я работаю. Может быть, в пять?","I work at three. How about five?"],
 ["А","Хорошо. Встретимся в пять возле метро.","Okay. Let's meet at five near the metro."],
 ["Б","Отлично, до встречи!","Great, see you!"]
],"What time do they finally agree on?",["в пять","в три","в два","в семь"],"в пять"),
dialogue("booking-change","a2","🏨","Changing a hotel booking",
 "Explain a date problem and ask about conditions.",[
 ["А","Здравствуйте. У меня бронь на пятницу.","Hello. I have a reservation for Friday."],
 ["Б","Назовите, пожалуйста, вашу фамилию.","Please tell me your surname."],
 ["А","Иванова. Можно перенести бронь на субботу?","Ivanova. Can I move the reservation to Saturday?"],
 ["Б","Да, но стоимость будет немного выше.","Yes, but the price will be slightly higher."],
 ["А","Подскажите, насколько выше?","Could you tell me how much higher?"],
 ["Б","На десять процентов. Подтвердить изменение?","By ten percent. Shall I confirm the change?"]
],"What changes if the booking is moved?",["стоимость увеличится","номер исчезнет","поменяется город","понадобится другой паспорт"],"стоимость увеличится"),
dialogue("clinic","a2","🩺","Describing symptoms",
 "Explain basic symptoms and ask about the next step.",[
 ["А","Здравствуйте. Что вас беспокоит?","Hello. What seems to be the problem?"],
 ["Б","У меня болит горло уже два дня.","I've had a sore throat for two days."],
 ["А","У вас есть температура?","Do you have a fever?"],
 ["Б","Нет, температуры нет, но я быстро устаю.","No fever, but I get tired quickly."],
 ["А","Давайте обсудим симптомы подробнее.","Let's discuss your symptoms in more detail."],
 ["Б","Хорошо. Что мне нужно подготовить?","All right. What do I need to prepare?"]
],"How long has the sore throat lasted?",["два дня","неделю","один месяц","один день"],"два дня"),
dialogue("work-proposal","b1","🤝","Discussing a work proposal",
 "Give a balanced opinion, reason and alternative.",[
 ["А","Мы можем перенести встречу на пятницу.","We could move the meeting to Friday."],
 ["Б","Идея хорошая, но в пятницу часть команды занята.","That's a good idea, but part of the team is busy on Friday."],
 ["А","А если провести её в четверг утром?","What if we hold it on Thursday morning?"],
 ["Б","Так будет удобнее. Мы успеем подготовить отчёт.","That would be more convenient. We'll have time to prepare the report."],
 ["А","Тогда я отправлю новое приглашение.","Then I'll send a new invitation."],
 ["Б","Спасибо. Я подтвержу время после обеда.","Thank you. I'll confirm the time after lunch."]
],"Why is Friday inconvenient?",["часть команды занята","отчёт потерян","в офисе ремонт","в пятницу праздник"],"часть команды занята"),
dialogue("different-views","b1","💬","Different opinions about a park",
 "Recognise both viewpoints and the proposed compromise.",[
 ["А","Я считаю, что новый парк нужен нашему району.","I think our district needs a new park."],
 ["Б","Согласна, но тогда станет меньше парковочных мест.","I agree, but there will be fewer parking spaces."],
 ["А","Может быть, лучше улучшить старый парк?","Maybe it would be better to improve the old park?"],
 ["Б","Это разумный вариант. Он обойдётся дешевле.","That's a reasonable option. It would cost less."],
 ["А","Давай предложим это на собрании жителей.","Let's suggest it at the residents' meeting."],
 ["Б","Хорошо. Подготовим аргументы.","Agreed. Let's prepare arguments."]
],"What alternative do they propose?",["улучшить старый парк","закрыть район","купить автомобили","отменить собрание"],"улучшить старый парк"),
dialogue("study-interpretation","b2","📊","Interpreting research findings",
 "Contrast a reported association with a causal claim.",[
 ["А","В отчёте говорится, что после реформы сотрудники стали реже опаздывать.","The report says employees were late less often after the reform."],
 ["Б","Это интересно, но можно ли считать реформу причиной изменений?","Interesting, but can we consider the reform the cause?"],
 ["А","Пока неясно. Возможно, изменилось расписание транспорта.","It's not clear yet. The transport timetable may also have changed."],
 ["Б","Значит, нужно сравнить данные с контрольной группой.","Then we need to compare the data with a control group."],
 ["А","Согласна. Без этого вывод был бы преждевременным.","I agree. Without that, the conclusion would be premature."],
 ["Б","Предлагаю уточнить методику исследования.","I suggest clarifying the study's methodology."]
],"What key limitation do the speakers identify?",["отсутствие контрольной группы","ошибка в названии отчёта","нехватка переводчиков","чрезмерная длина заголовка"],"отсутствие контрольной группы"),
dialogue("policy-disagreement","b2","🏛️","Reaching a nuanced compromise",
 "Compare competing priorities and formulate an evidence-based compromise.",[
 ["А","Увеличение числа автобусов могло бы снизить нагрузку на дороги.","More buses could reduce pressure on roads."],
 ["Б","Однако это потребует дополнительных расходов из бюджета.","However, it would require extra budget spending."],
 ["А","Согласна. Но сокращение пробок тоже имеет экономическую ценность.","Agreed. But reducing congestion also has economic value."],
 ["Б","Предлагаю сначала проверить идею на одном маршруте.","I propose testing the idea on a single route first."],
 ["А","Тогда мы сможем оценить спрос и реальные затраты.","Then we can assess demand and actual costs."],
 ["Б","И только после этого принимать решение о расширении.","And only after that decide whether to expand it."]
],"What do they propose before a full rollout?",["пилотный проект на одном маршруте","немедленная отмена автобусов","повышение цен на поезда","закрытие центральной улицы"],"пилотный проект на одном маршруте")
];
