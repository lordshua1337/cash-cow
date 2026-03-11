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

function CowSpots({ opacity = 0.15 }: { opacity?: number }) {
  const spots = [
    { w: 200, h: 150, top: '3%', left: '-3%', shape: 'cow-spot-1', rotate: -15 },
    { w: 160, h: 180, top: '2%', right: '0%', shape: 'cow-spot-2', rotate: 20 },
    { w: 220, h: 160, bottom: '6%', left: '3%', shape: 'cow-spot-3', rotate: -8 },
    { w: 140, h: 170, bottom: '3%', right: '-2%', shape: 'cow-spot-4', rotate: 35 },
    { w: 120, h: 100, top: '42%', left: '6%', shape: 'cow-spot-5', rotate: -25 },
    { w: 130, h: 110, top: '38%', right: '4%', shape: 'cow-spot-6', rotate: 10 },
  ]

  return (
    <>
      {spots.map((s, i) => (
        <div
          key={i}
          className={`cow-spot ${s.shape}`}
          aria-hidden="true"
          style={{
            width: s.w,
            height: s.h,
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            opacity,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}
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

  function go(idea: ProductIdea) {
    storeTempIdea(idea)
    router.push(`/build/${idea.id}`)
  }

  return (
    <div style={{ background: 'var(--white)' }}>

      {/* ====== HERO ====== */}
      <section
        className="cow-border-bottom relative overflow-hidden"
        style={{ background: 'var(--white)' }}
      >
        <CowSpots opacity={0.18} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-28 text-center relative z-10">

          <div className="moo-bounce text-7xl sm:text-8xl mb-8 inline-block">&#x1F404;</div>

          <h1
            className="animate-in text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tight"
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
            className="animate-in text-lg sm:text-xl max-w-lg mx-auto mb-10 leading-relaxed font-semibold"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.1s' }}
          >
            Pick a product idea. Reshape it in your words.
            Get a build spec you can paste straight into Claude Code.
          </p>

          <div className="animate-in flex items-center justify-center gap-4 flex-wrap" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/ideas"
              className="btn-bounce inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-black"
              style={{
                background: 'var(--spot-black)',
                color: 'var(--white)',
                border: '3px solid var(--spot-black)',
                boxShadow: '6px 6px 0 var(--cash)',
              }}
            >
              Browse Ideas
              <ArrowRight size={20} strokeWidth={3} />
            </Link>
            <a
              href="#how"
              className="btn-bounce inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-lg font-black"
              style={{
                color: 'var(--spot-black)',
                border: '3px solid var(--spot-black)',
                boxShadow: '4px 4px 0 var(--spot-black)',
              }}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how" className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'var(--cream)' }}>
        <CowSpots opacity={0.1} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-16 tracking-tight"
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
                desc: '"Target teachers." "Add payments." "Make it simpler." Click any section, type what to change. The whole spec reshapes around your vision.',
              },
              {
                num: '3',
                emoji: '&#x1F680;',
                title: 'Start building',
                desc: 'Copy the spec. Paste into Claude Code. Each step has file paths, schemas, and components ready to execute.',
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
                <div className="text-5xl mb-5" dangerouslySetInnerHTML={{ __html: step.emoji }} />
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-black mb-4"
                  style={{ background: 'var(--spot-black)', color: 'var(--white)', fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-2xl font-black mb-3"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--brown-muted)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SPEC PREVIEW ====== */}
      <section className="cow-border-top cow-border-bottom relative overflow-hidden py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <CowSpots opacity={0.12} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Not a vague outline.
            <br />
            A <span style={{ color: 'var(--cash)' }}>real build plan.</span>
          </h2>
          <p className="text-base text-center mb-12 max-w-xl mx-auto font-semibold" style={{ color: 'var(--brown-muted)' }}>
            8 sections. File paths. Database schemas. Step-by-step instructions your AI coding tool can execute.
          </p>

          {/* Terminal mockup */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              border: '3px solid var(--spot-black)',
              boxShadow: '8px 8px 0 var(--spot-black)',
            }}
          >
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
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black"
                  style={{
                    background: 'var(--cash)',
                    color: 'var(--white)',
                    border: '2px solid var(--spot-black)',
                    boxShadow: '3px 3px 0 var(--spot-black)',
                  }}
                >
                  <RefreshCw size={12} strokeWidth={3} />
                  Click any section to remix
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black"
                  style={{
                    border: '2px solid var(--spot-black)',
                    color: 'var(--spot-black)',
                    boxShadow: '3px 3px 0 var(--spot-black)',
                  }}
                >
                  <Copy size={12} strokeWidth={3} />
                  Copy as Markdown
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== LIVE IDEAS ====== */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'var(--cream)' }}>
        <CowSpots opacity={0.08} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-black tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Today&apos;s ideas
              </h2>
              <p className="text-sm mt-1 font-semibold" style={{ color: 'var(--brown-muted)' }}>
                Fresh from real trending signals. Click any to remix.
              </p>
            </div>
            <Link
              href="/ideas"
              className="btn-bounce inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black flex-shrink-0"
              style={{
                background: 'var(--spot-black)',
                color: 'var(--white)',
                border: '2px solid var(--spot-black)',
                boxShadow: '4px 4px 0 var(--spot-black)',
              }}
            >
              See all
              <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    boxShadow: '5px 5px 0 var(--spot-black)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black"
                      style={{
                        background: 'var(--cream)',
                        color: 'var(--brown-muted)',
                        border: '2px solid var(--spot-gray)',
                      }}
                    >
                      <cx.icon size={10} />
                      {cx.label}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-lg text-[11px] font-black"
                      style={{
                        background: 'var(--cream)',
                        color: 'var(--brown-faint)',
                        border: '2px solid var(--spot-gray)',
                      }}
                    >
                      {idea.category}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-black leading-tight"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {idea.name}
                  </h3>
                  <p className="text-sm leading-snug flex-1 font-medium" style={{ color: 'var(--brown-muted)' }}>
                    {idea.pitch}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-xl text-xs font-black opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'var(--cash)',
                      color: '#fff',
                      border: '2px solid var(--spot-black)',
                      boxShadow: '3px 3px 0 var(--spot-black)',
                    }}
                  >
                    <RefreshCw size={11} strokeWidth={3} />
                    Remix It
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="cow-border-top relative overflow-hidden py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <CowSpots opacity={0.15} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="text-6xl mb-6">&#x1F4B0;</div>
          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop scrolling.
            <br />
            <span style={{ color: 'var(--cash)' }}>Start building.</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto font-semibold" style={{ color: 'var(--brown-muted)' }}>
            Every idea is remixable. Every spec is copy-pasteable.
            Your weekend project starts right now.
          </p>
          <Link
            href="/ideas"
            className="btn-bounce inline-flex items-center gap-2.5 px-10 py-5 rounded-2xl text-xl font-black"
            style={{
              background: 'var(--spot-black)',
              color: 'var(--white)',
              border: '3px solid var(--spot-black)',
              boxShadow: '6px 6px 0 var(--cash)',
            }}
          >
            Browse Ideas
            <ArrowRight size={22} strokeWidth={3} />
          </Link>
          <p className="text-xs mt-8 font-bold" style={{ color: 'var(--brown-faint)' }}>
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
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: 'var(--spot-black)',
              border: '2px solid var(--spot-black)',
              boxShadow: '3px 3px 0 var(--spot-black)',
            }}
          >
            <span className="text-sm">&#x1F404;</span>
          </div>
          <span className="text-sm font-black" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Cash Cow</span>
        </div>
        <p className="text-xs font-bold" style={{ color: 'var(--brown-faint)' }}>
          Pick ideas backed by real signals. Remix them. Build them.
        </p>
      </footer>
    </div>
  )
}
