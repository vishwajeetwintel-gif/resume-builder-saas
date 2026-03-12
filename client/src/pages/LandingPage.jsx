import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'AI-Powered Writing', desc: 'GPT-4 rewrites your bullets to sound impactful and ATS-optimized' },
  { icon: '📊', title: 'ATS Score Checker', desc: 'Real-time scoring with detailed breakdown and improvement tips' },
  { icon: '🎨', title: '50+ Templates', desc: 'Professional ATS-friendly templates for every industry' },
  { icon: '🔍', title: 'Job Matching', desc: 'Paste any job description and see how well your resume matches' },
  { icon: '📄', title: 'PDF Parser', desc: 'Upload your existing resume and we will import it automatically' },
  { icon: '💳', title: 'Instant Download', desc: 'Export pixel-perfect PDFs ready to send to employers' }
];

const stats = [
  { value: '2.4M+', label: 'Resumes Created' },
  { value: '94%', label: 'Interview Rate' },
  { value: '50+', label: 'Templates' },
  { value: '4.9★', label: 'User Rating' }
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 18 }}>R</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeAI Pro</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/templates" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Templates</Link>
            <Link to="/pricing" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            <Link to="/register" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', textDecoration: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #faf5ff 50%, #fff7ed 100%)', padding: '100px 5% 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 12 }}>🚀</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb' }}>AI-Powered Resume Builder</span>
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>
            Build Resumes That{' '}
            <span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get Interviews</span>
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            AI-powered resume builder with ATS optimization, 50+ professional templates, and real-time scoring. Land your dream job faster.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link to="/register" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', textDecoration: 'none', padding: '16px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
              Create Your Resume Free →
            </Link>
            <Link to="/templates" style={{ background: 'white', color: '#374151', textDecoration: 'none', padding: '16px 32px', borderRadius: 12, fontWeight: 600, fontSize: 16, border: '2px solid #e2e8f0' }}>
              Browse Templates
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 700, margin: '0 auto' }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#1e3a8a', fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 5%', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 800, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Everything You Need</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 56, fontSize: 16 }}>Built for job seekers who want results</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0, fontSize: 15 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Ready to Land Your Dream Job?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>Join 2.4M+ professionals who trust ResumeAI Pro</p>
        <Link to="/register" style={{ background: 'white', color: '#2563eb', textDecoration: 'none', padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: 16, display: 'inline-block' }}>
          Start Building for Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '40px 5%', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, color: 'white', fontSize: 18, marginBottom: 8 }}>ResumeAI Pro</div>
        <p style={{ fontSize: 14 }}>© 2024 ResumeAI Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
