import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './Login'

const scrollToSubsection = (subsection) => {
  const id = subsection.toLowerCase().replace(/\s+/g, '-')
  window.location.hash = id
}

const clearHash = () => {
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

export default function Header({ currentSection, setCurrentSection, isAdminMode, setIsAdminMode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const [sectionsConfig, setSectionsConfig] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSectionsConfig()
  }, [])

  const fetchSectionsConfig = async () => {
    try {
      const response = await axios.get('/api/config/sections')
      setSectionsConfig(response.data)
    } catch (error) {
      console.error('Error fetching sections config:', error)
      setError(error)
    }
  }

  // Don't render navigation if config fails to load
  if (error || !sectionsConfig) {
    return (
      <header className="bg-wheelock-dark text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => setCurrentSection('home')}
            className="text-2xl font-bold hover:text-wheelock-light transition"
          >
            The Wheelock Society
          </button>
          {error && <p className="text-error text-sm">Navigation unavailable</p>}
          <Login isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        </div>
      </header>
    )
  }

  const renderSubsectionButtons = (sectionKey, subsections, isMobile = false) => {
    return subsections.map(sub => (
      <button
        key={sub}
        onClick={() => {
          setCurrentSection(sectionKey)
          setTimeout(() => scrollToSubsection(sub), 0)
          if (isMobile) {
            setMenuOpen(false)
            setExpandedSection(null)
          }
        }}
        className={isMobile ? "px-2 py-1 text-sm hover:bg-gray-700 rounded text-left" : "w-full text-left px-4 py-2 hover:bg-wheelock-accent transition first:rounded-t last:rounded-b"}
      >
        {sub}
      </button>
    ))
  }

  return (
    <header className="bg-wheelock-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <button 
          onClick={() => {
            clearHash()
            setCurrentSection('home')
            setMenuOpen(false)
          }}
          className="text-2xl font-bold hover:text-wheelock-light transition"
        >
          The Wheelock Society
        </button>

        <nav className="hidden md:flex gap-6 items-center">
          <button 
            onClick={() => {
              clearHash()
              setCurrentSection('home')
            }}
            className={`px-3 py-2 rounded transition ${currentSection === 'home' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
          >
            Home
          </button>
          
          <div className="relative group">
            <button 
              onClick={() => {
                clearHash()
                setCurrentSection('about')
              }}
              className={`px-3 py-2 rounded transition ${currentSection === 'about' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              About
            </button>
            <div className="absolute left-0 mt-0 w-40 bg-gray-700 text-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {renderSubsectionButtons('about', sectionsConfig.about.subsections)}
            </div>
          </div>

          <div className="relative group">
            <button 
              onClick={() => {
                clearHash()
                setCurrentSection('wheelock-house')
              }}
              className={`px-3 py-2 rounded transition ${currentSection === 'wheelock-house' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              Wheelock House
            </button>
            <div className="absolute left-0 mt-0 w-40 bg-gray-700 text-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {renderSubsectionButtons('wheelock-house', sectionsConfig['wheelock-house'].subsections)}
            </div>
          </div>

          <div className="relative group">
            <button 
              onClick={() => {
                clearHash()
                setCurrentSection('wheelock-weekend')
              }}
              className={`px-3 py-2 rounded transition ${currentSection === 'wheelock-weekend' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              Wheelock Weekend
            </button>
            <div className="absolute left-0 mt-0 w-40 bg-gray-700 text-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {renderSubsectionButtons('wheelock-weekend', sectionsConfig['wheelock-weekend'].subsections)}
            </div>
          </div>

          <div className="relative group">
            <button 
              onClick={() => {
                clearHash()
                setCurrentSection('residents')
              }}
              className={`px-3 py-2 rounded transition ${currentSection === 'residents' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              Residents
            </button>
            <div className="absolute left-0 mt-0 w-40 bg-gray-700 text-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {renderSubsectionButtons('residents', sectionsConfig.residents.subsections)}
            </div>
          </div>

          <button 
              onClick={() => {
                clearHash()
                setCurrentSection('newsletters')
              }}
          >
            Newsletters
          </button>

          <Login isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <Login isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-gray-700 px-4 py-3 flex flex-col gap-2">
          <button 
            onClick={() => {
              clearHash()
              setCurrentSection('home')
              setMenuOpen(false)
            }}
            className={`px-3 py-2 rounded transition text-left ${currentSection === 'home' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
          >
            Home
          </button>

          <div>
            <button 
              onClick={() => {
                if (expandedSection === 'about') {
                  setExpandedSection(null)
                } else {
                  clearHash()
                  setExpandedSection('about')
                  setCurrentSection('about')
                }
              }}
              className={`w-full px-3 py-2 rounded transition text-left flex justify-between items-center ${currentSection === 'about' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              About
              <span className={`transition-transform ${expandedSection === 'about' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedSection === 'about' && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-700 pl-2">
                {renderSubsectionButtons('about', sectionsConfig.about.subsections, true)}
              </div>
            )}
          </div>

          <div>
            <button 
              onClick={() => {
                if (expandedSection === 'wheelock-house') {
                  setExpandedSection(null)
                } else {
                  clearHash()
                  setExpandedSection('wheelock-house')
                  setCurrentSection('wheelock-house')
                }
              }}
              className={`w-full px-3 py-2 rounded transition text-left flex justify-between items-center ${currentSection === 'wheelock-house' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              Wheelock House
              <span className={`transition-transform ${expandedSection === 'wheelock-house' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedSection === 'wheelock-house' && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-700 pl-2">
                {renderSubsectionButtons('wheelock-house', sectionsConfig['wheelock-house'].subsections, true)}
              </div>
            )}
          </div>

          <div>
            <button 
              onClick={() => {
                if (expandedSection === 'wheelock-weekend') {
                  setExpandedSection(null)
                } else {
                  clearHash()
                  setExpandedSection('wheelock-weekend')
                  setCurrentSection('wheelock-weekend')
                }
              }}
              className={`w-full px-3 py-2 rounded transition text-left flex justify-between items-center ${currentSection === 'wheelock-weekend' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              Wheelock Weekend
              <span className={`transition-transform ${expandedSection === 'wheelock-weekend' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedSection === 'wheelock-weekend' && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-700 pl-2">
                {renderSubsectionButtons('wheelock-weekend', sectionsConfig['wheelock-weekend'].subsections, true)}
              </div>
            )}
          </div>

          <div>
            <button 
              onClick={() => {
                if (expandedSection === 'residents') {
                  setExpandedSection(null)
                } else {
                  clearHash()
                  setExpandedSection('residents')
                  setCurrentSection('residents')
                }
              }}
              className={`w-full px-3 py-2 rounded transition text-left flex justify-between items-center ${currentSection === 'residents' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
            >
              Residents
              <span className={`transition-transform ${expandedSection === 'residents' ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {expandedSection === 'residents' && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-700 pl-2">
                {renderSubsectionButtons('residents', sectionsConfig.residents.subsections, true)}
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              clearHash()
              setCurrentSection('newsletters')
              setMenuOpen(false)
            }}
            className={`px-3 py-2 rounded transition text-left ${currentSection === 'newsletters' ? 'bg-wheelock-accent' : 'hover:bg-gray-700'}`}
          >
            Newsletters
          </button>
        </nav>
      )}
    </header>
  )
}
