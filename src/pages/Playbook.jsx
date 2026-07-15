import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Book, ChevronRight, FileText } from 'lucide-react';

export default function Playbook() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL || '/';
    fetch(`${basePath}playbook.md`)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading playbook:", err);
        setContent("# Error loading playbook\\n\\nPlease check if `playbook.md` exists in the public directory.");
        setLoading(false);
      });
  }, []);

  // Custom components for Markdown to add premium styling
  const markdownComponents = {
    h1: ({node, ...props}) => <h1 className="md-h1" {...props} />,
    h2: ({node, ...props}) => <h2 className="md-h2" {...props} />,
    h3: ({node, ...props}) => <h3 className="md-h3" {...props} />,
    code: ({node, inline, className, children, ...props}) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <FileText size={14} />
            <span>{match ? match[1] : 'code'}</span>
          </div>
          <pre className={className} {...props}>
            <code>{children}</code>
          </pre>
        </div>
      ) : (
        <code className="inline-code" {...props}>
          {children}
        </code>
      )
    }
  };

  return (
    <div className="playbook-wrapper fade-in-up">
      <aside className="playbook-sidebar glass-panel">
        <div className="sidebar-header">
          <Book color="var(--accent)" size={28} /> 
          <h2>Master Guide</h2>
        </div>
        <p className="sidebar-desc">
          Comprehensive Technical Playbook & SOP for Project Terminus.
        </p>
        
        <div className="sidebar-nav-title">Quick Navigation</div>
        <div className="sidebar-nav">
          <div className="nav-item">
            <ChevronRight size={16} className="nav-icon" />
            <span>Executive Summary</span>
          </div>
          <div className="nav-item">
            <ChevronRight size={16} className="nav-icon" />
            <span>Architecture & Isolation</span>
          </div>
          <div className="nav-item">
            <ChevronRight size={16} className="nav-icon" />
            <span>Sample Tasks</span>
          </div>
          <div className="nav-item">
            <ChevronRight size={16} className="nav-icon" />
            <span>Configuration (task.toml)</span>
          </div>
          <div className="nav-item">
            <ChevronRight size={16} className="nav-icon" />
            <span>Docker Engineering</span>
          </div>
          <div className="nav-item">
            <ChevronRight size={16} className="nav-icon" />
            <span>Anti-Cheating</span>
          </div>
        </div>
      </aside>
      
      <main className="playbook-content glass-panel">
        {loading ? (
          <div style={{textAlign: 'center', padding: '5rem', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: '500'}}>
            <div className="spinner"></div>
            Loading Playbook...
          </div>
        ) : (
          <div className="markdown-body">
            <Markdown components={markdownComponents}>{content}</Markdown>
          </div>
        )}
      </main>
    </div>
  )
}
