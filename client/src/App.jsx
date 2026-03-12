import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import api from './utils/api';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BuilderPage from './pages/BuilderPage';
import TemplatesPage from './pages/TemplatesPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';

function PrivateRoute({ children }) {
  const token = useStore(s => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token, setAuth, logout } = useStore();

  useEffect(() => {
    if (token) {
      api.get('/auth/me').then(res => setAuth(res.data, token)).catch(() => logout());
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/builder" element={<PrivateRoute><BuilderPage /></PrivateRoute>} />
        <Route path="/builder/:id" element={<PrivateRoute><BuilderPage /></PrivateRoute>} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/payment/success" element={<PrivateRoute><PaymentPage success /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
