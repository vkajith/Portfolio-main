import LeftPanel from './components/LeftPanel'
import Experience from './components/Experience'
import Projects from './components/Projects'
import CommandPalette from './components/CommandPalette'
import CarrotRain from './components/CarrotRain'
import ThemeToggle from './components/ThemeToggle'

export default function Home() {
  return (
    <div className="noise-overlay flex flex-col lg:flex-row min-h-screen">
      {/* Left: Sticky sidebar with Pompu docked at the bottom */}
      <LeftPanel />

      {/* Divider */}
      <div
        className="hidden lg:block w-px shrink-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent, var(--border-color) 15%, var(--border-color) 85%, transparent)',
        }}
      />

      {/* Right: Scrollable content */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 xl:p-12">
        <Experience />

        {/* Section divider */}
        <div className="section-divider my-12" />

        <Projects />

        {/* Footer */}
        <div className="mt-16 pt-5 text-center" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            &copy; {new Date().getFullYear()} Vysyakh Ajith — built with help from Pompu <span aria-hidden>🐰🥕</span>
          </p>
        </div>
      </main>

      {/* Globals */}
      <ThemeToggle />
      <CommandPalette />
      <CarrotRain />
    </div>
  )
}
