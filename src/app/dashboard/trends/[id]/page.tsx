'use client'

import { use } from 'react'
import { OpportunityDetail } from './opportunity-detail'

export default function OpportunityPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <OpportunityDetail trendId={id} />
}
