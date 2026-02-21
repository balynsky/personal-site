---
title: “Automating IT Service Operations”
layout: post
date: 2016-09-20 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- IT
- Management
- ITIL
category: blog
author: balynsky
sitemap: false
description: Automating IT service operations in a Bank
---
#### Introduction
I'd like to share my experience in organizing the work of a Bank's IT department. This article won't be loaded with descriptions of the bureaucratic processes I had to navigate to achieve the goal, and I hope my experience will be useful to you.

It all started when, in early 2016, I was invited to work at a small Ukrainian Bank as an Information Systems (IS) architect. One of the tasks inherited from the previous team was to organize the IT department's operations according to a service-resource model. While this task was clearly outside the scope of IS architecture, it became a personal challenge for me.

Key factors that contributed to the success of this initiative:

- Executive sponsorship (at the Bank's board level);
- Desire to modernize the IT department (from both business users and IT staff);
- Personal experience working within this management model at previous positions.

All activities carried out as part of this process were roughly divided into several stages:

![Markdowm Image][1]{: style=”width:780px”}

#### Stage 1. Reviewing Regulatory Documentation

The first stage was studying the existing IT department operating model, starting with the Bank's regulatory documents.

Key regulatory documents registered in the electronic document management system (EDMS) governing IT department operations:

- Procedure for submitting tasks for existing software modification and business process automation
- Procedure for analyzing software modification and business process automation requests
- Software modification procedure
- Software development procedure
- Software testing procedure
- Centralized product and service configuration procedure
- Corporate network time synchronization procedure
- Project management procedure
- Internal user request handling procedure

There were also about two dozen other policies, some of which were not even related to IT operations, yet the IT department was listed as the owner of those policies.

After reviewing the documents, the IT department's operations (had they fully followed these processes) resembled a kind of patchwork. The processes governed by these documents were pushing the IT department away from the business, reducing overall organizational efficiency (in my opinion).

#### Stage 2. Assessing the Current State of the IT Department

For the second stage, I planned to create a snapshot of a typical workday for IT department employees. I selected several employees from the three main areas (Development, Support, Infrastructure). After a series of meetings with the control group (interviews) and preparation (training, briefing) for the “photographing” process, observation forms were prepared reflecting the chosen time expenditure classification, and data collection began.

Goals set for this exercise:

- Determining the structure of working time
- Identifying time losses in work processes
- Identifying reasons for non-compliance with standards

Throughout the selected period, the control group documented their activities. After the process ended, a timeout was taken to analyze the results.

Key findings from the analysis:

- Multiple channels for incoming tasks (email, phone calls, SMS, Viber, etc.)
- 80% of tasks arrive ad hoc
- Task priorities constantly change
- Managers have no ability to plan work
- No coherent approach to information systems development
- No “established rules of the game” for implementing changes

As a result, service delivery was significantly lagging behind business needs.

#### Stage 3. Classifying IT Requests

The next stage was building the IT department's service model. An interaction model between business units and the IT department was established based on request types, using a classic approach (resolving incidents and problems as quickly as possible to minimize business downtime).

All requests coming to IT were classified into 3 main types:

- Change Request (CR, RfC)
- Incident (including “Problem” type)
- Service Request (SR, RfS)

Service Requests (SR) were further divided into several sub-types: Standard SR, Non-standard SR, and Information Request.

The visual representation of this scheme:

![Markdowm Image][2]{: style=”width:780px” }

The division into support tiers was already organized and functioning in the existing process, which greatly facilitated the transition to the new management model. In the existing model, Tier 1 and Tier 3 support were outsourced services. No changes to this IT department strategy were planned in the near term.

Thus, there were 3 sources of requests to the Bank's IT department:

- Tier 1 support (Primary requests: incidents, consultations, problems)
- Business users (Primary requests: IT services, consultations, software functionality changes)
- Tier 3 support (Primary requests: configuration changes, consultations)

Additionally, during this stage, an IT service catalog was created, SLAs for service delivery were established through expert assessment, and service descriptions were prepared for SLA agreements with the business.

#### Stage 4. Building the Service Model and Preparing Regulatory Documentation

Returning to the existing documents, the decision was made to completely revoke them. The new documents were based on a “homegrown ITIL.” From the existing regulatory documents, only the project management document was planned to be retained.

The image below visualizes the expected state of the IT department and the processes governing its operations.

![Markdowm Image][3]{: style=”width:780px” }

Document preparation took approximately one month. A great deal of attention was paid to the change management process, as the goal was to optimize Time-To-Market, while the classic process (part of ITIL) was significantly slowing down this metric. Elements of Scrum were incorporated into the change management process.

#### Stage 5. Selecting a ServiceDesk Automation Tool

After classifying all possible request types and formalizing processes, the task of automating operations and implementing a ServiceDesk system arose.

The ServiceDesk was expected to fulfill the following functions:

- Single point of entry for Bank users
- Request completion time tracking
- Clear request prioritization capability
- Knowledge base
- IT infrastructure change management and control
- Reporting

The selection was made between several solutions: Atlassian Jira (positive experience outside the Bank), HP Service Manager (contractor recommendations), and IBM Control Desk (solution from a strategic partner).

For the pilot, Atlassian was chosen (trial version), with key factors being speed of implementation and Scrum methodology support (I may cover in a future article which parts of the methodology were adopted for change management and what positive effects were achieved as a result).

#### Stage 6. Implementing the New IT Service Model

Once all preparations were complete, I moved on to the practical side, including ServiceDesk system customization. The following tasks needed to be completed:

- Setting up projects, request types, field configuration, business process descriptions (workflows)
- Configuring the service catalog and SLA counters
- Defining and configuring the role model
- Populating the CMDB (Configuration Management Database)
- Preparing user training materials

We won't dive into the details of this work, as the volume alone could fill a separate article. However, I'd like to highlight the CMDB construction specifically. Since relationships are built between CIs (Configuration Items), after building the logical CMDB structure, the following picture emerged:

![Markdowm Image][4]{: style=”width:780px” }

The next step was forming a pilot group from the business side, whose requests would be the first to transition to the new interaction model. Several rounds of IT department training were conducted, with the pilot group of Bank business users participating in some sessions.

The system was then launched in pilot mode, all aspects were tested, and additional configurations were made to automate the system (workflows, custom fields, directories, and screens were fine-tuned).

After the pilot was completed, the decision was made to implement the solution and transition to production operations. Communication was sent to all Bank departments, the initial service catalog was configured, and a transition period was established for accepting requests through legacy channels.

Another important aspect of the ServiceDesk implementation was configuring the “Customer Satisfaction” service. This meant that after a request was resolved, the initiator received an email asking them to rate the IT department's work (on a 5-point scale). Clicking on a rating also opened a browser window where they could leave a comment. Naturally, all data was stored within the request.

#### Conclusion

During the design and implementation of the new service-resource model for IT department management, quality criteria were defined and mechanisms for process control and monitoring were established. New roles were created and existing ones redistributed, with areas of responsibility and authority for IT staff clearly defined. And, importantly, an automated system (ServiceDesk) was implemented to support IT department management processes.

One month after the start of production operations of the ServiceDesk system, statistics were collected and user feedback was gathered. The system officially registered 700 requests, 109 user reviews, an average IT department rating of 4.8 (out of 5), and over 80% of tasks were completed within the established SLAs.

Next steps included process optimization, integration with Bank systems (IDM, EDMS, internal corporate portal), improving the IT department's organizational structure, and transitioning Bank contractors to interact with the IT department through the Bank's ServiceDesk system.

[1]: /assets/images/posts/2016-09-20/1.svg
[2]: /assets/images/posts/2016-09-20/2.svg
[3]: /assets/images/posts/2016-09-20/3.svg
[4]: /assets/images/posts/2016-09-20/4.png
