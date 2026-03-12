import React, { useState } from 'react';
import useStore from '../../store/useStore';

export default function SkillsForm() {
  const { resume, updateResume } = useStore();
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');

  const addSkill = (type, value) => {
    if (!value.trim()) return;
    const key = type === 'tech' ? 'technical' : 'soft';
    const current = resume.skills[key] || [];
    if (!current.includes(value.trim())) {
      updateResume('skills', { ...resume.skills, [key]: [...current, value.trim()] });
    }
    type === 'tech' ? setTechInput('') : setSoftInput('');
  };

  const removeSkill = (type, skill) => {
    const key = type === 'tech' ? 'technical' : 'soft';
    updateResume('skills', { ...resume.skills, [key]: resume.skills[key].filter(s => s !== skill) });
  };

  const suggestions = {
    tech: ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'SQL', 'Git', 'REST API', 'MongoDB', 'GraphQL'],
    soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Critical Thinking', 'Adaptability']
  };

  const SkillTag = ({ skill, type }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: type === 'tech' ? '#eff6ff' : '#faf5ff', color: type === 'tech' ? '#2563eb' : '#7c3aed', border: `1px solid ${type === 'tech' ? '#bfdbfe' : '#e9d5ff'}`, padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 500, margin: '4px' }}>
      {skill}
      <button onClick={() => removeSkill(type, skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1, color: 'inherit', opacity: 0.6, padding: 0 }}>×</button>
    </span>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Skills</h3>
        <p style={{ color: '#64748b', fontSize: 13 }}>Add skills relevant to your target role</p>
      </div>

      {/* Technical Skills */}
      <div style={{ marginBottom: 24 }}>
        <label className="label">💻 Technical Skills</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input className="input" placeholder="e.g. React, Python, AWS..." value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill('tech', techInput)} style={{ flex: 1 }} />
          <button onClick={() => addSkill('tech', techInput)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>Add</button>
        </div>
        <div style={{ minHeight: 40, padding: 8, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          {(resume.skills?.technical || []).map(s => <SkillTag key={s} skill={s} type="tech" />)}
          {(resume.skills?.technical || []).length === 0 && <span style={{ color: '#94a3b8', fontSize: 13 }}>No technical skills added yet</span>}
        </div>
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', marginRight: 6 }}>Suggestions:</span>
          {suggestions.tech.map(s => (
            <button key={s} onClick={() => addSkill('tech', s)} style={{ background: 'none', border: '1px dashed #cbd5e1', borderRadius: 12, padding: '2px 8px', fontSize: 12, cursor: 'pointer', color: '#64748b', margin: '2px' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="label">🤝 Soft Skills</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input className="input" placeholder="e.g. Leadership, Communication..." value={softInput} onChange={e => setSoftInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill('soft', softInput)} style={{ flex: 1 }} />
          <button onClick={() => addSkill('soft', softInput)} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Add</button>
        </div>
        <div style={{ minHeight: 40, padding: 8, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          {(resume.skills?.soft || []).map(s => <SkillTag key={s} skill={s} type="soft" />)}
          {(resume.skills?.soft || []).length === 0 && <span style={{ color: '#94a3b8', fontSize: 13 }}>No soft skills added yet</span>}
        </div>
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', marginRight: 6 }}>Suggestions:</span>
          {suggestions.soft.map(s => (
            <button key={s} onClick={() => addSkill('soft', s)} style={{ background: 'none', border: '1px dashed #cbd5e1', borderRadius: 12, padding: '2px 8px', fontSize: 12, cursor: 'pointer', color: '#64748b', margin: '2px' }}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
