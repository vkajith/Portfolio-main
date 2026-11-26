import { Coffee } from 'lucide-react'
import { profile } from './lib/profile'
import Hero from './components/Hero'
import CareerStory from './components/CareerStory'
import SelectedSystems from './components/SelectedSystems'
import Projects from './components/Projects'
import Photography from './components/Photography'
import Notes from './components/Notes'
import Contact from './components/Contact'
import CommandPalette from './components/CommandPalette'
import CarrotRain from './components/CarrotRain'
import ThemeToggle from './components/ThemeToggle'

const Divider = () => (
  <div className="px-5 sm:px-10 lg:px-16">
    <div className="max-w-6xl mx-auto section-divider" />
  </div>
)

export default function Home() {
  return (
    <div className="noise-overlay min-h-screen">
      <Hero />
      <CareerStory />
      <Divider />
      <SelectedSystems />
      <Projects />
      <Divider />
      <Photography />
      <Divider />
      <Notes />
      <Contact />

      <footer className="px-5 pb-10 pt-6 text-center">
        <p className="text-[11px] text-[var(--text-muted)] font-mono">
          &copy; {new Date().getFullYear()} Vysyakh Ajith — built with help from Pompu <span aria-hidden>🐰🥕</span>
        </p>
        <a
          href={profile.links.coffee}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <Coffee className="w-3.5 h-3.5" aria-hidden /> Buy Pompu a coffee
        </a>
      </footer>

      {/* Globals (PompuShell lives in the Hero and docks itself) */}
      <ThemeToggle />
      <CommandPalette />
      <CarrotRain />
    </div>
  )
}
