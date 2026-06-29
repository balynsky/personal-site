---
title: "The Merge Problem That Led Us to Trunk-Based Development"
layout: post
date: 2026-04-20 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - Development Process
  - Trunk-Based Development
category: blog
author: balynsky
sitemap: false
description: How a pattern of large pull requests led us to abandon feature branches — and what we learned about diagnosing the right problem
---

*This is the second post in a series on how I run engineering on my team. The [first post]({{ site.url }}/engineering-culture-at-spin-ai) covers the six operating principles behind our engineering culture.*

For about a quarter, one of our engineering teams had a recurring problem. Pull requests were getting large — sometimes several hundred lines, occasionally more than a thousand. Code reviews were happening but taking longer than they should have. Merge conflicts were a regular source of friction. Release cycles felt sluggish in a way that was hard to pin down precisely.

The obvious diagnosis was that engineers were batching work. So we did the obvious things: set informal size expectations for pull requests, added a step to the PR template asking authors to verify they'd broken changes into logical chunks, talked about it in retrospectives.

Things improved for a few weeks. Then drifted back.

It took us longer than it should have to realize we were solving the wrong problem.

## What we thought was happening

When you see large pull requests consistently, the instinct is to frame it as a discipline problem. Engineers are working too long on branches before submitting. Reviews are slow because reviewers face too much at once. The solution is enforcement: size limits, checklists, SLAs on review turnaround.

We tried versions of all of these. The reason they didn't hold is that they treated symptoms rather than the underlying incentive structure.

An engineer working on a feature branch is isolated by design. Their job is to complete the feature. Submitting an incomplete feature for review feels unproductive — it generates feedback on unfinished code, creates a review cycle that may block progress, and produces a merge that requires rebasing when the feature eventually completes. The rational response to this incentive structure is to batch work: stay on the branch until the feature is done, then submit.

The problem wasn't the engineers. The problem was the branching model.

## What was actually happening

One of the principles we run engineering on is that we investigate mistakes to find and eliminate root causes. The same principle applies to process problems: when a behavior pattern persists across personnel and weeks of work, the pattern is usually in the system, not the individuals.

The tell was this: we'd have a few weeks where pull request size improved — usually right after we'd talked about it explicitly — followed by a stretch where it drifted back. When a behavior change doesn't hold, it's usually because the incentive structure that produced the original behavior hasn't changed. People are trying harder, but the system hasn't changed what "trying harder" produces.

Once we framed it that way, the fix became clearer. We didn't need to change engineer behavior. We needed to change the system that was producing the behavior.

Feature branches reward batching. The longer you stay on the branch, the further you drift from main — and the more expensive the eventual merge becomes.

## What trunk-based development changed

Trunk-based development (TBD) is a branching strategy where all engineers integrate to a shared trunk frequently — ideally daily, sometimes several times a day. Branches are short-lived: you branch from trunk, make a focused change, integrate, and the branch is gone. The trunk is always in a deployable state.

In practice, this requires a few things to actually work:

**Feature flags for incomplete work.** If a feature isn't done but the code needs to be on trunk, it lives behind a flag that keeps it invisible to users until it's ready. This separates deployment from release — you deploy when the code is ready, you release when the feature is ready. For a security product where releases go through validation before reaching customers, that distinction matters.

**Small, focused changes.** When you're integrating daily, you're forced to decompose work into units that can be integrated without being complete. This turns out to be a good discipline independently of the branching question — it produces cleaner commits, clearer commit messages, and pull requests that reviewers can actually evaluate rather than survey. The question shifts from "what is the feature?" to "what is the smallest change I can integrate today that moves the feature forward?"

**A trunk that's always clean.** The non-negotiable requirement of TBD is that you never leave the trunk in a broken state. This means fast CI pipelines, adequate test coverage, and a strong norm around reverting quickly rather than fixing forward when something breaks. If integration breaks the build, the next action is revert. Not investigate, not push a quick fix — revert, then figure out what happened.

## What actually changed on the team

The shift wasn't immediate or frictionless. Engineers who had been working on features over multiple days had to change how they thought about decomposition. The question changed from "what is the full feature?" to "what is the next coherent step in building this feature, and can that step be integrated independently today?"

Some engineers adapted quickly. A few found it uncomfortable for longer — not because the mechanics were difficult but because it required a different way of thinking about work in progress. When your code is on a branch, it's yours until you submit it. On trunk, everything you do is visible continuously. That's a psychological shift as much as a process shift.

The review experience changed substantially. Pull requests representing one day of focused work are comprehensible. A reviewer can hold the change in mind, understand the intent, and evaluate whether it achieves it. Reviews got faster not because we imposed time limits but because the unit being reviewed was actually reviewable.

Merge conflicts essentially disappeared. When branches don't live long enough to accumulate drift from trunk, there's nothing to conflict with.

## What to look for earlier

The change is easy to describe. Diagnosing that you need it — that took us a quarter.

We spent roughly a quarter trying to fix engineer behavior before we realized the incentive structure was the problem. That's a quarter of friction and drift that could have been avoided. The tell I'd watch for earlier next time: when a behavior change requires repeated reinforcement to sustain, the behavior is downstream of something structural. Fix the structure.

The connection to how we handle mistakes on my team is direct. We don't punish for mistakes, but we make sure they don't happen again — and making sure means asking what changed in the *process* to make the mistake unlikely, not just what changed in the *people*. We were applying that principle to code quality and security incidents without applying it to our own development process. Once we applied it to our own process, the branching model was the obvious culprit.

The large PRs stopped when the branching model stopped rewarding batching.