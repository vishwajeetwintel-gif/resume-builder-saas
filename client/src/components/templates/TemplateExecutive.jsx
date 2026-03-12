import React from 'react';

export default function TemplateExecutive({ data, scale = 1 }) {
  const { personalInfo: p, summary, experience, education, skills, certifications } = data;
  const s = (base) => base * scale;

  return (
    <div style={{ width: 794, minHeight: 1122, fontFamily: "'DM Sans', sans-serif", fontSize: s(11), color: '#1a1a1a', background: 'white' }}>
      {/* Gold accent top */}
      <div style={{ height: s(6), background: 'linear-gradient(90deg, #b8860b, #ffd700, #b8860b)' }} />
      <div style={{ padding: `${s(36)}px ${s(52)}px` }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: s(28), paddingBottom: s(20), borderBottom: `${s(2)}px solid #b8860b` }}>
          <h1 style={{ fontSize: s(34), fontWeight: 900, margin: `0 0 ${s(6)}px`, color: '#1a1a1a', letterSpacing: '-0.02em', fontFamily: "'Playfair Display', serif" }}>{p?.name || 'Executive Name'}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: s(20), fontSize: s(10), color: '#555' }}>
            {p?.email && <span>✉ {p.email}</span>}
            {p?.phone && <span>☎ {p.phone}</span>}
            {p?.location && <span>⚑ {p.location}</span>}
            {p?.linkedin && <span>⊞ {p.linkedin}</span>}
          </div>
        </div>

        {summary && (
          <div style={{ background: '#fffbf0', border: `${s(1)}px solid #f0e0a0`, borderRadius: s(6), padding: `${s(14)}px ${s(18)}px`, marginBottom: s(24) }}>
            <p style={{ fontSize: s(10.5), lineHeight: 1.7, color: '#333', margin: 0, textAlign: 'center' }}>{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div style={{ marginBottom: s(24) }}>
            <h2 style={{ fontSize: s(11), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b8860b', margin: `0 0 ${s(14)}px`, display: 'flex', alignItems: 'center', gap: s(8) }}>
              <span style={{ flex: 1, height: 1, background: '#b8860b', display: 'inline-block' }} />
              Professional Experience
              <span style={{ flex: 1, height: 1, background: '#b8860b', display: 'inline-block' }} />
            </h2>
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: s(18) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: s(4) }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: s(12), margin: 0 }}>{exp.title}</p>
                    <p style={{ color: '#b8860b', fontWeight: 600, fontSize: s(10.5), margin: `${s(2)}px 0 0`, fontStyle: 'italic' }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span style={{ fontSize: s(9.5), color: '#666', fontStyle: 'italic' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.responsibilities?.filter(r => r.trim()).map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(8), marginBottom: s(4), paddingLeft: s(4) }}>
                    <span style={{ color: '#b8860b', fontSize: s(12), lineHeight: 1.4, flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: s(9.5), color: '#333', lineHeight: 1.55 }}>{r}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: s(32) }}>
          {education?.length > 0 && (
            <div>
              <h2 style={{ fontSize: s(11), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b8860b', margin: `0 0 ${s(12)}px`, borderBottom: `${s(1)}px solid #b8860b`, paddingBottom: s(6) }}>Education</h2>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: s(10) }}>
                  <p style={{ fontWeight: 700, fontSize: s(10.5), margin: `0 0 ${s(2)}px` }}>{edu.degree}</p>
                  <p style={{ fontSize: s(9.5), color: '#555', margin: 0, fontStyle: 'italic' }}>{edu.institution}</p>
                  {edu.year && <p style={{ fontSize: s(9), color: '#888', margin: `${s(1)}px 0 0` }}>{edu.year}{edu.gpa && ` · GPA ${edu.gpa}`}</p>}
                </div>
              ))}
            </div>
          )}
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <div>
              <h2 style={{ fontSize: s(11), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b8860b', margin: `0 0 ${s(12)}px`, borderBottom: `${s(1)}px solid #b8860b`, paddingBottom: s(6) }}>Core Competencies</h2>
              {[...(skills?.technical || []), ...(skills?.soft || [])].map(skill => (
                <span key={skill} style={{ display: 'inline-block', background: '#fffbf0', border: '1px solid #daa520', padding: `${s(3)}px ${s(8)}px`, borderRadius: s(4), fontSize: s(9), margin: `${s(2)}px ${s(3)}px 0 0`, color: '#555' }}>{skill}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ height: s(6), background: 'linear-gradient(90deg, #b8860b, #ffd700, #b8860b)', marginTop: s(24) }} />
    </div>
  );
}
