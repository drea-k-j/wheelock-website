import { useState, useEffect } from 'react'
import api from '../api'
import LinkableHeading from './LinkableHeading'

const SUBSECTIONS = ['Manual', 'Application', 'Key Dates']


const DEFAULT_CONTENT = {
  'Manual': <a href="/assets/residents_manual.pdf" download className="inline-block bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90 mt-2">Download the Residents' Manual</a>,
  'Application': 'Interested in becoming a resident? Please fill out the application form linked below. Applications are reviewed on a rolling basis.',
  'Key Dates': 'Application Deadline TBA\nDecision Notifications TBA'
}

export default function Residents() {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchResidents()
  }, [])

  useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.slice(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [sections])

  const fetchResidents = async () => {
    try {
      const response = await api.get('/api/residents')
      const data = {}
      response.data.forEach(section => {
        data[section.subsection] = section.content
      })
      setSections(data)
    } catch (error) {
      console.error('Error fetching Residents:', error)
      setSections(DEFAULT_CONTENT)
    } finally {
      setLoading(false)
    }
  }

  const getSectionContent = (subsection) => {
    if (sections[subsection] !== undefined && sections[subsection] !== null) {
      return sections[subsection]
    }
    return DEFAULT_CONTENT[subsection] || ''
  }

  const handleSave = async (subsection) => {
    try {
      await api.post('/api/residents', { 
        subsection, 
        content: editingContent 
      })
      setEditingSection(null)
      fetchResidents()
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  const startEdit = (subsection) => {
    setEditingSection(subsection)
    setEditingContent(getSectionContent(subsection))
  }

  if (loading) {
    return <section className="py-12 px-4 text-center"><p>Loading...</p></section>
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Residents</h1>

        <div className="grid gap-8">
          {SUBSECTIONS.map(subsection => (
            <div key={subsection} className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <LinkableHeading level={2} className="text-2xl font-bold text-wheelock-dark">
                  {subsection}
                </LinkableHeading>
                {isAdminMode && editingSection !== subsection && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      startEdit(subsection)
                    }}
                    className="text-wheelock-secondary hover:text-wheelock-accent text-sm"
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
                      className="bg-success text-white px-4 py-2 rounded hover:opacity-90"
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
                <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed w-full">
                  {sections[subsection] !== undefined ? sections[subsection] : DEFAULT_CONTENT[subsection] || 'No content yet.'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
