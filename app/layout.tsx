import type { Metadata } from 'next'
import { Noto_Serif_Thai, IBM_Plex_Sans_Thai } from 'next/font/google'
import './globals.css'

const display = Noto_Serif_Thai({
  subsets: ['thai', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'แค็ตตาล็อกสินค้า',
  description: 'แค็ตตาล็อกสินค้าสำหรับลูกค้าเลือกชม',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${display.variable} ${body.variable} font-body`}>{children}</body>
    </html>
  )
}
