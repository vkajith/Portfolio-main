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
  metadataBase: new URL('https://vysyakhajith.com'),
  title: 'Vysyakh Ajith — AI Agent Platform Engineer',
  description: 'AI agent platform engineer building LLM gateways, agent orchestration, LLM-as-judge evaluation, and analytics at 10M+ events/month. Ask Pompu, or book a call.',
  openGraph: {
    title: 'Vysyakh Ajith — AI Agent Platform Engineer',
    description: 'Building the platform layer under production AI agents: LLM gateways, orchestration, evals, and analytics at scale.',
    url: 'https://vysyakhajith.com',
    siteName: 'Vysyakh Ajith',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vysyakh Ajith — AI Agent Platform Engineer',
    description: 'Building the platform layer under production AI agents: LLM gateways, orchestration, evals, and analytics at scale.',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vysyakh Ajith',
  url: 'https://vysyakhajith.com',
  jobTitle: 'AI Agent Platform Engineer',
  sameAs: [
    'https://github.com/vkajith',
    'https://linkedin.com/in/vysyakh-ajith',
    'https://x.com/whyshagajith',
  ],
}

// Pre-hydration script: read the saved theme and apply it to <html> before
// React mounts so we never flash the wrong palette. Falls back to the user's
// OS preference if nothing is saved.
const themeBootstrap = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <SmoothScroll>
          {children}
          <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
