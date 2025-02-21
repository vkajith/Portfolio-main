'use client'

import Image, { StaticImageData } from "next/image"
import anarock from '../img/anarock.jpg';
import nagarro from '../img/nagarro.png';
import { motion } from "framer-motion";



interface ExperienceItem
{
    logo: StaticImageData
    date: string
    title: string
    location: string
    summary: string
    projects: {
        title: string
        points: string[]
    }[]
}

const ExperienceCard = ({item, index}: { item: ExperienceItem; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group flex gap-4 md:gap-6 relative hover:bg-gray-50/30 dark:hover:bg-gray-800/30 
                       rounded-xl transition-all duration-300 p-4 cursor-pointer -my-2"
        >
            <div className="absolute left-10 h-[calc(100%+16px)] w-px bg-gray-200 dark:bg-gray-700 -top-2">
                <div className="absolute top-[24px] -bottom-[24px] left-0 w-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="relative flex-shrink-0 z-10 w-20">
                <div className="sticky top-4 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg 
                              flex items-center justify-center backdrop-blur-sm group-hover:shadow-blue-500/20">
                    <Image 
                        src={item.logo}
                        alt={`${item.title} logo`}
                        height={48}
                        width={50}
                        className="w-8 h-8 object-contain"
                    />
                </div>
            </div>
            <div className="pb-4 group-hover:pb-12 transition-all duration-700 flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{item.date}</p>
                <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white group-hover:text-blue-500 
                             transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{item.location}</p>
                <p className="text-gray-700 dark:text-gray-300">{item.summary}</p>
                
                <div className="space-y-6 h-0 overflow-hidden group-hover:h-auto mt-0 group-hover:mt-6 
                              opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                    {item.projects.map((project, idx) => (
                        <div 
                            key={idx} 
                            className="space-y-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0"
                            style={{
                                transitionDelay: `${idx * 100}ms`,
                                transitionDuration: '700ms'
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="text-blue-500 font-medium">{project.title}</span>
                            </div>
                            <ul className="ml-3 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                {project.points.map((point, pointIdx) => (
                                    <li 
                                        key={pointIdx} 
                                        className="text-gray-700 dark:text-gray-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                        style={{
                                            transitionDelay: `${(idx * 100) + (pointIdx * 50)}ms`,
                                            transitionDuration: '700ms',
                                            transitionProperty: 'all'
                                        }}
                                    >
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

const Experience = () => {
    const experiences = [
        {
            logo: anarock,
            date: "Feb 2022 – Present",
            title: "Software Development Engineer II",
            location: "Anarock Technology",
            summary: "Leading frontend development initiatives and mentoring team members while building scalable solutions for real estate technology. Specialized in creating dynamic dashboards and implementing AI-driven features to enhance user engagement.",
            projects: [
                {
                    title: "Anarock CRM",
                    points: [
                        "Led the platform facelift of the CRM Dashboard, enhancing usability for 500+ users by implementing dynamic visualization tools (interactive charts, widgets) and enabling custom report generation.",
                        "Improved user engagement by leveraging Gen-AI tool for campaign content generation, resulting in an increase in engagement from 150 to 1,000 interactions per month and streamlining the property lead lifecycle."
                    ]
                },
                {
                    title: "Marketing Toolkit",
                    points: [
                        "Engineered a scalable cross-platform campaign toolkit using Expo for Meta and Google campaigns by automating rule creation to monitor budget-to-lead ratios, which streamlined campaign management and led to a 30% increase in campaign reach while reducing overall costs by $10K annually."
                    ]
                },
                {
                    title: "Mentorship & Collaboration",
                    points: [
                        "Conducted workshops on modern front-end development practices, including Context API and state management strategies, to upskill the team.",
                        "Mentored junior developers, improving code modularity and promoting reusable component design by setting up a UI component library based on StoryBook, ensuring consistency across multiple products."
                    ]
                }
            ]
        },
        {
          logo: nagarro,
          date: "Aug 2021 – Feb 2022",
          title: "Associate Engineer",
          location: "Nagarro",
          summary: "Involved in migrating legacy applications to modern frameworks and technologies like React, Next.js, and TypeScript. Implemented new features and enhancements to improve user experience and functionality.",
          projects: [
            {
                title: "Invoice Generator",
                points: [
                    "Developed an Invoice Generation Module for a health portal using React.js, TypeScript, and .NET Web API by integrating these technologies to automate billing processes",
                    "Implemented a Partial Billing System with dynamic validation using React Hook Form and Yup, whichinvolved creating custom validation rules and optimizing payment workflows to ensure accuracy andefficiency"
                ]
            }
          ]
        },
      ]

      return(
        <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900 sm:px-4">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Experience</h2>
                    <p className="text-gray-600 dark:text-gray-400">My professional journey so far 🚀</p>
                </div>
                <div className="max-w-3xl">
                    {experiences.map((item, index) => (
                        <ExperienceCard 
                            key={index}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience;