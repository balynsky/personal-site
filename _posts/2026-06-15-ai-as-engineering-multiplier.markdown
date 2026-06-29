---
title: "AI as a Scalability Lever, Not a Headcount Substitute"
layout: post
date: 2026-06-15 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - AI
  - Management
category: blog
author: balynsky
sitemap: false
description: What we learned from a year of structured AI adoption — real multipliers by task type, how we chose our tools, and why the bottleneck moved from writing code to reviewing it
---

Most engineering teams have adopted AI tooling in some form by now. What most haven't done is think carefully about the organizational framing — what AI adoption means for how the team is structured, how work is measured, and what "engineering capacity" actually means when most of your team uses AI assistance daily.

We went through this deliberately over the past year and a half. What I want to write down is not which tools we chose — those details will be obsolete faster than I can publish this. What I want to write down is how we thought about it organizationally, what the numbers actually looked like, and what surprised us.

## The wrong framing: AI as headcount reduction

The first instinct many engineering leaders have is cost reduction. If an engineer can produce twice as much with AI assistance, can you do the same work with half the engineers?

This framing misunderstands what actually constrained your engineering output in the first place.

In most engineering organizations, raw code-writing speed is not the bottleneck. The bottleneck is understanding what to build, deciding how to build it, reviewing output carefully enough that it doesn't create downstream problems, and integrating it safely with everything else that exists. AI helps with one part of that chain — translating a clear specification into working code — while leaving the harder parts untouched or more demanding.

If you use AI to reduce headcount while keeping the same output targets, you end up with engineers producing code faster than they can review it, understand it, or maintain it. The long-term cost of that trade is not on next week's board.

## What the numbers actually look like

A year into structured adoption, our average multiplier across all engineering work runs around 2.5x. That number is accurate and also misleading if you take it at face value.

The gains vary significantly by task type:

- **Testing and QA work**: roughly 4x — AI is exceptionally good at generating test cases from templates and specifications
- **Technical tasks with established patterns**: roughly 2.5x
- **Repetitive or same-shape work**: roughly 2x
- **Net-new greenfield work**: roughly 1.3x — heavy generation still requires substantial manual correction; quality is the limiter, not speed

Publishing a single multiplier would give the wrong impression. The implication for planning: AI doesn't make everything uniformly faster. It makes well-specified, pattern-adjacent work dramatically faster, and barely accelerates work where the hard part is figuring out what to build.

On quality: automated test count grew 216% year-over-year. Production incidents dropped roughly 4x. That second number is a compounding effect — not AI alone — combining mature QA practices, expanded test coverage, and AI-assisted review working together.

## How we structured the adoption

We didn't roll this out all at once. AI entered the workflow phase by phase, starting where it paid off most and expanding outward.

In 2025 we ran a controlled pilot — a small group of engineers, AI involved in under 5% of code changes. By 2026: 85% of the engineering team uses AI assistance regularly, and roughly 70% of code changes involve AI at some stage. The remaining 15% isn't a gap we're trying to close — some task types simply don't benefit enough to justify the workflow change.

The structure we settled on maps AI to four phases of how engineering work actually flows:

**Inception** — AI drafts specs and proposals, engineers validate and revise. This is where context quality is most critical; a poorly specified document produces poorly specified code downstream.

**Construction** — the highest-ROI phase. Multi-agent orchestration with human-in-the-loop for code generation, security review, and architecture review. In practice this means multi-step workflows — root-cause analysis, patch generation, test updates, acceptance criteria — triggered by a single command, with a human approving each destructive step. The control model is consistent: agent proposes, engineer approves.

**Operations** — AI assists root-cause analysis; humans lead incident response. The agent proposes, the engineer approves.

**Reflection** — lessons captured manually, skills and agents updated as patterns emerge. This is the phase we've invested in least and where we see the most room to improve.

## How we chose the tooling

In early 2025, we ran a structured evaluation where each participating engineer tested one tool against real work for several months — alongside their regular duties, not in a sandbox. We covered the major options available at the time.

In October 2025 we standardized on Claude Code. The decisive factors were the agentic execution paradigm and how it handled our specific codebase complexity. The evaluation wasn't theoretical; it was six months of actual engineering output compared against a baseline.

Two governance decisions we made that I'd make again:

**A candidate model must beat the incumbent on our own task set before we upgrade.** No auto-upgrade on release. Model releases are marketing events; what matters is performance on the work we actually do.

**The architecture is provider-swappable even though we're standardized on one provider.** Standardizing on a tool for depth doesn't mean creating lock-in that makes future changes expensive.

## What AI adoption means for senior engineers

My answer: it makes poor judgment more expensive.

If AI can handle a substantial portion of the translation from specification to code, the value of a senior engineer concentrates in the parts AI doesn't do well — system design, architectural judgment, knowing which constraints are load-bearing versus accidental, reviewing AI-generated code with enough understanding to catch errors that a fluent surface hides.

This changes what we hire for in senior roles. The signal that mattered before — how fast can this person produce correct code from scratch — matters less. The signals that matter now: quality of specification (can they describe what they want precisely enough for an agent to build it?), review rigor (can they catch what the agent gets plausibly wrong?), architectural judgment (can they recognize when an AI-generated proposal doesn't fit the system even when it compiles?).

We haven't updated our interview process completely for this shift. But the engineers who get the most leverage from AI tools on our team are consistently the ones who are strong at those three things — not the ones who are fastest at writing code.

## What AI adoption means for honest measurement

We anchor measurement on delivery outcomes, not perceived-productivity surveys or release frequency.

The cleanest signal is a matched comparison: same task done with and without AI, everything else held equal. We only have a handful of those. The rest we triangulate — delivery metrics, incident rates, test coverage growth, QA throughput.

We tag AI-authored code so it can be monitored separately. We publish task-type breakdowns rather than a single multiplier because a single number misleads more than it informs. And we're honest that full per-engineer ROI attribution requires usage analytics we don't yet have at the granularity we'd need.

The ROI math, framed honestly: the annual tooling cost per engineer is a small fraction of what hiring that equivalent capacity would cost. We saw throughput gains equivalent to growing the engineering team by more than 60% — without growing the team. The return on tooling spend is substantial enough that it's not a line item worth debating.

We do more with the team we have, at the product quality we want, without growing headcount to match the product surface. That's the lever.

## The thing that didn't change

I expected engineers to feel less ownership over AI-assisted code — that they'd ship it but not really own it the way they own code they wrote themselves.

This didn't happen, at least not on our team. The reason: if your name is on the PR, you own the code in it, regardless of how it was produced. That framing kept the ownership culture intact.

The engineers who use AI most effectively are not the ones who use it most. They're the ones who are most deliberate about when to use it and when not to — who know that "plausible-looking" and "correct" are different things, and that distinguishing them is still a human job.
