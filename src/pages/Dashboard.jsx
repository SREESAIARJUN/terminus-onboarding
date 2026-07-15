import { BookOpen, Video, Code, Terminal, Clock, CheckCircle2, Settings, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'

const phases = [
  {
    id: 0,
    title: "Phase 0: Tooling Setup",
    time: "10 Minutes",
    icon: <Settings />,
    description: "Let's get your local environment ready right now so you can follow along with the code later.",
    action: "Your local terminal",
    focus: "Install the uv package manager and stb-cli. Run `stb auth login` to connect to the platform. You will need this setup for Phase 4."
  },
  {
    id: 1,
    title: "Phase 1: The Visual Walkthrough",
    time: "~1 Hour",
    icon: <Video />,
    description: "Before diving into the technical playbook, watch these videos to see how the rules map to the actual interface and workflow.",
    action: "Watch the Onboarding Videos below",
    focus: "Treat this as a guided tour. Focus on the visual elements: how the Snorkel Expert Platform UI looks, how the Web IDE operates, and how the instructor uses the stb CLI in real-time.",
    videos: [
      { name: "Project Introduction", id: "1Xpg6qpetWh9m-40UhU8bfEGzW-vDy-rg" },
      { name: "CLI Guide", id: "1HwxIpTAbxnGELSfUGKtfBoPAFKFTOJSn" },
      { name: "Task Structure Guidelines", id: "10UGHLzJAC8YDBD4NOqkwyYgM5z0MBaNo" },
      { name: "Task Creation Guide", id: "1Ufeyy4Tl7CM9wIFN9Sc5sxvE2vIuDAwT" }
    ]
  },
  {
    id: 2,
    title: "Phase 2: The Core Foundation",
    time: "45 Minutes",
    icon: <BookOpen />,
    description: "Now that you have the visual context, you need to understand the 'Laws of Physics' of this platform.",
    action: "Read The Comprehensive Technical Playbook & SOP",
    focus: "Read this cover-to-cover. Pay special attention to the '5 Pillars of a Task' and the LLM failure modes. 💡 PRO TIP: Have the Sample Tasks open in VS Code while reading this guide so you can cross-reference the rules with actual code.",
    link: "/playbook",
    externalLink: {
      url: "https://snorkel-ai.github.io/Terminus-EC-Training-stateful/portal/docs/getting-started/welcome",
      label: "Official Snorkel Getting Started Docs"
    }
  },
  {
    id: 3,
    title: "Phase 3: Code Deep-Dive",
    time: "1.5 Hours",
    icon: <Code />,
    description: "This is the most important phase for engineers. You need to see what a 'Gold Standard' task looks like.",
    action: "Review The Sample Tasks Directory",
    focus: "Look at Sample 2 (Datalog) to see how a complex verification suite is written. Look at Sample 3 (Node.js) for milestone tasks. Study how the environment/Dockerfile is pinned, and how test_outputs.py asserts behavior."
  },
  {
    id: 4,
    title: "Phase 4: Sandbox Practice",
    time: "45 Minutes",
    icon: <Terminal />,
    description: "Time to get your hands dirty and validate your local environment.",
    action: "Your local terminal & Docker Desktop",
    focus: "Initialize a dummy task (`stb init`). Run the container interactively, and execute the Oracle locally to ensure everything runs smoothly."
  }
]

export default function Dashboard() {
  return (
    <div>
      <div className="hero">
        <h1>Welcome to Project Terminus</h1>
        <p>Our objective is to build highly realistic, complex engineering environments to benchmark frontier AI agents like Claude Opus and GPT-5.5.</p>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem'}}>
          <div className="glass-panel" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem'}}>
            <Clock size={20} color="var(--accent)" />
            <span style={{fontWeight: '500'}}>Total Time Commitment: ~4.5 Hours</span>
          </div>
        </div>
      </div>

      <div className="timeline">
        {phases.map((phase) => (
          <div key={phase.id} className="timeline-item">
            <div className="timeline-icon">
              {phase.icon}
            </div>
            <div className="timeline-content glass-panel">
              <div className="timeline-title">
                <h3>{phase.title}</h3>
                <span className="timeline-time">{phase.time}</span>
              </div>
              <p style={{marginBottom: '1rem', fontSize: '1.05rem'}}>{phase.description}</p>
              
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
                <strong>Resource: </strong> {phase.action}
              </div>
              
              <div>
                <strong style={{color: 'var(--accent)'}}>What to focus on:</strong>
                <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>{phase.focus}</p>
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap'}}>
                {phase.link && (
                  <Link to={phase.link} className="btn btn-primary">
                    Read The Master Guide
                  </Link>
                )}
                
                {phase.externalLink && (
                  <a href={phase.externalLink.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    {phase.externalLink.label}
                  </a>
                )}
              </div>

              {phase.videos && (
                <div className="video-grid">
                  {phase.videos.map(video => (
                    <div key={video.id} className="video-card">
                      <div className="video-info">
                        <h4>{video.name}</h4>
                      </div>
                      <iframe 
                        src={`https://drive.google.com/file/d/${video.id}/preview`} 
                        width="100%" 
                        height="240" 
                        style={{border: 'none'}}
                        allow="autoplay"
                        title={video.name}
                      ></iframe>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{textAlign: 'center', padding: '3rem', marginTop: '3rem', borderColor: 'var(--success)'}}>
        <CheckCircle2 size={48} color="var(--success)" style={{margin: '0 auto 1rem'}} />
        <h2>Ready to Build?</h2>
        <p style={{color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto'}}>
          By the end of this onboarding, you should confidently build a deterministic Docker environment, write a bulletproof verifier, and know how to avoid CI rejections.
        </p>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0'}}>
          <Link to="/playbook" className="btn btn-secondary" style={{borderColor: 'var(--accent)', color: 'var(--text-main)'}}>
            <ClipboardList size={20} color="var(--accent)" />
            View Pre-Flight Checklist
          </Link>
        </div>

        <p><strong>Once completed, drop a message in the channel for your first assignment!</strong></p>
      </div>
    </div>
  )
}
