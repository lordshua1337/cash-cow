# Cash Cow

Pick a proven idea. Get a build spec. Start building this weekend. The spec IS the product.

## Persona -- Jake

**Jake, 24, aspiring indie hacker.**
Works a 9-5 as a junior marketing coordinator. Watches SaaS YouTube. Basic coding. Paralyzed by "what should I build?" Wants one proven idea + a spec to build this weekend. Closes tabs that feel like homework. Never leaves the app.

**Design implications:**
- Every label should make sense to Jake on first read
- No external links, no star counts, no source badges
- The spec should read like a smart friend talking, not a consultant
- Favorites are "your build queue" -- not a guilt list
- Mobile-first

## Stack

- Next.js + React + TypeScript
- Tailwind CSS (cow theme in globals.css)
- Groq (free) / Claude (paid) for idea + spec generation via src/lib/ai/llm.ts
- localStorage for favorites + cached specs (no auth required)
- Vercel deployment

## Pages

1. `/` -- Pick an idea (top pick featured + 5-7 alternatives + category chips)
2. `/build/[id]` -- Build spec (auto-generates on load, 8 rich sections, copy as markdown, start building CTA)
3. `/favorites` -- Build queue (saved ideas + cached specs)

## Data Flow

- Homepage: GET /api/ideas?category=all -> fetches HN+GitHub -> feeds to LLM -> returns ProductIdea[]
- Build page: POST /api/build-spec with ProductIdea -> returns BuildSpec with 8 sections
- Idea data passed between pages via localStorage (storeTempIdea/getTempIdea)
- Specs auto-cached in localStorage (getCachedSpec/cacheSpec)
- Ideas auto-saved to favorites when spec is generated
- Fallback: if LLM fails, static ideas from src/lib/fallback-ideas.ts

## Key Types

- ProductIdea: id, name, pitch, category, whyNow, risk, complexity
- BuildSpec: productName, whatYoureBuilding, whoWantsThis, whyThisCouldWork, coreFeatures, techStack, buildPlan, v2Ideas, risks, complexity
