// src/components/layout/EnhancedLayout.tsx
import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export type SectionType = 'home' | 'music' | 'shows' | 'about' | 'contact';

interface LayoutProps {
  children: ReactNode;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const EnhancedLayout = ({ children, activeSection, onSectionChange }: LayoutProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Track particles for navigation
  const particlesRef = useRef<{
    points: { x: number; y: number; vx: number; vy: number }[];
    connections: { from: number; to: number }[];
  }>({
    points: [],
    connections: []
  });

  // Track section positions
  const sectionPositions = {
    home: { x: 0.5, y: 0.5 },
    music: { x: 0.25, y: 0.25 },
    shows: { x: 0.75, y: 0.25 },
    about: { x: 0.25, y: 0.75 },
    contact: { x: 0.75, y: 0.75 }
  };

  // Section colors - make them very vibrant
  const sectionColors = {
    home: '#e7702e',
    music: '#a82f39',
    shows: '#d45e1e',
    about: '#7b1e56',
    contact: '#f5b02e'
  };

  // Store actual node indices for sections
  const [sectionNodes, setSectionNodes] = useState<Record<SectionType, number>>({
    home: 0,
    music: 0,
    shows: 0,
    about: 0,
    contact: 0
  });

  // Animation path for navigation
  const [navigationPath, setNavigationPath] = useState<number[]>([]);
  const [navigationProgress, setNavigationProgress] = useState(0);
  
  // Initialize the particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Initialize particles
    const width = canvas.width;
    const height = canvas.height;
    const points = [];
    
    // Create a grid of points for more structured network
    const gridSize = 10;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    // Create fixed points for sections
    const sectionIndices: Record<SectionType, number> = {} as Record<SectionType, number>;
    
    Object.entries(sectionPositions).forEach(([section, pos]) => {
      const x = pos.x * width;
      const y = pos.y * height;
      
      // Add main section points
      points.push({
        x,
        y,
        vx: 0, // Fixed points don't move
        vy: 0
      });
      
      sectionIndices[section as SectionType] = points.length - 1;
    });
    
    // Add additional points throughout the grid
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Skip if we're too close to a section point
        const gridX = (i + 0.5) * cellWidth;
        const gridY = (j + 0.5) * cellHeight;
        
        let tooClose = false;
        Object.values(sectionPositions).forEach(pos => {
          const sectionX = pos.x * width;
          const sectionY = pos.y * height;
          const distSq = Math.pow(gridX - sectionX, 2) + Math.pow(gridY - sectionY, 2);
          if (distSq < Math.pow(cellWidth * 1.2, 2)) {
            tooClose = true;
          }
        });
        
        if (!tooClose) {
          // Add some randomness to grid position
          const jitter = cellWidth * 0.3;
          points.push({
            x: gridX + (Math.random() * jitter * 2) - jitter,
            y: gridY + (Math.random() * jitter * 2) - jitter,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
          });
        }
      }
    }
    
    // Add some completely random points
    for (let i = 0; i < 30; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1
      });
    }
    
    // Create connections between points
    const connections: { from: number; to: number }[] = [];
    
    // Connect each section to its 3 closest points
    Object.values(sectionIndices).forEach(sectionIndex => {
      const sectionPoint = points[sectionIndex];
      
      // Find closest points
      const distances = points.map((point, index) => {
        if (index === sectionIndex) return Infinity;
        const dx = point.x - sectionPoint.x;
        const dy = point.y - sectionPoint.y;
        return { index, dist: Math.sqrt(dx * dx + dy * dy) };
      });
      
      // Sort by distance
      distances.sort((a, b) => a.dist - b.dist);
      
      // Connect to 3 closest
      for (let i = 0; i < 3 && i < distances.length - 1; i++) {
        connections.push({ from: sectionIndex, to: distances[i].index });
      }
    });
    
    // Connect some random points
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < cellWidth * 1.5 && Math.random() > 0.7) {
          connections.push({ from: i, to: j });
        }
      }
    }
    
    // Make sure all points have at least one connection
    for (let i = 0; i < points.length; i++) {
      const hasConnection = connections.some(c => c.from === i || c.to === i);
      if (!hasConnection) {
        // Find closest point
        let closestIndex = -1;
        let closestDist = Infinity;
        
        for (let j = 0; j < points.length; j++) {
          if (i !== j) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < closestDist) {
              closestDist = dist;
              closestIndex = j;
            }
          }
        }
        
        if (closestIndex >= 0) {
          connections.push({ from: i, to: closestIndex });
        }
      }
    }
    
    // Store particles and connections
    particlesRef.current = { points, connections };
    setSectionNodes(sectionIndices);
    
    // Animation frame cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Draw the network and handle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { points, connections } = particlesRef.current;
    if (points.length === 0) return;
    
    let animFrameId: number;
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update points positions (except section points)
      for (let i = Object.values(sectionNodes).length; i < points.length; i++) {
        const point = points[i];
        
        // Boundaries check
        if (point.x <= 0 || point.x >= canvas.width) point.vx *= -1;
        if (point.y <= 0 || point.y >= canvas.height) point.vy *= -1;
        
        // Update position
        point.x += point.vx;
        point.y += point.vy;
      }
      
      // Draw connections
      ctx.lineWidth = 1.2; // Thicker lines
      connections.forEach(({ from, to }) => {
        const fromPoint = points[from];
        const toPoint = points[to];
        
        // Determine if this connection is part of active section
        const isActiveConnection = 
          Object.entries(sectionNodes).some(([section, index]) => 
            (section === activeSection && (index === from || index === to))
          );
        
        // Check if connection is part of navigation path
        const isNavigationConnection = isNavigating && navigationPath.some((nodeIndex, i) => {
          if (i === navigationPath.length - 1) return false;
          return (
            (nodeIndex === from && navigationPath[i + 1] === to) ||
            (nodeIndex === to && navigationPath[i + 1] === from)
          );
        });
        
        // Draw line with appropriate color
        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        
        if (isNavigationConnection) {
          ctx.strokeStyle = 'rgba(231, 112, 46, 0.9)'; // Bright connection for navigation
          ctx.lineWidth = 2.5;
        } else if (isActiveConnection) {
          ctx.strokeStyle = `rgba(123, 30, 86, 0.8)`; // Highlight active section connections
          ctx.lineWidth = 2;
        } else {
          // Make regular connections more visible
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
          ctx.lineWidth = 0.8;
        }
        
        ctx.stroke();
      });
      
      // Draw points
      points.forEach((point, index) => {
        // Determine if this point is a section point and which one
        let sectionType: SectionType | null = null;
        Object.entries(sectionNodes).forEach(([section, nodeIndex]) => {
          if (nodeIndex === index) {
            sectionType = section as SectionType;
          }
        });
        
        // Set point style based on type
        if (sectionType) {
          // Draw section point
          const isActive = sectionType === activeSection;
          
          // Larger, colorful circle for section points
          ctx.beginPath();
          ctx.arc(point.x, point.y, isActive ? 12 : 8, 0, Math.PI * 2);
          
          // Gradient fill
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, isActive ? 12 : 8
          );
          
          gradient.addColorStop(0, isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(1, sectionColors[sectionType]);
          
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Add border
          ctx.lineWidth = 2;
          ctx.strokeStyle = sectionColors[sectionType];
          ctx.stroke();
          
          // Add label
          ctx.font = isActive ? 'bold 14px Montserrat' : '12px Montserrat';
          ctx.fillStyle = isActive ? '#000000' : '#333333';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Position text above node
          const labelY = sectionType === 'home' ? point.y + 24 : point.y - 16;
          ctx.fillText(sectionType.toUpperCase(), point.x, labelY);
          
        } else {
          // Regular network point - make them more visible
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
          ctx.fill();
        }
      });
      
      // Draw navigation particle if navigating
      if (isNavigating && navigationPath.length > 1) {
        // Find position along the path
        const pathProgress = Math.min(navigationProgress * (navigationPath.length - 1), navigationPath.length - 1);
        const pathSegment = Math.floor(pathProgress);
        const segmentProgress = pathProgress - pathSegment;
        
        if (pathSegment < navigationPath.length - 1) {
          const fromIndex = navigationPath[pathSegment];
          const toIndex = navigationPath[pathSegment + 1];
          
          const fromPoint = points[fromIndex];
          const toPoint = points[toIndex];
          
          // Interpolate position
          const x = fromPoint.x + (toPoint.x - fromPoint.x) * segmentProgress;
          const y = fromPoint.y + (toPoint.y - fromPoint.y) * segmentProgress;
          
          // Draw navigation particle
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(231, 112, 46, 1)';
          ctx.fill();
          
          // Add glow effect
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
          glow.addColorStop(0, 'rgba(231, 112, 46, 0.6)');
          glow.addColorStop(1, 'rgba(231, 112, 46, 0)');
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }
      
      animFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [activeSection, isNavigating, navigationPath, navigationProgress, sectionNodes]);

  // Find a path between two nodes in the network
  const findPath = (startIndex: number, endIndex: number): number[] => {
    const { points, connections } = particlesRef.current;
    
    // Create adjacency list for BFS
    const adjacencyList: number[][] = Array(points.length).fill(0).map(() => []);
    
    connections.forEach(({ from, to }) => {
      adjacencyList[from].push(to);
      adjacencyList[to].push(from);
    });
    
    // BFS to find path
    const queue: { node: number; path: number[] }[] = [{ node: startIndex, path: [startIndex] }];
    const visited = new Set<number>([startIndex]);
    
    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      
      if (node === endIndex) {
        return path;
      }
      
      adjacencyList[node].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ 
            node: neighbor, 
            path: [...path, neighbor] 
          });
        }
      });
    }
    
    // If no path found, return direct path
    return [startIndex, endIndex];
  };

  // Handle section change with animation
  const handleSectionChange = (section: SectionType) => {
    if (isNavigating || section === activeSection) return;
    
    const startIndex = sectionNodes[activeSection];
    const endIndex = sectionNodes[section];
    
    // Find path through network
    const path = findPath(startIndex, endIndex);
    setNavigationPath(path);
    
    // Start animation
    setIsNavigating(true);
    setNavigationProgress(0);
    
    const startTime = performance.now();
    const duration = 1000; // ms
    
    const animateNavigation = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setNavigationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateNavigation);
      } else {
        // Navigation complete
        setIsNavigating(false);
        onSectionChange(section);
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(animateNavigation);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-text font-montserrat">
      {/* Particle network canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full" 
        style={{ zIndex: 0, pointerEvents: 'none' }}
      />
      
      {/* Regular navigation buttons - very visible */}
      <div className="fixed bottom-16 left-0 right-0 z-40 flex justify-center gap-3 md:gap-6 p-2">
        {['home', 'music', 'shows', 'about', 'contact'].map((section) => (
          <motion.button
            key={section}
            onClick={() => handleSectionChange(section as SectionType)}
            disabled={isNavigating || section === activeSection}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md text-sm uppercase tracking-wider shadow-md ${
              section === activeSection 
                ? 'bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {section}
          </motion.button>
        ))}
      </div>
      
      <div className="content-wrapper relative z-10">
        {children}
      </div>
      
      <footer className="px-5 py-5 text-center text-xs opacity-70 tracking-wider fixed bottom-2 w-full text-gray-700 z-40">
        © {new Date().getFullYear()} ARCOVA
      </footer>
    </div>
  );
};

export default EnhancedLayout;