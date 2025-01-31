import './globals.css'
export const metadata = {
  title: 'Vysyakh Ajith - Software Engineeer & Tech Enthusiast',
  description: 'Personal portfolio of Vysyakh Ajith - bringing design and engineering at same place',
}

import CustomCursor from './components/CustomCursor'
import { ThemeProvider } from './providers/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <ThemeProvider>
          <CustomCursor />
          <main>{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
