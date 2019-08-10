---
title: "Написание рабочего прототипа Altered Carbon Backup без использования Spring Cloud"
layout: post
date: 2018-08-04 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
category: blog
author: balynsky
description: Написание рабочего прототипа Altered Carbon Backup без использования Spring Cloud
---

[Содержание серии статей #Про Spring Cloud][1]

В данной серии статей будем реализовывать базовое приложение без использования
микросервисной архитектуры. Для этого будем использовать придуманную мной техническую схему:
![Markdowm Image][2]{: style="width:780px" }

### Структура исходного кода
В моей практике, в проектах, в которых я участвовал, использовался принцип разделения любого сервиса на 3 части:
* Модель данных
* Клиент для вызова сервиса 
* Реализация сервиса

Таким образом для работы с моделями данных сервиса достаточно подключить проект с моделями, а для вызова сервиса -
проект с клиентом сервиса. 

>Альтернативой данному подходу, который я встречал в других проектах, является дублирование
кода модели и клиента в каждом сервисе потребителе. При этом дублирование подразумевает реализацию только тех методов клиента 
и полей модели, которые необходимы данному сервису. Так как это сильно увеличивает операцинные расходы на сопровождение
данного решения, я не считаю этот подход оптимальным.

Рассмотрим на примере реализации сервиса Storage: для него были созданы несколько проектов для разделения на 
описанные ранее части:
* storage-model
* storage-client
* storage-service

#### Модель данных
Начнем описание с модели данных (проект storage-model). Модель данных сервиса состоит из одного класса SoulEntity, который описывает
сущность, которую мы планируем бекапить.

```java
package com.balynsky.ac.storage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SoulEntity implements Serializable {
	private Long id;
	private Long clientId;
	private String body;
}
```

Для сокращения написания кода используется lombok, почитать о нем подробнее можно по [ссылке][4]. В документации можно
ознакомиться с используемыми в проекте аннотациями.

#### Клиент сервиса

Для написание клиента мы будем использовать класс RestTemplate, предоставляемый фреймворком Spring. Для начала опишем 
интерфейс для описания клиента:

```java
package com.balynsky.ac.storage;

public interface StorageResource {
	 SoulEntity saveSoul(SoulEntity soul);
}
```
Интерфейс содержит единственный метод, который сохраняет получаемый объект и возвращает его сохраненную версию.

Следующим шагом опишем его реализацию:
```java
package com.balynsky.ac.storage.impl;

import com.balynsky.ac.storage.SoulEntity;
import com.balynsky.ac.storage.StorageResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class StorageResourceImpl implements StorageResource {

	private final RestTemplate template;
	private final String baseUrl;

	public StorageResourceImpl(RestTemplate template, String baseUrl) {
		this.template = template;
		this.baseUrl = baseUrl;
	}

	@Override
	public SoulEntity saveSoul(SoulEntity soul) {
		String userResourceUrl = baseUrl + "/storage-service/storage";
		ResponseEntity<SoulEntity> response = template.postForEntity(userResourceUrl, soul, SoulEntity.class);
		if (response.getStatusCode() != HttpStatus.CREATED) {
			return null;
		}
		return response.getBody();

	}
}
```
Клиент в конструкторе принимает RestTemplate и Url сервера, где расположен сервис. Непосредственно в методе идет вызов 
метода Rest контроллера.

#### Реализация сервиса

Начнем с описание конфигурационного файла проекта (_application.yml_)
```yaml
spring:
  h2:
    console:
      enabled: true

meth-storage:
  datasource:
    jdbcUrl: jdbc:h2:mem:souldb
    driverClassName: org.h2.Driver
    username: sa
    password:

server:
  port: 9082
```

Как видим из конфигурации, для хранения данных будем использовать in-memory DB - H2. Также мы задаем порт, на котором
будет запущен наш сервер и активируем консоль H2 для удобства доступа к данным. 

Для инициализации БД в папке resources были созданы файлы _schema.sql_ и _data.sql_. Первый файл автоматически создает
структуру БД, второй заполняет ее первоначальными данными. Подробнее об этом механизме можно почитать по [ссылке][5]

Непосредственно создание источника данных и регистрация его в контексте выполняется в классе DatabaseConfig:

```java
package com.balynsky.ac.storage.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

	@Bean
	@ConfigurationProperties("meth-storage.datasource")
	public DataSource dataSource() {
		return DataSourceBuilder.create().build();
	}
}
```

Схема прикладных уровней приложения описана на картинке ниже:  
![Markdowm Image][6]{: style="height:380px" }

Точкой входа является контроллер, реализация которого описана ниже:
```java
package com.balynsky.ac.storage.controller;

import com.balynsky.ac.storage.SoulEntity;
import com.balynsky.ac.storage.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/storage-service")
public class StorageController {
	private final StorageService storageService;

	@Autowired
	public StorageController(StorageService storageService) {
		this.storageService = storageService;
	}

	@PostMapping(path = "/storage")
	public ResponseEntity<SoulEntity> saveSoul(@RequestBody SoulEntity entity) {
		final SoulEntity soulEntity = storageService.saveSoul(entity);
		return soulEntity == null
				? new ResponseEntity<>(HttpStatus.BAD_REQUEST)
				: new ResponseEntity<>(soulEntity, HttpStatus.CREATED);
	}

}
```
В реализации мы вызывем сервис, который возвращает нам сохраненную сущность или null если не произошло сохранение. 
Соответвенно наш контроллер возвращает или 201 HTTP Code (Created) или 400 (Bad Request) соответственно.

Реализацию сервиса и репозитория для доступа к данным можно посмотреть в Github репозитории.

Покажем как осуществляется вызов сервиса Storage в нашем основном сервисе BackupService (см. схему). Для этого в 
файле настройки приложения _application.yml_ добавим адрес ресурса:
```yaml
resource:
  storage: http://localhost:9082
```

И создадим конфигурацию для объявления клиентов сервиса (класс RestSeviceConfig), в которой создадим клиент для 
сервиса Storage

```java
package com.balynsky.ac.backup.config;

import com.balynsky.ac.storage.StorageResource;
import com.balynsky.ac.storage.impl.StorageResourceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestSeviceConfig {

	@Value("${resource.storage}")
	private String storageResource;

	@Bean
	public StorageResource provideStorageResource() {
		return new StorageResourceImpl(new RestTemplate(), storageResource);
	}
}
```

Соответственно далее мы можем выполнить inject c использванием аннотации @Autowired.

### Проверка работы проекта
Для проверки работы нашего сервиса мы используем RestClient, встроенный в IntellijIdea

Запрос:
```
POST http://localhost:9080/backup-service/backup
Accept: */*
Content-Type: application/json
Cache-Control: no-cache

{
  "clientId": 1,
  "body": "body"
}
```
Ответ:
```
POST http://localhost:9080/backup-service/backup

HTTP/1.1 201 
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
Date: Tue, 18 Sep 2018 16:11:06 GMT

{
  "id": 3,
  "clientId": 1,
  "body": "body"
}

Response code: 201; Time: 68ms; Content length: 35 bytes
```

Как видим, мы получили 201 HTTP code (Created) и созданную сущность в БД с идентификатором 3.

### Итоги:
На этом шаге мы создали прототип проекта без использования Spring Cloud. Опытный читатель может заметить значительное 
количество архитектурных и программных просчетов. Но данные моменты сделаны специально, так как в дальнейшем данный проект
будет интегрирован с Spring Cloud и большинство данных проблем будет решено. В более поздних статьях будет показано за счет каких 
инструментов и подходов они решаются.

Проект опубликован в [репозитории на GitHub][3] 

[1]: /spring-cloud-starter
[2]: /assets/images/posts/2018-08-01/1.jpg
[3]: https://github.com/balynsky/ac-backup/releases/tag/v2-20180804
[4]: https://projectlombok.org
[5]: https://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html#howto-initialize-a-database-using-spring-jdbc
[6]: /assets/images/posts/2018-08-04/1.jpg
