import type { Calf, MarketSnapshot } from './types'

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

export function exportFullCSV(calves: readonly Calf[]): string {
  const headers = [
    'Product Name',
    'Status',
    'Niche',
    'One-Line Pitch',
    'Target Audience',
    'Market Score',
    'Competition Score',
    'Complexity Score',
    'Revenue Score',
    'AI Buildability Score',
    'Overall Score',
    'Confidence',
    'Verification %',
    'Build Days (Min)',
    'Build Days (Max)',
    'Pricing ($/mo)',
    'Revenue Potential Min',
    'Revenue Potential Max',
    'Monthly Revenue',
    'Monetization Model',
    'Micro Price',
    'Micro Build Days',
    'Standard Price',
    'Standard Build Days',
    'Premium Price',
    'Premium Build Days',
    'Core Features',
    'Differentiation',
  ].join(',')

  const rows = calves.map((c) =>
    [
      `"${c.productName}"`,
      c.status,
      `"${c.niche}"`,
      `"${c.oneLinePitch.replace(/"/g, '""')}"`,
      `"${c.targetAudience.replace(/"/g, '""')}"`,
      c.marketDemandScore,
      c.competitionDensityScore,
      c.buildComplexityScore,
      c.revenuePotentialScore,
      c.aiBuildabilityScore,
      c.overallScore,
      c.confidenceLevel,
      c.verificationPercentage,
      c.buildDaysMin,
      c.buildDaysMax,
      c.pricingRecommendation,
      c.revenuePotentialMin,
      c.revenuePotentialMax,
      c.monthlyRevenue ?? 0,
      c.monetizationModel,
      c.variationLevels.micro.pricing,
      c.variationLevels.micro.buildDays,
      c.variationLevels.standard.pricing,
      c.variationLevels.standard.buildDays,
      c.variationLevels.premium.pricing,
      c.variationLevels.premium.buildDays,
      `"${c.coreFeatures.join('; ').replace(/"/g, '""')}"`,
      `"${c.differentiationAngle.replace(/"/g, '""')}"`,
    ].join(',')
  )

  return [headers, ...rows].join('\n')
}

export function exportSnapshotsCSV(snapshots: readonly MarketSnapshot[]): string {
  const headers = [
    'Niche',
    'Date',
    'Products Count',
    'Competitors Count',
    'Complaints Count',
    'Top Products',
    'Top Competitors',
    'Top Complaints',
  ].join(',')

  const rows = snapshots.map((s) =>
    [
      `"${s.niche}"`,
      new Date(s.createdAt).toLocaleDateString(),
      s.trendingProducts.length,
      s.competitorLandscape.length,
      s.reviewComplaintClusters.length,
      `"${s.trendingProducts.map((p) => p.name).join('; ')}"`,
      `"${s.competitorLandscape.map((c) => `${c.company} (${c.pricing})`).join('; ')}"`,
      `"${s.reviewComplaintClusters.map((c) => `${c.complaintTheme} (${c.frequency}%)`).join('; ')}"`,
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
