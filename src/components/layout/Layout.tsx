// src/components/layout/Layout.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  activePage: string | null;
}

// Define a particle class for the background
class Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  radius: number;
  color: string;
  originalRadius: number;
  targetVelocityX: number;
  targetVelocityY: number;
  
  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.velocityX = (Math.random() - 0.5) * 0.2; // Increased speed
    this.velocityY = (Math.random() - 0.5) * 0.2;
    this.targetVelocityX = this.velocityX;
    this.targetVelocityY = this.velocityY;
    this.life = Math.random() * 10 * 60;
    this.originalRadius = 0.8 + Math.random() * 1.0; // More varied sizes
    this.radius = this.originalRadius;
    this.color = 'rgba(80, 80, 80, 0.3)';
  }
  
  // Update particle position and properties
  update(width: number, height: number, deltaTime: number) {
    // Gradually adjust velocity toward target velocity (makes movement more organic)
    this.velocityX += (this.targetVelocityX - this.velocityX) * 0.01;
    this.velocityY += (this.targetVelocityY - this.velocityY) * 0.01;
    
    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    
    // Wrap around edges for infinite effect
    if (this.x < 0) this.x += width;
    else if (this.x > width) this.x -= width;
    
    if (this.y < 0) this.y += height;
    else if (this.y > height) this.y -= height;
    
    // Decrease life
    this.life--;
    if (this.life < 1) {
      // Reset particle with new properties
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.targetVelocityX = (Math.random() - 0.5) * 0.2;
      this.targetVelocityY = (Math.random() - 0.5) * 0.2;
      this.life = Math.random() * 10 * 60;
      this.originalRadius = 0.8 + Math.random() * 1.0;
      this.radius = this.originalRadius;
    }
    
    // Occasionally change target velocity to make particles feel alive
    if (Math.random() < 0.001) {
      this.targetVelocityX = (Math.random() - 0.5) * 0.2;
      this.targetVelocityY = (Math.random() - 0.5) * 0.2;
    }
  }
  
  // Draw particle with camera offset
  draw(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Calculate position adjusted for camera
    const drawX = (this.x - cameraX) % ctx.canvas.width;
    const drawY = (this.y - cameraY) % ctx.canvas.height;
    
    // Handle negative modulo (JavaScript quirk)
    const x = drawX < 0 ? drawX + ctx.canvas.width : drawX;
    const y = drawY < 0 ? drawY + ctx.canvas.height : drawY;
    
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const Layout = ({ children, activePage }: LayoutProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  // Camera movement state
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const targetCameraRef = useRef({ x: 0, y: 0 });
  const lastPageRef = useRef<string | null>(null);
  const isAnimatingRef = useRef(false);
  
  // Define page positions in a 2D space
  const pagePositions = {
    'home': { x: 0, y: 0 },
    'music': { x: -2000, y: -1500 },
    'shows': { x: 2000, y: -1200 },
    'about': { x: -1800, y: 2000 },
    'contact': { x: 1800, y: 1600 }
  };

  // Initialize canvas and create particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Create particles
    if (particlesRef.current.length === 0) {
      const particleCount = Math.min(200, Math.max(120, Math.floor((dimensions.width * dimensions.height) / 8000)));
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(dimensions.width, dimensions.height));
      }
      console.log(`Created ${particlesRef.current.length} particles`);
    }
    
    setIsCanvasReady(true);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      
      if (width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions.width, dimensions.height]);

  // Main animation loop
  useEffect(() => {
    if (!isCanvasReady) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw connections between particles
    const drawConnections = () => {
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          
          // Calculate positions with camera offset
          const x1 = (p1.x - camera.x) % canvas.width;
          const y1 = (p1.y - camera.y) % canvas.height;
          const x2 = (p2.x - camera.x) % canvas.width;
          const y2 = (p2.y - camera.y) % canvas.height;
          
          // Handle negative modulo
          const drawX1 = x1 < 0 ? x1 + canvas.width : x1;
          const drawY1 = y1 < 0 ? y1 + canvas.height : y1;
          const drawX2 = x2 < 0 ? x2 + canvas.width : x2;
          const drawY2 = y2 < 0 ? y2 + canvas.height : y2;
          
          // Calculate direct distance
          const dx = Math.abs(drawX2 - drawX1);
          const dy = Math.abs(drawY2 - drawY1);
          
          // Handle wrap-around distance (choose the shorter path)
          const wrappedDx = Math.min(dx, canvas.width - dx);
          const wrappedDy = Math.min(dy, canvas.height - dy);
          
          const distance = Math.sqrt(wrappedDx * wrappedDx + wrappedDy * wrappedDy);
          
          // Draw line if particles are close enough (increased connection distance)
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = `rgba(80, 80, 80, ${opacity})`;
            
            // Only draw if particles aren't too far apart in screen space
            if (dx < canvas.width / 2 && dy < canvas.height / 2) {
              ctx.beginPath();
              ctx.moveTo(drawX1, drawY1);
              ctx.lineTo(drawX2, drawY2);
              ctx.stroke();
            }
          }
        }
      }
    };
    
    // Update all particles
    const updateParticles = (deltaTime: number) => {
      particlesRef.current.forEach(particle => {
        particle.update(dimensions.width, dimensions.height, deltaTime);
      });
    };
    
    // Draw all particles
    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        particle.draw(ctx, camera.x, camera.y);
      });
    };
    
    // Update camera position with smooth easing
    const updateCamera = (deltaTime: number) => {
      if (isAnimatingRef.current) {
        // Calculate distance to target
        const dx = targetCameraRef.current.x - camera.x;
        const dy = targetCameraRef.current.y - camera.y;
        
        // Check if we've arrived
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          isAnimatingRef.current = false;
        } else {
          // Move camera with smooth easing
          const easeAmount = 0.03 * deltaTime / 16; // Adjust for frame rate
          setCamera(prev => ({
            x: prev.x + dx * easeAmount,
            y: prev.y + dy * easeAmount
          }));
        }
      }
    };
    
    // Main animation loop
    const animate = (timestamp: number) => {
      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;
      
      // Clear the canvas with a slightly transparent white to create trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // More transparent for better trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update camera position
      updateCamera(deltaTime);
      
      // Update and draw particles
      updateParticles(deltaTime);
      drawConnections();
      drawParticles();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isCanvasReady, dimensions.width, dimensions.height, camera]);

  // Handle page changes
  useEffect(() => {
    if (!isCanvasReady || !activePage) return;
    
    // Skip first render
    if (lastPageRef.current === null) {
      lastPageRef.current = activePage;
      return;
    }
    
    // Don't animate if we're already on this page
    if (lastPageRef.current === activePage) return;
    
    // Set target camera position
    targetCameraRef.current = pagePositions[activePage];
    
    // Start camera animation
    isAnimatingRef.current = true;
    
    // Save current page as last page
    lastPageRef.current = activePage;
    
    // Add extra velocity to particles during transition for more dynamic feel
    particlesRef.current.forEach(particle => {
      // Add a bit of extra push in the direction we're moving
      const dirX = pagePositions[activePage].x - camera.x;
      const dirY = pagePositions[activePage].y - camera.y;
      
      // Normalize direction
      const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
      if (magnitude > 0) {
        const normalizedDirX = dirX / magnitude;
        const normalizedDirY = dirY / magnitude;
        
        // Add some random variation for organic feel
        particle.targetVelocityX += normalizedDirX * (0.1 + Math.random() * 0.3);
        particle.targetVelocityY += normalizedDirY * (0.1 + Math.random() * 0.3);
      }
    });
  }, [activePage, isCanvasReady, camera]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-text font-montserrat">
      {/* Canvas background - fixed position with dynamic movement */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full" 
        style={{ 
          zIndex: 0, 
          pointerEvents: 'none', 
          display: 'block' 
        }} 
      />
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;