'use client'

import Image from 'next/image'
import anarock from '../img/anarock.jpg'
import nagarro from '../img/nagarro.png'
import observe from '../img/observe.png'
import { ArrowUpRight } from 'lucide-react'

const experiences = [
  {
    period: 'JUL 2025 — PRESENT',
    title: 'Software Development Engineer II',
    company: 'Observe AI',
    logo: observe,
    description: 'Working in the Agentic Platform development team, building end-to-end solutions for agent building and analytics modules. Focused on creating intuitive interfaces for complex AI-powered workflows.',
    tags: ['React', 'TypeScript', 'Next.js', 'Agentic AI'],
  },
  {
    period: 'FEB 2022 — JUL 2025',
    title: 'Software Development Engineer II',
    company: 'Anarock Technology',
    link: 'https://www.anarock.com',
    logo: anarock,
    description: 'Led the platform facelift of the CRM Dashboard for 500+ users. Improved engagement via Gen-AI campaign tools (150 → 1,000 interactions/month). Engineered cross-platform campaign toolkit using Expo, reducing costs by $10K annually.',
    tags: ['React', 'TypeScript', 'Next.js', 'Redux', 'Expo', 'Gen-AI'],
  },
  {
    period: 'AUG 2021 — FEB 2022',
    title: 'Associate Engineer',
    company: 'Nagarro',
    link: 'https://www.nagarro.com',
    logo: nagarro,
    description: 'Developed Invoice Generation Module for a health portal using React.js, TypeScript, and .NET Web API. Implemented Partial Billing System with dynamic validation. Migrated legacy applications to modern frameworks.',
    tags: ['React', 'TypeScript', '.NET', 'React Hook Form'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="mb-16">
      <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">
        Experience
      </h2>

      <div className="space-y-6 stagger-children">
        {experiences.map((exp, i) => (
          <div key={i} className="group">
            <div className="text-[11px] font-mono tracking-wider text-[var(--text-muted)] mb-2.5 uppercase">
              {exp.period}
            </div>

            <div className="card-hover bg-[var(--bg-card)] rounded-xl p-5 border border-transparent hover:border-[rgba(107,127,62,0.15)]">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                  <Image src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] text-[14px] leading-tight group-hover:text-[var(--accent)] transition-colors duration-300">
                    {exp.title}
                    <span className="text-[var(--text-muted)] font-normal"> · </span>
                    {exp.link ? (
                      <a href={exp.link} target="_blank" rel="noopener noreferrer" className="link-hover inline-flex items-center gap-0.5">
                        {exp.company}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span>{exp.company}</span>
                    )}
                  </h3>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed mb-3.5">{exp.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <span key={tag} className="tag-interactive text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}