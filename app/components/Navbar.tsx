'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 100

      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute('id') || ''

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-800/30' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            className="text-xl font-bold text-gray-900 dark:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">VK</span>
          </motion.a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['about', 'experience', 'projects', 'contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className={`nav-link capitalize dark:text-gray-200 dark:hover:text-white ${
                  activeSection === item ? 'active' : ''
                }`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 dark:text-white"
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          className={`md:hidden overflow-hidden`}
        >
          <div className="py-4 space-y-4">
            {['about', 'experience', 'projects', 'contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className={`block nav-link capitalize dark:text-gray-200 dark:hover:text-white ${
                  activeSection === item ? 'active' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}

export default Navbar