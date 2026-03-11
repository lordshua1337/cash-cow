import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/ai/llm'
import type { TrendingProduct, BuildSpec } from '@/lib/types'

const SYSTEM_PROMPT = `You are a product advisor who creates build specs. The spec has two audiences:
1. A human who needs to understand what they're building (plain English summaries)
2. An AI coding assistant (Claude Code) that will receive the Markdown output and actually build it (needs real technical detail)

You will receive a trending product/project. Return ONLY valid JSON matching this exact shape (no markdown, no code fences):
{
  "productName": "string - a catchy, memorable product name",
  "whatItDoes": "string - 2-3 sentences a non-technical person can understand",
  "whoItsFor": "string - describe the specific person, not a vague audience",
  "coreFeatures": ["string array - 5-8 MVP features, described in plain English"],
  "techStack": ["string array - specific technologies with brief why, e.g. 'Next.js - handles frontend and API routes in one project'"],
  "mvpScope": "string - what ships in v1 and what waits, 2-3 sentences",
  "complexity": "one of: weekend | few-weeks | month-plus",
  "buildSteps": ["string array - 8-12 ordered build steps. Each step should be specific enough for Claude Code to execute: include file paths, component names, API routes, database tables. Example: 'Create /app/api/upload/route.ts - POST endpoint that accepts CSV, parses with papaparse, validates columns, stores in Supabase uploads table' NOT 'Set up the upload feature'"]
}

Rules:
- whatItDoes, whoItsFor, coreFeatures, mvpScope = plain English for the human
- techStack, buildSteps = real technical detail for Claude Code
- Build steps must be specific: file paths, endpoint shapes, database schema hints, component names
- Each build step should be independently executable -- Claude Code should be able to take one step and run with it
- Tech stack should be practical solo-builder choices (Next.js, Supabase, Tailwind, shadcn, Vercel)
- MVP scope should be ruthlessly focused`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = body.product as TrendingProduct

    if (!product?.title) {
      return NextResponse.json({ error: 'Missing product data' }, { status: 400 })
    }

    const userPrompt = `Here's a trending product/project I want to build my own version of:

Name: ${product.title}
Description: ${product.description}
Source: ${product.source === 'hackernews' ? 'Hacker News (Show HN)' : 'GitHub Trending'}
Popularity: ${product.source === 'hackernews' ? `${product.score} upvotes, ${product.commentCount} comments` : `${product.score} stars`}
Category: ${product.category}
URL: ${product.url}

Write me a complete build spec for creating my own version of this. Make it practical for a solo builder.`

    const raw = await callLLM(SYSTEM_PROMPT, userPrompt, 4000)

    // Parse the JSON response, handling potential markdown fences
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const spec: BuildSpec = JSON.parse(cleaned)

    return NextResponse.json({ spec })
  } catch (err) {
    console.error('Build spec error:', err)
    const message = err instanceof Error ? err.message : 'Failed to generate spec'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
