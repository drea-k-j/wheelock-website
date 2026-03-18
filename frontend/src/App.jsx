import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Announcements from './components/Announcements'
import About from './components/About'
import WheelockHouse from './components/WheelockHouse'
import Footer from './components/Footer'

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />
      
      {currentSection === 'home' && (
        <>
          <Hero />
          <Announcements isAdminMode={isAdminMode} />
        </>
      )}
      {currentSection === 'about' && <About isAdminMode={isAdminMode} />}
      {currentSection === 'wheelock-house' && <WheelockHouse isAdminMode={isAdminMode} />}
      
      <Footer />
    </div>
  )
}

export default App
