'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-muted-foreground flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Vysyakh Ajith
          </p>
          <p className="text-sm text-muted-foreground/50">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

