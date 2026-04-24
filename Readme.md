🚀 PrepSync
🧠 Sync your syllabus. Own your exam.

An AI-powered full-stack platform that transforms syllabus into a personalized, adaptive study system using intelligent planning and exam pattern analysis.

🌟 Why PrepSync?

Most students:

❌ Follow random study plans
❌ Ignore PYQs
❌ Don’t track progress

PrepSync solves this using AI.

👉 It converts:

📄 Syllabus → Structured topics
📝 PYQs → Important concepts
📊 Progress → Readiness score

➡️ Into a smart daily study plan

🧠 Core Idea

PrepSync is not just a planner — it's an:

AI-powered exam intelligence system

It understands:

What to study
When to study
How much to study
What matters most in exams
✨ Features
🔐 Smart Authentication
JWT-based secure login
Password hashing (bcrypt)
🎓 Only @kiit.ac.in users allowed
📄 AI Syllabus Parser
Upload syllabus (PDF)
AI extracts:
Topics
Subtopics
Converts into structured data
🗓️ Personalized Study Planner
Generates day-wise schedule based on:
Days remaining
Study hours
Revision / first-time mode
Test type (short / long)
📝 PYQ Analyzer
Upload previous year papers
AI identifies:
High-frequency topics
Important concepts
Adds weightage to planner
📊 Progress Tracking
Track completed topics
Visual analytics dashboard
📈 Exam readiness score
🤖 AI Doubt Solver
Chat-based tutor
Context-aware answers
⚡ Smart System Features
🔄 Adaptive replanning
🧠 Weak area detection
📌 Difficulty tagging
⏱️ Pomodoro timer
🏗️ Architecture
Frontend (React + Tailwind)
        ↓
API Layer (Axios)
        ↓
Backend (Node.js + Express)
        ↓
Database (MongoDB)
        ↓
AI Layer (Claude API)
        ↓
PDF Processing (Multer + pdf-parse)
🛠️ Tech Stack
🎨 Frontend
React.js
Tailwind CSS
React Router
Axios
Recharts
⚙️ Backend
Node.js
Express.js
🗄️ Database
MongoDB + Mongoose
🔐 Authentication
JWT
bcrypt
🤖 AI Integration
Claude / Gemini API
📂 Tools
Multer (file upload)
PDF parsing
Nodemailer
🧱 Project Structure
prepsync/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   └── App.jsx
│
└── README.md
⚙️ Setup Guide
1️⃣ Clone Repo
git clone https://github.com/your-username/prepsync.git
cd prepsync
2️⃣ Backend Setup
cd backend
npm install

Create .env:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

Run:

npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔗 API Overview
Auth Routes
POST /api/auth/register
POST /api/auth/login
Protected Routes
Authorization: Bearer <token>
🧠 Key Concepts Demonstrated
Full-stack development (React + Node + MongoDB)
JWT authentication & middleware
AI integration in real applications
File handling (PDF upload + parsing)
Context API (global state management)
REST API architecture
💼 Why This Project Stands Out

✅ Not a basic CRUD app
✅ Real-world problem solving
✅ AI + Full Stack combination
✅ Strong interview discussion points

🗣️ Interview Talking Points
How AI generates personalized plans
How PDF parsing works
JWT authentication flow
Database schema design
Handling file uploads
🚀 Future Scope
Multi-college login system (IIT, NIT, etc.)
Mobile app version
Collaborative study rooms
Advanced analytics
👨‍💻 Author

Sohan Barat
Full Stack Developer | AI Enthusiast

⭐ Support

If you like this project, give it a ⭐ on GitHub!