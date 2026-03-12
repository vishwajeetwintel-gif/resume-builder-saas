import React from 'react';
import useStore from '../../store/useStore';

export default function PersonalInfoForm() {
  const { resume, updatePersonalInfo } = useStore();
  const { personalInfo } = resume;

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text', icon: '👤' },
    { key: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email', icon: '📧' },
    { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel', icon: '📱' },
    { key: 'location', label: 'Location', placeholder: 'New York, NY', type: 'text', icon: '📍' },
    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe', type: 'url', icon: '🔗' },
    { key: 'portfolio', label: 'Portfolio / Website', placeholder: 'johndoe.dev', type: 'url', icon: '🌐' }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Personal Information</h3>
        <p style={{ color: '#64748b', fontSize: 13 }}>Your contact details appear at the top of your resume</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {fields.map(f => (
          <div key={f.key} style={f.key === 'name' ? { gridColumn: '1 / -1' } : {}}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{f.icon}</span> {f.label}
            </label>
            <input className="input" type={f.type} placeholder={f.placeholder} value={personalInfo[f.key] || ''} onChange={e => updatePersonalInfo(f.key, e.target.value)} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>🖼</span> Profile Photo URL
        </label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input className="input" type="url" placeholder="https://example.com/photo.jpg" value={personalInfo.photo || ''} onChange={e => updatePersonalInfo('photo', e.target.value)} />
          {personalInfo.photo && <img src={personalInfo.photo} alt="Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} onError={e => e.target.style.display='none'} />}
        </div>
      </div>
    </div>
  );
}
