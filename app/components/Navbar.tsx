'use client'

import { motion } from "framer-motion"
import { Home, Briefcase, Mail, FolderOpen, Heart } from "lucide-react"

const Navbar = () => {
  const navItems = [
    { name: "Home", href: "#about", icon: Home },
    { name: "Projects", href: "#projects", icon: FolderOpen },
    { name: "Exp", href: "#experience", icon: Briefcase },
    { name: "Skills", href: "#skills", icon: Heart },
    { name: "Contact", href: "#contact", icon: Mail },
  ]

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl"
      >
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="relative px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors group"
          >
            <span className="relative z-10 flex items-center gap-2">
              {/* Icon only on mobile, text on desktop */}
              <item.icon className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">{item.name}</span>
            </span>

            {/* Magnetic Hover Background */}
            <span className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          </a>
        ))}
      </motion.nav>
    </header>
  )
}

export default Navbar