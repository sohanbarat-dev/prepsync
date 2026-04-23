import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../services/api'
import toast from 'react-hot-toast'

const QUOTES = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Study hard what interests you the most in the most undisciplined way possible.", author: "Richard Feynman" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
]

function StudyHub() {
  const navigate = useNavigate()

  // Timer state
  const [timerDuration, setTimerDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerMode, setTimerMode] = useState('focus') // focus or break
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [breakDuration, setBreakDuration] = useState(5)
  const intervalRef = useRef(null)

  // Planner state
  const [planner, setPlanner] = useState(null)
  const [todayTasks, setTodayTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState({})
  const [selectedDay, setSelectedDay] = useState(0)

  // Todo state
  const [todos, setTodos] = useState([])
  const [todoInput, setTodoInput] = useState('')

  // Quote
  const quote = QUOTES[new Date().getDate() % QUOTES.length]

  useEffect(() => {
    fetchPlanner()
    const savedCompleted = localStorage.getItem('completedTasks')
    if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted))
    const savedTodos = localStorage.getItem('studyHubTodos')
    if (savedTodos) setTodos(JSON.parse(savedTodos))
    const savedSessions = localStorage.getItem('sessionsToday')
    const savedDate = localStorage.getItem('sessionsDate')
    const today = new Date().toDateString()
    if (savedDate === today && savedSessions) {
      setSessionsCompleted(parseInt(savedSessions))
    }
  }, [])

  const fetchPlanner = async () => {
    try {
      const res = await API.get('/planner')
      setPlanner(res.data)
      // Find today's day index
      const today = new Date()
      const examDate = new Date(res.data.examDate)
      const totalDays = res.data.dayWisePlan?.length || 0
      const daysRemaining = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24))
      const dayIndex = Math.max(0, totalDays - daysRemaining)
      const safeIndex = Math.min(dayIndex, totalDays - 1)
      setSelectedDay(safeIndex)
      setTodayTasks(res.data.dayWisePlan?.[safeIndex]?.tasks || [])
    } catch (err) {
      console.error(err)
    }
  }

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerRunning, timerMode])

  const handleTimerComplete = () => {
    setTimerRunning(false)
    if (timerMode === 'focus') {
      const newSessions = sessionsCompleted + 1
      setSessionsCompleted(newSessions)
      localStorage.setItem('sessionsToday', newSessions.toString())
      localStorage.setItem('sessionsDate', new Date().toDateString())
      toast.success(`Focus session complete! 🎉 Take a ${breakDuration} min break!`)
      setTimerMode('break')
      setTimeLeft(breakDuration * 60)
    } else {
      toast.success('Break over! Time to focus! 💪')
      setTimerMode('focus')
      setTimeLeft(timerDuration * 60)
    }
  }

  const startTimer = () => setTimerRunning(true)
  const pauseTimer = () => setTimerRunning(false)
  const resetTimer = () => {
    setTimerRunning(false)
    setTimerMode('focus')
    setTimeLeft(timerDuration * 60)
  }

  const setDuration = (mins) => {
    setTimerDuration(mins)
    setTimeLeft(mins * 60)
    setTimerRunning(false)
    setTimerMode('focus')
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const totalSeconds = timerMode === 'focus' ? timerDuration * 60 : breakDuration * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Topic completion
  const toggleTask = (taskIndex) => {
    const key = `${selectedDay}-${taskIndex}`
    const updated = { ...completedTasks, [key]: !completedTasks[key] }
    setCompletedTasks(updated)
    localStorage.setItem('completedTasks', JSON.stringify(updated))
    if (!completedTasks[key]) toast.success('Topic completed! 🎉')
  }

  // Todo logic
  const addTodo = (e) => {
    e.preventDefault()
    if (!todoInput.trim()) return
    const newTodos = [...todos, { id: Date.now(), text: todoInput, done: false }]
    setTodos(newTodos)
    localStorage.setItem('studyHubTodos', JSON.stringify(newTodos))
    setTodoInput('')
  }

  const toggleTodo = (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    setTodos(updated)
    localStorage.setItem('studyHubTodos', JSON.stringify(updated))
  }

  const deleteTodo = (id) => {
    const updated = todos.filter(t => t.id !== id)
    setTodos(updated)
    localStorage.setItem('studyHubTodos', JSON.stringify(updated))
  }

  const completedCount = Object.values(completedTasks).filter(Boolean).length
  const totalTasks = planner?.dayWisePlan?.reduce((acc, day) => acc + day.tasks.length, 0) || 0
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const difficultyColor = {
    'Easy': 'bg-green-100 text-green-600',
    'Medium': 'bg-amber-100 text-amber-600',
    'Hard': 'bg-red-100 text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-600 transition mb-6 group font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Study Hub ⚡</h1>
          <p className="text-gray-400 mt-2">Your personal study command center</p>
        </div>

        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white mb-8">
          <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-2">Daily Quote</p>
          <p className="text-xl font-bold leading-relaxed">"{quote.text}"</p>
          <p className="text-purple-300 text-sm mt-2">— {quote.author}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Focus Zone Timer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="font-black text-gray-800 text-lg">⚡ Focus Zone</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''} completed today
                </p>
              </div>

              <div className="p-6">
                {/* Mode Badge */}
                <div className="flex justify-center mb-4">
                  <span className={`text-sm font-black px-4 py-1.5 rounded-full ${
                    timerMode === 'focus'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {timerMode === 'focus' ? '⚡ Focus Time' : '☕ Break Time'}
                  </span>
                </div>

                {/* Circular Timer */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <svg width="200" height="200" className="-rotate-90">
                      <circle
                        cx="100" cy="100" r="90"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />
                      <circle
                        cx="100" cy="100" r="90"
                        fill="none"
                        stroke={timerMode === 'focus' ? '#7c3aed' : '#10b981'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-gray-800">{formatTime(timeLeft)}</span>
                      <span className="text-xs text-gray-400 mt-1 font-semibold">
                        {timerMode === 'focus' ? 'Stay focused' : 'Take a break'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Duration Presets */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-500 mb-2">Focus Duration</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 25, 30, 45].map((min) => (
                      <button
                        key={min}
                        onClick={() => setDuration(min)}
                        disabled={timerRunning}
                        className={`py-2 rounded-xl text-sm font-bold transition ${
                          timerDuration === min && timerMode === 'focus'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                        } disabled:opacity-50`}
                      >
                        {min}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Break Duration */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-500 mb-2">Break Duration</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((min) => (
                      <button
                        key={min}
                        onClick={() => setBreakDuration(min)}
                        disabled={timerRunning}
                        className={`py-2 rounded-xl text-sm font-bold transition ${
                          breakDuration === min
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                        } disabled:opacity-50`}
                      >
                        {min}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex gap-2">
                  {!timerRunning ? (
                    <button
                      onClick={startTimer}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-2xl transition active:scale-95"
                    >
                      {timeLeft === timerDuration * 60 ? '▶ Start' : '▶ Resume'}
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-2xl transition active:scale-95"
                    >
                      ⏸ Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="w-12 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-3 rounded-2xl transition"
                  >
                    ↺
                  </button>
                </div>

                {/* Sessions */}
                {sessionsCompleted > 0 && (
                  <div className="mt-4 flex gap-1 flex-wrap">
                    {Array.from({ length: sessionsCompleted }).map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-xs">
                        ⚡
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Today's Topics + Todo */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
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

            {/* Today's Topics */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                <div>
                  <h2 className="font-black text-gray-800 text-lg">📅 Today's Topics</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Day {(planner?.dayWisePlan?.[selectedDay]?.day) || '--'} •{' '}
                    {todayTasks.filter((_, i) => completedTasks[`${selectedDay}-${i}`]).length}/{todayTasks.length} done
                  </p>
                </div>
                {planner && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const prev = Math.max(0, selectedDay - 1)
                        setSelectedDay(prev)
                        setTodayTasks(planner.dayWisePlan?.[prev]?.tasks || [])
                      }}
                      className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-xl flex items-center justify-center text-sm transition"
                    >←</button>
                    <button
                      onClick={() => {
                        const next = Math.min((planner.dayWisePlan?.length || 1) - 1, selectedDay + 1)
                        setSelectedDay(next)
                        setTodayTasks(planner.dayWisePlan?.[next]?.tasks || [])
                      }}
                      className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-xl flex items-center justify-center text-sm transition"
                    >→</button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3 max-h-72 overflow-y-auto">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-2">📚</p>
                    <p className="text-gray-400 text-sm">No planner found.</p>
                    <button
                      onClick={() => navigate('/upload-syllabus')}
                      className="mt-3 text-purple-600 text-sm font-bold hover:underline"
                    >
                      Upload Syllabus →
                    </button>
                  </div>
                ) : todayTasks.map((task, i) => {
                  const isCompleted = completedTasks[`${selectedDay}-${i}`]
                  return (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border transition ${
                      isCompleted ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 hover:border-purple-100'
                    }`}>
                      <button
                        onClick={() => toggleTask(i)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {isCompleted && <span className="text-xs font-black">✓</span>}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                            {task.subject}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor[task.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                            {task.difficulty}
                          </span>
                          <span className="text-xs text-gray-400">⏱ {task.duration}</span>
                        </div>
                        <p className={`text-sm font-bold ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {task.topic}
                        </p>
                        {task.tip && !isCompleted && (
                          <p className="text-xs text-gray-400 mt-1">💡 {task.tip}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Custom Todo List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="font-black text-gray-800 text-lg">📝 My Task List</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {todos.filter(t => t.done).length}/{todos.length} tasks done
                </p>
              </div>

              <div className="p-6">
                {/* Add Todo */}
                <form onSubmit={addTodo} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    placeholder="Add a task e.g. Revise Chapter 3..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition"
                  />
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-3 rounded-xl transition active:scale-95"
                  >
                    +
                  </button>
                </form>

                {/* Todo List */}
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {todos.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">No tasks yet — add one above!</p>
                  ) : todos.map((todo) => (
                    <div key={todo.id} className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                      todo.done ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'
                    }`}>
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition ${
                          todo.done
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-purple-400'
                        }`}
                      >
                        {todo.done && <span className="text-xs font-black">✓</span>}
                      </button>
                      <p className={`flex-1 text-sm font-medium ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.text}
                      </p>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-300 hover:text-red-400 transition text-xs px-2 py-1 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Clear completed */}
                {todos.some(t => t.done) && (
                  <button
                    onClick={() => {
                      const updated = todos.filter(t => !t.done)
                      setTodos(updated)
                      localStorage.setItem('studyHubTodos', JSON.stringify(updated))
                    }}
                    className="mt-3 text-xs text-gray-400 hover:text-red-400 transition font-semibold"
                  >
                    Clear completed tasks
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyHub