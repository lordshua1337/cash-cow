import type { Metadata } from 'next'
import { Nunito, Fredoka } from 'next/font/google'
import './globals.css'

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
  title: 'Cash Cow -- Find Ideas That Actually Make Money',
  description: 'Browse trending products, spot the gap nobody fills, and get a complete build spec ready for Claude Code. From zero to blueprint in 5 minutes.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
      <body>{children}</body>
    </html>
  )
}
