'use client'

import { useState } from 'react'
import { ArrowLeft, Copy, Download, Check, RotateCcw, Rocket, Terminal } from 'lucide-react'
import type { WorkflowState } from '@/lib/workflow-state'

interface StepShipProps {
  readonly state: WorkflowState
  readonly onBack: () => void
  readonly onReset: () => void
}

export default function StepShip({ state, onBack, onReset }: StepShipProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(state.spec)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = state.spec
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  function handleDownload() {
    const slug = state.specProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const blob = new Blob([state.spec], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}-build-spec.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🐄🚀</div>
        <h2
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Go build this thing.
        </h2>
        <p style={{ color: 'var(--brown-muted)' }}>
          Your spec for <strong>{state.specProductName}</strong> is ready. Here&apos;s how to use it.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid gap-4 mb-10 max-w-lg mx-auto">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="btn-bounce flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
          style={{
            background: copied ? 'var(--cash-soft)' : 'var(--white)',
            border: copied ? '2px solid var(--cash)' : '2px solid var(--spot-gray)',
          }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{
              background: copied ? 'var(--cash)' : 'var(--cream-dark)',
              color: copied ? '#fff' : 'var(--brown-muted)',
            }}
          >
            {copied ? <Check size={22} /> : <Copy size={22} />}
          </div>
          <div>
            <div className="font-bold text-base">
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </div>
            <div className="text-sm" style={{ color: 'var(--brown-muted)' }}>
              Paste directly into Claude Code, Cursor, or any AI coding tool
            </div>
          </div>
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="btn-bounce flex items-center gap-4 p-5 rounded-2xl text-left"
          style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)' }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ background: 'var(--blue-soft)', color: 'var(--blue)' }}
          >
            <Download size={22} />
          </div>
          <div>
            <div className="font-bold text-base">Download .md File</div>
            <div className="text-sm" style={{ color: 'var(--brown-muted)' }}>
              Save as {state.specProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-build-spec.md
            </div>
          </div>
        </button>

        {/* Claude Code command */}
        <div
          className="flex items-center gap-4 p-5 rounded-2xl"
          style={{ background: 'var(--spot-black)', color: 'var(--cream)' }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <Terminal size={22} />
          </div>
          <div>
            <div className="font-bold text-base">Use with Claude Code</div>
            <div className="text-sm mt-1" style={{ color: 'var(--brown-faint)' }}>
              1. Copy the spec above<br />
              2. Open your terminal<br />
              3. Run <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>claude</code><br />
              4. Paste the spec and say &quot;Build this&quot;
            </div>
          </div>
        </div>
      </div>

      {/* Journey summary */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: 'var(--cream-dark)', border: '2px solid var(--spot-gray)' }}
      >
        <h3
          className="font-bold text-lg mb-4"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Your Journey
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-bold" style={{ color: 'var(--brown-muted)' }}>Niche</div>
            <div>{state.niche}</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: 'var(--brown-muted)' }}>The Gap</div>
            <div>{state.selectedGap?.title || 'N/A'}</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: 'var(--brown-muted)' }}>Your Product</div>
            <div>{state.specProductName}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6" style={{ borderTop: '2px solid var(--spot-gray)' }}>
        <button onClick={onBack} className="btn-bounce flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold" style={{ background: 'var(--white)', border: '2px solid var(--spot-gray)', color: 'var(--brown-muted)' }}>
          <ArrowLeft size={14} /> Back to Spec
        </button>
        <button
          onClick={onReset}
          className="btn-bounce flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
          style={{ background: 'var(--spot-black)', color: 'var(--cream)' }}
        >
          <RotateCcw size={14} /> Find Another Cash Cow
        </button>
      </div>
    </div>
  )
}
