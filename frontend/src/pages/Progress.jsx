import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../services/api'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts'

function Progress() {
  const navigate = useNavigate()
  const [planner, setPlanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedTasks, setCompletedTasks] = useState({})

  useEffect(() => {
    fetchData()
    const saved = localStorage.getItem('completedTasks')
    if (saved) setCompletedTasks(JSON.parse(saved))
  }, [])

  const fetchData = async () => {
    try {
      const res = await API.get('/planner')
      setPlanner(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalTasks = planner?.dayWisePlan?.reduce((acc, day) => acc + day.tasks.length, 0) || 0
  const completedCount = Object.values(completedTasks).filter(Boolean).length
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  const totalDays = planner?.dayWisePlan?.length || 0
  const daysRemaining = planner?.examDate
    ? Math.max(0, Math.ceil((new Date(planner.examDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0

  // Subject wise progress
  const subjectProgress = planner?.subjects?.map((subject, si) => {
    const subjectTasks = planner.dayWisePlan?.flatMap((day, di) =>
      day.tasks.map((task, ti) => ({ ...task, key: `${di}-${ti}` }))
    ).filter(task => task.subject === subject.name) || []

    const completed = subjectTasks.filter(task => completedTasks[task.key]).length
    const total = subjectTasks.length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      name: subject.name,
      completed,
      total,
      percent,
      remaining: total - completed
    }
  }) || []

  // Daily completion data for bar chart
  const dailyData = planner?.dayWisePlan?.slice(0, 14).map((day, di) => {
    const dayTasks = day.tasks.length
    const dayCompleted = day.tasks.filter((_, ti) => completedTasks[`${di}-${ti}`]).length
    return {
      name: `D${day.day}`,
      completed: dayCompleted,
      remaining: dayTasks - dayCompleted,
      total: dayTasks
    }
  }) || []

  // Difficulty breakdown
  const difficultyData = [
    {
      name: 'Easy',
      value: planner?.dayWisePlan?.flatMap(d => d.tasks).filter(t => t.difficulty === 'Easy').length || 0,
      color: '#10b981'
    },
    {
      name: 'Medium',
      value: planner?.dayWisePlan?.flatMap(d => d.tasks).filter(t => t.difficulty === 'Medium').length || 0,
      color: '#f59e0b'
    },
    {
      name: 'Hard',
      value: planner?.dayWisePlan?.flatMap(d => d.tasks).filter(t => t.difficulty === 'Hard').length || 0,
      color: '#ef4444'
    },
  ].filter(d => d.value > 0)

  const readinessColor = progressPercent >= 75 ? 'text-green-600' :
    progressPercent >= 50 ? 'text-amber-500' :
    progressPercent >= 25 ? 'text-blue-500' : 'text-red-500'

  const readinessLabel = progressPercent >= 75 ? 'Exam Ready!' :
    progressPercent >= 50 ? 'Good Progress' :
    progressPercent >= 25 ? 'Getting There' : 'Just Started'

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📊</div>
          <p className="text-gray-500 font-semibold">Loading progress...</p>
        </div>
      </div>
    </div>
  )

  if (!planner) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">No Study Plan Yet</h2>
        <p className="text-gray-400 mb-6">Generate a study plan first to track your progress</p>
        <button
          onClick={() => navigate('/upload-syllabus')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-2xl transition"
        >
          Upload Syllabus →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-600 transition mb-6 group font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white mb-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-14 right-32 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-sm font-medium uppercase tracking-widest mb-1">Your Progress</p>
              <h1 className="text-4xl font-black mb-2">Progress Tracker 📊</h1>
              <p className="text-emerald-100 text-base">
                {completedCount} of {totalTasks} topics completed • {daysRemaining} days to exam
              </p>
            </div>
            <div className="text-right">
              <p className={`text-6xl font-black ${progressPercent >= 50 ? 'text-white' : 'text-emerald-200'}`}>
                {progressPercent}%
              </p>
              <p className="text-emerald-200 text-sm font-semibold">{readinessLabel}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 mt-6">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Topics Done', value: completedCount, total: totalTasks, icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Days Remaining', value: daysRemaining, total: totalDays, icon: '📅', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Exam Readiness', value: `${progressPercent}%`, icon: '🎯', color: readinessColor, bg: 'bg-purple-50' },
            { label: 'Subjects', value: planner?.subjects?.length, icon: '📚', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center text-base`}>
                  {stat.icon}
                </div>
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              {stat.total && (
                <p className="text-xs text-gray-400 mt-1">of {stat.total} total</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Subject Progress */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-800 mb-5">Subject-wise Progress</h3>
            <div className="space-y-4">
              {subjectProgress.map((subject, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{subject.name}</span>
                    <span className="text-sm font-black text-gray-500">
                      {subject.completed}/{subject.total}
                      <span className="text-xs font-normal text-gray-400 ml-1">topics</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${subject.percent}%`,
                        background: `hsl(${i * 60 + 150}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{subject.percent}% complete</span>
                    <span className="text-xs text-gray-400">{subject.remaining} remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Breakdown Pie Chart */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-gray-800 mb-5">Topic Difficulty Breakdown</h3>
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} topics`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Daily Progress Bar Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-black text-gray-800 mb-1">Daily Progress (First 14 Days)</h3>
          <p className="text-xs text-gray-400 mb-5">Topics completed vs remaining per day</p>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="remaining" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No data yet
            </div>
          )}
        </div>

        {/* Motivational Card */}
        <div className={`rounded-3xl p-6 text-white ${
          progressPercent >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
          progressPercent >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
          progressPercent >= 25 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
          'bg-gradient-to-r from-purple-500 to-indigo-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black mb-1">
                {progressPercent >= 75 ? '🎉 Amazing work! You are almost there!' :
                 progressPercent >= 50 ? '🔥 Great progress! Keep the momentum!' :
                 progressPercent >= 25 ? '💪 Good start! Stay consistent!' :
                 '🚀 Your journey begins! Start studying!'}
              </h3>
              <p className="text-white text-opacity-80 text-sm">
                {progressPercent >= 75 ? `Just ${totalTasks - completedCount} topics left. You've got this!` :
                 progressPercent >= 50 ? `${totalTasks - completedCount} topics remaining. You're halfway there!` :
                 progressPercent >= 25 ? `${totalTasks - completedCount} topics to go. Stay focused!` :
                 `${totalTasks} topics to cover. Start with Day 1!`}
              </p>
            </div>
            <button
              onClick={() => navigate('/planner')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold px-5 py-3 rounded-2xl text-sm transition active:scale-95 flex-shrink-0"
            >
              Go to Planner →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Progress