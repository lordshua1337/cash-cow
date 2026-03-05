'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/auth/client'
import Link from 'next/link'
import { Beef, Mail, Loader2, ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleDemoLogin() {
    document.cookie = 'demo-auth=true; path=/; max-age=86400'
    router.push('/dashboard/pasture')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)

    const supabase = createSupabaseBrowser()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ background: 'var(--cash-soft)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <Beef className="w-5 h-5" style={{ color: 'var(--cash)' }} />
          </div>
          <span className="text-xl font-bold">Cash Cow</span>
        </div>

        {sent ? (
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: 'var(--cash-soft)' }}
            >
              <Mail className="w-6 h-6" style={{ color: 'var(--cash)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              We sent a magic link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="text-sm transition-colors"
              style={{ color: 'var(--cash)' }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2">Sign in</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              No password needed. We send you a magic link.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg text-sm transition-colors focus:outline-none"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />

              {error && (
                <p className="mt-2 text-sm" style={{ color: 'var(--red)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full mt-4 px-4 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'var(--cash)', color: '#FFFFFF' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid var(--border)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>or</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Demo Login (test@test.com)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
