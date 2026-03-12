import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useStore from '../store/useStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useStore();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      setAuth(res.data.user, res.data.token);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f4ff, #faf5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 900 }}>R</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeAI Pro</span>
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
        <p style={{ color: '#64748b', marginBottom: 28, fontSize: 15 }}>Start building your perfect resume today</p>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
        <form onSubmit={submit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 8 characters' }
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>{f.label}</label>
              <input className="input" type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Free Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
