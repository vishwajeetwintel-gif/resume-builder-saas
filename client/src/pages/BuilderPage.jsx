import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useStore from '../store/useStore';
import api from '../utils/api';
import PersonalInfoForm from '../components/builder/PersonalInfoForm';
import SummaryForm from '../components/builder/SummaryForm';
import ExperienceForm from '../components/builder/ExperienceForm';
import EducationForm from '../components/builder/EducationForm';
import SkillsForm from '../components/builder/SkillsForm';
import ProjectsForm from '../components/builder/ProjectsForm';
import ResumePreview from '../components/templates/ResumePreview';
import ATSScorePanel from '../components/ats/ATSScorePanel';
import PDFParser from '../components/builder/PDFParser';
import { TEMPLATES } from '../components/templates/templateConfig';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: '👤', component: PersonalInfoForm },
  { id: 'summary', label: 'Summary', icon: '📝', component: SummaryForm },
  { id: 'experience', label: 'Experience', icon: '💼', component: ExperienceForm },
  { id: 'education', label: 'Education', icon: '🎓', component: EducationForm },
  { id: 'skills', label: 'Skills', icon: '⚡', component: SkillsForm },
  { id: 'projects', label: 'Projects', icon: '🚀', component: ProjectsForm },
];

export default function BuilderPage() {
  const { id } = useParams();
  const { resume, updateResume, setTemplate, selectedTemplate, user } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showParser, setShowParser] = useState(false);
  const [showATS, setShowATS] = useState(true);
  const previewRef = useRef(null);
  const nav = useNavigate();

  const saveResume = async () => {
    setSaving(true);
    try {
      const method = resume.id ? api.put : api.post;
      const url = resume.id ? `/resume/${resume.id}` : '/resume';
      await (resume.id ? api.put(url, resume) : api.post(url, resume));
    } catch (err) { console.error('Save failed'); }
    finally { setSaving(false); }
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const el = document.getElementById('resume-print-target');
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [794, 1122] });
      pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1122);
      pdf.save(`${resume.personalInfo?.name || 'resume'}-resume.pdf`);
    } catch (err) { alert('Export failed. Please try again.'); }
    finally { setExporting(false); }
  };

  const CurrentForm = STEPS[activeStep].component;

  const freeTemplates = TEMPLATES.filter(t => !t.premium).slice(0, 6);
  const allTemplates = user?.plan === 'premium' ? TEMPLATES : freeTemplates;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 14 }}>R</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeAI Pro</span>
        </Link>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <input value={resume.title || 'My Resume'} onChange={e => updateResume('title', e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#374151', background: 'transparent', width: 150 }} />
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setShowParser(true)} style={{ background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>📤 Import PDF</button>
          <button onClick={() => setShowTemplates(!showTemplates)} style={{ background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🎨 Templates</button>
          <button onClick={() => setShowATS(!showATS)} style={{ background: showATS ? '#eff6ff' : '#f1f5f9', color: showATS ? '#2563eb' : '#374151', border: `1px solid ${showATS ? '#bfdbfe' : '#e2e8f0'}`, padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>📊 ATS</button>
          <button onClick={saveResume} disabled={saving} style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{saving ? 'Saving...' : '💾 Save'}</button>
          <button onClick={exportPDF} disabled={exporting} style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>{exporting ? 'Exporting...' : '⬇ Download PDF'}</button>
        </div>
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', gap: 12, overflowX: 'auto' }}>
          {allTemplates.slice(0, 15).map(t => (
            <div key={t.id} onClick={() => { setTemplate(t.id); setShowTemplates(false); }} style={{ flexShrink: 0, cursor: 'pointer', textAlign: 'center', padding: 8, borderRadius: 10, border: `2px solid ${selectedTemplate === t.id ? '#2563eb' : '#e2e8f0'}`, background: selectedTemplate === t.id ? '#eff6ff' : 'white', transition: 'all 0.15s', minWidth: 90 }}>
              <div style={{ width: 70, height: 90, background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)`, borderRadius: 6, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${t.color}33` }}>
                <span style={{ fontSize: 20, color: t.color }}>📄</span>
              </div>
              <p style={{ fontSize: 10, fontWeight: 600, margin: 0, color: '#374151' }}>{t.name}</p>
              {t.premium && user?.plan !== 'premium' && <span style={{ fontSize: 9, color: '#f97316', fontWeight: 700 }}>⚡ PRO</span>}
            </div>
          ))}
          {user?.plan !== 'premium' && (
            <div onClick={() => nav('/payment')} style={{ flexShrink: 0, cursor: 'pointer', padding: 8, borderRadius: 10, border: '2px dashed #e2e8f0', background: '#faf5ff', minWidth: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: 20 }}>🔓</span>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', margin: '4px 0 0' }}>+40 More</p>
              <p style={{ fontSize: 9, color: '#94a3b8', margin: 0 }}>Upgrade to PRO</p>
            </div>
          )}
        </div>
      )}

      {/* Main Builder Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Steps + Form */}
        <div style={{ width: 380, flexShrink: 0, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
          {/* Step Nav */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', flexShrink: 0 }}>
            {STEPS.map((step, i) => (
              <button key={step.id} onClick={() => setActiveStep(i)} style={{ flex: '0 0 auto', padding: '10px 14px', border: 'none', borderBottom: `2px solid ${activeStep === i ? '#2563eb' : 'transparent'}`, background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: activeStep === i ? 700 : 500, color: activeStep === i ? '#2563eb' : '#64748b', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                <span>{step.icon}</span><span>{step.label}</span>
              </button>
            ))}
          </div>
          {/* Form Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            <CurrentForm />
          </div>
          {/* Step Nav Buttons */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
            <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: 7, cursor: activeStep === 0 ? 'not-allowed' : 'pointer', opacity: activeStep === 0 ? 0.5 : 1, fontSize: 13, fontWeight: 600, color: '#374151' }}>← Previous</button>
            <span style={{ fontSize: 12, color: '#94a3b8', alignSelf: 'center' }}>{activeStep + 1} / {STEPS.length}</span>
            <button onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} disabled={activeStep === STEPS.length - 1} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 7, cursor: activeStep === STEPS.length - 1 ? 'not-allowed' : 'pointer', opacity: activeStep === STEPS.length - 1 ? 0.5 : 1, fontSize: 13, fontWeight: 600 }}>Next →</button>
          </div>
        </div>

        {/* Center: Preview */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', justifyContent: 'center', background: '#f1f5f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: 600, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>LIVE PREVIEW</p>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>A4 • {resume.personalInfo?.name || 'Your resume'}</span>
              </div>
            </div>
            <div style={{ width: 555, height: 786, overflow: 'hidden', background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', borderRadius: 4 }}>
              <div style={{ transform: 'scale(0.699)', transformOrigin: 'top left', width: 794, height: 1122 }}>
                <div id="resume-print-target">
                  <ResumePreview data={resume} templateId={selectedTemplate} scale={1} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ATS Panel */}
        {showATS && (
          <div style={{ width: 280, flexShrink: 0, borderLeft: '1px solid #e2e8f0', padding: 16, overflowY: 'auto', background: 'white' }}>
            <ATSScorePanel />
          </div>
        )}
      </div>

      {/* PDF Parser Modal */}
      {showParser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <PDFParser onClose={() => setShowParser(false)} />
        </div>
      )}
    </div>
  );
}
