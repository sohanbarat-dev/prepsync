import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../services/api'
import toast from 'react-hot-toast'

function UploadSyllabus() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [mode, setMode] = useState('first-time')
  const [subjects, setSubjects] = useState([{ name: '', file: null, examScope: '' }])

  const subjectColors = [
    { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
    { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
    { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  ]

  const scopeExamples = [
    'Unit 1, 2 and 4 only',
    'Full syllabus',
    'Chapters 1-5 only',
    'Skip Unit 3 and 5',
  ]

  const addSubject = () => {
    if (subjects.length >= 6) return toast.error('Maximum 6 subjects allowed')
    setSubjects([...subjects, { name: '', file: null, examScope: '' }])
  }

  const removeSubject = (index) => {
    if (subjects.length === 1) return toast.error('At least 1 subject required')
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const updateSubject = (index, field, value) => {
    const updated = [...subjects]
    updated[index][field] = value
    setSubjects(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    for (let s of subjects) {
      if (!s.name.trim()) return toast.error('Please enter all subject names')
      if (!s.file) return toast.error(`Please upload PDF for ${s.name || 'all subjects'}`)
    }
    if (!examDate) return toast.error('Please set your exam date')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('examDate', examDate)
      formData.append('hoursPerDay', hoursPerDay)
      formData.append('mode', mode)
      formData.append('subjectNames', JSON.stringify(subjects.map(s => s.name)))
      formData.append('examScopes', JSON.stringify(subjects.map(s => s.examScope || 'Full syllabus')))
      subjects.forEach(s => formData.append('syllabusFiles', s.file))
      await API.post('/planner/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Study plan generated!')
      navigate('/planner')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-600 transition mb-8 group font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Dashboard
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Upload Syllabus <span className="text-purple-600">📄</span></h1>
          <p className="text-gray-400 mt-2 text-base">Add your subjects and AI will create a personalized day-wise study plan</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-10">
          {[
            { num: '1', label: 'Add Subjects' },
            { num: '2', label: 'Exam Settings' },
            { num: '3', label: 'Generate Plan' },
          ].map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${i === 0 ? 'bg-purple-600 text-white' : i === 1 ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                  {step.num}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-bold ${i === 0 ? 'text-purple-600' : 'text-gray-400'}`}>{step.label}</p>
                </div>
              </div>
              {i < 2 && <div className="w-full h-0.5 bg-gray-200 mx-3 flex-shrink"></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Subjects Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-7 py-6 border-b border-gray-50">
              <div>
                <h2 className="text-xl font-black text-gray-800">Your Subjects</h2>
                <p className="text-sm text-gray-400 mt-0.5">{subjects.length} subject{subjects.length > 1 ? 's' : ''} added • max 6</p>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-5 py-3 rounded-2xl transition active:scale-95 shadow-sm shadow-purple-200"
              >
                <span className="text-lg leading-none">+</span> Add Subject
              </button>
            </div>

            <div className="p-7 space-y-5">
              {subjects.map((subject, index) => {
                const color = subjectColors[index]
                return (
                  <div key={index} className={`rounded-2xl border-2 overflow-hidden transition ${subject.file ? 'border-green-100' : 'border-gray-100'} hover:border-purple-100`}>

                    {/* Card Header */}
                    <div className={`flex items-center justify-between px-5 py-3 ${color.bg}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 bg-white rounded-lg flex items-center justify-center font-black text-xs ${color.text}`}>
                          {index + 1}
                        </div>
                        <span className={`text-sm font-bold ${color.text}`}>
                          {subject.name || `Subject ${index + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 bg-gray-50 space-y-3">

                      {/* Subject Name */}
                      <input
                        type="text"
                        placeholder={`Subject name (e.g. ${['Operating Systems', 'DBMS', 'Computer Networks', 'Algorithms'][index] || 'Subject Name'})`}
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-medium transition"
                      />

                      {/* PDF Upload */}
                      <label className="block cursor-pointer">
                        <div className={`px-4 py-3 border-2 border-dashed rounded-xl text-sm text-center font-semibold transition ${
                          subject.file
                            ? 'border-green-300 bg-green-50 text-green-600'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-purple-300 hover:text-purple-500'
                        }`}>
                          {subject.file ? `✅ ${subject.file.name}` : '📎 Upload Syllabus PDF'}
                        </div>
                        <input type="file" accept=".pdf" className="hidden"
                          onChange={(e) => updateSubject(index, 'file', e.target.files[0])} />
                      </label>

                      {/* Exam Scope */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-amber-50">
                          <span className="text-sm">🎯</span>
                          <span className="text-xs font-bold text-amber-700">What's coming in your exam?</span>
                        </div>
                        <div className="p-3">
                          <input
                            type="text"
                            placeholder='e.g. "Unit 1, 2 and 4 only" or "Full syllabus" or "Skip Unit 3"'
                            value={subject.examScope}
                            onChange={(e) => updateSubject(index, 'examScope', e.target.value)}
                            className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none font-medium placeholder-gray-300"
                          />
                          {/* Quick scope buttons */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {scopeExamples.map((example, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => updateSubject(index, 'examScope', example)}
                                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                                  subject.examScope === example
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                                }`}
                              >
                                {example}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Exam Settings */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="px-7 py-6 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-800">Exam Settings</h2>
              <p className="text-sm text-gray-400 mt-0.5">Help AI schedule your topics perfectly</p>
            </div>

            <div className="p-7 space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Exam Date */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="block text-sm font-black text-gray-700 mb-3">
                    📅 Exam Date
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm transition font-medium"
                  />
                </div>

                {/* Hours Slider */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="block text-sm font-black text-gray-700 mb-1">
                    ⏰ Study Hours Per Day
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-black text-purple-600">{hoursPerDay}</span>
                    <span className="text-gray-400 text-sm font-medium">hours/day</span>
                  </div>
                  <input
                    type="range" min="1" max="12"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1h — Relaxed</span>
                    <span>12h — Intensive</span>
                  </div>
                </div>
              </div>

              {/* Study Mode */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-4">
                  🎯 Study Mode
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: 'first-time',
                      icon: '📖',
                      title: 'First Time Read',
                      sub: "Haven't studied this before",
                      detail: 'More time allocated per topic'
                    },
                    {
                      value: 'revision',
                      icon: '🔄',
                      title: 'Revision Mode',
                      sub: 'Already studied once',
                      detail: 'Faster pace, more topics per day'
                    }
                  ].map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMode(m.value)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        mode === m.value
                          ? 'border-purple-500 bg-purple-50 shadow-sm'
                          : 'border-gray-100 bg-gray-50 hover:border-purple-200'
                      }`}
                    >
                      <span className="text-4xl">{m.icon}</span>
                      <p className="font-black text-gray-800 mt-3 text-base">{m.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{m.sub}</p>
                      <p className={`text-xs mt-2 font-semibold ${mode === m.value ? 'text-purple-600' : 'text-gray-300'}`}>
                        {mode === m.value ? '✓ Selected — ' : ''}{m.detail}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-2xl transition duration-200 disabled:opacity-60 active:scale-95 text-lg shadow-lg shadow-purple-100"
          >
            {loading ? '🤖 AI is generating your plan...' : '✨ Generate My Study Plan →'}
          </button>

          {loading && (
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-center">
              <p className="text-purple-700 text-sm font-bold animate-pulse">
                ⏳ AI is analyzing your syllabus and building an exam-ready plan...
              </p>
              <p className="text-purple-400 text-xs mt-1">This usually takes 15–30 seconds</p>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

export default UploadSyllabus