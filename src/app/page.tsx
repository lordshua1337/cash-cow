'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  RefreshCw,
  Copy,
  ArrowRight,
  Clock,
  Calendar,
  CalendarRange,
} from 'lucide-react'
import type { ProductIdea } from '@/lib/types'
import { storeTempIdea } from '@/lib/favorites'
import { FALLBACK_IDEAS } from '@/lib/fallback-ideas'

const CX = {
  weekend: { label: 'Weekend', icon: Clock },
  'few-weeks': { label: 'Few Weeks', icon: Calendar },
  'month-plus': { label: 'Month+', icon: CalendarRange },
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
    <div style={{ background: 'var(--white)' }}>

      {/* ====== HERO ====== */}
      <section className="cow-spots-big cow-border-bottom" style={{ background: 'var(--white)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-20 sm:pb-24 text-center">

          <div className="moo-bounce text-6xl sm:text-7xl mb-6 inline-block">&#x1F404;</div>

          <h1
            className="animate-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif', animationDelay: '0.05s' }}
          >
            Don&apos;t start from scratch.
            <br />
            <span
              style={{
                color: 'var(--cash)',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.2s ease',
                display: 'inline-block',
                minWidth: '180px',
              }}
            >
              {WORDS[wordIdx]}
            </span>{' '}
            it.
          </h1>

          <p
            className="animate-in text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.1s' }}
          >
            Pick a product idea. Reshape it in your words.
            Get a build spec you can paste straight into Claude Code.
          </p>

          <div className="animate-in flex items-center justify-center gap-3 flex-wrap" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/ideas"
              className="btn-bounce inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold"
              style={{
                background: 'var(--spot-black)',
                color: 'var(--white)',
                boxShadow: '0 6px 20px rgba(28, 25, 23, 0.2)',
              }}
            >
              Browse Ideas
              <ArrowRight size={20} />
            </Link>
            <a
              href="#how"
              className="btn-bounce inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-lg font-bold"
              style={{
                color: 'var(--brown-muted)',
                border: '3px solid var(--spot-black)',
              }}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how" className="py-20 sm:py-28" style={{ background: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Pick. Remix. Build. &#x1F42E;
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                emoji: '&#x1F50D;',
                title: 'Pick an idea',
                desc: 'Browse dozens of product ideas generated from real trending signals. Filter by category. Find one that clicks.',
              },
              {
                num: '2',
                emoji: '&#x1F504;',
                title: 'Remix it',
                desc: 'Click any section. Type what to change. "Target teachers." "Add payments." "Make it simpler." The whole spec reshapes.',
              },
              {
                num: '3',
                emoji: '&#x1F528;',
                title: 'Start building',
                desc: 'Copy the spec. Paste into Claude Code. Each step has file paths, schemas, and components ready to go.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="card-lift rounded-3xl p-8 text-center"
                style={{
                  background: 'var(--white)',
                  border: '3px solid var(--spot-black)',
                  boxShadow: '6px 6px 0 var(--spot-black)',
                }}
              >
                <div className="text-4xl mb-4" dangerouslySetInnerHTML={{ __html: step.emoji }} />
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold mb-4"
                  style={{ background: 'var(--spot-black)', color: 'var(--white)', fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SPEC PREVIEW ====== */}
      <section className="cow-border-top cow-border-bottom py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Not a vague outline.
            <br />
            A <span style={{ color: 'var(--cash)' }}>real build plan.</span>
          </h2>
          <p className="text-base text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
            8 sections. File paths. Database schemas. Step-by-step instructions your AI coding tool can execute.
          </p>

          {/* Mockup */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              border: '3px solid var(--spot-black)',
              boxShadow: '8px 8px 0 var(--spot-black)',
            }}
          >
            {/* Title bar */}
            <div
              className="px-5 py-3.5 flex items-center gap-3"
              style={{ background: 'var(--spot-black)' }}
            >
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#EF4444' }} />
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#F59E0B' }} />
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: '#22C55E' }} />
              </div>
              <span className="text-xs font-bold ml-1" style={{ color: 'var(--brown-faint)' }}>build-spec.md</span>
            </div>

            <div className="p-6 sm:p-8 space-y-5" style={{ background: 'var(--cream)', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}>
              <div>
                <p className="font-bold" style={{ color: 'var(--spot-black)' }}># InvoicePilot -- Build Spec</p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--cash-dark)' }}>## What You&apos;re Building</p>
                <p style={{ color: 'var(--brown-light)' }}>
                  A dashboard for freelance designers that tracks unpaid invoices, sends automated payment reminders, and shows monthly revenue at a glance.
                </p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--cash-dark)' }}>## Build Plan (step 3 of 10)</p>
                <p style={{ color: 'var(--brown-light)' }}>
                  Create Supabase Auth with magic link login. Build <span className="font-bold" style={{ color: 'var(--spot-black)' }}>/app/login/page.tsx</span> with email input.
                  Add middleware to protect <span className="font-bold" style={{ color: 'var(--spot-black)' }}>/dashboard</span> routes.
                  Store user profile in a <span className="font-bold" style={{ color: 'var(--spot-black)' }}>profiles</span> table with columns: id, email, display_name, created_at.
                </p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--gold)' }}>## Honest Risks</p>
                <p style={{ color: 'var(--brown-light)' }}>
                  Crowded invoicing space. You need a sharp niche. If you can&apos;t get 10 beta users in week one, pivot the audience.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ background: 'var(--spot-black)', color: 'var(--white)' }}
                >
                  <RefreshCw size={12} />
                  Click any section to remix
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ border: '2px solid var(--spot-black)', color: 'var(--spot-black)' }}
                >
                  <Copy size={12} />
                  Copy as Markdown
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== LIVE IDEAS ====== */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Today&apos;s ideas &#x1F4A1;
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--brown-muted)' }}>
                Fresh from real trending signals. Click any to remix.
              </p>
            </div>
            <Link
              href="/ideas"
              className="btn-bounce inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
              style={{
                background: 'var(--spot-black)',
                color: 'var(--white)',
              }}
            >
              See all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => {
              const cx = CX[idea.complexity]
              return (
                <button
                  key={idea.id}
                  onClick={() => go(idea)}
                  className="card-lift rounded-2xl p-5 text-left flex flex-col gap-2.5 group"
                  style={{
                    background: 'var(--white)',
                    border: '3px solid var(--spot-black)',
                    boxShadow: '4px 4px 0 var(--spot-black)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold"
                      style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                    >
                      <cx.icon size={10} />
                      {cx.label}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-lg text-[11px] font-bold"
                      style={{ background: 'var(--cream-dark)', color: 'var(--brown-faint)' }}
                    >
                      {idea.category}
                    </span>
                  </div>
                  <h3
                    className="text-base font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {idea.name}
                  </h3>
                  <p className="text-sm leading-snug flex-1" style={{ color: 'var(--brown-muted)' }}>
                    {idea.pitch}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-xl text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--cash)', color: '#fff' }}
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
      <section className="cow-spots-big cow-border-top py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-6">&#x1F4B0;</div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop scrolling.
            <br />
            <span style={{ color: 'var(--cash)' }}>Start building.</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
            Every idea is remixable. Every spec is copy-pasteable.
            Your weekend project starts right now.
          </p>
          <Link
            href="/ideas"
            className="btn-bounce inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold"
            style={{
              background: 'var(--spot-black)',
              color: 'var(--white)',
              boxShadow: '6px 6px 0 var(--cash)',
            }}
          >
            Browse Ideas
            <ArrowRight size={20} />
          </Link>
          <p className="text-xs mt-8" style={{ color: 'var(--brown-faint)' }}>
            Free. No signup. Ideas refresh daily.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center cow-border-top"
        style={{ background: 'var(--cream)' }}
      >
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'var(--spot-black)' }}
          >
            <span className="text-sm">&#x1F404;</span>
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Cash Cow</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--brown-faint)' }}>
          Pick ideas backed by real signals. Remix them. Build them.
        </p>
      </footer>
    </div>
  )
}
