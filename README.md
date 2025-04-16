# 📚 Quizly

**Quizly** is an AI-powered quiz generation platform that lets users create quizzes on any topic they desire. Once a quiz is completed, users receive detailed performance feedback including correct answers, their responses, and insightful statistics to help identify strengths and areas for improvement.

> Learn anything, test yourself, and track your progress — all in one place.

---

## ✨ Features

- 🎯 **AI-Generated Quizzes** – Instantly create quizzes on any topic using powerful AI.
- 📊 **Post-Quiz Analytics** – View a detailed results page showing correct answers vs. your responses.
- 🔐 **Secure Authentication** – Powered by NextAuth with support for multiple providers.
- 🌐 **Modern UI** – Clean and responsive design using Tailwind CSS.

---

## 🛠️ Tech Stack

- **Next.js**: React framework for SSR (Server-Side Rendering) & frontend development.
- **NextAuth**: Authentication for secure login with support for multiple authentication providers.
- **Supabase**: Backend-as-a-service with Postgres database.
- **Prisma**: Type-safe ORM for database operations.
- **Tailwind CSS**: Utility-first CSS framework for modern UI design.

---

## 🚀 Getting Started

To run Quizly locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/mohamdbarhoumi/Quizly.git
cd quizly
```

### 2. Install dependencies

```bash

npm install

```
### 3. Set up environment variables
**Create a .env.local file in the root directory and add your credentials:**

```bash

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

```
### 4. Run the development server

```bash

npm run dev

```
**Visit http://localhost:3000 in your browser.**

**🧪 Usage **
Log in using your Google account (or any other supported provider).

Enter a topic and generate a quiz instantly.

Complete the quiz at your own pace.

View a detailed breakdown of your performance at the end, including a comparison between your responses and the correct answers.





