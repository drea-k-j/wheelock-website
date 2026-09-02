import { useState } from 'react'
import api from '../api'

export default function Login({ isAdminMode, setIsAdminMode }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      })
      
      localStorage.setItem('admin_token', response.data.access_token)
      setIsAdminMode(true)
      setShowLoginModal(false)
      setUsername('')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAdminMode(false)
  }

  if (isAdminMode) {
    return (
      <button 
        onClick={handleLogout}
        className="ml-4 px-3 py-2 rounded text-sm bg-wheelock-accent hover:opacity-80 transition"
      >
        Exit Admin
      </button>
    )
  }

  return (
    <>
      <button 
        onClick={() => setShowLoginModal(true)}
        className="ml-4 px-3 py-2 rounded text-sm bg-gray-600 hover:opacity-80 transition"
      >
        Admin
      </button>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-wheelock-light-alt rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-wheelock-dark mb-4">Admin Login</h2>
            
            {error && (
              <div className="bg-error_light border border-error text-error px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-wheelock-accent focus:ring-2 focus:ring-wheelock-accent focus:ring-opacity-20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-wheelock-accent focus:ring-2 focus:ring-wheelock-accent focus:ring-opacity-20"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
