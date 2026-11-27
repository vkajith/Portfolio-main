'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ROUTES: Record<string, string> = {
  g: '/garden',
  w: '/writing',
  p: '/photography',
}

export default function ExploreShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      const route = ROUTES[event.key.toLowerCase()]
      if (!route) return
      event.preventDefault()
      router.push(route)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return null
}
