---
title: "Feign and Ribbon for Inter-Service Communication"
layout: post
date: 2018-10-16 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
- Spring cloud
category: blog
author: balynsky
sitemap: false
description: Feign and Ribbon for inter-service communication
---

This article is part of the series on Spring Cloud [#About Spring Cloud][1].


### A Bit of Theory
Feign is a declarative HTTP client developed by Netflix. Its main advantage is that the developer only needs to describe (declare and annotate) the interface, while the actual implementation is generated at runtime. Feign supports pluggable annotations, including JAX-RS and Spring MVC annotations (in addition to Feign's own annotations).

Ribbon is also a Netflix creation and is responsible for Inter-Process Communication (IPC). Ribbon's primary business purpose is to provide client-side load balancing algorithms. Additional features worth mentioning include: integration with Service Discovery (out-of-the-box support for Eureka), support for the Fault Tolerance pattern (Ribbon understands and dynamically determines service health), and support for balancing rules (Round Robin is used by default).

Spring Cloud integrates Feign with Ribbon and Eureka to provide a microservice architecture client with load balancing capabilities.

### Migrating to Feign in the AC Backup Application

Let's walk through the migration using the user-service client as an example.

First, in the _user-client_ project, we'll add the new Feign and Ribbon dependencies:

```groovy
dependencies {
    // ...
    compile "org.springframework.cloud:spring-cloud-starter-openfeign:2.0.2.RELEASE"
    // ...
}
```

Next, we annotate the UserResource interface with Spring MVC annotations to declare our communication contract. Here's the result:

```java
@RequestMapping(path = "/user-service")
public interface UserResource {
	@GetMapping(path = "/client/{id}")
	ResponseEntity<Client> getUserInfo(@PathVariable("id") Long id);
}
```

The next step is to avoid separately defining the Feign interface and the RestController implementation. I recommend having the controller inherit from our interface. This gives us the following controller implementation:

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

The final step for setting up our interface for Feign-based communication is to add annotations indicating that this interface will be used to generate a Feign client:

```java
package com.balynsky.ac.user.clients;

import com.balynsky.ac.user.UserResource;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(value = "user", decode404 = true)
public interface UserClient extends UserResource {
}
```

As a result, we have a fully prepared library for creating a client using Feign.

> I recommend extracting this configuration into a separate interface, as shown in the example: first, it separates the Feign client context from the interface describing the behavior, and second, it allows us to additionally describe the Feign configuration for this client inside the interface (an example of such configuration will be shown in the final part of this article).

> Note that we're using ResponseEntity as the return type in the interface. This is a deliberate choice — it allows us to retrieve and process not only the response body but also header parameters, such as the HTTP error status code.

Finally, all that's left is to remove the "deprecated" service client implementation, namely the _ClientResourceImpl.java_ class.

### Configuring Ribbon for Connecting to Application Services

To start using Ribbon in the _backup-service_ project, we add the Ribbon dependency:

```groovy
dependencies {
    // ...
    compile "org.springframework.cloud:spring-cloud-starter-netflix-ribbon:2.0.2.RELEASE"
    // ...
}
```

Next, we need to configure Ribbon by specifying where the service producer is located. Add the following settings to the _backup-service.yml_ configuration file:

```yaml
user:  //Service name from FeignClient
  ribbon:
    eureka:
      enabled: false // Disable ServiceGateway usage for this client
    listOfServers: localhost:9081 // Server where the producer is located
```

If we weren't using Feign for client generation, using Ribbon separately from Feign would look like this:

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

Where the configuration can be described as follows:

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

The following parameters can be configured:

* Rule — Describes the load balancing rule for the application
* Ping — The mechanism for determining service availability
* ServerList — The list of servers for accessing the service. Can be either static or dynamic.

In our example, ServerList was not configured (which is why we use the full URL for RestTemplate), and the balancing rule is set to WeightedResponseTimeRule. This means each server is assigned a weight based on its average response time. The longer the response time, the less weight it receives. The rule randomly selects a server, where the probability is determined by the server's weight.

You can read more about Ribbon [here][4].

### Error Handling (ResponseEntity vs. Exceptions)

Earlier in this article, we looked at one way to return errors to the service consumer — using ResponseEntity. This class is a wrapper around the standard response and allows you to retrieve the HTTP response code.

A second, equally popular approach is to propagate errors through Exceptions. In this case, the service producer throws an exception, which is then serialized and sent to the client as a separate model. There are several options for serializing exceptions, described [here][5].

For our example, we'll use RestControllerAdvice for global exception handling.

Let's start by adding a new project called _feign-error-decoder_ to our application, where we'll extract the classes responsible for handling these exceptions.

First, we need a base exception model _ServiceException_, from which all other exceptions will inherit.

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

Next, we need to create a class that handles errors on the Feign client side and generates the actual messages on the client. For this, we'll use the solution described in detail [here][3]. The _FeignServiceExceptionErrorDecoder_ class is of greatest interest to us.

We'll place the necessary classes in the _feign-error-decoder_ project.

Additionally, we need a ControllerAdvice on the server side that handles proper exception serialization. Here's its code:

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

To teach the Feign client to use this class, we need to register FeignServiceExceptionErrorDecoder as the error handler. To do this, we modify _StorageClient_ as follows:

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

As you can see, we added a configuration class in the annotation. Within this class, we create the ErrorDecoder we need.

> In some examples, the Feign configuration (in our case StorageClientConfiguration) is annotated with Spring's @Configuration annotation. According to the official documentation, this annotation is not required. However, it can lead to a side effect where one ErrorDecoder is applied to all Feign clients. In some cases this is acceptable, but our case requires a separate ErrorDecoder for each interface.

Now we can create our first exception, _BadRequestException_:
```java
@EqualsAndHashCode(callSuper = true)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends ServiceException implements Serializable {
	public BadRequestException(final String message) {
		super(message, "BAD_REQUEST_EXCEPTION");
	}

}
```

And the service interface declaration will look like this:

```java
@RequestMapping(value = "/storage-service")
public interface StorageResource {

	@RequestMapping(value = "storage", method = RequestMethod.POST)
	SoulEntity saveSoul(@RequestBody SoulEntity soul) throws BadRequestException;
}

```

Now errors can be returned through the exception mechanism. This allows the service consumer to catch these exceptions and handle them as if they were writing regular Java code.

### Using Feign Clients in the _backup-service_ Application

To start using Feign clients, we need the annotation that enables this functionality. We pass it a list of packages containing the Feign clients (specific to our case). To do this, create the _FeignRibbonConfig_ class in the config package:

```java
@Configuration
@EnableFeignClients(basePackages = {"com.balynsky.ac.storage.clients", "com.balynsky.ac.user.clients"})
public class FeignRibbonConfig {
}
```

Next, in our _BackupServiceImpl_, we need to replace the input parameter types: change UserResource to UserClient, and StorageResource to StorageClient.

Let's test it using IntelliJ IDEA's RestClient.

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
Date: Tue, 04 Dec 2018 14:52:05 GMT

{
  "id": 2,
  "clientId": 1,
  "body": "body"
}

Response code: 201; Time: 298ms; Content length: 35 bytes
```

### Summary:

In this article, we taught our application to communicate between different microservices using Feign and Ribbon.

The project is published in the [GitHub repository][2].

[1]: /spring-cloud-starter
[2]: https://github.com/balynsky/ac-backup/releases/tag/v4-20181016
[3]: https://source.coveo.com/2016/02/19/microservices-and-exception-handling/
[4]: https://github.com/Netflix/ribbon
[5]: https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc