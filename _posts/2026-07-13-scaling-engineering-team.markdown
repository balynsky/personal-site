---
title: "What Actually Breaks When You Triple Your Engineering Team"
layout: post
date: 2026-07-13 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - Scaling
  - Management
category: blog
author: balynsky
sitemap: false
description: From 11 engineers in two teams to 35 across multiple locations — what breaks at each growth stage and what you have to rebuild deliberately
---

When we had eleven engineers, culture was something we had without trying. Everyone knew what kind of work was acceptable, how decisions got made, what "done" meant. None of it was written down. It didn't need to be.

At seventeen, the first cracks appeared. Not dramatically — just small coordination failures. A decision that would have been obvious to everyone six months earlier now required a conversation. Someone newer to the team made a choice that a longer-tenured engineer would have made differently, and neither of them was wrong exactly — they just had different mental models that had never been reconciled.

We're now at thirty-five engineers across multiple office locations. What I know from that trajectory is that the thing that breaks at each growth stage is almost never what you expect it to be. It's almost always communication structure — specifically, the informal communication that small teams rely on without knowing they're relying on it.

## What breaks at each stage

**Under fifteen people**, most of the engineering org's shared understanding is transmitted in real time. You overhear context you weren't directly part of. You absorb norms through proximity. An engineer who joins at this stage will have a complete picture of how the team operates within a few weeks, just from being in the room.

This doesn't scale. The moment the team grows beyond what can fit in one room, the information transfer model breaks — not gradually but suddenly. Engineers who joined after a certain point have a different mental model of how decisions get made than engineers who were there before. You end up with a team that thinks it shares assumptions but doesn't.

**Around fifteen to twenty-five**, the thing that breaks is decision clarity. When you had ten engineers, you could hold all the relevant context for most decisions in your head. At twenty, the surface area of decisions has grown but your bandwidth hasn't. Decisions start taking longer, or they get made informally by whoever has the most context and the rest of the team learns about it after the fact.

This is the stage where most teams paper over the problem by adding process — more meetings, more documents, more approvals. The right answer is something different: defining explicitly what kind of decisions belong to whom, and trusting people to make them. The meetings and documents are often a symptom of not trusting the decision-makers you have, which is a hiring and culture problem, not a process problem.

**Beyond twenty-five**, the thing that breaks is culture transmission. The people who absorbed the culture by osmosis in the early days can't transmit it to ten new engineers just by example. The mental models that were obvious to the founding engineering team are not obvious to someone who joined eighteen months later and only knows the team as it is now, not as it was.

This is when culture needs to be explicit. Not "we have these values" on a slide — but written down at the level of how specific decisions get made, what specific behaviors are expected, what "ownership" actually means in practice on this team.

## The hiring math

At our current scale, we see roughly one offer for every sixty candidates who apply. Of the engineers who make it through a full interview process, about nine in ten accept.

I think about those two numbers a lot. The first one is a function of standards — we're looking for something specific and most applicants don't fit it. The second one is a function of reputation. When someone gets to the end of our process and sees what the team actually looks like — the quality of the work, the ownership model, how decisions get made — they want to be part of it.

The only way to keep that second number high as you scale is to not compromise on what made it high in the first place. Every team that grows quickly has to choose, usually implicitly, between maintaining hiring standards and filling roles on schedule. The teams that compromise on standards to hit headcount targets end up with a culture dilution problem that is much harder to fix than an understaffing problem.

We've stayed at six percent engineering turnover through three years of growth. I don't attribute that to compensation. I attribute it to engineers feeling like the work is genuinely theirs — that they own something real, understand how it connects to the product, and have the authority to make meaningful decisions about it.

## What you have to rebuild deliberately

Three things that survived the growth intact because we rebuilt them deliberately rather than assuming they'd transfer:

**Explicit ownership boundaries.** When we had two teams, ownership of features and systems was informal — everyone just knew who was responsible for what. At three teams and beyond, informal ownership creates gaps. Two teams both think the other one owns a particular piece. One team makes a change that has consequences for another team's domain. We moved to explicit domain ownership, documented and visible, with clear boundaries about who has final say on what.

**Written decision rationale.** This came directly out of the disagree-and-commit principle, but it became more important as the team grew. When you have eleven engineers, the reasoning behind a decision is known because the people who made it are still around and in the room. At thirty-five, decisions that were made a year ago are being executed by engineers who joined six months ago and have no way to know why that decision was made. We write down not just what we decided but what assumptions we were making when we decided it.

**Direct feedback culture.** In a small team, feedback is ambient — you know what your colleagues think because you work closely enough together that it comes through naturally. In a larger team, feedback has to be deliberate. We run formal 360-degree reviews, but the more important thing is that direct feedback is normalized as a first-line response rather than something saved for a formal process. Engineers who can tell each other "that PR isn't clear enough" or "that decision needs more context" without it being a difficult conversation are engineers who are actually getting better.

## What the org chart doesn't show

The conventional advice for scaling an engineering team focuses on process: planning cadence, on-call rotations, deployment workflows. All of that matters. But process isn't what makes this hard.

Every time you add engineers, the culture you had at the previous size has to be actively reconstructed at the new size. It doesn't transfer automatically. The team you have at thirty-five is not the team you had at eleven with twenty-four more people added. It's a different team that needs to deliberately build what the small team had organically.

The engineers who have been there since the beginning are culture carriers. But culture carriers can only do so much at scale. At some point the culture has to live in the structures and the written agreements and the norms that are visible to someone joining on their first day. The engineer who joined six months ago knows the team as it is now. They need the structures to tell them why.
