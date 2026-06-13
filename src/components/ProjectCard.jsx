import { useNavigate } from 'react-router-dom'
import './ProjectCard.css'

const PROJECT_PHOTOS = {
  aidevice: '/assets/moai-statue.jpg',
  plotdr: '/assets/plotdr.png',
  hookdr: '/assets/hookdr.png',
}

const THUMB_ICONS = {
  plotdr: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 4h14M4 8h10M4 12h12M4 16h8" stroke="#888880" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  hookdr: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3 16L7 9l4 4 4-7 3 4" stroke="#888880" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  aidevice: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="5" stroke="#888880" strokeWidth="1.5"/><path d="M11 3v2M11 17v2M3 11h2M17 11h2" stroke="#888880" strokeWidth="1.5" strokeLinecap="round"/></svg>,
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const photo = PROJECT_PHOTOS[project.id]
  const isComplete = project.statusClass === 'status-complete'

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
      <div className="project-card__thumb">
        {photo ? (
          <img
            src={photo}
            alt={project.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <>
            <div className="project-card__thumb-inner">
              <div className="project-card__thumb-icon">{THUMB_ICONS[project.id]}</div>
              <div className="project-card__thumb-lines">
                <div className="project-card__thumb-line" style={{ width: 80 }} />
                <div className="project-card__thumb-line" style={{ width: 56 }} />
              </div>
            </div>
            <span className="project-card__video-badge">
              {isComplete ? 'Demo video coming soon' : 'Video coming soon'}
            </span>
          </>
        )}
      </div>
      <div className="project-card__body">
        <div className="project-card__header">
          <div className="project-card__name">{project.name}</div>
          <span className={`status-badge ${project.statusClass}`}>{project.status}</span>
        </div>
        <p className="project-card__summary">{project.lead}</p>
        <div className="project-card__stack">
          {project.stack.map((s) => <span key={s} className="stack-tag">{s}</span>)}
        </div>
        <button className="project-card__link">
          View Details
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}