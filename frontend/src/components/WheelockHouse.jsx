import { useState, useEffect } from 'react'
import axios from 'axios'

const SUBSECTIONS = ['About', 'Contact', 'Reservations']

export default function WheelockHouse({ isAdminMode }) {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchWheelockHouse()
  }, [])

  const fetchWheelockHouse = async () => {
    try {
      const response = await axios.get('/api/wheelock-house')
      const data = {}
      response.data.forEach(section => {
        data[section.subsection] = section.content
      })
      setSections(data)
    } catch (error) {
      console.error('Error fetching Wheelock House:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (subsection) => {
    try {
      await axios.post('/api/wheelock-house', { 
        subsection, 
        content: editingContent 
      })
      setEditingSection(null)
      fetchWheelockHouse()
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  const startEdit = (subsection) => {
    setEditingSection(subsection)
    setEditingContent(sections[subsection] || '')
  }

  if (loading) {
    return <section className="py-12 px-4 text-center"><p>Loading...</p></section>
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Wheelock House</h1>

        <div className="grid gap-8">
          {SUBSECTIONS.map(subsection => (
            <div key={subsection} className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold text-wheelock-dark">{subsection}</h2>
                {isAdminMode && editingSection !== subsection && (
                  <button 
                    onClick={() => startEdit(subsection)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editingSection === subsection ? (
                <div className="space-y-3">
                  <textarea 
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows="6"
                    className="w-full border rounded px-3 py-2 font-sans"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave(subsection)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingSection(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:opacity-90"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {sections[subsection] || 'No content yet.'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
