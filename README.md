# 💎 SmartFinance - Modern AI-Powered Web Client

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.0-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://vercel.com/)

**SmartFinance** is a high-performance, premium Single Page Application (SPA) designed to revolutionize personal finance management. Built with **React 19** and **Vite**, it features a sophisticated dashboard, real-time data visualization, and an interactive **AI Financial Advisor** powered by Google Gemini.

---

## 🌟 Overview

This web client serves as the interactive bridge between users and the SmartFinance ecosystem. It follows a **cloud-native, modular architecture** focusing on exceptional User Experience (UX) and robust security. The application leverages modern frontend paradigms to ensure seamless state synchronization, high responsiveness, and professional aesthetics.

---

## 🚀 Key Features & UX Highlights

### 🧠 AI Financial Advisor
- **Interactive Insights**: Real-time financial analysis using Google Gemini.
- **Contextual Chat**: Ask follow-up questions about your spending habits with a "typing effect" interface.
- **Data-Driven Advice**: AI analyzes categorized transactions to provide actionable savings tips.

### 🛡️ Enterprise-Grade Security
- **Silent Token Refresh**: Sophisticated **Axios Interceptors** manage JWT lifecycle automatically, handling 401 errors with a background `failedQueue` for a zero-interruption UX.
- **Route Guards**: Strict Role-Based Access Control (RBAC) using Protected and Public-only route wrappers.
- **Secure State Persistence**: User sessions are securely managed via **Zustand** with persistent storage middleware.

### 📊 Data Visualization & Management
- **Dynamic Charts**: Interactive breakdown of expenditures using **Recharts** (Pie & Bar charts).
- **Pro Transactions Module**: Advanced server-side pagination, multi-criteria filtering, and URL-syncing for shareable states.
- **Smart Budgets**: Visual progress tracking for monthly spending limits across multiple categories.
- **Unified Categories**: Hierarchical management of system and user-defined financial categories.

### 🍱 High-End Frontend Engineering
- **Optimistic UI & Cache Management**: Powered by **TanStack Query** for lightning-fast responsiveness and smart cache invalidation.
- **Form Architect**: Robust schema validation using **React Hook Form** + **Zod**.
- **Visual Excellence**: Premium Dark/Light theme consistency using **Tailwind CSS**, featuring glassmorphism, smooth micro-animations, and skeleton loading states.

---

## 📂 Project Structure

The project follows a **Fractal Directory Pattern**, ensuring scalability and maintainability.

```text
src/
├── api/            # Centralized API service layer (Axios instance, Interceptors)
├── components/     # Atomic Design system (UI, Layout, Common, Feature-specific)
│   ├── ai/         # AI Sidebar & Chat components
│   ├── layout/     # Master layouts (Auth, Main, Sidebar, Header)
│   └── common/     # Reusable UI (Modals, Pagination, Route Guards)
├── hooks/          # Custom hooks encapsulating Business Logic & React Query
├── pages/          # View components representing application routes
├── store/          # Global state management using Zustand (Auth, Session)
├── constants/      # App-wide routing paths and Query keys
├── utils/          # Utility functions (Currency formatting, Date helpers)
└── assets/         # Static assets and global styles
```

---

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in the root directory and configure the following:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# AI / Chat specific configs (if any)
VITE_AI_REPLY_SPEED=10
```

---

## 🛠️ Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step-by-Step

1. **Clone the repository**
   ```bash
   git clone https://github.com/TuanAnhVu81/smartfinance-fe.git
   cd smartfinance-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the environment**
   - Copy `.env.example` to `.env` or create a new one.
   - Adjust `VITE_API_BASE_URL` to point to your running Backend service.

4. **Launch Development Server**
   ```bash
   npm run dev
   ```
   *The application will be accessible at [http://localhost:5173](http://localhost:5173).*

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🤝 Developed By

**Vu Tuan Anh**  
*Full Stack Developer | AI Enthusiast*

*"Building software that doesn't just work, but wows."*
