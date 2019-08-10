---
title: "Feign, Ribbon для коммуникации между сервисами"
layout: post
date: 2018-10-16 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
- Spring cloud
category: blog
author: balynsky
description: Feign, Ribbon для коммуникации между сервисами
---

Данная статья является частью статей об использование Spring Cloud [#Про Spring Cloud][1].


### Немного теории
Feign - это декларативный HTTP клиент, разработанный компанией Netflix. Основным преиммуществом решения является то, что
разработчику необходимо только описать (декларировать и аннотировать) интерфейс, в то время как фактическая реализация 
будет создана во время выполнения. Feign поддерживает подключаемые аннотации, включая аннотации JAX-RS и Spring MVC 
(дополнительно к аннотациям самого Feign)

Ribbon также является детищем компании Netflix и отвечает за межпроцессную коммуникацию (Inter Process Communication - IPC).
Основная бизнес-задача Ribbon - это организация клиентских алгоритмов балансировки (client-side load balancing).
Дополнительные возможности, которые стоит отметить: интеграция с Service Discovery (из коробки есть поддержка Eureka),
поддержка паттерна Fault Tolerance (Ribbon понимает и динамически определяет состояние сервисов), поддержка правил балансировки
(по умолчанию используется алгоритм Round Robin).

Spring Cloud интегрирует в Feign Ribbon и Eureka для клиента микросервисной архитектуры с возможностями балансировки.

### Миграция на Feign в приложении AC Backup

Приведем пример миграции на основе клиента сервиса к user-service. 

Для начала в проекте _user-client_ подключим новые зависимости на Feign и Ribbon:

```groovy
dependencies {
    // ...
    compile "org.springframework.cloud:spring-cloud-starter-openfeign:2.0.2.RELEASE"
    // ...
}
```

Далее мы аннотируем интерфейс UserResource аннотациями Spring MVC, которые будут декларировать наш 
формат взаимодействия. Такой результат мы получаем:

```java
@RequestMapping(path = "/user-service")
public interface UserResource {
	@GetMapping(path = "/client/{id}")
	ResponseEntity<Client> getUserInfo(@PathVariable("id") Long id);
}
```

Следующий шаг, чтобы отдельно не описывать интерфейс Feign и реализацию в виде RestController, я рекомендую наследовать контроллер
от нашего интерфейса, в итоге у нас получается вот такая реализация контроллера:

```java
@RestController
public class UserController implements UserResource {

	private final ClientService clientService;

	public UserController(ClientService clientService) {
		this.clientService = clientService;
	}

	public ResponseEntity<Client> getUserInfo(@PathVariable("id") Long id) {
		Client result = clientService.getClientInfo(id);
		if (result == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(result, HttpStatus.OK);
		}
	}
}
```

И последний шаг для описания нашего интерфейса для взаимодействия с использованием Feign, необходимо добавить аннотации,
указывающие, что данный интерфейс будет использоваться для генерации клиента Feign:

```java
package com.balynsky.ac.user.clients;

import com.balynsky.ac.user.UserResource;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(value = "user", decode404 = true)
public interface UserClient extends UserResource {
}
```

В результате мы имеем полностью подготовленную библиотеку для создания клиента с помощью Feign.

> Я рекомендую выделять данную настройку в отдельный интерфейс, как показано в примере: во первых мы отделяем контекст для клиента Feign от 
интерфейса описывающего поведение, а во вторых мы можем дополнительно описывать конфигурацию Feign для данного клиента
внутри интерфейса (пример такой конфигурации будет в заключительной части данной статьи) 

> Обращаю внимание, что для возвращаемого параметра в интерфейсе мы используем ResponseEntity. Это решение выбрано сознательно,
для того, чтобы в последствии можно было получать и обрабатывать не только содержимое ответа, но и параметры из заголовков. Такие 
как HTTP код возврата ошибки

Последнее, что нам остается - это удалить "устаревшую" реализацию клиента сервиса, а именно класс _ClientResourceImpl.java_

### Настройка Ribbon для подключения к сервисам приложения

Для начала работы с использованием Ribbon в проект _backup-service_ мы добавляем зависимость для Ribbon:

```groovy
dependencies {
    // ...
    compile "org.springframework.cloud:spring-cloud-starter-netflix-ribbon:2.0.2.RELEASE"
    // ...
}
```

Далее, мы должны сконфигурировать Ribbon, указав ему, где непосредственно находится продюсер сервиса, для этого в файле
конфигурации _backup-service.yml_ необходимо добавить следующие настройки:

```yaml
user:  //Название сервиса из FeignClient
  ribbon: 
    eureka:
      enabled: false // отключаем использование ServiceGateway для данного клиента
    listOfServers: localhost:9081 // Сервер, где находится продюсер
```

Если бы мы не использовали Feign для генерации клиента, то использование Ribbon отдельно от Feign выглядело бы так:

```java
@RibbonClient(name = "user",configuration = RibbonConfiguration.class)
public class ServerLocationApp {

    @LoadBalanced
    @Bean
    RestTemplate getRestTemplate() {
        return new RestTemplate();
    }

    @Autowired
    RestTemplate restTemplate;

    public Client getUserInfo(Long id) {
        return this.restTemplate.getForObject("http://localhost:9081/user-service/client/" + id, Client.class);
    }
}
```

Где конфигурация может быть описана следующим файлом:

```java
public class RibbonConfiguration {

    @Autowired
    IClientConfig ribbonClientConfig;

    @Bean
    public IPing ribbonPing(IClientConfig config) {
        return new PingUrl();
    }
    
    @Bean
    public IRule ribbonRule(IClientConfig config) {
        return new WeightedResponseTimeRule();
    }
}
```

В конфигурации можно настроить следующие параметры:

* Rule – Описание правила балансировки нагрузки для приложения
* Ping – Механизм определения доступности сервиса
* ServerList – Список серверов для доступа к сервису. Может быть как статическим, так и динамическим.

В нашем примере, ServerList не был настроен (поэтому мы используем полный путь для RestTemplate), а для примера правило
балансировки выбрано WeightedResponseTimeRule, что означает для этого правила каждому серверу присваивается вес в соответствии 
с его средним временем отклика. Чем дольше время отклика, тем меньше веса он получит. Правило случайно выбирает сервер, 
где вероятность определяется весом сервера.

Детальнее прочитать о Ribbon можно [по ссылке][4]

### Возврат ошибок (ResponseEntity vs Exception)

В начале статьи мы рассмотрели один из способов, через который можно возвращать ошибку потребителю сервиса, а именно 
с использование ResponseEntity. Данный класс является обверткой над стандартным ответом и позволяет получить HTTP код ответа.

Вторым, не менее популярным способом, является передача ошибки через Exceptions. Таким образом продюсер сервиса генерирует
исключение, которое в дальнейшем сереализуется и отправляется клиенту отдельной моделью. Для сериализации exceptions есть
несколько вариантов, которые описаны по [ссылке][5]. 

Для нашего примера мы будем использовать RestControllerAdvice, для глобального отслеживания исключений. 

Для начала добавим новый проект _feign-error-decoder_ к нашему приложению, куда выделим классы, отвечающие за обработку данных исключений.  

Для начала нам понадобится базовая модель исключения _ServiceException_, от которой будут наследовать все остальные исключения. 

```java
@Data
@JsonIgnoreProperties(value = {"stackTrace", "localizedMessage", "suppressed", "cause"})
public abstract class ServiceException extends Exception {
	@NonNull
	private final String errorCode;

	public ServiceException(String message, String errorCode) {
		super(message);
		this.errorCode = errorCode;
	}

	public ServiceException(String message, Throwable cause, String errorCode) {
		super(message, cause);
		this.errorCode = errorCode;
	}

}
```

Далее нам понадобится создать класс, который будет обрабатывать ошибки для Feign клиента и генерировать непосредственно 
сами сообщения на клиенте. Для этого нам мы используем решение, которое детально описано [по ссылке][3]. Для нас наибольшую
ценность представляет класс _FeignServiceExceptionErrorDecoder_.

Необходимые классы мы размещаем в проекте _feign-error-decoder_.

Дополнительно нам понадобится ControllerAdvice, который на сервере будет отвечать за правильную сериализацию исключения,
его код представлен ниже:

```java
@RestControllerAdvice
public class ServiceExceptionHandlerAdvice {

	@ExceptionHandler({ServiceException.class})
	ResponseEntity<ServiceException> handle(ServiceException exception) {
		ResponseStatus status = exception.getClass().getAnnotation(ResponseStatus.class);
		return new ResponseEntity<ServiceException>(exception, status == null ? HttpStatus.BAD_REQUEST : status.code());
	}

}
```

Чтобы научить клиента Feign использовать данный класс, необходимо прописать FeignServiceExceptionErrorDecoder как обработчик
ошибок. Для этого мы модифицируем _StorageClient_ следующим образом:

```java
@FeignClient(value = "storage", configuration = StorageClient.StorageClientConfiguration.class)
public interface StorageClient extends StorageResource {
	class StorageClientConfiguration {
		@Bean
		public ErrorDecoder provideErrorDecoder() throws Exception {
			return new FeignServiceExceptionErrorDecoder(StorageClient.class);
		}
	}
}
```

Как мы видим, в аннотации мы добавили класс для конфигурирования клиента. В рамках данного класса мы создаем необходимый нам
ErrorDecoder.

> В некоторых примерах конфигурацию Feign (в нашем примере StorageClientConfiguration) помечена аннотацией спринга @Configuration.
Данная конфигурация не является обязательной, согласно официальной документации. Но может привести к side-effect, когда один ErrorDecoder
будет применен для всех клиентов Feign. Для некоторых случаев это оправдано, но наш случай требуется отдельного ErrorDecoder для каждого
интерфейса.

Теперь можно приступить к созданию первого исключения _BadRequestException_:
```java
@EqualsAndHashCode(callSuper = true)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends ServiceException implements Serializable {
	public BadRequestException(final String message) {
		super(message, "BAD_REQUEST_EXCEPTION");
	}

}
```

а декларация сервиса сервиса соответственно будет выглядеть так:

```java
@RequestMapping(value = "/storage-service")
public interface StorageResource {

	@RequestMapping(value = "storage", method = RequestMethod.POST)
	SoulEntity saveSoul(@RequestBody SoulEntity soul) throws BadRequestException;
}

```

Теперь у нас возможно возврат ошибки через механизм исключений. Это позволяет клиенту сервиса ловить данные исключения и 
обрабатывать, будто бы мы используем обычное написание кода на java. 

### Использование клиентов Feign в приложении _backup-service_

Для начала использования клиентов Feign необходимо использовать аннотацию, которая включает данный функционал, а на вход
ей передать список пакетов, в которых находятся клиенты Feign (только для нашего случая). Для этого создадим класс 
_FeignRibbonConfig_ в пакете config:

```java
@Configuration
@EnableFeignClients(basePackages = {"com.balynsky.ac.storage.clients", "com.balynsky.ac.user.clients"})
public class FeignRibbonConfig {
}
```

Далее для использования в нашем сервисе _BackupServiceImpl_ необходимо заменить типы входных параметров. А именно: UserResource 
заменить на UserClient, а StorageResource на StorageClient

Давайте используем RestClient из IntellijIdea 

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
Date: Tue, 04 Dec 2018 14:52:05 GMT

{
  "id": 2,
  "clientId": 1,
  "body": "body"
}

Response code: 201; Time: 298ms; Content length: 35 bytes
```

### Итоги:

В рамках этой статьи, мы научили наше приложение коммуницировать между разными микросервисами используя Feign и Ribbon.

Проект опубликован в [репозитории на GitHub][2] 

[1]: /spring-cloud-starter
[2]: https://github.com/balynsky/ac-backup/releases/tag/v4-20181016
[3]: https://source.coveo.com/2016/02/19/microservices-and-exception-handling/
[4]: https://github.com/Netflix/ribbon
[5]: https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc
