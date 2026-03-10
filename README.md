<div align="center">

<img src="public/vite.svg" alt="SkillForge AI Logo" width="80" />

# SkillForge AI

### 🚀 AI-Powered Personalized Learning & Skill Development Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Appwrite](https://img.shields.io/badge/Appwrite-BaaS-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📖 About The Project

**SkillForge AI** is a full-stack, AI-powered learning platform designed to help users master technical domains at their own pace. It offers structured learning paths (domains & topics), AI-generated study materials, interactive assessments, project-based learning, and verifiable certificates — all managed through a clean and modern interface.

Whether you're a learner looking to level up your skills or an admin curating learning content, SkillForge AI has you covered.

---

## ✨ Key Features

### 👩‍🎓 For Learners
- **Personalized Dashboard** — Track streaks, XP, progress, leaderboard rank, and daily goals in one place
- **Structured Learning Paths** — Explore curated Domains → Topics → Notes → Projects
- **AI Learning Roadmap** — Auto-generate a full study roadmap based on your chosen domain
- **AI Topic Notes** — Generate concise, markdown-formatted notes for any topic instantly
- **AI Assessment Generator** — Create quizzes and tests on demand for any concept
- **AI Concept Explainer** — Get plain-language explanations for complex subjects
- **AI Doubt Clearing Sessions** — Interactive Q&A powered by AI to resolve doubts
- **AI Assistant** — A conversational companion available throughout the app
- **Interactive Assessments** — MCQ-based quizzes with instant grading and feedback
- **Project Submissions** — Submit projects for each topic and domain
- **Solar System Progress View** — A unique, animated visualization of domain progress
- **Certificates** — Earn and download auto-generated certificates on domain completion
- **Public Profile** — Share your learning achievements and earned certificates publicly
- **Study Materials** — Organized study resources per subject with doubt-clearing sessions
- **Leaderboard** — Compete with other learners on the platform

### 🛠️ For Admins
- **Content Management** — Create and manage Domains, Topics, Notes, Interview Questions, Assessments, and Projects
- **Platform Analytics** — View user growth charts, average scores, and platform-wide statistics
- **Content Health Monitor** — Audit and ensure content quality across the platform
- **Seed Data Tool** — Bulk-seed platform content for quick setup

---

## 🛠️ Tech Stack

### ⚛️ Frontend Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v19 | Core UI library with the latest concurrent features |
| **Vite** | v7 | Lightning-fast build tool and dev server |
| **React Router** | v7 | Client-side routing and nested layouts |

### 🎨 Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | v4 | Utility-first CSS framework |
| **Framer Motion** | v12 | Smooth animations and page transitions |
| **GSAP** | v3 | Advanced scroll-triggered and timeline animations |
| **Lucide React** | latest | Consistent icon set |
| **Radix UI** | various | Accessible headless UI components (Dialog, Tabs, Toast, Dropdown, etc.) |
| **Swiper** | v11 | Touch-friendly carousel/slider components |
| **canvas-confetti** | v1.9 | Celebration confetti effects on certificate earn |
| **tw-animate-css** | latest | Pre-built Tailwind animation utilities |

### 📊 Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **ECharts** | v6 | Rich, interactive charts for analytics |
| **echarts-for-react** | v3 | React wrapper for ECharts |
| **Recharts** | v3 | Declarative charting library for dashboards |

### 🗄️ Backend & Database (BaaS)

| Technology | Purpose |
|------------|---------|
| **Appwrite** | Full Backend-as-a-Service: Authentication, Database, Storage, Cloud Functions |
| **Appwrite Database** | NoSQL document database for all platform data (domains, topics, assessments, progress, certificates, etc.) |
| **Appwrite Storage** | File storage for project submissions and assets |
| **Appwrite Auth** | Email/password and OAuth (Google) authentication |
| **Appwrite Functions** | Serverless functions for AI API calls (Groq) |

### 🤖 AI Integration

| Technology | Purpose |
|------------|---------|
| **Groq API** | Ultra-fast LLM inference powering all AI features (notes, roadmaps, assessments, doubt clearing) |
| **Appwrite Functions** | Secure serverless proxy to call Groq API without exposing keys on the client |

### 🔄 State Management & Data Fetching

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | v5 | Lightweight global state management (auth store) |
| **TanStack Query** | v5 | Server-state management, caching, and background refetching |

### 📝 Content Rendering

| Technology | Purpose |
|------------|---------|
| **react-markdown** | Render AI-generated markdown content |
| **react-syntax-highlighter** | Syntax-highlighted code blocks in notes and AI responses |

### 🔔 Notifications

| Technology | Purpose |
|------------|---------|
| **React Toastify** | In-app toast notifications |
| **Sonner** | Lightweight, elegant toast notification system |

### 🚀 Deployment & DevOps

| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend hosting and deployment with CI/CD |
| **Appwrite Cloud** | Managed backend infrastructure (SGP region) |
| **ESLint** | Code linting and quality enforcement |

---

## 🗂️ Project Structure

```
skillforge-ai/
├── public/                     # Static assets
├── src/
│   ├── appwrite/               # All Appwrite service classes
│   │   ├── Account.services.js
│   │   ├── AppWriteTableDB.js
│   │   ├── AssessmentAttemptService.js
│   │   ├── CertificateService.js
│   │   ├── DomainProgressService.js
│   │   ├── ProjectSubmissionService.js
│   │   ├── PublicProfileService.js
│   │   └── ...more services
│   ├── components/
│   │   ├── ai/                 # AI-powered components
│   │   │   ├── AIAssessmentGenerator.jsx
│   │   │   ├── AIConceptExplainer.jsx
│   │   │   ├── AIFeedback.jsx
│   │   │   ├── AILearningRoadmap.jsx
│   │   │   └── AITopicNotes.jsx
│   │   ├── ui/                 # Reusable UI primitives (Radix-based)
│   │   ├── Sidebar.jsx
│   │   ├── Certificate.jsx
│   │   ├── SolarSystem.jsx     # Animated solar system progress view
│   │   └── AuthInitializer.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── PublicProfile.jsx
│   │   ├── user/               # All learner-facing pages
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── UserDomains.jsx
│   │   │   ├── UserTopicDetails.jsx
│   │   │   ├── AssessmentAttempt.jsx
│   │   │   ├── MyCertificates.jsx
│   │   │   ├── UserProgress.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── DoubtClearingSession.jsx
│   │   │   └── ...more pages
│   │   └── admin/              # Admin CMS pages
│   │       ├── Overview.jsx
│   │       ├── AllDomains.jsx
│   │       ├── PlatformStatsPage.jsx
│   │       ├── UserGrowthPage.jsx
│   │       └── ...more pages
│   ├── routes/                 # Route guards
│   │   ├── PrivateRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── store/
│   │   └── authStore.js        # Zustand auth state
│   ├── queries/                # TanStack Query hooks
│   ├── services/               # Business logic services
│   ├── utils/                  # Utility helpers
│   └── main.jsx                # App entry point with router config
├── appwrite-function/          # Appwrite serverless function (AI proxy)
├── .env                        # Environment variables
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- An **Appwrite** account ([cloud.appwrite.io](https://cloud.appwrite.io))
- A **Groq** API key ([console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillforge-ai.git
cd skillforge-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_PROJECT_NAME=your_project_name
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_DB_ID=your_database_id
VITE_APPWRITE_BUCKET_ID=your_storage_bucket_id
VITE_APPWRITE_Domains_TABLE_ID=domains
VITE_APPWRITE_TOPICS_TABLE_ID=topics
VITE_APPWRITE_TOPIC_NOTES_TABLE_ID=topicnotes
VITE_APPWRITE_INTERVIEW_QUESTIONS_TABLE_ID=interviewquestions
VITE_APPWRITE_AI_FUNCTION_ID=your_appwrite_function_id
GROK_API_KEY=your_groq_api_key
```

### 4. Set Up Appwrite

1. Create a new **Appwrite project**
2. Set up a **Database** with the required collections (domains, topics, topicnotes, assessments, etc.)
3. Create a **Storage Bucket** for file uploads
4. Deploy the **Appwrite Function** from the `appwrite-function/` folder for the AI proxy
5. Enable **Email/Password** and **Google OAuth** authentication providers

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add all environment variables from your `.env` file in the Vercel project settings
4. Deploy!

The `vercel.json` is configured to handle client-side routing correctly.


## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ using React, Appwrite & Groq AI

</div>
