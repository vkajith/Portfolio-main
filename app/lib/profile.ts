// Single source of truth for everything the site says about Vysyakh.
// The hero, the scroll timeline, the resume paper, the systems section,
// projects, and Pompu's knowledge are all derived from this file.
// Source: Vysyakh_Ajith_Resume_1Page.tex (Nov 2026). Edit here, not in components.

export type Highlight = {
  title: string
  text: string
  tags: string[]
}

export type Role = {
  id: string
  kind: 'work' | 'education'
  org: string
  title: string
  team?: string
  start: string // display, e.g. "Jul 2025"
  end: string // display, e.g. "Present"
  location: string
  link?: string
  /** One line for the timeline card — the "what changed" of this chapter. */
  chapter: string
  /** Resume-grade bullets. */
  highlights: Highlight[]
  /** Skills this chapter added — the resume paper accumulates them as you scroll. */
  stack: string[]
}

export type Project = {
  title: string
  summary: string
  tags: string[]
  link?: string
  status?: 'live' | 'building' | 'archived'
}

export type PlatformPiece = {
  id: string
  name: string
  short: string
  detail: string
  stack: string[]
}

export const profile = {
  name: 'Vysyakh Ajith',
  role: 'AI Agent Platform Engineer',
  location: 'Bengaluru, India',
  status: 'Open to conversations',
  headline: 'I build the platform layer under AI agents.',
  summary:
    'Fullstack engineer with 5+ years shipping enterprise products, now specialising in AI agent platforms — LLM gateways, agent orchestration, evaluation infrastructure, and analytics at scale.',
  stats: [
    { value: '10M+', label: 'agent events / month' },
    { value: '5+', label: 'years shipping' },
  ],
  links: {
    github: 'https://github.com/vkajith',
    linkedin: 'https://linkedin.com/in/vysyakh-ajith',
    x: 'https://x.com/whyshagajith',
    email: 'vysyakhajith@gmail.com',
    substack: 'https://vysyakhajith.substack.com/',
    resume: 'https://drive.google.com/file/d/1mxWtgrrJaIzjdaYrRdhMaRFQeRhiUHOF/view?usp=sharing',
    coffee: 'https://buymeacoffee.com/vkajithdev4',
  },
}

// Chronological (oldest → newest). The scroll story walks forward in time;
// the resume paper renders newest-first like a real resume.
export const roles: Role[] = [
  {
    id: 'bits',
    kind: 'education',
    org: 'BITS Pilani',
    title: 'B.E. Civil Engineering · CGPA 8.5',
    start: 'Aug 2017',
    end: 'Aug 2021',
    location: 'Pilani, Rajasthan',
    chapter: 'Civil engineering degree — and a first taste of ML: deep reinforcement learning for traffic optimisation.',
    highlights: [
      {
        title: 'Research',
        text: 'Deep RL for traffic optimisation, published at IEEE SusTech 2021.',
        tags: ['Deep RL', 'Research'],
      },
    ],
    stack: ['C++', 'Java', 'SQL'],
  },
  {
    id: 'nagarro',
    kind: 'work',
    org: 'Nagarro',
    title: 'Associate Engineer',
    start: 'Aug 2021',
    end: 'Feb 2022',
    location: 'Gurugram, India',
    link: 'https://www.nagarro.com',
    chapter: 'First production code: full-stack billing for a health portal.',
    highlights: [
      {
        title: 'Invoice generation',
        text: 'Built a full-stack invoice module (React/TypeScript + .NET Web API), automating billing and cutting manual work by 60%.',
        tags: ['React', '.NET'],
      },
      {
        title: 'Partial billing',
        text: 'Partial billing with React Hook Form + Yup validation, cutting payment errors by 35%.',
        tags: ['TypeScript'],
      },
    ],
    stack: ['React', 'TypeScript', '.NET Web API'],
  },
  {
    id: 'anarock',
    kind: 'work',
    org: 'Anarock',
    title: 'Software Development Engineer',
    start: 'Feb 2022',
    end: 'Jul 2025',
    location: 'Bengaluru, India',
    link: 'https://www.anarock.com',
    chapter: 'Scaled product surfaces for 15,000+ users — and shipped early Gen-AI integrations.',
    highlights: [
      {
        title: 'CRM platform facelift',
        text: 'Led the CRM dashboard rebuild in React/Redux for 15,000+ users, with D3.js data visualisation.',
        tags: ['React', 'Redux', 'D3.js'],
      },
      {
        title: 'Gen-AI integrations',
        text: 'Integrated Gen-AI content and voice tools behind custom APIs, scaling monthly interactions from 1,500 to 7,000.',
        tags: ['Gen-AI'],
      },
      {
        title: 'Marketing toolkit',
        text: 'Cross-platform React Native/Expo + GraphQL toolkit automating Meta/Google campaign monitoring: 30% more reach, $10K/year saved.',
        tags: ['Expo', 'GraphQL'],
      },
      {
        title: 'Performance & DX',
        text: 'Moved media to AWS S3/CloudFront with code splitting (40% faster loads); built a Storybook library that cut feature dev time by 25%.',
        tags: ['AWS', 'Storybook'],
      },
    ],
    stack: ['Redux', 'D3.js', 'React Native', 'GraphQL', 'AWS', 'Storybook', 'Gen-AI'],
  },
  {
    id: 'observe',
    kind: 'work',
    org: 'Observe.AI',
    title: 'Software Development Engineer 2',
    team: 'AI Agent Platform',
    start: 'Jul 2025',
    end: 'Present',
    location: 'Bengaluru, India',
    chapter: 'Building the core primitives of a production agentic platform for enterprise contact centres.',
    highlights: [
      {
        title: 'AI Agent Builder',
        text: 'Architected a flow-based builder with node-driven orchestration: 15+ tool types, conditional branching, dynamic context, S3-backed versioning, and Pipecat for voice/chat/copilot deployment.',
        tags: ['Pipecat', 'Orchestration'],
      },
      {
        title: 'LLM gateway',
        text: 'Integrated TensorZero with dynamic routing across OpenAI, Azure, Anthropic, and Bedrock — BYOK credentials, per-request fallback, and streaming.',
        tags: ['TensorZero', 'LLM routing'],
      },
      {
        title: 'LLM-as-Judge evals',
        text: 'Production evaluation framework on Temporal scoring thousands of daily interactions: task adherence, pillar-based quality metrics, automated regression detection.',
        tags: ['Temporal', 'Evals'],
      },
      {
        title: 'Agentic analytics',
        text: 'Self-hosted ClickHouse ingesting 10M+ events/month with a multi-tenant Apache Superset fork, plus an Agno AnalyticsAgent that turns questions into ClickHouse SQL.',
        tags: ['ClickHouse', 'Superset', 'Agno'],
      },
      {
        title: 'Agent harness & A/B',
        text: 'Git-based registry (Gitea) for agent definitions, continuous Temporal benchmarking of live agents, and A/B infrastructure comparing models and prompts.',
        tags: ['Gitea', 'A/B testing'],
      },
      {
        title: 'Enterprise security',
        text: 'ABAC authorisation with Casbin, Redis-backed sessions with cross-tab sync, and per-account AWS IAM roles for strict tenant isolation.',
        tags: ['Casbin', 'Redis', 'IAM'],
      },
    ],
    stack: ['TensorZero', 'Pipecat', 'Temporal', 'ClickHouse', 'Apache Superset', 'Agno', 'Casbin', 'Redis', 'Next.js'],
  },
]

// The platform, as a loop. Rendered by SelectedSystems as an explorable diagram.
export const platform: PlatformPiece[] = [
  {
    id: 'builder',
    name: 'Agent Builder',
    short: 'Design the agent',
    detail: 'A flow-based canvas where each node is a step in the conversation — 15+ tool types, conditional branches, and context passed between nodes. Versions live in S3, and Pipecat deploys the same agent to voice, chat, or copilot.',
    stack: ['Next.js', 'Pipecat', 'S3'],
  },
  {
    id: 'gateway',
    name: 'LLM Gateway',
    short: 'Route every call',
    detail: 'TensorZero sits between agents and models, routing each request across OpenAI, Azure, Anthropic, and Bedrock. Customers can bring their own keys; a failing provider falls back per request; responses stream for low latency.',
    stack: ['TensorZero', 'BYOK', 'Streaming'],
  },
  {
    id: 'analytics',
    name: 'Agentic Analytics',
    short: 'Capture events',
    detail: 'Every agent call fans out into 10+ tool and evaluation events — 10M+ a month — landing in self-hosted ClickHouse. A multi-tenant Superset fork gives each account isolated dashboards, and an Agno AnalyticsAgent answers questions in plain English.',
    stack: ['ClickHouse', 'Superset', 'Agno'],
  },
  {
    id: 'evals',
    name: 'LLM-as-Judge',
    short: 'Score quality',
    detail: 'Temporal workflows run an LLM judge over thousands of interactions a day — task adherence, pillar-based quality scores, and automatic regression alerts when an agent gets worse.',
    stack: ['Temporal', 'Evals'],
  },
  {
    id: 'harness',
    name: 'Agent Harness',
    short: 'Improve and ship',
    detail: 'Agent definitions and tool configs are versioned in Git (Gitea). Live agents are benchmarked continuously, and A/B tests compare models and prompt strategies with tracked deltas — feeding the next version back into the builder.',
    stack: ['Gitea', 'Temporal', 'A/B'],
  },
]

export const infraProject = {
  title: 'Multi-tenant ClickHouse infrastructure',
  summary:
    'Per-tenant S3 buckets encrypted with customer-managed KMS keys, scoped IAM roles for zero cross-tenant leakage, and zero-touch onboarding that provisions storage, keys, and policies on signup.',
  tags: ['ClickHouse', 'AWS KMS', 'IAM', 'Terraform'],
}

export const photography = {
  label: 'Photography',
  headline: 'Light, place, and the patience to wait for the frame.',
  summary:
    'A running collection of frames from outside the terminal — the offline practice behind the platform work.',
}

export const skills: Record<string, string[]> = {
  'AI / LLM': ['TensorZero', 'Pipecat', 'Agno', 'Temporal', 'LLM-as-Judge', 'OpenAI', 'Anthropic Claude', 'Prompt engineering'],
  Platform: ['ClickHouse', 'Apache Superset', 'Redis', 'PostgreSQL', 'AWS (S3, IAM, KMS)', 'Casbin', 'Gitea'],
  Product: ['React', 'Next.js', 'TypeScript', 'React Native', 'Node.js', 'NestJS', 'GraphQL'],
}

// Add entries here and the Projects section appears automatically.
// Leave empty to hide the section entirely.
export const projects: Project[] = [
  {
    title: 'Self-hosted ClickHouse for multi-tenant analytics',
    summary:
      'Per-tenant databases backed by customer-managed KMS keys and scoped IAM roles, with zero-touch provisioning on signup. Ingests 10M+ agent and eval events a month with strict tenant isolation.',
    tags: ['ClickHouse', 'AWS KMS', 'IAM', 'Terraform'],
    status: 'live',
  },
  {
    title: 'Agentic Analytics framework',
    summary:
      'A multi-tenant Apache Superset distribution with full MCP support: agents discover datasets, run scoped queries, and publish dashboards inside each tenant. An analytics agent turns plain-English questions into SQL.',
    tags: ['Apache Superset', 'MCP', 'ClickHouse', 'Agno'],
    status: 'live',
  },
  {
    title: 'Terminal analytical agent',
    summary:
      'A terminal-first agent that turns a question into a Duckle pipeline on DuckDB, runs it locally, and prints the result — analytical work without a notebook, warehouse, or dashboard.',
    tags: ['Duckle', 'DuckDB', 'CLI', 'Agents'],
    status: 'live',
  },
]

// Cal.com: derived from CAL_COM_BOOKING_URL (https://cal.com/<username>/<slug>).
export const bookingDurations = [
  { minutes: 15, slug: '15min', label: 'Quick intro' },
  { minutes: 30, slug: '30min', label: 'Proper chat' },
] as const
