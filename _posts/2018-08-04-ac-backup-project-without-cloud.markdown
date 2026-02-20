---
title: "Building a Working Prototype of Altered Carbon Backup Without Spring Cloud"
layout: post
date: 2018-08-04 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
category: blog
author: balynsky
sitemap: false
description: Building a working prototype of Altered Carbon Backup without Spring Cloud
---

[Article series table of contents #About Spring Cloud][1]

In this series of articles, we'll be building a basic application without using microservice architecture. To do this, we'll use the following technical diagram that I designed:
![Markdowm Image][2]{: style="width:780px" }

### Source Code Structure
In my experience, the projects I've worked on followed the principle of dividing any service into 3 parts:
* Data model
* Service client
* Service implementation

This way, to work with a service's data models, you simply include the model project, and to call the service, you include the service client project.

>An alternative approach I've seen in other projects is duplicating the model and client code in each consuming service. This duplication involves implementing only those client methods and model fields that the particular service needs. Since this significantly increases the operational cost of maintaining the solution, I don't consider this approach optimal.

Let's look at the example of the Storage service implementation. We created several projects to separate the parts described above:
* storage-model
* storage-client
* storage-service

#### Data Model
Let's start with the data model (the storage-model project). The service data model consists of a single class called SoulEntity, which describes the entity we plan to back up.

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

To reduce boilerplate code, we use Lombok. You can read more about it [here][4]. The documentation covers all the annotations used in the project.

#### Service Client

For writing the client, we'll use the RestTemplate class provided by the Spring framework. Let's start by defining the client interface:

```java
package com.balynsky.ac.storage;

public interface StorageResource {
	 SoulEntity saveSoul(SoulEntity soul);
}
```
The interface contains a single method that saves the received object and returns its persisted version.

Next, let's write the implementation:
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
The client accepts a RestTemplate and a server URL in its constructor. The method itself calls the REST controller endpoint.

#### Service Implementation

Let's start with the application configuration file (_application.yml_):
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

As you can see from the configuration, we're using an in-memory database — H2 — for data storage. We also set the port on which our server will run and enable the H2 console for convenient data access.

To initialize the database, we created _schema.sql_ and _data.sql_ files in the resources folder. The first file automatically creates the database structure, and the second populates it with initial data. You can learn more about this mechanism [here][5].

The actual data source creation and registration in the context is handled by the DatabaseConfig class:

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

The application layer diagram is shown in the image below:
![Markdowm Image][6]{: style="height:380px" }

The entry point is the controller, whose implementation is shown below:
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
In the implementation, we call the service, which returns the persisted entity or null if the save operation failed. Accordingly, our controller returns either HTTP 201 (Created) or HTTP 400 (Bad Request).

The service and repository implementations for data access can be found in the GitHub repository.

Let's demonstrate how the Storage service is called from our main BackupService (refer to the diagram). To do this, we'll add the resource address to the application configuration file _application.yml_:
```yaml
resource:
  storage: http://localhost:9082
```

Then we'll create a configuration for declaring service clients (the RestServiceConfig class), where we'll create a client for the Storage service:

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

From here, we can inject the resource using the @Autowired annotation.

### Testing the Project
To test our service, we'll use the built-in RestClient in IntelliJ IDEA.

Request:
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
Response:
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

As we can see, we received HTTP 201 (Created) and the newly created entity in the database with ID 3.

### Summary:
In this step, we created a project prototype without using Spring Cloud. Experienced readers may notice a significant number of architectural and coding shortcomings. However, these were made intentionally, as the project will be integrated with Spring Cloud in future articles, and most of these issues will be addressed. Later articles will demonstrate which tools and approaches are used to resolve them.

The project is published in the [GitHub repository][3].

[1]: /spring-cloud-starter
[2]: /assets/images/posts/2018-08-01/1.jpg
[3]: https://github.com/balynsky/ac-backup/releases/tag/v2-20180804
[4]: https://projectlombok.org
[5]: https://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html#howto-initialize-a-database-using-spring-jdbc
[6]: /assets/images/posts/2018-08-04/1.jpg