import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import SmoothScroll from './components/SmoothScroll'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata = {
  title: 'Vysyakh Ajith — Software Engineer',
  description: 'Software Development Engineer specializing in React, Next.js, and full-stack development. Building better experiences for the web.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <SmoothScroll>
          {children}
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
