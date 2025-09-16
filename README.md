# LifeCompass AI

AI-powered personalized career & skill guidance platform tailored for Indian students. Generate structured learning roadmaps, discover suitable career paths, analyze skill gaps, and interact with an AI Career Advisor backed by multi‑model intelligence (OpenRouter: DeepSeek R1, DeepSeek V3, Qwen 2.5 72B).

## 🚀 Overview
LifeCompass AI helps students move from confusion to clarity:
- Capture a basic student profile (interests, strengths, goals)
- Recommend relevant career paths
- Generate a 6‑month structured learning plan with project ideas
- Provide market insights (demand, salary ranges, locations)
- Offer AI chat for follow‑up questions (career guidance, interview prep, resume feedback)

## ✨ Key Features
- Personalized career recommendations (top 3–5 paths)
- 6‑Month learning roadmap with monthly milestones
- Market insight snapshots (demand, salary, growth, cities)
- AI Chat Advisor with model routing & fallback
- Resume improvement and mock interview prompts (extensible)
- Tailwind CSS responsive UI
- Hot reload via Vite + React 18 + TypeScript

## 🧠 AI Model Strategy (OpenRouter)
| Purpose | Primary Model | Description |
|---------|---------------|-------------|
| Structured analysis (roadmaps, deep guidance) | `deepseek/deepseek-r1` | Reasoning-focused, multi-step planning |
| Conversational flow | `deepseek/deepseek-v3` | Natural, empathetic explanations |
| Quick summaries / clarifications | `qwen/qwen-2.5-72b-instruct` | Fast, concise output |

Automatic fallback order + rate limiting + timeout handling are implemented in `src/utils/chatbotService.ts` + `src/utils/openRouterConfig.ts`.

## 🧩 Tech Stack
- React 18 + TypeScript
- Vite 7
- Tailwind CSS 3
- Lucide React Icons
- OpenRouter (multi-model LLM gateway)
- ESLint + TypeScript ESLint

## 📂 Project Structure
```
Lifecompass-ai/
├── src/
│  ├── App.tsx
│  ├── main.tsx
│  ├── index.css
│  ├── components/
│  │   ├── StudentProfileForm.tsx
│  │   ├── CareerRecommendations.tsx
│  │   └── ChatBot.tsx
│  ├── types/
│  │   └── StudentProfile.ts
│  └── utils/
│      ├── careerAnalysis.ts
│      ├── chatbotService.ts
│      └── openRouterConfig.ts
├── .env (NOT COMMITTED)
├── .env.example
├── OPENROUTER_SETUP.md
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔐 Environment Variables
Create a `.env` file (see `.env.example`):
```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_APP_NAME=LifeCompass-AI
VITE_APP_URL=http://localhost:5173

VITE_DEEPSEEK_R1_MODEL=deepseek/deepseek-r1
VITE_DEEPSEEK_V3_MODEL=deepseek/deepseek-v3
VITE_DEEPSEEK_QWEN_MODEL=qwen/qwen-2.5-72b-instruct

VITE_DEFAULT_MODEL=deepseek/deepseek-r1
VITE_FALLBACK_MODEL=deepseek/deepseek-v3
VITE_QUICK_MODEL=qwen/qwen-2.5-72b-instruct

VITE_R1_RATE_LIMIT=20
VITE_V3_RATE_LIMIT=60
VITE_QWEN_RATE_LIMIT=100

VITE_R1_TIMEOUT=30000
VITE_V3_TIMEOUT=15000
VITE_QWEN_TIMEOUT=10000

VITE_ENABLE_MODEL_SWITCHING=true
VITE_ENABLE_FALLBACK=true
VITE_DEBUG_MODE=false
```
> Never commit real API keys. `.env` is ignored via `.gitignore`.

## 🛠️ Scripts
| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run lint` | Run ESLint over project |
| `npm run build` | Production build (outputs `dist/`) |
| `npm run preview` | Preview production build locally |

## ▶️ Getting Started
```bash
# 1. Install deps
npm install

# 2. Copy env template
cp .env.example .env
# 3. Add your OpenRouter key to .env
# 4. Start dev server
npm run dev

# Open http://localhost:5173
```

## 💬 AI Chat Flow Summary
1. User sends message
2. Query classified (career guidance, roadmap, resume, quick summary, etc.)
3. Model selected via `OpenRouterModelConfig.selectModelForQuery()`
4. Rate/timeout checks performed
5. Request sent to OpenRouter `/chat/completions`
6. Fallback sequence attempted on failure
7. If all fail => mock response generator

## 🧪 Future Enhancements (Roadmap)
- [ ] Supabase user auth & persistence
- [ ] Save / export learning plans (PDF)
- [ ] Progress tracking dashboard
- [ ] Resume parsing & scoring
- [ ] Interview question generator (dynamic)
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Analytics (anonymous usage metrics)

## 🔒 Security & Privacy
- No credentials stored client-side beyond runtime access to API key (VITE_ prefix exposes it to browser; consider backend proxy for production).
- Avoid logging sensitive profile data in production.
- Add rate limiting & content filtering server-side for real deployment.

## 🧹 Code Quality
- ESLint + TypeScript strict patterns
- Clean separation of concerns (UI / logic / AI service)
- Mock fallback logic ensures resilience in offline/demo mode

## 📦 Production Build
```bash
npm run build
# Output in dist/
```

## 🚀 Deployment to Cloudflare Pages

### Method 1: GitHub Integration (Recommended)
1. **Push to GitHub** (already done):
   ```bash
   git add .
   git commit -m "Deploy to Cloudflare Pages"
   git push
   ```

2. **Setup Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect to **GitHub** and select `Lifecompass-ai` repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/` (leave empty)

3. **Add Environment Variables** in Cloudflare Pages dashboard:
   ```
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   VITE_APP_NAME=LifeCompass-AI
   VITE_APP_URL=https://your-site.pages.dev
   VITE_DEEPSEEK_R1_MODEL=deepseek/deepseek-r1
   VITE_DEEPSEEK_V3_MODEL=deepseek/deepseek-v3
   VITE_DEEPSEEK_QWEN_MODEL=qwen/qwen-2.5-72b-instruct
   VITE_DEFAULT_MODEL=deepseek/deepseek-r1
   VITE_FALLBACK_MODEL=deepseek/deepseek-v3
   VITE_QUICK_MODEL=qwen/qwen-2.5-72b-instruct
   VITE_R1_RATE_LIMIT=20
   VITE_V3_RATE_LIMIT=60
   VITE_QWEN_RATE_LIMIT=100
   VITE_R1_TIMEOUT=30000
   VITE_V3_TIMEOUT=15000
   VITE_QWEN_TIMEOUT=10000
   VITE_ENABLE_MODEL_SWITCHING=true
   VITE_ENABLE_FALLBACK=true
   VITE_DEBUG_MODE=false
   ```

4. **Deploy**: Cloudflare will automatically build and deploy on every push to main branch.

### Method 2: Direct Upload
```bash
# Build the project
npm run build

# Install Wrangler CLI (if not installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name lifecompass-ai
```

### Method 3: Drag & Drop
1. Build the project: `npm run build`
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Drag and drop the `dist/` folder

> **Note**: Methods 2 & 3 require manual environment variable setup in the Cloudflare dashboard.

You can also deploy to Netlify, Vercel, or any static host using the `dist/` folder.

## 📝 License
Currently unlicensed (all rights reserved by default). Add an OSS license (MIT / Apache-2.0) if you intend public reuse.

## 🙌 Contributing
Suggestions & improvements welcome. Open issues for feature requests or optimizations.

---
**LifeCompass AI** – Empowering students to choose confidently and grow strategically.
