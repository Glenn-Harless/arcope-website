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
      particleColor: 'rgba(60, 60, 60, 0.5)', // Darker, more opaque particles
      particleRadius: 1.5, // Much larger particles
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
        if (!ctx) return;
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
      if (!ctx) return;
      let x1, y1, x2, y2, length, opacity;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          x1 = particles[i].x;
          y1 = particles[i].y;
          x2 = particles[j].x;
          y2 = particles[j].y;
          length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          if (length < properties.lineLength) {
            opacity = (1 - length / properties.lineLength) * 0.3; // Higher opacity
            ctx.lineWidth = 1.0; // Thicker lines
            ctx.strokeStyle = `rgba(80, 80, 80, ${opacity})`;
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
      if (!ctx) return;
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
      if (!canvas) return;
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
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="layout relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ zIndex: 1 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;