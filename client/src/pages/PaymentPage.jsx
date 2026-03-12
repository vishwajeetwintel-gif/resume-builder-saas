import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useStore from '../store/useStore';

export default function PaymentPage({ success }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [payuData, setPayuData] = useState(null);
  const [completed, setCompleted] = useState(success || false);
  const { user, setAuth, token } = useStore();
  const nav = useNavigate();

  useEffect(() => {
    if (success) {
      // Try to capture PayPal order from URL params
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('token');
      if (orderId) {
        api.post('/payment/paypal/capture-order', { orderId, plan: 'premium' })
          .then(() => { setCompleted(true); window.location.reload(); })
          .catch(console.error);
      }
    }
  }, [success]);

  const handlePayPal = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payment/paypal/create-order', { plan: 'premium' });
      const approveLink = res.data.links?.find(l => l.rel === 'approve');
      if (approveLink) {
        window.location.href = approveLink.href;
      } else {
        alert('PayPal order created. Order ID: ' + res.data.orderId);
      }
    } catch (err) {
      alert('PayPal Error: ' + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  const handlePayU = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payment/payu/initiate', { plan: 'premium', name: user?.name || 'User', email: user?.email || '', phone: '9999999999' });
      setPayuData(res.data);
      // Auto-submit PayU form
      setTimeout(() => {
        const form = document.getElementById('payuForm');
        if (form) form.submit();
      }, 100);
    } catch (err) {
      alert('PayU Error: ' + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  if (completed || user?.plan === 'premium') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}>
        <div style={{ textAlign: 'center', padding: 48, background: 'white', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', maxWidth: 440 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: '#15803d' }}>You're Premium!</h1>
          <p style={{ color: '#64748b', marginBottom: 28 }}>All features unlocked. Start building amazing resumes with AI.</p>
          <button onClick={() => nav('/builder')} style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Start Building →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f4ff, #faf5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 920, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Plan Details */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: 20, padding: 36, color: 'white' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Premium Plan</h2>
          <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 4 }}>$9.99</div>
          <p style={{ opacity: 0.8, marginBottom: 28 }}>per month · cancel anytime</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['50+ premium templates', 'AI bullet point rewriting', 'Professional summary improvement', 'Full ATS analysis & tips', 'Job description keyword matching', 'PDF resume parser', 'Unlimited resumes & exports'].map(f => (
              <li key={f} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: '#86efac', fontWeight: 700 }}>✓</span>
                <span style={{ opacity: 0.9 }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Form */}
        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Complete Purchase</h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Secure payment · Instant access</p>

          {/* Payment Method Selection */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Payment Method</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ id: 'paypal', label: 'PayPal', icon: '💳' }, { id: 'payu', label: 'PayU', icon: '🏦' }].map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ flex: 1, padding: '12px', border: `2px solid ${paymentMethod === m.id ? '#2563eb' : '#e2e8f0'}`, borderRadius: 10, background: paymentMethod === m.id ? '#eff6ff' : 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: paymentMethod === m.id ? '#2563eb' : '#374151', transition: 'all 0.15s' }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: '#374151' }}>Premium Plan (Monthly)</span>
              <span style={{ fontWeight: 700 }}>$9.99</span>
            </div>
            <div style={{ height: 1, background: '#e2e8f0', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#2563eb' }}>$9.99/mo</span>
            </div>
          </div>

          <button onClick={paymentMethod === 'paypal' ? handlePayPal : handlePayU} disabled={loading} style={{ width: '100%', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 12 }}>
            {loading ? '⏳ Processing...' : `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : 'PayU'} →`}
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
            🔒 256-bit SSL secured · Cancel anytime
          </p>

          {/* PayU Hidden Form */}
          {payuData && (
            <form id="payuForm" method="POST" action={payuData.action} style={{ display: 'none' }}>
              {Object.entries(payuData).filter(([k]) => k !== 'action').map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
