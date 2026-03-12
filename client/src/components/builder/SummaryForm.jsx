import React, { useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';

export default function SummaryForm() {
  const { resume, updateResume } = useStore();
  const [loading, setLoading] = useState(false);

  const improveWithAI = async () => {
    if (!resume.summary?.trim()) return;
    setLoading(true);
    try {
      const jobTitle = resume.experience?.[0]?.title || 'Professional';
      const skills = resume.skills?.technical || [];
      const res = await api.post('/ai/improve-summary', { summary: resume.summary, jobTitle, skills });
      updateResume('summary', res.data.result);
    } catch (err) {
      alert(err.response?.data?.error || 'AI improvement failed. Premium required.');
    } finally { setLoading(false); }
  };

  const charCount = resume.summary?.length || 0;
  const ideal = charCount >= 100 && charCount <= 400;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Professional Summary</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>A compelling 3-4 sentence overview of your career</p>
        </div>
        <button onClick={improveWithAI} disabled={loading || !resume.summary?.trim()} style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: loading || !resume.summary?.trim() ? 0.6 : 1 }}>
          {loading ? '✨ Improving...' : '✨ Improve with AI'}
        </button>
      </div>

      <textarea value={resume.summary || ''} onChange={e => updateResume('summary', e.target.value)} placeholder="Results-driven Software Engineer with 5+ years building scalable web applications. Proven track record of delivering high-quality code and leading cross-functional teams. Passionate about clean architecture and performance optimization..." style={{ width: '100%', height: 160, padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#2563eb'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ideal ? '#22c55e' : charCount < 50 ? '#ef4444' : '#f59e0b' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {ideal ? '✓ Great length' : charCount < 100 ? 'Too short (aim for 100-400 chars)' : 'Consider shortening'}
          </span>
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{charCount} / 400</span>
      </div>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginTop: 12 }}>
        <p style={{ fontSize: 12, color: '#15803d', margin: 0, fontWeight: 500 }}>
          💡 Tips: Start with your role, mention years of experience, highlight 2-3 key achievements, and end with your value proposition.
        </p>
      </div>
    </div>
  );
}
