import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Book } from 'lucide-react';

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

  return (
    <div className="playbook-container fade-in-up">
      <div className="playbook-header">
        <h1 style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <Book color="var(--accent)" size={32} /> 
          The Master Guide
        </h1>
        <p style={{color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem'}}>
          Comprehensive Technical Playbook & SOP for Project Terminus.
        </p>
      </div>
      
      <div className="glass-panel" style={{padding: '2.5rem'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '3rem', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: '500'}}>Loading Playbook...</div>
        ) : (
          <div className="markdown-body">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  )
}
