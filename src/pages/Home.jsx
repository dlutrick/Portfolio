import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { PROJECTS_LIST } from '../data/projects'
import { POSTS } from '../data/posts'
import ProjectCard from '../components/ProjectCard'
import BlogCard from '../components/BlogCard'
import Footer from '../components/Footer'
import './Home.css'

export default function Home() {
  useScrollReveal()
  const navigate = useNavigate()

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const btn = e.target.querySelector('button[type=submit]')
    btn.textContent = 'Message sent ✓'
    btn.style.background = 'var(--surface-3)'
    btn.style.color = 'var(--green)'
    btn.style.border = '1px solid var(--green-border)'
    btn.disabled = true
    e.target.reset()
  }

  return (
    <>
      <section id="hero" className="hero">
        <div className="hero__grid" />
        <div className="hero__glow" />
        <div className="hero__inner">
          <div className="hero__eyebrow">Available for freelance work</div>
          <h1 className="hero__name">David<br /><span className="hero__accent">Lutrick</span></h1>
          <p className="hero__sub">AI Product Builder, Full-Stack Developer, and SaaS Founder building intelligent software systems that solve real-world problems.</p>
          <div className="hero__actions">
            <button className="btn-primary" onClick={() => scrollTo('projects')}>
              View Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('contact')}>Contact Me</button>
          </div>
        </div>
        <div className="hero__scroll"><div className="hero__scroll-line" /></div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <div className="about__grid">
            <div className="about__text reveal">
              <div className="section-label">About</div>
              <h2 className="section-title">Builder by nature,<br />developer by choice.</h2>
              <div className="divider-line" />
              <p>I'm a <strong>Pharmacy Technician by trade</strong> and a self-taught developer by obsession. While most people clock out and relax, I spend my time building software products, AI systems, and creator tools that solve real problems.</p>
              <p>I figured out that with the right tools and enough stubbornness, you don't need a CS degree to ship real products. I've built full-stack applications, wired up custom AI workflows, and figured out entire product architectures from scratch, all while working a day job.</p>
              <p>I care about execution. Not just ideas on a whiteboard, but things that actually ship and work.</p>
              <div className="about__tags">
                {['AI Development','SaaS Architecture','Storytelling','Automation','Product Strategy','Self-taught'].map((t) => (
                  <span key={t} className="about__tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="about__stats reveal reveal-delay-2">
              {[
                { number: '3+', label: 'Products in development' },
                { number: 'AI-first', label: 'Development approach' },
                { number: '0→', label: 'Idea to shipped product' },
                { number: 'Full-stack', label: 'React · Node · MongoDB' },
              ].map((s) => (
                <div key={s.label} className="about__stat-card">
                  <div className="about__stat-number">{s.number}</div>
                  <div className="about__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="container">
          <div className="section-label reveal">Work</div>
          <h2 className="section-title reveal reveal-delay-1">Featured Projects</h2>
          <p className="section-sub reveal reveal-delay-2">Products I've designed, built, and shipped. Writing tools, content analyzers, voice hardware.</p>
          <div className="projects__grid">
            {PROJECTS_LIST.map((p, i) => (
              <div key={p.id} className={`reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="buildlog-preview" className="buildlog-preview">
        <div className="container">
          <div className="buildlog-preview__header">
            <div>
              <div className="section-label reveal">Build Log</div>
              <h2 className="section-title reveal reveal-delay-1" style={{ marginBottom: 8 }}>Building AI Products<br />in Public.</h2>
              <p className="section-sub reveal reveal-delay-2" style={{ marginBottom: 0 }}>Architecture decisions, dumb mistakes, experiments that half-worked, and things I had to learn the hard way.</p>
            </div>
            <button className="btn-secondary reveal reveal-delay-2" onClick={() => navigate('/build-log')}>
              All posts
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="buildlog-preview__grid">
            {POSTS.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      <section id="skills" className="skills">
        <div className="container">
          <div className="section-label reveal">Skills</div>
          <h2 className="section-title reveal reveal-delay-1">What I Build With</h2>
          <p className="section-sub reveal reveal-delay-2">A practical stack built through shipping real products, not coursework.</p>
          <div className="skills__grid">
            {[
              { title: 'Frontend', items: ['React','JavaScript','HTML & CSS','Tailwind CSS'] },
              { title: 'Backend', items: ['Node.js','Express','MongoDB','REST APIs'] },
              { title: 'AI Development', items: ['OpenAI APIs','Claude workflows','Prompt engineering','Long-context systems','AI orchestration'] },
              { title: 'Product', items: ['SaaS architecture','UX design','Product strategy','MVP development'] },
            ].map((cat, i) => (
              <div key={cat.title} className={`skills__card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
                <div className="skills__category"><span className="skills__dot" />{cat.title}</div>
                <ul className="skills__list">{cat.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="building" className="building">
        <div className="container">
          <div className="section-label reveal">Status</div>
          <h2 className="section-title reveal reveal-delay-1">Currently Building</h2>
          <p className="section-sub reveal reveal-delay-2">These are the products I'm actively working on right now.</p>
          <div className="building__list reveal reveal-delay-2">
            {[
              { name: 'PlotDr', desc: 'AI-assisted long-form storytelling platform for authors', status: 'Building', cls: 'status-building' },
              { name: 'HookDr', desc: 'Short-form content retention & engagement analyzer', status: 'Building', cls: 'status-building' },
              { name: 'AI Character Device', desc: 'Voice-enabled physical AI personality system', status: 'Complete', cls: 'status-complete' },
            ].map((item) => (
              <div key={item.name} className="building__item">
                <div>
                  <div className="building__name">{item.name}</div>
                  <div className="building__desc">{item.desc}</div>
                </div>
                <span className={`status-badge ${item.cls}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <div className="contact__grid">
            <div>
              <div className="section-label reveal">Contact</div>
              <h2 className="section-title reveal reveal-delay-1">Let's build<br />something.</h2>
              <p className="section-sub reveal reveal-delay-2" style={{ marginBottom: 32 }}>Have a project in mind, want to collaborate, or just want to talk shop about AI and software? I'd love to hear from you.</p>
              <form className="contact__form reveal reveal-delay-2" onSubmit={handleSubmit}>
                <div className="contact__form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" placeholder="Your name" required />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="your@email.com" required />
                </div>
                <div className="contact__form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Tell me about your project..." required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </form>
            </div>
            <div className="contact__info reveal reveal-delay-3">
              {[
                { label: 'Email', value: 'hello@davidlutrick.com', href: 'mailto:hello@davidlutrick.com' },
                { label: 'GitHub', value: 'github.com/davidlutrick', href: 'https://github.com/dlutrick' },
                { label: 'LinkedIn', value: 'linkedin.com/in/davidlutrick', href: 'https://linkedin.com/in/davidlutrick' },
              ].map((link) => (
                <a key={link.label} href={link.href} className="contact__card" target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  <div className="contact__card-text">
                    <div className="contact__card-label">{link.label}</div>
                    <div className="contact__card-value">{link.value}</div>
                  </div>
                </a>
              ))}
              <div className="contact__card contact__card--disabled">
                <div className="contact__card-text">
                  <div className="contact__card-label">YouTube</div>
                  <div className="contact__card-value">Coming soon</div>
                  <div className="contact__card-coming">In progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
