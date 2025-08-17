
// src/components/AboutSection/AboutSection.tsx
import { motion } from 'framer-motion';

const AboutSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-2xl font-light tracking-wider text-primary-DEFAULT mb-6"
        variants={itemVariants}
      >
        ABOUT
      </motion.h2>
      
      <div className="space-y-12">
        {/* Artist Bio */}
        <motion.div variants={itemVariants}>
          <div className="aspect-video overflow-hidden rounded-lg mb-6 bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center">
            {/* Placeholder for artist image */}
            <div className="text-white opacity-80 text-center p-10">
              <div className="mb-2 text-lg">ARCOVA</div>
              <div className="text-sm opacity-60">Image Coming Soon</div>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ARCOVA is an electronic music and multimedia project exploring the intersection of data, sound, and spatial experience. Through immersive compositions and visual landscapes, ARCOVA creates sonic explorations that blur the boundaries between the digital and physical worlds.
            </p>
            <p>
              Founded in 2024, the project draws inspiration from systems theory, architectural spaces, and the hidden patterns in natural phenomena. Each composition is a journey through evolving soundscapes, merging ambient textures with intricate rhythmic structures and harmonic evolution.
            </p>
          </div>
        </motion.div>
        
        {/* Sound & Influences */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 border-b border-gray-200 pb-2">
            Sound & Influences
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ARCOVA's sound palette spans ambient, experimental electronic, and generative composition techniques. The project weaves together field recordings, modular synthesis, and digital signal processing to create textural depth and emotional resonance.
            </p>
            <p>
              Influenced by artists like Ryuichi Sakamoto, Brian Eno, Floating Points, and Jon Hopkins, as well as architectural concepts of space and resonance, ARCOVA's work inhabits the space between contemplative listening and immersive experience.
            </p>
          </div>
          
          {/* Influences Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {['Ambient', 'Experimental', 'Generative', 'Modular', 'Cinematic', 'Minimal', 'Spatial', 'Textural'].map((tag) => (
              <motion.div
                key={tag}
                className="bg-gray-100 rounded-md p-3 text-center text-sm"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(231, 112, 46, 0.1)',
                  color: '#7b1e56'
                }}
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Project Philosophy */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 border-b border-gray-200 pb-2">
            Project Philosophy
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ARCOVA is committed to exploring new forms of musical experience and the ways sound can transform our perception of space and time. Through installations, live performances, and recorded works, the project seeks to create moments of contemplation and wonder.
            </p>
            <p>
              Each release is conceptualized as a complete journey - from sonic elements to visual design - exploring themes of emergence, patterns in nature, and digital-physical hybridization.
            </p>
          </div>
        </motion.div>
        
        {/* Technical Approach */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 border-b border-gray-200 pb-2">
            Technical Approach
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ARCOVA's compositions often begin with custom software processes that transform data into musical parameters - whether environmental measurements, architectural dimensions, or other datasets. These serve as frameworks for further musical development and refinement.
            </p>
            <p>
              Live performances utilize a hybrid setup of hardware synthesizers, custom software instruments, and real-time processing, creating a dialogue between predefined structures and improvisation.
            </p>
          </div>
        </motion.div>
        
        {/* Future Direction */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium mb-4 border-b border-gray-200 pb-2">
            Future Direction
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              ARCOVA continues to develop new works while exploring collaborative opportunities with visual artists, architectural spaces, and technology platforms. The project aims to expand into site-specific installations and immersive experiences that respond to unique environments.
            </p>
            <p>
              Upcoming releases will further develop the sonic territories established in early works while introducing new conceptual frameworks and technical approaches.
            </p>
          </div>
        </motion.div>
        
        {/* Contact for Collaborations */}
        <motion.div 
          variants={itemVariants}
          className="bg-gray-50 rounded-lg p-6 mt-10"
        >
          <h3 className="text-lg font-medium mb-3">Collaborate With Us</h3>
          <p className="text-sm text-gray-600 mb-4">
            ARCOVA is open to collaborations with visual artists, venues, festivals, and other creative projects. 
            If you're interested in working together, please reach out.
          </p>
          
          <motion.button
            onClick={() => {
              // Navigate to contact section
              const contactLink = document.querySelector('button:contains("Contact")');
              if (contactLink) {
                (contactLink as HTMLButtonElement).click();
              }
            }}
            className="px-5 py-2 bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white rounded-md text-sm tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CONTACT FOR COLLABORATION
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutSection;