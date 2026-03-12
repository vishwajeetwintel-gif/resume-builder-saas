import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Crown, ArrowRight } from 'lucide-react';

export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const txnId = params.get('txnid') || params.get('token');

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-2">Your Premium subscription is now active.</p>
        {txnId && <p className="text-xs text-slate-400 mb-6">Transaction ID: {txnId}</p>}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Crown size={18} className="text-amber-600" />
            <span className="font-semibold text-amber-900">Premium Unlocked</span>
          </div>
          <p className="text-sm text-amber-700">You now have access to all 50+ templates, AI rewriting, and full ATS analytics.</p>
        </div>

        <div className="space-y-3">
          <Link to="/builder" className="btn-primary w-full justify-center">
            Build My Resume <ArrowRight size={16} />
          </Link>
          <Link to="/dashboard" className="btn-secondary w-full justify-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-red-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Payment Failed</h1>
        <p className="text-slate-500 mb-6">Your payment was not completed. No charges were made.</p>
        <div className="space-y-3">
          <Link to="/pricing" className="btn-primary w-full justify-center">Try Again</Link>
          <Link to="/dashboard" className="btn-secondary w-full justify-center">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
