import React from 'react';
import useStore from '../../store/useStore';

export default function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } = useStore();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Education</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>Add your academic qualifications</p>
        </div>
        <button onClick={addEducation} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>+ Add Education</button>
      </div>

      {resume.education.map((edu, i) => (
        <div key={edu.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => removeEducation(edu.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12 }}>Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'degree', label: 'Degree / Qualification', placeholder: 'Bachelor of Science in Computer Science', full: true },
              { key: 'institution', label: 'Institution', placeholder: 'MIT' },
              { key: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
              { key: 'year', label: 'Graduation Year', placeholder: '2022' },
              { key: 'gpa', label: 'GPA (optional)', placeholder: '3.8' }
            ].map(f => (
              <div key={f.key} style={f.full ? { gridColumn: '1 / -1' } : {}}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} value={edu[f.key] || ''} onChange={e => updateEducation(edu.id, f.key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {resume.education.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, border: '2px dashed #e2e8f0', borderRadius: 12, color: '#94a3b8' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <p>No education added yet</p>
        </div>
      )}
    </div>
  );
}
