import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="footer">
      <div className="footer__copy">
        © 2025 David Lutrick<span>.</span> All rights reserved.
      </div>
      <div className="footer__links">
        <button onClick={() => scrollTo('about')}>About</button>
        <button onClick={() => scrollTo('projects')}>Work</button>
        <Link to="/build-log">Build Log</Link>
        <button onClick={() => scrollTo('contact')}>Contact</button>
      </div>
    </footer>
  )
}
