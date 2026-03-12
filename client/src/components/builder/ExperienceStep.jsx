import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const emptyExp = {
  jobTitle: '', company: '', startDate: '', endDate: '', current: false,
  location: '', responsibilities: ['']
};

function ExperienceCard({ exp, index, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const [rewriting, setRewriting] = useState(null);

  const update = (field, val) => onUpdate({ ...exp, [field]: val });

  const addBullet = () => update('responsibilities', [...exp.responsibilities, '']);
  const updateBullet = (i, val) => {
    const r = [...exp.responsibilities];
    r[i] = val;
    update('responsibilities', r);
  };
  const removeBullet = (i) => update('responsibilities', exp.responsibilities.filter((_, idx) => idx !== i));

  const rewriteBullet = async (i) => {
    if (!exp.responsibilities[i]) return;
    setRewriting(i);
    try {
      const { data } = await api.post('/ai/rewrite-bullet', {
        text: exp.responsibilities[i],
        jobTitle: exp.jobTitle,
        industry: 'tech'
      });
      updateBullet(i, data.result);
      toast.success('Bullet rewritten!');
    } catch {
      toast.error('AI rewrite failed');
    } finally {
      setRewriting(null);
    }
  };

  const generateAchievements = async () => {
    if (!exp.jobTitle) { toast.error('Add job title first'); return; }
    setRewriting('gen');
    try {
      const { data } = await api.post('/ai/generate-achievements', {
        jobTitle: exp.jobTitle,
        company: exp.company,
        responsibilities: exp.responsibilities.join(', ')
      });
      update('responsibilities', [...exp.responsibilities.filter(r => r), ...data.achievements]);
      toast.success('Achievements generated!');
    } catch {
      toast.error('Failed to generate');
    } finally {
      setRewriting(null);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <div>
          <div className="font-medium text-sm text-slate-900">{exp.jobTitle || `Position ${index + 1}`}</div>
          {exp.company && <div className="text-xs text-slate-500">{exp.company}</div>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Job Title *</label>
              <input className="input text-sm" value={exp.jobTitle} onChange={e => update('jobTitle', e.target.value)} placeholder="Software Engineer" />
            </div>
            <div>
              <label className="label text-xs">Company *</label>
              <input className="input text-sm" value={exp.company} onChange={e => update('company', e.target.value)} placeholder="Google" />
            </div>
          </div>
          <div>
            <label className="label text-xs">Location</label>
            <input className="input text-sm" value={exp.location || ''} onChange={e => update('location', e.target.value)} placeholder="New York, NY" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Start Date</label>
              <input type="month" className="input text-sm" value={exp.startDate} onChange={e => update('startDate', e.target.value)} />
            </div>
            <div>
              <label className="label text-xs">End Date</label>
              <input type="month" className="input text-sm" value={exp.endDate} onChange={e => update('endDate', e.target.value)} disabled={exp.current} />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                <input type="checkbox" checked={exp.current || false} onChange={e => update('current', e.target.checked)} className="rounded" />
                <span className="text-xs text-slate-500">Present</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label text-xs mb-0">Responsibilities & Achievements</label>
              <button onClick={generateAchievements} disabled={rewriting === 'gen'}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium">
                {rewriting === 'gen' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Generate
              </button>
            </div>
            {exp.responsibilities.map((r, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <div className="flex-1 flex gap-1">
                  <textarea
                    value={r}
                    onChange={e => updateBullet(i, e.target.value)}
                    placeholder="Describe your responsibility or achievement..."
                    rows={2}
                    className="input text-sm resize-none flex-1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => rewriteBullet(i)} disabled={rewriting === i || !r}
                    className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-40"
                    title="Rewrite with AI">
                    {rewriting === i ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  </button>
                  <button onClick={() => removeBullet(i)} disabled={exp.responsibilities.length === 1}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addBullet} className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium mt-1">
              <Plus size={13} /> Add bullet point
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExperienceStep() {
  const { resume, addExperience, updateExperience, deleteExperience } = useResumeStore();

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Work Experience</h2>
        <p className="text-sm text-slate-500">Add your work history. Most recent position first.</p>
      </div>

      <div className="space-y-3">
        {resume.experience.map((exp, i) => (
          <ExperienceCard key={exp.id} exp={exp} index={i}
            onUpdate={(data) => updateExperience(exp.id, data)}
            onDelete={() => deleteExperience(exp.id)} />
        ))}
      </div>

      <button onClick={() => addExperience({ ...emptyExp })}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
        <Plus size={16} /> Add Work Experience
      </button>

      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-xs text-amber-700">
          💡 <strong>ATS Tip:</strong> Use the AI ✨ button to rewrite each bullet point with strong action verbs and quantifiable results.
        </p>
      </div>
    </div>
  );
}
