'use client'

import { useEffect, useState } from 'react'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

type Drop = { id: number; left: number; delay: number; size: number; rot: number }

export default function CarrotRain() {
  const [drops, setDrops] = useState<Drop[]>([])

  // Make it rain.
  const triggerRain = () => {
    const count = 36
    const next: Drop[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      size: 18 + Math.random() * 24,
      rot: Math.random() * 360,
    }))
    setDrops(next)
    // self-clear after the longest fall + delay
    setTimeout(() => setDrops([]), 4500)
  }

  // Konami listener
  useEffect(() => {
    let buffer: string[] = []
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      buffer.push(k)
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length)
      if (buffer.length === SEQUENCE.length && buffer.every((v, i) => v === SEQUENCE[i])) {
        buffer = []
        triggerRain()
      }
    }
    window.addEventListener('keydown', onKey)

    // Programmatic trigger from Terminal /carrot
    const onCustom = () => triggerRain()
    window.addEventListener('pompu:carrot-rain', onCustom as EventListener)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pompu:carrot-rain', onCustom as EventListener)
    }
  }, [])

  if (drops.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden>
      {drops.map((d) => (
        <span
          key={d.id}
          className="carrot-fall absolute"
          style={{
            left: `${d.left}%`,
            top: '-10vh',
            fontSize: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            transform: `rotate(${d.rot}deg)`,
          }}
        >
          🥕
        </span>
      ))}
    </div>
  )
}
