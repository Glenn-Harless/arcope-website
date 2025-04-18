// src/components/GraphNavigation/GraphNavigation.tsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Types
export type SectionType = 'home' | 'music' | 'shows' | 'about' | 'contact';

interface Node {
  id: SectionType;
  label: string;
  x: number;
  y: number;
  size: number;
}

interface Edge {
  source: SectionType;
  target: SectionType;
}

interface GraphNavigationProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const GraphNavigation: React.FC<GraphNavigationProps> = ({ activeSection, onSectionChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Track if we're currently animating a transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<SectionType | null>(null);

  // Define the nodes (sections) in our graph
  const nodes: Node[] = [
    { id: 'home', label: 'HOME', x: 0.5, y: 0.5, size: 22 },
    { id: 'music', label: 'MUSIC', x: 0.25, y: 0.25, size: 18 },
    { id: 'shows', label: 'SHOWS', x: 0.75, y: 0.25, size: 18 },
    { id: 'about', label: 'ABOUT', x: 0.25, y: 0.75, size: 18 },
    { id: 'contact', label: 'CONTACT', x: 0.75, y: 0.75, size: 18 },
  ];

  // Define the edges (connections) between nodes
  const edges: Edge[] = [
    { source: 'home', target: 'music' },
    { source: 'home', target: 'shows' },
    { source: 'home', target: 'about' },
    { source: 'home', target: 'contact' },
    { source: 'music', target: 'shows' },
    { source: 'shows', target: 'contact' },
    { source: 'about', target: 'contact' },
    { source: 'music', target: 'about' },
  ];

  // Calculate actual positions based on container size
  const getNodePositions = () => {
    if (!containerRef.current) return nodes;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    return nodes.map(node => ({
      ...node,
      actualX: node.x * width,
      actualY: node.y * height,
    }));
  };

  // Find a node by coordinates (for click handling)
  const findNodeByCoordinates = (x: number, y: number) => {
    const nodePositions = getNodePositions();
    
    for (const node of nodePositions) {
      const dx = node.actualX! - x;
      const dy = node.actualY! - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.size * 2) { // Increased hit area for better usability
        return node;
      }
    }
    return null;
  };

  // Handle canvas clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTransitioning) return;
    
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedNode = findNodeByCoordinates(x, y);
    
    if (clickedNode && clickedNode.id !== activeSection) {
      console.log(`Clicked on node: ${clickedNode.id}`); // Debug log
      animateTransition(activeSection, clickedNode.id);
    }
  };

  // Direct section change handler for fallback buttons
  const handleDirectSectionChange = (section: SectionType) => {
    if (section !== activeSection && !isTransitioning) {
      animateTransition(activeSection, section);
    }
  };

  // Handle canvas mouse move for hover effects
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const hoverNode = findNodeByCoordinates(x, y);
    setHoveredNode(hoverNode ? hoverNode.id : null);
    
    // Change cursor to pointer when hovering over a node
    if (canvasRef.current) {
      canvasRef.current.style.cursor = hoverNode ? 'pointer' : 'default';
    }
  };

  // Animate transition between sections
  const animateTransition = (from: SectionType, to: SectionType) => {
    setIsTransitioning(true);
    
    // Find the start and end nodes
    const startNode = nodes.find(n => n.id === from)!;
    const endNode = nodes.find(n => n.id === to)!;
    
    // Determine if there's a direct edge
    const hasDirectEdge = edges.some(
      e => (e.source === from && e.target === to) || (e.source === to && e.target === from)
    );
    
    // If there's a direct edge, animate directly, otherwise go through home
    if (hasDirectEdge) {
      // Timing for the animation
      const startTime = performance.now();
      const duration = 800; // ms
      
      const animateDirectPath = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        drawGraph(progress, startNode, endNode);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateDirectPath);
        } else {
          onSectionChange(to);
          setIsTransitioning(false);
        }
      };
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      animationRef.current = requestAnimationFrame(animateDirectPath);
    } else {
      // Go directly to the destination without animation
      // This simplifies the navigation to prevent issues
      onSectionChange(to);
      setIsTransitioning(false);
    }
  };

  // Draw the graph on canvas
  const drawGraph = (transitionProgress = 0, fromNode?: Node, toNode?: Node) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate actual positions
    const nodePositions = getNodePositions();
    
    // Draw edges
    ctx.lineWidth = 1.5; // Slightly thicker for better visibility
    edges.forEach(edge => {
      const source = nodePositions.find(n => n.id === edge.source)!;
      const target = nodePositions.find(n => n.id === edge.target)!;
      
      // Skip drawing edge that's being animated
      if (fromNode && toNode && 
          ((source.id === fromNode.id && target.id === toNode.id) || 
           (source.id === toNode.id && target.id === fromNode.id))) {
        return;
      }
      
      const isActiveEdge = (source.id === activeSection || target.id === activeSection);
      
      ctx.beginPath();
      ctx.moveTo(source.actualX!, source.actualY!);
      ctx.lineTo(target.actualX!, target.actualY!);
      ctx.strokeStyle = isActiveEdge 
        ? 'rgba(123, 30, 86, 0.7)' // Primary color for active edges (more visible)
        : 'rgba(180, 180, 180, 0.4)'; // Gray for inactive (more visible)
      ctx.stroke();
    });
    
    // Draw animated transition edge if in transition
    if (transitionProgress > 0 && fromNode && toNode) {
      const sourcePos = nodePositions.find(n => n.id === fromNode.id)!;
      const targetPos = nodePositions.find(n => n.id === toNode.id)!;
      
      // Draw the animated edge
      ctx.beginPath();
      ctx.moveTo(sourcePos.actualX!, sourcePos.actualY!);
      
      // Calculate intermediate point along the edge
      const x = sourcePos.actualX! + (targetPos.actualX! - sourcePos.actualX!) * transitionProgress;
      const y = sourcePos.actualY! + (targetPos.actualY! - sourcePos.actualY!) * transitionProgress;
      
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(231, 112, 46, 0.9)'; // Accent color (more visible)
      ctx.lineWidth = 3; // Thicker for animation
      ctx.stroke();
      
      // Draw animated "particle" moving along the edge
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2); // Larger particle
      ctx.fillStyle = 'rgba(231, 112, 46, 1)';
      ctx.fill();
    }
    
    // Draw nodes
    nodePositions.forEach(node => {
      const isActive = node.id === activeSection;
      const isHovered = node.id === hoveredNode;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(
        node.actualX!, 
        node.actualY!, 
        isActive ? node.size * 1.2 : isHovered ? node.size * 1.1 : node.size,
        0, 
        Math.PI * 2
      );
      
      // Node styles based on state
      if (isActive) {
        // Gradient fill for active node
        const gradient = ctx.createRadialGradient(
          node.actualX!, node.actualY!, 0,
          node.actualX!, node.actualY!, node.size * 1.5
        );
        gradient.addColorStop(0, 'rgba(231, 112, 46, 0.9)');
        gradient.addColorStop(1, 'rgba(123, 30, 86, 0.7)');
        ctx.fillStyle = gradient;
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(231, 112, 46, 0.6)'; // More visible hover state
      } else {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.6)'; // More visible inactive state
      }
      
      ctx.fill();
      
      // Node border
      ctx.strokeStyle = isActive 
        ? 'rgba(231, 112, 46, 0.9)' 
        : isHovered 
          ? 'rgba(231, 112, 46, 0.8)'
          : 'rgba(180, 180, 180, 0.6)';
      ctx.lineWidth = isActive ? 3 : isHovered ? 2 : 1.5; // Thicker borders
      ctx.stroke();
      
      // Node label
      ctx.font = isActive 
        ? 'bold 14px Montserrat' // Larger font
        : isHovered
          ? '14px Montserrat' // Larger font
          : '12px Montserrat'; // Larger font
      ctx.fillStyle = isActive 
        ? '#7b1e56' 
        : isHovered
          ? '#e7702e'
          : '#666666';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.actualX!, node.actualY! + node.size * 1.5);
    });
  };

  // Initialize and handle resize
  useEffect(() => {
    const initializeCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        drawGraph();
      }
    };
    
    // Ensure the canvas is properly sized
    initializeCanvas();
    
    // Redraw on window resize
    const handleResize = () => {
      console.log("Window resized, redrawing graph");
      initializeCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Force redraw after a moment to ensure everything is rendered
    const timer = setTimeout(() => {
      console.log("Forced redraw of graph");
      initializeCanvas();
    }, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Redraw when active section or hover state changes
  useEffect(() => {
    console.log(`Active section changed to: ${activeSection}`);
    drawGraph();
  }, [activeSection, hoveredNode]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0 flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        className="absolute inset-0 z-20"
        style={{ touchAction: 'none' }} // Better touch handling
      />
      
      {/* Visible backup navigation buttons */}
      <div className="fixed bottom-16 left-0 right-0 z-30 flex justify-center gap-3 md:gap-6 p-2">
        {nodes.map(node => (
          <motion.button
            key={node.id}
            onClick={() => handleDirectSectionChange(node.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
              node.id === activeSection 
                ? 'bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white' 
                : 'bg-white bg-opacity-70 text-gray-600 hover:bg-opacity-100'
            }`}
          >
            {node.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GraphNavigation;