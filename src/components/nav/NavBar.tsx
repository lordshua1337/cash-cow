'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Beef, Search, Briefcase } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard/pasture', label: 'The Pasture', icon: Search },
  { href: '/dashboard/herd', label: 'The Herd', icon: Briefcase },
] as const

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="w-full px-6 py-3 flex items-center justify-between"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all group-hover:scale-105"
          style={{ background: 'var(--amber-soft)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
        >
          <Beef size={18} style={{ color: 'var(--amber)' }} />
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Cash Cow
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + '/')

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--amber-soft)' : 'transparent',
                color: isActive ? 'var(--amber)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
