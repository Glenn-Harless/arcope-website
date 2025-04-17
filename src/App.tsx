// src/App.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import MusicPlayer from './components/MusicPlayer/MusicPlayer'
import ContactForm from './components/ContactForm/ContactForm'
import AboutSection from './components/AboutSection/AboutSection'
import ShowsSection from './components/ShowsSection/ShowsSection'

// Section types
type PageType = 'home' | 'music' | 'shows' | 'about' | 'contact';

function App() {
  const [activePage, setActivePage] = useState<PageType>('home');

  // Page transition variants
  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction * 40,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1], // custom cubic bezier
      }
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction * -40,
      transition: {
        duration: 0.3,
      }
    })
  };

  // Track navigation direction for animations
  const [direction, setDirection] = useState(1);

  // Page navigation handler
  const navigateTo = (page: PageType) => {
    // Determine direction based on page order
    const pageOrder: PageType[] = ['home', 'music', 'shows', 'about', 'contact'];
    const currentIndex = pageOrder.indexOf(activePage);
    const nextIndex = pageOrder.indexOf(page);
    
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActivePage(page);
  };
  
  // Render the appropriate page content
  const renderPageContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            custom={direction}
            key="home"
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
                onClick={() => navigateTo('music')}
                className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Music
              </motion.button>
              
              <motion.button
                onClick={() => navigateTo('shows')}
                className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shows
              </motion.button>
              
              <motion.button
                onClick={() => navigateTo('about')}
                className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.button>
              
              <motion.button
                onClick={() => navigateTo('contact')}
                className="text-xs tracking-wider uppercase cursor-pointer opacity-60 hover:opacity-100 transition-opacity hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.button>
            </div>

            <div className="social-icons flex justify-center gap-5 md:gap-8">
              <a href="https://soundcloud.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
              <a href="https://spotify.com/artist/your-id" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
              <a href="https://instagram.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
              <a href="https://youtube.com/your-channel" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
            </div>
          </motion.div>
        );
        
      case 'music':
        return (
          <PageContainer variants={pageVariants} direction={direction} key="music">
            <div className="page-header">
              <motion.button
                onClick={() => navigateTo('home')}
                className="mb-6 text-xs tracking-wider uppercase flex items-center opacity-60 hover:opacity-100"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="mr-1">←</span> Back
              </motion.button>
            </div>
            <MusicPlayer />
          </PageContainer>
        );
        
      case 'shows':
        return (
          <PageContainer variants={pageVariants} direction={direction} key="shows">
            <div className="page-header">
              <motion.button
                onClick={() => navigateTo('home')}
                className="mb-6 text-xs tracking-wider uppercase flex items-center opacity-60 hover:opacity-100"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="mr-1">←</span> Back
              </motion.button>
            </div>
            <ShowsSection />
          </PageContainer>
        );
        
      case 'about':
        return (
          <PageContainer variants={pageVariants} direction={direction} key="about">
            <div className="page-header">
              <motion.button
                onClick={() => navigateTo('home')}
                className="mb-6 text-xs tracking-wider uppercase flex items-center opacity-60 hover:opacity-100"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="mr-1">←</span> Back
              </motion.button>
            </div>
            <AboutSection />
          </PageContainer>
        );
        
      case 'contact':
        return (
          <PageContainer variants={pageVariants} direction={direction} key="contact">
            <div className="page-header">
              <motion.button
                onClick={() => navigateTo('home')}
                className="mb-6 text-xs tracking-wider uppercase flex items-center opacity-60 hover:opacity-100"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="mr-1">←</span> Back
              </motion.button>
            </div>
            <ContactForm />
          </PageContainer>
        );
    }
  };

  return (
    <Layout activePage={activePage}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        {renderPageContent()}
      </AnimatePresence>
      
      <footer className="px-5 py-5 text-center text-xs opacity-50 tracking-wider absolute bottom-5 w-full text-gray-700" style={{ zIndex: 10 }}>
        © {new Date().getFullYear()} ARCOVA
      </footer>
    </Layout>
  );
}

// Page Container component for consistent styling across all pages
interface PageContainerProps {
  children: React.ReactNode;
  variants: any;
  direction: number;
  key: string;
}

const PageContainer = ({ children, variants, direction, key }: PageContainerProps) => {
  return (
    <motion.div
      className="min-h-screen py-16 px-4 max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-md"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      custom={direction}
      key={key}
    >
      {children}
    </motion.div>
  );
};

export default App;