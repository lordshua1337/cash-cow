import type { Calf } from './types'

export function exportBriefAsMarkdown(calf: Calf, briefMarkdown: string): string {
  return `# ${calf.productName}

**One-liner:** ${calf.oneLinePitch}

**Target Audience:** ${calf.targetAudience}

**Estimated Build Time:** ${calf.buildDaysMin}-${calf.buildDaysMax} days

**Monetization:** ${calf.monetizationModel}

**Pricing:** $${calf.pricingRecommendation}/mo

---

${briefMarkdown}

---

**Scores:**
- Market Demand: ${calf.marketDemandScore}/100
- Competition: ${calf.competitionDensityScore}/100
- Build Complexity: ${calf.buildComplexityScore}/100
- Revenue Potential: ${calf.revenuePotentialScore}/100
- AI Buildability: ${calf.aiBuildabilityScore}/100
- **Overall: ${calf.overallScore}/100**
`
}

export function exportPortfolioCSV(calves: readonly Calf[]): string {
  const headers = [
    'Product Name',
    'Status',
    'Niche',
    'Market Score',
    'Revenue Score',
    'Overall Score',
    'Build Days (Min)',
    'Build Days (Max)',
    'Monthly Revenue',
    'Confidence',
  ].join(',')

  const rows = calves.map((c) =>
    [
      `"${c.productName}"`,
      c.status,
      `"${c.niche}"`,
      c.marketDemandScore,
      c.revenuePotentialScore,
      c.overallScore,
      c.buildDaysMin,
      c.buildDaysMax,
      c.monthlyRevenue ?? 0,
      c.confidenceLevel,
    ].join(',')
  )

  return [headers, ...rows].join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
