'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'

interface SpecSample {
  name: string
  sections: { heading: string; body: string }[]
}

const SAMPLES: SpecSample[] = [
  {
    name: 'InvoicePilot',
    sections: [
      { heading: '## What You\'re Building', body: 'A dashboard for freelance designers that tracks unpaid invoices, sends automated payment reminders, and shows monthly revenue at a glance.' },
      { heading: '## How It Makes Money', body: 'Freemium SaaS. Free for 5 clients, $12/mo Pro (unlimited), $29/mo Team (multi-user). Target 3% free-to-paid conversion.' },
      { heading: '## Who Wants This', body: 'Freelance designers and solo creatives who lose track of payments and hate chasing clients for money.' },
      { heading: '## Pricing Tiers', body: 'Free (5 clients, basic reminders), Pro $12/mo (unlimited clients, smart scheduling), Team $29/mo (multi-user, reporting).' },
      { heading: '## Build Plan (step 3 of 10)', body: 'Create Supabase Auth with magic link login. Build /app/login/page.tsx with email input. Add middleware to protect /dashboard routes.' },
    ],
  },
  {
    name: 'FitBooker',
    sections: [
      { heading: '## What You\'re Building', body: 'A booking platform for independent personal trainers to manage client schedules, send session reminders, and collect payments.' },
      { heading: '## How It Makes Money', body: 'Subscription + transaction fee. $15/mo base, 2.5% per booking processed. Trainers save hours on admin and never miss a payment.' },
      { heading: '## Gap Analysis', body: 'Calendly doesn\'t handle payments. Mindbody is bloated and expensive. Nothing exists for solo trainers who just want book + pay in one link.' },
      { heading: '## Customer Acquisition', body: 'Partner with 3 fitness influencers for launch week. Reddit r/personaltraining. Instagram DM outreach to trainers with 1k-10k followers.' },
      { heading: '## Build Plan (step 5 of 10)', body: 'Integrate Stripe Checkout for session payments. Create /api/bookings/create with availability validation. Build confirmation email via Resend.' },
    ],
  },
  {
    name: 'PetLogHQ',
    sections: [
      { heading: '## What You\'re Building', body: 'A health tracker for pet owners that logs vet visits, medications, weight, and diet -- with reminders for upcoming shots and refills.' },
      { heading: '## How It Makes Money', body: 'Freemium with premium at $6/mo. Free tracks 1 pet. Premium: unlimited pets, PDF export for vet visits, family sharing.' },
      { heading: '## Who Wants This', body: 'Millennial and Gen-Z pet owners who treat their pets like children and spend $200+/mo on pet care.' },
      { heading: '## Revenue Projections', body: 'Month 1: 500 signups, 15 paid ($90). Month 3: 2,400 signups, 96 paid ($576). Month 6: 8,000 signups, 400 paid ($2,400).' },
      { heading: '## Build Plan (step 1 of 10)', body: 'Set up Next.js with Supabase. Create pets table with RLS policies. Build /app/pets/new form with breed, weight, DOB fields.' },
    ],
  },
  {
    name: 'ShiftSwap',
    sections: [
      { heading: '## What You\'re Building', body: 'A shift trading app for hourly workers at restaurants, retail, and warehouses. Post a shift, someone claims it, manager approves. Done.' },
      { heading: '## How It Makes Money', body: 'B2B SaaS. $49/mo per location. Free for workers. Managers pay because it eliminates the group chat chaos.' },
      { heading: '## Gap Analysis', body: 'When I Work is $4/user/mo and bloated. Most restaurants still use WhatsApp groups. This is one feature, done perfectly.' },
      { heading: '## Pricing Tiers', body: 'Starter $49/mo (1 location, 25 staff), Growth $99/mo (3 locations, unlimited staff), Enterprise: custom.' },
      { heading: '## Build Plan (step 7 of 10)', body: 'Build real-time shift board with Supabase Realtime subscriptions. Create /app/shifts/[id] with claim button and manager approval flow.' },
    ],
  },
  {
    name: 'ReceiptVault',
    sections: [
      { heading: '## What You\'re Building', body: 'A receipt scanner for small business owners that auto-categorizes expenses, exports to CSV, and flags tax-deductible purchases.' },
      { heading: '## How It Makes Money', body: 'Subscription SaaS. $9/mo Starter (50 receipts), $19/mo Pro (unlimited + OCR + accountant sharing). Annual discount 20%.' },
      { heading: '## Who Wants This', body: 'Small business owners and freelancers who stuff receipts in a drawer and panic every April.' },
      { heading: '## Customer Acquisition', body: 'SEO: "receipt tracker for small business." TikTok: satisfying receipt scanning videos. Product Hunt launch with lifetime deal hook.' },
      { heading: '## Build Plan (step 4 of 10)', body: 'Integrate Replicate OCR model for receipt text extraction. Store parsed data in Supabase receipts table. Build /app/receipts with drag-and-drop upload.' },
    ],
  },
  {
    name: 'LeaseAlert',
    sections: [
      { heading: '## What You\'re Building', body: 'A lease management tool for renters that tracks renewal dates, rent increases, maintenance requests, and sends alerts before deadlines.' },
      { heading: '## How It Makes Money', body: 'Freemium. Free for 1 lease. $5/mo for multiple properties, document storage, and landlord communication templates.' },
      { heading: '## Gap Analysis', body: 'Zillow tracks listings, not leases. Avail targets landlords. Nothing exists for the renter who just wants to not miss a renewal deadline.' },
      { heading: '## Revenue Projections', body: 'Month 1: 300 signups, 9 paid ($45). Month 3: 1,800 signups, 72 paid ($360). Month 6: 6,000 signups, 300 paid ($1,500).' },
      { heading: '## Build Plan (step 2 of 10)', body: 'Create leases table with start_date, end_date, rent_amount, landlord_contact. Build /app/leases/new wizard. Set up Inngest for renewal reminders at 90/60/30 days.' },
    ],
  },
  {
    name: 'MenuMath',
    sections: [
      { heading: '## What You\'re Building', body: 'A food cost calculator for restaurant owners that prices menu items based on ingredient costs, waste percentage, and target margins.' },
      { heading: '## How It Makes Money', body: 'SaaS subscription. $29/mo for unlimited menu items, supplier price tracking, and margin alerts when costs spike.' },
      { heading: '## Who Wants This', body: 'Independent restaurant owners who set prices by gut feeling and have no idea which dishes actually make money.' },
      { heading: '## Pricing Tiers', body: 'Solo $29/mo (1 restaurant, 50 items), Multi $59/mo (3 locations, unlimited items, team access).' },
      { heading: '## Build Plan (step 6 of 10)', body: 'Build ingredient cost database with supplier linking. Create /app/menu/[id]/cost-breakdown with real-time margin calculator and "suggested price" output.' },
    ],
  },
  {
    name: 'HabitStack',
    sections: [
      { heading: '## What You\'re Building', body: 'A habit tracker that lets you stack habits into routines, tracks streaks across chains, and sends smart nudges when you\'re about to break one.' },
      { heading: '## How It Makes Money', body: 'Freemium. Free for 3 habits. $4/mo for unlimited habits, routine builder, streak insurance (pause without losing), and weekly reports.' },
      { heading: '## Gap Analysis', body: 'Habitica is gamified but complex. Streaks is too simple. Nothing nails the "routine stacking" concept from Atomic Habits in app form.' },
      { heading: '## Customer Acquisition', body: 'Reddit r/habits, r/getdisciplined. "Atomic Habits but as an app" positioning. Launch on Product Hunt with 7-day streak challenge.' },
      { heading: '## Build Plan (step 8 of 10)', body: 'Build streak engine with timezone-aware day boundaries. Create /app/routines/[id] with drag-and-drop habit ordering. Wire up Resend for smart nudge emails at custom times.' },
    ],
  },
  {
    name: 'PatchNotes',
    sections: [
      { heading: '## What You\'re Building', body: 'A changelog tool for indie devs that turns git commits into beautiful public release notes. Customers subscribe for updates.' },
      { heading: '## How It Makes Money', body: 'SaaS. Free for 1 project. $8/mo Pro (unlimited projects, custom domain, email notifications to subscribers).' },
      { heading: '## Who Wants This', body: 'Indie hackers and small SaaS teams who know they should communicate updates but never get around to writing changelogs.' },
      { heading: '## Revenue Projections', body: 'Month 1: 200 signups, 10 paid ($80). Month 3: 1,200 signups, 60 paid ($480). Month 6: 4,000 signups, 240 paid ($1,920).' },
      { heading: '## Build Plan (step 3 of 10)', body: 'Connect GitHub webhook for push events. Parse conventional commits into categories (feat, fix, etc). Build /app/projects/[id]/changelog with auto-generated entries.' },
    ],
  },
  {
    name: 'WaitlistWizard',
    sections: [
      { heading: '## What You\'re Building', body: 'A waitlist builder with referral mechanics. Embed a form, people sign up, they get a unique link. More referrals = higher priority. Launch day sorted.' },
      { heading: '## How It Makes Money', body: 'Usage-based SaaS. Free up to 500 signups. $19/mo for 5,000. $49/mo for unlimited + custom branding + webhook integrations.' },
      { heading: '## Gap Analysis', body: 'LaunchRock is dead. Waitlist.me is for restaurants. Viral Loops is enterprise-priced. Nothing simple exists for indie launches.' },
      { heading: '## Customer Acquisition', body: 'Meta: use your own product to build a waitlist for the product. Indie Hackers, Twitter build-in-public crowd. "Built my waitlist tool in a weekend" story.' },
      { heading: '## Build Plan (step 9 of 10)', body: 'Build referral tracking with unique codes stored in Supabase. Create embeddable widget at /embed/[projectId]. Wire up Resend for position-update emails when someone refers a friend.' },
    ],
  },
]

const TYPING_SPEED = 12 // ms per character

export default function SpecPreviewCard() {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [usedCount, setUsedCount] = useState(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)

  const buildFullText = useCallback((sample: SpecSample) => {
    let text = `# ${sample.name} \u2014 Build Spec\n\n`
    for (const section of sample.sections) {
      text += `${section.heading}\n${section.body}\n\n`
    }
    return text.trimEnd()
  }, [])

  const typeOut = useCallback((fullText: string) => {
    cancelledRef.current = false
    setIsTyping(true)
    setDisplayText('')
    let i = 0

    const tick = () => {
      if (cancelledRef.current) return
      if (i < fullText.length) {
        // Type in chunks for speed
        const chunk = Math.min(3, fullText.length - i)
        setDisplayText(fullText.slice(0, i + chunk))
        i += chunk
        timerRef.current = setTimeout(tick, TYPING_SPEED)
      } else {
        setIsTyping(false)
      }
    }
    tick()
  }, [])

  // Type initial sample on mount
  useEffect(() => {
    typeOut(buildFullText(SAMPLES[0]))
    return () => { cancelledRef.current = true }
  }, [buildFullText, typeOut])

  const handleGenerate = () => {
    if (usedCount >= 10) return
    cancelledRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)

    const nextIndex = (sampleIndex + 1) % SAMPLES.length
    setSampleIndex(nextIndex)
    setUsedCount((c) => c + 1)
    typeOut(buildFullText(SAMPLES[nextIndex]))
  }

  // Render the text with syntax highlighting
  const renderText = () => {
    const lines = displayText.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return (
          <span key={i} className="font-bold" style={{ color: 'var(--brown)' }}>
            {line}{'\n'}
          </span>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <span key={i} className="font-bold" style={{ color: 'var(--cash-dark)' }}>
            {line}{'\n'}
          </span>
        )
      }
      if (line === '') {
        return <span key={i}>{'\n'}</span>
      }
      return (
        <span key={i} style={{ color: 'var(--brown-light)' }}>
          {line}{'\n'}
        </span>
      )
    })
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(45, 35, 25, 0.08)',
      }}
    >
      {/* Title bar */}
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

      {/* Content */}
      <div
        className="p-6 sm:p-8"
        style={{ background: 'var(--cream)', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}
      >
        <pre className="whitespace-pre-wrap break-words m-0" style={{ font: 'inherit' }}>
          {renderText()}
          {isTyping && (
            <span
              className="inline-block w-2 h-4 ml-0.5 animate-pulse"
              style={{ background: 'var(--cash)', verticalAlign: 'text-bottom' }}
            />
          )}
        </pre>

        {/* Generate button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={usedCount >= 10}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: usedCount >= 10 ? 'var(--cream-dark)' : 'var(--cash)',
              color: usedCount >= 10 ? 'var(--brown-muted)' : '#fff',
              cursor: usedCount >= 10 ? 'default' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={isTyping ? 'animate-spin' : ''} />
            {usedCount >= 10 ? 'Try the real thing' : 'Generate Sample'}
          </button>
          {usedCount > 1 && usedCount < 10 && (
            <span className="text-xs font-semibold" style={{ color: 'var(--brown-faint)' }}>
              {10 - usedCount} left
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
