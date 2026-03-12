import type { Metadata, Viewport } from 'next'
import { Nunito, Fredoka } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
})

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Cash Cow -- Pick an Idea, Get a Build Spec',
  description: 'Pick a proven product idea. Get a step-by-step build spec you can paste into Claude Code. Start building this weekend.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
