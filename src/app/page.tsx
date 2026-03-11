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
  Compass,
  SlidersHorizontal,
  Hammer,
} from 'lucide-react'
import type { ProductIdea } from '@/lib/types'
import { FALLBACK_IDEAS } from '@/lib/fallback-ideas'

const CX = {
  weekend: { label: 'Weekend', icon: Clock, color: 'var(--cash)' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: 'var(--gold)' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: 'var(--blue)' },
} as const

const WORDS = ['remix', 'reshape', 'rebuild', 'rethink']

// Subtle cow spots as background texture
function CowSpots({ opacity = 0.04 }: { readonly opacity?: number }) {
  const spots = [
    { w: 180, h: 140, top: '5%', left: '-2%', shape: 'cow-spot-1', rotate: -12 },
    { w: 150, h: 170, top: '3%', right: '2%', shape: 'cow-spot-2', rotate: 25 },
    { w: 200, h: 150, bottom: '8%', left: '4%', shape: 'cow-spot-3', rotate: -5 },
    { w: 130, h: 160, bottom: '5%', right: '1%', shape: 'cow-spot-4', rotate: 30 },
    { w: 100, h: 90, top: '40%', left: '8%', shape: 'cow-spot-5', rotate: -20 },
  ]

  return (
    <>
      {spots.map((s, i) => {
        const style: React.CSSProperties = {
          width: s.w,
          height: s.h,
          opacity,
          transform: `rotate(${s.rotate}deg)`,
        }
        if ('top' in s && s.top) style.top = s.top
        if ('bottom' in s && s.bottom) style.bottom = s.bottom
        if ('left' in s && s.left) style.left = s.left
        if ('right' in s && s.right) style.right = s.right
        return (
          <div
            key={i}
            className={`cow-spot ${s.shape}`}
            aria-hidden="true"
            style={style}
          />
        )
      })}
    </>
  )
}

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

  function go() {
    router.push('/workflow')
  }

  return (
    <div>

      {/* ====== HERO ====== */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--white)' }}
      >
        <CowSpots opacity={0.035} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-24 sm:pb-36 text-center relative z-10">

          <div
            className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8"
            style={{
              background: 'var(--cash-soft)',
              color: 'var(--cash-dark)',
            }}
          >
            <span>&#x1F404;</span>
            From trending product to monetizable spec in 60 seconds
          </div>

          <h1
            className="animate-in text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.08] tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif', animationDelay: '0.05s' }}
          >
            Don&apos;t start
            <br />
            from scratch.
            <br />
            <span
              className="inline-block"
              style={{
                color: 'var(--cash)',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.2s ease',
                minWidth: '200px',
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
            Pick a product people already pay for. Make it yours.
            Get a monetization-focused spec you can paste into Claude Code.
          </p>

          <div className="animate-in flex items-center justify-center gap-3 flex-wrap" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/workflow"
              className="btn-hover inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold"
              style={{
                background: 'var(--cash)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
              }}
            >
              Start Building
              <ArrowRight size={20} strokeWidth={2.5} />
            </Link>
            <a
              href="#how"
              className="btn-hover inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-lg font-bold"
              style={{
                color: 'var(--brown)',
                background: 'var(--cream-dark)',
              }}
            >
              How it works
            </a>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--cream))' }}
        />
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how" className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--cream)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl font-black mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Discover. Customize. Build.
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
              Four steps from &quot;what should I build?&quot; to a monetizable spec.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '1',
                icon: Compass,
                iconBg: 'var(--cash-soft)',
                iconColor: 'var(--cash)',
                title: 'Pick inspiration',
                desc: 'Browse trending products people actually pay for. Pick one as your starting point -- not to clone, but to ride the same wave.',
              },
              {
                num: '2',
                icon: SlidersHorizontal,
                iconBg: 'var(--gold-soft)',
                iconColor: 'var(--gold)',
                title: 'Make it yours',
                desc: 'Answer 4 quick questions: who, what, features, tech. The AI generates an original product with pricing and revenue strategy.',
              },
              {
                num: '3',
                icon: Hammer,
                iconBg: 'var(--blue-soft)',
                iconColor: 'var(--blue)',
                title: 'Build and ship',
                desc: 'Get a full spec with monetization model, pricing tiers, customer acquisition plan. Copy into Claude Code and start.',
              },
            ].map((step) => {
              const StepIcon = step.icon
              return (
                <div
                  key={step.num}
                  className="card rounded-2xl p-7 text-center"
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                    style={{ background: step.iconBg }}
                  >
                    <StepIcon size={26} style={{ color: step.iconColor }} strokeWidth={2} />
                  </div>
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-base font-black mb-4"
                    style={{ background: 'var(--cash)', color: '#fff', fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="text-xl font-black mb-2"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                    {step.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== SPEC PREVIEW ====== */}
      <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--white)' }}>
        <CowSpots opacity={0.025} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2
              className="text-4xl sm:text-5xl font-black mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Not a vague outline.
              <br />
              A <span style={{ color: 'var(--cash)' }}>real build plan.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
              12 sections including pricing, revenue timeline, and customer acquisition. File paths. Database schemas. Step-by-step instructions your AI coding tool can execute.
            </p>
          </div>

          {/* Terminal mockup */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(45, 35, 25, 0.08)',
            }}
          >
            <div
              className="px-5 py-3 flex items-center gap-3"
              style={{ background: 'var(--brown)' }}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#22C55E' }} />
              </div>
              <span className="text-xs font-semibold ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>build-spec.md</span>
            </div>

            <div className="p-6 sm:p-8 space-y-5" style={{ background: 'var(--cream)', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}>
              <div>
                <p className="font-bold" style={{ color: 'var(--brown)' }}># InvoicePilot -- Build Spec</p>
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
                  Create Supabase Auth with magic link login. Build <span className="font-bold" style={{ color: 'var(--brown)' }}>/app/login/page.tsx</span> with email input.
                  Add middleware to protect <span className="font-bold" style={{ color: 'var(--brown)' }}>/dashboard</span> routes.
                </p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--gold)' }}>## Honest Risks</p>
                <p style={{ color: 'var(--brown-light)' }}>
                  Crowded invoicing space. You need a sharp niche. If you can&apos;t get 10 beta users in week one, pivot the audience.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{
                    background: 'var(--cash)',
                    color: '#fff',
                  }}
                >
                  <RefreshCw size={12} />
                  Click any section to remix
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{
                    background: 'var(--cream-dark)',
                    color: 'var(--brown-muted)',
                  }}
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
      <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Trending now
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--brown-muted)' }}>
                Products people are paying for right now. Click to build something like it.
              </p>
            </div>
            <Link
              href="/workflow"
              className="btn-hover inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
              style={{
                background: 'var(--cash)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
              }}
            >
              See all
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => {
              const cx = CX[idea.complexity]
              return (
                <button
                  key={idea.id}
                  onClick={() => go()}
                  className="card rounded-2xl p-5 text-left flex flex-col gap-2.5 group"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                      style={{
                        background: 'var(--cream-dark)',
                        color: cx.color,
                      }}
                    >
                      <cx.icon size={10} />
                      {cx.label}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                      style={{
                        background: 'var(--cream-dark)',
                        color: 'var(--brown-faint)',
                      }}
                    >
                      {idea.category}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {idea.name}
                  </h3>
                  <p className="text-sm leading-snug flex-1" style={{ color: 'var(--brown-muted)' }}>
                    {idea.pitch}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-xl text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'var(--cash)',
                      color: '#fff',
                    }}
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
      <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: 'var(--white)' }}>
        <CowSpots opacity={0.03} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="text-5xl mb-6">&#x1F404;</div>
          <h2
            className="text-5xl sm:text-6xl font-black mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop scrolling.
            <br />
            <span style={{ color: 'var(--cash)' }}>Start building.</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
            Every spec includes pricing, revenue projections, and a customer acquisition plan.
            Your weekend project starts right now.
          </p>
          <Link
            href="/workflow"
            className="btn-hover inline-flex items-center gap-2.5 px-10 py-5 rounded-2xl text-xl font-bold"
            style={{
              background: 'var(--cash)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
            }}
          >
            Browse Ideas
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
          <p className="text-xs mt-8 font-semibold" style={{ color: 'var(--brown-faint)' }}>
            Free. No signup. Trending products refresh daily.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center"
        style={{
          background: 'var(--cream)',
          borderTop: '1px solid rgba(45, 35, 25, 0.06)',
        }}
      >
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{
              background: 'var(--cash)',
            }}
          >
            <span className="text-xs">&#x1F404;</span>
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Cash Cow</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--brown-faint)' }}>
          Pick monetizable products. Make them yours. Build and ship.
        </p>
      </footer>
    </div>
  )
}
