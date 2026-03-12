# ResumeAI Pro — AI-Powered Resume Builder SaaS

A production-ready, full-stack SaaS platform for building ATS-optimized resumes with AI assistance.

## 🚀 Features

- **AI Resume Rewriting** — GPT-4o-mini powered bullet point rewriting, summary improvement
- **ATS Score Checker** — Real-time scoring (0-100) with detailed breakdown
- **50+ Templates** — Modern, Minimal, Executive, Tech, Corporate, Academic styles
- **Job Description Matching** — Keyword extraction and match percentage
- **PDF Resume Parser** — Upload existing PDF to auto-fill the builder
- **Live Preview** — Real-time preview that updates as you type
- **PDF Export** — High-quality PDF download via jsPDF + html2canvas
- **PayPal & PayU Payments** — Full payment integration with plan upgrades
- **User Dashboard** — Save, edit, manage multiple resumes

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| State | Zustand |
| Backend | Node.js + Express |
| AI | OpenAI GPT-4o-mini |
| PDF | jsPDF + html2canvas + pdf-parse |
| Payments | PayPal REST API + PayU |
| Auth | JWT + bcrypt |
| NLP | natural + compromise |

## 📁 Project Structure

```
resume-builder-saas/
├── client/
│   └── src/
│       ├── components/
│       │   ├── builder/        # Form components
│       │   ├── templates/      # Resume templates
│       │   ├── ats/            # ATS score panel
│       │   └── ui/             # Shared UI
│       ├── pages/              # Route pages
│       ├── store/              # Zustand state
│       └── utils/              # API client + helpers
├── server/
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   └── middleware/             # Auth middleware
├── .env.example
└── README.md
```

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/resume-builder-saas
cd resume-builder-saas
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example server/.env
# Edit server/.env with your API keys
```

Required environment variables:
```env
OPENAI_API_KEY=your_openai_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
PAYPAL_MODE=sandbox
PAYU_KEY=your_payu_key
PAYU_SALT=your_payu_salt
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 3. Start Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 💳 Payment Configuration

### PayPal (Sandbox → Production)

1. Go to https://developer.paypal.com
2. Create a sandbox app to get Client ID + Secret
3. For production, change `PAYPAL_MODE=live`

### PayU

1. Register at https://payu.in
2. Get your Key and 32-bit Salt from dashboard
3. Update `PAYU_KEY` and `PAYU_SALT` in .env

## 🚀 Deployment

### Render (Backend)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add all environment variables

### Vercel / Netlify (Frontend)

1. Connect GitHub repo
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` environment variable pointing to your Render backend

### Update API URL for Production

In `client/src/utils/api.js`, update the baseURL:
```js
const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api' 
});
```

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | /api/auth/register | - | Register user |
| POST | /api/auth/login | - | Login user |
| GET | /api/auth/me | ✓ | Get current user |
| GET | /api/resume | ✓ | List resumes |
| POST | /api/resume | ✓ | Save resume |
| PUT | /api/resume/:id | ✓ | Update resume |
| DELETE | /api/resume/:id | ✓ | Delete resume |
| POST | /api/ai/rewrite-bullet | ✓ Premium | AI rewrite bullet |
| POST | /api/ai/improve-summary | ✓ Premium | AI improve summary |
| POST | /api/ai/generate-bullets | ✓ Premium | AI generate bullets |
| POST | /api/ats/score | ✓ | Get ATS score |
| POST | /api/ats/keywords | ✓ | Extract JD keywords |
| POST | /api/parse/pdf | ✓ | Parse PDF resume |
| POST | /api/payment/paypal/create-order | ✓ | Create PayPal order |
| POST | /api/payment/paypal/capture-order | ✓ | Capture PayPal payment |
| POST | /api/payment/payu/initiate | ✓ | Initiate PayU payment |

## 📦 Production Notes

- Replace in-memory user/resume store with MongoDB or PostgreSQL
- Add Redis for session caching
- Use S3 for photo storage
- Enable HTTPS in production
- Add email verification
- Add webhook for PayPal IPN

## 📄 License

MIT
