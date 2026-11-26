import Hero from './components/Hero'
import CareerStory from './components/CareerStory'
import SelectedSystems from './components/SelectedSystems'
import Projects from './components/Projects'
import Explore from './components/Explore'
import Contact from './components/Contact'

const Divider = () => (
  <div className="px-5 sm:px-10 lg:px-16">
    <div className="max-w-6xl mx-auto section-divider" />
  </div>
)

export default function Home() {
  return (
    <>
      <Hero />
      <CareerStory />
      <Divider />
      <SelectedSystems />
      <Projects />
      <Divider />
      <Explore />
      <Divider />
      <Contact />
    </>
  )
}
