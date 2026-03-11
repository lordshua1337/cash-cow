# Cash Cow

Pick a monetizable product as inspiration. Make it yours. Get a build spec with pricing and revenue strategy. The spec IS the product.

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
- Groq (free) / Claude (paid) for spec generation via src/lib/ai/llm.ts
- Product Hunt API for trending products (PRODUCT_HUNT_TOKEN env var)
- localStorage for workflow state + favorites + cached specs (no auth required)
- Vercel deployment

## Pages (Workflow Builder)

1. `/` -- Landing page with marketing content + trending products preview
2. `/workflow` -- Step 1: Discover (browse trending monetizable products from Product Hunt)
3. `/workflow/customize` -- Step 2: Customize (4 sub-step wizard: audience, differentiator, features, tech)
4. `/workflow/spec` -- Step 3: Review Spec (AI-generated monetization-focused spec with remix)
5. `/workflow/export` -- Step 4: Export (copy, download, save, start building guide)
6. `/favorites` -- Build queue (saved ideas + cached specs)

## Data Flow

- Discover: GET /api/discover -> fetches Product Hunt trending -> returns TrendingMonetizableProduct[]
- Customize: Wizard state managed via React context (WorkflowProvider) + localStorage persistence
- Spec: POST /api/customize-spec with wizard data -> returns BuildSpec with 12 sections (including monetization)
- Remix: POST /api/remix-spec with spec + instruction -> returns updated BuildSpec
- Favorites: localStorage-backed (getFavorites, addFavorite, getCachedSpec, cacheSpec)
- Fallback: Static list of 20 real trending SaaS products if Product Hunt API fails

## Key Types

- TrendingMonetizableProduct: id, name, tagline, votes, comments, website, thumbnail, topics[], source, revenueSignal
- WorkflowState: selectedProduct, audience, differentiator, features[], customFeatures, techPrefs, spec, currentStep, customizeSubStep
- BuildSpec: productName, whatYoureBuilding, whoWantsThis, whyThisCouldWork, coreFeatures, techStack, buildPlan, v2Ideas, risks, complexity, monetizationModel, pricingStrategy, revenueTimeline, customerAcquisition
- ProductIdea: id, name, pitch, category, whyNow, risk, complexity (used for favorites compat)

## Architecture

- Workflow state: React context (WorkflowProvider) wrapping /workflow layout, backed by localStorage
- Product Hunt client: src/lib/sources/product-hunt.ts (GraphQL API v2)
- Workflow types/storage: src/lib/workflow/ (state.ts, storage.ts, context.tsx)
- Old /ideas and /build/[id] routes removed -- replaced by /workflow flow
