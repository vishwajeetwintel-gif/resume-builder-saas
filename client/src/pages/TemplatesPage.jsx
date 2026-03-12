import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TEMPLATES, CATEGORIES } from '../components/templates/templateConfig';
import useStore from '../store/useStore';

export default function TemplatesPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { user, setTemplate } = useStore();
  const nav = useNavigate();

  const filtered = TEMPLATES.filter(t => 
    (category === 'All' || t.category === category) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const useTemplate = (t) => {
    if (t.premium && user?.plan !== 'premium') { nav('/payment'); return; }
    setTemplate(t.id);
    nav('/builder');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 16 }}>R</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeAI Pro</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            {user ? <Link to="/dashboard" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link> : <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Resume Templates</h1>
          <p style={{ color: '#64748b', fontSize: 16, marginBottom: 24 }}>50+ professionally designed, ATS-optimized templates</p>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." style={{ width: '100%', maxWidth: 400, padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor='#2563eb'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '8px 18px', borderRadius: 20, border: `1.5px solid ${category === cat ? '#2563eb' : '#e2e8f0'}`, background: category === cat ? '#2563eb' : 'white', color: category === cat ? 'white' : '#374151', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
              onClick={() => useTemplate(t)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: 160, background: `linear-gradient(135deg, ${t.color}18, ${t.color}30)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 80, height: 110, background: 'white', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ height: 28, background: t.color, width: '100%' }} />
                  <div style={{ flex: 1, padding: 6 }}>
                    {[100, 70, 85, 60, 90].map((w, i) => (
                      <div key={i} style={{ height: 4, width: `${w}%`, background: i === 0 ? t.color + '44' : '#e2e8f0', borderRadius: 2, marginBottom: 3 }} />
                    ))}
                  </div>
                </div>
                {t.premium && <div style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg, #f97316, #ef4444)', color: 'white', padding: '3px 8px', borderRadius: 10, fontSize: 10, fontWeight: 800 }}>PRO</div>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{t.name}</h3>
                <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 10px', lineHeight: 1.5 }}>{t.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: `${t.color}18`, color: t.color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{t.category}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{t.premium ? (user?.plan === 'premium' ? 'Premium' : '🔒 Pro only') : 'Free'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!user && (
          <div style={{ textAlign: 'center', marginTop: 48, padding: 40, background: 'linear-gradient(135deg, #eff6ff, #faf5ff)', borderRadius: 20, border: '1px solid #e0e7ff' }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ready to build your resume?</h3>
            <p style={{ color: '#64748b', marginBottom: 20 }}>Sign up free and start building your professional resume today</p>
            <Link to="/register" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', textDecoration: 'none', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>Get Started Free →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
