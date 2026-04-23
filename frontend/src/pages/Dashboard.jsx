import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const features = [
    {
      icon: '📄',
      title: 'Upload Syllabus',
      desc: 'Let AI generate a personalized day-wise study plan from your syllabus PDF.',
      btn: 'Upload Now',
      bg: 'from-purple-500 to-indigo-500',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      btnClass: 'bg-purple-600 hover:bg-purple-700',
      route: '/upload-syllabus'
    },
    {
      icon: '📝',
      title: 'Analyze PYQ Papers',
      desc: 'AI identifies the most important topics from your previous year papers.',
      btn: 'Upload PYQ',
      bg: 'from-blue-500 to-cyan-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      btnClass: 'bg-blue-600 hover:bg-blue-700',
      route: '/pyq-analyzer'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      desc: 'Mark topics done, view charts and watch your exam readiness score grow.',
      btn: 'View Progress',
      bg: 'from-emerald-500 to-teal-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700',
      route: '/progress'
    },
    {
      icon: '🤖',
      title: 'Gyani — AI Tutor',
      desc: 'Ask Gyani any doubt and get instant explanations, examples and exam tips.',
      btn: 'Ask Doubt',
      bg: 'from-amber-500 to-orange-500',
      light: 'bg-amber-50',
      text: 'text-amber-600',
      btnClass: 'bg-amber-500 hover:bg-amber-600',
      route: '/doubt-bot'
    },
  ]

  // (kept but unused — no breaking changes)
  const stats = [
    { label: 'Topics Completed', value: '0', sub: 'Upload syllabus to start', icon: '✅', color: 'text-purple-600' },
    { label: 'Days Remaining', value: '--', sub: 'Set your exam date', icon: '📅', color: 'text-blue-600' },
    { label: 'Exam Readiness', value: '0%', sub: 'Complete topics to improve', icon: '🎯', color: 'text-emerald-600' },
    { label: 'Study Streak', value: '1', sub: 'Keep it going!', icon: '🔥', color: 'text-amber-500' },
  ]

  // 🔥 Daily Quotes Logic
  const quotes = [
    "The best way to get started is to quit talking and begin doing.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Success doesn’t come from what you do occasionally, but what you do consistently.",
    "Push yourself, because no one else is going to do it for you.",
    "Small progress is still progress.",
    "Dream it. Wish it. Do it.",
    "Great things never come from comfort zones.",
    "Discipline beats motivation."
  ]

  const [quote, setQuote] = useState('')

  useEffect(() => {
    const today = new Date().toDateString()
    const index =
      today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      quotes.length
    setQuote(quotes[index])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white mb-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-14 -right-4 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-6 right-32 w-16 h-16 bg-white opacity-5 rounded-full"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium mb-1 uppercase tracking-widest">Dashboard</p>
              <h2 className="text-4xl font-black mb-3">
                Welcome back, {user?.name?.split(' ')[0]}! 🎓
              </h2>
              <p className="text-purple-200 text-base max-w-md">
                You're one step closer to acing your exams. Let's make today count!
              </p>
              <button
                onClick={() => navigate('/upload-syllabus')}
                className="mt-5 bg-white text-purple-600 font-bold px-6 py-3 rounded-2xl text-sm hover:bg-purple-50 transition active:scale-95">
                Start Studying →
              </button>
            </div>
            <div className="hidden md:block text-9xl opacity-20 select-none">
              📚
            </div>
          </div>
        </div>

        {/* 🔥 Daily Motivation (REPLACED STATS) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-blue-500 font-semibold mb-2">
            Daily Motivation
          </p>

          <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 leading-snug">
            “{quote}”
          </h2>

          <p className="text-sm text-gray-400">New quote every day ✨</p>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black text-gray-800">What do you want to do?</h3>
          <span className="text-sm text-gray-400">4 features available</span>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => navigate(f.route)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className={`h-2 w-full bg-gradient-to-r ${f.bg}`}></div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${f.light} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(f.route) }}
                    className={`${f.btnClass} text-white text-sm font-bold px-5 py-2.5 rounded-xl transition active:scale-95`}>
                    {f.btn} →
                  </button>
                  <span className={`text-xs font-semibold ${f.text} ${f.light} px-3 py-1 rounded-full`}>
                    AI Powered
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pomodoro Timer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl">
              ⏱️
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Study Hub ⚡</h3>
              <p className="text-sm text-gray-400">Focus timer, today's topics and task list</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/study-hub')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition active:scale-95">
            Open Study Hub →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Dashboard