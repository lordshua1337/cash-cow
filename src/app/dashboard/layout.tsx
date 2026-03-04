import NavBar from '@/components/nav/NavBar'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
