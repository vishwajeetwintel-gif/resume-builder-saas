import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// ==================== EDUCATION ====================
function EducationCard({ edu, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const update = (field, val) => onUpdate({ ...edu, [field]: val });
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <div className="font-medium text-sm text-slate-900">{edu.degree || 'Degree'}</div>
          {edu.institution && <div className="text-xs text-slate-500">{edu.institution}</div>}
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
            <Trash2 size={14} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>
      {expanded && (
        <div className="p-4 space-y-3">
          <div>
            <label className="label text-xs">Degree / Qualification *</label>
            <input className="input text-sm" value={edu.degree || ''} onChange={e => update('degree', e.target.value)} placeholder="B.Tech Computer Science" />
          </div>
          <div>
            <label className="label text-xs">Institution *</label>
            <input className="input text-sm" value={edu.institution || ''} onChange={e => update('institution', e.target.value)} placeholder="MIT" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Start Year</label>
              <input type="number" className="input text-sm" value={edu.startYear || ''} onChange={e => update('startYear', e.target.value)} placeholder="2018" min="1980" max="2030" />
            </div>
            <div>
              <label className="label text-xs">Graduation Year</label>
              <input type="number" className="input text-sm" value={edu.graduationYear || ''} onChange={e => update('graduationYear', e.target.value)} placeholder="2022" min="1980" max="2030" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">GPA (optional)</label>
              <input className="input text-sm" value={edu.gpa || ''} onChange={e => update('gpa', e.target.value)} placeholder="3.8/4.0" />
            </div>
            <div>
              <label className="label text-xs">Location</label>
              <input className="input text-sm" value={edu.location || ''} onChange={e => update('location', e.target.value)} placeholder="Cambridge, MA" />
            </div>
          </div>
          <div>
            <label className="label text-xs">Relevant Coursework / Honors (optional)</label>
            <input className="input text-sm" value={edu.coursework || ''} onChange={e => update('coursework', e.target.value)} placeholder="Data Structures, Algorithms, Machine Learning" />
          </div>
        </div>
      )}
    </div>
  );
}

export function EducationStep() {
  const { resume, addEducation, updateEducation, deleteEducation } = useResumeStore();
  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Education</h2>
        <p className="text-sm text-slate-500">Add your academic qualifications.</p>
      </div>
      <div className="space-y-3">
        {resume.education.map((edu) => (
          <EducationCard key={edu.id} edu={edu}
            onUpdate={(d) => updateEducation(edu.id, d)}
            onDelete={() => deleteEducation(edu.id)} />
        ))}
      </div>
      <button onClick={() => addEducation({ degree: '', institution: '' })}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
        <Plus size={16} /> Add Education
      </button>
    </div>
  );
}

// ==================== SKILLS ====================
export function SkillsStep() {
  const { resume, addSkill, removeSkill } = useResumeStore();
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');

  const addTech = () => {
    if (!techInput.trim()) return;
    addSkill('technical', techInput.trim());
    setTechInput('');
  };
  const addSoft = () => {
    if (!softInput.trim()) return;
    addSkill('soft', softInput.trim());
    setSoftInput('');
  };

  const techSkills = resume.skills?.technical || [];
  const softSkills = resume.skills?.soft || [];

  const commonTech = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'AWS', 'Docker', 'Git', 'MongoDB'];
  const commonSoft = ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Creativity'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Skills</h2>
        <p className="text-sm text-slate-500">Add technical and soft skills. These heavily impact ATS scores.</p>
      </div>

      {/* Technical Skills */}
      <div className="mb-6">
        <label className="label">Technical Skills</label>
        <div className="flex gap-2 mb-3">
          <input className="input text-sm flex-1" value={techInput} onChange={e => setTechInput(e.target.value)}
            placeholder="e.g. React, Python, AWS" onKeyDown={e => e.key === 'Enter' && addTech()} />
          <button onClick={addTech} className="btn-primary px-4 py-2 text-sm shrink-0"><Plus size={15} /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {techSkills.map(skill => (
            <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium border border-brand-200">
              {skill}
              <button onClick={() => removeSkill('technical', skill)} className="text-brand-400 hover:text-brand-600">×</button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {commonTech.filter(s => !techSkills.includes(s)).map(s => (
            <button key={s} onClick={() => addSkill('technical', s)}
              className="px-2.5 py-1 bg-surface-100 text-slate-600 rounded-full text-xs hover:bg-brand-50 hover:text-brand-600 transition-colors">
              + {s}
            </button>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="label">Soft Skills</label>
        <div className="flex gap-2 mb-3">
          <input className="input text-sm flex-1" value={softInput} onChange={e => setSoftInput(e.target.value)}
            placeholder="e.g. Leadership, Communication" onKeyDown={e => e.key === 'Enter' && addSoft()} />
          <button onClick={addSoft} className="btn-primary px-4 py-2 text-sm shrink-0"><Plus size={15} /></button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {softSkills.map(skill => (
            <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
              {skill}
              <button onClick={() => removeSkill('soft', skill)} className="text-green-400 hover:text-green-600">×</button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {commonSoft.filter(s => !softSkills.includes(s)).map(s => (
            <button key={s} onClick={() => addSkill('soft', s)}
              className="px-2.5 py-1 bg-surface-100 text-slate-600 rounded-full text-xs hover:bg-green-50 hover:text-green-600 transition-colors">
              + {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
        <p className="text-xs text-brand-700">
          💡 <strong>ATS Tip:</strong> Match skills exactly as they appear in job descriptions. Include both abbreviated and full forms (e.g., "ML" and "Machine Learning").
        </p>
      </div>
    </div>
  );
}

// ==================== PROJECTS ====================
export function ProjectsStep() {
  const { resume, addProject, updateProject, deleteProject } = useResumeStore();
  const [expanded, setExpanded] = useState({});

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Projects</h2>
        <p className="text-sm text-slate-500">Showcase your best work. Projects can substitute for experience.</p>
      </div>
      <div className="space-y-3">
        {resume.projects.map((proj) => (
          <div key={proj.id} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer"
              onClick={() => setExpanded(e => ({ ...e, [proj.id]: !e[proj.id] }))}>
              <div className="font-medium text-sm text-slate-900">{proj.name || 'Project'}</div>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                {expanded[proj.id] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </div>
            {expanded[proj.id] && (
              <div className="p-4 space-y-3">
                <div>
                  <label className="label text-xs">Project Name *</label>
                  <input className="input text-sm" value={proj.name || ''} onChange={e => updateProject(proj.id, { name: e.target.value })} placeholder="E-Commerce Platform" />
                </div>
                <div>
                  <label className="label text-xs">Description</label>
                  <textarea className="input text-sm resize-none" rows={3} value={proj.description || ''} onChange={e => updateProject(proj.id, { description: e.target.value })} placeholder="Built a full-stack e-commerce platform..." />
                </div>
                <div>
                  <label className="label text-xs">Technologies Used</label>
                  <input className="input text-sm" value={(proj.technologies || []).join(', ')} onChange={e => updateProject(proj.id, { technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} placeholder="React, Node.js, MongoDB, AWS" />
                </div>
                <div>
                  <label className="label text-xs">Project Link (optional)</label>
                  <input className="input text-sm" value={proj.link || ''} onChange={e => updateProject(proj.id, { link: e.target.value })} placeholder="https://github.com/..." />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => addProject({ name: '', description: '', technologies: [] })}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
        <Plus size={16} /> Add Project
      </button>
    </div>
  );
}

// ==================== CERTIFICATIONS ====================
export function CertificationsStep() {
  const { resume, addCertification, updateCertification, deleteCertification } = useResumeStore();
  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Certifications</h2>
        <p className="text-sm text-slate-500">Professional certifications boost ATS scores significantly.</p>
      </div>
      <div className="space-y-3">
        {resume.certifications.map((cert) => (
          <div key={cert.id} className="p-4 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">{cert.name || 'Certification'}</span>
              <button onClick={() => deleteCertification(cert.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
            <div className="space-y-2">
              <input className="input text-sm" value={cert.name || ''} onChange={e => updateCertification(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" />
              <input className="input text-sm" value={cert.issuer || ''} onChange={e => updateCertification(cert.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
              <div className="grid grid-cols-2 gap-2">
                <input type="month" className="input text-sm" value={cert.date || ''} onChange={e => updateCertification(cert.id, { date: e.target.value })} />
                <input className="input text-sm" value={cert.credentialId || ''} onChange={e => updateCertification(cert.id, { credentialId: e.target.value })} placeholder="Credential ID (optional)" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => addCertification({ name: '', issuer: '' })}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
        <Plus size={16} /> Add Certification
      </button>
    </div>
  );
}

// ==================== LANGUAGES ====================
export function LanguagesStep() {
  const { resume, addLanguage, deleteLanguage } = useResumeStore();
  const [input, setInput] = useState({ language: '', proficiency: 'Professional' });
  const levels = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Languages</h2>
        <p className="text-sm text-slate-500">Multilingual skills can be a strong differentiator.</p>
      </div>
      <div className="flex gap-2 mb-4">
        <input className="input text-sm flex-1" value={input.language} onChange={e => setInput(i => ({ ...i, language: e.target.value }))} placeholder="e.g. Spanish" />
        <select className="input text-sm w-36" value={input.proficiency} onChange={e => setInput(i => ({ ...i, proficiency: e.target.value }))}>
          {levels.map(l => <option key={l}>{l}</option>)}
        </select>
        <button onClick={() => { if (input.language) { addLanguage(input); setInput({ language: '', proficiency: 'Professional' }); } }} className="btn-primary px-4 text-sm shrink-0">
          <Plus size={15} />
        </button>
      </div>
      <div className="space-y-2">
        {resume.languages.map(lang => (
          <div key={lang.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-slate-100">
            <div>
              <span className="font-medium text-sm text-slate-800">{lang.language}</span>
              <span className="ml-2 badge badge-blue">{lang.proficiency}</span>
            </div>
            <button onClick={() => deleteLanguage(lang.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== CUSTOM SECTIONS ====================
export function CustomSectionsStep() {
  const { resume, addCustomSection, updateCustomSection, deleteCustomSection } = useResumeStore();
  const [title, setTitle] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Custom Sections</h2>
        <p className="text-sm text-slate-500">Add volunteer work, publications, awards, or any other section.</p>
      </div>
      <div className="flex gap-2 mb-4">
        <input className="input text-sm flex-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Section title (e.g. Awards)" />
        <button onClick={() => { if (title) { addCustomSection({ title, content: '' }); setTitle(''); } }} className="btn-primary text-sm shrink-0">
          <Plus size={15} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {resume.customSections.map(section => (
          <div key={section.id} className="p-4 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <input className="input text-sm font-medium flex-1 mr-2" value={section.title}
                onChange={e => updateCustomSection(section.id, { title: e.target.value })} />
              <button onClick={() => deleteCustomSection(section.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
            </div>
            <textarea className="input text-sm resize-none" rows={4} value={section.content || ''}
              onChange={e => updateCustomSection(section.id, { content: e.target.value })}
              placeholder="Add content for this section..." />
          </div>
        ))}
      </div>
    </div>
  );
}
