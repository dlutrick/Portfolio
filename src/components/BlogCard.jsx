import { useNavigate } from 'react-router-dom'
import './BlogCard.css'

export default function BlogCard({ post }) {
  const navigate = useNavigate()

  return (
    <div className="blog-card" onClick={() => navigate(`/build-log/${post.id}`)}>
      <div className="blog-card__meta">
        <span className={`cat-badge cat-${post.category}`}>{post.catLabel}</span>
        <span className="blog-card__date">{post.date}</span>
      </div>
      <div className="blog-card__title">{post.title}</div>
      <div className="blog-card__excerpt">{post.excerpt}</div>
      <div className="blog-card__footer">
        <span className="blog-card__read-more">
          Read post
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="blog-card__read-time">{post.readTime}</span>
      </div>
    </div>
  )
}
