import { useState } from 'react'
import Header from './components/Header'
import Announcements from './components/Announcements'
import About from './components/About'
import WheelockHouse from './components/WheelockHouse'
import WheelockWeekend from './components/WheelockWeekend'
import Residents from './components/Residents'
import Newsletters from './components/Newsletters'
import Footer from './components/Footer'
import Admin from './pages/Admin'

function App() {
  const [currentSection, setCurrentSection] = useState('home')

  // Show admin page if on /admin route
  if (window.location.pathname === '/admin') {
    return <Admin />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
      />
      
      {currentSection === 'home' && (
        <>
          <Announcements />
        </>
      )}
      {currentSection === 'about' && <About />}
      {currentSection === 'wheelock-house' && <WheelockHouse />}
      {currentSection === 'wheelock-weekend' && <WheelockWeekend />}
      {currentSection === 'residents' && <Residents />}
      {currentSection === 'newsletters' && <Newsletters />}
      
      <Footer />
    </div>
  )
}

export default App
