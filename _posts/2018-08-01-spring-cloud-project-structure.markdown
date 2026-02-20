---
title: "Building the Altered Carbon Backup Application Skeleton"
layout: post
date: 2018-08-01 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- Spring boot
- Spring cloud
category: blog
author: balynsky
sitemap: false
description: Building the Altered Carbon Backup application skeleton
---

[Article series table of contents #About Spring Cloud][1]

In this series of articles, we'll be building a basic application using microservice architecture. To do this, we'll use the following technical diagram that I designed:
![Markdowm Image][4]{: style="width:780px" }

The system has 2 main components: BackupService (responsible for data backup) and CleanupService (responsible for periodically cleaning up outdated data copies).

The diagram also shows two auxiliary services: ClientInfo (retrieves user data) and Storage (the actual data storage service).

### Project Structure
Let's set up the source code structure. We'll use Gradle as our build management system, creating a multi-module project.

Let's go step by step:
1. Create the project directory:
```
mkdir ac-backup
cd ac-backup
```

2. Initialize a new Gradle project:
```
gradle init
```
Running this command will produce the following structure:
```
.
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```
As we can see, all the necessary Gradle project files and directories have been created. You can read more about the project structure on the official Gradle [website][2].
All that's left is to replace the contents of the build.gradle file with:
```groovy
allprojects {
    repositories {
        jcenter()
    }
}
```
3. Adding a module to aggregate the backend code.
```
mkdir backend
cd backend
```
Let's create a build.gradle for our group of backend projects, which will include both the microservice management projects and the business services. Similarly, we'll create frontend and infrastructure projects.

The final project structure:
```
.
├── backend
│   └── build.gradle
├── frontend
│   └── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── infrastructure
│   └── build.gradle
├── build.gradle
├── gradlew
├── gradlew.bat
└── settings.gradle
```

### Creating the Backup Service

Next, we'll create the main service for data backup, following the same approach as the other projects in the backend directory. Don't forget to add the project to the _settings.gradle_ file. The service is named _backup-service_.

Now let's start developing the service itself. First, we need to add the dependencies for creating a Spring Boot project. Add the following to _build.gradle_:
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
I recommend moving version management for components (if they appear in multiple similar projects) up one level. In our case, I added the following to _build.gradle_ in the backend directory:
```groovy
subprojects {
    // ... ... ...
    ext {
        bootGradlePlugin = '2.0.3.RELEASE'
    }
    // ... ... ...
}

```

Now let's create our first controller (a stub for the first stage) for backing up a meth's consciousness. The first step is to declare the application entry point. Create a _BackupApplication_ class in the _com.balynsky.ac.backup_ package with the following content:
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
Just like that, we've declared our Spring Boot application — it's now ready to start and we can run it. But before launching, let's add our first controller. Create the BackupController class, which at this stage will simply log the parameter from the request body to the console and send a response.
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
Now all that's left is to start the application and test our controller.
```
curl -i -X POST -d "soul=newSoul" http://localhost:8080/backup-service/backup
HTTP/1.1 201
Content-Length: 0
Date: Sat, 25 Aug 2018 18:01:05 GMT
```
As we can see, our service returned the 201 status code that we set in the controller.

P.S. Writing tests for a SpringBoot application is covered in a separate article, so here we're using CURL to verify the service.

### Summary:
In this first step, we created the basic project structure, added SpringBoot, and wrote our first controller.

The project is published in the [GitHub repository][3].

[1]: /spring-cloud-starter
[2]: https://gradle.org
[3]: https://github.com/balynsky/ac-backup/releases/tag/v1-20180801
[4]: /assets/images/posts/2018-08-01/1.jpg