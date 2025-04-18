// src/App.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import ContactForm from './components/ContactForm/ContactForm'
import AboutSection from './components/AboutSection/AboutSection'
import ShowsSection from './components/ShowsSection/ShowsSection'
import EnhancedLayout, { SectionType } from './components/layout/EnhancedLayout'

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle section change from layout
  const handleSectionChange = (section: SectionType) => {
    if (section === 'home') {
      setIsPanelOpen(false);
    } else {
      setIsPanelOpen(true);
    }
    setActiveSection(section);
  };

  // Content transition variants
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Panel variants
  const panelVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        damping: 30,
        stiffness: 200
      }
    },
    exit: { 
      x: "100%",
      transition: { duration: 0.25 }
    }
  };

  return (
    <EnhancedLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      {/* Main landing content - centered initially, moves to left when panel opens */}
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div 
            key={`content-${activeSection}`}
            className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500 
              ${isPanelOpen ? 'md:left-0 md:right-1/2 md:transform-none' : ''}`}
            style={{ 
              pointerEvents: activeSection === 'home' ? 'auto' : 'none',
              opacity: isPanelOpen ? 0.7 : 1
            }}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="logo-container mb-8 w-32 h-32 relative">
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
            <p className="tagline text-sm tracking-[0.2em] mb-10 opacity-60 uppercase text-gray-700">
              Sonic Explorations of Data & Space
            </p>
            
            <div className="music-player w-full max-w-md h-1 mb-10 bg-gray-200 rounded relative cursor-pointer hover:h-1.5 transition-all duration-300">
              <div className="progress absolute w-[30%] h-full bg-gradient-to-r from-accent-light to-accent-DEFAULT rounded"></div>
            </div>

            <div className="social-icons flex justify-center gap-5 md:gap-8 mt-6">
              <a href="https://soundcloud.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-2 h-2 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
              <a href="https://spotify.com/artist/your-id" target="_blank" rel="noopener noreferrer" className="w-2 h-2 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
              <a href="https://instagram.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-2 h-2 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
              <a href="https://youtube.com/your-channel" target="_blank" rel="noopener noreferrer" className="w-2 h-2 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side panel for content */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            className="absolute inset-0 md:left-1/2 backdrop-blur-sm p-4 md:p-8 overflow-auto z-30"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button - visible on mobile and optionally on desktop */}
            <button 
              onClick={() => handleSectionChange('home')}
              className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all"
            >
              <span className="text-xl">✕</span>
            </button>

            {/* Dynamic content based on active section */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSection}
                className="bg-white bg-opacity-85 rounded-lg shadow-lg p-5 md:p-8 h-full overflow-auto"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onAnimationStart={() => setIsTransitioning(true)}
                onAnimationComplete={() => setIsTransitioning(false)}
              >
                {activeSection === 'music' && <MusicPlayer />}
                {activeSection === 'shows' && <ShowsSection />}
                {activeSection === 'about' && <AboutSection />}
                {activeSection === 'contact' && <ContactForm />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </EnhancedLayout>
  )
}

export default App