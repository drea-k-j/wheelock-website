import { useState, useEffect } from 'react'
import api from '../api'
import LinkableHeading from './LinkableHeading'
import PhotoGallery from './PhotoGallery'
import MarkdownContent from './MarkdownContent'

const DEFAULT_CONTENT = {
  'Wheelock House': 'Wheelock House provides short-term residency, community programming, and event space for Wheelock House guests. Our goal is to make every stay comfortable, welcoming, and easy to engage with campus life.\n\nLearn more about [the Christian study center movement](https://cscmovement.org).',
  'Calendar': 'Check the calendar below for upcoming gatherings and availability.',
  'Reservations': 'Use the form below to request a reservation or visit.',
}

export default function WheelockHouse({ isAdminMode }) {
  const [sections, setSections] = useState({})
  const [subsections, setSubsections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchConfig()
    fetchWheelockHouse()
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

  const fetchConfig = async () => {
    try {
      const response = await api.get('/api/config/sections/wheelock-house')
      setSubsections(response.data.subsections || [])
    } catch (error) {
      console.error('Error fetching config:', error)
      setSubsections(['Wheelock House', 'Calendar', 'Reservations'])
    }
  }

  const fetchWheelockHouse = async () => {
    try {
      const response = await api.get('/api/wheelock-house')
      const data = {}
      response.data.forEach(section => {
        data[section.subsection] = section.content
      })
      setSections(data)
    } catch (error) {
      console.error('Error fetching Wheelock House:', error)
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

  const pageIntroSubsection = subsections.find(subsection => {
    const normalizedTitle = 'Wheelock House'.toLowerCase().trim()
    const normalizedSubsection = subsection.toLowerCase().trim()
    return normalizedTitle === normalizedSubsection || normalizedTitle.includes(normalizedSubsection)
  })

  const handleSave = async (subsection) => {
    try {
      await api.post('/api/wheelock-house', { 
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
    setEditingContent(getSectionContent(subsection))
  }

  if (loading) {
    return <section className="py-12 px-4 text-center"><p>Loading...</p></section>
  }

  const introContent = pageIntroSubsection ? getSectionContent(pageIntroSubsection) : ''
  const displayedSubsections = subsections.filter(subsection => subsection !== pageIntroSubsection)

  const renderSectionContent = (subsection) => {
    const content = sections[subsection] !== undefined ? sections[subsection] : DEFAULT_CONTENT[subsection] || 'No content yet.'

    if (subsection === 'Calendar') {
      return (
        <div className="space-y-4">
          <p className="text-gray-800 leading-relaxed">{content}</p>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=d2hlZWxvY2tzb2NpZXR5QGdtYWlsLmNvbQ"
              style={{ border: 0, width: '100%', minHeight: '420px' }}
              title="Wheelock House calendar"
            />
          </div>
        </div>
      )
    }

    if (subsection === 'Reservations') {
      return (
        <div className="space-y-4">
          <p className="text-gray-800 leading-relaxed">{content}</p>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdAT6EVv761wOPRQ0eK4amheye-onepnT0NzXX4lnzMnG9ACw/viewform?embedded=true"
              style={{ border: 0, width: '100%', minHeight: '780px' }}
              title="Wheelock House reservations form"
            />
          </div>
        </div>
      )
    }

    return <MarkdownContent content={content} />
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Wheelock House</h1>

        {introContent ? (
          <div className="mb-8 w-full rounded-xl border-l-4 border-wheelock-accent bg-wheelock-light-alt p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <p className="text-xl leading-8 text-gray-800 whitespace-pre-wrap md:flex-1">
                {editingSection === pageIntroSubsection ? (
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows="6"
                    className="w-full border rounded px-3 py-2 font-sans"
                  />
                ) : (
                  <MarkdownContent content={introContent} className="md:flex-1" />
                )}
              </p>
              {isAdminMode && editingSection !== pageIntroSubsection && (
                <button
                  onClick={() => startEdit(pageIntroSubsection)}
                  className="text-wheelock-secondary hover:text-wheelock-accent text-sm self-start"
                >
                  Edit
                </button>
              )}
            </div>
            {editingSection === pageIntroSubsection && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(pageIntroSubsection)}
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
            )}
          </div>
        ) : null}

        {/* Photo gallery from Wheelock House folder - cycles through images every 5 seconds */}
        <PhotoGallery page="wheelock-house" className="mb-8" />

        <div className="grid gap-8">
          {displayedSubsections.map(subsection => (
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
                renderSectionContent(subsection)
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
