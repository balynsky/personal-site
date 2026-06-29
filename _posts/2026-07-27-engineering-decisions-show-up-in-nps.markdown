---
title: "Engineering Decisions Show Up in Your NPS Score"
layout: post
date: 2026-07-27 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - Product Quality
  - Management
category: blog
author: balynsky
sitemap: false
description: Three years of NPS data showed a direct correlation with engineering quality investments — which changed how I make the case for technical work to the business
---

I used to think of NPS as a product metric and engineering quality as an engineering metric. Customer satisfaction lived in one part of the business; test coverage and deployment frequency lived in another. They were connected in principle but not in any way I could point to in a number.

Then we started looking at the data over multiple years, and the correlation was hard to ignore.

Over three years, our NPS score went from 16 to 30 to 38. Those aren't dramatic numbers on their own. What's interesting is when they moved and why.

## The pattern

The jump from 16 to 30 happened in the same year we adopted trunk-based development across all our engineering teams, grew test coverage substantially, and systematically reduced code duplication. We didn't do these things because they would improve NPS. We did them because the codebase had accumulated debt that was slowing down engineering. The NPS improvement was a side effect we didn't predict.

The jump from 30 to 38 happened the year after we dedicated a full quarter to technical debt reduction and came out of it with the lowest customer-reported bug count in the company's history.

I think it's a pattern, and it changed how I make the case for engineering quality to the business.

## Why engineering quality is visible to customers

Engineering quality isn't visible in the way a UI redesign is visible. Customers don't see your test coverage metrics or your code duplication percentages. What they see is a product that works reliably, responds to their problems quickly, and doesn't introduce new problems when it gains new features.

Every bug that reaches a customer is an engineering quality event. Every slow response to a reported issue is an engineering quality event. Every time a new feature ships and breaks something that used to work, that's an engineering quality event.

When you're carrying significant technical debt, these events happen more often — not because engineers are less capable but because the codebase is harder to change safely. The changes that should be contained turn out to have unintended side effects. The bugs that testing should catch get through because the coverage is thin. The responses to customer-reported issues take longer because the team is juggling a support burden that better quality would have prevented.

Customers experience all of this as product quality. They don't know or care that it's a consequence of accumulated technical debt. They know the product worked better or worse than they expected.

## What the NPS data actually tells you

NPS as a single number obscures more than it reveals. What's more interesting is the segment breakdown and what's driving movement within it.

When we went from 16 to 30, the biggest gains came from the middle of our customer base — organizations that were using the product reliably but not enthusiastically. They weren't unhappy enough to leave but they weren't advocates either. What moved them was fewer incidents and faster resolution when incidents occurred. Both of those are direct outputs of engineering quality work.

When we went from 30 to 38 — the year after the technical debt quarter — the pattern was different. The gains were more concentrated in our mid-market and enterprise segments, customers with higher SLAs and more sophisticated expectations. The thing that moved them wasn't fewer bugs per se; it was confidence. Customers at this level need to believe the product is being built carefully. Reliability over time builds that belief in a way that individual features don't.

## Using this to make the case for quality investment

The business case for technical debt reduction is usually made in engineering terms: throughput will increase, bugs will decrease, onboarding will be faster. These are all true and none of them are particularly compelling to a business stakeholder who is looking at a quarter where the engineering team will ship no new features.

NPS changes this. NPS is a business metric. If you can show a leadership team that the quarters where engineering invested in quality produced the largest NPS gains — and that NPS gains preceded revenue retention improvements — you've converted a cost-of-engineering conversation into a revenue conversation.

NPS is also driven by product, support, pricing, and market dynamics — I'm not claiming sole causation. But the correlation between engineering quality investments and NPS movement is strong enough that I treat it as evidence, not coincidence.

The question that changed for me: when I'm making the case for a debt reduction quarter or for a testing investment, I no longer frame it as "this will make engineering go faster." I frame it as "this is how we build the kind of product reliability that moves customers from neutral to advocate." That's a different conversation, and it lands differently.

## What the drift looks like from the other direction

There's a version of this pattern that runs in the opposite direction, and it's worth naming.

If engineering quality degrades consistently — if debt accumulates, coverage stays thin, incident rate climbs — the NPS impact doesn't arrive as a dramatic event. It arrives as a slow drift in the wrong direction. Customers who would have become advocates don't. Renewals that should have been easy become conversations. Churn creeps up in ways that are easy to attribute to other causes.

By the time the NPS number makes the problem obvious, the debt that caused it has been accumulating for years. Fixing it requires the kind of dedicated investment that feels enormous precisely because it was deferred so long.

The argument for continuous quality investment — a consistent allocation of engineering capacity to debt reduction and quality work in every quarter — is that it prevents the compounding. You never get to the point where a full quarter of feature freeze is the only way to recover. You trade small, regular investment for a large, disruptive one.

We caught the debt before it became a crisis, fixed it in one quarter, and watched the NPS respond. One quarter of deliberate investment paid back in customer confidence that had been quietly eroding for years.
