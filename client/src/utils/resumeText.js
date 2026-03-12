export function resumeToText(resume) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resume;
  let text = '';
  if (personalInfo) {
    text += `${personalInfo.name}\n${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n${personalInfo.linkedin}\n\n`;
  }
  if (summary) text += `SUMMARY\n${summary}\n\n`;
  if (experience?.length) {
    text += 'EXPERIENCE\n';
    experience.forEach(e => {
      text += `${e.title} at ${e.company} | ${e.startDate} - ${e.current ? 'Present' : e.endDate}\n`;
      e.responsibilities?.forEach(r => { text += `• ${r}\n`; });
      text += '\n';
    });
  }
  if (education?.length) {
    text += 'EDUCATION\n';
    education.forEach(e => { text += `${e.degree} - ${e.institution} ${e.year}\n`; });
    text += '\n';
  }
  if (skills?.technical?.length || skills?.soft?.length) {
    text += `SKILLS\n${[...(skills.technical||[]), ...(skills.soft||[])].join(', ')}\n\n`;
  }
  if (projects?.length) {
    text += 'PROJECTS\n';
    projects.forEach(p => { text += `${p.name}: ${p.description}\nTech: ${p.technologies?.join(', ')}\n`; });
    text += '\n';
  }
  if (certifications?.length) {
    text += 'CERTIFICATIONS\n';
    certifications.forEach(c => { text += `${c.name} - ${c.issuer} (${c.date})\n`; });
  }
  return text;
}
