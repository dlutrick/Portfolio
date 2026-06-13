import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import BuildLog from './pages/BuildLog'
import PostDetail from './pages/PostDetail'
import './styles/globals.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  return <div style={{ paddingTop: 60 }}><Nav />{children}</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/build-log" element={<BuildLog />} />
          <Route path="/build-log/:id" element={<PostDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
