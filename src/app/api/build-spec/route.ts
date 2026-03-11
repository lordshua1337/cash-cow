import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/ai/llm'
import type { ProductIdea, BuildSpec } from '@/lib/types'

const SYSTEM_PROMPT = `You are a senior product advisor writing build specs for solo builders who use AI coding tools (Claude Code, Cursor, etc.).

You will receive a product idea. Return ONLY valid JSON (no markdown, no code fences) matching this exact shape:

{
  "productName": "string - the product name",
  "whatYoureBuilding": "string - 2-3 sentences a friend would understand. No jargon.",
  "whoWantsThis": "string - a SPECIFIC person (not 'businesses' -- 'freelance designers who spend 3 hours a week chasing invoices'). What pain they have. Why they'd pay.",
  "whyThisCouldWork": "string - honest assessment. What signals support this. What competition looks like. What gap you're filling. NOT blind hype.",
  "coreFeatures": ["string array - 5-8 MVP features. Each one is a sentence a human understands ('Users upload a CSV and instantly see a chart they can customize and export'). Not developer-speak."],
  "techStack": [{"tool": "string", "why": "string - one line why"}],
  "buildPlan": ["string array - 8-12 SPECIFIC ordered steps. Each step must be concrete enough to paste into Claude Code as an instruction. Include file paths, table schemas, component names. BAD: 'Set up authentication'. GOOD: 'Create Supabase Auth with magic link login. Build a /login page with email input. Add middleware to protect /dashboard routes. Store user profile in a profiles table with columns: id, email, display_name, created_at.'"],
  "v2Ideas": ["string array - 3-4 features to add after MVP ships"],
  "risks": ["string array - 2-3 honest things that could go wrong. 'If you can't get 10 beta users in the first week, this market might not exist.'"],
  "complexity": "one of: weekend | few-weeks | month-plus"
}

Critical rules:
- Write for a solo builder using AI coding tools (Claude Code, Cursor)
- Build plan steps must be SPECIFIC enough to execute -- file paths, table schemas, component names, endpoint shapes
- Be honest about risks -- don't hype. Builders respect honesty more than cheerleading
- Tech stack should be practical: Next.js + Supabase + Tailwind + Vercel
- MVP scope should be ruthlessly small -- what ships in one weekend
- The human-readable parts (what, who, why) should sound like a smart friend talking, not a consultant
- Each build step should reference real files: /app/page.tsx, /app/api/..., etc.
- V2 ideas should be ambitious but realistic follow-ups`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const idea = body.idea as ProductIdea

    if (!idea?.name) {
      return NextResponse.json({ error: 'Missing idea data' }, { status: 400 })
    }

    const userPrompt = `Here's a product idea I want to build:

Name: ${idea.name}
Pitch: ${idea.pitch}
Category: ${idea.category}
Why now: ${idea.whyNow}
Biggest risk: ${idea.risk}
Estimated complexity: ${idea.complexity}

Write me a complete, actionable build spec. Make the build plan steps specific enough that I can paste each one into Claude Code and it will know exactly what to build. Include real file paths, database schemas, and component names.`

    const raw = await callLLM(SYSTEM_PROMPT, userPrompt, 6000)

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const spec: BuildSpec = JSON.parse(cleaned)

    return NextResponse.json({ spec })
  } catch (err) {
    console.error('Build spec error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate spec'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
