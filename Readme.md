# PrepSync 🎓

> **Sync your syllabus. Own your exam.**

PrepSync is an AI-powered exam preparation platform built for KIIT students. Upload your syllabus, get a personalized day-wise study plan, analyze previous year papers, track your progress, and get instant doubt resolution — all in one place.

---

## 🌟 Features

- 📄 **AI Study Planner** — Upload syllabus PDF → AI generates a personalized day-wise plan
- 📝 **PYQ Analyzer** — Upload previous year papers → AI identifies most important topics
- 📊 **Progress Tracker** — Track topic completion with beautiful charts
- 🧠 **Gyani AI Tutor** — Ask any subject doubt, get instant explanations
- ⚡ **Study Hub** — Focus Zone timer, today's topics, custom task list
- 🔐 **KIIT Exclusive** — Only @kiit.ac.in emails allowed

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Groq API (Llama 3.3 70B) |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Charts | Recharts |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/prepsync.git
cd prepsync

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create `backend/.env`:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

### Run Locally

```bash
# Run backend (from backend/)
npm run dev

# Run frontend (from frontend/)
npm run dev
```

---


## 👨‍💻 Developer

**Sohan Barat**
- 📧 sohanbarat2003@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/your-profile)
- 🐙 [GitHub](https://github.com/your-username)

---

## 📄 License

MIT License — feel free to use and modify.