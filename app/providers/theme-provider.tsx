'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext({
  theme: 'light' as Theme,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Add transition styles for smooth theme switching
    document.documentElement.style.setProperty('transition', 
      'background-color 0.5s ease-in-out, ' +
      'color 0.5s ease-in-out, ' +
      'border-color 0.5s ease-in-out, ' +
      'transform 0.5s ease-in-out, ' +
      'opacity 0.5s ease-in-out, ' +
      'box-shadow 0.5s ease-in-out'
    )
    
    // Add a subtle scale animation
    document.documentElement.style.setProperty('transform', 'scale(0.98)')
    document.documentElement.classList.toggle('dark')
    
    // Reset transform and remove transition after animation
    setTimeout(() => {
      document.documentElement.style.setProperty('transform', 'scale(1)')
      setTimeout(() => {
        document.documentElement.style.removeProperty('transition')
        document.documentElement.style.removeProperty('transform')
      }, 500)
    }, 50)
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)