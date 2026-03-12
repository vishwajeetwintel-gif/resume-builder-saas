import React from 'react';

export default function TemplateModern({ data, scale = 1 }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data;
  const s = (base) => base * scale;

  return (
    <div style={{ width: 794, minHeight: 1122, fontFamily: "'DM Sans', sans-serif", fontSize: s(11), color: '#1a1a2e', background: 'white', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: 'white', padding: `${s(40)}px ${s(48)}px ${s(32)}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: s(20) }}>
          {p?.photo && <img src={p.photo} alt={p.name} style={{ width: s(72), height: s(72), borderRadius: '50%', objectFit: 'cover', border: `${s(3)}px solid rgba(255,255,255,0.3)` }} onError={e => e.target.style.display='none'} />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: s(28), fontWeight: 800, margin: 0, marginBottom: s(6), letterSpacing: '-0.02em' }}>{p?.name || 'Your Name'}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(16), fontSize: s(10), opacity: 0.9 }}>
              {p?.email && <span>✉ {p.email}</span>}
              {p?.phone && <span>📱 {p.phone}</span>}
              {p?.location && <span>📍 {p.location}</span>}
              {p?.linkedin && <span>🔗 {p.linkedin}</span>}
              {p?.portfolio && <span>🌐 {p.portfolio}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `${s(220)}px 1fr`, gap: 0 }}>
        {/* Left Sidebar */}
        <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: `${s(24)}px ${s(20)}px` }}>
          {/* Skills */}
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <div style={{ marginBottom: s(24) }}>
              <h2 style={{ fontSize: s(10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', marginBottom: s(12), margin: `0 0 ${s(10)}px` }}>Skills</h2>
              {skills?.technical?.length > 0 && (
                <>
                  <p style={{ fontSize: s(8), fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: `0 0 ${s(6)}px` }}>Technical</p>
                  {skills.technical.map(skill => (
                    <div key={skill} style={{ marginBottom: s(5) }}>
                      <span style={{ display: 'block', fontSize: s(9.5), marginBottom: s(2) }}>{skill}</span>
                      <div style={{ height: s(3), background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '80%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </>
              )}
              {skills?.soft?.length > 0 && (
                <>
                  <p style={{ fontSize: s(8), fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: `${s(12)}px 0 ${s(6)}px` }}>Soft Skills</p>
                  {skills.soft.map(skill => (
                    <span key={skill} style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: `${s(2)}px ${s(6)}px`, borderRadius: s(10), fontSize: s(8.5), margin: `${s(2)}px ${s(2)}px 0 0` }}>{skill}</span>
                  ))}
                </>
              )}
            </div>
          )}
          {/* Education */}
          {education?.length > 0 && (
            <div style={{ marginBottom: s(24) }}>
              <h2 style={{ fontSize: s(10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', margin: `0 0 ${s(10)}px` }}>Education</h2>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: s(12) }}>
                  <p style={{ fontWeight: 700, fontSize: s(10), margin: `0 0 ${s(2)}px` }}>{edu.degree}</p>
                  <p style={{ color: '#64748b', fontSize: s(9), margin: 0 }}>{edu.institution}</p>
                  {edu.year && <p style={{ color: '#94a3b8', fontSize: s(8.5), margin: `${s(2)}px 0 0` }}>{edu.year} {edu.gpa && `• GPA: ${edu.gpa}`}</p>}
                </div>
              ))}
            </div>
          )}
          {/* Certifications */}
          {certifications?.length > 0 && (
            <div>
              <h2 style={{ fontSize: s(10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', margin: `0 0 ${s(10)}px` }}>Certifications</h2>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: s(8) }}>
                  <p style={{ fontWeight: 600, fontSize: s(9.5), margin: `0 0 ${s(1)}px` }}>{c.name}</p>
                  <p style={{ color: '#64748b', fontSize: s(8.5), margin: 0 }}>{c.issuer} {c.date && `• ${c.date}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ padding: `${s(24)}px ${s(32)}px` }}>
          {summary && (
            <div style={{ marginBottom: s(20) }}>
              <h2 style={{ fontSize: s(10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', margin: `0 0 ${s(8)}px` }}>Professional Summary</h2>
              <p style={{ fontSize: s(10), lineHeight: 1.65, color: '#374151', margin: 0 }}>{summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div style={{ marginBottom: s(20) }}>
              <h2 style={{ fontSize: s(10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', margin: `0 0 ${s(12)}px`, paddingBottom: s(6), borderBottom: `${s(2)}px solid #2563eb` }}>Experience</h2>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: s(16) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: s(4) }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: s(11), margin: 0 }}>{exp.title}</p>
                      <p style={{ color: '#2563eb', fontWeight: 600, fontSize: s(10), margin: `${s(2)}px 0 0` }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                    </div>
                    <span style={{ fontSize: s(9), color: '#64748b', whiteSpace: 'nowrap' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.responsibilities?.filter(r => r.trim()).map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: s(6), marginBottom: s(3) }}>
                      <span style={{ color: '#2563eb', flexShrink: 0, marginTop: s(1) }}>▸</span>
                      <span style={{ fontSize: s(9.5), color: '#374151', lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {projects?.length > 0 && (
            <div>
              <h2 style={{ fontSize: s(10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', margin: `0 0 ${s(12)}px`, paddingBottom: s(6), borderBottom: `${s(2)}px solid #2563eb` }}>Projects</h2>
              {projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: s(12) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 700, fontSize: s(10.5), margin: 0 }}>{proj.name}</p>
                    {proj.link && <span style={{ fontSize: s(9), color: '#2563eb' }}>{proj.link}</span>}
                  </div>
                  {proj.description && <p style={{ fontSize: s(9.5), color: '#374151', margin: `${s(3)}px 0`, lineHeight: 1.5 }}>{proj.description}</p>}
                  {proj.technologies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {proj.technologies.map(t => (
                        <span key={t} style={{ background: '#eff6ff', color: '#2563eb', padding: `${s(1)}px ${s(6)}px`, borderRadius: s(8), fontSize: s(8.5) }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
