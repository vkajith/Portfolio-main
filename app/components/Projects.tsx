'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import HabitAct from '../img/HabitAct.png'
import WhatsappUI from '../img/WhatsappUI.png'
import SpotOnAi from '../img/spotonAi.png'

const projects = [
  {
    title: 'HabitAct',
    type: 'Personal Project',
    description: 'A minimalist habit tracker built with React and Next.js, offering a clean interface, seamless Supabase sync, and offline access.',
    image: HabitAct,
    tags: ['Next.js', 'React', 'PostgreSQL', 'Supabase'],
    link: 'https://habitact.vercel.app/',
  },
  {
    title: 'WhatsApp Chat Render',
    type: 'npm Package',
    description: 'A React component library for creating authentic WhatsApp-style chat interfaces. Published on npm with full TypeScript support.',
    image: WhatsappUI,
    tags: ['React', 'TypeScript', 'TailwindCSS', 'npm'],
    link: 'https://www.npmjs.com/package/whatsapp-chat-render',
  },
  {
    title: 'SpotOn AI',
    type: 'AI/ML Project',
    description: 'An intelligent real estate analysis tool providing locality insights and property appreciation predictions using ML models.',
    image: SpotOnAi,
    tags: ['Next.js', 'FastAPI', 'Python', 'AI/ML'],
    link: 'https://spoton-ai.vercel.app/',
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">
        Projects
      </h2>

      <div className="space-y-5 stagger-children">
        {projects.map((project, i) => (
          <a
            key={i}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex flex-col sm:flex-row gap-4 group rounded-xl p-4 -mx-4 border border-transparent hover:border-[var(--accent-soft-15)] hover:bg-[var(--bg-card)]"
          >
            {/* Thumbnail */}
            <div className="w-full sm:w-36 h-24 sm:h-24 rounded-lg overflow-hidden bg-[var(--bg-card)] shrink-0 relative border border-[var(--border-color)]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="144px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay with arrow */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] text-[14px] mb-1 flex items-center gap-1.5 group-hover:text-[var(--accent)] transition-colors duration-300">
                {project.title}
                <span className="text-[var(--text-muted)] font-normal text-[12px]">· {project.type}</span>
                <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
              </h3>
              <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed mb-2.5">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}