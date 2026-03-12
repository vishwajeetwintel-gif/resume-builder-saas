import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultResume = {
  id: null,
  title: 'My Resume',
  template: 'modern-1',
  personalInfo: {
    name: '', email: '', phone: '', linkedin: '',
    portfolio: '', location: '', profilePhoto: '', jobTitle: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: { technical: [], soft: [] },
  projects: [],
  certifications: [],
  languages: [],
  customSections: []
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resume: { ...defaultResume },
      savedResumes: [],
      atsScore: null,
      jobDescription: '',
      matchResult: null,
      currentStep: 0,

      // Resume updates
      updatePersonalInfo: (data) => set(s => ({
        resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...data } }
      })),
      updateSummary: (summary) => set(s => ({ resume: { ...s.resume, summary } })),
      setTemplate: (template) => set(s => ({ resume: { ...s.resume, template } })),

      // Experience
      addExperience: (exp) => set(s => ({
        resume: { ...s.resume, experience: [...s.resume.experience, { id: Date.now(), ...exp }] }
      })),
      updateExperience: (id, data) => set(s => ({
        resume: { ...s.resume, experience: s.resume.experience.map(e => e.id === id ? { ...e, ...data } : e) }
      })),
      deleteExperience: (id) => set(s => ({
        resume: { ...s.resume, experience: s.resume.experience.filter(e => e.id !== id) }
      })),
      reorderExperience: (items) => set(s => ({ resume: { ...s.resume, experience: items } })),

      // Education
      addEducation: (edu) => set(s => ({
        resume: { ...s.resume, education: [...s.resume.education, { id: Date.now(), ...edu }] }
      })),
      updateEducation: (id, data) => set(s => ({
        resume: { ...s.resume, education: s.resume.education.map(e => e.id === id ? { ...e, ...data } : e) }
      })),
      deleteEducation: (id) => set(s => ({
        resume: { ...s.resume, education: s.resume.education.filter(e => e.id !== id) }
      })),

      // Skills
      updateSkills: (skills) => set(s => ({ resume: { ...s.resume, skills: { ...s.resume.skills, ...skills } } })),
      addSkill: (type, skill) => set(s => ({
        resume: { ...s.resume, skills: { ...s.resume.skills, [type]: [...(s.resume.skills[type] || []), skill] } }
      })),
      removeSkill: (type, skill) => set(s => ({
        resume: { ...s.resume, skills: { ...s.resume.skills, [type]: s.resume.skills[type].filter(sk => sk !== skill) } }
      })),

      // Projects
      addProject: (proj) => set(s => ({
        resume: { ...s.resume, projects: [...s.resume.projects, { id: Date.now(), ...proj }] }
      })),
      updateProject: (id, data) => set(s => ({
        resume: { ...s.resume, projects: s.resume.projects.map(p => p.id === id ? { ...p, ...data } : p) }
      })),
      deleteProject: (id) => set(s => ({
        resume: { ...s.resume, projects: s.resume.projects.filter(p => p.id !== id) }
      })),

      // Certifications
      addCertification: (cert) => set(s => ({
        resume: { ...s.resume, certifications: [...s.resume.certifications, { id: Date.now(), ...cert }] }
      })),
      updateCertification: (id, data) => set(s => ({
        resume: { ...s.resume, certifications: s.resume.certifications.map(c => c.id === id ? { ...c, ...data } : c) }
      })),
      deleteCertification: (id) => set(s => ({
        resume: { ...s.resume, certifications: s.resume.certifications.filter(c => c.id !== id) }
      })),

      // Languages
      addLanguage: (lang) => set(s => ({
        resume: { ...s.resume, languages: [...s.resume.languages, { id: Date.now(), ...lang }] }
      })),
      deleteLanguage: (id) => set(s => ({
        resume: { ...s.resume, languages: s.resume.languages.filter(l => l.id !== id) }
      })),

      // Custom sections
      addCustomSection: (section) => set(s => ({
        resume: { ...s.resume, customSections: [...s.resume.customSections, { id: Date.now(), ...section }] }
      })),
      updateCustomSection: (id, data) => set(s => ({
        resume: { ...s.resume, customSections: s.resume.customSections.map(c => c.id === id ? { ...c, ...data } : c) }
      })),
      deleteCustomSection: (id) => set(s => ({
        resume: { ...s.resume, customSections: s.resume.customSections.filter(c => c.id !== id) }
      })),

      // ATS
      setATSScore: (score) => set({ atsScore: score }),
      setJobDescription: (jd) => set({ jobDescription: jd }),
      setMatchResult: (result) => set({ matchResult: result }),

      // Navigation
      setStep: (step) => set({ currentStep: step }),

      // Load resume
      loadResume: (resumeData) => set({ resume: { ...defaultResume, ...resumeData } }),

      // Reset
      resetResume: () => set({ resume: { ...defaultResume, id: null }, atsScore: null, matchResult: null }),
      newResume: () => set({ resume: { ...defaultResume }, currentStep: 0 }),

      // Title
      setTitle: (title) => set(s => ({ resume: { ...s.resume, title } }))
    }),
    {
      name: 'resume-builder-store',
      partialize: (state) => ({ resume: state.resume, savedResumes: state.savedResumes })
    }
  )
);

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (user) => set(s => ({ user: { ...s.user, ...user } })),
      logout: () => set({ user: null, token: null, isAuthenticated: false })
    }),
    { name: 'auth-store' }
  )
);
