---
title: "Spring Cloud для построения проекта с микросервисной архитектурой"
layout: post
date: 2018-06-01 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
category: blog
author: balynsky
description: Spring Cloud для построения проекта с микросервисной архитектурой
---

В данной серии статей будем реализовывать базовое приложение с использованием
микросервисной архитектуры

Статьи:

- [Построение каркаса приложения][3]
- [Написание рабочего прототипа Altered Carbon Backup без использования Spring Cloud][4]
- [Конфигурирование проекта. Использование Spring Cloud Config][5]
- [Feign, Ribbon для коммуникации между сервисами][6]
- Service Discovery, регистрация и обнаружение сервисов
- Мониторинг сервисов с помощью Boot admin 
- Hystrix
- Spring Security, OAuth 2.0
- Использование Terraform для управления инфраструктурой
- Использование контейниризации для проекта (проект Docker)
- Деплой приложений с использованием Ansible
- Api Gateway как единая точка входа

Для построения приложения будем решать следующую задачу: будем строить систему бекапа сознания мафов. 
Думаю все видели фильм _Видоизмененный углерод / Altered Carbon_, который и ляжет в основу 
нашего воображаемого проекта  :)


Почитать о самом сериале можно на следующем [ресурсе][2]
![Markdowm Image][1]


[1]: /assets/images/posts/2018-06-01/AlteredCarbon.jpg
[2]: https://meduza.io/feature/2018/02/11/vidoizmenennyy-uglerod-seks-nasilie-i-pogruzhenie-v-led
[3]: /spring-cloud-project-structure
[4]: /ac-backup-project-without-cloud
[5]: /ac-backup-project-config-server
[6]: /ac-backup-project-feign-ribbon
