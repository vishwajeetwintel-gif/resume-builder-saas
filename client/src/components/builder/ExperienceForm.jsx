import React, { useState } from 'react';
import useStore from '../../store/useStore';
import api from '../../utils/api';

export default function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } = useStore();
  const [aiLoading, setAiLoading] = useState({});

  const addBullet = (expId) => {
    const exp = resume.experience.find(e => e.id === expId);
    updateExperience(expId, 'responsibilities', [...(exp.responsibilities || []), '']);
  };

  const updateBullet = (expId, idx, value) => {
    const exp = resume.experience.find(e => e.id === expId);
    const bullets = [...(exp.responsibilities || [])];
    bullets[idx] = value;
    updateExperience(expId, 'responsibilities', bullets);
  };

  const removeBullet = (expId, idx) => {
    const exp = resume.experience.find(e => e.id === expId);
    updateExperience(expId, 'responsibilities', exp.responsibilities.filter((_, i) => i !== idx));
  };

  const rewriteWithAI = async (expId, bulletIdx) => {
    const key = `${expId}_${bulletIdx}`;
    const exp = resume.experience.find(e => e.id === expId);
    const bullet = exp.responsibilities[bulletIdx];
    if (!bullet?.trim()) return;
    setAiLoading(p => ({ ...p, [key]: true }));
    try {
      const res = await api.post('/ai/rewrite-bullet', { bullet, jobTitle: exp.title });
      updateBullet(expId, bulletIdx, res.data.result);
    } catch (err) {
      alert(err.response?.data?.error || 'AI rewrite failed. Premium required.');
    } finally { setAiLoading(p => ({ ...p, [key]: false })); }
  };

  const generateBullets = async (expId) => {
    const exp = resume.experience.find(e => e.id === expId);
    setAiLoading(p => ({ ...p, [`gen_${expId}`]: true }));
    try {
      const res = await api.post('/ai/generate-bullets', { jobTitle: exp.title, company: exp.company });
      updateExperience(expId, 'responsibilities', res.data.result);
    } catch (err) {
      alert(err.response?.data?.error || 'AI generation failed. Premium required.');
    } finally { setAiLoading(p => ({ ...p, [`gen_${expId}`]: false })); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Work Experience</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>Add your most recent positions first</p>
        </div>
        <button onClick={addExperience} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          + Add Position
        </button>
      </div>

      {resume.experience.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, border: '2px dashed #e2e8f0', borderRadius: 12, color: '#94a3b8' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>
          <p>No experience added yet. Click "Add Position" to get started.</p>
        </div>
      )}

      {resume.experience.map((exp, i) => (
        <div key={exp.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ background: '#2563eb', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => generateBullets(exp.id)} disabled={aiLoading[`gen_${exp.id}`]} style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                {aiLoading[`gen_${exp.id}`] ? '✨ Generating...' : '✨ AI Generate'}
              </button>
              <button onClick={() => removeExperience(exp.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12 }}>Remove</button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {[{ key: 'title', label: 'Job Title', placeholder: 'Software Engineer' }, { key: 'company', label: 'Company', placeholder: 'Google Inc.' }, { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' }].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} value={exp[f.key] || ''} onChange={e => updateExperience(exp.id, f.key, e.target.value)} />
              </div>
            ))}
            <div>
              <label className="label">Start Date</label>
              <input className="input" type="month" value={exp.startDate || ''} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
            </div>
            <div>
              <label className="label">End Date</label>
              <input className="input" type="month" value={exp.endDate || ''} disabled={exp.current} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id={`curr_${exp.id}`} checked={exp.current || false} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} />
              <label htmlFor={`curr_${exp.id}`} style={{ fontSize: 14, color: '#374151' }}>I currently work here</label>
            </div>
          </div>

          <div>
            <label className="label">Key Responsibilities / Achievements</label>
            {(exp.responsibilities || []).map((bullet, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 10, color: '#94a3b8', flexShrink: 0 }}>•</span>
                <textarea value={bullet} onChange={e => updateBullet(exp.id, idx, e.target.value)} placeholder="Describe your achievement or responsibility..." style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, resize: 'vertical', minHeight: 52, fontFamily: 'inherit', outline: 'none' }} onFocus={e => e.target.style.borderColor='#2563eb'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button onClick={() => rewriteWithAI(exp.id, idx)} disabled={aiLoading[`${exp.id}_${idx}`]} title="AI Rewrite" style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>
                    {aiLoading[`${exp.id}_${idx}`] ? '...' : '✨'}
                  </button>
                  <button onClick={() => removeBullet(exp.id, idx)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 12, color: '#dc2626' }}>×</button>
                </div>
              </div>
            ))}
            <button onClick={() => addBullet(exp.id)} style={{ marginTop: 4, background: 'none', border: '1px dashed #cbd5e1', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#64748b', width: '100%' }}>
              + Add bullet point
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
