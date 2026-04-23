import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'My Planner', path: '/planner' },
  { label: 'Study Hub', path: '/study-hub' },
  { label: 'PYQ Analysis', path: '/pyq-analyzer' },
  { label: 'Progress', path: '/progress' },
  { label: 'Gyani', path: '/doubt-bot' },
]

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">

      {/* Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white text-lg font-black">P</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-purple-600 leading-none">PrepSync</h1>
          <p className="text-xs text-gray-400 leading-none mt-0.5">Sync your syllabus. Own your exam.</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
              location.pathname === link.path
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-700">{user?.name?.split(' ')[0]}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-50 hover:bg-red-100 text-red-500 font-semibold px-4 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar