'use client'

import { useEffect, useState } from 'react'
import { FaReact, FaFileAlt, FaNodeJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { FiTerminal } from "react-icons/fi";
import FloatingElements from "./ui/floating-elements";
import ParticleBackground from "./ui/ParticleBackground";
import { motion } from 'framer-motion'

const ROLES = [
  'Software Engineer building delightful interfaces',
  'Frontend Architect & full-stack dabbler',
  'AI tinkerer · coffee → code converter ☕',
  'Currently teaching a rabbit to ship features 🐰',
]

const useTypewriter = (phrases: string[], typeMs = 55, pauseMs = 1700) => {
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && text === '') {
      setDeleting(false)
      setPhraseIdx(i => (i + 1) % phrases.length)
    } else {
      timeout = setTimeout(() => {
        setText(prev => deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1))
      }, deleting ? typeMs / 2 : typeMs)
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, phraseIdx, phrases, typeMs, pauseMs])

  return text
}

const openTerminal = (command?: string) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('terminal:run', { detail: { command, open: true } }))
}

const Hero = () => {
  const subtitle = useTypewriter(ROLES)

  return(
    <section id="about" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-indigo-900/10 dark:to-gray-900" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      {/* Subtle particles */}
      <div className="absolute inset-0 opacity-[0.35]">
        <ParticleBackground />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElements delay={0}>
          <FaReact className="absolute top-20 left-[20%] text-indigo-500/40 dark:text-indigo-400/40 w-14 h-14"/>
        </FloatingElements>
        <FloatingElements delay={1}>
          <FaNodeJs className="absolute top-40 right-[25%] text-green-500/40 dark:text-green-400/40 w-12 h-12"/>
        </FloatingElements>
        <FloatingElements delay={2}>
          <SiTypescript className="absolute top-[34rem] left-[25%] text-blue-500/40 dark:text-blue-400/40 w-11 h-11"/>
        </FloatingElements>
      </div>

      <div className="text-center z-10 px-2 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-2"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hey, I&apos;m{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Vysyakh</span>
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-2 min-h-[3.5rem]"
        >
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-2 font-mono">
            <span>{subtitle}</span>
            <span className="inline-block w-[2px] h-5 md:h-6 ml-1 align-middle bg-gray-700 dark:bg-gray-200 animate-pulse" />
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            psst — there’s a 🐰 living at the bottom of this page. press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-xs font-mono">/</kbd> to wake him up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
        >
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Resume
            <FaFileAlt className="ml-2 group-hover:rotate-12 transition-transform" />
          </motion.a>
          <motion.button
            type="button"
            onClick={() => openTerminal('whoami')}
            className="btn-outline"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTerminal className="mr-1" /> Talk to Pompu
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero;
