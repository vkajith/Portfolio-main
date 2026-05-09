'use client'

import { motion } from 'framer-motion'
import { IconType } from 'react-icons'
import {
  FaReact, FaNodeJs, FaPython, FaDocker
} from 'react-icons/fa'
import {
  SiNextdotjs, SiTailwindcss,
  SiFastapi, SiMongodb, SiExpress, SiTypescript, SiNestjs,
  SiGraphql, SiRedux, SiPrisma
} from 'react-icons/si'
import { BiLogoPostgresql } from "react-icons/bi";
import { IoLogoFirebase } from "react-icons/io5";

interface SkillCategory {
  title: string
  skills: {
    name: string
    icon: IconType
    color: string
  }[]
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: 'React', icon: FaReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Redux', icon: SiRedux, color: '#764ABC' },
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
      { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
      { name: 'Express', icon: SiExpress, color: '#000000' },
      { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
      { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
      { name: 'Python', icon: FaPython, color: '#3776AB' },
    ]
  },
  {
    title: "Database & Cloud",
    skills: [
      { name: 'PostgreSQL', icon: BiLogoPostgresql, color: '#4169E1' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      { name: 'Firebase', icon: IoLogoFirebase, color: '#FFCA28' },
      { name: 'Prisma', icon: SiPrisma, color: '#2D3748' },
      { name: 'Docker', icon: FaDocker, color: '#2496ED' },
    ]
  }
]

const Skills = () => {
  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Technical <span className="text-gradient-gold italic">Arsenal</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The tools and technologies I use to bring ideas to life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-8 rounded-2xl border border-white/10"
            >
              <h3 className="text-xl font-bold mb-8 text-center border-b border-white/10 pb-4">
                {category.title}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      <skill.icon size={24} style={{ color: skill.color }} className="grayscale group-hover:grayscale-0 transition-all duration-300" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills

