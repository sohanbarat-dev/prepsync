import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../services/api'
import toast from 'react-hot-toast'

function DoubtBot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const subjects = [
    'Machine Learning', 'Computer Vision', 'Operating Systems',
    'DBMS', 'Computer Networks', 'Algorithms', 'Data Structures',
    'Software Engineering', 'General'
  ]

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hi! 👋 I'm Gyani, your personal AI study tutor.\n\nI can explain any concept, solve problems, or clarify your doubts.\n\nSelect a subject above and ask me anything!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    if (!subject) return toast.error('Please select a subject first')

    const userMessage = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const conversationHistory = messages
        .filter(m => m.role !== 'system')
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await API.post('/doubt/ask', {
        question: input,
        subject,
        conversationHistory
      })

      setMessages([...updatedMessages, {
        role: 'assistant',
        content: res.data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch (err) {
      toast.error('Failed to get answer')
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! Ask me a new question about ${subject || 'any subject'}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
  }

  const quickQuestions = [
    'Explain this concept simply',
    'Give me an example',
    'What are the key points?',
    'How does this work?',
    'What might be asked in exam?',
  ]

  const questionsAsked = messages.filter(m => m.role === 'user').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-600 transition mb-6 group font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white mb-6">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-14 right-32 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-sm font-medium uppercase tracking-widest mb-1">Meet Gyani</p>
              <h1 className="text-4xl font-black mb-2">Gyani — AI Tutor 🧠</h1>
              <p className="text-amber-100 text-base max-w-lg">
                Ask Gyani any doubt and get instant explanations, examples and exam tips — available 24/7.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center text-5xl">
                🧠
              </div>
            </div>
          </div>
        </div>

        {/* Subject Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-black text-gray-700">Subject:</span>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                  subject === s
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                🧠
              </div>
              <div>
                <p className="font-black text-gray-800">Gyani</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-400">
                    {subject ? `Helping with ${subject}` : 'Select a subject to start'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-xs text-gray-400 hover:text-red-400 bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-xl transition font-semibold"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-2xl ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs">
                        🧠
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">Gyani</span>
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white rounded-tr-sm'
                      : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    <span className="text-xs text-gray-400 ml-1">Gyani is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-3 border-t border-gray-50 bg-white">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-semibold">Quick:</span>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-xs bg-gray-100 hover:bg-amber-50 hover:text-amber-600 text-gray-500 px-3 py-1.5 rounded-full transition font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={subject ? `Ask Gyani anything about ${subject}...` : 'Select a subject first...'}
                disabled={!subject || loading}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-sm transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || !subject || loading}
                className="w-12 h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition active:scale-95 flex-shrink-0"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-lg font-bold">→</span>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default DoubtBot