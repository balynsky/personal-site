---
title: "Implementing Agile Elements in a Bank"
layout: post
date: 2017-09-14 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- AGILE
- Management
- IT
category: blog
author: balynsky
sitemap: false
description: Implementing agile methodology elements in a Bank
---

Previously, I described how the Bank's core IT processes were organized around ITIL. The only exception was the change management process. This second (and final) part covers the implementation of agile methodology elements in the Bank's IT change management processes.

### Problem Description

I encountered the following problems when analyzing the existing process:

* 80% of tasks arrive ad hoc
* Task priorities constantly change
* No ability to plan work
* No coherent approach to system development
* No "established rules of the game" for implementing changes

![Markdowm Image][1]{: style="width:780px" }

The internal effects included employee burnout, declining productivity, and a lack of innovation.

The Bank's primary goal was to bring new products to market as quickly and with as high quality as possible. Why wasn't this happening? I'll demonstrate three of the most common scenarios. I'm sure they can be found in other financial organizations as well.

For illustration, let's launch a new credit product — a Credit Card. The customer will be the retail business unit, the primary contractor will be an external vendor (we'll use the outsourcing model common in many organizations), and internal IT serves a supporting function. And most importantly: all situations described are fictional, and any resemblance is coincidental.

![Markdowm Image][2]{: class="block-right" style="width:360px"}

The customer begins project implementation, holding meetings with the contractor. The result is a project charter for the product.

The charter includes all requirements and processes described by our customer, based on the sales process:

* Customer application form fields;
* Front-end system requirements (sales, verification);
* Role model;
* System integration requirements;
* Draft sales process.

And here we encounter the first mistake: after the concept is approved and work begins, certain aspects turn out to be unaddressed (or overlooked): the involvement of financial monitoring in product identification (blacklists, terrorist lists, etc.).

This requires reworking the sales process, changing forms, adding integrations and new roles. As a consequence: changes to the project timeline and budget. As often happens — one department cannot know all the processes of other departments.

---
![Markdowm Image][3]{: class="block-left" style="width:360px"}

Our customer holds meetings with all business departments, the process becomes thoroughly developed, but there is no architectural description of how the functionality will be implemented in business systems. The customer describes the product catalog design, and the contractor implements the product catalog in their own system (i.e., the system they know). During the pilot, it turns out that some parameters need to be configured in the CBS (the Bank's core banking system), otherwise correct interest calculation won't be possible.

The result — additional costs for system synchronization (credit product parameters) or labor costs for migrating product catalog management to the CBS. In the first case, operational costs for product maintenance increase; in the second, the project timeline and budget expand.

---
![Markdowm Image][4]{: class="block-right" style="width:360px"}

The third possible scenario — parallel changes in core systems initiated by other departments or regulatory requirement changes. The simplest example is adding or modifying customer application fields or changing their mandatory status.

---

### Finding a Solution

Our task was to build an effective implementation process. To achieve this, we needed to involve all business departments in the change management process and reduce conflicts over IT resources. We began looking toward agile methodologies to use their artifacts for improving internal processes.

First, we examined how similar organizations were adopting agile. But many large organizations implement agile processes only formally — a manager comes to the IT department and says: "Starting today, the department head becomes the scrum master, we'll hold standups and draw sprints." This change fundamentally alters nothing except the terminology (managers conduct short-term planning, meetings with subordinates, etc.). Sometimes one business representative is invited to IT team discussions, but the conversations at these meetings are purely technical, so no real benefit comes from it.

![Markdowm Image][5]{: style="width:780px" }

We proposed an entirely different model: organizing around products, including representatives from all departments involved in processes related to those products (both sales and servicing). The second significant innovation was that the banking product lifecycle begins from the lead and ends at the moment of deal closure or resale.

#### Stage 1 — Capturing the Idea, Preparing the CR, Preliminary Assessment
Any team member describes the proposed change for preliminary analysis using the user-story format, which then goes into the business analyst's backlog. The business analyst organizes weekly meetings where changes are discussed with the product owner, analysts, and other business departments involved in the process. After this stage, changes move into the product backlog.

#### Stage 2 — Setting Priorities and Planning Implementation
Task planning involves determining which tasks from the backlog will be included in the upcoming sprint. The product owner is directly responsible for task prioritization, as well as for the economic viability of the work and the quality of the delivered product. The team succeeds or fails as a whole.

#### Stage 3 — Development, Testing, Release
The product owner receives the results of each sprint for testing and can influence the further course, for example, by adjusting the scope of upcoming work. All product changes are combined into releases, which consist of several sprints lasting 2-4 weeks.

![Markdowm Image][6]{: style="width:780px"}

### Conclusion

To conclude this article, here's an example of a retail business team that could be assigned our fictional product — the Credit Card:

Credit Cards and Acquiring Department (Product Owner)

* Financial Monitoring Department
* Financial and Operational Risk Control Department
* Banking Operations Support Department
* Information Technology Department
* Payment Systems Department

[1]: /assets/images/posts/2017-09-14/1.svg
[2]: /assets/images/posts/2017-09-14/2.svg
[3]: /assets/images/posts/2017-09-14/3.svg
[4]: /assets/images/posts/2017-09-14/4.svg
[5]: /assets/images/posts/2017-09-14/5.svg
[6]: /assets/images/posts/2017-09-14/6.svg
