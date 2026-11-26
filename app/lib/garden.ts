export type GardenTag = 'creativity' | 'philosophy' | 'systems' | 'ai' | 'design' | 'life'

export type GardenNote = {
  slug: string
  number: string
  title: string
  date: string
  summary: string
  tags: GardenTag[]
  readingTime: string
  body: string[]
}

export const gardenTags: GardenTag[] = ['creativity', 'philosophy', 'systems', 'ai', 'design', 'life']

// Notes are intentionally plain data. Add a note here and the garden index,
// note route, sitemap, and Pompu's knowledge all pick it up.
export const gardenNotes: GardenNote[] = [
  {
    slug: 'the-platform-is-the-product',
    number: '001',
    title: 'The platform is the product',
    date: '20 Nov 2026',
    summary: 'Agents are the demo. The platform is what survives contact with production.',
    tags: ['systems', 'philosophy'],
    readingTime: '4 min read',
    body: [
      'The demo is the agent. The product is everything around it: the gateway that keeps a provider outage from becoming a customer outage, the evaluation loop that notices when a prompt quietly got worse, the analytics that make a conversation legible after the fact.',
      'A prompt is easy to copy. A platform is not. The durable advantage is the unglamorous middle layer — credentials, routing, retries, versioning, tenancy, observability, and the ability to answer "what changed?" three weeks after a launch.',
      'This is why I keep coming back to infrastructure. The interesting design problem is rarely the model call. It is the shape of the system that makes thousands of model calls trustworthy.',
      '## Working in the middle layer',
      'A good platform team does not hide the model. It gives the product team a safe surface to experiment with, and gives the operator a clear view of what is happening when the experiment becomes real traffic.',
      'The agents get the attention. The platform earns the trust.',
    ],
  },
  {
    slug: 'taste-is-a-systems-problem',
    number: '002',
    title: 'Taste is a systems problem',
    date: '08 Nov 2026',
    summary: 'Taste is not a mood. It is a set of repeated decisions with a feedback loop.',
    tags: ['creativity', 'design'],
    readingTime: '3 min read',
    body: [
      'Taste is often described as an instinct. In practice it looks more like a system: a small set of constraints, applied consistently, with a feedback loop that notices when something drifts.',
      'The best creative work I have been around had less to do with a flash of inspiration and more to do with a team agreeing on what "good" sounded like, then making a hundred small decisions that pointed in the same direction.',
      '## Constraints are the instrument',
      'A tight palette, one typeface, a fixed grid, a word count, a time limit. Constraints do not shrink the work. They make the choices legible.',
      'When the system is clear, the exceptions become meaningful. When everything is allowed, nothing is a decision.',
    ],
  },
  {
    slug: 'what-agents-taught-me-about-interfaces',
    number: '003',
    title: 'What agents taught me about interfaces',
    date: '24 Oct 2026',
    summary: 'Agent UIs are mostly about state, latency, and earning the next click.',
    tags: ['ai', 'design'],
    readingTime: '5 min read',
    body: [
      'An agent interface is not a chat box with a model behind it. It is a state machine with a personality. The hard parts are the transitions: what happens while it is thinking, what it remembers, what it is allowed to do, and how it tells you when it is wrong.',
      'Latency is a design material. A fast wrong answer is worse than a slow honest one. A streaming response changes the emotional shape of the wait. A visible plan changes how much the user is willing to delegate.',
      '## Trust is built in small increments',
      'The first interaction should be low-stakes and high-signal. Show the work. Make the undo obvious. Let the user correct the agent without starting over.',
      'The best agent interfaces I have used feel less like a magic trick and more like a competent colleague: present, specific, and honest about what they do not know.',
    ],
  },
  {
    slug: 'notes-on-light-and-patience',
    number: '004',
    title: 'Notes on light and patience',
    date: '11 Oct 2026',
    summary: 'Photography is the practice of waiting for the frame, not chasing it.',
    tags: ['creativity', 'life'],
    readingTime: '3 min read',
    body: [
      'The camera is the easy part. The work is noticing what the light is doing, then waiting long enough for the scene to finish its sentence.',
      'I shoot the way I like to build: a loose plan, a few constraints, and enough patience to let the unexpected in. The best frames usually arrive after the one I thought I wanted.',
      '## The offline practice',
      'Photography is the part of my week that has no dashboards. No metrics, no regression alerts, no prompt to tune. Just a place, a moment, and a decision about where to stand.',
      'It makes the rest of the work better. Attention is a muscle, and the camera is a good way to exercise it.',
    ],
  },
]
