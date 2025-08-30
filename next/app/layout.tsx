import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { HUDProvider } from 'components/ObservabilityHUD/store'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio',
  description: '技術で社会課題を解決するためのポートフォリオ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <HUDProvider>
          {children}
          <Toaster />
        </HUDProvider>
      </body>
    </html>
  )
}
