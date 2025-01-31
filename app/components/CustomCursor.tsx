'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updatePosition)
    return () => window.removeEventListener('mousemove', updatePosition)
  }, [])

  return (
    <motion.div
      className="fixed w-6 h-6 border-2 border-primary rounded-full pointer-events-none z-50"
      animate={{ x: position.x - 12, y: position.y - 12 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    />
  )
}

export default CustomCursor