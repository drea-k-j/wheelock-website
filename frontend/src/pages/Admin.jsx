import { useState, useEffect } from 'react'
import api from '../api'

export default function Admin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentSection, setCurrentSection] = useState('about')

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
        setUsername('')
        setPassword('')
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
    setCurrentSection('about')
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

  // Logged in view
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-wheelock-dark text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4">Content Sections</h2>
              <div className="space-y-2">
                {['about', 'wheelock-house', 'wheelock-weekend', 'residents', 'newsletters', 'announcements'].map(section => (
                  <button
                    key={section}
                    onClick={() => setCurrentSection(section)}
                    className={`block w-full text-left px-4 py-2 rounded transition ${
                      currentSection === section
                        ? 'bg-wheelock-light text-wheelock-dark font-bold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {section.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-8">
              <AdminSection section={currentSection} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminSection({ section }) {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchContent()
  }, [section])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const endpoints = {
        'about': '/api/about',
        'wheelock-house': '/api/wheelock-house',
        'wheelock-weekend': '/api/wheelock-weekend',
        'residents': '/api/residents',
        'newsletters': '/api/newsletters',
        'announcements': '/api/announcements'
      }

      const response = await api.get(endpoints[section])
      
      if (Array.isArray(response.data)) {
        const contentObj = {}
        response.data.forEach(item => {
          contentObj[item.subsection || item.title] = item.content || item
        })
        setContent(contentObj)
      } else {
        setContent(response.data)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (key) => {
    try {
      const endpoints = {
        'about': '/api/about',
        'wheelock-house': '/api/wheelock-house',
        'wheelock-weekend': '/api/wheelock-weekend',
        'residents': '/api/residents',
        'newsletters': '/api/newsletters'
      }

      if (endpoints[section]) {
        await api.post(endpoints[section], {
          subsection: key,
          content: editValue
        })
        setContent({...content, [key]: editValue})
        setEditingKey(null)
      }
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (section === 'announcements') {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Announcements</h2>
        <p className="text-gray-600">Announcements are managed from the public website home page. Admin users can add, edit, and delete announcements directly from the website interface.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{section.replace('-', ' ').toUpperCase()}</h2>
      
      <div className="space-y-6">
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="border border-gray-300 rounded p-4">
            <h3 className="font-bold text-lg mb-3">{key}</h3>
            
            {editingKey === key ? (
              <div className="space-y-3">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full h-48 p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-wheelock-light"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(key)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingKey(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                  {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                </p>
                <button
                  onClick={() => {
                    setEditingKey(key)
                    setEditValue(typeof value === 'string' ? value : JSON.stringify(value, null, 2))
                  }}
                  className="bg-wheelock-light hover:bg-opacity-90 text-wheelock-dark px-4 py-2 rounded transition"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
