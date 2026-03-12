require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/ai', aiLimiter, require('./routes/ai'));
app.use('/api/ats', require('./routes/ats'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/parse', require('./routes/parser'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Resume Builder Server running on port ${PORT}`));
