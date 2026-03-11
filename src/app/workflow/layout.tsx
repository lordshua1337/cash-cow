import { WorkflowProvider } from '@/lib/workflow/context'

export default function WorkflowLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return <WorkflowProvider>{children}</WorkflowProvider>
}
