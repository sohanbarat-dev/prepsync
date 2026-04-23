import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../services/api'
import toast from 'react-hot-toast'

function Planner() {
  const navigate = useNavigate()
  const [planner, setPlanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)
  const [completedTasks, setCompletedTasks] = useState({})

  useEffect(() => {
    fetchPlanner()
    const saved = localStorage.getItem('completedTasks')
    if (saved) setCompletedTasks(JSON.parse(saved))
  }, [])

  const fetchPlanner = async () => {
    try {
      const res = await API.get('/planner')
      setPlanner(res.data)
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('No planner found. Upload your syllabus first!')
        navigate('/upload-syllabus')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = (dayIndex, taskIndex) => {
    const key = `${dayIndex}-${taskIndex}`
    const updated = { ...completedTasks, [key]: !completedTasks[key] }
    setCompletedTasks(updated)
    localStorage.setItem('completedTasks', JSON.stringify(updated))
    if (!completedTasks[key]) toast.success('Topic marked as done! 🎉')
  }

  const deletePlanner = async () => {
    if (!window.confirm('Are you sure you want to delete your study plan?')) return
    try {
      await API.delete('/planner')
      toast.success('Planner deleted!')
      navigate('/upload-syllabus')
    } catch (err) {
      toast.error('Failed to delete planner')
    }
  }

  const totalTasks = planner?.dayWisePlan?.reduce((acc, day) => acc + day.tasks.length, 0) || 0
  const completedCount = Object.values(completedTasks).filter(Boolean).length
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-500 font-semibold">Loading your study plan...</p>
        </div>
      </div>
    </div>
  )

  const dayPlan = planner?.dayWisePlan?.[selectedDay]
  const totalDays = planner?.dayWisePlan?.length || 0
  const subjectNames = planner?.subjects?.map(s => s.name) || []

  const subjectColors = [
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-red-100 text-red-700 border-red-200',
  ]

  const difficultyColor = {
    'Easy': 'bg-green-100 text-green-600',
    'Medium': 'bg-amber-100 text-amber-600',
    'Hard': 'bg-red-100 text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-600 transition mb-3 group font-medium"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-gray-900">My Study Plan 📅</h1>
            <p className="text-gray-400 mt-1">
              {totalDays} days • {subjectNames.length} subjects • {planner?.hoursPerDay}h per day
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/upload-syllabus')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-2xl text-sm transition active:scale-95"
            >
              🔄 Regenerate
            </button>
            <button
              onClick={deletePlanner}
              className="bg-red-50 hover:bg-red-100 text-red-500 font-bold px-5 py-3 rounded-2xl text-sm transition active:scale-95"
            >
              🗑️ Delete Plan
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-black text-gray-800">Overall Progress</h3>
              <p className="text-sm text-gray-400">{completedCount} of {totalTasks} topics completed</p>
            </div>
            <span className="text-3xl font-black text-purple-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Subject Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {subjectNames.map((name, i) => (
            <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${subjectColors[i]}`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Day Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-800">All Days</h3>
                <p className="text-xs text-gray-400">{totalDays} days total</p>
              </div>
              <div className="p-3 max-h-[500px] overflow-y-auto space-y-1">
                {planner?.dayWisePlan?.map((day, index) => {
                  const dayCompleted = day.tasks.every((_, ti) => completedTasks[`${index}-${ti}`])
                  const dayPartial = day.tasks.some((_, ti) => completedTasks[`${index}-${ti}`])
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition text-sm font-semibold flex items-center justify-between ${
                        selectedDay === index
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div>Day {day.day}</div>
                        <div className={`text-xs mt-0.5 font-normal ${selectedDay === index ? 'text-purple-200' : 'text-gray-400'}`}>
                          {day.tasks?.length} topics
                        </div>
                      </div>
                      {dayCompleted && <span className="text-green-400 text-base">✓</span>}
                      {dayPartial && !dayCompleted && <span className="text-amber-400 text-xs">●</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Day Detail */}
          <div className="lg:col-span-3 space-y-4">

            {/* Day Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Study Schedule</p>
                  <h2 className="text-3xl font-black mt-1">Day {dayPlan?.day}</h2>
                  <p className="text-purple-200 text-sm mt-1">
                    {dayPlan?.tasks?.length} topics •{' '}
                    {dayPlan?.tasks?.filter((_, i) => completedTasks[`${selectedDay}-${i}`]).length} done
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                    disabled={selectedDay === 0}
                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center disabled:opacity-30 transition font-bold"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedDay(Math.min(totalDays - 1, selectedDay + 1))}
                    disabled={selectedDay === totalDays - 1}
                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center disabled:opacity-30 transition font-bold"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Tasks */}
            {dayPlan?.tasks?.map((task, i) => {
              const subjectIndex = subjectNames.indexOf(task.subject)
              const colorClass = subjectColors[subjectIndex >= 0 ? subjectIndex : 0]
              const isCompleted = completedTasks[`${selectedDay}-${i}`]

              return (
                <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                  isCompleted ? 'border-green-200 bg-green-50 opacity-75' : 'border-gray-100 hover:shadow-md'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colorClass}`}>
                          {task.subject}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyColor[task.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                          {task.difficulty}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">⏱ {task.duration}</span>
                      </div>
                      <h3 className={`text-base font-black mb-1 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.topic}
                      </h3>
                      {task.tip && (
                        <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-2 mt-2">
                          💡 {task.tip}
                        </p>
                      )}
                    </div>

                    {/* Complete Button */}
                    <button
                      onClick={() => toggleTask(selectedDay, i)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition flex-shrink-0 font-bold text-lg border-2 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-200 text-gray-300 hover:border-green-400 hover:text-green-500'
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Planner