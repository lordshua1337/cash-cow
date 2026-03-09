'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Target, ArrowRight, Zap } from 'lucide-react'

const SUB_NAV = [
  { href: '/dashboard/trends', label: 'Overview', icon: Target, exact: true },
  { href: '/dashboard/trends/pipeline', label: 'Pipeline', icon: ArrowRight },
  { href: '/dashboard/trends/goldmine', label: 'Goldmine', icon: Zap },
] as const

export default function TrendsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col">
      <div
        className="px-6 py-2 flex items-center gap-1 overflow-x-auto"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        {SUB_NAV.map(({ href, label, icon: Icon, ...rest }) => {
          const exact = 'exact' in rest && rest.exact
          const isActive = exact ? pathname === href : pathname?.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: isActive ? 'var(--cash-soft)' : 'transparent',
                color: isActive ? 'var(--cash)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={14} />
              {label}
            </Link>
          )
        })}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
