import type { Metadata } from 'next'
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
  title: 'Cash Cow -- Browse Trending Products & Get Build Specs',
  description: 'Browse what\'s trending on Hacker News and GitHub. Save what interests you. Get a plain-English build spec ready for Claude Code.',
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
