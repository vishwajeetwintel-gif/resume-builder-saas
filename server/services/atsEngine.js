const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Industry keyword libraries
const INDUSTRY_KEYWORDS = {
  tech: ['javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes', 'api', 'sql', 'git',
    'agile', 'scrum', 'microservices', 'ci/cd', 'typescript', 'graphql', 'mongodb', 'redis', 'linux'],
  marketing: ['seo', 'sem', 'analytics', 'conversion', 'campaign', 'roi', 'brand', 'content', 'social media',
    'ppc', 'email marketing', 'hubspot', 'salesforce', 'crm', 'a/b testing', 'google analytics'],
  finance: ['financial analysis', 'excel', 'accounting', 'budgeting', 'forecasting', 'risk management',
    'gaap', 'ifrs', 'investment', 'portfolio', 'compliance', 'audit', 'quickbooks', 'tableau'],
  healthcare: ['patient care', 'clinical', 'hipaa', 'emr', 'ehr', 'diagnosis', 'treatment', 'nursing',
    'medical', 'pharmaceutical', 'research', 'fda', 'protocol', 'procedure'],
  business: ['strategy', 'leadership', 'management', 'operations', 'project management', 'stakeholder',
    'p&l', 'kpi', 'business development', 'negotiation', 'presentation', 'data analysis']
};

const ACTION_VERBS = [
  'achieved', 'improved', 'developed', 'managed', 'led', 'created', 'built', 'designed',
  'implemented', 'increased', 'reduced', 'launched', 'delivered', 'coordinated', 'optimized',
  'streamlined', 'executed', 'established', 'generated', 'transformed', 'accelerated',
  'spearheaded', 'orchestrated', 'pioneered', 'revamped', 'scaled', 'mentored', 'negotiated'
];

const extractTextFromResume = (resumeData) => {
  let text = '';
  if (resumeData.personalInfo) {
    text += `${resumeData.personalInfo.name} ${resumeData.personalInfo.email} `;
  }
  if (resumeData.summary) text += resumeData.summary + ' ';
  if (resumeData.experience) {
    resumeData.experience.forEach(exp => {
      text += `${exp.jobTitle} ${exp.company} `;
      exp.responsibilities?.forEach(r => text += r + ' ');
    });
  }
  if (resumeData.skills) {
    const s = resumeData.skills;
    text += [...(s.technical || []), ...(s.soft || [])].join(' ') + ' ';
  }
  if (resumeData.education) {
    resumeData.education.forEach(e => text += `${e.degree} ${e.institution} `);
  }
  if (resumeData.projects) {
    resumeData.projects.forEach(p => text += `${p.name} ${p.description} ${p.technologies?.join(' ')} `);
  }
  return text.toLowerCase();
};

const scoreKeywordMatch = (resumeText, jobDescription) => {
  if (!jobDescription) return { score: 70, matched: [], missing: [] };

  const jdTokens = tokenizer.tokenize(jobDescription.toLowerCase()).map(t => stemmer.stem(t));
  const resumeTokens = new Set(tokenizer.tokenize(resumeText).map(t => stemmer.stem(t)));

  const jdKeywords = [...new Set(jdTokens)].filter(t => t.length > 3);
  const matched = jdKeywords.filter(t => resumeTokens.has(t));
  const score = Math.min(100, Math.round((matched.length / Math.max(jdKeywords.length, 1)) * 100));

  return { score, matched: matched.slice(0, 15), missing: jdKeywords.filter(t => !resumeTokens.has(t)).slice(0, 10) };
};

const scoreFormatting = (resumeData) => {
  let score = 0;
  const checks = [];

  // Contact info check
  const hasEmail = !!resumeData.personalInfo?.email;
  const hasPhone = !!resumeData.personalInfo?.phone;
  const hasName = !!resumeData.personalInfo?.name;

  if (hasEmail) { score += 5; checks.push({ item: 'Email present', passed: true }); }
  else checks.push({ item: 'Add email address', passed: false });

  if (hasPhone) { score += 5; checks.push({ item: 'Phone present', passed: true }); }
  else checks.push({ item: 'Add phone number', passed: false });

  if (hasName) { score += 5; checks.push({ item: 'Name present', passed: true }); }

  // No images/tables (always pass for text format)
  score += 5; checks.push({ item: 'ATS-friendly format', passed: true });

  return { score: Math.min(15, score), checks };
};

const scoreSectionCompleteness = (resumeData) => {
  let score = 0;
  const sections = [];

  const check = (condition, name, points) => {
    if (condition) { score += points; sections.push({ section: name, complete: true }); }
    else sections.push({ section: name, complete: false, suggestion: `Add ${name} section` });
  };

  check(resumeData.summary && resumeData.summary.length > 50, 'Professional Summary', 3);
  check(resumeData.experience && resumeData.experience.length > 0, 'Work Experience', 4);
  check(resumeData.education && resumeData.education.length > 0, 'Education', 3);
  check(resumeData.skills && (resumeData.skills.technical?.length > 0 || resumeData.skills.soft?.length > 0), 'Skills', 3);
  check(resumeData.projects && resumeData.projects.length > 0, 'Projects', 2);

  return { score: Math.min(15, score), sections };
};

const scoreSkillsMatch = (resumeData, jobDescription, industry) => {
  let score = 10; // base
  const industryWords = INDUSTRY_KEYWORDS[industry?.toLowerCase()] || INDUSTRY_KEYWORDS.tech;
  const resumeText = extractTextFromResume(resumeData);
  const matched = industryWords.filter(kw => resumeText.includes(kw));

  score = Math.min(15, 5 + Math.round((matched.length / industryWords.length) * 10));
  return { score, matchedIndustryKeywords: matched };
};

const scoreReadability = (resumeData) => {
  let score = 5;
  const suggestions = [];
  const resumeText = extractTextFromResume(resumeData);

  // Check action verbs in experience
  const expText = resumeData.experience?.map(e => e.responsibilities?.join(' ')).join(' ').toLowerCase() || '';
  const verbsUsed = ACTION_VERBS.filter(v => expText.includes(v));
  if (verbsUsed.length >= 3) score += 5;
  else suggestions.push('Use more action verbs (achieved, improved, led, developed)');

  // Check for metrics/numbers
  const hasNumbers = /\d+%|\$[\d,]+|\d+\s*(years?|months?|users?|customers?|projects?)/i.test(expText);
  if (hasNumbers) score += 5;
  else suggestions.push('Add quantifiable achievements (e.g., "Increased sales by 30%")');

  return { score: Math.min(15, score), suggestions };
};

const calculateATSScore = (resumeData, jobDescription = '', industry = 'tech') => {
  const resumeText = extractTextFromResume(resumeData);

  const keywordResult = scoreKeywordMatch(resumeText, jobDescription);
  const formattingResult = scoreFormatting(resumeData);
  const completenessResult = scoreSectionCompleteness(resumeData);
  const skillsResult = scoreSkillsMatch(resumeData, jobDescription, industry);
  const readabilityResult = scoreReadability(resumeData);

  const weightedKeyword = Math.round(keywordResult.score * 0.4);
  const totalScore = Math.min(100,
    weightedKeyword +
    formattingResult.score +
    completenessResult.score +
    skillsResult.score +
    readabilityResult.score
  );

  return {
    totalScore,
    breakdown: {
      keywordMatch: { score: weightedKeyword, raw: keywordResult.score, weight: 40 },
      formatting: { score: formattingResult.score, weight: 15 },
      completeness: { score: completenessResult.score, weight: 15 },
      skillsMatch: { score: skillsResult.score, weight: 15 },
      readability: { score: readabilityResult.score, weight: 15 }
    },
    details: {
      matchedKeywords: keywordResult.matched,
      missingKeywords: keywordResult.missing,
      formattingChecks: formattingResult.checks,
      sections: completenessResult.sections,
      industryKeywords: skillsResult.matchedIndustryKeywords,
      readabilitySuggestions: readabilityResult.suggestions
    }
  };
};

const matchJobDescription = (resumeData, jobDescription) => {
  const resumeText = extractTextFromResume(resumeData);
  const jdWords = tokenizer.tokenize(jobDescription.toLowerCase());
  const resumeWords = new Set(tokenizer.tokenize(resumeText));

  // Extract meaningful keywords (longer words, remove common words)
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'will', 'with', 'this', 'that', 'have', 'from', 'they', 'been', 'their', 'has', 'more', 'who']);
  const jdKeywords = [...new Set(jdWords.filter(w => w.length > 3 && !stopWords.has(w)))];
  
  const matched = jdKeywords.filter(w => resumeWords.has(w));
  const missing = jdKeywords.filter(w => !resumeWords.has(w));
  const matchPercent = Math.round((matched.length / Math.max(jdKeywords.length, 1)) * 100);

  return {
    matchPercent,
    matched: matched.slice(0, 20),
    missing: missing.slice(0, 15),
    totalKeywords: jdKeywords.length
  };
};

module.exports = { calculateATSScore, matchJobDescription, extractTextFromResume };
