import type { Calf } from '@/lib/types'

export async function generateBriefPDF(calf: Calf, briefContent: string): Promise<void> {
  // Dynamic import since html2pdf.js is browser-only
  const html2pdf = (await import('html2pdf.js')).default

  const scoreColor = calf.overallScore >= 70 ? '#059669' : calf.overallScore >= 50 ? '#D97706' : '#DC2626'

  const html = `
    <div style="font-family: 'Inter', -apple-system, sans-serif; color: #3D2B1F; max-width: 700px; margin: 0 auto;">
      <!-- Cover page -->
      <div style="text-align: center; padding: 60px 40px; border-bottom: 3px solid #D97706; margin-bottom: 40px;">
        <div style="font-size: 12px; color: #8B7355; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
          Cash Cow Product Brief
        </div>
        <h1 style="font-size: 36px; font-weight: 900; margin: 0 0 8px 0; color: #3D2B1F;">
          ${calf.productName}
        </h1>
        <p style="font-size: 16px; color: #8B7355; margin: 0 0 24px 0;">
          ${calf.oneLinePitch}
        </p>
        <div style="display: inline-block; padding: 12px 32px; border-radius: 12px; background: ${scoreColor}15; border: 2px solid ${scoreColor};">
          <span style="font-size: 48px; font-weight: 900; color: ${scoreColor};">${calf.overallScore}</span>
          <span style="display: block; font-size: 11px; color: #8B7355;">Overall Score</span>
        </div>
      </div>

      <!-- Key metrics -->
      <div style="display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 140px; padding: 12px; border-radius: 8px; background: #FFF8F0; border: 1px solid #F5E6D3;">
          <div style="font-size: 10px; color: #8B7355;">Niche</div>
          <div style="font-size: 14px; font-weight: 700;">${calf.niche}</div>
        </div>
        <div style="flex: 1; min-width: 140px; padding: 12px; border-radius: 8px; background: #FFF8F0; border: 1px solid #F5E6D3;">
          <div style="font-size: 10px; color: #8B7355;">Build Time</div>
          <div style="font-size: 14px; font-weight: 700;">${calf.buildDaysMin}-${calf.buildDaysMax} days</div>
        </div>
        <div style="flex: 1; min-width: 140px; padding: 12px; border-radius: 8px; background: #FFF8F0; border: 1px solid #F5E6D3;">
          <div style="font-size: 10px; color: #8B7355;">Pricing</div>
          <div style="font-size: 14px; font-weight: 700;">$${calf.pricingRecommendation}/mo</div>
        </div>
        <div style="flex: 1; min-width: 140px; padding: 12px; border-radius: 8px; background: #FFF8F0; border: 1px solid #F5E6D3;">
          <div style="font-size: 10px; color: #8B7355;">Revenue Potential</div>
          <div style="font-size: 14px; font-weight: 700; color: #059669;">$${(calf.revenuePotentialMin / 1000).toFixed(0)}K-$${(calf.revenuePotentialMax / 1000).toFixed(0)}K/mo</div>
        </div>
      </div>

      <!-- Scores -->
      <div style="margin-bottom: 32px; padding: 16px; border-radius: 8px; background: #FFF8F0; border: 1px solid #F5E6D3;">
        <div style="font-size: 12px; font-weight: 700; color: #8B7355; margin-bottom: 8px;">SCORES</div>
        <div style="display: flex; gap: 24px; text-align: center;">
          <div><div style="font-size: 20px; font-weight: 900; color: #D97706;">${calf.marketDemandScore}</div><div style="font-size: 10px; color: #8B7355;">Market</div></div>
          <div><div style="font-size: 20px; font-weight: 900; color: ${calf.competitionDensityScore <= 40 ? '#059669' : '#EA580C'};">${calf.competitionDensityScore}</div><div style="font-size: 10px; color: #8B7355;">Competition</div></div>
          <div><div style="font-size: 20px; font-weight: 900; color: ${calf.buildComplexityScore <= 40 ? '#059669' : '#EA580C'};">${calf.buildComplexityScore}</div><div style="font-size: 10px; color: #8B7355;">Complexity</div></div>
          <div><div style="font-size: 20px; font-weight: 900; color: #D97706;">${calf.revenuePotentialScore}</div><div style="font-size: 10px; color: #8B7355;">Revenue</div></div>
          <div><div style="font-size: 20px; font-weight: 900; color: #2563EB;">${calf.aiBuildabilityScore}</div><div style="font-size: 10px; color: #8B7355;">AI Build</div></div>
        </div>
      </div>

      <!-- Brief content -->
      <div style="font-size: 13px; line-height: 1.7; color: #3D2B1F;">
        ${briefContent
          .replace(/## /g, '<h2 style="font-size: 18px; font-weight: 900; margin: 24px 0 8px 0; color: #3D2B1F; border-bottom: 1px solid #F5E6D3; padding-bottom: 4px;">')
          .replace(/### /g, '<h3 style="font-size: 15px; font-weight: 700; margin: 16px 0 6px 0; color: #3D2B1F;">')
          .replace(/\n/g, '<br>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/- /g, '<span style="color: #D97706; margin-right: 4px;">-</span>')
        }
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 16px; border-top: 2px solid #D97706; text-align: center;">
        <div style="font-size: 10px; color: #B8A089;">
          Generated by Cash Cow -- ${new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  `

  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    await html2pdf()
      .set({
        margin: [10, 15, 10, 15],
        filename: `${calf.productName.toLowerCase().replace(/\s+/g, '-')}-brief.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      } as Record<string, unknown>)
      .from(container)
      .save()
  } finally {
    document.body.removeChild(container)
  }
}
