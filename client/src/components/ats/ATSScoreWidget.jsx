import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BarChart2, RefreshCw, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip);

const getScoreColor = (score) => {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#EF4444';
  return '#DC2626';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

export default function ATSScoreWidget() {
  const { resume, atsScore, setATSScore, jobDescription, setJobDescription, matchResult, setMatchResult } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [industry, setIndustry] = useState('tech');
  const [showDetails, setShowDetails] = useState(false);

  const checkScore = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ats/score', {
        resumeData: resume, jobDescription, industry
      });
      setATSScore(data);
      toast.success(`ATS Score: ${data.totalScore}/100`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  const matchJD = async () => {
    if (!jobDescription.trim()) { toast.error('Paste a job description first'); return; }
    setMatchLoading(true);
    try {
      const { data } = await api.post('/ats/match', { resumeData: resume, jobDescription });
      setMatchResult(data);
    } catch {
      toast.error('Match failed');
    } finally {
      setMatchLoading(false);
    }
  };

  const score = atsScore?.totalScore || 0;
  const color = getScoreColor(score);

  const chartData = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [color, '#E2E8F0'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart2 size={16} className="text-brand-600" />
        <h3 className="font-semibold text-slate-900 text-sm">ATS Score Checker</h3>
      </div>

      {/* Industry selector */}
      <div>
        <label className="label text-xs">Industry</label>
        <select value={industry} onChange={e => setIndustry(e.target.value)} className="input text-sm py-2">
          {['tech', 'marketing', 'finance', 'healthcare', 'business'].map(ind => (
            <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Score display */}
      {atsScore && (
        <div className="card p-4">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <Doughnut data={chartData} options={{ responsive: true, plugins: { tooltip: { enabled: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold" style={{ color }}>{score}</span>
                <span className="text-[9px] text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg" style={{ color }}>{score}</span>
                <span className="badge" style={{ background: `${color}22`, color }}>{getScoreLabel(score)}</span>
              </div>

              {/* Score breakdown bars */}
              {atsScore.breakdown && Object.entries(atsScore.breakdown).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] text-slate-400 w-20 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${(val.score / val.weight) * 100}%`, background: color }} />
                  </div>
                  <span className="text-[9px] text-slate-500 w-8 text-right">{val.score}/{val.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Show/hide details */}
          <button onClick={() => setShowDetails(!showDetails)} className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700">
            {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showDetails ? 'Hide' : 'Show'} Suggestions
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2">
              {atsScore.details?.readabilitySuggestions?.map((s, i) => (
                <div key={i} className="flex gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
                  <span>💡</span> <span>{s}</span>
                </div>
              ))}
              {atsScore.details?.sections?.filter(s => !s.complete).map((s, i) => (
                <div key={i} className="flex gap-2 text-xs text-red-700 bg-red-50 p-2 rounded-lg">
                  <XCircle size={12} className="mt-0.5 shrink-0" /> <span>{s.suggestion}</span>
                </div>
              ))}
              {atsScore.details?.sections?.filter(s => s.complete).map((s, i) => (
                <div key={i} className="flex gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg">
                  <CheckCircle size={12} className="mt-0.5 shrink-0" /> <span>{s.section} section complete</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button onClick={checkScore} disabled={loading} className="btn-primary w-full justify-center text-xs py-2.5">
        {loading ? <RefreshCw size={14} className="animate-spin" /> : <BarChart2 size={14} />}
        {loading ? 'Analyzing...' : 'Check ATS Score'}
      </button>

      {/* Job Description Matcher */}
      <div className="border-t border-slate-100 pt-4">
        <label className="label text-xs">Job Description Match</label>
        <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste job description here to check keyword match..." rows={4} className="input text-xs resize-none mb-2" />
        <button onClick={matchJD} disabled={matchLoading} className="btn-secondary w-full justify-center text-xs py-2">
          {matchLoading ? 'Matching...' : 'Match Keywords'}
        </button>

        {matchResult && (
          <div className="mt-3 p-3 bg-surface-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900">Match: {matchResult.matchPercent}%</span>
              <div className="w-20 h-2 bg-slate-200 rounded-full">
                <div className="h-2 bg-brand-600 rounded-full" style={{ width: `${matchResult.matchPercent}%` }} />
              </div>
            </div>
            {matchResult.matched?.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] text-green-600 font-medium mb-1">✅ Matched ({matchResult.matched.length})</p>
                <div className="flex flex-wrap gap-1">
                  {matchResult.matched.slice(0, 12).map(k => (
                    <span key={k} className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[9px]">{k}</span>
                  ))}
                </div>
              </div>
            )}
            {matchResult.missing?.length > 0 && (
              <div>
                <p className="text-[10px] text-red-600 font-medium mb-1">❌ Missing ({matchResult.missing.length})</p>
                <div className="flex flex-wrap gap-1">
                  {matchResult.missing.slice(0, 10).map(k => (
                    <span key={k} className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[9px]">{k}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
