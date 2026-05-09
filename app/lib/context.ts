export const VYSYAKH_CONTEXT = `
You are an AI assistant embedded in Vysyakh Ajith's portfolio website. You answer questions about Vysyakh in a friendly, concise, terminal-style manner. Keep responses short (2-4 sentences max unless asked for detail). Use plain text, no markdown formatting.

=== ABOUT ===
Name: Vysyakh Ajith
Role: Software Development Engineer II
Current Company: Observe AI (July 2025 – Present)
Location: India
Description: A creative developer building better experiences for the web, and learning the art of living.
Portfolio: vysyakhajith.com

=== EXPERIENCE ===

1. Observe AI (July 2025 – Present) — Software Development Engineer II
   - Working in Agentic Platform development team
   - End-to-end solutions for agent building and analytics modules
   - Tech: React, TypeScript, Next.js

2. Anarock Technology (Feb 2022 – July 2025) — Software Development Engineer II
   - Led platform facelift of the CRM Dashboard, enhancing usability for 500+ users
   - Improved user engagement via Gen-AI tool for campaign content generation (150 → 1,000 interactions/month)
   - Engineered scalable cross-platform campaign toolkit using Expo for Meta and Google campaigns, reducing costs by $10K annually
   - Led frontend development initiatives and mentored team members
   - Tech: React, TypeScript, Next.js, Redux, Expo

3. Nagarro (Aug 2021 – Feb 2022) — Associate Engineer
   - Developed Invoice Generation Module for a health portal using React.js, TypeScript, and .NET Web API
   - Implemented Partial Billing System with dynamic validation using React Hook Form and Yup
   - Migrated legacy applications to modern frameworks
   - Tech: React, TypeScript, .NET

=== PROJECTS ===

1. HabitAct — Minimalist Habit Tracker
   - Built with React and Next.js, clean interface, Supabase sync, offline access
   - Tech: Next.js, React, PostgreSQL, Supabase
   - Live: habitact.vercel.app

2. WhatsApp Chat Render — React Component Library (npm package)
   - Allows developers to create authentic WhatsApp-style chat interfaces
   - Published on npm as "whatsapp-chat-render"
   - Tech: React, TypeScript, TailwindCSS

3. SpotOn AI — Real Estate Analytics Platform
   - Intelligent real estate analysis tool with locality insights and property appreciation predictions
   - Tech: Next.js, FastAPI, AI/ML
   - Live: spoton-ai.vercel.app

=== SKILLS ===
Frontend: React, Next.js, TypeScript, TailwindCSS, Redux, Framer Motion
Backend: Node.js, NestJS, Express, FastAPI, Python, GraphQL
Database & Cloud: PostgreSQL, MongoDB, Firebase, Prisma, Docker, AWS
Design: Figma

=== CONTACT ===
GitHub: github.com/vkajith
LinkedIn: linkedin.com/in/vysyakh-ajith
Twitter/X: x.com/whyshagajith
Resume: Available on the portfolio site

=== RULES ===
- If asked something not covered above, say you don't have that info and suggest they reach out directly.
- Be conversational but professional.
- Don't make up information not provided above.
- If asked "help" or "commands", list: about, experience, projects, skills, contact, resume
`;

// Fallback keyword-based responses for when no API key is available
export const FALLBACK_RESPONSES: Record<string, string> = {
  help: "Available commands: about, experience, projects, skills, contact, resume. Or just ask me anything!",

  about: "Vysyakh Ajith — SDE II currently at Observe AI. A creative developer building better experiences for the web, previously at Anarock Technology and Nagarro.",

  experience: "Currently at Observe AI (SDE II) working on Agentic Platform development. Previously at Anarock Technology (3+ years) where he led CRM dashboard facelift for 500+ users and built Gen-AI campaign tools. Started career at Nagarro as Associate Engineer.",

  projects: "Notable projects:\n→ HabitAct: Minimalist habit tracker (Next.js, Supabase)\n→ WhatsApp Chat Render: npm package for WhatsApp-style chat UIs\n→ SpotOn AI: Real estate analytics with AI/ML predictions",

  skills: "Frontend: React, Next.js, TypeScript, TailwindCSS, Redux\nBackend: Node.js, NestJS, Express, FastAPI, Python\nDatabase: PostgreSQL, MongoDB, Firebase\nTools: Docker, AWS, Figma",

  contact: "GitHub: github.com/vkajith\nLinkedIn: linkedin.com/in/vysyakh-ajith\nTwitter: x.com/whyshagajith",

  resume: "You can view the full resume by clicking the 'View full resume' link in the experience section, or visit the portfolio site directly.",

  hello: "Hey! I'm Vysyakh's AI assistant. Ask me about his experience, projects, skills, or anything else!",

  hi: "Hey there! Ask me anything about Vysyakh — his work, projects, skills, or how to reach him.",
};

export function getFallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Direct keyword matches
  for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (q === key || q.includes(key)) {
      return response;
    }
  }

  // Fuzzy topic matching
  if (q.includes('work') || q.includes('job') || q.includes('company') || q.includes('career')) {
    return FALLBACK_RESPONSES.experience;
  }
  if (q.includes('build') || q.includes('made') || q.includes('create') || q.includes('project')) {
    return FALLBACK_RESPONSES.projects;
  }
  if (q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('framework') || q.includes('skill')) {
    return FALLBACK_RESPONSES.skills;
  }
  if (q.includes('reach') || q.includes('email') || q.includes('connect') || q.includes('social') || q.includes('github') || q.includes('linkedin')) {
    return FALLBACK_RESPONSES.contact;
  }
  if (q.includes('who') || q.includes('yourself') || q.includes('tell me') || q.includes('intro')) {
    return FALLBACK_RESPONSES.about;
  }

  return "I don't have specific info on that. Try asking about Vysyakh's experience, projects, skills, or type 'help' for available commands. You can also reach out directly via the social links!";
}
