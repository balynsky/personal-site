---
title: "Disagree, Commit, and Revisit: What Happens When the Wrong Decision Wins"
layout: post
date: 2026-05-04 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Engineering Leadership
  - Management
  - Decision Making
category: blog
author: balynsky
sitemap: false
description: How we handled revisiting an architectural decision that turned out to be wrong — and what it taught us about the second half of disagree-and-commit
---

*This is the third post in a series on how I run engineering on my team. The [first post]({{ site.url }}/engineering-culture-at-spin-ai) covers the six operating principles behind our engineering culture.*

About a year into building out the data ingestion layer on my team, we made an architectural decision that one of our senior engineers had explicit reservations about. She raised them clearly in the design session — not once, but twice. The team heard her. We considered the tradeoffs. And we made the call she disagreed with.

She committed to it. She worked on the implementation without sabotage or passive resistance. She didn't bring it up again.

Eight months later, the evidence showed she'd been right.

This post is about what happened after that — specifically, how you revisit a wrong decision when someone on the team was on record disagreeing with it.

## The decision

The technical context: Spin.AI's platform needs to detect changes in customers' SaaS environments — new files shared externally, permission changes, anomalous access patterns — and act on them quickly. The architectural question was how to get that data.

One approach was event-driven: consume webhooks and push notifications from Google and Microsoft APIs directly. Changes arrive in near real-time. Low latency, efficient at scale, but operationally complex — you're dependent on API availability, webhook delivery guarantees, and the specific event models each vendor exposes, which differ significantly and evolve.

The other approach was polling: periodically scan customer environments on a schedule. Simpler to reason about, easier to debug, predictable failure modes, fully under our control. The tradeoff is latency — changes are detected when the next scan runs, not when they happen.

We chose polling. The argument was that our initial customer commitments didn't require sub-minute detection, that the operational simplicity would help us move faster in the near term, and that we could add event-driven ingestion later when the scale warranted it.

The senior engineer's position was that "add it later" was underweighting the migration cost, and that at the customer sizes we were targeting, scan-based latency would surface as a real complaint faster than we expected.

She committed. We built polling.

## Eight months later

The evidence arrived gradually, then clearly. Customers at the larger end of our range started surfacing detection latency as feedback. Not a crisis — but consistent enough in customer calls that it was hard to ignore. The gap between when a policy violation occurred and when Spin.AI flagged it was visible to security teams who were used to real-time alerting from other tools.

The engineering answer was not complicated: we needed to add event-driven ingestion alongside polling, using events for real-time detection and polling as a validation and fallback layer. The work was substantial — the migration cost the dissenting engineer had flagged was real — but the direction was clear.

What wasn't obvious was how to handle the conversation about it.

## The conversation that matters

The corrosive version is "I told you this would happen" — accurate but counterproductive. It establishes a pattern where being right becomes a social asset and being wrong becomes a liability. People start advocating harder for their positions than the evidence warrants because losing is expensive. That's the opposite of the culture we're trying to build.

The dishonest version pretends the earlier disagreement didn't happen — treats the decision as if it were made in a vacuum rather than against specific objections that turned out to be correct.

The conversation we had was a third version. I went to the engineer directly, acknowledged that her original concern had been right, and asked her to lead the architecture work for the event-driven implementation. Not as a consolation prize — because she'd already done the reasoning about the problem we were solving, and her mental model was the most accurate one we had.

I also named what the original decision cost — not to relitigate it, but because glossing over it would have obscured the actual lesson. The migration was expensive. Customers experienced something we'd said wouldn't be an issue for a while. Both of those are real consequences worth acknowledging clearly.

## What we changed in the decision process

The root cause wasn't that the original call was wrong. Wrong calls happen. The root cause was that we had no systematic way to record the assumptions behind a decision so we could check them later.

In the design session, we'd implicitly committed to a belief: that detection latency wouldn't be a meaningful customer complaint at the scales we were targeting, not for a while. That belief was falsifiable. We didn't write it down as something to test.

After this, we added a simple practice to architecture decisions: explicit, dated assumptions. When we make a call that involves a tradeoff, we write down the assumptions that make that tradeoff acceptable — "customers at X scale won't surface Y as critical feedback before we can add Z" — and when to revisit them. It takes a few minutes per decision and gives you a structured way to notice when your assumptions no longer hold.

The senior engineer's original objection was essentially an assumption about customer behavior at scale. If we'd written it down at the time — even as "we believe X, she believes Y, we're committing to X, revisit when customer base reaches N" — we'd have caught the feedback signal earlier and framed the revisit as scheduled rather than remedial.

## What disagree-and-commit actually requires

I said in my post on our engineering principles that the disagree-and-commit principle requires different things before and after a decision. The "before" is about preparation and honest expression. The "after" is about full commitment.

The part the principle doesn't address: what do you do when it's time to revisit? Committing to a decision doesn't mean treating it as permanent. It means executing against it cleanly while the decision is current, and being willing to revisit it when evidence changes — without the revisit becoming a retrospective on who was right.

That's hard. The engineer who disagrees has an incentive to bring it up early as soon as any evidence appears. The people who made the original call have an incentive to minimize how much of the evidence is attributable to the decision. Both of those pressures exist.

What I've found works: when a revisit is warranted, do it explicitly and early. Don't let the evidence accumulate until the original decision looks obviously wrong. Name the revisit as a revisit, not as damage control. And when someone was right to disagree, say so directly — not as a conclusion of a post-mortem but as a normal acknowledgment of how the decision process worked.

The point isn't to protect bad decisions. It's to make it safe to commit to a decision you think is wrong — and say so clearly when it turns out to be.