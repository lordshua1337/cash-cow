'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, Heart } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Ideas', icon: TrendingUp },
  { href: '/favorites', label: 'Favorites', icon: Heart },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav
      className="w-full px-4 sm:px-6 py-3 flex items-center justify-between"
      style={{
        borderBottom: '2px solid var(--spot-gray)',
        background: 'var(--white)',
      }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: 'var(--spot-black)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <span className="text-base">&#x1F404;</span>
        </div>
        <span
          className="text-lg font-bold tracking-tight hidden sm:inline"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
        >
          Cash Cow
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{
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
