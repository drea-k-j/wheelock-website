import { useState } from 'react'

export default function Header({ currentSection, setCurrentSection, isAdminMode, setIsAdminMode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-wheelock-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <button 
          onClick={() => {
            setCurrentSection('home')
            setMenuOpen(false)
          }}
          className="text-2xl font-bold hover:text-wheelock-light transition"
        >
          Wheelock
        </button>

        <nav className="hidden md:flex gap-6 items-center">
          <button 
            onClick={() => setCurrentSection('home')}
            className={`px-3 py-2 rounded transition ${currentSection === 'home' ? 'bg-wheelock-accent' : 'hover:bg-blue-900'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentSection('about')}
            className={`px-3 py-2 rounded transition ${currentSection === 'about' ? 'bg-wheelock-accent' : 'hover:bg-blue-900'}`}
          >
            About
          </button>
          <button 
            onClick={() => setCurrentSection('wheelock-house')}
            className={`px-3 py-2 rounded transition ${currentSection === 'wheelock-house' ? 'bg-wheelock-accent' : 'hover:bg-blue-900'}`}
          >
            Wheelock House
          </button>
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`ml-4 px-3 py-2 rounded text-sm ${isAdminMode ? 'bg-wheelock-accent' : 'bg-slate-600'} hover:opacity-80 transition`}
          >
            {isAdminMode ? 'Exit Admin' : 'Admin'}
          </button>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-2 py-1 rounded text-sm ${isAdminMode ? 'bg-wheelock-accent' : 'bg-slate-600'}`}
          >
            {isAdminMode ? 'Exit' : 'Admin'}
          </button>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-blue-900 px-4 py-3 flex flex-col gap-2">
          <button 
            onClick={() => {
              setCurrentSection('home')
              setMenuOpen(false)
            }}
            className={`px-3 py-2 rounded transition text-left ${currentSection === 'home' ? 'bg-wheelock-accent' : 'hover:bg-blue-800'}`}
          >
            Home
          </button>
          <button 
            onClick={() => {
              setCurrentSection('about')
              setMenuOpen(false)
            }}
            className={`px-3 py-2 rounded transition text-left ${currentSection === 'about' ? 'bg-wheelock-accent' : 'hover:bg-blue-800'}`}
          >
            About
          </button>
          <button 
            onClick={() => {
              setCurrentSection('wheelock-house')
              setMenuOpen(false)
            }}
            className={`px-3 py-2 rounded transition text-left ${currentSection === 'wheelock-house' ? 'bg-wheelock-accent' : 'hover:bg-blue-800'}`}
          >
            Wheelock House
          </button>
        </nav>
      )}
    </header>
  )
}
