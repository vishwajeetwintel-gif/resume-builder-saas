import React, { useCallback } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { User, Mail, Phone, Linkedin, Globe, MapPin, Briefcase } from 'lucide-react';

const fields = [
  { key: 'name', label: 'Full Name', placeholder: 'John Smith', icon: User, type: 'text' },
  { key: 'jobTitle', label: 'Professional Title', placeholder: 'Senior Software Engineer', icon: Briefcase, type: 'text' },
  { key: 'email', label: 'Email', placeholder: 'john@example.com', icon: Mail, type: 'email' },
  { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', icon: Phone, type: 'tel' },
  { key: 'location', label: 'Location', placeholder: 'San Francisco, CA', icon: MapPin, type: 'text' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johnsmith', icon: Linkedin, type: 'url' },
  { key: 'portfolio', label: 'Portfolio / Website', placeholder: 'johnsmith.dev', icon: Globe, type: 'url' }
];

export default function PersonalInfoStep() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const info = resume.personalInfo;

  const handleChange = useCallback((key, value) => {
    updatePersonalInfo({ [key]: value });
  }, [updatePersonalInfo]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Personal Information</h2>
        <p className="text-sm text-slate-500">Start with your contact details. This appears at the top of your resume.</p>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, icon: Icon, type }) => (
          <div key={key}>
            <label className="label">{label}</label>
            <div className="relative">
              <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={type}
                value={info[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="input pl-9"
              />
            </div>
          </div>
        ))}

        {/* Profile Photo URL */}
        <div>
          <label className="label">Profile Photo URL <span className="text-slate-400 font-normal">(optional)</span></label>
          <input
            type="url"
            value={info.profilePhoto || ''}
            onChange={e => handleChange('profilePhoto', e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="input"
          />
          {info.profilePhoto && (
            <img src={info.profilePhoto} alt="Profile" className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
          )}
        </div>
      </div>

      {/* Preview tip */}
      <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-100">
        <p className="text-xs text-brand-700">
          💡 <strong>ATS Tip:</strong> Always include your full name, professional email, phone number, and LinkedIn URL. These are required by most ATS systems.
        </p>
      </div>
    </div>
  );
}
