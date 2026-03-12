const router = require('express').Router();
const jwt = require('jsonwebtoken');
const userStore = require('../services/userStore');
const { authenticate } = require('../middleware/auth');

const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, plan: user.plan },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '7d' }
);

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });
    const user = await userStore.createUser(email, password, name);
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userStore.findByEmail(email);
    if (!user || !(await userStore.verifyPassword(user, password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const user = await userStore.findByEmail(req.user.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, plan: user.plan });
});

module.exports = router;
