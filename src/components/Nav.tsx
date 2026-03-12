'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hammer, Bookmark } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/workflow', label: 'Build', icon: Hammer },
  { href: '/favorites', label: 'Saved', icon: Bookmark },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45, 35, 25, 0.06)',
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 group">
        <Image
          src="/cc-logo-menu.png"
          alt="Cash Cow"
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span
          className="text-lg font-bold tracking-tight hidden sm:inline"
          style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: isActive ? 'var(--cash)' : 'transparent',
                color: isActive ? '#fff' : 'var(--brown-muted)',
                boxShadow: isActive ? '0 2px 8px rgba(34, 197, 94, 0.2)' : 'none',
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
