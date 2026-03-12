const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const natural = require('natural');

const INDUSTRY_KEYWORDS = {
  tech: ['javascript','python','react','node','aws','docker','kubernetes','ci/cd','agile','api','sql','git','typescript','machine learning','cloud','microservices','devops','rest','graphql','mongodb'],
  marketing: ['seo','sem','google analytics','social media','content marketing','email marketing','crm','conversion rate','a/b testing','branding','digital marketing','ppc','roi','kpi','campaign'],
  finance: ['financial analysis','excel','sql','bloomberg','portfolio management','risk assessment','gaap','ifrs','budgeting','forecasting','accounting','cfa','audit','compliance','derivatives'],
  healthcare: ['patient care','emr','hipaa','clinical','diagnosis','medical records','healthcare administration','nursing','pharmacology','icd-10','cpt','epic','ehr'],
  business: ['project management','stakeholder','strategic planning','p&l','operations','leadership','cross-functional','business development','negotiation','pmp','six sigma','lean','kpi']
};

const ACTION_VERBS = ['achieved','built','created','delivered','developed','drove','executed','generated','improved','increased','launched','led','managed','optimized','reduced','saved','scaled','transformed'];

function calculateATS(resumeText, jobDescription = '') {
  const text = resumeText.toLowerCase();
  const words = text.split(/\s+/);
  
  // Keyword match (40 pts)
  let keywordScore = 0;
  let matchedKeywords = [], missingKeywords = [];
  if (jobDescription) {
    const jdWords = new Set(jobDescription.toLowerCase().match(/\b\w{4,}\b/g) || []);
    const resumeWords = new Set(words);
    jdWords.forEach(w => {
      if (resumeWords.has(w)) matchedKeywords.push(w);
      else missingKeywords.push(w);
    });
    keywordScore = Math.min(40, Math.round((matchedKeywords.length / Math.max(jdWords.size, 1)) * 40));
  } else {
    keywordScore = 20;
  }

  // Formatting (15 pts)
  const hasEmail = /[\w.]+@[\w.]+\.\w+/.test(text);
  const hasPhone = /[\d\s\-\+\(\)]{10,}/.test(text);
  const hasLinkedIn = /linkedin/.test(text);
  const formattingScore = Math.min(15, [hasEmail, hasPhone, hasLinkedIn].filter(Boolean).length * 5);

  // Section completeness (15 pts)
  const sections = ['experience','education','skills','summary','objective'];
  const foundSections = sections.filter(s => text.includes(s));
  const sectionScore = Math.round((foundSections.length / sections.length) * 15);

  // Skills match (15 pts)  
  const allKeywords = Object.values(INDUSTRY_KEYWORDS).flat();
  const skillMatches = allKeywords.filter(k => text.includes(k));
  const skillScore = Math.min(15, Math.round((skillMatches.length / 10) * 15));

  // Readability (15 pts)
  const actionVerbCount = ACTION_VERBS.filter(v => text.includes(v)).length;
  const bulletPoints = (resumeText.match(/•|-|\*/g) || []).length;
  const hasMetrics = /\d+%|\$\d+|\d+\s*(million|thousand|k\b)/.test(text);
  const readabilityScore = Math.min(15, [
    actionVerbCount >= 3 ? 5 : Math.round(actionVerbCount * 1.5),
    bulletPoints >= 5 ? 5 : Math.round(bulletPoints),
    hasMetrics ? 5 : 0
  ].reduce((a, b) => a + b, 0));

  const total = keywordScore + formattingScore + sectionScore + skillScore + readabilityScore;

  const suggestions = [];
  if (keywordScore < 30) suggestions.push('Add more industry-relevant keywords from the job description');
  if (!hasMetrics) suggestions.push('Include quantifiable achievements (e.g., "Increased sales by 35%")');
  if (actionVerbCount < 3) suggestions.push('Start bullet points with strong action verbs (e.g., Led, Built, Achieved)');
  if (!hasLinkedIn) suggestions.push('Add your LinkedIn profile URL');
  if (bulletPoints < 5) suggestions.push('Use bullet points to improve ATS parsing');
  if (missingKeywords.length > 0) suggestions.push(`Add missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);

  return {
    total: Math.min(100, total),
    breakdown: {
      keywordMatch: { score: keywordScore, max: 40 },
      formatting: { score: formattingScore, max: 15 },
      sectionCompleteness: { score: sectionScore, max: 15 },
      skillsMatch: { score: skillScore, max: 15 },
      readability: { score: readabilityScore, max: 15 }
    },
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    suggestions,
    actionVerbsFound: ACTION_VERBS.filter(v => text.includes(v))
  };
}

router.post('/score', authenticate, (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText) return res.status(400).json({ error: 'Resume text required' });
    const result = calculateATS(resumeText, jobDescription);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/keywords', authenticate, (req, res) => {
  try {
    const { jobDescription, industry = 'tech' } = req.body;
    const jdLower = jobDescription.toLowerCase();
    const industryKws = INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS.tech;
    const matched = industryKws.filter(k => jdLower.includes(k));
    const jdWords = [...new Set(jdLower.match(/\b[a-z]{4,}\b/g) || [])].filter(w => !['this','that','with','have','from','they','their','will','been','were','more'].includes(w));
    res.json({ industryKeywords: matched, allKeywords: jdWords.slice(0, 50), industry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
