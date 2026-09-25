import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion, useIsLowPower } from './hooks/useReducedMotion'
import { useLenis } from './hooks/useLenis'
import { useDepth3D } from './hooks/useDepth3D'
import Loader from './components/Loader'
import Backdrop from './components/Backdrop'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Hook from './components/Hook'
import About from './components/About'
import Interests from './components/Interests'
import Showcase from './components/Showcase'
import Skills from './components/Skills'
import Marquee from './components/Marquee'
import Learning from './components/Learning'
import Certifications from './components/Certifications'
import Reviews from './components/Reviews'
import FinalCTA from './components/FinalCTA'
import Contact from './components/Contact'
import FloatRail from './components/FloatRail'

gsap.registerPlugin(ScrollTrigger)

const STACK_TICKER = [
  'React', 'FastAPI', 'Claude API', 'Three.js', 'Python', 'Postgres', 'Twilio', 'Supabase',
]

export default function App() {
  const reduced = useReducedMotion()
  const lowPower = useIsLowPower()
  const [loading, setLoading] = useState(true)

  useLenis(reduced)
  useDepth3D(reduced, !loading)

  useEffect(() => {
    if (loading) return undefined
    const t = setTimeout(() => ScrollTrigger.refresh(), 260)
    return () => clearTimeout(t)
  }, [loading])

  return (
    <>
      <Loader reduced={reduced} onDone={() => setLoading(false)} />
      <Backdrop reduced={reduced} />
      <Nav reduced={reduced} />
      <FloatRail />
      <main className="relative">
        <Hero reduced={reduced} />
        <Hook reduced={reduced} />
        <About />
        <Interests />
        <Showcase reduced={reduced} />
        <Skills reduced={reduced} lowPower={lowPower} />
        <Marquee items={STACK_TICKER} duration={46} />
        <Learning />
        <Certifications />
        <Reviews />
        <FinalCTA reduced={reduced} />
        <Contact reduced={reduced} />
      </main>
    </>
  )
}
