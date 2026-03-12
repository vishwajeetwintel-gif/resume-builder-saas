import React, { useState } from 'react';
import useStore from '../../store/useStore';

export default function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useStore();
  const [techInputs, setTechInputs] = useState({});

  const addTech = (projId) => {
    const val = techInputs[projId]?.trim();
    if (!val) return;
    const proj = resume.projects.find(p => p.id === projId);
    const techs = [...(proj.technologies || []), val];
    updateProject(projId, 'technologies', techs);
    setTechInputs(p => ({ ...p, [projId]: '' }));
  };

  const removeTech = (projId, tech) => {
    const proj = resume.projects.find(p => p.id === projId);
    updateProject(projId, 'technologies', proj.technologies.filter(t => t !== tech));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Projects</h3>
          <p style={{ color: '#64748b', fontSize: 13 }}>Showcase your best work</p>
        </div>
        <button onClick={addProject} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>+ Add Project</button>
      </div>

      {resume.projects.map(proj => (
        <div key={proj.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => removeProject(proj.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 12 }}>Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Project Name</label>
              <input className="input" placeholder="E-Commerce Platform" value={proj.name || ''} onChange={e => updateProject(proj.id, 'name', e.target.value)} />
            </div>
            <div>
              <label className="label">Project Link</label>
              <input className="input" placeholder="https://github.com/..." value={proj.link || ''} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Description</label>
              <textarea placeholder="Built a full-stack e-commerce platform with React and Node.js..." value={proj.description || ''} onChange={e => updateProject(proj.id, 'description', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, resize: 'vertical', minHeight: 80, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Technologies Used</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="input" placeholder="React, Node.js, MongoDB..." value={techInputs[proj.id] || ''} onChange={e => setTechInputs(p => ({ ...p, [proj.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addTech(proj.id)} style={{ flex: 1 }} />
                <button onClick={() => addTech(proj.id)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' }}>+</button>
              </div>
              <div>
                {(proj.technologies || []).map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 12, fontSize: 12, margin: '3px' }}>
                    {t} <button onClick={() => removeTech(proj.id, t)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#2563eb', opacity: 0.7, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
