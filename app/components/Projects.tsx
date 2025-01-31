'use client'

import ProjectsCard from "./ui/projects-card"
import HabitAct from "/Users/anarock/Documents/GitHub/Portfolio-main/public/HabitAct.png";
import WhatsappUI from "/Users/anarock/Documents/GitHub/Portfolio-main/public/WhatsappUI.png";
import { motion } from "framer-motion"

const Projects = () => {
    const projects = [
        {
          title: "HabitAct - Minimalist Habit tracker",
          date: "December 2023 - Present",
          description: "Developed a minimalist habit tracker app to track daily habits and set goals. Implemented a clean and intuitive user interface.",
          image: HabitAct,
          technologies: ["Next.js", "React", "PostgreSQL", "FastAPI"],
          type: "app",
          links: {
            live: "https://habitact.vercel.app/",
            source: "https://github.com/vkajith/habitact"
          }
        },
        {
          title: "Whatsapp-renderer library",
          date: "December 2023 - Present",
          description: "WhatsApp Chat Render is a React component library that allows you to easily create and display WhatsApp-style chat interfaces in your web applications.",
          image: WhatsappUI,
          technologies: ["React", "TailwindCSS", "TypeScript"],
          type: "library",
          links: {
            live: "https://www.npmjs.com/package/whatsapp-chat-render",
            source: "https://github.com/vkajith/whatsapp-chat-render"
          }
        }
      ]
    
    return(
        <section id='projects' className="py-20 bg-white dark:bg-gray-900">
            <div className="px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">Projects</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-12">Some things I&apos;ve built 🚀</p>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <ProjectsCard key={index} {...project}/>
                    ))}
                </div>
            </div>
        </ section>
    )
}

export default Projects;