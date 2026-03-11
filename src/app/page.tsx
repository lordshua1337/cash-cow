'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Zap,
  RefreshCw,
  Copy,
  Terminal,
  ArrowRight,
  Sparkles,
  Clock,
  Calendar,
  CalendarRange,
  MousePointer,
} from 'lucide-react'
import type { ProductIdea } from '@/lib/types'
import { storeTempIdea } from '@/lib/favorites'
import { FALLBACK_IDEAS } from '@/lib/fallback-ideas'

const COMPLEXITY_LABELS = {
  weekend: { label: 'Weekend', icon: Clock, color: 'var(--cash)' },
  'few-weeks': { label: 'Few Weeks', icon: Calendar, color: 'var(--gold)' },
  'month-plus': { label: 'Month+', icon: CalendarRange, color: 'var(--blue)' },
} as const

// Rotating words for the hero
const HERO_WORDS = ['remix', 'reshape', 'rebuild', 'rethink', 'reimagine']

export default function LandingPage() {
  const router = useRouter()
  const [heroWordIndex, setHeroWordIndex] = useState(0)
  const [heroFading, setHeroFading] = useState(false)
  const [previewIdeas, setPreviewIdeas] = useState<ProductIdea[]>(FALLBACK_IDEAS.slice(0, 6))
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Rotate hero word
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroFading(true)
      setTimeout(() => {
        setHeroWordIndex((i) => (i + 1) % HERO_WORDS.length)
        setHeroFading(false)
      }, 200)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Try to load real ideas for preview
  useEffect(() => {
    async function loadPreview() {
      setLoadingPreview(true)
      try {
        const res = await fetch('/api/ideas?category=all')
        if (res.ok) {
          const data = await res.json()
          if (data.ideas?.length > 0) {
            setPreviewIdeas(data.ideas.slice(0, 6))
          }
        }
      } catch {
        // fallback is already set
      } finally {
        setLoadingPreview(false)
      }
    }
    loadPreview()
  }, [])

  function handleRemixIdea(idea: ProductIdea) {
    storeTempIdea(idea)
    router.push(`/build/${idea.id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* ============ HERO ============ */}
      <section className="cow-spots relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-28 text-center">
          {/* Floating accent shapes */}
          <div className="absolute top-12 left-[10%] w-16 h-16 rounded-full opacity-[0.07] hero-float-1" style={{ background: 'var(--cash)' }} />
          <div className="absolute top-32 right-[12%] w-10 h-10 rounded-xl opacity-[0.05] hero-float-2" style={{ background: 'var(--gold)' }} />
          <div className="absolute bottom-20 left-[20%] w-12 h-12 rounded-full opacity-[0.06] hero-float-3" style={{ background: 'var(--blue)' }} />

          <div
            className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
            style={{
              background: 'var(--spot-black)',
              color: 'var(--cream)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--cash-light)' }} />
            Powered by live market signals
          </div>

          <h1
            className="animate-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
            style={{
              fontFamily: 'var(--font-fredoka), sans-serif',
              animationDelay: '0.05s',
            }}
          >
            Don&apos;t start from scratch.
            <br />
            <span className="relative inline-block">
              <span
                className="hero-word-swap"
                style={{
                  color: 'var(--cash)',
                  opacity: heroFading ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                  display: 'inline-block',
                  minWidth: '200px',
                }}
              >
                {HERO_WORDS[heroWordIndex]}
              </span>
            </span>{' '}
            it.
          </h1>

          <p
            className="animate-in text-lg sm:text-xl max-w-2xl mx-auto mb-10"
            style={{
              color: 'var(--brown-muted)',
              animationDelay: '0.1s',
              lineHeight: 1.6,
            }}
          >
            Pick a product idea. Reshape it in your own words.
            <br className="hidden sm:block" />
            Get a build spec you can paste straight into Claude Code.
          </p>

          <div className="animate-in flex items-center justify-center gap-3 flex-wrap" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/ideas"
              className="btn-bounce inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold"
              style={{
                background: 'var(--cash)',
                color: '#fff',
                boxShadow: '0 6px 24px rgba(34, 197, 94, 0.3)',
              }}
            >
              Browse Ideas
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Subtle scroll indicator */}
          <div className="animate-in mt-16 flex flex-col items-center gap-2" style={{ animationDelay: '0.3s' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--brown-faint)' }}>See how it works</span>
            <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5" style={{ borderColor: 'var(--brown-faint)' }}>
              <div className="w-1 h-2 rounded-full scroll-dot" style={{ background: 'var(--brown-faint)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Three steps to your build spec
          </h2>
          <p className="text-center text-base mb-16 max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
            No brainstorming. No blank-page paralysis. Pick, remix, build.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                num: '01',
                title: 'Pick an idea',
                desc: 'Browse dozens of product ideas generated from real market signals. Filter by category. Find one that clicks.',
                icon: MousePointer,
                color: 'var(--cash)',
              },
              {
                num: '02',
                title: 'Remix it',
                desc: 'Click any section of the spec and tell it what to change. "Target teachers instead." "Add payments." "Make it simpler." It reshapes the whole plan.',
                icon: RefreshCw,
                color: 'var(--gold)',
              },
              {
                num: '03',
                title: 'Start building',
                desc: 'Copy the spec as markdown. Paste it into Claude Code or Cursor. Each build step is specific enough to execute -- file paths, schemas, components.',
                icon: Terminal,
                color: 'var(--blue)',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-2xl p-6 sm:p-8 relative"
                style={{
                  background: 'var(--cream)',
                  border: '2px solid var(--spot-gray)',
                }}
              >
                <span
                  className="text-6xl font-bold absolute top-4 right-6 opacity-[0.06]"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.num}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  <step.icon size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
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

      {/* ============ LIVE IDEA PREVIEW ============ */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--cream)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
                style={{
                  background: 'var(--cash-soft)',
                  color: 'var(--cash-dark)',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                }}
              >
                <Zap size={12} />
                Live
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Today&apos;s ideas
              </h2>
              <p className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                Generated from what&apos;s trending on Hacker News and GitHub right now.
              </p>
            </div>
            <Link
              href="/ideas"
              className="btn-bounce inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0"
              style={{ background: 'var(--spot-black)', color: 'var(--cream)' }}
            >
              See all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {previewIdeas.map((idea) => {
              const cx = COMPLEXITY_LABELS[idea.complexity]
              return (
                <button
                  key={idea.id}
                  onClick={() => handleRemixIdea(idea)}
                  className="card-lift rounded-2xl p-4 text-left flex flex-col gap-2 group"
                  style={{
                    background: 'var(--white)',
                    border: '2px solid var(--spot-gray)',
                    boxShadow: '0 2px 12px rgba(41, 37, 36, 0.04)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold" style={{ background: `${cx.color}15`, color: cx.color }}>
                      <cx.icon size={10} />
                      {cx.label}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{ background: 'var(--cream-dark)', color: 'var(--brown-faint)' }}>
                      {idea.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    {idea.name}
                  </h3>
                  <p className="text-sm leading-snug flex-1" style={{ color: 'var(--brown-muted)' }}>
                    {idea.pitch}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 self-start px-2.5 py-1 rounded-lg text-xs font-bold opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--cash)', color: '#fff' }}
                  >
                    <RefreshCw size={11} />
                    Remix It
                  </span>
                </button>
              )
            })}
          </div>

          {loadingPreview && (
            <p className="text-center text-xs mt-4" style={{ color: 'var(--brown-faint)' }}>
              Loading live ideas...
            </p>
          )}
        </div>
      </section>

      {/* ============ WHAT THE SPEC LOOKS LIKE ============ */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Not a vague outline.
            <br />A <span style={{ color: 'var(--cash)' }}>real build plan.</span>
          </h2>
          <p className="text-center text-base mb-12 max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
            Every spec includes 8 sections with file paths, database schemas, and step-by-step instructions an AI coding tool can execute.
          </p>

          {/* Spec preview card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '2px solid var(--spot-gray)',
              boxShadow: '0 12px 40px rgba(41, 37, 36, 0.08)',
            }}
          >
            {/* Fake title bar */}
            <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'var(--spot-black)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#22C55E' }} />
              </div>
              <span className="text-xs ml-2" style={{ color: 'var(--brown-faint)' }}>build-spec.md</span>
            </div>

            <div className="p-6 sm:p-8 space-y-5" style={{ background: 'var(--cream)', fontFamily: 'monospace' }}>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--cash)' }}>## What You&apos;re Building</p>
                <p className="text-sm" style={{ color: 'var(--brown-light)' }}>
                  A dashboard for freelance designers that tracks unpaid invoices, sends automated reminders, and shows monthly revenue at a glance.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--gold)' }}>## Build Plan (step 3 of 10)</p>
                <p className="text-sm" style={{ color: 'var(--brown-light)' }}>
                  Create Supabase Auth with magic link login. Build a /login page with email input. Add middleware to protect /dashboard routes. Store user profile in a &apos;profiles&apos; table with columns: id, email, display_name, created_at.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--blue)' }}>## Tech Stack</p>
                <p className="text-sm" style={{ color: 'var(--brown-light)' }}>
                  <strong>Next.js</strong> -- frontend + API routes in one project
                  <br />
                  <strong>Supabase</strong> -- auth, database, row-level security
                  <br />
                  <strong>Tailwind</strong> -- fast styling without leaving your editor
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}>
                  <RefreshCw size={12} />
                  Click any section to remix
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'var(--spot-black)', color: 'var(--cream)' }}>
                  <Copy size={12} />
                  Copy as Markdown
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="cow-spots py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop scrolling.
            <br />
            <span style={{ color: 'var(--cash)' }}>Start building.</span>
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: 'var(--brown-muted)' }}>
            Every idea is remixable. Every spec is copy-pasteable. Your weekend project starts right now.
          </p>
          <Link
            href="/ideas"
            className="btn-bounce inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold"
            style={{
              background: 'var(--cash)',
              color: '#fff',
              boxShadow: '0 6px 24px rgba(34, 197, 94, 0.3)',
            }}
          >
            Browse Ideas
            <ArrowRight size={20} />
          </Link>
          <p className="text-xs mt-6" style={{ color: 'var(--brown-faint)' }}>
            Free. No signup. Ideas refresh daily.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ borderTop: '2px solid var(--spot-gray)', background: 'var(--white)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'var(--spot-black)' }}
          >
            <span className="text-sm">&#x1F404;</span>
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
            Cash Cow
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--brown-faint)' }}>
          Pick ideas backed by real signals. Remix them. Build them.
        </p>
      </footer>
    </div>
  )
}
