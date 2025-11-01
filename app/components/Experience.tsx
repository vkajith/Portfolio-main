'use client'

import Image, { StaticImageData } from "next/image"
import anarock from '../img/anarock.jpg';
import nagarro from '../img/nagarro.png';
import observe from '../img/observe.png';
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

const ExperienceCard = ({ item, index }: { item: ExperienceItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Image
            src={item.logo}
            alt={`${item.title} logo`}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">• {item.location}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
        <p className="text-content">{item.summary}</p>
      </div>
    </motion.div>
  )
}

const Experience = () => {
    const experiences = [
        {
          logo: observe,
          date: "July 2025 – Present",
          title: "Software Development Engineer II",
          location: "Observe AI",
          summary: "Working in Agentic Platform development team, with end to end solutions for agent building and analytics modules",
          projects: [
                {
                    title: "Observe AI Platform",
                    points: [
                        "Led the frontend development of the Observe AI platform, focusing on creating a user-friendly interface for data analysis and visualization. Implemented features such as real-time data dashboards and interactive visualizations to enhance user experience.",
                        "Collaborated with backend developers to integrate APIs and ensure smooth data flow, resulting in a 20% increase in user engagement and a 15% decrease in support tickets."
                    ]
                }
            ]
        },
        {
            logo: anarock,
            date: "Feb 2022 – July 2025",
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
        <section id="experience" className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Experience</h2>
              <p className="text-gray-600 dark:text-gray-400">Roles and impact</p>
            </div>
            <div className="max-w-3xl space-y-4">
              {experiences.map((item, index) => (
                <ExperienceCard key={index} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>
    )
}

export default Experience;