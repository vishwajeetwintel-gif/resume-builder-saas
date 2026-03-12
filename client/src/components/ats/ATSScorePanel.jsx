import React, { useState } from 'react';
import api from '../../utils/api';
import { resumeToText } from '../../utils/resumeText';
import useStore from '../../store/useStore';

function CircleScore({ score }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>/ 100</div>
      </div>
    </div>
  );
}

export default function ATSScorePanel() {
  const { resume, atsScore, setAtsScore } = useStore();
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('score');

  const checkATS = async () => {
    setLoading(true);
    try {
      const resumeText = resumeToText(resume);
      const res = await api.post('/ats/score', { resumeText, jobDescription: jobDesc });
      setAtsScore(res.data);
      setTab('score');
    } catch (err) {
      alert('ATS check failed: ' + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  const score = atsScore;
  const scoreColor = !score ? '#64748b' : score.total >= 80 ? '#22c55e' : score.total >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel = !score ? 'Not checked' : score.total >= 80 ? 'Excellent' : score.total >= 60 ? 'Good' : 'Needs Work';

  return (
    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>📊</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>ATS Score Checker</span>
          <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{scoreLabel}</span>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, background: '#f1f5f9', borderRadius: 8, padding: 3, marginBottom: 14 }}>
          {[{ key: 'score', label: '📊 Score' }, { key: 'match', label: '🎯 JD Match' }, { key: 'tips', label: '💡 Tips' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, background: tab === t.key ? 'white' : 'none', border: 'none', padding: '7px 4px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? '#1e3a8a' : '#64748b', boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'score' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <CircleScore score={score?.total || 0} />
            </div>
            {score?.breakdown && (
              <div>
                {Object.entries(score.breakdown).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{val.score}/{val.max}</span>
                    </div>
                    <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(val.score / val.max) * 100}%`, background: val.score / val.max >= 0.8 ? '#22c55e' : val.score / val.max >= 0.5 ? '#f59e0b' : '#ef4444', borderRadius: 3, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'match' && (
          <div>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the job description here to see keyword match..." style={{ width: '100%', height: 100, padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            {score?.matchedKeywords?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 6 }}>✓ Matched Keywords ({score.matchedKeywords.length})</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {score.matchedKeywords.slice(0, 12).map(k => (
                    <span key={k} style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '2px 7px', borderRadius: 10, fontSize: 10 }}>{k}</span>
                  ))}
                </div>
                {score.missingKeywords?.length > 0 && (
                  <>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>✗ Missing Keywords ({score.missingKeywords.length})</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {score.missingKeywords.slice(0, 12).map(k => (
                        <span key={k} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '2px 7px', borderRadius: 10, fontSize: 10 }}>{k}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'tips' && score?.suggestions && (
          <div>
            {score.suggestions.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, padding: '8px 10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
            {score?.actionVerbsFound?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Action Verbs Found:</p>
                <p style={{ fontSize: 11, color: '#22c55e' }}>{score.actionVerbsFound.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        <button onClick={checkATS} disabled={loading} style={{ width: '100%', marginTop: 14, background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '10px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '⏳ Analyzing...' : '🔍 Check ATS Score'}
        </button>
      </div>
    </div>
  );
}
