const router = require('express').Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { authenticate } = require('../middleware/auth');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

function extractEmail(text) {
  const match = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const match = text.match(/(\+?\d[\d\s\-\(\)]{9,}\d)/);
  return match ? match[0].trim() : '';
}

function extractName(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    if (line.length > 3 && line.length < 50 && /^[A-Za-z\s.'-]+$/.test(line) && !line.toLowerCase().includes('@')) {
      return line;
    }
  }
  return lines[0] || '';
}

function extractSkills(text) {
  const skillKeywords = ['javascript','python','react','node','angular','vue','java','c++','c#','php','ruby','swift','kotlin','go','rust','sql','mongodb','postgresql','mysql','aws','azure','gcp','docker','kubernetes','git','agile','scrum','machine learning','deep learning','tensorflow','pytorch','excel','word','powerpoint','photoshop','figma','sketch'];
  return skillKeywords.filter(skill => text.toLowerCase().includes(skill));
}

function extractLinkedIn(text) {
  const match = text.match(/linkedin\.com\/in\/[\w-]+/i);
  return match ? `https://${match[0]}` : '';
}

function parseExperience(text) {
  const expSection = text.match(/(?:experience|work history|employment)([\s\S]*?)(?:education|skills|projects|$)/i);
  if (!expSection) return [];
  const blocks = expSection[1].split(/\n{2,}/);
  return blocks.slice(0, 5).filter(b => b.trim().length > 20).map((block, i) => {
    const lines = block.split('\n').filter(Boolean);
    return {
      id: `exp_${i}`,
      title: lines[0] || 'Position',
      company: lines[1] || 'Company',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: lines.slice(2).filter(l => l.trim().length > 10).map(l => l.trim().replace(/^[-•*]\s*/, ''))
    };
  });
}

function parseEducation(text) {
  const eduSection = text.match(/education([\s\S]*?)(?:experience|skills|projects|$)/i);
  if (!eduSection) return [];
  const blocks = eduSection[1].split(/\n{2,}/);
  return blocks.slice(0, 3).filter(b => b.trim().length > 10).map((block, i) => {
    const lines = block.split('\n').filter(Boolean);
    return {
      id: `edu_${i}`,
      degree: lines[0] || 'Degree',
      institution: lines[1] || 'Institution',
      year: (lines[2] || '').match(/\d{4}/)?.[0] || '',
      gpa: (block.match(/gpa:?\s*([\d.]+)/i) || [])[1] || ''
    };
  });
}

router.post('/pdf', authenticate, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const data = await pdfParse(req.file.buffer);
    const text = data.text;
    
    const parsed = {
      personalInfo: {
        name: extractName(text),
        email: extractEmail(text),
        phone: extractPhone(text),
        linkedin: extractLinkedIn(text),
        location: '',
        portfolio: ''
      },
      summary: '',
      experience: parseExperience(text),
      education: parseEducation(text),
      skills: { technical: extractSkills(text), soft: [] },
      rawText: text.slice(0, 2000)
    };

    const summaryMatch = text.match(/(?:summary|objective|profile)([\s\S]*?)(?:\n{2,}|experience|education)/i);
    if (summaryMatch) parsed.summary = summaryMatch[1].trim().slice(0, 300);

    res.json({ success: true, data: parsed, pageCount: data.numpages });
  } catch (err) {
    res.status(500).json({ error: `Parse failed: ${err.message}` });
  }
});

module.exports = router;
