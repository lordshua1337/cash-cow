'use client'

import { useState, useEffect, useRef, type MouseEvent } from 'react'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import Link from 'next/link'
import SpecPreviewCard from '@/components/SpecPreviewCard'
import {
  ArrowRight,
  Compass,
  SlidersHorizontal,
  Hammer,
  CircleDollarSign,
  BarChart3,
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
  Check,
  X,
  Monitor,
  Code,
  Megaphone,
  Briefcase,
  BookOpen,
  MousePointer,
  Sparkles,
  Download,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import DropInFilesCarousel from '@/components/DropInFilesCarousel'

// Milestone messages — triggered at specific click counts
// Ordered milestone list — [clickCount, message, force]
// force=true means it always shows even if too close to last message
const MILESTONES: [number, string, boolean][] = [
  [100, "oh yeah you're almost at.. wait you ARE at 100. that's 50% more clicks than it takes to build and deploy your product (probably..)", true],
  [200, "200 clicks and you still haven't started building. the cow is judging you. look at his face", false],
  [300, "300. at this rate you're gonna need a build spec just for your clicking strategy", false],
  [400, "400.. you know what would be really unstoppable? if you actually built something. just a thought.. i dunno..", false],
  [500, "FIVE HUNDRED. ok genuinely.. are you ok? do you need water? a snack maybe?", true],
  [700, "700. you've spent more time clicking confetti than most people spend on their entire product launch strategy", false],
  [900, "900?? oh no.. oh no no no.. the record.. it's.. it's moving. WHAT", true],
  [1000, "ONE THOUSAND CLICKS. the record keeps pulling away.. this thing is FAST", true],
  [1100, "1,100.. it's slowing down. you can feel it. it's getting tired. YOU'RE NOT", false],
  [1200, "1,200.. the gap is closing. oh my god the gap is closing", false],
  [1300, "YOU PASSED IT. YOU ACTUALLY PASSED IT. THE RECORD IS YOURS. wait.. wait is it still going?", true],
  [1400, "ok it stopped. it actually stopped. you won. you're the new record holder. congratulations you beautiful psycho", true],
  [1600, "wait.. wait. is the record.. moving again? no. NO. it can't be", true],
  [1800, "IT'S BACK. THE RECORD IS CLIMBING AGAIN. IT WAS PLAYING DEAD. THIS THING IS SENTIENT", true],
  [2000, "TWO THOUSAND. you and the record are in an arms race now. this is cold war energy", true],
  [2500, "2,500.. you've been at this for a while. the record respects you. but it will not stop", false],
  [3000, "3,000. at this point you and the record are basically in a relationship. toxic but committed", true],
  [4000, "4,000. you're both still going. this is the longest confetti session in human history (probably)", false],
  [5000, "5,000. ok it's over. the record maxed out. you win for real this time. now go build something. please. the cow is literally begging you", true],
]

const MILESTONE_MAP = new Map(MILESTONES.map(([count, msg, force]) => [count, { msg, force }]))

// Rotating tips that show between milestones
const ROTATING_TIPS = [
  "try rotating between all three cards and get a groove going.. maybe it'll be faster? i dunno..",
  "pro tip: if you click really fast it makes more confetti. that's not a tip that's just how it works",
  "the person who set the record reportedly used two fingers. just putting that out there",
  "did you know you can also click the other cards? variety is the spice of confetti",
  "some say if you click fast enough the rainbow text starts glowing. that's not true but it would be cool",
  "Dooooopppaaaaminneeeeee",
  "if each click was a line of code you'd have a full app by now.. just something to think about..",
  "rumor has it clicking all three cards in order unlocks a secret cow. it doesn't. but wouldn't that be cool?",
  "this is how they keep your kids busy all day too by the way..",
  "your click-to-build ratio is currently infinity to zero. the math checks out and it's not great",
  "at this pace you'll beat the record by.. *checks notes*.. honestly i lost track. just keep going",
  "the robocow was programmed to look impressed at exactly this click count. wait no that's a lie he always looks like that",
  "motivational quote: 'the journey of a thousand clicks begins with a single confetti' \u2014 ancient proverb (not real)",
  "here's a thought.. what if you clicked with your other hand for a bit? switch hitter energy",
  "the confetti particles are generated fresh every time. no recycled confetti here. only the finest",
  "you've been clicking for a while now.. your future product is somewhere out there wondering when you'll show up",
  "breaking: local user clicks confetti instead of building saas. more at 11",
  "this is literally what slot machines do to people. we just made it free and prettier",
  "your clicking form is impeccable honestly. great wrist action. very ergonomic (probably not actually)",
  "this section is called unstoppable and you are literally proving the name right so.. thank you for that",
  "you know what pairs great with confetti clicking? having a build spec open in another tab. just saying..",
  "the three cards you're clicking contain actual business strategy btw. not that you're reading them right now",
  "somewhere a product manager just felt a disturbance in the force",
  "at this rate you could've learned a new language. not a programming one. like.. french or something",
  "plot twist: the real product was the confetti we clicked along the way",
  "your screen time report is going to be WILD this week",
  "your dedication to this is honestly inspiring. misguided but inspiring",
  "every click brings you closer to the record and further from productivity. balanced as all things should be",
  "you know tiktok uses this exact same trick right.. the scroll is the click. you're not immune. none of us are",
  "the cow's expression hasn't changed once during all of this. stone cold. respect",
  "imagine explaining this to someone.. 'yeah i clicked confetti 500 times on a landing page' .. iconic honestly",
  "hot take: this is more satisfying than most mobile games and it cost you nothing",
  "we could've put a 'sign up' wall here instead of confetti. you're welcome",
  "the people who built this site spent hours on this easter egg instead of adding features. priorities",
  "you're clicking so fast the css transitions can barely keep up. slow down champ.. or don't. i'm not your mom",
  "someone is going to find this easter egg on product hunt and it's going to be the top comment. calling it now",
  "your brain right now: 'one more click' .. narrator: it was not one more click",
  "engagement metrics through the roof rn. silicon valley would be proud. or concerned. probably both",
  "fun fact: this confetti costs us exactly $0 per click. we checked",
  "ok real talk for a second.. this is genuinely more fun than filling out a typeform. we proved something today",
  "this is the part where a normal website would ask for your email. we're not normal. click away",
  "SEROTONIN ACHIEVED",
  "the algorithm would be so confused watching you right now. 'why is this person still on section 3'",
  "you clicking this is technically a conversion event. we're counting it. our metrics look incredible now",
]

export default function LandingPage() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [confettiClicks, setConfettiClicks] = useState(0)
  const [gameMode, setGameMode] = useState(false)
  const [exitedGame, setExitedGame] = useState(false)
  const [fakeRecord, setFakeRecord] = useState(957)
  const [motivation, setMotivation] = useState('')
  const fakeRecordStarted = useRef(false)
  const lastTipIndex = useRef(0)
  const lastMotivationAt = useRef(0)
  const nextTipAt = useRef(0)

  useEffect(() => {
    if (confettiClicks < 5) return
    if (!gameMode && !exitedGame) setGameMode(true)

    const MIN_GAP = 25
    const sinceLast = confettiClicks - lastMotivationAt.current

    // Check for milestone
    const milestone = MILESTONE_MAP.get(confettiClicks)
    if (milestone) {
      // Force milestones always show, others respect min gap
      if (milestone.force || sinceLast >= MIN_GAP) {
        setMotivation(milestone.msg)
        lastMotivationAt.current = confettiClicks
        nextTipAt.current = confettiClicks + MIN_GAP + Math.floor(Math.random() * 11)
      }
      return
    }

    // Initialize nextTipAt on first activation
    if (nextTipAt.current === 0) {
      nextTipAt.current = confettiClicks + MIN_GAP + Math.floor(Math.random() * 11)
    }

    // Show rotating tip only at the pre-calculated threshold
    if (confettiClicks >= nextTipAt.current) {
      setMotivation(ROTATING_TIPS[lastTipIndex.current % ROTATING_TIPS.length])
      lastTipIndex.current += 1
      lastMotivationAt.current = confettiClicks
      nextTipAt.current = confettiClicks + MIN_GAP + Math.floor(Math.random() * 11)
    }
  }, [confettiClicks])

  // Record always stays ahead until ~1250, then user "wins," then record comes back
  useEffect(() => {
    if (confettiClicks < 900 || fakeRecordStarted.current) return
    fakeRecordStarted.current = true

    const tick = () => {
      setFakeRecord((prev) => {
        if (prev >= 5000) return 5000

        // Phase 1: Stay ahead of user until they hit ~1250
        // Jump aggressively to always be 20-80 ahead
        if (prev < 1250) {
          const target = confettiClicks + 20 + Math.floor(Math.random() * 60)
          const jump = Math.max(1, target - prev)
          return Math.min(prev + jump, 5000)
        }

        // Phase 2: Slow down and let user pass around 1250-1300
        if (prev < 1350) {
          // Barely move — user overtakes
          if (Math.random() > 0.3) return prev
          return prev + 1
        }

        // Phase 3: User thinks they won. Pause for a bit then come back
        if (prev < 1500) {
          // Stall for a while, then start creeping
          if (Math.random() > 0.15) return prev
          return prev + 1
        }

        // Phase 4: Record wakes back up and starts climbing again
        const jump = Math.floor(Math.random() * 3) + 1
        return Math.min(prev + jump, 5000)
      })
      const nextDelay = Math.floor(Math.random() * 800) + 200
      setTimeout(tick, nextDelay)
    }
    setTimeout(tick, 500)
  }, [confettiClicks])

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
            Bring Your Dream to Life in Minutes
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
            <button
              onClick={() => setShowHowItWorks(true)}
              className="btn-hover inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-lg font-bold"
              style={{
                color: 'var(--brown)',
                background: 'var(--cream-dark)',
              }}
            >
              How it works
            </button>
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
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: 'var(--cream)' }}>
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
            <Image src="/step-5.png" alt="Launch kit cow" width={120} height={120} className="mx-auto mb-4" />
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
            {/* Headline */}
            <div className="text-center mb-14">
              <h3
                className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Make it <span style={{ background: 'linear-gradient(90deg, #FF0000, #FF8000, #FFD700, #22C55E, #0099FF, #6633FF, #CC33FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>unstoppable</span>
              </h3>
              <p className="text-base sm:text-lg" style={{ color: 'var(--brown-muted)' }}>
                Strategic extras that close the gap between &ldquo;I have code&rdquo; and &ldquo;I have a business.&rdquo;
              </p>
            </div>

            {/* Robocow + stacked cards side by side */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
              {/* Robocow + fun fact */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <Image
                  src="/robocow-unstoppable.png"
                  alt="Unstoppable robocow"
                  width={240}
                  height={240}
                />
                <div className="text-center mt-4" style={{ opacity: confettiClicks >= 5 ? 1 : 0, transition: 'opacity 0.4s ease', maxWidth: 260 }}>
                  <div className="py-2 px-4 rounded-xl mb-3" style={{ background: 'var(--cream-dark)' }}>
                    <p className="text-xs font-bold" style={{ color: 'var(--brown-muted)' }}>
                      The most anyone has ever clicked this is{' '}
                      <span style={{ color: 'var(--brown)', fontFamily: 'var(--font-fredoka), sans-serif' }}>{fakeRecord.toLocaleString()}</span>{' '}
                      times.
                    </p>
                  </div>
                  {motivation && (
                    <motion.p
                      key={motivation}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--brown-muted)' }}
                    >
                      {motivation}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Vertical stacked cards with score overlay */}
              <div className="relative flex flex-col gap-5 flex-1 w-full">
                {/* Score overlay — no layout shift, sits on top */}
                <AnimatePresence>
                  {confettiClicks >= 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-2 right-0 z-20 py-2 px-4 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        border: '2px solid transparent',
                        backgroundClip: 'padding-box',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      <p
                        className="text-2xl sm:text-3xl font-black"
                        style={{
                          fontFamily: 'var(--font-fredoka), sans-serif',
                          background: 'linear-gradient(135deg, #FF0000, #FF8000, #FFD700, #22C55E, #0099FF, #6633FF, #CC33FF)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {confettiClicks}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {[
                  { title: 'Competitive intel brief', desc: 'Who you\u2019re up against, what they charge, their weak spots, and your unfair advantage. Know the battlefield before you build.' },
                  { title: 'Launch day playbook', desc: 'Where to post, what to say, when to post it. Product Hunt, Reddit, Indie Hackers, Twitter\u2014a timed launch sequence so day one actually counts.' },
                  { title: 'Funnel blueprint', desc: 'Email capture, onboarding flow, upgrade triggers, retention loops. The full conversion funnel mapped out so you\u2019re not launching into the void.' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl p-6 cursor-pointer transition-all active:scale-[0.98]"
                    style={{
                      background: gameMode ? '#fff' : 'var(--white)',
                      boxShadow: gameMode ? '0 2px 12px rgba(0,0,0,0.06)' : 'var(--shadow)',
                      border: gameMode ? '2px solid rgba(232, 103, 107, 0.2)' : '1px solid rgba(45, 35, 25, 0.06)',
                    }}
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      const x = e.clientX / window.innerWidth
                      const y = e.clientY / window.innerHeight
                      setConfettiClicks((c) => c + 1)
                      confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { x, y },
                        colors: ['#FF0000', '#FF8000', '#FFD700', '#22C55E', '#0099FF', '#6633FF', '#CC33FF'],
                        ticks: 120,
                        gravity: 1.2,
                        scalar: 0.9,
                      })
                    }}
                  >
                    {gameMode ? (
                      <p
                        className="text-center text-lg font-black py-2"
                        style={{
                          fontFamily: 'var(--font-fredoka), sans-serif',
                          color: '#E8676B',
                        }}
                      >
                        Click Me
                      </p>
                    ) : (
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
                    )}
                  </div>
                ))}

                {/* Exit game / Start building */}
                {gameMode && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mx-auto mt-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                    onClick={() => { setGameMode(false); setExitedGame(true) }}
                  >
                    Exit Game Mode
                  </motion.button>
                )}
                {exitedGame && !gameMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mt-2"
                  >
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
                  </motion.div>
                )}
              </div>
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
              Build something you AND
              <br />
              <span style={{ color: 'var(--cash)' }}>other people love.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
              Why guess what to build when people are already paying for it? Grab what&apos;s working,
              put your spin on it, and get a spec that Claude Code turns into a live product.
              No theory. No hope. Just proof it sells.
            </p>
            <Image
              src="/step-4.png"
              alt="Happy cow with build plan"
              width={180}
              height={180}
              className="mx-auto mt-6"
            />
          </div>

          <SpecPreviewCard />
        </div>
      </section>

      {/* ====== THE PROCESS / WHAT YOU NEED / WHAT YOU DON'T ====== */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: 'var(--cream)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Here's the process */}
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
            >
              Here&apos;s the <span style={{ color: 'var(--cash)' }}>process.</span>
            </h2>
            <p className="text-base sm:text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--brown-muted)' }}>
              Three steps. No account. No credit card. No existential crisis about your tech stack.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  num: '1',
                  icon: <Compass size={28} style={{ color: 'var(--cash)' }} />,
                  title: 'Pick a winner',
                  desc: 'Browse products people already pay for. Tap one that sparks something. That\u2019s your starting point.',
                },
                {
                  num: '2',
                  icon: <SlidersHorizontal size={28} style={{ color: 'var(--cash)' }} />,
                  title: 'Make it yours',
                  desc: 'Answer 4 quick questions. Our AI generates an original product with your twist, your audience, your pricing.',
                },
                {
                  num: '3',
                  icon: <FileDown size={28} style={{ color: 'var(--cash)' }} />,
                  title: 'Download and build',
                  desc: 'Get your spec as a Markdown file. Drop it into an AI code builder. Watch your product materialize.',
                },
              ].map((step) => (
                <div key={step.num} className="card rounded-2xl p-7 text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'var(--cash-soft)' }}
                    >
                      {step.icon}
                    </div>
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
              ))}
            </div>
          </div>

          {/* Here's what you need */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2
                className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Here&apos;s what you <span style={{ color: 'var(--cash)' }}>need.</span>
              </h2>
              <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
                The spec file works with any AI code builder. We recommend Claude Code because
                it handles the full file best&mdash;but it&apos;s not required.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <div
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: '#1e1e2e', border: '2px solid rgba(203,166,247,0.25)' }}
              >
                {/* Subtle gradient glow */}
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top right, #cba6f7, transparent 60%)' }}
                />

                {/* Recommended pill */}
                <div className="relative flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(166,227,161,0.15)' }}
                  >
                    <Check size={16} strokeWidth={3} style={{ color: '#a6e3a1' }} />
                  </div>
                  <span
                    className="text-xs font-bold tracking-wide uppercase"
                    style={{ color: '#a6e3a1' }}
                  >
                    Recommended
                  </span>
                </div>

                {/* Robot mascot + title */}
                <div className="relative flex items-center gap-3 mb-3">
                  {/* Pixel robot mascot */}
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Antenna */}
                    <rect x="16" y="0" width="4" height="4" fill="#f9e2af" />
                    <rect x="14" y="2" width="2" height="2" fill="#f9e2af" />
                    <rect x="20" y="2" width="2" height="2" fill="#f9e2af" />
                    {/* Head */}
                    <rect x="8" y="4" width="20" height="14" rx="2" fill="#fab387" />
                    <rect x="10" y="4" width="16" height="2" fill="#f9c68b" />
                    {/* Eyes */}
                    <rect x="12" y="9" width="4" height="4" rx="1" fill="#1e1e2e" />
                    <rect x="20" y="9" width="4" height="4" rx="1" fill="#1e1e2e" />
                    <rect x="13" y="10" width="2" height="2" fill="#cdd6f4" />
                    <rect x="21" y="10" width="2" height="2" fill="#cdd6f4" />
                    {/* Mouth */}
                    <rect x="14" y="14" width="8" height="2" rx="1" fill="#1e1e2e" />
                    {/* Body */}
                    <rect x="10" y="20" width="16" height="12" rx="2" fill="#fab387" />
                    <rect x="12" y="22" width="12" height="4" rx="1" fill="#f9c68b" />
                    {/* Arms */}
                    <rect x="6" y="22" width="4" height="8" rx="2" fill="#fab387" />
                    <rect x="26" y="22" width="4" height="8" rx="2" fill="#fab387" />
                    {/* Feet */}
                    <rect x="12" y="32" width="4" height="4" rx="1" fill="#fab387" />
                    <rect x="20" y="32" width="4" height="4" rx="1" fill="#fab387" />
                  </svg>
                  <div>
                    <p
                      className="text-lg font-black"
                      style={{ fontFamily: 'var(--font-fredoka), sans-serif', color: '#cdd6f4' }}
                    >
                      Claude Code
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(205,214,244,0.35)' }}>
                      by Anthropic
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="relative text-sm leading-relaxed" style={{ color: 'rgba(205,214,244,0.6)' }}>
                  Best results. Reads the entire spec, builds every file, handles deployment.
                  Setup instructions are included with your spec.
                </p>
              </div>
              <div className="card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
                  >
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <h3
                    className="text-base font-black"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    Also works with
                  </h3>
                </div>
                <p className="text-lg font-black mb-1" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                  Cursor, Windsurf, etc.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                  Any AI builder that accepts Markdown files. Results may vary, but the spec still
                  gives you everything you need.
                </p>
              </div>
            </div>
          </div>

          {/* Here's what you DON'T need */}
          <div>
            <div className="text-center mb-8">
              <h2
                className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                Here&apos;s what you <span style={{ color: '#E8676B' }}>don&apos;t</span> need.
              </h2>
              <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: 'var(--brown-muted)' }}>
                Seriously. If you can open a browser and drag a file, you&apos;re overqualified.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                {
                  icon: <Code size={24} />,
                  title: 'Coding skills',
                  desc: 'Zero lines of code required. The AI builder writes it all. You just approve.',
                },
                {
                  icon: <Megaphone size={24} />,
                  title: 'Marketing skills',
                  desc: 'Your spec includes a launch playbook, funnel blueprint, and customer acquisition plan. Done.',
                },
                {
                  icon: <Briefcase size={24} />,
                  title: 'Business skills',
                  desc: 'Pricing tiers, revenue projections, monetization model\u2014all generated. You just pick the product.',
                },
              ].map((item) => (
                <div key={item.title} className="card rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(232, 103, 107, 0.12)', color: '#E8676B' }}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <X size={16} strokeWidth={3} style={{ color: '#E8676B' }} />
                    <h3
                      className="text-base font-black"
                      style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <div
                className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
                style={{ background: 'var(--white)', border: '1px solid rgba(45, 35, 25, 0.08)' }}
              >
                <MousePointer size={20} style={{ color: 'var(--cash)' }} />
                <p className="text-base font-bold" style={{ color: 'var(--brown)' }}>
                  You just need to know how to use a computer. That&apos;s it.
                </p>
              </div>
              <p className="text-sm mt-3" style={{ color: 'var(--brown-muted)' }}>
                Setup instructions are included with every spec. We walk you through everything.
              </p>
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
        </div>
        {/* Rocket cow anchored to bottom -- smoke blasts off the footer */}
        <div className="relative z-10 flex justify-center mt-8 -mb-20 sm:-mb-28">
          <Image
            src="/rocket-cow.png"
            alt="Rocket cow blasting off"
            width={280}
            height={280}
            className="object-contain"
            style={{ marginBottom: '-2rem' }}
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

      {/* ====== HOW IT WORKS MODAL ====== */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45, 35, 25, 0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowHowItWorks(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 sm:p-10"
              style={{ background: 'var(--white)', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowHowItWorks(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'var(--cream-dark)', color: 'var(--brown-muted)' }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              <h2
                className="text-2xl sm:text-3xl font-black mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
              >
                How it works
              </h2>
              <p className="text-base mb-8" style={{ color: 'var(--brown-muted)' }}>
                Five steps from &ldquo;I have no idea what to build&rdquo; to &ldquo;it&apos;s live and making money.&rdquo;
              </p>

              <div className="space-y-6">
                {[
                  {
                    num: '1',
                    icon: <Compass size={22} />,
                    title: 'Discover',
                    desc: 'Browse trending products that real people already pay for\u2014sourced from Product Hunt. Filter by category (SaaS, AI, Marketplace, Mobile). Pick one as your inspiration. Not to clone it. To ride the same market wave with your own twist.',
                    color: 'var(--cash)',
                    bg: 'var(--cash-soft)',
                  },
                  {
                    num: '2',
                    icon: <SlidersHorizontal size={22} />,
                    title: 'Customize',
                    desc: 'A 4-step wizard walks you through it: Who are you building this for? What makes yours different? What features matter most? Any tech preferences? Each answer shapes your spec into something original\u2014not a template.',
                    color: 'var(--cash)',
                    bg: 'var(--cash-soft)',
                  },
                  {
                    num: '3',
                    icon: <Sparkles size={22} />,
                    title: 'Generate your spec',
                    desc: 'Our AI takes your answers and the inspiration product, then generates a 12-section build spec. Monetization model, pricing tiers, revenue projections, customer acquisition plan, full tech stack, database schema, build steps\u2014everything.',
                    color: 'var(--cash)',
                    bg: 'var(--cash-soft)',
                  },
                  {
                    num: '4',
                    icon: <RefreshCw size={22} />,
                    title: 'Remix until it\u2019s perfect',
                    desc: 'Don\u2019t like the pricing? Click the section and remix it. Want a different tech stack? Remix it. Every section is individually tweakable with AI\u2014or edit it yourself. The spec is yours to shape until it feels right.',
                    color: 'var(--cash)',
                    bg: 'var(--cash-soft)',
                  },
                  {
                    num: '5',
                    icon: <Download size={22} />,
                    title: 'Export and build',
                    desc: 'Download your spec as Markdown. Drop the file into Claude Code (recommended), Cursor, Windsurf, or any AI code builder. It reads the spec, builds the entire product, and you launch. Setup instructions included for every tool.',
                    color: 'var(--cash)',
                    bg: 'var(--cash-soft)',
                  },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ background: step.bg, color: step.color }}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: step.bg, color: step.color }}
                        >
                          Step {step.num}
                        </span>
                        <h3
                          className="text-base font-black"
                          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA at bottom of modal */}
              <div className="mt-8 text-center">
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
