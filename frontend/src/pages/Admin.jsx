import { useState, useEffect } from 'react'
import api from '../api'

export default function Admin({ setIsAdminMode }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      })
      
      if (response.data.access_token) {
        localStorage.setItem('admin_token', response.data.access_token)
        setIsLoggedIn(true)
        setIsAdminMode(true)
        setUsername('')
        setPassword('')
        // Redirect to home
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsLoggedIn(false)
    setIsAdminMode(false)
    window.location.href = '/'
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-wheelock-dark text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Wheelock Admin</h1>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-wheelock-light"
                  placeholder="Enter username"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-wheelock-light"
                  placeholder="Enter password"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-wheelock-light hover:bg-opacity-90 disabled:bg-gray-600 text-wheelock-dark font-bold py-2 rounded transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Contact a super admin for login credentials
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Logged in view - show success message and redirect
  return (
    <div className="min-h-screen bg-wheelock-dark text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
          <p className="text-gray-300 mb-8">You are now logged in. You can edit content directly on the site pages.</p>
          
          <a 
            href="/"
            className="block w-full bg-wheelock-light hover:bg-opacity-90 text-wheelock-dark font-bold py-3 rounded transition mb-4"
          >
            Go to Home
          </a>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
