'use client'

import Marquee from "react-fast-marquee";
import {
    FaReact, FaNodeJs, FaPython, FaDocker, FaAws, FaFigma
} from 'react-icons/fa'
import {
    SiNextdotjs, SiTailwindcss, SiTypescript, SiGraphql, SiMongodb, SiPostgresql, SiRedux, SiKubernetes
} from 'react-icons/si'

const skills = [
    { name: 'React', icon: FaReact },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'Node.js', icon: FaNodeJs },
    { name: 'Tailwind', icon: SiTailwindcss },
    { name: 'Redux', icon: SiRedux },
    { name: 'GraphQL', icon: SiGraphql },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'AWS', icon: FaAws },
    { name: 'Docker', icon: FaDocker },
    { name: 'Python', icon: FaPython },
    { name: 'Figma', icon: FaFigma },
    { name: 'Kubernetes', icon: SiKubernetes },
]

const TechMarquee = () => {
    return (
        <div className="py-24 bg-background overflow-hidden">
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

                <Marquee speed={40} gradient={false} className="py-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="mx-12 flex items-center gap-3 group cursor-default">
                            <span className="text-4xl text-gray-600 group-hover:text-white transition-colors duration-300">
                                <skill.icon />
                            </span>
                            <span className="text-xl font-medium text-gray-600 group-hover:text-white transition-colors duration-300 font-serif italic">
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
    )
}

export default TechMarquee
