'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  RefreshCw,
  Copy,
  Terminal,
  ArrowRight,
  Sparkles,
  Clock,
  Calendar,
  CalendarRange,
} from 'lucide-react'
import type { ProductIdea } from '@/lib/types'
import { storeTempIdea } from '@/lib/favorites'
import { FALLBACK_IDEAS } from '@/lib/fallback-ideas'

const CX = {
  weekend: { label: 'Weekend', icon: Clock, color: '#22C55E' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: '#F59E0B' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: '#3B82F6' },
} as const

const WORDS = ['remix', 'reshape', 'rebuild', 'rethink']

export default function LandingPage() {
  const router = useRouter()
  const [wordIdx, setWordIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [ideas, setIdeas] = useState<ProductIdea[]>(FALLBACK_IDEAS.slice(0, 6))

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setWordIdx((i) => (i + 1) % WORDS.length); setFading(false) }, 200)
    }, 2400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetch('/api/ideas?category=all')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.ideas?.length) setIdeas(d.ideas.slice(0, 6)) })
      .catch(() => {})
  }, [])

  function go(idea: ProductIdea) {
    storeTempIdea(idea)
    router.push(`/build/${idea.id}`)
  }

  return (
    <div className="landing-dark" style={{ background: 'var(--ld-bg)', color: 'var(--ld-text)' }}>

      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden dark-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-glow" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center relative z-10">
          <div
            className="animate-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-10 tracking-wide"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#4ADE80',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ADE80' }} />
            Powered by live market data
          </div>

          <h1
            className="animate-in text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif', animationDelay: '0.05s' }}
          >
            Don&apos;t start
            <br />
            from scratch.
            <br />
            <span
              className="gradient-text inline-block"
              style={{
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.2s ease',
                minWidth: '180px',
              }}
            >
              {WORDS[wordIdx]}
            </span>{' '}
            it.
          </h1>

          <p
            className="animate-in text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'var(--ld-text-muted)', animationDelay: '0.1s' }}
          >
            Pick a product idea. Reshape it in your words.
            Get a build spec you can paste straight into Claude Code.
          </p>

          <div className="animate-in flex items-center justify-center gap-4 flex-wrap" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/ideas"
              className="glow-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold"
              style={{ background: '#22C55E', color: '#000' }}
            >
              Browse Ideas
              <ArrowRight size={18} />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-semibold transition-colors"
              style={{ color: 'var(--ld-text-muted)', border: '1px solid var(--ld-border)' }}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how" className="py-24 sm:py-32 relative" style={{ background: 'var(--ld-surface)' }}>
        <div className="glow-divider max-w-3xl mx-auto mb-20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-center mb-4" style={{ color: '#4ADE80' }}>
            How it works
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-20 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Pick. Remix. Build.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--ld-border)', borderRadius: '20px', overflow: 'hidden' }}>
            {[
              {
                num: '01',
                title: 'Pick an idea',
                desc: 'Browse dozens of product ideas generated from real trending signals on Hacker News and GitHub.',
              },
              {
                num: '02',
                title: 'Remix it',
                desc: 'Click any section. Type what to change. "Target teachers." "Add payments." The whole spec reshapes around your words.',
              },
              {
                num: '03',
                title: 'Start building',
                desc: 'Copy the spec. Paste into Claude Code. Each step has file paths, schemas, and components ready to execute.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-8 sm:p-10 relative"
                style={{ background: 'var(--ld-surface)' }}
              >
                <span
                  className="step-num text-7xl font-bold absolute top-6 right-8 leading-none"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif', color: 'rgba(34, 197, 94, 0.08)' }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-xl font-bold mb-3 relative"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed relative" style={{ color: 'var(--ld-text-muted)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SPEC PREVIEW ====== */}
      <section className="py-24 sm:py-32 dark-grid" style={{ background: 'var(--ld-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-center mb-4" style={{ color: '#4ADE80' }}>
            The output
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Not a vague outline.
            <br />
            A <span className="gradient-text">real build plan.</span>
          </h2>
          <p className="text-base text-center mb-14 max-w-xl mx-auto" style={{ color: 'var(--ld-text-muted)' }}>
            8 sections. File paths. Database schemas. Step-by-step instructions your AI coding tool can execute.
          </p>

          {/* Mockup */}
          <div className="mockup-window rounded-2xl overflow-hidden" style={{ border: '1px solid var(--ld-border)' }}>
            {/* Title bar */}
            <div className="px-5 py-3.5 flex items-center gap-3" style={{ background: 'var(--ld-surface)', borderBottom: '1px solid var(--ld-border)' }}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#22C55E' }} />
              </div>
              <span className="text-xs font-mono ml-1" style={{ color: 'var(--ld-text-dim)' }}>build-spec.md</span>
            </div>

            {/* Spec content */}
            <div className="p-6 sm:p-8 space-y-6" style={{ background: 'var(--ld-surface-2)', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.7' }}>
              <div>
                <p className="font-bold mb-1" style={{ color: '#4ADE80' }}># InvoicePilot -- Build Spec</p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: '#22C55E' }}>## What You&apos;re Building</p>
                <p style={{ color: 'var(--ld-text-muted)' }}>
                  A dashboard for freelance designers that tracks unpaid invoices, sends automated payment reminders, and shows monthly revenue at a glance. Think &quot;Stripe meets a spreadsheet&quot; but without the spreadsheet.
                </p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: '#F59E0B' }}>## Build Plan (step 3 of 10)</p>
                <p style={{ color: 'var(--ld-text-muted)' }}>
                  Create Supabase Auth with magic link login. Build <span style={{ color: '#4ADE80' }}>/app/login/page.tsx</span> with email input.
                  Add middleware to protect <span style={{ color: '#4ADE80' }}>/dashboard</span> routes.
                  Store user profile in a <span style={{ color: '#4ADE80' }}>profiles</span> table with columns: <span style={{ color: '#4ADE80' }}>id, email, display_name, created_at</span>.
                </p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: '#3B82F6' }}>## Honest Risks</p>
                <p style={{ color: 'var(--ld-text-muted)' }}>
                  Crowded invoicing space. You need a sharp niche -- &quot;invoicing for freelance designers&quot; not &quot;invoicing for everyone.&quot; If you can&apos;t get 10 beta users in week one, pivot the audience.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <RefreshCw size={12} />
                  Click any section to remix
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ld-text-muted)', border: '1px solid var(--ld-border)' }}>
                  <Copy size={12} />
                  Copy as Markdown
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== LIVE IDEAS ====== */}
      <section className="py-24 sm:py-32" style={{ background: 'var(--ld-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.15)' }}>
                <Sparkles size={12} />
                Updated daily
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                Today&apos;s ideas
              </h2>
            </div>
            <Link
              href="/ideas"
              className="glow-btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
              style={{ background: '#22C55E', color: '#000' }}
            >
              See all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ideas.map((idea) => {
              const cx = CX[idea.complexity]
              return (
                <button
                  key={idea.id}
                  onClick={() => go(idea)}
                  className="dark-card rounded-xl p-5 text-left flex flex-col gap-2.5 group"
                  style={{ background: 'var(--ld-surface-2)', border: '1px solid var(--ld-border)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold" style={{ background: `${cx.color}15`, color: cx.color }}>
                      <cx.icon size={10} />
                      {cx.label}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--ld-text-dim)' }}>
                      {idea.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    {idea.name}
                  </h3>
                  <p className="text-sm leading-snug flex-1" style={{ color: 'var(--ld-text-muted)' }}>
                    {idea.pitch}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <RefreshCw size={11} />
                    Remix It
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="py-24 sm:py-32 relative dark-grid" style={{ background: 'var(--ld-bg)' }}>
        <div className="hero-glow" style={{ top: '50%', opacity: 0.6 }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop scrolling.
            <br />
            <span className="gradient-text">Start building.</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--ld-text-muted)' }}>
            Every idea is remixable. Every spec is copy-pasteable.
            Your weekend project starts right now.
          </p>
          <Link
            href="/ideas"
            className="glow-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold"
            style={{ background: '#22C55E', color: '#000' }}
          >
            Browse Ideas
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs mt-8" style={{ color: 'var(--ld-text-dim)' }}>
            Free. No signup. Ideas refresh daily.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ borderTop: '1px solid var(--ld-border)', background: 'var(--ld-surface)' }}>
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: 'var(--ld-surface-2)', border: '1px solid var(--ld-border)' }}>
            <span className="text-sm">&#x1F404;</span>
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Cash Cow</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--ld-text-dim)' }}>
          Pick ideas backed by real signals. Remix them. Build them.
        </p>
      </footer>
    </div>
  )
}
