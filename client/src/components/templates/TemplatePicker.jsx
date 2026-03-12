import React, { useState, useEffect } from 'react';
import { useResumeStore, useAuthStore } from '../../store/resumeStore';
import { Crown, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const CATEGORIES = ['All', 'Modern', 'Professional', 'Minimal', 'Executive', 'Creative', 'Tech', 'Corporate', 'Academic'];

export default function TemplatePicker({ onClose, isPremium }) {
  const { resume, setTemplate } = useResumeStore();
  const [templates, setTemplates] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/templates').then(({ data }) => {
      setTemplates(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? templates : templates.filter(t => t.category === activeCategory);
  const free = filtered.filter(t => !t.premium);
  const premium = filtered.filter(t => t.premium);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 text-sm">Choose Template</h3>
        {onClose && <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading templates...</div>
      ) : (
        <div className="max-h-80 overflow-y-auto space-y-3">
          {/* Free templates */}
          {free.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
                <Check size={12} className="text-green-500" /> Free Templates
              </p>
              <div className="grid grid-cols-3 gap-2">
                {free.map(tmpl => (
                  <TemplateCard key={tmpl.id} template={tmpl} selected={resume.template === tmpl.id}
                    onClick={() => setTemplate(tmpl.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Premium templates */}
          {premium.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
                <Crown size={12} className="text-amber-500" /> Premium Templates
              </p>
              <div className="grid grid-cols-3 gap-2">
                {premium.map(tmpl => (
                  <TemplateCard key={tmpl.id} template={tmpl} selected={resume.template === tmpl.id}
                    locked={!isPremium} onClick={() => !isPremium ? null : setTemplate(tmpl.id)} />
                ))}
              </div>
              {!isPremium && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs text-amber-700 font-medium mb-1.5">Unlock all 50+ premium templates</p>
                  <Link to="/pricing" className="text-xs text-white bg-amber-500 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-600 transition-colors inline-flex items-center gap-1">
                    <Crown size={11} /> Upgrade Now
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template, selected, locked, onClick }) {
  return (
    <button onClick={onClick}
      className={`relative aspect-[3/4] rounded-lg border-2 overflow-hidden transition-all ${
        selected ? 'border-brand-600 shadow-md' : 'border-slate-200 hover:border-slate-300'
      } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
      {/* Template color preview */}
      <div className="w-full h-full flex flex-col" style={{ background: 'white' }}>
        <div className="h-6" style={{ background: template.color }} />
        <div className="flex-1 p-1.5 space-y-1">
          {[0.9, 0.6, 0.7, 0.5, 0.8, 0.4].map((w, i) => (
            <div key={i} className="h-1 rounded-full bg-slate-200" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
      {locked && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Crown size={14} className="text-amber-400" />
        </div>
      )}
      {selected && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 truncate">
        {template.name}
      </div>
    </button>
  );
}
