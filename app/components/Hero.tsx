'use client'

import { FaReact, FaFileAlt, FaNodeJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import FloatingElements from "./ui/floating-elements";
import { motion } from 'framer-motion'

const Hero = () => {
  return(
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-indigo-900/10 dark:to-gray-900" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      
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
            <span className="relative inline-block text-gray-900 dark:text-white">
              Vysyakh
              <motion.span 
                className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 dark:bg-yellow-500 -z-10 opacity-75"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ transformOrigin: 'left', transform: 'rotate(-2deg)' }}
              />
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-2"
        >
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8">
            Software Engineer & Tech Enthusiast 👨‍💻
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Resume
            <FaFileAlt className="ml-2 group-hover:rotate-12 transition-transform" />
          </motion.a>
          <motion.a
            href="#contact"
            className="relative overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero;