'use client'

import { useState } from 'react'
import { X, Check, Loader } from 'lucide-react'

const DEFAULT_SECTIONS = [
  { id: 'tech_stack', label: 'Tech Stack', enabled: true },
  { id: 'mvp_features', label: 'MVP Features', enabled: true },
  { id: 'data_model', label: 'Data Model', enabled: true },
  { id: 'build_timeline', label: 'Build Timeline', enabled: true },
  { id: 'risks', label: 'Risks & Mitigations', enabled: true },
  { id: 'revenue_model', label: 'Revenue Model', enabled: true },
] as const

type SectionId = (typeof DEFAULT_SECTIONS)[number]['id']

interface BriefCustomizerProps {
  readonly onGenerate: (sections: readonly string[], customSections: readonly string[]) => void
  readonly onClose: () => void
  readonly isLoading: boolean
}

export function BriefCustomizer({ onGenerate, onClose, isLoading }: BriefCustomizerProps) {
  const [enabledSections, setEnabledSections] = useState<Record<SectionId, boolean>>(
    Object.fromEntries(DEFAULT_SECTIONS.map((s) => [s.id, s.enabled])) as Record<SectionId, boolean>
  )
  const [customSection, setCustomSection] = useState('')
  const [customSections, setCustomSections] = useState<string[]>([])

  const toggleSection = (id: SectionId) => {
    setEnabledSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const addCustomSection = () => {
    if (!customSection.trim()) return
    setCustomSections((prev) => [...prev, customSection.trim()])
    setCustomSection('')
  }

  const removeCustomSection = (index: number) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    const selected = DEFAULT_SECTIONS
      .filter((s) => enabledSections[s.id])
      .map((s) => s.label)
    onGenerate(selected, customSections)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-md mx-4 p-6 rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Customize Brief</h3>
          <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Choose which sections to include in your brief.
        </p>

        {/* Standard sections */}
        <div className="space-y-2 mb-4">
          {DEFAULT_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-left transition-all"
              style={{
                background: enabledSections[section.id] ? 'var(--cash-soft)' : 'var(--bg)',
                border: `1px solid ${enabledSections[section.id] ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
              }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                style={{
                  background: enabledSections[section.id] ? 'var(--cash)' : 'transparent',
                  border: enabledSections[section.id] ? 'none' : '1px solid var(--border)',
                }}
              >
                {enabledSections[section.id] && <Check size={10} color="#fff" />}
              </div>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Custom sections */}
        <div className="mb-4">
          <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Custom Sections</p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={customSection}
              onChange={(e) => setCustomSection(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomSection()}
              placeholder="e.g., Marketing Strategy"
              className="flex-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }}
            />
            <button
              onClick={addCustomSection}
              disabled={!customSection.trim()}
              className="px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
              style={{ background: 'var(--cash-soft)', color: 'var(--cash)' }}
            >
              Add
            </button>
          </div>
          {customSections.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {customSections.map((cs, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                  style={{ background: 'var(--blue-soft)', color: 'var(--blue)' }}
                >
                  {cs}
                  <button onClick={() => removeCustomSection(i)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          style={{ background: 'var(--cash)', color: '#fff' }}
        >
          {isLoading ? (
            <>
              <Loader size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Custom Brief'
          )}
        </button>
      </div>
    </div>
  )
}
