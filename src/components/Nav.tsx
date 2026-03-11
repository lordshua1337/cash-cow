'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Heart } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/ideas', label: 'Ideas', icon: Zap },
  { href: '/favorites', label: 'Saved', icon: Heart },
]

export default function Nav() {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  return (
    <nav
      className="w-full px-4 sm:px-6 py-3 flex items-center justify-between absolute top-0 left-0 right-0 z-50"
      style={isLanding ? {} : {
        position: 'relative',
        borderBottom: '2px solid var(--spot-gray)',
        background: 'var(--white)',
      }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: isLanding ? 'rgba(255,255,255,0.06)' : 'var(--spot-black)',
            border: isLanding ? '1px solid rgba(255,255,255,0.1)' : 'none',
            boxShadow: isLanding ? 'none' : '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <span className="text-base">&#x1F404;</span>
        </div>
        <span
          className="text-lg font-bold tracking-tight hidden sm:inline"
          style={{
            fontFamily: 'var(--font-fredoka), sans-serif',
            color: isLanding ? '#FAFAFA' : undefined,
          }}
        >
          Cash Cow
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
              style={isLanding ? {
                background: 'rgba(255,255,255,0.06)',
                color: '#AAAAAA',
                border: '1px solid rgba(255,255,255,0.08)',
              } : {
                background: isActive ? 'var(--spot-black)' : 'transparent',
                color: isActive ? 'var(--cream)' : 'var(--brown-muted)',
              }}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
