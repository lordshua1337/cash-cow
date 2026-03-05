import Link from 'next/link'
import { Beef, Search, Zap, FileText, ArrowRight, Target, TrendingUp, DollarSign } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Nav */}
      <nav
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'var(--amber-soft)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <Beef size={18} style={{ color: 'var(--amber)' }} />
          </div>
          <span className="text-lg font-bold tracking-tight">Cash Cow</span>
        </div>
        <Link
          href="/dashboard/pasture"
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
          style={{ background: 'var(--amber)', color: '#FFFFFF' }}
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <div className="cow-spots flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div
          className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
          style={{
            background: 'var(--amber-soft)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.15)',
          }}
        >
          <Beef size={40} style={{ color: 'var(--amber)' }} />
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 max-w-3xl leading-none">
          <span style={{ color: 'var(--text)' }}>Milk trending niches</span>
          <br />
          <span style={{ color: 'var(--amber)' }}>for product gold.</span>
        </h1>

        <p className="text-lg sm:text-xl max-w-xl leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
          Cash Cow researches markets, mines competitor complaints, scores product ideas by demand and buildability, and generates build-ready briefs. From niche to product brief in minutes.
        </p>

        <Link
          href="/dashboard/pasture"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105"
          style={{
            background: 'var(--amber)',
            color: '#FFFFFF',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
          }}
        >
          <Target size={18} />
          Explore Markets
          <ArrowRight size={18} />
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-16 flex-wrap justify-center">
          {[
            { label: 'Markets analyzed', value: '4' },
            { label: 'Product ideas scored', value: '5' },
            { label: 'Build briefs ready', value: '5' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black mb-1" style={{ color: 'var(--amber)' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t px-6 py-16" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-black text-center mb-2">From Niche to Product Brief in 3 Steps</h2>
          <p className="text-sm text-center mb-10" style={{ color: 'var(--text-secondary)' }}>
            Graze. Score. Build.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                Icon: Search,
                step: '01',
                title: 'Graze the Pasture',
                desc: 'Pick a niche. Cash Cow fetches trending products, analyzes competitors, mines real user complaints from G2 and Reddit, and maps the market landscape.',
              },
              {
                Icon: Zap,
                step: '02',
                title: 'Score Your Calves',
                desc: 'AI generates product ideas from market gaps. Each idea is scored on market demand, competition density, build complexity, revenue potential, and AI buildability.',
              },
              {
                Icon: FileText,
                step: '03',
                title: 'Get Your Brief',
                desc: 'Choose a calf and get a complete build playbook: tech stack, MVP features, data model, revenue model, risks, and timeline. Ready to hand to your AI coding assistant.',
              },
            ].map(({ Icon, step, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 p-6 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ background: 'var(--amber-soft)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
                  >
                    <Icon size={20} style={{ color: 'var(--amber)' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-base">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Example calf */}
      <div className="border-t px-6 py-16" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black text-center mb-2">What a Scored Idea Looks Like</h2>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
            Every calf comes with scores, confidence levels, and a full brief
          </p>

          <div
            className="rounded-xl p-6 flex flex-col gap-4"
            style={{ background: 'var(--surface)', border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 0 30px rgba(34, 197, 94, 0.08)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Example Calf
                </div>
                <h3 className="text-xl font-black">VoiceCraft</h3>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>AI Writing Tools</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black" style={{ color: 'var(--amber)' }}>74</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Overall Score</div>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'var(--green-soft)', border: '1px solid rgba(5, 150, 105, 0.2)' }}
            >
              <TrendingUp size={14} style={{ color: 'var(--green)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--green)' }}>High Confidence</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                -- 85% data verified via APIs
              </span>
            </div>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              AI writing assistant that actually sounds like your brand, not a robot. Trains on YOUR content library.
            </p>

            <div className="grid grid-cols-5 gap-3 text-center text-xs">
              {[
                { label: 'Market', value: '78', color: 'var(--amber)' },
                { label: 'Competition', value: '35', color: 'var(--green)' },
                { label: 'Complexity', value: '42', color: 'var(--text)' },
                { label: 'Revenue', value: '72', color: 'var(--amber)' },
                { label: 'AI Build', value: '65', color: 'var(--blue)' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Build: <span style={{ color: 'var(--text)' }}>14-32 days</span>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Revenue: <span style={{ color: 'var(--green)' }}>$8K-35K/mo</span>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Pricing: <span style={{ color: 'var(--text)' }}>$49/mo</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t px-6 py-16 text-center" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-2xl font-black mb-3">Stop building products nobody wants.</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Research the market. Score the opportunity. Get the brief. Build what works.
        </p>
        <Link
          href="/dashboard/pasture"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105"
          style={{
            background: 'var(--amber)',
            color: '#FFFFFF',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
          }}
        >
          <Beef size={18} />
          Start Milking Niches
        </Link>
      </div>
    </div>
  )
}
