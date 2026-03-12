'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, AnimatePresence } from 'framer-motion'

const FILES = [
  {
    title: 'Customer persona file',
    desc: 'A detailed persona doc your AI builder uses to make every decision for a real human\u2014not a generic \u201Cuser.\u201D Every UI choice, every line of copy, informed by who\u2019s actually paying.',
  },
  {
    title: 'Landing page design file',
    desc: 'Full page structure, copy blocks, CTA placement, SEO meta tags, Open Graph cards. Your marketing site builds itself the same day your product does.',
  },
  {
    title: 'One-click deploy template',
    desc: 'Pre-configured repo scaffold matching your spec\u2019s tech stack. Clone it, drop your files in, ship. The gap between \u201Cplan\u201D and \u201Crunning code\u201D shrinks to minutes.',
  },
  {
    title: 'Database schema file',
    desc: 'Complete SQL migrations, table relationships, and RLS policies. Your entire backend structure, ready to paste into Supabase.',
  },
  {
    title: 'Auto-email system file',
    desc: 'Custom AI-powered email setup with Fastmail. Welcome sequences, onboarding drips, upgrade nudges, churn recovery\u2014all automated. Never read or reply to an email again.',
  },
  {
    title: 'Brand identity file',
    desc: 'App name, color palette, typography, tone of voice, logo direction, and component styling tokens. Everything looks like one cohesive product from day one.',
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

  return (
    <div>
      {/* Carousel viewport */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex">
          {FILES.map((file, i) => {
            const isActive = i === selectedIndex

            return (
              <div
                key={file.title}
                className="flex-[0_0_85%] sm:flex-[0_0_65%] lg:flex-[0_0_50%] min-w-0 px-3"
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
                  {/* Big SVG icon */}
                  <motion.div
                    animate={{ scale: isActive ? 1 : 0.7 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <Image
                      src="/icon-file-plus-cow-red.svg"
                      alt=""
                      width={100}
                      height={100}
                      className="mx-auto mb-6"
                    />
                  </motion.div>

                  {/* File number badge */}
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black mb-4"
                    style={{
                      background: '#E8676B',
                      color: '#fff',
                      fontFamily: 'var(--font-fredoka), sans-serif',
                    }}
                  >
                    {i + 1}
                  </div>

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
