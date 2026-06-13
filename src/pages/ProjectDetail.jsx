import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PROJECTS } from '../data/projects'
import { POSTS } from '../data/posts'
import Footer from '../components/Footer'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = PROJECTS[id]
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!project) return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Project not found.</p>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: 24 }}>Back home</button>
    </div>
  )

  const relatedPosts = (project.relatedPosts || []).map((pid) => POSTS.find((p) => p.id === pid)).filter(Boolean)

  return (
    <>
      <div className="project-detail">
        <div className="project-detail__hero">
          <div className="project-detail__eyebrow">
            <span className="section-label" style={{ marginBottom: 0 }}>Work</span>
            <span className="project-detail__slash">/</span>
            <span className="section-label" style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>{project.name}</span>
          </div>
          <h1 className="project-detail__title">{project.name}</h1>
          <p className="project-detail__lead">{project.lead}</p>
          <div className="project-detail__stack">
            {project.stack.map((s) => <span key={s} className="stack-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{s}</span>)}
          </div>
          <span className={`status-badge ${project.statusClass}`}>{project.status}</span>
        </div>

        <div className="project-detail__thumb">
          <div className="project-detail__thumb-inner">
            <div className="project-detail__thumb-label">
              {project.statusClass === 'status-complete' ? 'Demo video coming soon' : 'Screenshots & video coming soon'}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section__label">The Problem</div>
          <h2 className="detail-section__title">What needed solving</h2>
          <div className="detail-section__body"><p>{project.problem}</p></div>
        </div>

        <div className="detail-section">
          <div className="detail-section__label">The Solution</div>
          <h2 className="detail-section__title">How it works</h2>
          <div className="detail-section__body"><p>{project.solution}</p></div>
        </div>

        <div className="detail-section">
          <div className="detail-section__label">Architecture</div>
          <h2 className="detail-section__title">System overview</h2>
          <div className="detail-arch-grid">
            {project.architecture.map((a) => (
              <div key={a.title} className="detail-arch-card">
                <div className="detail-arch-card__title">{a.title}</div>
                <div className="detail-arch-card__desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section__label">Features</div>
          <h2 className="detail-section__title">What it does</h2>
          <ul className="detail-features">
            {project.features.map((f) => (
              <li key={f} className="detail-feature-item">
                <span className="detail-feature-bullet" /><span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-section">
          <div className="detail-section__label">Lessons Learned</div>
          <h2 className="detail-section__title">What building this taught me</h2>
          <ul className="detail-lessons">
            {project.lessons.map((l) => <li key={l} className="detail-lesson-item">{l}</li>)}
          </ul>
        </div>

        {relatedPosts.length > 0 && (
          <div className="detail-section">
            <div className="detail-section__label">Build Log</div>
            <h2 className="detail-section__title">Posts about this project</h2>
            <div className="detail-related">
              {relatedPosts.map((post) => (
                <div key={post.id} className="detail-related-post" onClick={() => navigate(`/build-log/${post.id}`)}>
                  <div className="detail-related-post__title">{post.title}</div>
                  <div className="detail-related-post__meta">{post.date} · {post.readTime}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detail-nav">
          <button className="btn-secondary" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All projects
          </button>
          <button className="btn-primary" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
            Work with me
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
