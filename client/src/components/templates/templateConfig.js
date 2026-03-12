export const TEMPLATES = [
  { id: 'modern-1', name: 'Modern Pro', category: 'Modern', component: 'TemplateModern', premium: false, color: '#2563eb', desc: 'Clean two-column with blue accents' },
  { id: 'minimal-1', name: 'Minimal Clean', category: 'Minimal', component: 'TemplateMinimal', premium: false, color: '#111', desc: 'Pure typography, no distractions' },
  { id: 'executive-1', name: 'Executive Gold', category: 'Executive', component: 'TemplateExecutive', premium: true, color: '#b8860b', desc: 'Gold accents for senior professionals' },
  { id: 'tech-1', name: 'Dev Dark', category: 'Tech', component: 'TemplateTech', premium: true, color: '#7c3aed', desc: 'Terminal-inspired for developers' },
  { id: 'modern-2', name: 'Modern Teal', category: 'Modern', component: 'TemplateModern', premium: false, color: '#0d9488', desc: 'Fresh teal modern layout' },
  { id: 'modern-3', name: 'Modern Purple', category: 'Modern', component: 'TemplateModern', premium: true, color: '#7c3aed', desc: 'Bold purple professional' },
  { id: 'minimal-2', name: 'Classic Simple', category: 'Minimal', component: 'TemplateMinimal', premium: false, color: '#374151', desc: 'Traditional clean format' },
  { id: 'executive-2', name: 'Corporate Navy', category: 'Corporate', component: 'TemplateExecutive', premium: true, color: '#1e3a8a', desc: 'Authoritative navy layout' },
  { id: 'tech-2', name: 'Code Green', category: 'Tech', component: 'TemplateTech', premium: true, color: '#22c55e', desc: 'Matrix-inspired for engineers' },
  { id: 'modern-4', name: 'Modern Red', category: 'Modern', component: 'TemplateModern', premium: false, color: '#dc2626', desc: 'Bold red for creative roles' },
  // Additional 40+ template configs
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `template-${i + 11}`,
    name: `Template ${i + 11}`,
    category: ['Modern','Minimal','Executive','Tech','Corporate','Academic','Creative'][i % 7],
    component: ['TemplateModern','TemplateMinimal','TemplateExecutive','TemplateTech'][i % 4],
    premium: i % 3 !== 0,
    color: ['#2563eb','#7c3aed','#0d9488','#dc2626','#b8860b','#111','#0f172a'][i % 7],
    desc: `Professional template ${i + 11}`
  }))
];

export const CATEGORIES = ['All', 'Modern', 'Minimal', 'Executive', 'Tech', 'Corporate', 'Academic', 'Creative'];
