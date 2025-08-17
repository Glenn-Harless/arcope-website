import { motion } from 'framer-motion'
import Layout from './components/layout/Layout'
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'

function App() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div 
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-light tracking-[0.2em] gradient-text">
              ARCOPE
            </h1>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-8">
            <motion.a 
              href="https://instagram.com/arcope" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-3xl text-gray-600 hover:text-primary-DEFAULT transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram />
            </motion.a>
            
            <motion.a 
              href="https://tiktok.com/@arcope" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-3xl text-gray-600 hover:text-primary-DEFAULT transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTiktok />
            </motion.a>
            
            <motion.a 
              href="https://youtube.com/@arcope" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-3xl text-gray-600 hover:text-primary-DEFAULT transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaYoutube />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default App