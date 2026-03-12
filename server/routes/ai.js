const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const checkPremium = (req, res, next) => {
  if (req.user.plan !== 'premium') {
    return res.status(403).json({ error: 'Premium subscription required for AI features' });
  }
  next();
};

router.post('/rewrite-bullet', authenticate, checkPremium, async (req, res) => {
  try {
    const { bullet, jobTitle, industry } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Rewrite this resume bullet point to be more impactful, ATS-optimized, and quantifiable for a ${jobTitle || 'professional'} in ${industry || 'tech'}. Use strong action verbs. Keep it under 2 lines. Return ONLY the rewritten bullet point.\n\nOriginal: ${bullet}`
      }],
      max_tokens: 150,
      temperature: 0.7
    });
    res.json({ result: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/improve-summary', authenticate, checkPremium, async (req, res) => {
  try {
    const { summary, jobTitle, skills, targetRole } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Rewrite this professional summary to be compelling, ATS-friendly, and tailored for a ${jobTitle}. Target role: ${targetRole || jobTitle}. Key skills: ${skills?.join(', ')}. Keep it 3-4 sentences. Return ONLY the improved summary.\n\nOriginal: ${summary}`
      }],
      max_tokens: 200,
      temperature: 0.7
    });
    res.json({ result: completion.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate-bullets', authenticate, checkPremium, async (req, res) => {
  try {
    const { jobTitle, company, description } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Generate 4 strong ATS-optimized resume bullet points for a ${jobTitle} at ${company || 'a company'}. Context: ${description || ''}. Use action verbs and include metrics where possible. Return as JSON array of strings.`
      }],
      max_tokens: 400,
      temperature: 0.8
    });
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content.trim());
    } catch {
      result = completion.choices[0].message.content.trim().split('\n').filter(l => l.trim());
    }
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/optimize-keywords', authenticate, checkPremium, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Analyze this resume against the job description. Return JSON with: { "missingKeywords": [], "suggestions": [], "optimizedSections": {} }\n\nResume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
      }],
      max_tokens: 500,
      temperature: 0.5
    });
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content.trim());
    } catch {
      result = { missingKeywords: [], suggestions: [completion.choices[0].message.content] };
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tailor-resume', authenticate, checkPremium, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Tailor this resume summary and skills section for the job description. Return JSON: { "summary": "...", "skills": [], "tips": [] }\n\nResume Summary: ${resumeData.summary}\nCurrent Skills: ${resumeData.skills?.join(', ')}\n\nJob Description: ${jobDescription}`
      }],
      max_tokens: 600,
      temperature: 0.6
    });
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content.trim());
    } catch {
      result = { summary: resumeData.summary, skills: resumeData.skills, tips: [] };
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
