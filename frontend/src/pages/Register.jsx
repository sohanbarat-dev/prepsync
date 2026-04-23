import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import toast from 'react-hot-toast'

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/auth/register', formData)
      login(res.data.user, res.data.token)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-purple-100">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-5">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-4xl font-black mb-2 text-purple-600">
            PrepSync
          </h1>
          <p className="text-gray-400 text-base">Smart Exam Prep for KIIT Students</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">Create your account 🎓</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sohan Barat"
              required
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-base transition"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              KIIT Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@kiit.ac.in"
              required
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-base transition"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-base transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-4 rounded-2xl transition duration-200 disabled:opacity-50 active:scale-95 text-base mt-2 bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 border-t border-gray-100"></div>
          <span className="px-3 text-sm text-gray-400">KIIT students only</span>
          <div className="flex-1 border-t border-gray-100"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-base text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register