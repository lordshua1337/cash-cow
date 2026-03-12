'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Compass,
  SlidersHorizontal,
  Hammer,
  CircleDollarSign,
  BarChart3,
  Copy,
  RefreshCw,
} from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function LandingPage() {

  return (
    <div>

      {/* ====== HERO ====== */}
      <section
        className="relative overflow-hidden min-h-[calc(100vh-60px)] flex flex-col items-center justify-center"
        style={{ background: 'var(--white)' }}
      >
        {/* Radial glow behind cow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Cow -- centered background layer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[550px] lg:h-[550px] pointer-events-none" style={{ zIndex: 1 }}>
          <DotLottieReact
            src="/cow-remix.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%', transform: 'scale(1.4)', opacity: 0.18 }}
          />
        </div>

        {/* Content -- on top of cow */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div
            className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
            style={{
              background: 'var(--cash-soft)',
              color: 'var(--cash-dark)',
            }}
          >
            <CircleDollarSign size={14} />
            Monetizable specs in 60 seconds
          </div>

          <h1
            className="animate-in text-5xl sm:text-6xl lg:text-7xl font-black mb-5 leading-[1.05] tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif', animationDelay: '0.05s' }}
          >
            Don&apos;t start from scratch.
            <br />
            <span style={{ color: 'var(--cash)' }}>Rebuild</span> it.
          </h1>

          <p
            className="animate-in text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.1s' }}
          >
            Pick a product people already pay for. Make it yours.
            Get a spec with pricing, revenue timeline, and a real build plan.
          </p>

          <div className="animate-in flex items-center justify-center gap-3 flex-wrap mb-6" style={{ animationDelay: '0.15s' }}>
            <Link
              href="/workflow"
              className="btn-hover inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold"
              style={{
                background: 'var(--cash)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.35)',
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

          {/* Trust signals */}
          <div
            className="animate-in flex items-center justify-center gap-6"
            style={{ animationDelay: '0.2s' }}
          >
            {[
              { icon: BarChart3, text: 'Revenue projections' },
              { icon: CircleDollarSign, text: 'Pricing strategy' },
              { icon: Hammer, text: 'Build-ready spec' },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: 'var(--brown-faint)' }}
              >
                <item.icon size={12} style={{ color: 'var(--cash)' }} />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Cow -- foreground layer peeking from bottom */}
        <div className="relative z-20 mt-auto w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] -mb-4">
          <DotLottieReact
            src="/cow-remix.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%', transform: 'scale(1.4)' }}
          />
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-30"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--cream))' }}
        />
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how" className="relative overflow-hidden py-16 sm:py-20" style={{ background: 'var(--cream)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Discover. Customize. Build.
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
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
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                    style={{ background: step.iconBg }}
                  >
                    <StepIcon size={26} style={{ color: step.iconColor }} strokeWidth={2} />
                  </div>
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black mb-3"
                    style={{ background: 'var(--cash)', color: '#fff', fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="text-lg font-black mb-2"
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
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'var(--white)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Not a vague outline.
              <br />
              A <span style={{ color: 'var(--cash)' }}>real build plan.</span>
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
              12 sections including pricing, revenue timeline, and customer acquisition.
              File paths, schemas, and step-by-step instructions.
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
                <p className="font-bold mb-1" style={{ color: 'var(--cash-dark)' }}>## How It Makes Money</p>
                <p style={{ color: 'var(--brown-light)' }}>
                  Freemium SaaS. Free for 5 clients, $12/mo Pro (unlimited), $29/mo Team (multi-user). Target 3% free-to-paid conversion.
                </p>
              </div>
              <div>
                <p className="font-bold mb-1" style={{ color: 'var(--cash-dark)' }}>## Build Plan (step 3 of 10)</p>
                <p style={{ color: 'var(--brown-light)' }}>
                  Create Supabase Auth with magic link login. Build <span className="font-bold" style={{ color: 'var(--brown)' }}>/app/login/page.tsx</span> with email input.
                  Add middleware to protect <span className="font-bold" style={{ color: 'var(--brown)' }}>/dashboard</span> routes.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: 'var(--cash)', color: '#fff' }}
                >
                  <RefreshCw size={12} />
                  Click any section to remix
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                >
                  <Copy size={12} />
                  Copy as Markdown
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: 'var(--cream)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2
            className="text-4xl sm:text-5xl font-black mb-5 tracking-tight"
            style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
          >
            Stop scrolling.
            <br />
            <span style={{ color: 'var(--cash)' }}>Start building.</span>
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
            Every spec includes pricing, revenue projections, and a customer acquisition plan.
            Your weekend project starts right now.
          </p>
          <Link
            href="/workflow"
            className="btn-hover inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-bold"
            style={{
              background: 'var(--cash)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
            }}
          >
            Start Building
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
          <p className="text-xs mt-6 font-semibold" style={{ color: 'var(--brown-faint)' }}>
            Free. No signup. Trending products refresh daily.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 text-center"
        style={{
          background: 'var(--white)',
          borderTop: '1px solid rgba(45, 35, 25, 0.06)',
        }}
      >
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'var(--cash)' }}
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
