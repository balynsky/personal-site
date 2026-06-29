---
title: "How I Run Engineering at Spin.AI: Six Principles We Actually Follow"
layout: post
date: 2026-04-06 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - Culture
  - Management
category: blog
author: balynsky
sitemap: false
description: The six operating principles behind Spin.AI's engineering culture — what they look like in practice, not on a slide deck
---

People ask me some version of the same question at engineering offsites and leadership meetups: what does your engineering culture actually look like? Not the version on the careers page. What happens when something breaks in production? When an engineer is stuck for two days and hasn't told anyone? When two people disagree on architecture and someone has to give?

I'm Sergiy Balynsky, SVP of Engineering at a cybersecurity company that protects organizations' Google Workspace and Microsoft 365 environments. The engineering team is distributed across multiple time zones and office locations. Culture isn't something you can manage at that scale; you have to build it into how decisions get made day to day.

We run engineering around six operating principles. I want to describe them the way they actually work — including where following them is uncomfortable, and where we've had to revisit what we thought we understood.

## People: Hire for trajectory, not credentials

The principle is: always hire the best people and help them change the world. The harder question is what "best" means in practice.

Best doesn't mean the strongest CV or the most senior title. It means someone whose trajectory suggests they'll outgrow whatever role you hired them into. Over the years, I've learned to look for a specific quality during hiring: how does this person respond when something goes wrong? Not whether they ever make mistakes — but whether problems make them sharper or more defensive. That pattern predicts more about long-term performance than anything else I've found.

The second half of the principle matters as much as the first: create an environment that produces results rather than one that monitors for them. When I'm managing well, I spend most of my time removing obstacles — clearing blocked decisions, resolving cross-team ambiguity, getting people the context they need. The moment I notice I'm checking on progress more than removing obstacles, that's a signal something is wrong with the system, not the people.

The data backs this up in a way I find meaningful: engineering turnover on my team runs around 6%, against a company-wide rate closer to 27%. I don't think that gap comes from compensation or perks. It comes from engineers feeling like the work is theirs — that they own what they build and understand why it matters. When nine out of ten candidates who receive an offer actually accept it, you're doing something right in how you describe the environment, not just the role.

## Mistakes: The root cause is almost never the person

This is the principle we take most seriously at Spin.AI, and the one that takes the longest to actually believe.

Everyone says they don't blame individuals for mistakes. In practice, when something breaks and a customer notices before the team does, the human instinct is to find whoever made the last change and ask why they made it. We actively work against that instinct.

The operating principle has two parts that need to coexist: own your mistakes, and investigate them to find and eliminate root causes. Taking personal responsibility for a decision doesn't mean the solution is "try harder next time." Usually it means fixing the process that made the mistake possible in the first place. We don't punish for mistakes, but we do the work to make sure they don't happen again — and that means writing down what happened, why, and what specifically changes as a result.

Post-mortems that end with "the engineer will be more careful" are post-mortems that failed. The mistake happened once; a process that relies on individual vigilance will produce it again.

I'll write more about this in the context of a specific process problem we diagnosed and fixed — a pattern of large pull requests that we initially tried to solve with enforcement and eventually realized was a structural problem in our branching strategy.

## Work: The customer is always in the room

When engineers are making technical decisions — architecture choices, tradeoff calls, what to build next — one question is always on the table: how does this affect the customer?

This sounds obvious. In my experience it isn't. Engineers default to framing decisions in terms of technical elegance, performance characteristics, or developer experience. All of these matter. But they matter in service of organizations that chose to trust us with protecting their data. That constraint is always present, even when nobody has explicitly put it on the table.

We don't expect features to be perfect before they ship. We do expect them to work very well. The distinction is important: "perfect" is a standard that delays shipping indefinitely. "Works very well" is a standard about not shipping things you haven't thought through carefully. Those are different things, and conflating them is how teams either ship too much too fast or hold things indefinitely for polish that doesn't serve any real user need.

## Relationship: Asking for help is not a failure signal

In many engineering cultures, admitting you're stuck is a subtle form of failure. Engineers work around problems rather than surfacing them, spend three days on something a colleague could have helped with in an hour, and ship solutions that required unnecessary individual heroics.

We work against this explicitly. The principle is: ask for help when you're stuck; help others when they ask. Neither half is optional.

The second half matters as much as the first. I've worked with engineers who were quick to ask for help but slow to offer it — who treated knowledge as something to request rather than share. That's not the culture we build. When someone shares knowledge, they stay with it until the other person understands completely. That takes longer in the moment. It produces better engineers over time.

## Disagree and Commit: The rules are different before and after

We have a formal principle around disagreement: express your view clearly before the decision. After the decision, commit to it fully.

The "before" part requires showing up prepared. If you have a view on an architecture decision, bring data or reasoning. Opinion without preparation isn't a contribution — it's noise that consumes the room's time. If you've just learned about something and your view is based on instinct, that's valid input, but label it as such.

The "after" part is where this principle gets hard. Committing to a decision you disagreed with means acting as if you would have made the same choice yourself. It doesn't mean silence if evidence accumulates. If the data later shows the decision was wrong, that's a conversation worth having — but it's a different conversation than the original disagreement, and it needs to be framed differently. "I think we made a mistake and here's the evidence" is constructive. "I told you this would happen" is not, even when it's accurate.

I'll write more about what this looks like in practice in the context of an architectural decision we revisited several months after making it — and specifically how we handled the engineer who had been right to disagree.

## Transparency: Share the failures, not just the wins

The last principle sounds easiest and in practice is often the hardest: we believe in transparency in everything.

Most engineering teams share wins. The launch went well. The quarter closed strong. Sharing failures — actual accounts of what went wrong and why — is where most cultures stop short.

At Spin.AI, we share both. Failures are shared publicly within the team: what happened, what we decided, what changes as a result. The goal isn't accountability theater. It's to establish a norm where reality is discussable. When you can't talk about what went wrong, you can't fix it.

Transparency also applies to decisions made above the team level. When something is decided at the leadership level, the team knows about it and knows the reasoning. The alternative — engineers operating without understanding why — produces decisions that feel arbitrary and builds a low-trust environment where people spend energy speculating about intent rather than doing the actual work.

---

The friction is the test. Any principle that never costs you anything isn't actually being followed.

The next two posts in this series go into specific situations where these principles got tested: a branching strategy problem that led us to trunk-based development, and an architectural decision we made too quickly and had to revisit.