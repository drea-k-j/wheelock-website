import { useState, useEffect } from 'react'
import api from '../api'
import LinkableHeading from './LinkableHeading'
import PhotoGallery from './PhotoGallery'

const DEFAULT_CONTENT = {
  'About': 'an about',
  'Mission': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Vision': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Et quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut quid aliquid ex ea commodi consequatur.',
  'History': 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.\n\nEt harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.', 
  'Leadership': 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus. Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
}

export default function About({ isAdminMode }) {
  const [sections, setSections] = useState({})
  const [subsections, setSubsections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    fetchConfig()
    fetchAbout()
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
      const response = await api.get('/api/config/sections/about')
      setSubsections(response.data.subsections || [])
    } catch (error) {
      console.error('Error fetching config:', error)
      setSubsections(['About', 'History', 'Leadership'])
    }
  }

  const fetchAbout = async () => {
    try {
      const response = await api.get('/api/about')
      const data = {}
      response.data.forEach(section => {
        data[section.subsection] = section.content
      })
      setSections(data)
    } catch (error) {
      console.error('Error fetching about:', error)
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
    const normalizedTitle = 'About Wheelock'.toLowerCase().trim()
    const normalizedSubsection = subsection.toLowerCase().trim()
    return normalizedTitle === normalizedSubsection || normalizedTitle.includes(normalizedSubsection)
  })

  const handleSave = async (subsection) => {
    try {
      await api.post('/api/about', { 
        subsection, 
        content: editingContent 
      })
      setEditingSection(null)
      fetchAbout()
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

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-wheelock-dark mb-8">About Wheelock</h1>

        {introContent ? (
          <div className="mb-8 max-w-3xl rounded-xl border-l-4 border-wheelock-accent bg-white p-6 shadow-sm">
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
                  introContent
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

        {/* Photo gallery from About folder - cycles through images every 5 seconds */}
        <PhotoGallery page="about" className="mb-8" />

        <div className="grid gap-8">
          {displayedSubsections.map(subsection => (
            <div key={subsection} className="bg-wheelock-light border-l-4 border-wheelock-accent p-6 rounded shadow">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <LinkableHeading level={2} className="text-2xl font-bold text-wheelock-dark">
                  {subsection}
                </LinkableHeading>
              </div>

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
                <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed w-full">
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
