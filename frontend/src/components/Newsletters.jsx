import { useState, useEffect } from 'react'
import axios from 'axios'
import LinkableHeading from './LinkableHeading'

const SUBSECTIONS = ['Sign-up']

const DEFAULT_CONTENT = {
  'Sign-up': 'Subscribe to our monthly newsletter to stay updated on Wheelock House events, announcements, and community news.\n\nEnter your email below to join our mailing list, or click the button to sign up directly.'
}

export default function Newsletters({ isAdminMode }) {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchNewsletters()
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

  const fetchNewsletters = async () => {
    try {
      const response = await axios.get('/api/newsletters')
      const data = {}
      response.data.forEach(section => {
        data[section.subsection] = section.content
      })
      setSections(data)
    } catch (error) {
      console.error('Error fetching Newsletters:', error)
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
      await axios.post('/api/newsletters', { 
        subsection, 
        content: editingContent 
      })
      setEditingSection(null)
      fetchNewsletters()
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
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Newsletters</h1>

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
                <div>
                  <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed w-full mb-4">
                    {sections[subsection] !== undefined ? sections[subsection] : DEFAULT_CONTENT[subsection] || 'No content yet.'}
                  </p>
                  
                  {!isAdminMode && (
                    <div className="mt-4">
                      <a 
                        href="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-wheelock-accent text-white px-4 py-2 rounded hover:opacity-90"
                      >
                        Subscribe to Newsletter
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
