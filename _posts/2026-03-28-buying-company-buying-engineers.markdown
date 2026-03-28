---
title: "When You Buy a Company, You're Really Buying Its Engineers"
layout: post
date: 2026-03-28 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
  - Management
  - Engineering Leadership
  - M&A
category: blog
author: balynsky
sitemap: false
description: Lessons from a third acquisition — why the technical plan is the easy part and the human side is what determines success
---

*Lessons from my third acquisition — and why the technical plan is the easy part*

By the third acquisition, the technical integration becomes almost routine. You know which workstreams to stand up, in what order, with what tooling. You've seen the AWS consolidation before. You've done the SOC 2 scoping before. You know that identity migration will break someone's MFA and that the Slack workspace decision will generate more opinions than the architecture decisions combined.

What doesn't get easier is the human side.

When the deal closed on our acquisition of Retain, I had one question that actually mattered: what are the engineers on the other side of this thinking right now?

The answer, as it always is, was: their jobs. Their equity. Whether the product they'd spent years building was about to be rewritten, deprioritized, or quietly sunsetted. Whether the new company would understand what they'd built — or just see it as technical debt to be migrated away.

They weren't wrong to wonder. Most acquisitions fail not at the deal table but in the six months after it, and they fail for the same reason every time: the acquired engineering team quietly checks out. I've seen it happen. I've also, over three transactions, learned a few things about how to prevent it.

## The mistake hiding in every integration plan

After two acquisitions, my integration plan was excellent. Technically. It had phases, owners, dynamic timelines, parallel workstreams across infrastructure, security, identity, application security, and tooling. Two hundred line items. Everything an engineering lead needs to execute a clean integration.

It was also, I realized on a second read, written entirely about the Retain team rather than with them.

Every task was something we were going to do to them. Deploy agents to their servers. Enroll their devices. Migrate their repos. Review their IAM roles. The language was technically neutral but psychologically it read like an inspection report. If I were an engineer at Retain and someone handed me that document, I'd start updating my LinkedIn.

So we rewrote it. Same tasks, fundamentally different framing. "Review IAM roles" became "Review IAM roles together — Retain engineers retain access to their services." "Deploy endpoint protection" became "Deploy endpoint protection — communicated to the team with rationale, not silently enforced."

Small changes. But language signals intent. And in the first weeks of an acquisition, engineers are reading every signal they can find.

## The first two weeks set the temperature for everything after

I learned this the hard way on acquisition number two. We moved fast, communicated top-down, and treated the technical integration as the primary work. We got the infrastructure consolidated on schedule. We also lost four senior engineers in the first quarter — people who were never going to say "I left because the onboarding felt impersonal," but that's effectively what happened.

By acquisition three, the first two weeks looked different:

**The welcome message went out before the plan.** Before we shared a single integration task or architecture diagram, I sent a personal note to the Retain engineering leads. Not a corporate announcement — a direct message, acknowledging this is a strange moment, and asking what was on their minds. The responses were more honest than any formal kickoff would have produced.

**They ran the first technical sessions.** We scheduled architecture deep-dives in week one and asked Retain engineers to lead them. We showed up to listen. This signals respect and — practically — ensures you understand what you're integrating before you start changing it. Both matter.

**The plan became a conversation.** We shared the integration tracker with Retain leads in week one and explicitly invited them to push back on timelines, priorities, and scope. Some things moved. A few things dropped entirely. The plan got better. More importantly, it became their plan too.

## What an engineering integration actually covers

For Engineering leads earlier in their acquisition experience — the scope is wider than most people expect going in. You're integrating six things simultaneously, on overlapping timelines:

**Infrastructure and cloud** is usually the most tractable. AWS accounts, cost optimization, observability stack migration. Quick wins here matter — they build confidence with the business and give both engineering teams something tangible to point to early.

**Security and compliance** is where teams consistently underestimate the work. HIPAA, GDPR, SOC 2, ISO 27001 — scoping an acquired company into your compliance program means gap assessments, policy acknowledgements, device enrollment, endpoint protection, SIEM integration, vulnerability scanning, and eventually a penetration test. We structured this as seven parallel workstreams running over six months. It cannot be compressed into month one.

**Identity and access** sounds straightforward until you realize that changing someone's email address breaks their MFA, their SSO integrations, and approximately fifteen other things they'll discover one at a time. Plan for it.

**Application security** is a conversation as much as a technical program. The acquired codebase will have issues — every codebase does. The question is framing. We treated SonarQube findings as a shared work queue, not a grade. Retain engineers triaged their own results. That distinction matters more than it might seem.

**Collaboration and tooling** is the most visible layer to individual contributors. Changing someone's Slack workspace affects their daily life in a way that migrating an AWS account does not. The tool consolidation decisions — what to keep, merge, or retire — should be made jointly, with the acquired team having genuine input and veto on tools they depend on.

**Platform foundation** — Terraform, Kubernetes, CI/CD — is the longest horizon. Start the conversation early so engineers can factor it into their own technical decisions, but don't try to execute it while everything else is in motion.

## On the psychology of being acquired

Here is something that doesn't change across acquisitions: the engineers at the company you just bought are grieving, at least a little.

Not necessarily dramatically. But they built something. They had autonomy, a culture, a way of making decisions. That's all in flux now, through no choice of their own. Even when the acquisition is financially good for them, the psychological transition is real — and if you ignore it, it shows up as attrition three months later.

A few things that consistently help:

**Give them agency over their own codebase.** When we found issues in Retain's application, we made it explicit that their engineers would own remediation — with our support, not our oversight. Their code, their call.

**Be transparent about open decisions.** We had six significant decisions still unresolved when we shared the integration plan. We listed all of them explicitly as open questions to be decided jointly. Uncertainty is tolerable when it's acknowledged. It becomes corrosive when it's hidden.

**Don't optimize for speed at the expense of trust.** There's real pressure to move fast — the deal is expensive, the synergies are on the clock. But engineers at the acquired company are watching how you operate under pressure. If you push timelines without discussion or make unilateral calls, that data goes into their pattern-matching. It's worth slowing down slightly. It pays back.

## What I'd tell someone starting this tomorrow

The integration plan is not the integration. The plan is a list of technical tasks. The integration is the ongoing work of building trust between two engineering cultures that have never worked together before.

After three of these: start with listening. Run the architecture sessions before you share the migration plan. Ask what's working in the acquired company's engineering culture before you start changing things.

Make the plan joint from day one. Not "here is what we're going to do" but "here is what we're thinking — what are we missing?"

And be explicit about what's not changing. Engineers spend enormous mental energy trying to figure out what's going to happen to them. Every piece of clarity reduces the background anxiety that leads to attrition.

The reason you paid for this company is the people in it. The best investment in any acquisition isn't the infrastructure optimization or the security tooling — it's the decision, made early and held consistently, to treat the engineers you acquired as colleagues rather than subjects.

That's the part that doesn't get easier. But it does get more intentional.