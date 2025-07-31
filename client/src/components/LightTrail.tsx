import { useEffect, useRef } from 'react';

interface LightTrailProps {
  intensity?: number;
  color?: string;
  duration?: number;
}

const LightTrail = ({ 
  intensity = 20, 
  color = '#FFD700', 
  duration = 1000 
}: LightTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const trail = useRef<Array<{ x: number; y: number; age: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Add new trail point
      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0
      });

      // Limit trail length
      if (trail.current.length > intensity) {
        trail.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw trail
      trail.current.forEach((point, index) => {
        point.age += 16; // Approximate 60fps

        if (point.age < duration) {
          const opacity = 1 - (point.age / duration);
          const size = 3 + (opacity * 5);

          ctx.save();
          ctx.globalAlpha = opacity * 0.8;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Draw connection lines
          if (index > 0) {
            const prevPoint = trail.current[index - 1];
            ctx.save();
            ctx.globalAlpha = opacity * 0.3;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      // Remove old points
      trail.current = trail.current.filter(point => point.age < duration);

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, color, duration]);

  return (
    <canvas
  ref={canvasRef}
  className="fixed inset-0 pointer-events-none z-50"
  style={{ mixBlendMode: 'screen' }}
/>
  );
};

export default LightTrail;