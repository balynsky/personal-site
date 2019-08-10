---
title: "Построение каркаса приложения Altered Carbon Backup"
layout: post
date: 2018-08-01 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
- Spring cloud
category: blog
author: balynsky
description: Построение каркаса приложения Altered Carbon Backup
---

[Содержание серии статей #Про Spring Cloud][1]

В данной серии статей будем реализовывать базовое приложение с использованием
микросервисной архитектуры. Для этого будем использовать придуманную мной техническую схему:
![Markdowm Image][4]{: style="width:780px" }

Система имеет 2 основных компонента: BackupService (отвечает за бекап данных) и CleanupService (отвечает за 
периодическую подчистку устаревших версих для копий данных). 

На схеме присутствуют еще два вспомагательных сервиса: ClientInfo (получение данных по пользователю) и Storage 
(непосредственно сервис для хранения информации)

### Структура проекта
Создание структуры исходного кода проекта. Системой управления сборкой мы будем использовать Gradle, 
для которой мы создадим мультимодульный проект.

Пойдем по шагам:
1. Создадим директория проекта:
```
mkdir ac-backup
cd ac-backup
```

2. Создадим новый проект gradle
```
gradle init
```
Результатом выполнения команды будет следующая структура
```
.
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```
Как мы видим были созданы все необходимые файлы и директороии Gradle проекта. Детальнее прочитать 
про струтуру проекта можно на официальном [сайте][2] системы сборки Gradle. 
Остается только заменить содержимое файла build.gradle на 
```groovy
allprojects {
    repositories {
        jcenter() 
    }
}
```
3. Добавление модуля для аггрегации кода бекенд части проекта.
```
mkdir backend
cd backend
```
Создадим build.gradle, для группы наших бекенд проектов, в которую будут входить проекты
управления микросервисной архитектурой и бизнес сервисы. По аналогии создадим проекты frontend, infrastructure

Итоговая структура проекта:
```
.
├── backend
│   └── build.gradle
├── frontend
│   └── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── infrastructure
│   └── build.gradle
├── build.gradle
├── gradlew
├── gradlew.bat
└── settings.gradle
```

### Создание сервиса бекапа

Следующим шагом мы приступим к созданию основного сервиса для бекапа данных, его создадим по аналогии с другими
проектами в директории backend. Также не забываем добавлять проект в файл _settings.gradle_. Для сервиса выбрано имя
_backup-service_.

Теперь начнем разработку непосредственно самого сервиса. Для начала необходимо подключить зависимости для создания
проекта Spring Boot. Для этого в _build.gradle_ необходимо добавить:
```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${bootGradlePlugin}")
    }
}

apply plugin: 'java'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'

bootJar {
    baseName = 'gs-spring-boot'
}

dependencies {
    compile("org.springframework.boot:spring-boot-starter-web")
    testCompile("junit:junit")
}

```
Я рекомендую выносить управление версиями компонентов (если они будут встречаться в нескольких похожих проектов)
на уровень выше. В нашем случае я добавил в _build.gradle_ в каталоге backend:
```groovy
subprojects {
    // ... ... ...
    ext {
        bootGradlePlugin = '2.0.3.RELEASE'
    }
    // ... ... ...
}

```

Теперь создадим наш первый контроллер (заглушка для первого этапа) для бекапа сознания мафа. Первым шагом
будет объявление точки входа приложения, для этого создадим класс _BackupApplication_ в пакете
_com.balynsky.ac.backup_ со следующим содержимым:
```java
package com.balynsky.ac.backup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackupApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackupApplication.class, args);
	}
}

```
Вот так просто мы объявили наше Spring Boot приложение, теперь оно готово для старта и мы можем его запустить.
Но перед его запуском давайте добавим наш первый контроллер. Для этого создадим класс BackupController, 
который на первом этапе будет выводить в консоль параметр, пришедший в теле запроса и отправлять ответ.
```java
package com.balynsky.ac.backup.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BackupController {
	
	@PostMapping(path = "/backup-service/backup")
	public ResponseEntity backupSoul(String soul) {
		System.out.println("New Soul " + soul);
		return new ResponseEntity(HttpStatus.CREATED);
	}

}
```
Теперь нам остается запустить приложение и проверить работу нашего контроллера.
```
curl -i -X POST -d "soul=newSoul" http://localhost:8080/backup-service/backup
HTTP/1.1 201 
Content-Length: 0
Date: Sat, 25 Aug 2018 18:01:05 GMT
```
Как видим, наш сервис вернул 201 код, который мы задали в контроллере. 

P.S. Написание тестов для SpringBoot приложения я вынес в отдельную статью, поэтому для проверки работы сервиса 
используется CURL.

### Итоги:
На первом шаге мы создали базовую структуру проекта, подключили SpringBoot и написали наш первый контроллер.

Проект опубликован в [репозитории на GitHub][3] 

[1]: /spring-cloud-starter
[2]: https://gradle.org
[3]: https://github.com/balynsky/ac-backup/releases/tag/v1-20180801
[4]: /assets/images/posts/2018-08-01/1.jpg
