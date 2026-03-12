import React, { forwardRef } from 'react';
import TemplateModern from './TemplateModern';
import TemplateMinimal from './TemplateMinimal';
import TemplateExecutive from './TemplateExecutive';
import TemplateTech from './TemplateTech';

const TEMPLATE_MAP = {
  'modern-1': TemplateModern, 'modern-2': TemplateModern, 'modern-3': TemplateModern, 'modern-4': TemplateModern,
  'minimal-1': TemplateMinimal, 'minimal-2': TemplateMinimal, 'classic-1': TemplateMinimal,
  'executive-1': TemplateExecutive, 'executive-2': TemplateExecutive, 'corporate-1': TemplateExecutive,
  'tech-1': TemplateTech, 'tech-2': TemplateTech,
};

function getTemplate(templateId) {
  if (TEMPLATE_MAP[templateId]) return TEMPLATE_MAP[templateId];
  if (templateId?.includes('exec') || templateId?.includes('corporate')) return TemplateExecutive;
  if (templateId?.includes('tech') || templateId?.includes('code')) return TemplateTech;
  if (templateId?.includes('minimal') || templateId?.includes('classic')) return TemplateMinimal;
  return TemplateModern;
}

const ResumePreview = forwardRef(({ data, scale = 0.7, templateId }, ref) => {
  const Template = getTemplate(templateId || data?.templateId || 'modern-1');
  return (
    <div ref={ref} style={{ transformOrigin: 'top left', transform: `scale(${scale})`, width: 794, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: 2 }}>
      <Template data={data} scale={1} />
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
