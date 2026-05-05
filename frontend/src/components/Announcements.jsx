import { useState, useEffect } from 'react'
import api from '../api'
import PhotoGallery from './PhotoGallery'

export default function Announcements({ isAdminMode }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', is_featured: false })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/api/announcements')
      setAnnouncements(response.data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/announcements', formData)
      setFormData({ title: '', content: '', is_featured: false })
      setShowForm(false)
      fetchAnnouncements()
    } catch (error) {
      console.error('Error creating announcement:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this announcement?')) {
      try {
        await api.delete(`/api/announcements/${id}`)
        fetchAnnouncements()
      } catch (error) {
        console.error('Error deleting announcement:', error)
      }
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-wheelock-dark mb-8">Announcements</h2>
        
        {/* Photo gallery from Announcements folder - cycles through images every 5 seconds */}
        <PhotoGallery page="announcements" className="mb-8" />

        {isAdminMode && (
          <div className="mb-8 bg-wheelock-light-alt p-6 rounded-lg shadow">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90 transition mb-4"
            >
              {showForm ? '✕ Cancel' : '+ New Announcement'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <textarea 
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="5"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  />
                  <span>Featured on homepage</span>
                </label>
                <button 
                  type="submit"
                  className="bg-success text-white px-4 py-2 rounded hover:opacity-90 transition"
                >
                  Save Announcement
                </button>
              </form>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-600">No announcements yet</p>
        ) : (
          <div className="grid gap-6">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-wheelock-dark mb-2">{announcement.title}</h3>
                    {announcement.is_featured && (
                      <span className="inline-block bg-wheelock-accent text-white text-xs px-2 py-1 rounded mb-2">Featured</span>
                    )}
                    <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                    <p className="text-sm text-gray-600 mt-3">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {isAdminMode && (
                    <button 
                      onClick={() => handleDelete(announcement.id)}
                      className="ml-4 text-error hover:text-error text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
