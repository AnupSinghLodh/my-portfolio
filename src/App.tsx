import { MotionConfig } from "motion/react";
import AmbientBackground from "./components/layout/AmbientBackground";
import Footer from "./components/layout/Footer";
import Nav from "./components/layout/Nav";
import ScrollProgress from "./components/layout/ScrollProgress";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AmbientBackground />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
