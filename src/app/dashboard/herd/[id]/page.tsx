import { CalfDetail } from './calf-detail'

export default async function CalfDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CalfDetail calfId={id} />
}
