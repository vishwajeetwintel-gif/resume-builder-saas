import { create } from 'zustand';

const defaultResume = {
  id: null,
  title: 'My Resume',
  templateId: 'modern-1',
  personalInfo: {
    name: '', email: '', phone: '', linkedin: '', portfolio: '', location: '', photo: ''
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

const useStore = create((set, get) => ({
  // Auth
  user: null,
  token: localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Resume
  resume: { ...defaultResume },
  resumes: [],
  selectedTemplate: 'modern-1',
  
  updateResume: (field, value) => set(state => ({
    resume: { ...state.resume, [field]: value }
  })),
  
  updatePersonalInfo: (field, value) => set(state => ({
    resume: { ...state.resume, personalInfo: { ...state.resume.personalInfo, [field]: value } }
  })),

  addExperience: () => set(state => ({
    resume: {
      ...state.resume,
      experience: [...state.resume.experience, {
        id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '',
        current: false, responsibilities: [''], location: ''
      }]
    }
  })),

  updateExperience: (id, field, value) => set(state => ({
    resume: {
      ...state.resume,
      experience: state.resume.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }
  })),

  removeExperience: (id) => set(state => ({
    resume: { ...state.resume, experience: state.resume.experience.filter(e => e.id !== id) }
  })),

  addEducation: () => set(state => ({
    resume: {
      ...state.resume,
      education: [...state.resume.education, {
        id: Date.now().toString(), degree: '', institution: '', year: '', gpa: '', field: ''
      }]
    }
  })),

  updateEducation: (id, field, value) => set(state => ({
    resume: {
      ...state.resume,
      education: state.resume.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }
  })),

  removeEducation: (id) => set(state => ({
    resume: { ...state.resume, education: state.resume.education.filter(e => e.id !== id) }
  })),

  addProject: () => set(state => ({
    resume: {
      ...state.resume,
      projects: [...state.resume.projects, {
        id: Date.now().toString(), name: '', description: '', technologies: [], link: ''
      }]
    }
  })),

  updateProject: (id, field, value) => set(state => ({
    resume: {
      ...state.resume,
      projects: state.resume.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }
  })),

  removeProject: (id) => set(state => ({
    resume: { ...state.resume, projects: state.resume.projects.filter(p => p.id !== id) }
  })),

  addCertification: () => set(state => ({
    resume: {
      ...state.resume,
      certifications: [...state.resume.certifications, {
        id: Date.now().toString(), name: '', issuer: '', date: '', url: ''
      }]
    }
  })),

  updateCertification: (id, field, value) => set(state => ({
    resume: {
      ...state.resume,
      certifications: state.resume.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }
  })),

  removeCertification: (id) => set(state => ({
    resume: { ...state.resume, certifications: state.resume.certifications.filter(c => c.id !== id) }
  })),

  setTemplate: (templateId) => set(state => ({
    selectedTemplate: templateId,
    resume: { ...state.resume, templateId }
  })),

  loadResume: (resume) => set({ resume }),
  setResumes: (resumes) => set({ resumes }),
  resetResume: () => set({ resume: { ...defaultResume } }),

  // ATS
  atsScore: null,
  setAtsScore: (score) => set({ atsScore: score }),

  // UI
  activeStep: 0,
  setActiveStep: (step) => set({ activeStep: step }),
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen }))
}));

export default useStore;
