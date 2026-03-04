import type { Calf, BuildPlaybook, PlaybookWeek } from '@/lib/types'

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY not configured')
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  const content = data.content?.[0]
  if (content?.type === 'text') return content.text
  throw new Error('Unexpected Claude response format')
}

interface RawPlaybook {
  totalWeeks: number
  weeks: Array<{
    week: number
    title: string
    tasks: Array<{ task: string; details: string }>
    deliverables: string[]
    techStack: string[]
  }>
  keyMilestones: string[]
}

export async function generatePlaybook(
  calf: Calf,
  variationLevel: 'micro' | 'standard' | 'premium'
): Promise<BuildPlaybook> {
  const variation = calf.variationLevels[variationLevel]

  const system = `You are a senior product engineer who creates week-by-week build playbooks.

Return ONLY valid JSON with this structure:
{
  "totalWeeks": number,
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "tasks": [{ "task": "Task name", "details": "What to build" }],
      "deliverables": ["Deliverable 1"],
      "techStack": ["Next.js", "Supabase"]
    }
  ],
  "keyMilestones": ["Milestone 1", "Milestone 2"]
}

Rules:
- Each week should have 3-5 specific tasks
- Tasks should be actionable (not vague)
- Include specific tech stack per week
- Week 1 is always setup/foundation
- Last week includes polish, testing, launch prep
- Include 3-5 key milestones`

  const buildDays = variation.buildDays
  const totalWeeks = Math.max(1, Math.ceil(buildDays / 7))

  const userPrompt = `Create a ${totalWeeks}-week build playbook for:

Product: ${calf.productName} (${variation.name} - ${variationLevel} version)
Features: ${JSON.stringify(variation.features)}
Build Time: ${buildDays} days (~${totalWeeks} weeks)
Pricing: $${variation.pricing}/mo
Target Audience: ${calf.targetAudience}
Differentiation: ${calf.differentiationAngle}
Core Features (full product): ${JSON.stringify(calf.coreFeatures)}`

  const response = await callClaude(system, userPrompt)
  const match = response.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in playbook response')
  const raw: RawPlaybook = JSON.parse(match[0])

  return {
    calfId: calf.id,
    variationLevel,
    totalWeeks: raw.totalWeeks,
    weeks: raw.weeks.map((w): PlaybookWeek => ({
      week: w.week,
      title: w.title,
      tasks: w.tasks,
      deliverables: w.deliverables,
      techStack: w.techStack,
    })),
    keyMilestones: raw.keyMilestones,
  }
}
