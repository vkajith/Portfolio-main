'use client'

import { useState, useEffect } from 'react'
import ProjectsCard from "./ui/projects-card"
import HabitAct from "../img/HabitAct.png"
import WhatsappUI from "../img/WhatsappUI.png"
import SpotOnAi from "../img/spotonAi.png"
import { motion, AnimatePresence } from "framer-motion"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const allProjects = [
        {
            title: "HabitAct - Minimalist Habit tracker",
            date: "December 2023 - Present",
            description: "A minimalist habit tracker built with React and Next.js, offering a clean interface, seamless Supabase sync, and offline access to help users build consistency and achieve their goals effortlessly",
            image: HabitAct,
            technologies: ["Next.js", "React", "PostgreSQL", "FastAPI", "Supabase"],
            type: "app",
            featured: true,
            metrics: {
                stars: 25,
                users: 100
            },
            links: {
                live: "https://habitact.vercel.app/",
                source: "https://github.com/vkajith/habitact"
            }
        },
        {
            title: "Whatsapp-renderer library",
            date: "August 2024 - Present",
            description: "WhatsApp Chat Render is a React component library that allows you to easily create and display WhatsApp-style chat interfaces in your web applications.",
            image: WhatsappUI,
            technologies: ["React", "TailwindCSS", "TypeScript"],
            type: "library",
            
            featured: false,
            metrics: {
                downloads: 1000,
                stars: 50
            },
            links: {
                live: "https://www.npmjs.com/package/whatsapp-chat-render",
                source: "https://github.com/vkajith/whatsapp-chat-render"
            }
        },
        {
            title: "SpotOn Ai - Property Analytical App",
            date: "December 2024 - Present",
            description: "An intelligent real estate analysis tool that provides detailed insights about localities and property appreciation predictions using AI",
            image: SpotOnAi,
            technologies: ["React", "TailwindCSS", "TypeScript", "Next.js", "PostgreSQL", "FastAPI"],
            type: "app",
            featured: true,
            metrics: {
                users: 500
            },
            links: {
                live: "https://spoton-ai.vercel.app/",
                source: "https://github.com/vkajith/spoton-ai"
            }
        }
    ]

    const featuredProjects = allProjects.filter(project => project.featured)
    const otherProjects = allProjects.filter(project => !project.featured)

    const { ref } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    useEffect(() => {
        if (!isAutoPlaying || featuredProjects.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredProjects.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, featuredProjects.length])

    const nextSlide = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev + 1) % featuredProjects.length)
    }

    const prevSlide = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)
    }

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false)
        setCurrentIndex(index)
    }

    return(
        <section id='projects' className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Projects</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Some things I&apos;ve built 🚀</p>
                </motion.div>

                {/* Featured Projects Carousel */}
                {featuredProjects.length > 0 && (
                    <>
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Featured Projects</h3>
                        <div ref={ref} className="relative mb-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full"
                                >
                                    <ProjectsCard {...featuredProjects[currentIndex]} />
                                </motion.div>
                            </AnimatePresence>

                            {featuredProjects.length > 1 && (
                                <>
                                    {/* Navigation Arrows */}
                                    <motion.button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaChevronLeft className="w-6 h-6" />
                                    </motion.button>

                                    <motion.button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaChevronRight className="w-6 h-6" />
                                    </motion.button>

                                    {/* Dots Navigation */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
                                        {featuredProjects.map((_, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    currentIndex === index 
                                                    ? 'bg-gray-800 dark:bg-white scale-125' 
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                                }`}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* Other Projects Grid */}
                {otherProjects.length > 0 && (
                    <>
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Other Projects</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherProjects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <ProjectsCard {...project} />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Projects;