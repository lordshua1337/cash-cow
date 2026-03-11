# Cash Cow

Trending product browser. Users discover what's hot, save what interests them, get a plain-English build spec for anything they pick.

## Persona -- Jake

**Jake, 24, aspiring indie hacker.**
Works a 9-5 as a junior marketing coordinator. Spends evenings watching YouTube videos about building SaaS products. Has basic coding skills (followed a few tutorials, can tweak a Next.js template) but has never shipped a product.

**Context:** Jake scrolls Twitter/X and sees people posting "$10K MRR" screenshots. He wants to build something but is paralyzed by "what should I build?" He's tried brainstorming in Notion docs and ends up with 40 half-baked ideas. He doesn't know how to evaluate which ones are worth building.

**Goal:** Find a product idea that's already proven (people want it) and get a clear, jargon-free spec he can hand to an AI coding tool to start building this weekend.

**Skill level:** Can follow instructions. Knows what an API is but couldn't build one from scratch. Doesn't know what "BMAD scoring" or "complaint clusters" mean and doesn't want to.

**Emotional state:** Excited but overwhelmed. Has limited time after work. Wants to feel like he's making progress, not studying for an exam. If something feels like homework, he'll close the tab.

**Design implications:**
- Every label should make sense to Jake on first read
- No scores, metrics, or analysis frameworks -- just "here's what's trending" and "here's how to build it"
- The spec output should read like a friend explaining the project over coffee
- Save/favorites should feel instant and casual (like bookmarking a tweet)
- Mobile-first -- Jake browses on his phone during lunch breaks

## Stack

- Next.js + React + TypeScript
- Tailwind CSS + shadcn/ui
- Groq (free) / Claude (paid) for spec generation via src/lib/ai/llm.ts
- localStorage for favorites (no auth required)
- Vercel deployment

## Pages

1. `/` -- Browse trending products (HN + GitHub feed)
2. `/favorites` -- Saved products grid
3. `/build/[id]` -- Generate plain-English build spec
