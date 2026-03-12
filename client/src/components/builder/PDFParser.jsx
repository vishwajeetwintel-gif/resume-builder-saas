import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../utils/api';
import useStore from '../../store/useStore';

export default function PDFParser({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const { loadResume, resume } = useStore();

  const onDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const res = await api.post('/parse/pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setParsed(res.data.data);
    } catch (err) {
      alert('Parse failed: ' + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const importData = () => {
    if (!parsed) return;
    loadResume({ ...resume, ...parsed, id: resume.id });
    onClose?.();
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, maxWidth: 480, width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>📄 Import Existing Resume</h3>
        {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>×</button>}
      </div>

      {!parsed ? (
        <>
          <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? '#2563eb' : '#cbd5e1'}`, borderRadius: 12, padding: 40, textAlign: 'center', background: isDragActive ? '#eff6ff' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}>
            <input {...getInputProps()} />
            {loading ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                <p style={{ color: '#64748b', fontWeight: 600 }}>Parsing your resume...</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📤</div>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>{isDragActive ? 'Drop it here!' : 'Drag & drop your PDF here'}</p>
                <p style={{ color: '#64748b', fontSize: 13 }}>or click to browse files</p>
                <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>Supports PDF up to 5MB</p>
              </>
            )}
          </div>
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 12, marginTop: 16 }}>
            <p style={{ fontSize: 12, color: '#0369a1', margin: 0 }}>
              ℹ️ We will extract your name, contact info, work experience, education, and skills automatically.
            </p>
          </div>
        </>
      ) : (
        <div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d', marginBottom: 8 }}>✅ Successfully Parsed!</p>
            <div style={{ fontSize: 12, color: '#374151' }}>
              <p style={{ margin: '4px 0' }}>👤 <strong>Name:</strong> {parsed.personalInfo?.name || 'Not found'}</p>
              <p style={{ margin: '4px 0' }}>📧 <strong>Email:</strong> {parsed.personalInfo?.email || 'Not found'}</p>
              <p style={{ margin: '4px 0' }}>💼 <strong>Experience entries:</strong> {parsed.experience?.length || 0}</p>
              <p style={{ margin: '4px 0' }}>🎓 <strong>Education entries:</strong> {parsed.education?.length || 0}</p>
              <p style={{ margin: '4px 0' }}>⚡ <strong>Skills found:</strong> {parsed.skills?.technical?.length || 0}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={importData} style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Import Data</button>
            <button onClick={() => setParsed(null)} style={{ padding: '12px 16px', background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' }}>Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
