'use client'

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

const Hero = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] bg-purple-500/20 rounded-full blur-[100px] animate-float opacity-50" />
        <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[100px] animate-float opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-emerald-500/10 rounded-full blur-[100px] animate-float opacity-30" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">Available for work</span>
          </motion.div>

          {/* Main Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white">
              Vysyakh
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-gray-400">
              Ajith
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 max-w-2xl"
          >
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
              Product Designer & Developer shaping pixels into
              <span className="text-white font-serif italic mx-2">meaningful experiences</span>
              with heart.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500/50"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ArrowDown className="animate-bounce w-4 h-4" />
      </motion.div>
    </section>
  )
}

export default Hero