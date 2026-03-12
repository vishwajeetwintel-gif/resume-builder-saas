const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const userStore = require('../services/userStore');

router.get('/', authenticate, (req, res) => {
  const resumes = userStore.getResumes(req.user.id);
  res.json(resumes);
});

router.get('/:id', authenticate, (req, res) => {
  const resume = userStore.getResume(req.user.id, req.params.id);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });
  res.json(resume);
});

router.post('/', authenticate, (req, res) => {
  const resume = userStore.saveResume(req.user.id, req.body);
  res.json(resume);
});

router.put('/:id', authenticate, (req, res) => {
  const resume = userStore.saveResume(req.user.id, { ...req.body, id: req.params.id });
  res.json(resume);
});

router.delete('/:id', authenticate, (req, res) => {
  userStore.deleteResume(req.user.id, req.params.id);
  res.json({ success: true });
});

module.exports = router;
