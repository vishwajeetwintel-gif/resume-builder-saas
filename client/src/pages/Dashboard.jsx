import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useStore from '../store/useStore';

export default function Dashboard() {
  const { user, logout, setResumes, resumes, loadResume, resetResume } = useStore();
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/resume').then(res => { setResumes(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const createNew = () => { resetResume(); nav('/builder'); };

  const editResume = (resume) => { loadResume(resume); nav(`/builder/${resume.id}`); };

  const deleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return;
    await api.delete(`/resume/${id}`);
    setResumes(resumes.filter(r => r.id !== id));
  };

  const planBadge = user?.plan === 'premium' 
    ? { label: 'Premium', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' }
    : { label: 'Free', bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Topbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 16 }}>R</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeAI Pro</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: planBadge.bg, color: planBadge.color, border: `1px solid ${planBadge.border}`, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              {planBadge.label} Plan
            </div>
            {user?.plan !== 'premium' && (
              <Link to="/payment" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', color: 'white', textDecoration: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>⚡ Upgrade</Link>
            )}
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button onClick={() => { logout(); nav('/'); }} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#64748b' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color: '#64748b', fontSize: 15 }}>Manage your resumes and track your progress</p>
          </div>
          <button onClick={createNew} style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            + Create New Resume
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
          {[
            { icon: '📝', title: 'New Resume', desc: 'Start from scratch', action: createNew, color: '#eff6ff' },
            { icon: '🎨', title: 'Browse Templates', desc: '50+ ATS templates', to: '/templates', color: '#faf5ff' },
            { icon: '⚡', title: 'AI Features', desc: 'Powered by GPT-4', to: user?.plan === 'premium' ? '/builder' : '/payment', color: '#fff7ed' },
            { icon: '📊', title: 'ATS Checker', desc: 'Check your score', action: createNew, color: '#f0fdf4' }
          ].map(item => (
            <div key={item.title} onClick={item.action || (() => nav(item.to))} style={{ background: item.color, border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{item.title}</div>
              <div style={{ color: '#64748b', fontSize: 13 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Resumes List */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Your Resumes ({resumes.length})</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16, border: '2px dashed #e2e8f0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No resumes yet</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Create your first AI-powered resume</p>
            <button onClick={createNew} className="btn-primary">Create Resume</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {resumes.map(resume => (
              <div key={resume.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ height: 100, background: 'linear-gradient(135deg, #2563eb15, #7c3aed15)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 40 }}>📄</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>{resume.title || 'Untitled Resume'}</h3>
                  <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
                    Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'recently'}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => editResume(resume)} style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '8px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Edit</button>
                    <button onClick={() => deleteResume(resume.id)} style={{ padding: '8px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
