import { MOCK_CALVES } from '@/lib/mock-data'
import { CalfDetail } from './calf-detail'

export function generateStaticParams() {
  return MOCK_CALVES.map((calf) => ({ id: calf.id }))
}

export default async function CalfDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CalfDetail calfId={id} />
}
