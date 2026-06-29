---
title: "Why We Dedicated a Full Quarter to Technical Debt"
layout: post
date: 2026-05-18 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - Technical Debt
  - Management
category: blog
author: balynsky
sitemap: false
description: For years we deferred technical debt to keep moving. Then we stopped everything for one quarter — and the results changed how we think about engineering quality permanently.
---

For most of the company's early years, technical debt was a known quantity that nobody had time to address.

This wasn't negligence. It was the rational response to the situation we were in. We were a cybersecurity company in a market that was still being defined — exploring product directions, testing different customer segments, shipping features to find out what actually mattered. In that environment, stopping to pay down technical debt feels like painting the walls while the foundation is being poured. There will always be something more urgent in the queue.

So we kept moving. The debt accumulated.

## What "moving fast" actually costs

Technical debt is invisible until it isn't. For a long time, it showed up as background friction: code that was harder to modify than it should have been, test runs that took longer than necessary, onboarding new engineers that took extra weeks because the codebase required institutional knowledge to navigate. Nothing dramatic — just a constant, compounding tax on every piece of work.

The more visible signal was quality. Customer-reported bugs were at a level that wasn't alarming in any single quarter, but when we looked at the trend, the pattern was clear: we were shipping faster than our quality infrastructure could support. Backend test coverage was sitting below 5% — enough to catch obvious regressions, not enough to give engineers confidence when touching anything non-trivial. Code duplication was above 7%. There were areas of the codebase where changes required careful manual verification because automated coverage was thin.

The other signal was engineer experience. When you ask engineers where they lose the most time, they'll tell you. The answers were consistent: areas of the codebase with poor test coverage meant changes required manual verification loops. Duplicated code meant the same fix had to be applied in multiple places. The accumulation of small architectural shortcuts created invisible coupling that made seemingly simple changes more complicated than they should have been.

Engineers are slower than they should be, and the reason isn't obvious until you look at the codebase.

## The decision

The decision to dedicate a full quarter to technical debt didn't come from a single incident. It came from a conversation about what was actually slowing us down.

We'd just finished a planning cycle for the year, and one of the senior engineers asked a question that was harder to answer than it should have been: what percentage of our engineering capacity was going toward work that customers would directly experience versus work that was really just maintaining the ability to keep working? When we tried to quantify it honestly, the answer was uncomfortable.

The proposal was to take one quarter — a full three months — and stop new feature development almost entirely. No new capabilities, no new integrations. Just focused investment in the things that should have been built better the first time: test coverage, code quality, architectural cleanup, documentation.

The business case wasn't complicated, but it required a certain kind of organizational maturity to accept. You're asking the business to give up a quarter of feature velocity in exchange for a quality improvement that will pay back over the following quarters. The payback is real, but it won't show up on next week's board. It requires trusting that the investment is worth making.

We made the case, and leadership agreed.

## What a debt quarter actually looks like

There's no single dramatic fix. It's a sustained sequence of unglamorous improvements — adding tests for code paths that have never had them, identifying and eliminating duplicated logic, documenting the implicit assumptions that exist only in the heads of engineers who've been around long enough to know them. It's work that engineers often find genuinely satisfying once they're doing it, because it's the kind of thing that always gets bumped by "more urgent" priorities. But it doesn't produce a feature announcement or a release note.

We approached it with explicit targets rather than vague intentions. Test coverage had to reach specific thresholds. Code duplication metrics had to move in a measurable direction. We treated quality metrics the same way we'd treat feature delivery metrics — with clear targets, visible progress, and accountability.

The other thing that matters: you have to protect the quarter. The pressure to "just add one small feature" or "this critical customer need can't wait" is real. Every one of those requests is individually reasonable. Collectively, they add up to a quarter that was nominally dedicated to debt reduction but in practice wasn't. We had to say no to things that felt urgent. That required explicit top-down commitment — not just engineering's commitment but the organization's.

## What happened after

The results were clearer than I expected, and faster.

Backend test coverage went from under 5% to over 20% — more than a 4x improvement in the space of one focused quarter plus the two that followed it. Code duplication dropped by nearly 75%. The parts of the codebase that had been the most friction-prone to modify became significantly more tractable.

The most striking metric came in the year that followed: customer-reported bugs dropped to the lowest level in the company's history — down by roughly 80% compared to the prior year. Engineering throughput in the quarters after was meaningfully higher, because the same amount of work was producing fewer quality incidents and requiring less manual verification.

The debt quarter paid for itself within two quarters.

## Making the case to leadership

The hardest part of this argument isn't the logic — it's the trust it requires. You're asking an organization to accept reduced feature output in the near term for a quality payoff that will show up in metrics that most stakeholders don't track closely.

A few things that helped us make the case:

**Show the current cost.** Before proposing the investment, we quantified what the debt was actually costing: the overhead on each feature because of thin test coverage, the engineer time spent on manual verification cycles, the support burden from bugs that better testing would have caught. When the cost is visible, the investment is easier to justify.

**Commit to measurable targets.** "We're going to improve code quality" is not a plan. "We're going to increase test coverage from X to Y and reduce duplication by Z" is a plan.

**Protect the quarter fully.** A debt quarter that gets interrupted by "just one urgent feature" produces the impression of progress without the results. If the organization can't commit to protecting the full quarter, the ROI math doesn't work.

The lesson we took from it wasn't just that technical debt quarters are valuable. It was that we should never have needed a full quarter in the first place. The right model is continuous investment — a consistent percentage of capacity dedicated to quality work in every quarter, rather than deferring until the accumulation demands a dedicated response.

We stayed fast by deferring quality until we couldn't anymore. It cost more than it would have to just build the quality in from the start.