import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import API from '../services/api'
import toast from 'react-hot-toast'

function PYQAnalyzer() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [pyqs, setPyqs] = useState([])
  const [subjectName, setSubjectName] = useState('')
  const [files, setFiles] = useState([])
  const [selectedPYQ, setSelectedPYQ] = useState(null)

  useEffect(() => { fetchPYQs() }, [])

  const fetchPYQs = async () => {
    try {
      const res = await API.get('/pyq')
      setPyqs(res.data)
      if (res.data.length > 0) setSelectedPYQ(res.data[0])
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!subjectName.trim()) return toast.error('Please enter subject name')
    if (!files.length) return toast.error('Please upload at least one PYQ PDF')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('subjectName', subjectName)
      files.forEach(f => formData.append('pyqFiles', f))

      const res = await API.post('/pyq/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('PYQ analyzed successfully!')
      setPyqs([res.data, ...pyqs.filter(p => p.subjectName !== subjectName)])
      setSelectedPYQ(res.data)
      setSubjectName('')
      setFiles([])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this PYQ analysis?')) return
    try {
      await API.delete(`/pyq/${id}`)
      const updated = pyqs.filter(p => p._id !== id)
      setPyqs(updated)
      setSelectedPYQ(updated.length > 0 ? updated[0] : null)
      toast.success('Deleted!')
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const importanceConfig = {
    'Very High': { color: 'bg-red-100 text-red-700 border-red-200', bar: 'bg-red-500', dot: 'bg-red-500' },
    'High': { color: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500', dot: 'bg-amber-500' },
    'Medium': { color: 'bg-blue-100 text-blue-700 border-blue-200', bar: 'bg-blue-500', dot: 'bg-blue-500' },
    'Low': { color: 'bg-gray-100 text-gray-600 border-gray-200', bar: 'bg-gray-400', dot: 'bg-gray-400' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition mb-6 group font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Dashboard
        </button>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 text-white mb-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-14 right-32 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium uppercase tracking-widest mb-1">AI Powered</p>
              <h1 className="text-4xl font-black mb-2">PYQ Analyzer 📝</h1>
              <p className="text-blue-100 text-base max-w-lg">
                Upload multiple previous year papers for a subject — AI combines and identifies the most frequently asked topics.
              </p>
            </div>
            <div className="hidden md:block text-8xl opacity-20 select-none">📊</div>
          </div>

          {/* Stats - only show when data exists */}
          {pyqs.length > 0 && (
            <div className="relative z-10 flex gap-4 mt-6">
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-2xl">
                <p className="text-2xl font-black leading-none">{pyqs.length}</p>
                <p className="text-blue-100 text-xs mt-1">Subjects Analyzed</p>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-2xl">
                <p className="text-2xl font-black leading-none">
                  {pyqs.reduce((acc, p) => acc + (p.importantTopics?.length || 0), 0)}
                </p>
                <p className="text-blue-100 text-xs mt-1">Topics Found</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-5">

            {/* Upload Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h3 className="font-black text-gray-800 text-lg">Analyze PYQ Papers</h3>
                <p className="text-sm text-gray-400 mt-0.5">Upload multiple years for better analysis</p>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Machine Learning"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white text-sm transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    PYQ Papers
                    <span className="ml-2 text-xs text-blue-500 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                      Multiple PDFs allowed
                    </span>
                  </label>

                  {/* Upload Area */}
                  <label className="block cursor-pointer">
                    <div className={`px-4 py-4 border-2 border-dashed rounded-xl text-sm text-center font-semibold transition ${
                      files.length > 0
                        ? 'border-blue-300 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50'
                    }`}>
                      <div className="text-2xl mb-1">📎</div>
                      <div>{files.length > 0 ? `+ Add more PDFs` : 'Click to upload PYQ PDFs'}</div>
                      <div className="text-xs text-gray-300 mt-1">Select multiple files at once</div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files)
                        setFiles(prev => {
                          const existing = prev.map(f => f.name)
                          const unique = newFiles.filter(f => !existing.includes(f.name))
                          return [...prev, ...unique]
                        })
                      }}
                    />
                  </label>

                  {/* Selected Files List */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {files.length} file{files.length > 1 ? 's' : ''} selected
                      </p>
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-green-500 text-sm flex-shrink-0">✅</span>
                            <span className="text-xs text-green-700 font-semibold truncate">{f.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-gray-300 hover:text-red-400 transition ml-2 flex-shrink-0 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition disabled:opacity-50 active:scale-95 text-sm shadow-sm shadow-blue-200"
                >
                  {loading ? '🤖 AI Analyzing...' : `🔍 Analyze ${files.length > 1 ? `${files.length} Papers` : 'PYQ'} →`}
                </button>

                {loading && (
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-blue-600 text-xs font-semibold animate-pulse">
                      AI is reading and combining all your question papers...
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Analyzed Subjects */}
            {pyqs.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h3 className="font-black text-gray-800">Analyzed Subjects</h3>
                  <p className="text-xs text-gray-400">{pyqs.length} subject{pyqs.length > 1 ? 's' : ''}</p>
                </div>
                <div className="p-3 space-y-1">
                  {pyqs.map((pyq) => (
                    <div
                      key={pyq._id}
                      onClick={() => setSelectedPYQ(pyq)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition ${
                        selectedPYQ?._id === pyq._id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                          selectedPYQ?._id === pyq._id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                          PYQ
                        </div>
                        <div>
                          <p className="text-sm font-bold">{pyq.subjectName}</p>
                          <p className={`text-xs mt-0.5 ${selectedPYQ?._id === pyq._id ? 'text-blue-200' : 'text-gray-400'}`}>
                            {pyq.importantTopics?.length} topics
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(pyq._id) }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition text-xs ${
                          selectedPYQ?._id === pyq._id
                            ? 'bg-blue-500 text-blue-100 hover:bg-blue-400'
                            : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            {fetching ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
                <div className="text-5xl mb-4 animate-bounce">📝</div>
                <p className="text-gray-400 font-semibold">Loading...</p>
              </div>
            ) : !selectedPYQ ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">No PYQ Analyzed Yet</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Upload previous year question papers on the left to discover the most important exam topics
                </p>
                <div className="flex gap-3 mt-6 flex-wrap justify-center">
                  {['Very High', 'High', 'Medium', 'Low'].map((level) => (
                    <div key={level} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${importanceConfig[level].color}`}>
                      {level}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-300 mt-3">Topics will be ranked by importance</p>
              </div>
            ) : (
              <div className="space-y-5">

                {/* Subject Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Analysis Results</p>
                      <h2 className="text-3xl font-black mt-1">{selectedPYQ.subjectName}</h2>
                      <p className="text-blue-200 text-sm mt-1">
                        {selectedPYQ.importantTopics?.length} important topics identified
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl">
                      🎯
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                {selectedPYQ.summary && (
                  <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        🤖
                      </div>
                      <div>
                        <h3 className="font-black text-amber-800 mb-1">AI Exam Pattern Summary</h3>
                        <p className="text-amber-700 text-sm leading-relaxed">{selectedPYQ.summary}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Importance:</p>
                    {['Very High', 'High', 'Medium', 'Low'].map((level) => (
                      <div key={level} className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${importanceConfig[level].dot}`}></div>
                        <span className="text-xs font-semibold text-gray-500">{level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-50">
                    <h3 className="font-black text-gray-800">Important Topics by Priority</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Sorted by exam frequency score</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {selectedPYQ.importantTopics
                      ?.sort((a, b) => b.frequency - a.frequency)
                      .map((topic, i) => {
                        const config = importanceConfig[topic.importance] || importanceConfig['Medium']
                        return (
                          <div key={i} className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                              i === 0 ? 'bg-yellow-100 text-yellow-700' :
                              i === 1 ? 'bg-gray-100 text-gray-600' :
                              i === 2 ? 'bg-amber-50 text-amber-600' :
                              'bg-gray-50 text-gray-400'
                            }`}>
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h4 className="font-black text-gray-800">{topic.topic}</h4>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${config.color}`}>
                                  {topic.importance}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${config.bar} transition-all duration-700`}
                                    style={{ width: `${topic.frequency * 10}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-black text-gray-500 w-20 text-right">
                                  {topic.frequency}/10 score
                                </span>
                              </div>
                              {topic.reason && (
                                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5">
                                  💡 {topic.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PYQAnalyzer