---
title: "Внедрение элементов гибких методологий в Банке"
layout: post
date: 2017-09-14 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- AGILE
- Management
- IT
category: blog
author: balynsky
sitemap: false
description: Внедрение элементов гибких методологий в Банке
# jemoji: '<img class="emoji" title=":ramen:" alt=":ramen:" src="https://assets.github.com/images/icons/emoji/unicode/1f35c.png" height="20" width="20" align="absmiddle">'
---

Ранее я рассказывал, что основная деятельность Банка в части ИТ процессов, была организована на ITIL. Исключением стал только процесс управления изменениями. Вторая (и заключительная) часть посвящена внедрению элементов гибких методологий в Банке в процессах управления изменениями в ИТ.

### Описание проблемы

Я столкнулся со следующими проблемами при анализе существовавшего процесса:

* 80% задач поступает ad hoc
* приоритеты задач постоянно меняются
* нет возможности осуществлять планирование работ
* отсутствует гармоничность в развитии систем
* нет «установленных правил игры» при реализации изменений

![Markdowm Image][1]{: style="width:780px" }

Как внутренний эффект – эмоциональное выгорание персонала, падение производительности труда, отсутствие эффекта новаторства. 

Основная цель Банка – максимально быстро и качественно выводить новые продукты на рынок. Почему этого не происходило? Я покажу три самых распространенных сценария. Уверен их можно встретить и в других финансовых организациях.

Для наглядности будем запускать новый кредитный продукт – Кредитная карта. Заказчиком будет выступать розничный бизнес, основной исполнитель – внешний подрядчик (будем использовать модель аутсорсинга, которая распространена в ряде организаций), внутреннее ИТ выполняет сервисную функцию. И самое главное: все ситуации будут вымышленные, а совпадения случайны. 

![Markdowm Image][2]{: class="block-right" style="width:360px"}

Заказчик начинает реализацию проекта, проводит встречи с Исполнителем. Результат формирование паспорта проекта на реализацию продукта.

В паспорт попадают все требования и процессы, которые описывает наш Заказчик, основываюсь на процессе продажи:

* Поля анкеты клиента;
* Требования к фронт системе (продажа, верификация);
* Ролевая модель;
* Требования к интеграции с системами;
* Драфт процесса продажи.

И тут мы приходим к первой ошибке: после утверждения концепта и старта работ оказываются непроработанными (или неучтенными): участие фин. мониторинга в процессе идентификации продукта (черные списки, списки террористов и т.д).

Потребуется доработка процесса продажи, изменение форм, добавление интеграций, новых ролей. Как следствие: изменение сроков и бюджета проекта. Как часто бывает — одно подразделение не может знать всех процессов других подразделений.
    
---
![Markdowm Image][3]{: class="block-left" style="width:360px"}

Наш Заказчик проводит встречи со всеми бизнес подразделениями, процесс становится максимально проработанным, но отсутствует архитектурное описание реализации функционала в бизнес системах. Заказчик описывает представление продуктового каталога, исполнитель реализовывает продуктовый каталог в своей системе (то есть в системе, которую он знает). В процессе пилота оказывается, что часть параметров должны быть настроены в АБС (основной учетной системе Банка), в противном случае будет отсутствовать возможность корректного начисления процентов. 

Что имеем – дополнительные расходы на синхронизацию систем (параметров кредитного продукта) или трудозатраты перенос ведения продуктового каталога в АБС. В первом случае увеличиваются операционные расходы на сопровождение продукта, во втором увеличение сроков и бюджета проекта.
    
---
![Markdowm Image][4]{: class="block-right" style="width:360px"}

Третий возможный случай – параллельные изменения в основных системах, инициированные другими подразделениями или изменений требований законодательства. Самый простой пример, добавление или изменение полей анкеты клиента, изменение их обязательности. 
    
---
    
### Поиск решения

Наша задача была выстроить эффективный процесс внедрения, для этого необходимо было вовлечь все бизнес подразделения в процесс управления изменениями, а также снизить конфликты за ресурс ИТ. Для этого мы стали смотреть в сторону гибких методологий, чтобы использовать их артефакты в улучшении внутренних процессов.

Первое – мы стали смотреть как происходит внедрение в аналогичных организациях. Но многие крупные организации внедряют гибкие процессы лишь формально – приходит руководитель к ИТ отделу и говорит: «Так, с сегодняшнего дня начальник отдела становится скрам мастером, проводим стендапы и рисует спринты». Данное изменение в корне ничего не меняет, кроме названий (руководители проводят краткосрочное планирование, совещания с подчиненными и т.д.). Иногда к обсуждению команды ИТ приглашают одного человека из бизнеса, но обсуждения на таких встречах носит сугубо технический характер, поэтому профита от этого не получается.

![Markdowm Image][5]{: style="width:780px" }

Мы предложили совсем другую модель, объединиться вокруг продуктов, включив в команду представителей от всех подразделений участвующих в процессах, связанных с данных продуктов(как продажа, так и обслуживание). Второе значимое нововведение – жизненный цикл банковского продукта начинается от лида и заканчивается в момент закрытия или перепродажи сделки. 

#### Этап 1 – Фиксация идеи, Подготовка CR, Предварительная оценка.
Любой участник команды описывает реализуемое изменение для предварительного анализа, используя для этого формат user-story, которое в итоге попадает в беклог бизнес-аналитика. Бизнес аналитик организовывает еженедельные встречи, где изменения обсуждаются с участием владельца продукта, аналитиков и других бизнес подразделений, участвующих в процессе. После этого этапа изменения попадают в беклог продукта.

#### Этап 2 – Установка приоритетов и планирование реализации
Планирование задач заключается в определении перечня задач из беклога, которые будут включены в ближайший спринт. За приоритезацию задач отвечает непосредственно владелец продукта, он же несет ответственность за экономическую целесообразность работ и качество реализованного продукта. Команда добивается успеха или совершает ошибки как единое целое.

#### Этап 3 – Разработка, тестирование, релиз.
Владелец продукта получает результат каждого спринта на тестирование и может влиять на дальнейший ход, например, корректировать перечень дальнейших работ. Все изменения продукта объединяются в релизы, которые состоят из нескольких спринтов длительностью 2-4 недели. 

![Markdowm Image][6]{: style="width:780px"}

### Заключение

Как завершение статьи, приведу пример команды из розничного бизнеса, за которой может быть закреплен наш вымышленный продукт — Кредитная карта:

Управление кредитных карт и эквайринга (Владелец продукта)

* Управление финансового мониторинга
* Управление контроля финансовых и операционных рисков
* Управление сопровождения банковских операций
* Управление информационных технологий
* Управление платежных систем

[1]: /assets/images/posts/2017-09-14/1.png
[2]: /assets/images/posts/2017-09-14/2.png
[3]: /assets/images/posts/2017-09-14/3.png
[4]: /assets/images/posts/2017-09-14/4.png
[5]: /assets/images/posts/2017-09-14/5.png
[6]: /assets/images/posts/2017-09-14/6.png
