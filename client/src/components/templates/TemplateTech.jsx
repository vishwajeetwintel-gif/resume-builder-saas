import React from 'react';

export default function TemplateTech({ data, scale = 1 }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data;
  const s = (base) => base * scale;

  return (
    <div style={{ width: 794, minHeight: 1122, fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: s(10), color: '#e2e8f0', background: '#0f172a' }}>
      {/* Terminal-style header */}
      <div style={{ background: '#1e293b', padding: `${s(6)}px ${s(20)}px`, borderBottom: `${s(1)}px solid #334155`, display: 'flex', alignItems: 'center', gap: s(6) }}>
        <div style={{ width: s(10), height: s(10), borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: s(10), height: s(10), borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: s(10), height: s(10), borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ marginLeft: s(8), fontSize: s(9), color: '#64748b' }}>resume.json — {p?.name || 'candidate'}</span>
      </div>

      <div style={{ padding: `${s(24)}px ${s(28)}px` }}>
        {/* Name/Contact as code */}
        <div style={{ marginBottom: s(24) }}>
          <span style={{ color: '#7c3aed', fontSize: s(9) }}>const </span>
          <span style={{ color: '#38bdf8' }}>candidate</span>
          <span style={{ color: '#94a3b8' }}> = {'{'}</span>
          <div style={{ paddingLeft: s(20), margin: `${s(4)}px 0` }}>
            <div><span style={{ color: '#34d399' }}>name</span><span style={{ color: '#94a3b8' }}>: </span><span style={{ color: '#fbbf24' }}>"{p?.name || 'Your Name'}"</span><span style={{ color: '#94a3b8' }}>,</span></div>
            {p?.email && <div><span style={{ color: '#34d399' }}>email</span><span style={{ color: '#94a3b8' }}>: </span><span style={{ color: '#fbbf24' }}>"{p.email}"</span><span style={{ color: '#94a3b8' }}>,</span></div>}
            {p?.phone && <div><span style={{ color: '#34d399' }}>phone</span><span style={{ color: '#94a3b8' }}>: </span><span style={{ color: '#fbbf24' }}>"{p.phone}"</span><span style={{ color: '#94a3b8' }}>,</span></div>}
            {p?.location && <div><span style={{ color: '#34d399' }}>location</span><span style={{ color: '#94a3b8' }}>: </span><span style={{ color: '#fbbf24' }}>"{p.location}"</span><span style={{ color: '#94a3b8' }}>,</span></div>}
            {p?.linkedin && <div><span style={{ color: '#34d399' }}>linkedin</span><span style={{ color: '#94a3b8' }}>: </span><span style={{ color: '#fbbf24' }}>"{p.linkedin}"</span></div>}
          </div>
          <span style={{ color: '#94a3b8' }}>{'};'}</span>
        </div>

        {summary && (
          <div style={{ marginBottom: s(20) }}>
            <div style={{ color: '#64748b', marginBottom: s(6), fontSize: s(9) }}>{'/* ABOUT */'}</div>
            <p style={{ fontSize: s(10), lineHeight: 1.65, color: '#cbd5e1', margin: 0, borderLeft: `${s(3)}px solid #7c3aed`, paddingLeft: s(12) }}>{summary}</p>
          </div>
        )}

        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0) && (
          <div style={{ marginBottom: s(20) }}>
            <div style={{ color: '#64748b', marginBottom: s(8), fontSize: s(9) }}>{'/* TECH STACK */'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(6) }}>
              {[...(skills.technical || []), ...(skills.soft || [])].map(skill => (
                <span key={skill} style={{ background: '#1e293b', border: `${s(1)}px solid #334155`, color: '#38bdf8', padding: `${s(3)}px ${s(9)}px`, borderRadius: s(4), fontSize: s(9) }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ marginBottom: s(20) }}>
            <div style={{ color: '#64748b', marginBottom: s(10), fontSize: s(9) }}>{'/* EXPERIENCE */'}</div>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: s(16), borderLeft: `${s(2)}px solid #334155`, paddingLeft: s(14) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: s(4) }}>
                  <div>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: s(11) }}>{exp.title}</span>
                    <span style={{ color: '#94a3b8', fontSize: s(10) }}> @ </span>
                    <span style={{ color: '#7c3aed', fontSize: s(10) }}>{exp.company}</span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: s(8.5) }}>{exp.startDate} → {exp.current ? 'now' : exp.endDate}</span>
                </div>
                {exp.responsibilities?.filter(r => r.trim()).map((r, j) => (
                  <div key={j} style={{ display: 'flex', gap: s(6), marginBottom: s(3) }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>›</span>
                    <span style={{ fontSize: s(9.5), color: '#cbd5e1', lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: s(24) }}>
          {education?.length > 0 && (
            <div>
              <div style={{ color: '#64748b', marginBottom: s(8), fontSize: s(9) }}>{'/* EDUCATION */'}</div>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: s(10), background: '#1e293b', padding: `${s(10)}px ${s(12)}px`, borderRadius: s(6) }}>
                  <p style={{ color: '#38bdf8', fontWeight: 700, fontSize: s(10), margin: `0 0 ${s(2)}px` }}>{edu.degree}</p>
                  <p style={{ color: '#94a3b8', fontSize: s(9), margin: 0 }}>{edu.institution} {edu.year && `• ${edu.year}`}</p>
                </div>
              ))}
            </div>
          )}
          {projects?.length > 0 && (
            <div>
              <div style={{ color: '#64748b', marginBottom: s(8), fontSize: s(9) }}>{'/* PROJECTS */'}</div>
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: s(10), background: '#1e293b', padding: `${s(10)}px ${s(12)}px`, borderRadius: s(6) }}>
                  <p style={{ color: '#22c55e', fontWeight: 700, fontSize: s(10), margin: `0 0 ${s(2)}px` }}>{proj.name}</p>
                  {proj.description && <p style={{ fontSize: s(9), color: '#94a3b8', margin: 0 }}>{proj.description.slice(0, 80)}...</p>}
                  {proj.technologies?.length > 0 && <p style={{ fontSize: s(8.5), color: '#7c3aed', margin: `${s(4)}px 0 0` }}>[{proj.technologies.join(', ')}]</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
