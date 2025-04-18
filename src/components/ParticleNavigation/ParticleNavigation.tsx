// src/components/ParticleNavigation/ParticleNavigation.tsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Types
export type SectionType = 'home' | 'music' | 'shows' | 'about' | 'contact';

interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  connections: Particle[];
}

interface ParticleSystemState {
  particles: Particle[];
  width: number;
  height: number;
  initialized: boolean;
}

interface ParticleNavigationProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

// Section positions - these are just starting points, we'll find the nearest particle
const sectionPositions = {
  home: { x: 0.5, y: 0.5 },     // Center
  music: { x: 0.25, y: 0.25 },  // Top left
  shows: { x: 0.75, y: 0.25 },  // Top right
  about: { x: 0.25, y: 0.75 },  // Bottom left
  contact: { x: 0.75, y: 0.75 } // Bottom right
};

const ParticleNavigation: React.FC<ParticleNavigationProps> = ({ activeSection, onSectionChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // For tracking the background particle system
  const systemRef = useRef<ParticleSystemState>({
    particles: [],
    width: 0,
    height: 0,
    initialized: false
  });
  
  // For navigation animation
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Actual particles used for destinations
  const [sectionParticles, setSectionParticles] = useState<Record<SectionType, Particle | null>>({
    home: null,
    music: null,
    shows: null,
    about: null,
    contact: null
  });

  // Drawing configuration
  const config = {
    particleColor: 'rgba(80, 80, 80, 0.2)',
    lineColor: 'rgba(100, 100, 100, 0.15)',
    activeLineColor: 'rgba(123, 30, 86, 0.6)',
    navigatingParticleColor: 'rgba(231, 112, 46, 1)',
    navigatingLineColor: 'rgba(231, 112, 46, 0.8)',
    particleRadius: 1,
    navigatingParticleRadius: 4,
    lineWidth: 0.5,
    navigatingLineWidth: 2,
    lineLength: 200,
    particleCount: 100,
    particleMaxVelocity: 0.05,
    particleLife: 10
  };

  // Initialize the particle system
  const initializeParticleSystem = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { width, height } = canvas;
    const system = systemRef.current;
    
    // Clear existing particles
    system.particles = [];
    system.width = width;
    system.height = height;
    
    // Create particles
    for (let i = 0; i < config.particleCount; i++) {
      system.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        velocityX: Math.random() * (config.particleMaxVelocity * 2) - config.particleMaxVelocity,
        velocityY: Math.random() * (config.particleMaxVelocity * 2) - config.particleMaxVelocity,
        life: Math.random() * config.particleLife * 60,
        connections: []
      });
    }
    
    // Flag as initialized
    system.initialized = true;
    
    // Find particles for each section
    updateSectionParticles();
  };

  // Find particles closest to each section position
  const updateSectionParticles = () => {
    const system = systemRef.current;
    if (!system.initialized) return;
    
    const newSectionParticles: Record<SectionType, Particle | null> = {
      home: null,
      music: null,
      shows: null,
      about: null,
      contact: null
    };
    
    // For each section, find the closest particle
    Object.entries(sectionPositions).forEach(([section, position]) => {
      const sectionKey = section as SectionType;
      const targetX = position.x * system.width;
      const targetY = position.y * system.height;
      
      let closestParticle = null;
      let closestDistance = Infinity;
      
      system.particles.forEach(particle => {
        const distance = Math.sqrt(
          Math.pow(particle.x - targetX, 2) + 
          Math.pow(particle.y - targetY, 2)
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestParticle = particle;
        }
      });
      
      if (closestParticle) {
        newSectionParticles[sectionKey] = closestParticle;
      }
    });
    
    setSectionParticles(newSectionParticles);
  };

  // Update particle positions
  const updateParticles = () => {
    const system = systemRef.current;
    if (!system.initialized) return;
    
    system.particles.forEach(particle => {
      // Update position
      if (particle.x + particle.velocityX > system.width && particle.velocityX > 0 || 
          particle.x + particle.velocityX < 0 && particle.velocityX < 0) {
        particle.velocityX *= -1;
      }
      
      if (particle.y + particle.velocityY > system.height && particle.velocityY > 0 || 
          particle.y + particle.velocityY < 0 && particle.velocityY < 0) {
        particle.velocityY *= -1;
      }
      
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      
      // Update life
      if (particle.life < 1) {
        particle.x = Math.random() * system.width;
        particle.y = Math.random() * system.height;
        particle.velocityX = Math.random() * (config.particleMaxVelocity * 2) - config.particleMaxVelocity;
        particle.velocityY = Math.random() * (config.particleMaxVelocity * 2) - config.particleMaxVelocity;
        particle.life = Math.random() * config.particleLife * 60;
      }
      
      particle.life--;
      
      // Clear connections
      particle.connections = [];
    });
    
    // Update connections between particles
    system.particles.forEach((particle, i) => {
      for (let j = i + 1; j < system.particles.length; j++) {
        const otherParticle = system.particles[j];
        const distance = Math.sqrt(
          Math.pow(particle.x - otherParticle.x, 2) + 
          Math.pow(particle.y - otherParticle.y, 2)
        );
        
        if (distance < config.lineLength) {
          particle.connections.push(otherParticle);
          otherParticle.connections.push(particle);
        }
      }
    });
  };

  // Draw the particle system
  const drawParticleSystem = (ctx: CanvasRenderingContext2D, navigationPath?: Particle[]) => {
    const system = systemRef.current;
    if (!system.initialized) return;
    
    const activeSectionParticle = sectionParticles[activeSection];
    
    // Clear canvas
    ctx.clearRect(0, 0, system.width, system.height);
    
    // Draw connections first (behind particles)
    system.particles.forEach(particle => {
      particle.connections.forEach(connectedParticle => {
        // Only draw each connection once (avoid duplicates)
        if (system.particles.indexOf(particle) < system.particles.indexOf(connectedParticle)) {
          const isActive = 
            (particle === activeSectionParticle || connectedParticle === activeSectionParticle) &&
            !navigationPath;
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connectedParticle.x, connectedParticle.y);
          
          const distance = Math.sqrt(
            Math.pow(particle.x - connectedParticle.x, 2) + 
            Math.pow(particle.y - connectedParticle.y, 2)
          );
          
          const opacity = 1 - (distance / config.lineLength);
          
          if (isActive) {
            ctx.strokeStyle = config.activeLineColor;
            ctx.lineWidth = config.lineWidth * 2;
          } else {
            ctx.strokeStyle = `rgba(100, 100, 100, ${opacity * 0.15})`;
            ctx.lineWidth = config.lineWidth;
          }
          
          ctx.stroke();
        }
      });
    });
    
    // Draw particles
    system.particles.forEach(particle => {
      const isSectionParticle = Object.values(sectionParticles).includes(particle);
      const isActiveSectionParticle = particle === activeSectionParticle;
      
      ctx.beginPath();
      ctx.arc(
        particle.x, 
        particle.y, 
        isSectionParticle ? config.particleRadius * 3 : config.particleRadius,
        0, 
        Math.PI * 2
      );
      
      if (isActiveSectionParticle && !navigationPath) {
        // Active section particle
        ctx.fillStyle = 'rgba(231, 112, 46, 0.8)';
      } else if (isSectionParticle) {
        // Other section particles
        ctx.fillStyle = 'rgba(123, 30, 86, 0.4)';
      } else {
        // Regular particles
        ctx.fillStyle = config.particleColor;
      }
      
      ctx.fill();
    });
    
    // Draw navigation path if provided
    if (navigationPath && navigationPath.length > 1) {
      // Draw the path lines
      ctx.beginPath();
      ctx.moveTo(navigationPath[0].x, navigationPath[0].y);
      
      for (let i = 1; i < navigationPath.length; i++) {
        ctx.lineTo(navigationPath[i].x, navigationPath[i].y);
      }
      
      ctx.strokeStyle = config.navigatingLineColor;
      ctx.lineWidth = config.navigatingLineWidth;
      ctx.stroke();
      
      // Draw the navigator particle
      const navigatorPosition = navigationPath[Math.floor(navigationProgress * (navigationPath.length - 1))];
      
      if (navigatorPosition) {
        ctx.beginPath();
        ctx.arc(
          navigatorPosition.x,
          navigatorPosition.y,
          config.navigatingParticleRadius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = config.navigatingParticleColor;
        ctx.fill();
        
        // Add a glow effect
        const glowGradient = ctx.createRadialGradient(
          navigatorPosition.x,
          navigatorPosition.y,
          config.navigatingParticleRadius * 0.5,
          navigatorPosition.x,
          navigatorPosition.y,
          config.navigatingParticleRadius * 4
        );
        
        glowGradient.addColorStop(0, 'rgba(231, 112, 46, 0.6)');
        glowGradient.addColorStop(1, 'rgba(231, 112, 46, 0)');
        
        ctx.beginPath();
        ctx.arc(
          navigatorPosition.x,
          navigatorPosition.y,
          config.navigatingParticleRadius * 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }
    }
    
    // Draw section labels
    Object.entries(sectionParticles).forEach(([section, particle]) => {
      if (!particle) return;
      
      const isActive = section === activeSection && !navigationPath;
      
      ctx.font = isActive ? 'bold 13px Montserrat' : '12px Montserrat';
      ctx.fillStyle = isActive ? '#7b1e56' : 'rgba(100, 100, 100, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Position the label based on section position to avoid overlap
      const sectionKey = section as SectionType;
      const offset = 25; // Distance from particle
      
      let labelX = particle.x;
      let labelY = particle.y;
      
      if (sectionKey === 'home') {
        labelY += offset;
      } else if (sectionKey === 'music') {
        labelX -= offset;
        labelY -= offset;
      } else if (sectionKey === 'shows') {
        labelX += offset;
        labelY -= offset;
      } else if (sectionKey === 'about') {
        labelX -= offset;
        labelY += offset;
      } else if (sectionKey === 'contact') {
        labelX += offset;
        labelY += offset;
      }
      
      ctx.fillText(section.toUpperCase(), labelX, labelY);
    });
  };

  // Find a path between two section particles
  const findPath = (startParticle: Particle, endParticle: Particle): Particle[] => {
    if (startParticle === endParticle) return [startParticle];
    
    // Simple breadth-first search to find a path
    const queue: { particle: Particle; path: Particle[] }[] = [
      { particle: startParticle, path: [startParticle] }
    ];
    const visited = new Set<Particle>([startParticle]);
    
    // If direct connection exists, use it
    if (startParticle.connections.includes(endParticle)) {
      return [startParticle, endParticle];
    }
    
    while (queue.length > 0) {
      const { particle, path } = queue.shift()!;
      
      for (const connectedParticle of particle.connections) {
        if (connectedParticle === endParticle) {
          // Found path to end
          return [...path, endParticle];
        }
        
        if (!visited.has(connectedParticle)) {
          visited.add(connectedParticle);
          queue.push({
            particle: connectedParticle,
            path: [...path, connectedParticle]
          });
        }
      }
      
      // Limit search depth to avoid performance issues
      if (path.length > 5) break;
    }
    
    // If no path found, create a direct line
    return [startParticle, endParticle];
  };

  // Navigation progress (0 to 1)
  const [navigationProgress, setNavigationProgress] = useState(0);
  const [navigationPath, setNavigationPath] = useState<Particle[] | null>(null);
  const [targetSection, setTargetSection] = useState<SectionType | null>(null);

  // Start navigation animation
  const navigateToSection = (targetSectionKey: SectionType) => {
    if (isNavigating || targetSectionKey === activeSection) return;
    
    const startParticle = sectionParticles[activeSection];
    const endParticle = sectionParticles[targetSectionKey];
    
    if (!startParticle || !endParticle) return;
    
    // Find path
    let path = findPath(startParticle, endParticle);
    
    // If path is too short (direct connection), add some intermediate particles
    if (path.length < 3) {
      // Create smoother path with some intermediate particles from the system
      const system = systemRef.current;
      const intermediateCandidates = system.particles.filter(p => 
        p !== startParticle && p !== endParticle
      );
      
      // Add 1-3 intermediate particles
      const newPath = [startParticle];
      const numIntermediates = Math.min(3, intermediateCandidates.length);
      
      for (let i = 0; i < numIntermediates; i++) {
        // Find a reasonable intermediate (not too far from a straight line)
        const dx = endParticle.x - startParticle.x;
        const dy = endParticle.y - startParticle.y;
        const pathLength = Math.sqrt(dx * dx + dy * dy);
        
        let bestParticle = null;
        let bestScore = Infinity;
        
        intermediateCandidates.forEach(particle => {
          // Calculate how far this particle is from the ideal path
          const t = ((i + 1) / (numIntermediates + 1)); // Position along path (0-1)
          const idealX = startParticle.x + dx * t;
          const idealY = startParticle.y + dy * t;
          
          const distanceFromIdeal = Math.sqrt(
            Math.pow(particle.x - idealX, 2) + 
            Math.pow(particle.y - idealY, 2)
          );
          
          // Score based on distance from ideal point and existing connections
          const connectionScore = (particle.connections.includes(newPath[newPath.length - 1])) ? 0 : 50;
          const score = distanceFromIdeal + connectionScore;
          
          if (score < bestScore) {
            bestScore = score;
            bestParticle = particle;
          }
        });
        
        if (bestParticle) {
          newPath.push(bestParticle);
          // Remove from candidates to avoid reusing
          const index = intermediateCandidates.indexOf(bestParticle);
          if (index > -1) intermediateCandidates.splice(index, 1);
        }
      }
      
      newPath.push(endParticle);
      path = newPath;
    }
    
    // Start animation
    setNavigationPath(path);
    setNavigationProgress(0);
    setIsNavigating(true);
    setTargetSection(targetSectionKey);
    
    // Animate progress
    const startTime = performance.now();
    const duration = 1200; // ms
    
    const animateNavigation = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setNavigationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateNavigation);
      } else {
        // Navigation complete
        setIsNavigating(false);
        setNavigationPath(null);
        
        if (targetSection) {
          onSectionChange(targetSection);
          setTargetSection(null);
        }
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animateNavigation);
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const render = () => {
      updateParticles();
      drawParticleSystem(ctx, navigationPath || undefined);
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    // Start the animation loop
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [navigationPath, activeSection]);

  // Initialize and handle resize
  useEffect(() => {
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Set canvas size to match viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize the particle system
      initializeParticleSystem();
    };
    
    initializeCanvas();
    
    // Handle window resize
    const handleResize = () => {
      initializeCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Section positions might need to be updated when particles change
  useEffect(() => {
    // Update section particles periodically to keep them relevant
    const interval = setInterval(() => {
      if (!isNavigating) {
        updateSectionParticles();
      }
    }, 5000); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [isNavigating]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Navigation Buttons */}
      <div className="fixed bottom-16 left-0 right-0 z-30 flex justify-center gap-3 md:gap-6 p-2">
        {Object.keys(sectionParticles).map((section) => (
          <motion.button
            key={section}
            onClick={() => navigateToSection(section as SectionType)}
            disabled={isNavigating || section === activeSection}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
              section === activeSection 
                ? 'bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white' 
                : 'bg-white bg-opacity-70 text-gray-600 hover:bg-opacity-100'
            }`}
          >
            {section}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ParticleNavigation;