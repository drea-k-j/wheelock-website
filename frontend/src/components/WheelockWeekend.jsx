import { useState, useEffect } from 'react'
import axios from 'axios'
import LinkableHeading from './LinkableHeading'
import PhotoGallery from './PhotoGallery'

const SUBSECTIONS = ['Schedule', 'Bios', 'Campus Map', 'Registration']


const DEFAULT_CONTENT = {
  'Schedule': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Bios': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
  'Campus Map': <img src="/assets/campus_map.jpg" alt="Campus Map" className="w-full rounded mt-4" />,
  'Registration': 'For registration, please fill out the Google Form linked below or contact us at wheelock@example.com. Early registration is encouraged.'
}

export default function WheelockWeekend({ isAdminMode }) {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchWheelockWeekend()
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

  const fetchWheelockWeekend = async () => {
    try {
      const response = await axios.get('/api/wheelock-weekend')
      const data = {}
      response.data.forEach(section => {
        data[section.subsection] = section.content
      })
      setSections(data)
    } catch (error) {
      console.error('Error fetching Wheelock Weekend:', error)
      setSections(DEFAULT_CONTENT)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (subsection) => {
    try {
      await axios.post('/api/wheelock-weekend', { 
        subsection, 
        content: editingContent 
      })
      setEditingSection(null)
      fetchWheelockWeekend()
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
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Wheelock Weekend</h1>
        
        {/* Photo gallery from Wheelock Weekend folder - cycles through images every 5 seconds */}
        <PhotoGallery page="wheelock-weekend" className="mb-8" />

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
                  {sections[subsection] || DEFAULT_CONTENT[subsection] || 'No content yet.'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
