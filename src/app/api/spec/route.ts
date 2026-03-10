import { NextRequest, NextResponse } from 'next/server'
import { callLLM } from '@/lib/ai/llm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { snapshot, gap, niche } = body

    if (!snapshot || !gap || !niche) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const systemPrompt = `You are a senior product architect who creates complete, actionable build specifications.

Generate a FULL BUILD SPEC in Markdown format. This spec should be ready to paste directly into Claude Code (AI coding assistant) to start building immediately.

The spec MUST include ALL of these sections:

# [Product Name]
> [One-liner pitch]

## Overview
- What it does (2-3 sentences)
- Target audience
- The gap it fills (why this wins)
- Key differentiator vs competitors

## Competitor Landscape
Table: competitor | pricing | key features | their weakness (your advantage)

## Core Features (MVP)
Numbered list. Each feature: name, description, why it matters, complexity (low/medium/high)

## Full Feature Roadmap
- MVP (launch with these)
- V2 (add within 30 days)
- V3 (future growth)

## Monetization
- Business model
- Pricing tiers (free/starter/pro) with feature breakdown
- Revenue projections (conservative, moderate, aggressive)

## Tech Stack
- Frontend, backend, database, auth, payments, hosting, key libraries
- Why each choice (one sentence)

## Database Schema
- Tables with columns, types, and relationships
- Include RLS policy notes for Supabase

## API Routes
- Endpoint | Method | Description | Auth required?

## Page Structure
- Route | Page name | Key components | Notes

## Build Order
- Phase 1: MVP (week 1-2) - what to build first
- Phase 2: Launch (week 3-4) - what to add before launch
- Phase 3: Growth (month 2+) - what comes after

## Environment Variables
- List all required env vars with descriptions
- Group by service

Be SPECIFIC. Real table names, real API endpoints, real component names. This isn't a concept doc -- it's a build plan a developer (or AI) can execute on day one.

Start with a creative but professional product name that relates to the niche.`

    const competitors = snapshot.competitorLandscape.map((c: { company: string; pricing: string; keyFeatures: readonly string[]; complaints: readonly string[] }) => ({
      company: c.company,
      pricing: c.pricing,
      features: c.keyFeatures,
      weaknesses: c.complaints,
    }))

    const userPrompt = `Build a complete spec for a product in the "${niche}" space.

THE GAP TO EXPLOIT:
Title: ${gap.title}
Description: ${gap.description}
Why it matters: ${gap.whyItMatters}
Complaints it solves: ${gap.complaintsAddressed.join(', ')}
Feasibility: ${gap.feasibilityScore}/10
Revenue potential: ${gap.revenueScore}/10

COMPETITOR DATA:
${JSON.stringify(competitors, null, 2)}

USER COMPLAINTS IN THIS SPACE:
${JSON.stringify(snapshot.reviewComplaintClusters.map((c: { complaintTheme: string; frequency: number }) => ({
  theme: c.complaintTheme,
  frequency: c.frequency,
})), null, 2)}

Generate the full build spec now.`

    const spec = await callLLM(systemPrompt, userPrompt, 8000)

    // Extract product name from first heading
    const nameMatch = spec.match(/^#\s+(.+?)$/m)
    const productName = nameMatch ? nameMatch[1].trim() : 'Your Product'

    return NextResponse.json({ spec, productName })
  } catch (err) {
    console.error('Spec generation error:', err)
    return NextResponse.json({ error: 'Spec generation failed' }, { status: 500 })
  }
}
