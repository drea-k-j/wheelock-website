import { useState, useEffect } from 'react'
import api from '../api'
import LinkableHeading from './LinkableHeading'
import PhotoGallery from './PhotoGallery'
import MarkdownContent from './MarkdownContent'

const DEFAULT_CONTENT = {
  'Wheelock Weekend': 'Wheelock Weekend brings alumni, students, and guests together for a full schedule of events, meals, and debrief sessions. Stay connected, learn about campus resources, and experience the Wheelock community.',
  'Schedule': 'This weekend: 4/17-4/19\n\n4pm 4/18 — Veritas Forum\n\nPlease check in at the Wheelock welcome desk and refer to the printed schedule for session locations, meals, and breakout rooms.',
  'Registration': 'For registration, please fill out the Google Form linked below or contact us at wheelock@example.com. Early registration is encouraged.'
}

export default function WheelockWeekend({ isAdminMode }) {
  const [subsections, setSubsections] = useState([])
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchConfig()
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
  }, [sections, subsections])

  const fetchConfig = async () => {
    try {
      const response = await api.get('/api/config/sections/wheelock-weekend')
      setSubsections(response.data.subsections || [])
    } catch (error) {
      console.error('Error fetching config:', error)
      setSubsections(['Wheelock Weekend', 'Schedule', 'Bios', 'Campus Map', 'Registration'])
    }
  }

  const fetchWheelockWeekend = async () => {
    try {
      const response = await api.get('/api/wheelock-weekend')
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

  const getSectionContent = (subsection) => {
    if (sections[subsection] !== undefined && sections[subsection] !== null) {
      return sections[subsection]
    }
    return typeof DEFAULT_CONTENT[subsection] === 'string'
      ? DEFAULT_CONTENT[subsection]
      : ''
  }

  const fallbackSections = ['Wheelock Weekend', 'Schedule', 'Bios', 'Campus Map', 'Registration']
  const sectionList = subsections.length ? Array.from(new Set([...subsections, ...fallbackSections])) : fallbackSections
  const pageIntroSubsection = sectionList.find(subsection => {
    const normalizedTitle = 'Wheelock Weekend'.toLowerCase().trim()
    const normalizedSubsection = subsection.toLowerCase().trim()
    return normalizedTitle === normalizedSubsection || normalizedTitle.includes(normalizedSubsection)
  })

  const handleSave = async (subsection) => {
    try {
      await api.post('/api/wheelock-weekend', { 
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
    setEditingContent(getSectionContent(subsection))
  }

  const renderSectionContent = (subsection) => {
    const content = sections[subsection] !== undefined ? sections[subsection] : DEFAULT_CONTENT[subsection] || 'No content yet.'
    const textContent = (
      <MarkdownContent content={content} />
    )

    if (subsection === 'Campus Map') {
      return (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <img
              src="/assets/campus_map.jpg"
              alt="Campus Map"
              className="w-full object-cover"
            />
          </div>
          {textContent}
        </div>
      )
    }

    return textContent
  }

  if (loading) {
    return <section className="py-12 px-4 text-center"><p>Loading...</p></section>
  }

  const introContent = pageIntroSubsection ? getSectionContent(pageIntroSubsection) : ''
  const displayedSubsections = sectionList.filter(subsection => subsection !== pageIntroSubsection)

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">Wheelock Weekend</h1>

        {introContent ? (
          <div className="mb-8 max-w-3xl rounded-xl border-l-4 border-wheelock-accent bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="md:flex-1">
                {editingSection === pageIntroSubsection ? (
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows="6"
                    className="w-full border rounded px-3 py-2 font-sans"
                  />
                ) : (
                  <p className="text-xl leading-8 text-gray-800 whitespace-pre-line">
                    {introContent}
                  </p>
                )}
              </div>
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

        {/* Photo gallery from Wheelock Weekend folder - cycles through images every 5 seconds */}
        <PhotoGallery page="wheelock-weekend" className="mb-8" />

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
