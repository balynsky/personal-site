---
title: "Конфигурирование проекта. Использование Spring Cloud Config"
layout: post
date: 2018-09-18 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
- Spring cloud
category: blog
author: balynsky
description: Конфигурирование проекта. Использование Spring Cloud Config
---

Данная статья является частью статей об использование Spring Cloud [#Про Spring Cloud][1].


### Немного теории
Проект Spring Cloud Config предназначен для управления конфигурациями в облачном решении. Проект предлагает централизованное
хранилище конфигураций приложений, которое легко может масштабироваться горизонтально. В качестве источника 
конфигураций используется файловая система, GIT, SVN, Hashicorp Vault, JDBC Backend. Также можно использовать композитные источники данных.
В данной статье мы будем использовать файловую систему.

По умолчанию Spring Cloud Config отдает файлы, соответствующие имени запрашивающего Spring приложения. Также могут учитываться
активные Spring profiles и свойства label проекта (параметр spring.cloud.config.label в конфигурации проекта). 

> Имя приложения указывает в параметре _spring.application.name_. Как правило, в проектах указывается одно имя приложения в 
этом параметре. НО, запрета на использования нескольких имен для данного параметра нет и Spring Cloud Config Server
умеет работать с несколькими именами, записанными через запятую (например, _spring.application.name = a,b,c_). Данную 
возможность можно использовать для подгрузки конфигурации из нескольких файлов одновременно. Аналогично данное утверждение
применимо для профайлов (параметр _spring.profiles.active_)

Для конфигурирования приложения могут использоваться файлы: .properties, .yml, .yaml. Порядок формирования конфигурации
(по увеличению приоритета параметров):
* application.yml
* application-{profile}.yml
* {application.name}.yml
* {application.name}-{profile}.yml
* {label}/application.yml
* {label}/application-{profile}.yml
* {label}/{application.name}-{profile}.yml

Встраивание Spring Cloud Config в любое приложение можно разделить на два основных подхода: Config First Bootstrap или Discovery First Bootstrap.
В первом случае инициализация идет через сервер управления конфигурациями, таким образом приложению необходимо знать где расположен 
Spring Cloud Config Server (параметр spring.cloud.config.url, по умолчанию поиск идет по адресу http://config:8888) и данные 
для аутентификации, если они применяются. Во втором случае
доступ к Spring Cloud Config Server осуществляется через Service Discovery, который имеет данные о местоположении сервиса конфигурации. 
Им может выступать Eureka Service Discovery или Hashicorp Consul.
Для защиты точек доступа Spring Cloud Config Server может применяться Spring Security, поэтому мы не ограничены в механизме защиты точек доступа.

> В реальной жизни при старте микросервисной инфраструктуры Spring Cloud Config Server может быть запущен позже других сервисов, 
поэтому рекомендуется настроить механизм повтора запроса конфигурации в случае неуспешного первого обращения. Для этого 
необходимо подключить две зависимости _spring-retry_ и _spring-boot-starter-aop_ и установить параметр _spring.cloud.config.fail-fast=true_.
Настройки механизма повтора находятся в разделе _spring.cloud.config.retry.*_

### Создание сервера конфигурации

Первым шагом необходимо создать новый модуль в gradle в директории _./backend_ с именем _config-server_

Настроим содержимое файла _gradle.build_ следующим образом. Напоминаю, что переменные версий (такие как _bootGradlePlugin_ 
или _springCloudConfig_) вынесены в базовый _build.gradle_ в директории _./backend_

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

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-config:${springCloudConfig}"
    }
}
bootJar {
    baseName = 'ac-config-server'
}

dependencies {
    compile 'org.springframework.cloud:spring-cloud-config-server'
}
```

Также необходимо создать базовый класс _ConfigServerApplication.java_ для запуска Spring Boot приложения. Для создания 
встроенного (embedded) Config Server необходиом добавить аннотацию _@EnableConfigServer_

```java
package com.balynsky.ac.config.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(ConfigServerApplication.class, args);
	}
}
```

Так же необходимо настроить параметры приложение, указав активный профайд "native", чтобы поиск конфигурации осуществлялся
в файловой системе (по умолчанию источником конфигураций используется GIT репозиторий). Для этого в каталоге _resources_
необходимо создать файл _bootstrap.yml_ следующего содержимого:

```yaml
spring:
  cloud:
    config:
      server:
        bootstrap: true
  profiles:
    include: native
  application:
    name: config-server
```
 > Мы задали параметр _spring.cloud.config.bootstrap = true_, чтобы Config Server также инициировал свои
 настройки из конфигурационного хранилища (в нашем случае - файловой системе)

Чтобы указать где расположено конфигурационное хранилище, используется параметр _spring.cloud.config.native.searchLocations_. 
Если параметр не задан, поиск осуществляется в дефолтных: classpath:/, classpath:/config/, file:./, file:./config/

В реальных проектах не рекомендуется помещать конфигурации внутрь jar приложения, но для тестового стенда, в нашем случае
мы поместим конфигурации в _classpath:/config/_. Для этого в каталоге _resources_ проекта _config-server_ создадим 
каталог config, в котором создадим следующие файлы:
* application.yml
* config-server.yml
* backup-service.yml
* storage-service.yml
* user-service.yml

При запуске проекта мы имеем ошибку _java.lang.IllegalStateException: You need to configure a uri for the git repository_
из за включенного параметра _bootstrap = true_, 
которая описана в [Issue][4]. Поэтому временно применим обходное решение из данного тикета (используем профайл _composite_),
для этого изменим _bootstrap.yml_

```yaml
spring:
  cloud:
    config:
      server:
        composite:
            - type: native
        bootstrap: true
  profiles:
    include: composite
  application:
    name: config-server
```

В файле настройки _config-server.yml_ укажем порт, на котором должен запуститься сервис (по умолчанию идет запуск на 8080):

```yaml
server:
  port: 8888
```

### Подключение к Spring Config Server

Опишем подключение к конфигурационному серверу для проекта storage-service, остальные проекты подключаются аналогичным образом.
Само подключение конфигурации начнем с добавления необходимых зависимостей:

```groovy
dependencies {
    // ...
    compile("org.springframework.retry:spring-retry:${springRetry}")
    compile("org.springframework.boot:spring-boot-starter-aop")
    compile 'org.springframework.cloud:spring-cloud-starter-config'
    // ...
}
```
Как описывалось ранее зависимости _spring-retry_ и _spring-boot-starter-aop_ необходимы для обеспечения механизма
повтора запроса конфигурации с сервера, если при первом обращении была получена ошибка (например, сервер не был инициирован)

Следующий шаг, мы переносим содержимое файла _backup-service/.../resources/application.yml_ в файл _backup-service.yml_ 
в проекте _config-server_. Вместо него необходимо создать файл _bootstrap.yml_, в котором укажем данные для подключения
к конфигурационному серверу. Содержимое файла _bootstrap.yml_:

```yaml
spring:
  cloud:
    config:
      fail-fast: true
      uri: http://localhost:8888
  application:
    name: backup-service
```

После запуска приложения в логах можно увидеть записи подключения к конфигурационному серверу и получения 
конфигурации:

```
c.c.c.ConfigServicePropertySourceLocator : Fetching config from server at : http://localhost:8888
c.c.c.ConfigServicePropertySourceLocator : Located environment: name=backup-service, profiles=[default], label=null, version=null, state=null
b.c.PropertySourceBootstrapConfiguration : Located property source: CompositePropertySource {name='configService', propertySources=[MapPropertySource {name='classpath:/config/backup-service.yml'}]}
```

Аналогичным образом изменяем два оставшихся приложения: _storage-service_ и _user-service_. 

### Итоги:

В рамках этой статьи, мы научили наши приложения получать конфигурацию с внешнего источника (Spring Config Server),и 
у нас получилась следующая архитектура нашего проекта:

![Markdowm Image][2]{: style="width:780px" }

Проект опубликован в [репозитории на GitHub][3] 

[1]: /spring-cloud-starter
[2]: /assets/images/posts/2018-09-18/1.jpg
[3]: https://github.com/balynsky/ac-backup/releases/tag/v3-20180918
[4]: https://github.com/spring-cloud/spring-cloud-config/issues/1060
