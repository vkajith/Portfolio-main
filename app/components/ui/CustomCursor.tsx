'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y)
      setIsPointer(
        window.getComputedStyle(hoveredElement || document.body).cursor === 'pointer'
      )
    }

    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseover', updateCursorType)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', updateCursorType)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [position.x, position.y])

  return (
    <>
      <motion.div
        className="fixed w-4 h-4 bg-black dark:bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{ 
          x: position.x - 8,
          y: position.y - 8,
          opacity: isHidden ? 0 : 1,
          scale: isPointer ? 0.8 : 1
        }}
        transition={{ 
          type: "spring",
          damping: 30,
          stiffness: 200,
          opacity: { duration: 0.2 }
        }}
      />
      <motion.div
        className="fixed w-8 h-8 border-2 border-black dark:border-white rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{ 
          x: position.x - 16, 
          y: position.y - 16,
          scale: isPointer ? 1.5 : 1,
          opacity: isHidden ? 0 : 1
        }}
        transition={{ 
          type: "spring",
          damping: 30,
          stiffness: 200,
          opacity: { duration: 0.2 }
        }}
      />
    </>
  )
}

export default CustomCursor