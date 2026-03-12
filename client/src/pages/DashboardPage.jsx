import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit3, Trash2, Download, Star, LogOut, User, BarChart2, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore, useResumeStore } from '../store/resumeStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { loadResume, newResume } = useResumeStore();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumes(data);
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes(r => r.filter(res => res.id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (resume) => {
    loadResume(resume);
    navigate(`/builder/${resume.id}`);
  };

  const handleNew = () => {
    newResume();
    navigate('/builder');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Signed out');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-slate-900">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-3">
            {user?.plan !== 'premium' && (
              <Link to="/pricing" className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors">
                <Crown size={12} /> Upgrade to Premium
              </Link>
            )}
            {user?.plan === 'premium' && (
              <span className="badge badge-blue"><Crown size={11} /> Premium</span>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={15} />
              <span className="font-medium hidden sm:block">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost text-red-500 hover:bg-red-50 text-xs">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <button onClick={handleNew} className="btn-primary">
            <Plus size={16} /> New Resume
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Plus, label: 'New Resume', action: handleNew, color: 'bg-brand-600 text-white' },
            { icon: FileText, label: 'Templates', link: '/templates', color: 'bg-purple-600 text-white' },
            { icon: BarChart2, label: 'ATS Checker', link: '/ats-checker', color: 'bg-green-600 text-white' },
            { icon: Star, label: 'Upgrade', link: '/pricing', color: 'bg-amber-500 text-white' }
          ].map(({ icon: Icon, label, action, link, color }) => (
            <div key={label} onClick={action} className="cursor-pointer">
              {link ? (
                <Link to={link} className={`card p-5 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow cursor-pointer`}>
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </Link>
              ) : (
                <div className={`card p-5 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow cursor-pointer`} onClick={action}>
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumes */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">My Resumes ({resumes.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={40} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No resumes yet. Create your first one!</p>
              <button onClick={handleNew} className="btn-primary">
                <Plus size={16} /> Create Resume
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {resumes.map(resume => (
                <div key={resume.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-surface-50 transition-colors cursor-pointer group"
                  onClick={() => handleEdit(resume)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-12 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-center">
                      <FileText size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{resume.title || 'Untitled Resume'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {resume.personalInfo?.name || 'No name'} · Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(resume)} className="btn-ghost text-xs">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={(e) => handleDelete(resume.id, e)} className="btn-ghost text-red-500 hover:bg-red-50 text-xs">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
