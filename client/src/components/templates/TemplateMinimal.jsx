import React from 'react';

export default function TemplateMinimal({ data, scale = 1 }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data;
  const s = (base) => base * scale;

  return (
    <div style={{ width: 794, minHeight: 1122, fontFamily: "'DM Sans', sans-serif", fontSize: s(11), color: '#111', background: 'white', padding: `${s(48)}px ${s(56)}px` }}>
      {/* Header */}
      <div style={{ borderBottom: `${s(1)}px solid #000`, paddingBottom: s(20), marginBottom: s(24) }}>
        <h1 style={{ fontSize: s(32), fontWeight: 900, margin: 0, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{p?.name || 'YOUR NAME'}</h1>
        <div style={{ display: 'flex', gap: s(20), marginTop: s(8), fontSize: s(9.5), color: '#555' }}>
          {p?.email && <span>{p.email}</span>}
          {p?.phone && <span>{p.phone}</span>}
          {p?.location && <span>{p.location}</span>}
          {p?.linkedin && <span>{p.linkedin}</span>}
          {p?.portfolio && <span>{p.portfolio}</span>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: s(24) }}>
          <p style={{ fontSize: s(10.5), lineHeight: 1.7, color: '#333', margin: 0, fontStyle: 'italic' }}>{summary}</p>
        </div>
      )}

      {experience?.length > 0 && (
        <div style={{ marginBottom: s(24) }}>
          <h2 style={{ fontSize: s(9), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: `0 0 ${s(14)}px`, color: '#000' }}>Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: s(16), display: 'grid', gridTemplateColumns: `${s(130)}px 1fr`, gap: s(16) }}>
              <div>
                <p style={{ fontSize: s(9), color: '#666', margin: 0, lineHeight: 1.5 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                <p style={{ fontSize: s(9), color: '#666', margin: 0 }}>{exp.location}</p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: s(10.5), margin: `0 0 ${s(2)}px` }}>{exp.title}</p>
                <p style={{ fontSize: s(10), color: '#555', margin: `0 0 ${s(6)}px`, fontStyle: 'italic' }}>{exp.company}</p>
                {exp.responsibilities?.filter(r => r.trim()).map((r, i) => (
                  <p key={i} style={{ fontSize: s(9.5), color: '#333', margin: `0 0 ${s(3)}px`, lineHeight: 1.55, paddingLeft: s(10) }}>— {r}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: s(32) }}>
        {education?.length > 0 && (
          <div>
            <h2 style={{ fontSize: s(9), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: `0 0 ${s(14)}px`, color: '#000' }}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: s(10) }}>
                <p style={{ fontWeight: 700, fontSize: s(10), margin: `0 0 ${s(1)}px` }}>{edu.degree}</p>
                <p style={{ fontSize: s(9), color: '#555', margin: 0 }}>{edu.institution} {edu.year && `• ${edu.year}`}</p>
              </div>
            ))}
          </div>
        )}

        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <div>
            <h2 style={{ fontSize: s(9), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: `0 0 ${s(14)}px`, color: '#000' }}>Skills</h2>
            {skills?.technical?.length > 0 && (
              <p style={{ fontSize: s(9.5), color: '#333', lineHeight: 1.6, margin: `0 0 ${s(6)}px` }}>
                {skills.technical.join(' · ')}
              </p>
            )}
            {skills?.soft?.length > 0 && (
              <p style={{ fontSize: s(9.5), color: '#555', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                {skills.soft.join(' · ')}
              </p>
            )}
          </div>
        )}
      </div>

      {projects?.length > 0 && (
        <div style={{ marginTop: s(24) }}>
          <h2 style={{ fontSize: s(9), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: `0 0 ${s(14)}px`, color: '#000' }}>Projects</h2>
          {projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: s(10), display: 'grid', gridTemplateColumns: `${s(130)}px 1fr`, gap: s(16) }}>
              <div>
                {proj.technologies?.length > 0 && <p style={{ fontSize: s(8.5), color: '#888', margin: 0, lineHeight: 1.5 }}>{proj.technologies.join(', ')}</p>}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: s(10), margin: `0 0 ${s(2)}px` }}>{proj.name} {proj.link && <span style={{ fontSize: s(8.5), color: '#555', fontWeight: 400 }}> — {proj.link}</span>}</p>
                {proj.description && <p style={{ fontSize: s(9.5), color: '#333', margin: 0, lineHeight: 1.5 }}>{proj.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
