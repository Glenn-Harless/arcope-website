// src/components/layout/Layout.tsx
import { ReactNode, useEffect, useRef } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context");
      return;
    }

    console.log("Canvas setup successful");
    
    let width: number, height: number;
    
    // Much more visible particles
    const properties = {
      bgColor: 'rgba(255, 255, 255, 0.15)',
      particleColor: 'rgba(80, 80, 80, 0.3)', // Darker, more opaque particles
      particleRadius: 1.2, // Much larger particles
      particleCount: 60, // More particles
      particleMaxVelocity: 0.1, // Faster movement
      lineLength: 250, // Longer connection lines
      particleLife: 10
    };
    
    // Keep track of whether particles have been initialized
    let particlesInitialized = false;
    
    class Particle {
      x: number;
      y: number;
      velocityX: number;
      velocityY: number;
      life: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.life = Math.random() * properties.particleLife * 60;
      }
      
      position() {
        this.x + this.velocityX > width && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX;
        this.y + this.velocityY > height && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY;
        this.x += this.velocityX;
        this.y += this.velocityY;
      }
      
      reDraw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = properties.particleColor;
        ctx.fill();
      }
      
      reCalculateLife() {
        if (this.life < 1) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
          this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
          this.life = Math.random() * properties.particleLife * 60;
        }
        this.life--;
      }
    }
    
    const particles: Particle[] = [];
    
    function drawLines() {
      let x1, y1, x2, y2, length, opacity;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          x1 = particles[i].x;
          y1 = particles[i].y;
          x2 = particles[j].x;
          y2 = particles[j].y;
          length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          if (length < properties.lineLength) {
            opacity = (1 - length / properties.lineLength) * 0.2; // Higher opacity
            ctx.lineWidth = 0.8; // Thicker lines
            ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    }
    
    function reDrawParticles() {
      for (let i = 0; i < particles.length; i++) {
        particles[i].reCalculateLife();
        particles[i].position();
        particles[i].reDraw();
      }
    }
    
    function loop() {
      ctx.fillStyle = properties.bgColor;
      ctx.fillRect(0, 0, width, height);
      reDrawParticles();
      drawLines();
      requestAnimationFrame(loop);
    }
    
    function init() {
      // Clear any existing particles
      particles.length = 0;
      
      for (let i = 0; i < properties.particleCount; i++) {
        particles.push(new Particle());
      }
      
      particlesInitialized = true;
      console.log(`Initialized ${particles.length} particles`);
      
      loop();
    }
    
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Set canvas to full viewport size
      canvas.width = width;
      canvas.height = height;
      
      console.log(`Canvas resized: ${width}x${height}`);
      
      // Reinitialize particles if they were already initialized
      if (particlesInitialized) {
        init();
      }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    init();
    
    // Force a redraw after a short delay to ensure canvas is visible
    setTimeout(() => {
      console.log("Forcing redraw");
      resizeCanvas();
      init();
    }, 500);
    
    return () => {
      console.log("Cleaning up event listeners");
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-text font-montserrat">
      {/* Make sure canvas is absolutely positioned and covers the whole viewport */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full" 
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