import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EXAMPLES = [
  "Results-driven software engineer with 5+ years building scalable web applications using React, Node.js, and AWS. Led teams of 4–8 developers, delivering projects 20% under budget.",
  "Marketing professional with 7 years of experience driving 3x revenue growth through data-driven campaigns. Expert in SEO, PPC, and marketing automation.",
  "Financial analyst with CFA designation and 6 years at top investment firms. Managed $50M portfolio with consistent 15%+ annual returns."
];

export default function SummaryStep() {
  const { resume, updateSummary } = useResumeStore();
  const [loading, setLoading] = useState(false);

  const handleAIRewrite = async () => {
    if (!resume.summary && !resume.personalInfo?.jobTitle) {
      toast.error('Add a job title or write a draft summary first');
      return;
    }
    setLoading(true);
    try {
      const skills = [...(resume.skills?.technical || []), ...(resume.skills?.soft || [])];
      const { data } = await api.post('/ai/rewrite-summary', {
        summary: resume.summary || `${resume.personalInfo?.jobTitle} with experience in ${skills.slice(0, 3).join(', ')}`,
        jobTitle: resume.personalInfo?.jobTitle,
        skills,
        yearsExp: resume.experience?.length > 0 ? `${resume.experience.length * 2}+` : 'N/A'
      });
      updateSummary(data.result);
      toast.success('Summary rewritten with AI!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="section-title">Professional Summary</h2>
        <p className="text-sm text-slate-500">A compelling 2–4 sentence overview of your professional background and value.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0">Summary</label>
          <span className="text-xs text-slate-400">{(resume.summary || '').length} chars</span>
        </div>
        <textarea
          value={resume.summary || ''}
          onChange={e => updateSummary(e.target.value)}
          placeholder="Write your professional summary here... or use AI to generate one."
          rows={6}
          className="input resize-none"
        />
      </div>

      <button onClick={handleAIRewrite} disabled={loading}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
        {loading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {loading ? 'Rewriting with AI...' : 'Rewrite with AI (GPT-4o-mini)'}
      </button>

      <div className="mt-6">
        <p className="text-xs font-medium text-slate-500 mb-3">Examples to inspire you:</p>
        <div className="space-y-2">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="p-3 bg-surface-50 rounded-lg border border-slate-100 cursor-pointer hover:border-brand-200 hover:bg-brand-50 transition-colors"
              onClick={() => updateSummary(ex)}>
              <p className="text-xs text-slate-600 leading-relaxed">{ex}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
        <p className="text-xs text-green-700">
          💡 <strong>ATS Tip:</strong> Include your job title, years of experience, 2-3 key skills, and a notable achievement. Keep it under 100 words.
        </p>
      </div>
    </div>
  );
}
