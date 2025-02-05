'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaCodeBranch, FaStar } from 'react-icons/fa'

interface GitHubEvent {
  id: string
  type: string
  repo: {
    name: string
  }
  created_at: string
  payload: {
    ref?: string
    commits?: Array<{
      message: string
      sha: string
    }>
    action?: string
    description?: string
  }
}

const GitHubActivity = () => {
  const [activities, setActivities] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        const response = await fetch('https://api.github.com/users/vkajith/events/public')
        const data = await response.json()
        setActivities(data.slice(0, 5))
      } catch (error) {
        console.error('Error fetching GitHub activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubActivity()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <FaCodeBranch className="w-5 h-5" />
      case 'WatchEvent':
        return <FaStar className="w-5 h-5" />
      default:
        return <FaGithub className="w-5 h-5" />
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2 dark:text-white">GitHub Activity</h2>
          <p className="text-gray-600 dark:text-gray-300">My contributions 🚀</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded-full animate-bounce"></div>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={item}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 flex items-center
                    transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="mr-4 text-gray-600 dark:text-gray-300">
                    {getEventIcon(activity.type)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium dark:text-white">{activity.repo.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.type.replace('Event', '')} on {formatDate(activity.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default GitHubActivity