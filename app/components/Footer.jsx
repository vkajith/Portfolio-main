'use client'

import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-10 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-accent-gradient opacity-40" />
      <div className="container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-600 dark:text-gray-400"
        >
          &copy; {new Date().getFullYear()} Vysyakh Ajith. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
}

export default Footer

