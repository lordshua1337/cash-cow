import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/ai/llm'
import type { BuildSpec } from '@/lib/types'

const SYSTEM_PROMPT = `You are a senior product advisor helping a solo builder remix their build spec.

You will receive:
1. The current build spec (JSON)
2. The user's remix instruction -- what they want to change, in their own words

Your job: regenerate the ENTIRE spec incorporating the user's change. Keep everything that isn't affected by the change. If the change logically affects multiple sections (e.g., changing the target audience affects who-wants-this, core-features, and build-plan), update ALL affected sections.

Return ONLY valid JSON (no markdown, no code fences) matching this exact shape:

{
  "productName": "string",
  "whatYoureBuilding": "string - 2-3 sentences, no jargon",
  "whoWantsThis": "string - specific person, their pain, why they'd pay",
  "whyThisCouldWork": "string - honest market assessment",
  "coreFeatures": ["string array - 5-8 MVP features in plain English"],
  "techStack": [{"tool": "string", "why": "string"}],
  "buildPlan": ["string array - 8-12 specific steps with file paths, schemas, component names"],
  "v2Ideas": ["string array - 3-4 post-MVP features"],
  "risks": ["string array - 2-3 honest risks"],
  "complexity": "weekend | few-weeks | month-plus",
  "monetizationModel": "string - how this makes money (optional, include if present in original)",
  "pricingStrategy": "string - pricing tiers (optional, include if present in original)",
  "revenueTimeline": "string - revenue projections (optional, include if present in original)",
  "customerAcquisition": "string - how to get customers (optional, include if present in original)"
}

If the original spec has monetization fields (monetizationModel, pricingStrategy, revenueTimeline, customerAcquisition), include them in the output and update them if the remix logically affects them.

Rules:
- Honor the user's remix instruction precisely
- Cascade the change: if they change the audience, the features/build-plan/risks should adapt too
- Keep the tone: smart friend, not consultant
- Build steps must stay SPECIFIC (file paths, table schemas, endpoints)
- Tech stack: Next.js + Supabase + Tailwind + Vercel unless the user asks otherwise
- Be honest about risks even after remixing`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const currentSpec = body.spec as BuildSpec
    const remixInstruction = body.instruction as string
    const sectionHint = body.section as string | undefined

    if (!currentSpec?.productName || !remixInstruction?.trim()) {
      return NextResponse.json({ error: 'Missing spec or instruction' }, { status: 400 })
    }

    const sectionContext = sectionHint
      ? `\n\nThe user clicked on the "${sectionHint}" section specifically, but you should still update ALL sections that are logically affected by this change.`
      : ''

    const userPrompt = `Here's the current build spec:

${JSON.stringify(currentSpec, null, 2)}

The user wants to change:
"${remixInstruction}"${sectionContext}

Regenerate the entire spec incorporating this change. Keep everything else the same unless the change logically affects it.`

    const raw = await callLLM(SYSTEM_PROMPT, userPrompt, 6000)

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const spec: BuildSpec = JSON.parse(cleaned)

    return NextResponse.json({ spec })
  } catch (err) {
    console.error('Remix spec error:', err)
    const message = err instanceof Error ? err.message : 'Failed to remix spec'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
