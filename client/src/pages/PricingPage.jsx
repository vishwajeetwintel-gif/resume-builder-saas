import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#64748b',
    features: ['3 resume templates', 'Basic ATS score', 'PDF export', '1 saved resume', 'Basic builder'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    color: '#2563eb',
    features: ['50+ premium templates', 'Full AI rewriting (GPT-4)', 'Advanced ATS analysis', 'Job description matching', 'Unlimited saved resumes', 'Unlimited PDF exports', 'PDF resume parser', 'Priority support'],
    cta: 'Upgrade Now',
    popular: true
  }
];

export default function PricingPage() {
  const { user } = useStore();
  const nav = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f4ff, #faf5ff)' }}>
      <nav style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 16 }}>R</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ResumeAI Pro</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            {user ? <Link to="/dashboard" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link> : <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 5%', textAlign: 'center' }}>
        <h1 style={{ fontSize: 44, fontWeight: 900, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Simple, Transparent Pricing</h1>
        <p style={{ color: '#64748b', fontSize: 17, marginBottom: 50 }}>Invest in your career. Cancel anytime.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 700, margin: '0 auto' }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: 'white', borderRadius: 20, padding: '32px 28px', border: plan.popular ? '2px solid #2563eb' : '1px solid #e2e8f0', position: 'relative', boxShadow: plan.popular ? '0 8px 32px rgba(37,99,235,0.15)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.2s' }}>
              {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>MOST POPULAR</div>}
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{plan.name}</h2>
              <div style={{ fontSize: 42, fontWeight: 900, color: plan.color, marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>{plan.price}</div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>{plan.period}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', textAlign: 'left' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0, fontSize: 16 }}>✓</span>
                    <span style={{ color: '#374151' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => {
                if (plan.name === 'Free') { user ? nav('/dashboard') : nav('/register'); }
                else { user ? nav('/payment') : nav('/register'); }
              }} style={{ width: '100%', background: plan.popular ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'white', color: plan.popular ? 'white' : '#374151', border: plan.popular ? 'none' : '1.5px solid #e2e8f0', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                {plan.cta} {plan.popular ? '→' : ''}
              </button>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, color: '#94a3b8', fontSize: 13 }}>
          🔒 Secure payment via PayPal & PayU · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}
