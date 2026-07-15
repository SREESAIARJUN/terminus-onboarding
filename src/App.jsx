import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Playbook from './pages/Playbook'
import { Rocket } from 'lucide-react'

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <nav className="glass-panel">
        <div className="nav-brand">
          <Rocket className="text-accent" />
          <span>Project Terminus</span>
        </div>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Onboarding</Link>
          <Link to="/playbook" className={`nav-link ${location.pathname === '/playbook' ? 'active' : ''}`}>Playbook</Link>
        </div>
      </nav>

      <main className="fade-in-up">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/playbook" element={<Playbook />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
