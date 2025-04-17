# Table of Contents
- Dockerfile.init
- Dockerfile.prod
- tsconfig.node.json
- index.html
- tailwind.config.js
- netlify.toml
- Dockerfile
- website.md
- vite.config.js
- .dockerignore
- .gitignore
- package-lock.json
- package.json
- tsconfig.json
- docker-compose.yml
- postcss.config.js
- public/favicon.svg
- src/App.tsx
- src/main.tsx
- src/vite-env.d.ts
- public/audio/track3.mp3
- public/audio/track2.mp3
- public/audio/track1.mp3
- src/styles/globals.css
- src/components/ContactForm/ContactForm.tsx
- src/components/layout/Layout.tsx
- src/components/MusicPlayer/MusicPlayer.tsx
- src/components/AboutSection/AboutSection.tsx
- src/components/ShowsSection/ShowsSection.tsx

## File: Dockerfile.init

- Extension: .init
- Language: unknown
- Size: 403 bytes
- Created: 2025-04-16 20:11:56
- Modified: 2025-04-16 20:11:56

### Code

```unknown
FROM node:20-alpine

WORKDIR /app

# Install Vite globally
RUN npm install -g create-vite

# Create new Vite React TypeScript project in the current directory
CMD ["sh", "-c", "create-vite . --template react-ts && npm install react react-dom framer-motion && npm install -D tailwindcss postcss autoprefixer typescript @types/react @types/react-dom && npx tailwindcss init -p && chown -R node:node /app"]
```

## File: Dockerfile.prod

- Extension: .prod
- Language: unknown
- Size: 305 bytes
- Created: 2025-04-16 20:08:41
- Modified: 2025-04-16 20:08:41

### Code

```unknown
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

```

## File: tsconfig.node.json

- Extension: .json
- Language: json
- Size: 213 bytes
- Created: 2025-04-16 20:09:56
- Modified: 2025-04-16 20:09:56

### Code

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

```

## File: index.html

- Extension: .html
- Language: html
- Size: 1275 bytes
- Created: 2025-04-16 20:13:02
- Modified: 2025-04-16 20:13:02

### Code

```html
<!DOCTYPE html>
<html lang="en" class="h-full w-full m-0 p-0">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="ARCOVA - Sonic Explorations of Data & Space" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <title>ARCOVA</title>
  </head>
  <body class="h-full w-full m-0 p-0 font-montserrat">
    <!-- Hidden form for Netlify -->
    <form name="contact" netlify netlify-honeypot="bot-field" hidden>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <textarea name="message"></textarea>
    </form>
    
    <!-- Hidden form for newsletter -->
    <form name="newsletter" netlify netlify-honeypot="bot-field" hidden>
      <input type="email" name="email" />
    </form>
    
    <div id="root" class="h-full w-full"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: tailwind.config.js

- Extension: .js
- Language: javascript
- Size: 771 bytes
- Created: 2025-04-16 20:14:19
- Modified: 2025-04-16 20:14:19

### Code

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a82f39',
          DEFAULT: '#7b1e56',
          dark: '#5a1540',
        },
        accent: {
          light: '#f5b02e',
          DEFAULT: '#e7702e',
          dark: '#d45e1e',
        },
        background: '#ffffff',
        text: '#222222',
      },
      animation: {
        'pulsate': 'pulsate 12s ease-in-out infinite',
      },
      keyframes: {
        pulsate: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        }
      },
    },
  },
  plugins: [],
}
```

## File: netlify.toml

- Extension: .toml
- Language: toml
- Size: 114 bytes
- Created: 2025-04-16 20:14:42
- Modified: 2025-04-16 20:14:42

### Code

```toml
[
build
]
  command = "npm run build"
  publish = "dist"

[
context.production.environment
]
  NODE_VERSION = "20"
```

## File: Dockerfile

- Extension: 
- Language: unknown
- Size: 286 bytes
- Created: 2025-04-16 20:12:19
- Modified: 2025-04-16 20:12:19

### Code

```unknown
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

# Copy package files first
COPY package*.json ./

# Regular npm install
RUN npm install

# Copy the rest of the application
COPY . .

# Add these flags to the start command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

## File: website.md

- Extension: .md
- Language: markdown
- Size: 0 bytes
- Created: 2025-04-17 14:57:53
- Modified: 2025-04-17 14:57:53

### Code

```markdown

```

## File: vite.config.js

- Extension: .js
- Language: javascript
- Size: 352 bytes
- Created: 2025-04-16 20:15:15
- Modified: 2025-04-16 20:15:15

### Code

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## File: .dockerignore

- Extension: 
- Language: unknown
- Size: 65 bytes
- Created: 2025-04-16 20:08:08
- Modified: 2025-04-16 20:08:08

### Code

```unknown
node_modules
npm-debug.log
build
.git
.env
*.env
*.log
.DS_Store

```

## File: .gitignore

- Extension: 
- Language: unknown
- Size: 319 bytes
- Created: 2025-04-16 20:08:15
- Modified: 2025-04-16 20:08:15

### Code

```unknown
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.*
!.env.example

```

## File: package-lock.json

- Extension: .json
- Language: json
- Size: 1 bytes
- Created: 2025-04-16 20:09:18
- Modified: 2025-04-16 20:09:18

### Code

```json


```

## File: package.json

- Extension: .json
- Language: json
- Size: 900 bytes
- Created: 2025-04-16 20:09:10
- Modified: 2025-04-16 20:09:10

### Code

```json
{
  "name": "arcova-website",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.12.4",
    "react-icons": "^4.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^5.59.1",
    "@typescript-eslint/parser": "^5.59.1",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.39.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.1",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.0.4",
    "vite": "^4.3.5"
  }
}

```

## File: tsconfig.json

- Extension: .json
- Language: json
- Size: 605 bytes
- Created: 2025-04-16 20:09:49
- Modified: 2025-04-16 20:09:49

### Code

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

## File: docker-compose.yml

- Extension: .yml
- Language: yaml
- Size: 177 bytes
- Created: 2025-04-16 20:12:31
- Modified: 2025-04-16 20:12:31

### Code

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
```

## File: postcss.config.js

- Extension: .js
- Language: javascript
- Size: 80 bytes
- Created: 2025-04-16 20:09:25
- Modified: 2025-04-16 20:09:25

### Code

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

## File: public/favicon.svg

- Extension: .svg
- Language: unknown
- Size: 1 bytes
- Created: 2025-04-16 20:04:49
- Modified: 2025-04-16 20:04:49

### Code

```unknown


```

## File: src/App.tsx

- Extension: .tsx
- Language: typescript
- Size: 8014 bytes
- Created: 2025-04-17 09:13:55
- Modified: 2025-04-17 09:13:55

### Code

```typescript
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
  
  // States for panel animation sequence
  const [isZooming, setIsZooming] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  
  const showSection = (section: SectionType) => {
    if (section === 'home') {
      // When going home, hide content first
      setIsContentVisible(false);
      
      // Then close panel after a short delay
      setTimeout(() => {
        setIsPanelOpen(false);
        setActiveSection('home');
      }, 400);
    } else {
      // When opening a section, update section first
      setActiveSection(section);
      
      // Start opening sequence
      setIsPanelOpen(true);
      setIsZooming(true);
    }
  };

  // Handler for when zoom animation is complete
  const handleZoomComplete = () => {
    // Zoom is done, show content now
    setIsZooming(false);
    
    // Small delay for visual flow
    setTimeout(() => {
      setIsContentVisible(true);
    }, 200);
  };

  return (
    <Layout 
      activeSection={isPanelOpen ? activeSection : null}
      isPanelOpen={isPanelOpen}
      onZoomComplete={handleZoomComplete}
    >
      {/* Main landing content */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-500 ${
          isPanelOpen ? 'opacity-30' : 'opacity-100'
        }`}
        style={{ 
          pointerEvents: isPanelOpen ? 'none' : 'auto',
        }}
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
          <a href="https://soundcloud.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
          <a href="https://spotify.com/artist/your-id" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
          <a href="https://instagram.com/your-handle" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
          <a href="https://youtube.com/your-channel" target="_blank" rel="noopener noreferrer" className="w-1.5 h-1.5 bg-gray-400 rounded-full hover:scale-125 transition-transform"></a>
        </div>
      </div>

      {/* Content Panel - designed to appear within the particle network */}
      <AnimatePresence>
        {isPanelOpen && isContentVisible && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Content container - more transparent to blend with particles */}
            <motion.div 
              className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-5 md:p-8 max-h-[85vh] w-[92%] max-w-2xl overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
            >
              {/* Close button - moved inside the content panel */}
              <div className="flex justify-end mb-2">
                <motion.button 
                  onClick={() => showSection('home')}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg text-gray-500">×</span>
                </motion.button>
              </div>
            
              {/* Dynamic content based on active section */}
              {activeSection === 'music' && <MusicPlayer />}
              {activeSection === 'shows' && <ShowsSection />}
              {activeSection === 'about' && <AboutSection />}
              {activeSection === 'contact' && <ContactForm />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default App
```

## File: src/main.tsx

- Extension: .tsx
- Language: typescript
- Size: 256 bytes
- Created: 2025-04-16 20:19:01
- Modified: 2025-04-16 20:19:01

### Code

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## File: src/vite-env.d.ts

- Extension: .ts
- Language: typescript
- Size: 580 bytes
- Created: 2025-04-16 20:17:52
- Modified: 2025-04-16 20:17:52

### Code

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

// This file is created by Vite automatically when initializing a TypeScript project.
// It provides type definitions for Vite-specific features.

// It lets TypeScript know about Vite's environment variables
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // Add more env variables as needed:
    // readonly VITE_API_URL: string
    // readonly VITE_SOME_KEY: string
  }
  
  // Extends the ImportMeta interface to include the env property
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
```

## File: public/audio/track3.mp3

- Extension: .mp3
- Language: unknown
- Size: 1 bytes
- Created: 2025-04-16 20:07:47
- Modified: 2025-04-16 20:07:47

### Code

```unknown


```

## File: public/audio/track2.mp3

- Extension: .mp3
- Language: unknown
- Size: 1 bytes
- Created: 2025-04-16 20:07:39
- Modified: 2025-04-16 20:07:39

### Code

```unknown


```

## File: public/audio/track1.mp3

- Extension: .mp3
- Language: unknown
- Size: 1 bytes
- Created: 2025-04-16 20:07:32
- Modified: 2025-04-16 20:07:32

### Code

```unknown


```

## File: src/styles/globals.css

- Extension: .css
- Language: unknown
- Size: 8773 bytes
- Created: 2025-04-17 09:14:01
- Modified: 2025-04-17 09:14:01

### Code

```unknown

@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
}

@keyframes pulsate {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 40px;
}

.logo {
  width: 100%;
  height: 100%;
  position: relative;
}

.logo-shape {
  position: absolute;
  background: linear-gradient(45deg, #7b1e56, #a82f39);
}

.logo-center {
  width: 40%;
  height: 40%;
  left: 30%;
  top: 30%;
  background: linear-gradient(45deg, #e7702e, #f5b02e);
  transform: rotate(45deg);
}

.logo-top {
  width: 40%;
  height: 40%;
  left: 30%;
  top: 0;
  transform: rotate(45deg);
}

.logo-right {
  width: 40%;
  height: 40%;
  right: 0;
  top: 30%;
  transform: rotate(45deg);
}

.logo-bottom {
  width: 40%;
  height: 40%;
  left: 30%;
  bottom: 0;
  transform: rotate(45deg);
}

.logo-left {
  width: 40%;
  height: 40%;
  left: 0;
  top: 30%;
  transform: rotate(45deg);
}

.constellation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  
  /* Fix for the ARCOVA text to ensure it's visible */
  h1.text-transparent {
    -webkit-text-fill-color: transparent;
  }

/* Add this to src/styles/globals.css */
h1.gradient-text {
    background: linear-gradient(90deg, #7b1e56, #a82f39, #e7702e, #f5b02e);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #7b1e56; /* Fallback */
  }
  
  /* For older browsers that don't support gradient text */
  @supports not (background-clip: text) {
    h1.gradient-text {
      background: transparent;
      color: #7b1e56;
      -webkit-text-fill-color: #7b1e56;
    }
  }

/* Add these rules to src/styles/globals.css */
canvas.fixed {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    display: block !important;
    z-index: 0 !important;
    pointer-events: none !important;
  }
  
  /* Remove the bg-grid class if it's still there */
  .bg-grid {
    display: none !important;
  }


/* Add these styles to src/styles/globals.css */

/* Enhanced particles */
.particle {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.particle.selected {
  filter: drop-shadow(0 0 10px rgba(231, 112, 46, 0.7));
}

/* Transitions for content panels */
.panel-transition-enter {
  opacity: 0;
  transform: scale(0.8);
}

.panel-transition-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms, transform 300ms;
}

.panel-transition-exit {
  opacity: 1;
  transform: scale(1);
}

.panel-transition-exit-active {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 300ms, transform 300ms;
}

/* Zoom transition effect */
@keyframes zoomIn {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}

@keyframes particleExpand {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: scale(100);
    opacity: 0;
  }
}

.zoom-effect {
  animation: zoomIn 0.8s ease-out forwards;
}

.particle-expand {
  animation: particleExpand 0.8s ease-out forwards;
}

/* Panel backdrop with blur */
.panel-backdrop {
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease-out;
}

/* Enhance canvas display for particle network during zoom */
canvas.zooming {
  transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Make sure panel content has some depth */
.panel-content {
  position: relative;
  z-index: 60;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0.5rem;
  overflow: hidden;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.8)
  );
  backdrop-filter: blur(10px);
}

/* Additional styling to enhance the visual effect */
.content-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle at center,
    transparent,
    rgba(255, 255, 255, 0.3)
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease-out;
  z-index: 40;
}

.content-overlay.active {
  opacity: 1;
}

/* Reduced motion preference support */
@media (prefers-reduced-motion: reduce) {
  .zoom-effect,
  .particle-expand,
  canvas.zooming {
    animation: none;
    transition: none;
  }
  
  .panel-transition-enter-active,
  .panel-transition-exit-active {
    transition: opacity 150ms;
    transform: none;
  }
  
  .content-overlay {
    display: none;
  }
}

/* Add these optimized styles to src/styles/globals.css */

/* Particles and animation optimization */
@keyframes pulsate {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* More efficient particle styling */
.particle {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.particle.selected {
  filter: drop-shadow(0 0 8px rgba(231, 112, 46, 0.5));
}

/* Simpler animation for content panels */
.panel-enter {
  opacity: 0;
  transform: scale(0.95);
}

.panel-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 250ms ease-out, transform 250ms ease-out;
}

.panel-exit {
  opacity: 1;
}

.panel-exit-active {
  opacity: 0;
  transition: opacity 200ms ease-in;
}

/* Simplified zoom animation */
@keyframes simpleZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
}

/* Panel content backdrop with subtle blur */
.panel-backdrop {
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.25s ease-out;
}

/* Canvas styles during zoom */
canvas.zooming {
  transition: transform 0.5s ease-out;
}

/* Panel content styling */
.panel-content {
  position: relative;
  z-index: 60;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
}

/* Disable transitions for users with reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .panel-enter-active,
  .panel-exit-active,
  canvas.zooming,
  .panel-backdrop {
    transition: none !important;
    animation: none !important;
  }
  
  .animate-pulsate {
    animation: none !important;
  }
}

/* Add these optimized styles to src/styles/globals.css */

/* Base animation for subtle pulsing */
@keyframes pulsate {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* Particle network styling */
.particle {
  transition: transform 0.6s ease-out, opacity 0.6s ease-out;
}

/* Deep zoom animation for canvas - more dramatic effect */
@keyframes deepZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(3);
  }
}

/* Apply deep zoom to canvas during transition */
canvas.zooming {
  transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Panel backdrop with reduced blur for performance */
.panel-backdrop {
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease-out;
}

/* Content styling to integrate with particle network */
.content-panel {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.4s ease-out;
  /* Subtle shadow to lift off the background without breaking immersion */
  box-shadow: 
    0 4px 10px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.02);
}

/* Add subtle particle-like dots to the content background */
.content-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: radial-gradient(
    rgba(100, 100, 100, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  opacity: 0.3;
}

/* Create a more seamless transition for content */
.content-transition-enter {
  opacity: 0;
  transform: scale(0.92);
}

.content-transition-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 400ms ease-out, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.content-transition-exit {
  opacity: 1;
}

.content-transition-exit-active {
  opacity: 0;
  transition: opacity 300ms ease-in;
}

/* Accessibility support */
@media (prefers-reduced-motion: reduce) {
  .particle,
  canvas.zooming,
  .panel-backdrop,
  .content-panel,
  .content-transition-enter-active,
  .content-transition-exit-active {
    transition: none !important;
    animation: none !important;
  }
  
  .animate-pulsate {
    animation: none !important;
  }
}
```

## File: src/components/ContactForm/ContactForm.tsx

- Extension: .tsx
- Language: typescript
- Size: 9976 bytes
- Created: 2025-04-16 20:13:33
- Modified: 2025-04-16 20:13:33

### Code

```typescript

// src/components/ContactForm/ContactForm.tsx
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // For Netlify forms
      const formData = new FormData();
      formData.append('form-name', 'contact');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);
      
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('There was an error submitting the form. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-light tracking-wider text-primary-DEFAULT mb-6">CONNECT</h2>
      
      <div className="space-y-8">
        <p className="text-gray-600">
          For bookings, collaborations, or just to say hello, reach out below or email us directly at <a href="mailto:contact@arcova.io" className="text-accent-DEFAULT hover:underline">contact@arcova.io</a>
        </p>
        
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mx-auto mb-4 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 bg-white rounded-lg p-6 shadow-sm"
              onSubmit={handleSubmit}
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
            >
              {/* Hidden field for Netlify forms */}
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
                  required
                />
              </div>
              
              <div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white rounded-md font-medium tracking-wider transition-all ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
                  }`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        {/* Email List Signup */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium mb-3">Join Our Newsletter</h3>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to get updates on new releases, upcoming shows, and more.
          </p>
          
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
              required
            />
            <motion.button
              type="submit"
              className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              SUBSCRIBE
            </motion.button>
          </form>
        </div>
        
        {/* Social/Connect Section */}
        <div className="pt-6">
          <h3 className="text-lg font-medium mb-3">Connect With Us</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <a 
              href="https://instagram.com/your-handle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-DEFAULT transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>
            
            <a 
              href="https://twitter.com/your-handle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-DEFAULT transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
              <span>Twitter/X</span>
            </a>
            
            <a 
              href="https://soundcloud.com/your-handle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-DEFAULT transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4H3v4z"></path>
                <path d="M2 8h20v10H2z"></path>
                <path d="M2 4h20"></path>
              </svg>
              <span>SoundCloud</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
```

## File: src/components/layout/Layout.tsx

- Extension: .tsx
- Language: typescript
- Size: 11881 bytes
- Created: 2025-04-17 09:15:20
- Modified: 2025-04-17 09:15:20

### Code

```typescript
// src/components/layout/Layout.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  activeSection: string | null;
  isPanelOpen: boolean;
  onZoomComplete: () => void;
}

// Define a particle class for the background
class Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  radius: number;
  originalRadius: number;
  color: string;
  isSelected: boolean;
  
  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    // Slower velocity for smoother movement
    this.velocityX = Math.random() * 0.05 - 0.025;
    this.velocityY = Math.random() * 0.05 - 0.025;
    this.life = Math.random() * 10 * 60;
    this.originalRadius = 1.2;
    this.radius = this.originalRadius;
    this.color = 'rgba(80, 80, 80, 0.3)';
    this.isSelected = false;
  }
  
  position(width: number, height: number) {
    // Boundary check and bounce
    if ((this.x + this.velocityX > width && this.velocityX > 0) || 
        (this.x + this.velocityX < 0 && this.velocityX < 0)) {
      this.velocityX *= -1;
    }
    
    if ((this.y + this.velocityY > height && this.velocityY > 0) || 
        (this.y + this.velocityY < 0 && this.velocityY < 0)) {
      this.velocityY *= -1;
    }
    
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    
    // Use same color for all particles - no special color for selected one
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  reCalculateLife(width: number, height: number) {
    if (this.life < 1) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = Math.random() * 0.05 - 0.025;
      this.velocityY = Math.random() * 0.05 - 0.025;
      this.life = Math.random() * 10 * 60;
    }
    this.life--;
  }
}

const Layout = ({ children, activeSection, isPanelOpen, onZoomComplete }: LayoutProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  // Animation state
  const [isZooming, setIsZooming] = useState(false);
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);
  const zoomAnimationRef = useRef<number | null>(null);
  
  // Camera/view transformation state
  const cameraTransform = useRef({ 
    x: 0, 
    y: 0, 
    scale: 1 
  });

  // Initialize canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size once
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 100; i++) { // Increased particle count
        particlesRef.current.push(new Particle(dimensions.width, dimensions.height));
      }
      console.log(`Initialized ${particlesRef.current.length} particles`);
    }
    
    setIsCanvasReady(true);
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (zoomAnimationRef.current) {
        cancelAnimationFrame(zoomAnimationRef.current);
      }
    };
  }, []); // Empty dependency array - run once on mount

  // Handle window resize - separate from initialization
  useEffect(() => {
    const handleResize = () => {
      // Get current dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Update canvas size
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      
      // Only set dimensions if they've changed
      if (width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions.width, dimensions.height]);

  // Animation loop - separate effect
  useEffect(() => {
    if (!isCanvasReady) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawLines = () => {
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180) { // Increased connection distance
            const opacity = (1 - distance / 180) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    };
    
    const updateParticles = () => {
      particlesRef.current.forEach(particle => {
        if (!particle.isSelected) {
          particle.position(dimensions.width, dimensions.height);
          particle.reCalculateLife(dimensions.width, dimensions.height);
        }
      });
    };
    
    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        particle.draw(ctx);
      });
    };
    
    const animate = () => {
      // Clear the canvas with a slightly transparent white
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Apply camera transform
      ctx.save();
      ctx.translate(dimensions.width / 2, dimensions.height / 2);
      ctx.scale(cameraTransform.current.scale, cameraTransform.current.scale);
      ctx.translate(-dimensions.width / 2 + cameraTransform.current.x, 
                   -dimensions.height / 2 + cameraTransform.current.y);
      
      // Update and draw particles
      updateParticles();
      drawLines();
      drawParticles();
      
      // Restore transformation
      ctx.restore();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isCanvasReady, dimensions.width, dimensions.height]);

  // Handle panel transitions with zooming effect
  useEffect(() => {
    if (!isCanvasReady) return;
    
    if (!isPanelOpen || !activeSection) {
      // Reset zoom when closing panel
      if (isZooming) {
        resetZoom();
      }
      return;
    }
    
    // Start zoom effect when panel is opened
    if (!isZooming && isPanelOpen) {
      startZoomEffect();
    }
  }, [isPanelOpen, activeSection, isCanvasReady]);

  const startZoomEffect = () => {
    setIsZooming(true);
    
    // Find a particle near the center to zoom toward
    let targetParticle: Particle | null = null;
    let minDistance = Infinity;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    particlesRef.current.forEach(particle => {
      const dx = particle.x - centerX;
      const dy = particle.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        targetParticle = particle;
      }
    });
    
    if (!targetParticle) return;
    
    // Mark the target particle as selected but don't change its color
    targetParticle.isSelected = true;
    setSelectedParticle(targetParticle);
    
    // More dramatic zoom animation
    let startTime = performance.now();
    const zoomDuration = 1200; // Longer duration for a more dramatic effect
    
    const zoomStep = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / zoomDuration, 1);
      
      // Ease function for smooth animation
      const ease = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; // Cubic ease in/out
      const easedProgress = ease(progress);
      
      // Create a much more dramatic zoom effect
      if (targetParticle) {
        // Don't increase particle size as much
        targetParticle.radius = targetParticle.originalRadius * (1 + easedProgress * 5);
        
        // Move camera toward particle with stronger zoom
        cameraTransform.current = {
          x: -(targetParticle.x - dimensions.width / 2) * easedProgress,
          y: -(targetParticle.y - dimensions.height / 2) * easedProgress,
          scale: 1 + easedProgress * 3 // Much stronger zoom (300% instead of 20%)
        };
      }
      
      // Continue animation or complete
      if (progress < 1) {
        zoomAnimationRef.current = requestAnimationFrame(zoomStep);
      } else {
        // Complete zoom effect
        setTimeout(onZoomComplete, 100);
      }
    };
    
    // Start zoom animation
    zoomAnimationRef.current = requestAnimationFrame(zoomStep);
  };

  const resetZoom = () => {
    setIsZooming(false);
    
    // Reset selected particle
    if (selectedParticle) {
      selectedParticle.isSelected = false;
      selectedParticle.radius = selectedParticle.originalRadius;
      setSelectedParticle(null);
    }
    
    // Smoothly reset camera
    const startTransform = {...cameraTransform.current};
    let startTime = performance.now();
    const duration = 800; // Longer duration for smoother exit
    
    const resetStep = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function
      const ease = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; // Cubic ease in/out
      const easedProgress = ease(progress);
      
      // Interpolate transform back to default
      cameraTransform.current = {
        x: startTransform.x * (1 - easedProgress),
        y: startTransform.y * (1 - easedProgress),
        scale: 1 + (startTransform.scale - 1) * (1 - easedProgress)
      };
      
      // Continue or complete
      if (progress < 1) {
        zoomAnimationRef.current = requestAnimationFrame(resetStep);
      } else {
        // Ensure we're back to default
        cameraTransform.current = { x: 0, y: 0, scale: 1 };
      }
    };
    
    // Start reset animation
    zoomAnimationRef.current = requestAnimationFrame(resetStep);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-text font-montserrat">
      {/* Canvas background */}
      <canvas 
        ref={canvasRef} 
        className={`fixed top-0 left-0 w-full h-full ${isZooming ? 'zooming' : ''}`} 
        style={{ 
          zIndex: 0, 
          pointerEvents: 'none', 
          display: 'block' 
        }} 
      />
      
      <div className="content-wrapper flex flex-col min-h-screen justify-center items-center relative" style={{ zIndex: 10 }}>
        {children}
      </div>
      
      <footer className="px-5 py-5 text-center text-xs opacity-50 tracking-wider absolute bottom-5 w-full text-gray-700" style={{ zIndex: 10 }}>
        © {new Date().getFullYear()} ARCOVA
      </footer>
    </div>
  );
};

export default Layout;
```

## File: src/components/MusicPlayer/MusicPlayer.tsx

- Extension: .tsx
- Language: typescript
- Size: 11294 bytes
- Created: 2025-04-16 20:13:43
- Modified: 2025-04-16 20:13:43

### Code

```typescript

// src/components/MusicPlayer/MusicPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  title: string;
  file: string;
  duration: string;
  releaseDate?: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks: Track[] = [
    {
      title: "Beneath the Data Sea",
      file: "/audio/track1.mp3", // Path to your audio file
      duration: "3:42",
      releaseDate: "April 2025"
    },
    {
      title: "Signal Flow",
      file: "/audio/track2.mp3",
      duration: "4:15",
      releaseDate: "Coming Soon"
    },
    {
      title: "Digital Horizon",
      file: "/audio/track3.mp3",
      duration: "5:21",
      releaseDate: "Coming Soon"
    }
  ];

  useEffect(() => {
    // Update progress bar during playback
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNextTrack);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNextTrack);
    };
  }, [currentTrack]);

  // Set volume when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error("Playback prevented:", error);
          // Handle autoplay restrictions
        });
    }
  };

  const handlePrevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    audio.currentTime = percent * audio.duration;
  };

  const handleTrackSelection = (index: number) => {
    if (index === currentTrack) {
      togglePlay();
    } else {
      setCurrentTrack(index);
      setIsPlaying(false);
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(error => console.error("Playback prevented:", error));
        }
      }, 100);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-wider text-primary-DEFAULT mb-6">MUSIC</h2>
      
      {/* Now Playing */}
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Visualizer/Album Art Placeholder */}
          <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-primary-light to-accent-light rounded-lg flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
              {/* Vinyl record effect */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-900 animate-spin" style={{ animationDuration: '3s', animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
              <div className="absolute inset-[15%] rounded-full border-4 border-gray-700"></div>
              <div className="absolute inset-[40%] rounded-full bg-gray-800"></div>
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="w-full md:w-2/3 space-y-4">
            <h3 className="text-xl font-medium">{tracks[currentTrack].title}</h3>
            <p className="text-sm text-gray-500">{tracks[currentTrack].releaseDate}</p>
            
            {/* Progress bar */}
            <div 
              className="h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Time indicator */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {audioRef.current ? 
                  `${Math.floor(audioRef.current.currentTime / 60)}:${String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0')}` : 
                  '0:00'}
              </span>
              <span>{tracks[currentTrack].duration}</span>
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-center items-center space-x-8">
              <button 
                onClick={handlePrevTrack}
                className="text-gray-600 hover:text-primary-DEFAULT transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 20L9 12l10-8v16z"></path>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"></polygon>
                  </svg>
                )}
              </button>
              
              <button 
                onClick={handleNextTrack}
                className="text-gray-600 hover:text-primary-DEFAULT transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 4l10 8-10 8V4z"></path>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </button>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Track List */}
      <div className="space-y-1">
        <h3 className="text-lg font-light mb-3">Tracks</h3>
        
        {tracks.map((track, index) => (
          <motion.div
            key={index}
            onClick={() => handleTrackSelection(index)}
            className={`p-3 flex justify-between items-center rounded-md cursor-pointer transition-colors ${
              currentTrack === index ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                {currentTrack === index && isPlaying ? (
                  <span className="w-2 h-2 bg-primary-DEFAULT rounded-full animate-pulse"></span>
                ) : (
                  <span className="text-sm text-gray-500">{index + 1}</span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">{track.title}</h4>
                <p className="text-xs text-gray-500">{track.releaseDate}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{track.duration}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Streaming Links */}
      <div className="pt-6">
        <h3 className="text-lg font-light mb-4">Listen On</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://open.spotify.com/artist/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Spotify
          </a>
          <a 
            href="https://music.apple.com/artist/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Apple Music
          </a>
          <a 
            href="https://soundcloud.com/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Soundcloud
          </a>
          <a 
            href="https://bandcamp.com/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Bandcamp
          </a>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        src={tracks[currentTrack].file}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default MusicPlayer;
```

## File: src/components/AboutSection/AboutSection.tsx

- Extension: .tsx
- Language: typescript
- Size: 7461 bytes
- Created: 2025-04-16 20:13:13
- Modified: 2025-04-16 20:13:13

### Code

```typescript

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
            {['Ambient', 'Experimental', 'Generative', 'Modular', 'Cinematic', 'Minimal', 'Spatial', 'Textural'].map((tag, index) => (
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
```

## File: src/components/ShowsSection/ShowsSection.tsx

- Extension: .tsx
- Language: typescript
- Size: 8801 bytes
- Created: 2025-04-16 20:13:24
- Modified: 2025-04-16 20:13:24

### Code

```typescript

// src/components/ShowsSection/ShowsSection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Show {
  id: string;
  date: string;
  venue: string;
  location: string;
  ticketLink?: string;
  isSoldOut?: boolean;
  isAnnounced?: boolean;
}

const ShowsSection = () => {
  // Shows data
  // For upcoming shows, we'll include actual shows
  // For past shows, add some example past shows
  const upcomingShows: Show[] = [
    {
      id: '1',
      date: 'Apr 30, 2025',
      venue: 'Spatial Sound Lab',
      location: 'Los Angeles, CA',
      ticketLink: 'https://tickets.example.com/arcova-la',
    },
    {
      id: '2',
      date: 'May 15, 2025',
      venue: 'The Echo Chamber',
      location: 'San Francisco, CA',
      ticketLink: 'https://tickets.example.com/arcova-sf',
    },
    {
      id: '3',
      date: 'June 11, 2025',
      venue: 'Digital Dreams Festival',
      location: 'New York, NY',
      isAnnounced: false,
    },
    {
      id: '4',
      date: 'July 22, 2025',
      venue: 'The Deep End',
      location: 'Austin, TX',
      isSoldOut: true,
    },
  ];

  const pastShows: Show[] = [
    {
      id: '5',
      date: 'Feb 18, 2025',
      venue: 'Signal Flow Gallery',
      location: 'Portland, OR',
    },
    {
      id: '6',
      date: 'Jan 25, 2025',
      venue: 'Data Dome',
      location: 'Seattle, WA',
    },
    {
      id: '7',
      date: 'Dec 15, 2024',
      venue: 'The Interface',
      location: 'Chicago, IL',
    },
  ];

  // Tab state for upcoming and past shows
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-light tracking-wider text-primary-DEFAULT mb-6">SHOWS</h2>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 font-medium text-sm tracking-wider transition-colors ${
            activeTab === 'upcoming'
              ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          UPCOMING
        </button>
        
        <button
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 font-medium text-sm tracking-wider transition-colors ${
            activeTab === 'past'
              ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          PAST
        </button>
      </div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingShows.length > 0 ? (
                upcomingShows.map((show) => (
                  <motion.div 
                    key={show.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                    whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4">
                      <div className="text-lg font-medium">{show.date}</div>
                      <div className="md:col-span-2">
                        <div className="font-medium">{show.venue}</div>
                        <div className="text-sm text-gray-500">{show.location}</div>
                      </div>
                      <div className="flex justify-end">
                        {show.isAnnounced === false ? (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                            Coming Soon
                          </span>
                        ) : show.isSoldOut ? (
                          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                            Sold Out
                          </span>
                        ) : (
                          <motion.a
                            href={show.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-primary-DEFAULT text-white text-sm px-4 py-2 rounded-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Tickets
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No upcoming shows at the moment.</p>
                  <p className="mt-2 text-sm text-gray-500">Check back soon for new announcements.</p>
                </div>
              )}
              
              {/* Call to action for booking */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">Want to book ARCOVA for your venue or event?</p>
                <motion.button
                  onClick={() => {
                    // Navigate to contact section
                    const contactLink = document.querySelector('button:contains("Contact")');
                    if (contactLink) {
                      (contactLink as HTMLButtonElement).click();
                    }
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-accent-light to-accent-DEFAULT text-white rounded-md text-sm tracking-wider"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  CONTACT FOR BOOKING
                </motion.button>
              </div>
            </div>
          )}
          
          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastShows.length > 0 ? (
                pastShows.map((show) => (
                  <motion.div 
                    key={show.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 opacity-80"
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4">
                      <div className="text-lg font-medium">{show.date}</div>
                      <div className="md:col-span-2">
                        <div className="font-medium">{show.venue}</div>
                        <div className="text-sm text-gray-500">{show.location}</div>
                      </div>
                      <div className="flex justify-end">
                        <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          Past Event
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No past shows to display.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Newsletter Signup for Show Updates */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">Never Miss a Show</h3>
        <p className="text-sm text-gray-600 mb-4">
          Subscribe to get notified about upcoming performances and ticket releases.
        </p>
        
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
            required
          />
          <motion.button
            type="submit"
            className="px-4 py-2 bg-primary-DEFAULT text-white rounded-md font-medium whitespace-nowrap"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            SUBSCRIBE
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ShowsSection;
```

