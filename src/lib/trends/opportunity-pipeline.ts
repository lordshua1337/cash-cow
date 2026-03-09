export type PipelineStage = 'watching' | 'researching' | 'building' | 'launched'

export interface PipelineEntry {
  readonly trendId: string
  readonly stage: PipelineStage
  readonly addedAt: string
  readonly movedAt: string
  readonly notes: string
}

export interface Pipeline {
  readonly entries: readonly PipelineEntry[]
}

const STORAGE_KEY = 'cashcow-trends-pipeline'

export function loadPipeline(): Pipeline {
  if (typeof window === 'undefined') return { entries: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [] }
    return JSON.parse(raw) as Pipeline
  } catch {
    return { entries: [] }
  }
}

function savePipeline(pipeline: Pipeline): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pipeline))
}

export function addToPipeline(trendId: string, stage: PipelineStage = 'watching'): Pipeline {
  const current = loadPipeline()
  const existing = current.entries.find((e) => e.trendId === trendId)
  if (existing) return current

  const now = new Date().toISOString()
  const newEntry: PipelineEntry = {
    trendId,
    stage,
    addedAt: now,
    movedAt: now,
    notes: '',
  }
  const updated: Pipeline = {
    entries: [...current.entries, newEntry],
  }
  savePipeline(updated)
  return updated
}

export function movePipelineEntry(trendId: string, newStage: PipelineStage): Pipeline {
  const current = loadPipeline()
  const updated: Pipeline = {
    entries: current.entries.map((e) =>
      e.trendId === trendId
        ? { ...e, stage: newStage, movedAt: new Date().toISOString() }
        : e
    ),
  }
  savePipeline(updated)
  return updated
}

export function updatePipelineNotes(trendId: string, notes: string): Pipeline {
  const current = loadPipeline()
  const updated: Pipeline = {
    entries: current.entries.map((e) =>
      e.trendId === trendId ? { ...e, notes } : e
    ),
  }
  savePipeline(updated)
  return updated
}

export function removeFromPipeline(trendId: string): Pipeline {
  const current = loadPipeline()
  const updated: Pipeline = {
    entries: current.entries.filter((e) => e.trendId !== trendId),
  }
  savePipeline(updated)
  return updated
}

export function getPipelineEntry(trendId: string): PipelineEntry | undefined {
  const pipeline = loadPipeline()
  return pipeline.entries.find((e) => e.trendId === trendId)
}

export function getPipelineEntriesByStage(stage: PipelineStage): readonly PipelineEntry[] {
  const pipeline = loadPipeline()
  return pipeline.entries.filter((e) => e.stage === stage)
}

export function getPipelineCounts(): Record<PipelineStage, number> {
  const pipeline = loadPipeline()
  return {
    watching: pipeline.entries.filter((e) => e.stage === 'watching').length,
    researching: pipeline.entries.filter((e) => e.stage === 'researching').length,
    building: pipeline.entries.filter((e) => e.stage === 'building').length,
    launched: pipeline.entries.filter((e) => e.stage === 'launched').length,
  }
}

export const STAGE_LABELS: Record<PipelineStage, string> = {
  watching: 'Watching',
  researching: 'Researching',
  building: 'Building',
  launched: 'Launched',
}

export const STAGE_COLORS: Record<PipelineStage, string> = {
  watching: '#3B82F6',
  researching: '#F97316',
  building: '#22C55E',
  launched: '#A855F7',
}
