import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowRight, BadgeCheck, Briefcase, Code, Database, Download, GraduationCap, Github, History, Linkedin, Mail, MapPin, Medal, Menu, Moon, Network, Share2, Smartphone, Sun, Terminal, Bot, Users, X } from 'lucide-react'
import { Analytics } from '@vercel/analytics/react'
import { cv } from './data'
import Shader from './Shader'

const base = import.meta.env.BASE_URL
const cvUrl = `${base}Mahmudul-Hasan-CV.pdf`
const links = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact']
const display = 'font-display tracking-[-0.025em]'
const skillGroups = [
  { title: 'Android Ecosystem', icon: Smartphone, from: ['Android'], hi: ['Jetpack Compose', 'Hilt'] },
  { title: 'Architecture & Patterns', icon: Network, from: ['Architecture and patterns'], hi: ['Clean Architecture', 'Multi-Module'] },
  { title: 'Third-Party & Media SDKs', icon: Share2, from: ['Third-party SDKs'], hi: ['Agora SDK', 'WebRTC'] },
  { title: 'Languages & Frameworks', icon: Code, from: ['Languages', 'Flutter'], hi: ['Kotlin', 'Dart'] },
  { title: 'Data & Persistence', icon: Database, from: ['Data and backend'], hi: ['Room', 'Firebase'] },
  { title: 'Testing, Tools & AI', icon: Bot, from: ['Testing', 'Tools and analytics', 'AI tools'], hi: ['JUnit 4', 'Cursor'] },
]

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { el?.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>{children}</div>
}

function Section({ id, eyebrow, title, desc, alt, children }: { id: string; eyebrow: string; title: string; desc?: string; alt?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-16 py-16 md:py-24 ${alt ? 'bg-s0' : ''}`}>
      <div className="mx-auto max-w-[80rem] px-5 md:px-12">
        <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="eyebrow mb-2">{eyebrow}</p><h2 className={`${display} text-[1.875rem] font-bold md:text-[2.5rem]`}>{title}</h2></div>
          {desc && <p className="max-w-sm text-sm text-muted">{desc}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

const Chip = ({ t, hi }: { t: string; hi?: boolean }) => <span className={`chip ${hi ? 'chip-hi' : ''}`}>{t}</span>

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* storage unavailable */ }
  }, [dark])
  useEffect(() => {
    const f = () => {
      let cur = ''
      for (const l of links) { const el = document.getElementById(l.toLowerCase()); if (el && el.getBoundingClientRect().top <= 120) cur = l.toLowerCase() }
      setActive(cur)
    }
    f(); addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return (
    <header className="sticky top-0 z-20 bg-bg/85 backdrop-blur-xl">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-4 px-5 md:px-12">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-s3 font-mono text-xs font-semibold text-sec">MH</span>
          <span className="hidden flex-col leading-tight sm:flex"><span className={`${display} font-bold`}>Mahmudul</span><span className="font-mono text-[0.65rem] tracking-[0.12em] text-dim">SENIOR ANDROID ENG</span></span>
        </a>
        <span className="chip hidden items-center gap-2 rounded-full bg-s2 text-sec xl:inline-flex"><span className="led" />Available for roles</span>
        <ul className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((l) => <li key={l}><a href={`#${l.toLowerCase()}`} className={`rounded-lg px-3 py-1.5 transition-colors ${active === l.toLowerCase() ? 'bg-[var(--pribg)] font-semibold text-[var(--onpri)]' : 'text-muted hover:text-ink'}`}>{l}</a></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#contact" className="btn btn-p hidden !px-4 !py-2 !text-sm sm:inline-flex">Contact me</a>
          <button aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setDark(!dark)} className="rounded-lg p-2 text-muted transition-colors hover:text-sec">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <img src={`${base}profile.jpg`} alt="" width={36} height={36} className="hidden size-9 rounded-full object-cover sm:block" />
          <button aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)} className="rounded-lg p-2 text-muted lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </nav>
      {open && <ul className="bg-s1 px-5 py-2 lg:hidden">{links.map((l) => <li key={l}><a onClick={() => setOpen(false)} className="block py-2.5" href={`#${l.toLowerCase()}`}>{l}</a></li>)}</ul>}
    </header>
  )
}

function Profile() {
  return (
    <div className="float w-full max-w-[24rem]">
      <div className="card flex flex-col gap-4 bg-s3 p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden><i className="size-3 rounded-full bg-red-300/70" /><i className="size-3 rounded-full bg-cyan-600/70" /><i className="size-3 rounded-full bg-sec" /></div>
          <span className="inline-flex items-center gap-2 rounded bg-s0 px-2 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-sec"><span className="relative flex size-1.5"><span className="ping-dot absolute size-full rounded-full bg-sec" /><span className="relative size-1.5 rounded-full bg-sec" /></span>Senior engineer</span>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-s0">
          <img src={`${base}profile.jpg`} alt="Portrait of Mahmudul Hasan" width={384} height={384} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-s0 via-transparent to-transparent opacity-80" aria-hidden />
          <div className="absolute inset-x-3 bottom-3 flex flex-col"><span className="text-sm font-bold text-ink">{cv.name}</span><span className="font-mono text-[0.7rem] text-sec">{cv.title}</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          {[['Core', 'Kotlin', 'text-pri'], ['UI toolkit', 'Compose', 'text-sec'], ['Pattern', 'Clean Arch', 'text-ter']].map(([k, v, c]) => (
            <div key={k} className="rounded-lg bg-s0 p-2"><p className="text-[0.65rem] uppercase text-dim">{k}</p><p className={`text-[0.8125rem] font-semibold ${c}`}>{v}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const f = (e: MouseEvent) => {
      const g = (e.target as Element).closest?.('.card') as HTMLElement | null
      if (!g) return
      const r = g.getBoundingClientRect()
      g.style.setProperty('--mouse-x', `${e.clientX - r.left}px`)
      g.style.setProperty('--mouse-y', `${e.clientY - r.top}px`)
    }
    addEventListener('mousemove', f)
    return () => removeEventListener('mousemove', f)
  }, [])
  const d = (i: number) => ({ '--i': i }) as CSSProperties
  const pick = (names: string[]) => [...new Set(cv.skills.filter((g) => names.includes(g.group)).flatMap((g) => g.items))]
  const metrics = [
    { n: '8.5+', t: 'Years of mobile experience', s: 'Android and Flutter, from intern to lead.', Icon: History, c: 'text-sec' },
    { n: 'Millions', t: 'Users on the MyGP app', s: "Grameenphone's flagship mobile app, where I work today.", Icon: Users, c: 'text-pri' },
    { n: '9', t: 'Roles held', s: 'Intern, trainer, developer, lead and senior engineer.', Icon: Briefcase, c: 'text-ter' },
  ]
  return (
    <>
      <Header />
      <main id="top">
        <section className="relative overflow-hidden bg-s0">
          <div className="pointer-events-none absolute inset-0 hidden opacity-50 dark:block" aria-hidden><Shader /></div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-s0/40 via-bg/85 to-bg" aria-hidden />
          <div className="relative mx-auto grid max-w-[80rem] items-center gap-12 px-5 py-16 md:px-12 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <div className="hero-in mb-6 flex flex-wrap gap-2" style={d(0)}>
                <span className="chip inline-flex items-center gap-1.5 rounded-full bg-s3 text-sec"><MapPin size={13} />{cv.location}</span>
                <span className="chip inline-flex items-center gap-2 rounded-full bg-s2 text-pri"><span className="led" />Full lifecycle native engineering</span>
              </div>
              <h1 className={`hero-in ${display} text-[2.5rem] font-extrabold leading-[1.1] md:text-[4rem] md:leading-[1.08]`} style={d(1)}>
                Mahmudul <span className="bg-gradient-to-r from-pri via-sec to-pri bg-clip-text text-transparent">Hasan</span>
              </h1>
              <p className={`hero-in mt-3 ${display} text-xl font-semibold text-sec md:text-[1.75rem]`} style={d(2)}>{cv.title} · Android</p>
              <p className="hero-in mt-5 max-w-2xl text-lg leading-8 text-muted" style={d(3)}>{cv.tagline}</p>
              <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={d(4)}>
                <a href="#projects" className="btn btn-p">View my projects <ArrowRight size={18} /></a>
                <a href={`mailto:${cv.email}`} className="btn btn-s"><Mail size={18} />Email me</a>
                <a href={cvUrl} download="Mahmudul-Hasan-CV.pdf" className="btn btn-g"><Download size={16} />Download CV</a>
              </div>
              <div className="hero-in mt-8 flex flex-wrap items-center gap-4 font-mono text-sm text-muted" style={d(5)}>
                <a className="inline-flex items-center gap-2 transition-colors hover:text-sec" href={cv.github} target="_blank" rel="noreferrer"><Terminal size={18} />github.com</a>
                <span className="text-dim">/</span>
                <a className="inline-flex items-center gap-2 transition-colors hover:text-sec" href={cv.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} />linkedin.com</a>
                <span className="text-dim">/</span>
                <span className="inline-flex items-center gap-2 text-sec"><BadgeCheck size={16} />8.5+ YOE</span>
              </div>
            </div>
            <div className="hero-in flex justify-center lg:col-span-5 lg:justify-end" style={d(3)}><Profile /></div>
          </div>
        </section>

        <section id="about" className="scroll-mt-16 py-16 md:py-24">
          <div className="mx-auto flex max-w-[80rem] flex-col gap-6 px-5 md:px-12">
            <Reveal>
              <div className="grid gap-8 rounded-2xl bg-s1 p-6 lg:grid-cols-12 lg:p-10">
                <div className="flex flex-col justify-between gap-6 lg:col-span-4">
                  <div><p className="eyebrow mb-2">Background</p><h2 className={`${display} text-[1.875rem] font-bold leading-tight md:text-[2.5rem]`}>Engineering leadership &amp; execution</h2></div>
                  <div className="flex items-center gap-3 rounded-xl bg-s3 p-3"><Medal className="shrink-0 text-sec" size={32} /><div><p className="font-mono text-sm font-semibold">Senior Android specialization</p><p className="text-xs text-muted">Clean Architecture · Multi-Module · Real-time video</p></div></div>
                </div>
                <div className="flex flex-col justify-center gap-4 lg:col-span-8">
                  {cv.about.map((p, i) => <p key={p} className={i === 0 ? 'text-lg leading-8 text-muted' : 'leading-7 text-muted'}>{p}</p>)}
                  <div className="flex flex-wrap gap-2 font-mono text-xs text-sec">{['JetpackCompose', 'KotlinCoroutines', 'WebRTC', 'AgoraSDK', 'MultiModule'].map((t) => <span key={t} className="rounded bg-s3 px-2 py-1">#{t}</span>)}</div>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {metrics.map(({ n, t, s, Icon, c }, i) => (
                <Reveal key={t} delay={i * 100}>
                  <div className="card h-full bg-s3 p-6">
                    <div className="flex items-center justify-between"><span className={`${display} text-[2.5rem] font-extrabold ${c}`}>{n}</span><Icon className={c} size={30} /></div>
                    <p className={`${display} mt-2 text-xl font-semibold`}>{t}</p><p className="mt-1 text-sm text-muted">{s}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Section id="skills" alt eyebrow="Toolchain" title="Technical competencies" desc="Native Android at the core, with Flutter, real-time media SDKs and testing and delivery tools around it.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map(({ title, icon: Icon, from, hi }, i) => (
              <Reveal key={title} delay={(i % 3) * 90}>
                <div className="card h-full bg-s2 p-6">
                  <h3 className={`${display} mb-4 flex items-center gap-3 text-xl font-semibold`}><Icon className="text-sec" size={22} />{title}</h3>
                  <div className="flex flex-wrap gap-2">{pick(from).map((x) => <Chip key={x} t={x} hi={hi.includes(x)} />)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="experience" eyebrow="Career" title="Work experience">
          <div className="flex flex-col gap-5">
            {cv.experience.map((e, i) => (
              <Reveal key={e.role + e.period}>
                <div className="card grid gap-5 bg-s1 p-6 md:grid-cols-[13rem_1fr]">
                  <div className="flex flex-col gap-1 font-mono text-[0.8125rem]">
                    {i === 0 && <span className="mb-1 inline-flex w-fit items-center gap-2 rounded bg-s3 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-sec"><span className="led" />Current role</span>}
                    <span>{e.period}</span>
                    <span className="text-dim">{[e.dur, e.location].filter(Boolean).join(' · ')}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className={`${display} text-xl font-semibold`}>{e.role}</h3>
                      <p className="text-pri">{e.company}</p>
                    </div>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    {e.tech && <div className="mt-4 flex flex-wrap gap-2">{e.tech.map((t, k) => <Chip key={t} t={t} hi={k === 1} />)}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="projects" alt eyebrow="Production" title="Featured projects" desc="Live streaming and telecom apps I have led Android development on.">
          <div className="grid gap-6 md:grid-cols-3">
            {cv.projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 120}>
                <article className="card flex h-full flex-col gap-4 bg-s2 p-6">
                  <div className="flex items-center justify-between font-mono text-[0.7rem]">
                    <span className="inline-flex items-center gap-2 rounded bg-s3 px-2 py-1 font-semibold uppercase tracking-wide text-sec"><span className="led" />{p.kind}</span>
                    <span className="uppercase text-muted">{p.period}</span>
                  </div>
                  <h3 className={`${display} text-xl font-semibold`}>{p.name}</h3>
                  <p className="text-sm leading-6 text-muted">{p.desc}</p>
                  <div className="flex items-center justify-between rounded-lg bg-s0 px-3 py-2 font-mono text-xs"><span className="text-muted">Role</span><span className="text-ter">{p.role}</span></div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
                  <div className="mt-auto flex flex-wrap gap-2">{p.tech.map((t, k) => <Chip key={t} t={t} hi={k === 1} />)}</div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="education" eyebrow="Academic" title="Education & training">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { Icon: GraduationCap, t: cv.education.degree, o: cv.education.school, loc: cv.education.location, per: cv.education.period, n: '' },
              { Icon: Terminal, t: cv.training.name, o: cv.training.org, loc: 'Dhaka, Bangladesh', per: cv.training.period, n: cv.training.note },
            ].map(({ Icon, t, o, loc, per, n }, i) => (
              <Reveal key={t} delay={i * 120}>
                <div className="card flex h-full flex-col gap-4 bg-s1 p-6">
                  <div className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-s3 text-pri"><Icon size={22} /></span>
                    <div><h3 className={`${display} text-xl font-semibold`}>{t}</h3><p className="text-sec">{o}</p>{n && <p className="mt-2 text-sm text-muted">{n}</p>}</div>
                  </div>
                  <div className="mt-auto flex justify-between font-mono text-xs"><span className="text-muted">{loc}</span><span className="text-sec">{per}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <section id="contact" className="scroll-mt-16 bg-s0 py-20 md:py-28">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 text-center">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full bg-s3 px-3 py-1"><span className="led" />Get in touch</span>
            <h2 className={`${display} text-[2.25rem] font-extrabold leading-tight md:text-[3.5rem]`}>Let’s build something exceptional together.</h2>
            <p className="max-w-xl text-muted">Open to senior Android roles and technical leadership opportunities. The quickest way to reach me is email.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a className="btn btn-p" href={`mailto:${cv.email}`}><Mail size={18} />{cv.email}</a>
              <a className="btn btn-s" href={cv.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} />LinkedIn profile</a>
              <a className="btn btn-s" href={cv.github} target="_blank" rel="noreferrer"><Github size={18} />GitHub profile</a>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="bg-bg py-8">
        <div className="mx-auto flex max-w-[80rem] flex-col justify-between gap-4 px-5 text-xs text-muted md:flex-row md:items-center md:px-12">
          <div><p className="flex items-center gap-3"><span className={`${display} text-base font-bold text-ink`}>{cv.name}</span><span className="chip text-sec">{cv.title}</span></p><p className="mt-1">© {new Date().getFullYear()} {cv.name}. Android engineer based in {cv.location}.</p></div>
          <div className="flex gap-5 font-mono">
            <a className="inline-flex items-center gap-1.5 hover:text-sec" href={`mailto:${cv.email}`}><Mail size={14} />Email</a>
            <a className="inline-flex items-center gap-1.5 hover:text-sec" href={cv.github} target="_blank" rel="noreferrer"><Github size={14} />GitHub</a>
            <a className="inline-flex items-center gap-1.5 hover:text-sec" href={cv.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} />LinkedIn</a>
          </div>
        </div>
      </footer>
      <Analytics />
    </>
  )
}
