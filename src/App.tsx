
// src/App.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import ContactForm from './components/ContactForm/ContactForm'
import AboutSection from './components/AboutSection/AboutSection'
import ShowsSection from './components/ShowsSection/ShowsSection'

// Section types
type SectionType = 'home' | 'music' | 'shows' | 'about' | 'contact';

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const showSection = (section: SectionType) => {
    if (section === 'home') {
      setIsPanelOpen(false);
      setActiveSection('home');
    } else {
      setActiveSection(section);
      setIsPanelOpen(true);
    }
  };

  return (
    <Layout>
      {/* Main landing content - always visible */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 ${isPanelOpen ? 'md:left-0 md:right-1/2 md:transform-none' : ''}`}
        style={{ pointerEvents: isPanelOpen ? 'none' : 'auto' }}
      >
        <div className="logo-container mb-10 w-32 h-32 relative">
          <div className="logo animate-pulsate">
            <div className="logo-shape logo-center absolute w-[40%] h-[40%] left-[30%] top-[30%] bg-gradient-to-tr from-accent-DEFAULT to-accent-light transform rotate-45"></div>
            <div className="logo-shape logo-top absolute w-[40%] h-[40%] left-[30%] top-0 bg-gradient-to-tr from-primary-DEFAULT to-primary-light transform rotate-45"></div>
            <div className="logo-shape logo-right absolute w-[40%] h-[40%] right-0 top-[30%] bg-gradient-to-tr from-primary-DEFAULT to-primary-light transform rotate-45"></div>
            <div className="logo-shape logo-bottom absolute w-[40%] h-[40%] left-[30%] bottom-0 bg-gradient-to-tr from-primary-DEFAULT to-primary-light transform rotate-45"></div>
            <div className="logo-shape logo-left absolute w-[40%] h-[40%] left-0 top-[30%] bg-gradient-to-tr from-primary-DEFAULT to-primary-light transform rotate-45"></div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-light tracking-[0.15em] mb-5 gradient-text">
          ARCOVA
        </h1>
        <p className="tagline text-sm tracking-[0.2em] mb-16 opacity-60 uppercase text-gray-700">
          Sonic Explorations of Data & Space
        </p>
        
        <div className="music-player w-full max-w-md h-0.5 mb-16 bg-gray-200 rounded relative cursor-pointer hover:h-1 transition-all duration-300">
          <div className="progress absolute w-[30%] h-full bg-gradient-to-r from-accent-light to-accent-DEFAULT rounded"></div>
        </div>

        <div className="navigation flex justify-center flex-wrap gap-5 md:gap-8 mb-16">
          <motion.button
            onClick={() => showSection('music')}
            className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Music
          </motion.button>
          
          <motion.button
            onClick={() => showSection('shows')}
            className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shows
          </motion.button>
          
          <motion.button
            onClick={() => showSection('about')}
            className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            About
          </motion.button>
          
          <motion.button
            onClick={() => showSection('contact')}
            className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.button>
        </div>

        <div className="social-icons flex justify-center gap-5 md:gap-8">
          {/* Replace with your actual social icons */}
          <a href="https://soundcloud.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
          <a href="https://spotify.com/artist/your-id" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
          <a href="https://instagram.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
          <a href="https://youtube.com/your-channel" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
        </div>
      </div>

      {/* Side panel for content */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            className="absolute inset-0 md:left-1/2 backdrop-blur-sm p-4 md:p-8 overflow-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Close button - visible on mobile and optionally on desktop */}
            <button 
              onClick={() => showSection('home')}
              className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md"
            >
              ✕
            </button>

            {/* Dynamic content based on active section */}
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-5 md:p-8 h-full overflow-auto">
              {activeSection === 'music' && <MusicPlayer />}
              {activeSection === 'shows' && <ShowsSection />}
              {activeSection === 'about' && <AboutSection />}
              {activeSection === 'contact' && <ContactForm />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default App