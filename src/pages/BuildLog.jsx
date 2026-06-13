import { useState, useEffect } from 'react'
import { POSTS, CAT_LABELS } from '../data/posts'
import BlogCard from '../components/BlogCard'
import Footer from '../components/Footer'
import './BuildLog.css'

export default function BuildLog() {
  const [activeFilter, setActiveFilter] = useState('all')
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const categories = ['all', ...new Set(POSTS.map((p) => p.category))]
  const filtered = activeFilter === 'all' ? POSTS : POSTS.filter((p) => p.category === activeFilter)
  return (
    <>
      <div className="buildlog">
        <div className="buildlog__header">
          <div className="section-label">Build Log</div>
          <h1 className="buildlog__title">Building AI Products<br />in Public.</h1>
          <p className="buildlog__sub">Architecture decisions, dumb mistakes, experiments that half-worked, and things I had to learn the hard way.</p>
          <div className="buildlog__filters">
            {categories.map((cat) => (
              <button key={cat} className={`buildlog__filter-btn ${activeFilter === cat ? 'buildlog__filter-btn--active' : ''}`} onClick={() => setActiveFilter(cat)}>
                {CAT_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>
        <div className="buildlog__grid">
          {filtered.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>
      <Footer />
    </>
  )
}
