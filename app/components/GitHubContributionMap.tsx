'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ContributionDay {
  date: string
  count: number
  level: number
}

const GitHubContributionMap = () => {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const query = `
          query {
            user(login: "vkajith") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        })

        const data = await response.json()
        const contributionDays = data.data.user.contributionsCollection.contributionCalendar.weeks
          .flatMap((week: { contributionDays: ContributionDay[] }) => week.contributionDays)
          .map((day: { date: string; contributionCount: number }) => ({
            date: day.date,
            count: day.contributionCount,
            level: getContributionLevel(day.contributionCount)
          }))

        setContributions(contributionDays)
      } catch (error) {
        console.error('Error fetching contributions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  const getContributionLevel = (count: number): number => {
    if (count === 0) return 0
    if (count <= 3) return 1
    if (count <= 6) return 2
    if (count <= 9) return 3
    return 4
  }

  const getColorByLevel = (level: number) => {
    const colors = {
      0: 'bg-gray-100 dark:bg-gray-800',
      1: 'bg-green-200 dark:bg-green-900',
      2: 'bg-green-300 dark:bg-green-700',
      3: 'bg-green-400 dark:bg-green-600',
      4: 'bg-green-500 dark:bg-green-500'
    }
    return colors[level as keyof typeof colors]
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max p-4">
        {loading ? (
          <div className="text-center">Loading contribution map...</div>
        ) : (
          <div className="grid grid-cols-52 gap-1">
            {contributions.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: index * 0.005 }}
                className={`w-3 h-3 rounded-sm ${getColorByLevel(day.level)}`}
                title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GitHubContributionMap