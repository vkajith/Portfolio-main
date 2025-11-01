'use client'

import { motion } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { FaGlobe, FaGithub, FaStar, FaDownload, FaUsers } from 'react-icons/fa'

interface ProjectCardProps {
    title: string
    description: string
    date: string
    image: StaticImageData
    technologies: string[]
    type: string
    featured: boolean
    metrics?: {
        stars?: number
        downloads?: number
        users?: number
    }
    links: {
        live?: string
        source?: string
    }
}

const ProjectsCard = ({ 
    title, 
    description, 
    date, 
    image, 
    technologies, 
    type, 
    featured,
    metrics,
    links 
}: ProjectCardProps) => {
    return(
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-[1.01]"
        >
            {/* Featured Badge */}
            {featured && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-accent-gradient text-white text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                        Featured
                    </span>
                </div>
            )}

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={featured}
                />
            </div>

            <div className='flex flex-col p-6 flex-grow'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{date}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{description}</p>

                {/* Metrics */}
                {metrics && (
                    <div className="flex gap-4 mb-6">
                        {metrics.stars && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FaStar className="text-yellow-400" />
                                <span>{metrics.stars}</span>
                            </div>
                        )}
                        {metrics.downloads && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FaDownload />
                                <span>{metrics.downloads}</span>
                            </div>
                        )}
                        {metrics.users && (
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FaUsers />
                                <span>{metrics.users}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className='flex flex-wrap gap-2 mb-6'>
                    {technologies.map((item,index) => (
                        <span 
                            key={index}
                            className='px-3 py-1 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300'
                        >
                            {item}
                        </span>
                    ))}
                </div>

                <div className='flex gap-3 mt-auto'>
                    {links.live && (
                        <motion.a
                            href={links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                        >
                            <FaGlobe className="w-4 h-4"/>
                            <span>
                                { type === "app" ? "Live Demo" : "Package" }
                            </span>
                        </motion.a>
                    )}
                    {links.source && (
                        <motion.a
                            href={links.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-outline"
                        >
                            <FaGithub className="w-4 h-4"/>
                            <span>Source</span>
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectsCard;