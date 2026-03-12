'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import {
  Fingerprint,
  MousePointerClick,
  Rocket,
  Table2,
  WandSparkles,
  Crown,
} from 'lucide-react'

interface FileItem {
  title: string
  desc: string
  icon?: ReactNode
  image?: string
}

const COW_RED = '#E8676B'

const FILES: FileItem[] = [
  {
    title: 'Customer persona file',
    desc: 'A detailed persona doc your AI builder uses to make every decision for a real human\u2014not a generic \u201Cuser.\u201D Every UI choice, every line of copy, informed by who\u2019s actually paying.',
    image: '/cow-persona.png',
  },
  {
    title: 'Landing page design file',
    desc: 'Full page structure, copy blocks, CTA placement, SEO meta tags, Open Graph cards. Your marketing site builds itself the same day your product does.',
    image: '/cow-landing-page.png',
  },
  {
    title: 'One-click deploy template',
    desc: 'Pre-configured repo scaffold matching your spec\u2019s tech stack. Clone it, drop your files in, ship. The gap between \u201Cplan\u201D and \u201Crunning code\u201D shrinks to minutes.',
    icon: <Rocket size={56} strokeWidth={1.5} color={COW_RED} />,
  },
  {
    title: 'Database schema file',
    desc: 'Complete SQL migrations, table relationships, and RLS policies. Your entire backend structure, ready to paste into Supabase.',
    icon: <Table2 size={56} strokeWidth={1.5} color={COW_RED} />,
  },
  {
    title: 'Auto-email system file',
    desc: 'Custom AI-powered email setup with Fastmail. Welcome sequences, onboarding drips, upgrade nudges, churn recovery\u2014all automated. Never read or reply to an email again.',
    icon: <WandSparkles size={56} strokeWidth={1.5} color={COW_RED} />,
  },
  {
    title: 'Brand identity file',
    desc: 'App name, color palette, typography, tone of voice, logo direction, and component styling tokens. Everything looks like one cohesive product from day one.',
    icon: <Crown size={56} strokeWidth={1.5} color={COW_RED} />,
  },
]

export default function DropInFilesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div>
      {/* Carousel viewport with edge fades */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--white), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--white), transparent)' }}
        />

        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {FILES.map((file, i) => {
              const isActive = i === selectedIndex

              return (
                <div
                  key={file.title}
                  className="flex-[0_0_85%] sm:flex-[0_0_65%] lg:flex-[0_0_50%] min-w-0 px-3"
                  onClick={scrollNext}
                >
                  <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.88,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="card rounded-3xl p-8 sm:p-10 text-center h-full"
                  style={{
                    border: isActive ? '2px solid #E8676B' : '2px solid transparent',
                  }}
                >
                  {/* Unique icon or cow image per card */}
                  <motion.div
                    animate={{ scale: isActive ? 1 : 0.7 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="mb-6 flex justify-center"
                  >
                    {file.image ? (
                      <Image
                        src={file.image}
                        alt={file.title}
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    ) : (
                      file.icon
                    )}
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-xl sm:text-2xl font-black mb-3"
                    style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
                  >
                    {file.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                    style={{ color: 'var(--brown-muted)' }}
                  >
                    {file.desc}
                  </p>
                </motion.div>
              </div>
            )
            })}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2.5 mt-8">
        {FILES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === selectedIndex ? 32 : 10,
              height: 10,
              background: i === selectedIndex ? '#E8676B' : 'rgba(232, 103, 107, 0.25)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
