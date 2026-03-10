'use client'

import Link from 'next/link'
import { Search, Crosshair, FileText, Rocket, ArrowRight, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'See What\'s Selling',
    desc: 'Browse trending products from Product Hunt, Hacker News, and GitHub. See what people are building and buying right now.',
    color: 'var(--cash)',
  },
  {
    num: '02',
    icon: Crosshair,
    title: 'Find the Gap',
    desc: 'AI digs into competitors, finds what users hate, and spots what nobody does well. This is your unfair advantage.',
    color: 'var(--gold)',
  },
  {
    num: '03',
    icon: FileText,
    title: 'Get Your Spec',
    desc: 'A complete build blueprint -- features, tech stack, database schema, pricing, the works. Ready to paste into Claude Code.',
    color: 'var(--blue)',
  },
]

const SAMPLE_TRENDS = [
  { name: 'AI Code Reviewers', growth: '+340%', category: 'Dev Tools' },
  { name: 'Personal CRM Apps', growth: '+180%', category: 'Productivity' },
  { name: 'Micro-SaaS Directories', growth: '+220%', category: 'Marketplace' },
  { name: 'AI Email Writers', growth: '+290%', category: 'Marketing' },
  { name: 'Habit Tracker APIs', growth: '+150%', category: 'Health' },
  { name: 'Invoice Automation', growth: '+170%', category: 'Finance' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--brown)' }}>
      {/* Nav */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: 'var(--spot-black)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <span className="text-lg" style={{ filter: 'grayscale(0)' }}>🐄</span>
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Cash Cow
          </span>
        </div>
        <Link
          href="/workflow"
          className="btn-bounce text-sm font-bold px-5 py-2.5 rounded-xl"
          style={{
            background: 'var(--cash)',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
          }}
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="cow-spots px-6 pt-16 pb-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8"
            style={{
              background: 'var(--gold-soft)',
              color: 'var(--gold)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <TrendingUp size={14} />
            Trending ideas updated daily
          </div>

          <h1
            className="animate-in text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
            style={{
              fontFamily: 'var(--font-fredoka), sans-serif',
              animationDelay: '0.1s',
            }}
          >
            Anyone can build an app.
            <br />
            <span style={{ color: 'var(--cash)' }}>Not everyone picks winners.</span>
          </h1>

          <p
            className="animate-in text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--brown-light)', animationDelay: '0.2s' }}
          >
            Cash Cow finds what&apos;s trending, spots the gap nobody fills, and hands you a
            complete build spec. From zero to blueprint in 5 minutes.
          </p>

          <div
            className="animate-in flex items-center gap-4 justify-center flex-wrap"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              href="/workflow"
              className="btn-bounce inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold"
              style={{
                background: 'var(--cash)',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(34, 197, 94, 0.35)',
              }}
            >
              Find Your Next Cash Cow
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Ticker */}
      <div
        className="overflow-hidden py-4"
        style={{
          background: 'var(--spot-black)',
          color: 'var(--cream)',
        }}
      >
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {[...SAMPLE_TRENDS, ...SAMPLE_TRENDS].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm">
              <span style={{ color: 'var(--cash-light)' }}>{t.growth}</span>
              <span className="font-bold">{t.name}</span>
              <span style={{ color: 'var(--brown-faint)' }}>{t.category}</span>
              <span style={{ color: 'var(--brown-faint)' }}>{'  ///  '}</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes ticker {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-ticker {
            animation: ticker 30s linear infinite;
          }
        `}</style>
      </div>

      {/* How it Works */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            How it works
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--brown-muted)' }}>
            Three steps. One spec. Go build.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="card-lift rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: 'var(--white)',
                  border: '2px solid var(--spot-gray)',
                  boxShadow: '0 4px 20px rgba(41, 37, 36, 0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                  >
                    <step.icon size={22} style={{ color: step.color }} />
                  </div>
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: 'var(--brown-faint)' }}
                  >
                    STEP {step.num}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold"
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

      {/* Example Output Preview */}
      <section className="px-6 py-16" style={{ background: 'var(--cream-dark)' }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            What you get
          </h2>
          <p className="text-center mb-10" style={{ color: 'var(--brown-muted)' }}>
            A complete build spec, ready to paste into Claude Code and start shipping
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--white)',
              border: '2px solid var(--spot-gray)',
              boxShadow: '0 8px 40px rgba(41, 37, 36, 0.08)',
            }}
          >
            {/* Spec header */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ borderBottom: '2px solid var(--spot-gray)' }}
            >
              <div>
                <div
                  className="text-xs font-bold tracking-widest mb-1"
                  style={{ color: 'var(--cash)' }}
                >
                  SAMPLE BUILD SPEC
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  VoiceCraft
                </div>
                <div className="text-sm" style={{ color: 'var(--brown-muted)' }}>
                  AI writing assistant that sounds like YOUR brand
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif', color: 'var(--cash)' }}
                >
                  87
                </div>
                <div className="text-xs font-bold" style={{ color: 'var(--brown-muted)' }}>
                  Build Score
                </div>
              </div>
            </div>

            {/* Spec body preview */}
            <div className="px-6 py-5 text-sm" style={{ fontFamily: 'monospace', color: 'var(--brown-light)' }}>
              <div style={{ color: 'var(--brown-faint)' }}>## Overview</div>
              <div className="mb-2">AI writing tool that trains on your existing content...</div>
              <div style={{ color: 'var(--brown-faint)' }}>## The Gap</div>
              <div className="mb-2">No competitor offers brand voice matching with &lt;100 samples</div>
              <div style={{ color: 'var(--brown-faint)' }}>## Core Features (MVP)</div>
              <div>- Brand voice analyzer (upload 10 blog posts)</div>
              <div>- AI writer with tone matching</div>
              <div>- Template library (email, social, blog)</div>
              <div className="mb-2">- Chrome extension for inline suggestions</div>
              <div style={{ color: 'var(--brown-faint)' }}>## Tech Stack</div>
              <div>Next.js + Supabase + Claude API + Vercel</div>
              <div className="mt-3" style={{ color: 'var(--brown-faint)' }}>
                ... + database schema, API routes, pricing, build order
              </div>
            </div>

            {/* Spec footer */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ background: 'var(--cream)', borderTop: '2px solid var(--spot-gray)' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
              >
                <Rocket size={12} /> Ready for Claude Code
              </div>
              <div className="text-xs" style={{ color: 'var(--brown-faint)' }}>
                14-21 day build  |  $49/mo pricing  |  $8K-35K/mo potential
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cow-spots px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop guessing what to build.
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--brown-muted)' }}>
            Let the market tell you. Find the gap. Get the spec. Ship it.
          </p>
          <Link
            href="/workflow"
            className="btn-bounce inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-lg font-bold"
            style={{
              background: 'var(--spot-black)',
              color: 'var(--cream)',
              boxShadow: '0 8px 30px rgba(28, 25, 23, 0.2)',
            }}
          >
            <span className="text-xl">🐄</span>
            Start Grazing
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 text-center text-sm"
        style={{ borderTop: '2px solid var(--spot-gray)', color: 'var(--brown-faint)' }}
      >
        Cash Cow -- Find ideas that actually make money.
      </footer>
    </div>
  )
}
