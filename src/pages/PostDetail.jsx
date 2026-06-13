import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { POSTS, CAT_LABELS } from '../data/posts'
import Footer from '../components/Footer'
import './PostDetail.css'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = POSTS.find((p) => p.id === id)
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!post) return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Post not found.</p>
      <button className="btn-secondary" onClick={() => navigate('/build-log')} style={{ marginTop: 24 }}>Back to Build Log</button>
    </div>
  )

  const related = POSTS.filter((p) => p.id !== id && p.category === post.category).slice(0, 3)
  const allCategories = [...new Set(POSTS.map((p) => p.category))]

  return (
    <>
      <div className="post-layout">
        <article className="post-main">
          <div className="post-eyebrow">
            <span className="section-label" style={{ marginBottom: 0 }}>Build Log</span>
            <span className="post-slash">/</span>
            <span className={`cat-badge cat-${post.category}`}>{post.catLabel}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-subtitle">{post.subtitle}</p>
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.body }} />
          <div className="wrong-box">
            <div className="wrong-box__label">What went wrong</div>
            <div className="wrong-box__title">{post.wrong.title}</div>
            <div className="wrong-box__body">{post.wrong.body}</div>
          </div>
          <div className="post-nav">
            <button className="btn-secondary" onClick={() => navigate('/build-log')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              All posts
            </button>
            <button className="btn-primary" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>
              Work with me
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </article>
        <aside className="post-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-label">About this post</div>
            <div className="sidebar-meta">{post.date}</div>
            <div className="sidebar-meta">{post.readTime}</div>
          </div>
          {related.length > 0 && (
            <div className="sidebar-card">
              <div className="sidebar-label">More from {post.catLabel}</div>
              {related.map((p) => (
                <div key={p.id} className="sidebar-post" onClick={() => navigate(`/build-log/${p.id}`)}>
                  <div className="sidebar-post__title">{p.title}</div>
                  <div className="sidebar-post__meta">{p.date} · {p.readTime}</div>
                </div>
              ))}
            </div>
          )}
          <div className="sidebar-card">
            <div className="sidebar-label">All categories</div>
            {allCategories.map((cat) => (
              <div key={cat} className="sidebar-post" onClick={() => navigate('/build-log')}>
                <div className="sidebar-post__title">{CAT_LABELS[cat] || cat}</div>
                <div className="sidebar-post__meta">{POSTS.filter((p) => p.category === cat).length} posts</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </>
  )
}
