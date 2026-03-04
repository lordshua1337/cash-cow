const webhookConnections = (() => {
  try {
    const raw = process.env.WEBHOOK_CONNECTIONS ?? '{}'
    return JSON.parse(raw) as Record<string, string>
  } catch {
    console.warn('Failed to parse WEBHOOK_CONNECTIONS, defaulting to {}')
    return {}
  }
})()

export async function sendIdea(ideaData: {
  readonly ideaId: string
  readonly score: number
  readonly brief: string
  readonly trends: readonly string[]
  readonly competitors: readonly string[]
}): Promise<{ readonly status: string; readonly sent: boolean; readonly error?: string }> {
  const url = webhookConnections['idea-ready-pipeline']

  if (!url) {
    console.log('[WEBHOOK STUB] No downstream URL for idea-ready')
    return { status: 'stubbed', sent: false }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'CashCow',
        timestamp: new Date().toISOString(),
        ...ideaData,
      }),
    })
    if (response.ok) {
      return { status: 'sent', sent: true }
    }
    console.warn(`Webhook failed: ${url} returned ${response.status}`)
    return { status: 'sent', sent: false, error: `HTTP ${response.status}` }
  } catch (error) {
    console.warn(`Webhook error sending to ${url}:`, error)
    return { status: 'sent', sent: false, error: String(error) }
  }
}
