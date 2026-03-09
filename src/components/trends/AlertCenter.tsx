'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, AlertTriangle, TrendingDown, Newspaper, Zap } from 'lucide-react'
import type { Alert } from '@/lib/trends/types'
import { getAlerts } from '@/lib/trends/mock-data'

const alertTypeConfig = {
  Breakout: {
    icon: Zap,
    color: '#00E676',
    bg: 'rgba(0, 230, 118, 0.1)',
    border: 'rgba(0, 230, 118, 0.3)',
    label: 'Breakout',
  },
  Decay: {
    icon: TrendingDown,
    color: '#FF5252',
    bg: 'rgba(255, 82, 82, 0.1)',
    border: 'rgba(255, 82, 82, 0.3)',
    label: 'Decay',
  },
  DailyDigest: {
    icon: Newspaper,
    color: '#00D4FF',
    bg: 'rgba(0, 212, 255, 0.1)',
    border: 'rgba(0, 212, 255, 0.3)',
    label: 'Digest',
  },
  Custom: {
    icon: AlertTriangle,
    color: '#FFD600',
    bg: 'rgba(255, 214, 0, 0.1)',
    border: 'rgba(255, 214, 0, 0.3)',
    label: 'Custom',
  },
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  return 'just now'
}

interface AlertItemProps {
  readonly alert: Alert
  readonly onRead: (id: string) => void
}

function AlertItem({ alert, onRead }: AlertItemProps) {
  const config = alertTypeConfig[alert.alert_type]
  const Icon = config.icon
  const isUnread = !alert.read_at

  return (
    <div
      className="p-3 rounded-lg cursor-pointer transition-colors"
      style={{
        background: isUnread ? config.bg : 'transparent',
        border: `1px solid ${isUnread ? config.border : 'var(--border)'}`,
      }}
      onClick={() => onRead(alert.id)}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 mt-0.5"
          style={{ background: config.bg, border: `1px solid ${config.border}` }}
        >
          <Icon size={13} style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="text-xs font-semibold truncate"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
            <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
              {formatRelativeTime(alert.sent_at)}
            </span>
          </div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>
            {alert.title}
          </p>
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {alert.message}
          </p>
        </div>
      </div>
    </div>
  )
}

export function AlertCenter() {
  const initialAlerts = getAlerts()
  const [alerts, setAlerts] = useState<readonly Alert[]>(initialAlerts)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = alerts.filter((a) => !a.read_at).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  function markRead(id: string) {
    const now = new Date().toISOString()
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id && !a.read_at ? { ...a, read_at: now } : a
      )
    )
  }

  function markAllRead() {
    const now = new Date().toISOString()
    setAlerts((prev) => prev.map((a) => (a.read_at ? a : { ...a, read_at: now })))
  }

  return (
    <div ref={ref} className="relative">
      <button
        className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Alerts, ${unreadCount} unread`}
      >
        <Bell size={16} style={{ color: unreadCount > 0 ? 'var(--accent)' : 'var(--text-secondary)' }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
            style={{ background: 'var(--accent)', color: '#0A0A0F' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-96 rounded-xl z-50 shadow-2xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <Bell size={15} style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Alerts
              </span>
              {unreadCount > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  className="text-xs transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <X size={15} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Alert list */}
          <div className="overflow-y-auto max-h-[420px] p-3 flex flex-col gap-2">
            {alerts.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No alerts yet.
              </p>
            ) : (
              alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} onRead={markRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
