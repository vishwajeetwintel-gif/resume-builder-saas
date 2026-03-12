const express = require('express');
const router = express.Router();

const TEMPLATES = [
  // Modern templates
  { id: 'modern-1', name: 'Modern Pro', category: 'Modern', style: 'clean', premium: false, color: '#2563EB', preview: 'modern-1' },
  { id: 'modern-2', name: 'Modern Dark', category: 'Modern', style: 'dark-sidebar', premium: false, color: '#1E293B', preview: 'modern-2' },
  { id: 'modern-3', name: 'Modern Accent', category: 'Modern', style: 'accent-left', premium: true, color: '#7C3AED', preview: 'modern-3' },
  { id: 'modern-4', name: 'Modern Clean', category: 'Modern', style: 'minimal-border', premium: true, color: '#059669', preview: 'modern-4' },
  { id: 'modern-5', name: 'Modern Split', category: 'Modern', style: 'split-column', premium: true, color: '#DC2626', preview: 'modern-5' },

  // Professional templates
  { id: 'professional-1', name: 'Executive Classic', category: 'Professional', style: 'classic', premium: false, color: '#1F2937', preview: 'professional-1' },
  { id: 'professional-2', name: 'Corporate Blue', category: 'Professional', style: 'corporate', premium: false, color: '#1D4ED8', preview: 'professional-2' },
  { id: 'professional-3', name: 'Business Elite', category: 'Professional', style: 'elite', premium: true, color: '#92400E', preview: 'professional-3' },
  { id: 'professional-4', name: 'Senior Executive', category: 'Professional', style: 'senior', premium: true, color: '#374151', preview: 'professional-4' },
  { id: 'professional-5', name: 'Director Grade', category: 'Professional', style: 'director', premium: true, color: '#064E3B', preview: 'professional-5' },

  // Minimal templates
  { id: 'minimal-1', name: 'Clean Minimal', category: 'Minimal', style: 'ultra-clean', premium: false, color: '#6B7280', preview: 'minimal-1' },
  { id: 'minimal-2', name: 'White Space', category: 'Minimal', style: 'whitespace', premium: false, color: '#374151', preview: 'minimal-2' },
  { id: 'minimal-3', name: 'Sans Serif', category: 'Minimal', style: 'sans', premium: true, color: '#111827', preview: 'minimal-3' },
  { id: 'minimal-4', name: 'Mono Line', category: 'Minimal', style: 'monoline', premium: true, color: '#1F2937', preview: 'minimal-4' },
  { id: 'minimal-5', name: 'Simple Bold', category: 'Minimal', style: 'bold-minimal', premium: true, color: '#DC2626', preview: 'minimal-5' },

  // Executive templates
  { id: 'executive-1', name: 'C-Suite', category: 'Executive', style: 'csuite', premium: true, color: '#1E3A5F', preview: 'executive-1' },
  { id: 'executive-2', name: 'Leadership', category: 'Executive', style: 'leadership', premium: true, color: '#7F1D1D', preview: 'executive-2' },
  { id: 'executive-3', name: 'Board Level', category: 'Executive', style: 'board', premium: true, color: '#14532D', preview: 'executive-3' },
  { id: 'executive-4', name: 'VP Profile', category: 'Executive', style: 'vp', premium: true, color: '#1E1B4B', preview: 'executive-4' },
  { id: 'executive-5', name: 'Director Focus', category: 'Executive', style: 'director-focus', premium: true, color: '#3B0764', preview: 'executive-5' },

  // Creative templates
  { id: 'creative-1', name: 'Designer Portfolio', category: 'Creative', style: 'portfolio', premium: true, color: '#EC4899', preview: 'creative-1' },
  { id: 'creative-2', name: 'Artistic', category: 'Creative', style: 'artistic', premium: true, color: '#F59E0B', preview: 'creative-2' },
  { id: 'creative-3', name: 'Bold Creative', category: 'Creative', style: 'bold-creative', premium: true, color: '#10B981', preview: 'creative-3' },
  { id: 'creative-4', name: 'Color Block', category: 'Creative', style: 'color-block', premium: true, color: '#6366F1', preview: 'creative-4' },
  { id: 'creative-5', name: 'Magazine Style', category: 'Creative', style: 'magazine', premium: true, color: '#EF4444', preview: 'creative-5' },

  // Tech templates
  { id: 'tech-1', name: 'Developer Dark', category: 'Tech', style: 'dev-dark', premium: false, color: '#06B6D4', preview: 'tech-1' },
  { id: 'tech-2', name: 'Engineer Pro', category: 'Tech', style: 'engineer', premium: false, color: '#3B82F6', preview: 'tech-2' },
  { id: 'tech-3', name: 'Code Style', category: 'Tech', style: 'code', premium: true, color: '#10B981', preview: 'tech-3' },
  { id: 'tech-4', name: 'DevOps', category: 'Tech', style: 'devops', premium: true, color: '#F59E0B', preview: 'tech-4' },
  { id: 'tech-5', name: 'Full Stack', category: 'Tech', style: 'fullstack', premium: true, color: '#8B5CF6', preview: 'tech-5' },

  // Corporate templates
  { id: 'corporate-1', name: 'Corporate Standard', category: 'Corporate', style: 'standard', premium: false, color: '#1D4ED8', preview: 'corporate-1' },
  { id: 'corporate-2', name: 'Finance Pro', category: 'Corporate', style: 'finance', premium: false, color: '#166534', preview: 'corporate-2' },
  { id: 'corporate-3', name: 'Consulting', category: 'Corporate', style: 'consulting', premium: true, color: '#991B1B', preview: 'corporate-3' },
  { id: 'corporate-4', name: 'Banking', category: 'Corporate', style: 'banking', premium: true, color: '#1E3A5F', preview: 'corporate-4' },
  { id: 'corporate-5', name: 'Legal', category: 'Corporate', style: 'legal', premium: true, color: '#374151', preview: 'corporate-5' },

  // Academic templates
  { id: 'academic-1', name: 'Academic CV', category: 'Academic', style: 'academic-cv', premium: false, color: '#1D4ED8', preview: 'academic-1' },
  { id: 'academic-2', name: 'Research Pro', category: 'Academic', style: 'research', premium: false, color: '#6B21A8', preview: 'academic-2' },
  { id: 'academic-3', name: 'PhD Candidate', category: 'Academic', style: 'phd', premium: true, color: '#065F46', preview: 'academic-3' },
  { id: 'academic-4', name: 'Faculty', category: 'Academic', style: 'faculty', premium: true, color: '#1E3A5F', preview: 'academic-4' },
  { id: 'academic-5', name: 'Graduate', category: 'Academic', style: 'graduate', premium: true, color: '#7C2D12', preview: 'academic-5' },

  // Additional mixed templates to reach 50+
  { id: 'hybrid-1', name: 'Hybrid Modern', category: 'Modern', style: 'hybrid', premium: true, color: '#0EA5E9', preview: 'hybrid-1' },
  { id: 'hybrid-2', name: 'Infographic', category: 'Creative', style: 'infographic', premium: true, color: '#D946EF', preview: 'hybrid-2' },
  { id: 'entry-1', name: 'Entry Level', category: 'Professional', style: 'entry', premium: false, color: '#2563EB', preview: 'entry-1' },
  { id: 'entry-2', name: 'Fresh Graduate', category: 'Professional', style: 'fresh-grad', premium: false, color: '#16A34A', preview: 'entry-2' },
  { id: 'healthcare-1', name: 'Healthcare Pro', category: 'Corporate', style: 'healthcare', premium: true, color: '#0891B2', preview: 'healthcare-1' },
  { id: 'legal-1', name: 'Legal Eagle', category: 'Corporate', style: 'legal-eagle', premium: true, color: '#1E293B', preview: 'legal-1' },
  { id: 'sales-1', name: 'Sales Champion', category: 'Professional', style: 'sales', premium: true, color: '#EA580C', preview: 'sales-1' },
  { id: 'ux-1', name: 'UX Designer', category: 'Creative', style: 'ux', premium: true, color: '#7C3AED', preview: 'ux-1' },
  { id: 'pm-1', name: 'Product Manager', category: 'Tech', style: 'pm', premium: true, color: '#0369A1', preview: 'pm-1' },
  { id: 'data-1', name: 'Data Scientist', category: 'Tech', style: 'data-sci', premium: true, color: '#0F766E', preview: 'data-1' },
  { id: 'startup-1', name: 'Startup Founder', category: 'Executive', style: 'startup', premium: true, color: '#B45309', preview: 'startup-1' },
  { id: 'nonprofit-1', name: 'Non-Profit', category: 'Professional', style: 'nonprofit', premium: false, color: '#15803D', preview: 'nonprofit-1' }
];

router.get('/', (req, res) => {
  res.json(TEMPLATES);
});

router.get('/:id', (req, res) => {
  const template = TEMPLATES.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

module.exports = router;
