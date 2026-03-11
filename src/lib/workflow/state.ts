// Workflow wizard state types

import type { TrendingMonetizableProduct } from '@/lib/sources/types'
import type { BuildSpec } from '@/lib/types'

export type WorkflowStep = 1 | 2 | 3 | 4
export type CustomizeSubStep = 'audience' | 'differentiator' | 'features' | 'tech'

export interface WorkflowState {
  readonly selectedProduct: TrendingMonetizableProduct | null
  readonly audience: string
  readonly differentiator: string
  readonly features: readonly string[]
  readonly customFeatures: string
  readonly techPrefs: 'simple' | 'custom'
  readonly spec: BuildSpec | null
  readonly currentStep: WorkflowStep
  readonly customizeSubStep: CustomizeSubStep
}

export const INITIAL_WORKFLOW_STATE: WorkflowState = {
  selectedProduct: null,
  audience: '',
  differentiator: '',
  features: [],
  customFeatures: '',
  techPrefs: 'simple',
  spec: null,
  currentStep: 1,
  customizeSubStep: 'audience',
}

export const SUGGESTED_FEATURES: Record<string, readonly string[]> = {
  default: [
    'User authentication & accounts',
    'Dashboard with key metrics',
    'Stripe payment integration',
    'Email notifications',
    'Admin panel',
    'API for integrations',
    'Export data (CSV/PDF)',
    'Mobile-responsive design',
  ],
}
