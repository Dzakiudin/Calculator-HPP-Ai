# 🧮 CalculatorBisnis Pro

**Smarter Business Analysis. Faster Decisions.**

CalculatorBisnis Pro is a premium financial projection tool designed for entrepreneurs and small business owners to calculate HPP (Cost of Goods Sold), analyze operational costs, and determine the Break-Even Point (BEP) with precision and style.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## ✨ Key Features

- **💎 Pro Max UI/UX**: High-end aesthetic with glassmorphism, fluid animations (Framer Motion), and a premium color palette.
- **📱 Fully Responsive**: Seamless experience across mobile, tablet, and desktop devices.
- **📊 Real-time Analytics**: Animated doughnut charts and instant recalculations as you type.
- **📁 Scenario Management**: Save, edit, and delete multiple analysis scenarios securely with Firebase Firestore.
- **💡 Smart Suggestions**: Automated business advice based on your calculated margins and BEP.
- **🌙 Anonymous Auth**: No tedious sign-up required. Your data is privately linked to your device session.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4 (Modern Utility-First)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/DB**: Firebase Authentication & Cloud Firestore
- **Deployment**: Optimized for Netlify/Vercel

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dzakiudin/Calculator-HPP-Ai.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   Update your Firebase configuration in `src/lib/firebase.ts`.

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
src/
├── components/     # UI Components (InputForm, Sidebar, History, etc.)
├── hooks/          # Custom React Hooks (Business Logic, Firebase)
├── lib/            # Utilities & Config (Firebase, tailwind-merge)
├── types.ts        # TypeScript Interfaces
└── App.tsx         # Main Orchestrator
```

---

## 🛡️ Firebase Security Rules

To ensure your data is secure, please apply the rules found in `FIREBASE_RULES.md` in your Firebase Console. This allows anonymous users to securely manage their own scenarios.

---

## 📄 License
This project is for personal and business use. All rights reserved.

Created with ❤️ by the **JakiJeki**
