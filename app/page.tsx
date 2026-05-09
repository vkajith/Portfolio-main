import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import GitHubActivity from "./components/GitHubActivity";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <Hero />
      <Experience/>
      <Projects/>
      <Skills/>
      <GitHubActivity/>
      <Contact/>
      <Footer/>
      <Terminal/>
    </main>
  )
}
