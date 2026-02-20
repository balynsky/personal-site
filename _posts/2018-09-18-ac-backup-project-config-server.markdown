---
title: "Project Configuration with Spring Cloud Config"
layout: post
date: 2018-09-18 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
- Spring cloud
category: blog
author: balynsky
sitemap: false
description: Project configuration with Spring Cloud Config
---

This article is part of the series on Spring Cloud [#About Spring Cloud][1].


### A Bit of Theory
The Spring Cloud Config project is designed for managing configurations in a cloud environment. It provides a centralized configuration store for applications that can easily scale horizontally. Configuration sources include the file system, Git, SVN, HashiCorp Vault, and JDBC Backend. Composite data sources can also be used. In this article, we'll be using the file system.

By default, Spring Cloud Config serves files matching the name of the requesting Spring application. It can also take into account active Spring profiles and the project's label property (the spring.cloud.config.label parameter in the project configuration).

> The application name is specified in the _spring.application.name_ parameter. Typically, projects use a single application name in this parameter. HOWEVER, there's no restriction on using multiple names — Spring Cloud Config Server can work with multiple names separated by commas (e.g., _spring.application.name = a,b,c_). This feature can be used to load configuration from multiple files simultaneously. The same applies to profiles (the _spring.profiles.active_ parameter).

The following file types can be used for application configuration: .properties, .yml, .yaml. The order of configuration resolution (in increasing priority) is:
* application.yml
* application-{profile}.yml
* {application.name}.yml
* {application.name}-{profile}.yml
* {label}/application.yml
* {label}/application-{profile}.yml
* {label}/{application.name}-{profile}.yml

Integrating Spring Cloud Config into any application can be divided into two main approaches: Config First Bootstrap or Discovery First Bootstrap. In the first case, initialization goes through the configuration management server, meaning the application needs to know where the Spring Cloud Config Server is located (the spring.cloud.config.url parameter, which defaults to http://config:8888) along with authentication credentials if applicable. In the second case, access to the Spring Cloud Config Server is done through Service Discovery, which has information about the configuration service location. This can be Eureka Service Discovery or HashiCorp Consul.
Spring Security can be used to protect Spring Cloud Config Server endpoints, so there are no limitations on the security mechanisms for the endpoints.

> In real-world scenarios, when starting a microservice infrastructure, the Spring Cloud Config Server might start after other services. Therefore, it's recommended to configure a retry mechanism for configuration requests in case the initial call fails. To do this, add the _spring-retry_ and _spring-boot-starter-aop_ dependencies and set the _spring.cloud.config.fail-fast=true_ parameter. Retry settings are configured under _spring.cloud.config.retry.*_

### Creating the Configuration Server

First, we need to create a new Gradle module in the _./backend_ directory named _config-server_.

Let's configure the _gradle.build_ file as follows. As a reminder, version variables (such as _bootGradlePlugin_ or _springCloudConfig_) are defined in the parent _build.gradle_ in the _./backend_ directory.

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

We also need to create a base _ConfigServerApplication.java_ class to launch the Spring Boot application. To create an embedded Config Server, add the _@EnableConfigServer_ annotation:

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

We also need to configure the application settings by specifying the "native" active profile, so that configuration lookup is performed in the file system (by default, a Git repository is used as the configuration source). To do this, create a _bootstrap.yml_ file in the _resources_ directory with the following content:

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
 > We set the _spring.cloud.config.bootstrap = true_ parameter so that the Config Server also initializes its own settings from the configuration store (in our case, the file system).

To specify where the configuration store is located, use the _spring.cloud.config.native.searchLocations_ parameter. If not set, the default locations are: classpath:/, classpath:/config/, file:./, file:./config/

In real-world projects, it's not recommended to embed configurations inside the application JAR, but for our test environment, we'll place the configurations in _classpath:/config/_. To do this, create a config directory in the _resources_ folder of the _config-server_ project, and create the following files:
* application.yml
* config-server.yml
* backup-service.yml
* storage-service.yml
* user-service.yml

When starting the project, we encounter the error _java.lang.IllegalStateException: You need to configure a uri for the git repository_ due to the enabled _bootstrap = true_ parameter, as described in this [Issue][4]. Therefore, we'll temporarily apply the workaround from that ticket (using the _composite_ profile) by modifying _bootstrap.yml_:

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

In the _config-server.yml_ settings file, we'll specify the port on which the service should start (the default is 8080):

```yaml
server:
  port: 8888
```

### Connecting to the Spring Config Server

Let's describe the connection to the configuration server for the storage-service project; the other projects are configured in the same way. We'll start by adding the required dependencies:

```groovy
dependencies {
    // ...
    compile("org.springframework.retry:spring-retry:${springRetry}")
    compile("org.springframework.boot:spring-boot-starter-aop")
    compile 'org.springframework.cloud:spring-cloud-starter-config'
    // ...
}
```
As mentioned earlier, the _spring-retry_ and _spring-boot-starter-aop_ dependencies are needed to provide a retry mechanism for configuration requests from the server in case the initial call returns an error (e.g., the server hasn't started yet).

Next, we move the contents of the _backup-service/.../resources/application.yml_ file to the _backup-service.yml_ file in the _config-server_ project. In its place, we need to create a _bootstrap.yml_ file specifying the connection details for the configuration server. Contents of _bootstrap.yml_:

```yaml
spring:
  cloud:
    config:
      fail-fast: true
      uri: http://localhost:8888
  application:
    name: backup-service
```

After starting the application, the logs will show entries for connecting to the configuration server and retrieving the configuration:

```
c.c.c.ConfigServicePropertySourceLocator : Fetching config from server at : http://localhost:8888
c.c.c.ConfigServicePropertySourceLocator : Located environment: name=backup-service, profiles=[default], label=null, version=null, state=null
b.c.PropertySourceBootstrapConfiguration : Located property source: CompositePropertySource {name='configService', propertySources=[MapPropertySource {name='classpath:/config/backup-service.yml'}]}
```

The remaining two applications — _storage-service_ and _user-service_ — are modified in the same way.

### Summary:

In this article, we taught our applications to retrieve configuration from an external source (Spring Config Server), resulting in the following project architecture:

![Markdowm Image][2]{: style="width:780px" }

The project is published in the [GitHub repository][3].

[1]: /spring-cloud-starter
[2]: /assets/images/posts/2018-09-18/1.jpg
[3]: https://github.com/balynsky/ac-backup/releases/tag/v3-20180918
[4]: https://github.com/spring-cloud/spring-cloud-config/issues/1060