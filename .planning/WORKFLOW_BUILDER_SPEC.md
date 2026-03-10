# Cash Cow -- Workflow Builder Spec

**Status:** APPROVED BY JOSH (2026-03-10)
**Vision:** Turn "I have an idea" (or "I need an idea") into a deployable build spec.
**Core insight:** Not a dashboard. A guided workflow. Discover -> Research -> Gap -> Spec -> Ship.

---

## The Problem

Anyone can bring an idea to life with AI coding tools now. But not everyone picks ideas that make money. Cash Cow fixes that by finding what's trending, researching competitors, identifying the gap nobody fills, and generating a complete build spec ready for Claude Code.

## User Journey (5 Steps)

### Step 1: Discover -- "What's hot right now?"

User browses trending products/apps/websites organized by category.

**Data sources (free APIs):**
- Product Hunt GraphQL API (free with OAuth token) -- daily/weekly trending products, upvotes, categories
- Hacker News Firebase API (free) -- top stories, Show HN product launches
- GitHub Trending (unofficial API or scrape) -- trending repos by language/timeframe
- Google Trends (SerpAPI free tier or pytrends proxy) -- search volume validation

**UI:**
- Cards showing: name, category, upvotes/stars, growth signal, one-liner description
- Filter by category: SaaS, mobile app, dev tool, marketplace, AI tool, etc.
- Sort by: trending now, this week, this month
- Live ticker/feed feel -- things are moving, this is happening NOW

**User action:** Pick a trending product/category that sparks an idea, OR type their own niche.

### Step 2: Research -- "Who's already doing this?"

Auto-triggered after Step 1 selection. Claude AI researches the space.

**Output (MarketSnapshot):**
- Competitor list: name, pricing, core features, tech stack, estimated traffic
- Review complaint clusters: what users hate, common pain points, sentiment
- Market size signals: how many competitors, pricing range, demand indicators

**UI:**
- Competitor cards with feature comparison table
- Complaint clusters highlighted (these become gap fuel)
- "The landscape" summary from Claude

**Existing infrastructure:** `/api/research` route + `lib/ai/claude.ts` researchNiche() already does this. Wire it up to the workflow instead of the Pasture page.

### Step 3: Find the Gap -- "What's missing?"

THE CORE DIFFERENTIATOR. This is what makes Cash Cow valuable.

Claude analyzes everything from Step 2 and identifies:
- What EVERY competitor does (commodity features -- table stakes)
- What users COMPLAIN about (pain points nobody solves)
- What NOBODY does well (the actual gap)

**Output:**
- 3-5 gap opportunities, each with:
  - Gap title (e.g., "No competitor offers real-time collaboration")
  - Why it matters (user pain + market demand)
  - Build feasibility score (can you actually build this?)
  - Revenue potential score
  - Differentiation strength (how hard is this for competitors to copy?)

**UI:**
- Ranked gap cards
- Each gap shows which competitors fail at it and which complaints it solves
- User PICKS their gap -- this becomes the product's differentiator

**New feature:** This step doesn't exist yet. Needs a new Claude prompt + API route + UI.

### Step 4: Build the Spec -- "Here's your blueprint"

Claude generates a FULL build spec using everything gathered:

**Spec contents:**
```markdown
# [Product Name]
> [One-liner pitch]

## Overview
- Target audience
- Core problem being solved
- Differentiation angle (the gap from Step 3)
- Why this wins vs competitors

## Competitor Landscape
- Table: competitor | pricing | key features | weakness
- Your advantage over each

## Core Features (MVP)
- Feature 1: description, priority, complexity
- Feature 2: ...
- (Ordered by: must-have first, nice-to-have last)

## Full Feature List
- MVP features
- V2 features
- Future features

## Monetization
- Model (SaaS, freemium, one-time, usage-based)
- Pricing tiers with feature breakdown
- Revenue projection (conservative/moderate/aggressive)

## Tech Stack
- Framework recommendation
- Database
- Auth
- Payments
- Hosting
- Key libraries

## Database Schema
- Tables with columns and relationships
- RLS policy notes

## API Routes
- Endpoint list with methods and descriptions

## Page Structure
- Route list with page descriptions
- Component hierarchy

## Build Order
- Phase 1: Core MVP (what to build first)
- Phase 2: Launch features
- Phase 3: Growth features

## Environment Variables
- All required env vars with descriptions
```

**UI:**
- Live preview of the spec as it generates (streaming)
- Rendered markdown view
- Tabs: Overview | Technical | Full Spec

**Existing infrastructure:** Brief generation exists (`/api/brief`) but outputs a lighter version. Needs to be upgraded to full Claude Code-ready spec.

### Step 5: Ship It -- "Go build"

**Actions:**
- "Copy to Clipboard" -- copies full spec markdown
- "Download .md" -- saves as file
- "Save to My Specs" -- stores in Supabase for their account
- "Open in Claude Code" -- generates a terminal command they can paste

**UI:**
- Clean spec preview
- Big action buttons
- "What's next?" guidance (set up repo, run Claude Code, etc.)

---

## Design Theme: COW PRINT. FUN. NOT BORING SAAS.

This is called CASH COW. It should FEEL like it. Playful, bold, memorable.
Not another dark mode tech dashboard. This thing has PERSONALITY.

### Color Palette
- **Primary:** Black & white cow print pattern (used as backgrounds, borders, accents)
- **Background:** Warm cream/off-white (#FDF6E3 or similar) -- feels like a farm, not a terminal
- **Accent green:** Fresh grass green (#22C55E or #4ADE80) -- money + pasture vibes
- **Accent gold:** Cash gold (#F59E0B or #FBBF24) -- money, coins, success
- **Text:** Rich dark brown/charcoal (#292524) -- not pure black, warmer
- **Cards/surfaces:** White with subtle warm shadows, cow-spot borders or accents

### Cow Print Usage
- Hero background: subtle cow print pattern (CSS radial gradients or SVG)
- Section dividers: cow print strips
- Button hover states: flash of cow print
- Loading states: cow print pulse animation
- Card borders or corner accents: cow spots
- NOT overwhelming -- used as texture/accent, not wallpaper on every pixel

### Typography
- Headlines: Big, bold, rounded -- something fun like "Fredoka One", "Bungee", or "Lilita One"
- Body: Clean and readable -- "Inter", "DM Sans", or "Nunito"
- The vibe is friendly and approachable, not corporate

### Iconography & Illustrations
- Cow-themed where it makes sense:
  - Step 1 (Discover): Binoculars or magnifying glass with cow spots
  - Step 2 (Research): Cow detective / monocle
  - Step 3 (Gap): Fence with a gap in it (literal)
  - Step 4 (Spec): Blueprint scroll with cow stamp
  - Step 5 (Ship): Rocket cow or cow with sunglasses
- Can use simple illustrated cows or just cow-print textures
- Keep it tasteful-fun, not childish

### Micro-Interactions
- Buttons: Bouncy hover (scale up slightly + shadow)
- Step transitions: Smooth slide with a subtle "moo" sound effect option (toggleable, off by default)
- Success states: Confetti or gold coins animation
- Loading: Animated cow spots appearing/disappearing
- Progress bar between steps: Grass/field filling up as you progress

### Personality in Copy
- Not corporate. Not "leverage synergies." Talk like a friend.
- Step 1: "Let's see what's mooo-ving" or just "What's hot right now?"
- Step 3: "Here's where everyone else drops the ball"
- Step 5: "Go build this thing"
- Error states: "Whoops, the cow tripped" not "An error occurred"
- Loading: "Grazing the internet..." not "Loading data..."
- Empty states: "Your pasture is empty -- let's find some ideas"

### The Cow Metaphors (keep these, they're fun)
- Pasture = browsing/discovery area
- Calf = a new product idea
- Herd = your collection of ideas/specs
- Milking = generating revenue
- Cash Cow = the proven winner
- Grazing = exploring/researching phase
- Golden Udder = the gap that prints money

---

## Landing Page

**Hero:**
- Big cow-print background pattern (subtle, not overwhelming)
- Headline: "Anyone can bring an idea to life. Not everyone picks ideas that make money."
- Subline: "Cash Cow finds what's trending, spots the gap, and hands you a build spec. From zero to blueprint in 5 minutes."
- CTA button: "Find Your Next Cash Cow" (green, bouncy, cow-spot border on hover)
- Live trending ticker underneath (real Product Hunt data, scrolling)
- Animated cow mascot or cow-print logo mark

**Value props (3 cards on cream background):**
1. "See what's selling" -- Browse trending products, apps, and tools updated daily
2. "Find the gap" -- AI analyzes competitors and finds what nobody does well
3. "Get your spec" -- Complete build blueprint ready for Claude Code

**Social proof / example:**
- Show a sample spec output in a card with cow-print border
- "Built with Cash Cow" examples (if any exist later)

---

## Technical Changes

### New API Routes
- `POST /api/gaps` -- Claude gap analysis (takes research data, returns ranked gaps)
- `POST /api/spec` -- Full spec generation (takes gap + research, returns build spec MD)
- `GET /api/trends/live` -- Aggregates Product Hunt + HN + GitHub trending data

### New Components
- `WorkflowStepper` -- Progress bar showing current step (1-5)
- `TrendBrowser` -- Step 1 trending product browser with filters
- `GapFinder` -- Step 3 gap analysis results with selection
- `SpecPreview` -- Step 4 rendered spec with tabs
- `ShipActions` -- Step 5 copy/download/save buttons

### Modified
- Landing page (`/app/page.tsx`) -- Complete redesign
- Dashboard layout -- Workflow steps replace tab navigation
- Research route -- Feeds into workflow instead of standalone Pasture

### What Stays As-Is
- Supabase auth + database
- Claude AI integration (extended, not replaced)
- Scoring system (repurposed for gap ranking)
- Export utilities (PDF + Markdown)
- Error logging + rate limiting

### What Gets Removed/Archived
- Pasture page as standalone (absorbed into Step 1+2 of workflow)
- Herd page as standalone (replaced by "My Herd" saved specs portfolio)
- Mock trend data (replaced by real API data)
- Trends mock-data directory (replaced by live feeds)
- The boring dark SaaS aesthetic (replaced by cow print theme)

### What STAYS (important)
- ALL cow metaphors -- Pasture, Calf, Herd, Milking, Grazing. These are the brand.
- The fun personality. This is Cash Cow, not "Market Research Platform."

### Free API Integration Details

**Product Hunt GraphQL API:**
- Endpoint: `https://api.producthunt.com/v2/api/graphql`
- Auth: OAuth2 token (free developer account)
- Query: posts(order: VOTES, first: 20) for trending
- Rate limit: 450 requests/day (free tier)
- Env var: `PRODUCT_HUNT_API_TOKEN` (already stubbed)

**Hacker News API:**
- Endpoint: `https://hacker-news.firebaseio.com/v0/`
- No auth required
- `/topstories.json`, `/newstories.json`, `/beststories.json`
- `/item/{id}.json` for details
- Rate limit: None (be reasonable)

**GitHub Trending:**
- Unofficial: `https://api.gitterapp.com/repositories` or scrape `github.com/trending`
- No auth required
- Filter by language, timeframe (daily/weekly/monthly)

**Google Trends (optional, for validation):**
- SerpAPI free tier (100 searches/month) or
- Direct Google Trends RSS: `https://trends.google.com/trending/rss`

---

## Build Order

### Phase 1: Foundation (landing page + workflow skeleton)
- [ ] Redesign landing page with new copy and design
- [ ] Build WorkflowStepper component
- [ ] Create workflow route structure (`/workflow/step-1` through `/workflow/step-5`)
- [ ] Wire up step navigation (forward/back, state persistence)

### Phase 2: Discover (Step 1 -- live trend data)
- [ ] Build Product Hunt API integration
- [ ] Build Hacker News API integration
- [ ] Build GitHub Trending integration
- [ ] Create aggregation layer (combine all sources)
- [ ] Build TrendBrowser UI with filters and categories
- [ ] Cache trend data (Supabase or Redis, refresh every few hours)

### Phase 3: Research + Gap (Steps 2-3)
- [ ] Wire existing research API into workflow
- [ ] Build new `/api/gaps` route with Claude prompt
- [ ] Build GapFinder UI component
- [ ] Gap ranking and selection flow

### Phase 4: Spec + Ship (Steps 4-5)
- [ ] Build new `/api/spec` route with full spec Claude prompt
- [ ] Build SpecPreview component with streaming
- [ ] Build ShipActions component (copy, download, save)
- [ ] Save specs to Supabase
- [ ] "My Specs" portfolio page

### Phase 5: Polish
- [ ] Mobile responsive
- [ ] Loading states and error handling
- [ ] Rate limiting on all API routes
- [ ] Screenshot + visual verification
- [ ] Deploy and verify on Vercel

---

## Success Criteria

A user with ZERO idea can:
1. Open Cash Cow
2. Browse what's trending
3. Pick something interesting
4. See who's competing and what they suck at
5. Choose a gap to exploit
6. Get a complete build spec
7. Paste it into Claude Code and start building

Total time: under 10 minutes from landing to spec in hand.
