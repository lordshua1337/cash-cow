'use client'

import Image from 'next/image'
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
  FileDown,
  Rocket,
  DollarSign,
  Target,
  Zap,
  Users,
  Layout,
  GitBranch,
  Database,
  Mail,
  Palette,
  Swords,
  CalendarCheck,
  Filter,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import DropInFilesCarousel from '@/components/DropInFilesCarousel'

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

        {/* Content */}
        <div className="relative z-10 text-center px-6 pt-10 sm:pt-14 max-w-3xl mx-auto">
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
            Work Smarter.
            <br />
            <span style={{ color: 'var(--cash)' }}>Not Harder.</span>
          </h1>

          <p
            className="animate-in text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--brown-muted)', animationDelay: '0.1s' }}
          >
            Graze profitable &amp; popular products, remix and rebuild them, and finally launch your idea - today.
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

          {/* Spacer to keep cow from floating into buttons */}
          <div className="h-6" />
        </div>

        {/* Cow -- centered at bottom */}
        <div className="relative z-20 mt-auto w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] -mb-6">
          <DotLottieReact
            src="https://lottie.host/39245563-54fa-48b9-869f-19e7bdb8e4c6/uWgIgDE5u8.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
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
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
              Four steps from &quot;what should I build?&quot; to a monetizable spec.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '1',
                image: '/step-1.png',
                title: 'Pick inspiration',
                desc: 'Browse trending products people actually pay for. Pick one as your starting point\u2014not to clone, but to ride the same wave.',
              },
              {
                num: '2',
                image: '/step-2.png',
                title: 'Make it yours',
                desc: 'Answer 4 quick questions: who, what, features, tech. The AI generates an original product with pricing and revenue strategy.',
              },
              {
                num: '3',
                image: '/step-3.png',
                title: 'Build and ship',
                desc: 'Get a full spec with monetization model, pricing tiers, customer acquisition plan. Copy into Claude Code and start.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="card rounded-2xl p-7 text-center"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  width={140}
                  height={140}
                  className="mx-auto mb-4"
                />
                <h3
                  className="text-lg font-black mb-2"
                  style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WHAT YOU GET ====== */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: 'var(--white)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              One file. <span style={{ color: 'var(--cash)' }}>That&apos;s it.</span>
            </h2>
            <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
              You get a single Markdown file. Drag it into Claude Code, Cursor, or whatever AI builder you worship.
              It does the rest. You do the launch day selfie.
            </p>
          </div>

          {/* The big file card */}
          <div
            className="card rounded-2xl p-8 sm:p-10 text-center mb-10"
            style={{ border: '2px solid var(--cash)', background: 'var(--cash-soft)' }}
          >
            <Image src="/file-system-cow.svg" alt="Launch kit" width={80} height={80} className="mx-auto mb-4" />
            <h3
              className="text-2xl sm:text-3xl font-black mb-3"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Your end-to-end product launch kit
            </h3>
            <p className="text-base sm:text-lg max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
              Not a vague idea doc. Not a &ldquo;TODO: figure out pricing later&rdquo; situation.
              This is the whole playbook&mdash;from database schema to customer acquisition strategy&mdash;in
              one copy-pasteable file that your AI code builder actually understands.
            </p>
          </div>

          {/* Part 1: What's in the spec */}
          <div className="mb-20">
            <h3
              className="text-2xl sm:text-3xl font-black mb-3 text-center tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              What&apos;s in the spec
            </h3>
            <p className="text-base text-center mb-6" style={{ color: 'var(--brown-muted)' }}>
              Every section is built to make your AI builder do the heavy lifting. You just click &ldquo;generate.&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Gap analysis', desc: 'What competitors charge, what they\u2019re missing, and exactly where your product slides in. You\u2019re not guessing\u2014you\u2019re filling a proven hole.' },
                { title: 'Monetization model', desc: 'Subscription, marketplace cut, usage-based\u2014the exact mechanics of how money flows into your bank account. Not \u201Cfigure it out later.\u201D' },
                { title: 'Pricing tiers', desc: 'Specific dollar amounts, tier names, and free-to-paid conversion targets. Not vibes. Math.' },
                { title: 'Revenue projections', desc: 'Month-by-month forecast for your first 6 months as a solo builder. When ramen money hits. When real money hits.' },
                { title: 'Customer acquisition plan', desc: 'Where your first 100 paying users come from. Specific channels, specific tactics. No \u201Cpost and pray.\u201D' },
                { title: 'Step-by-step build plan', desc: 'File paths, database schemas, component names, tech stack. Your AI builder reads this and just\u2026 builds it.' },
              ].map((item) => (
                <div key={item.title} className="card rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <Image
                      src="/green-plus-file.svg"
                      alt=""
                      width={44}
                      height={44}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h3
                        className="text-base font-black mb-1"
                        style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2: The supporting files */}
          <div className="mb-20">
            <h3
              className="text-2xl sm:text-3xl font-black mb-3 text-center tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              The <span style={{ color: '#E8676B' }}>drop-in files</span>
            </h3>
            <p className="text-base text-center mb-10" style={{ color: 'var(--brown-muted)' }}>
              Six additional files that turn your spec from &ldquo;cool plan&rdquo; into &ldquo;running business.&rdquo;
            </p>
            <DropInFilesCarousel />
          </div>

          {/* Part 3: The strategic extras */}
          <div>
            {/* Robocow + heading */}
            <div className="text-center mb-10">
              <Image
                src="/robocow-unstoppable.png"
                alt="Unstoppable robocow"
                width={180}
                height={180}
                className="mx-auto mb-6"
              />
              <h3
                className="text-2xl sm:text-3xl font-black mb-3 tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Make it <span style={{ background: 'linear-gradient(90deg, #FF0000, #FF8000, #FFD700, #22C55E, #0099FF, #6633FF, #CC33FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>unstoppable</span>
              </h3>
              <p className="text-base" style={{ color: 'var(--brown-muted)' }}>
                Strategic extras that close the gap between &ldquo;I have code&rdquo; and &ldquo;I have a business.&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { title: 'Competitive intel brief', desc: 'Who you\u2019re up against, what they charge, their weak spots, and your unfair advantage. Know the battlefield before you build.' },
                { title: 'Launch day playbook', desc: 'Where to post, what to say, when to post it. Product Hunt, Reddit, Indie Hackers, Twitter\u2014a timed launch sequence so day one actually counts.' },
                { title: 'Funnel blueprint', desc: 'Email capture, onboarding flow, upgrade triggers, retention loops. The full conversion funnel mapped out so you\u2019re not launching into the void.' },
              ].map((item) => (
                <div key={item.title} className="card rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex flex-col gap-1 mt-0.5">
                      <Image src="/rainbow-pdf.svg" alt="" width={28} height={28} />
                      <Image src="/rainbow-webpage.svg" alt="" width={28} height={28} />
                    </div>
                    <div>
                      <h3
                        className="text-base font-black mb-1"
                        style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
              12 sections including pricing, revenue timeline, and customer acquisition.
              File paths, schemas, and step-by-step instructions.
            </p>
            <Image
              src="/step-4.png"
              alt="Happy cow with build plan"
              width={180}
              height={180}
              className="mx-auto mt-6"
            />
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
                <p className="font-bold" style={{ color: 'var(--brown)' }}># InvoicePilot &mdash; Build Spec</p>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{ background: 'var(--cash)', color: '#fff' }}
                >
                  <RefreshCw size={12} />
                  Click any section to remix
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
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
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--brown-muted)' }}>
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
          <Image
            src="/step-5.png"
            alt="Cash cow with money"
            width={200}
            height={200}
            className="mx-auto mt-8"
          />
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
          <Image src="/cc-logo-menu.png" alt="Cash Cow" width={28} height={28} className="rounded-md" />
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Cash Cow</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--brown-faint)' }}>
          Pick monetizable products. Make them yours. Build and ship.
        </p>
      </footer>
    </div>
  )
}
