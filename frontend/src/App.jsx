import { useState, useEffect } from 'react'
import Header from './components/Header'
import Announcements from './components/Announcements'
import About from './components/About'
import WheelockHouse from './components/WheelockHouse'
import WheelockWeekend from './components/WheelockWeekend'
import Residents from './components/Residents'
import Connect from './components/Connect'
import Footer from './components/Footer'
import Admin from './pages/Admin'

function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Check for admin token on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAdminMode(true)
    }
  }, [])

  // Show admin page if on /admin route (accept trailing slash)
  const normalizedPath = window.location.pathname.replace(/\/+$, '')
  if (normalizedPath === '/admin') {
    return <Admin setIsAdminMode={setIsAdminMode} />
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAdminMode(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        onAdminLogout={handleAdminLogout}
      />
      
      {currentSection === 'home' && (
        <>
          <Announcements isAdminMode={isAdminMode} />
        </>
      )}
      {currentSection === 'about' && <About isAdminMode={isAdminMode} />}
      {currentSection === 'wheelock-house' && <WheelockHouse isAdminMode={isAdminMode} />}
      {currentSection === 'wheelock-weekend' && <WheelockWeekend isAdminMode={isAdminMode} />}
      {currentSection === 'residents' && <Residents isAdminMode={isAdminMode} />}
      {currentSection === 'connect' && <Connect />}
      
      <Footer />
    </div>
  )
}


export default App
