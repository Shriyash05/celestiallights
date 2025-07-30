import { useEffect, useRef } from 'react';

// Floating light particles animation
export const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.shadowBlur = 20;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Pulse effect
        particle.opacity = 0.2 + Math.sin(Date.now() * 0.002 + particle.x * 0.01) * 0.3;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

// Glowing orb that follows mouse
export const GlowingOrb = () => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const handleMouseMove = (e: MouseEvent) => {
      orb.style.left = `${e.clientX - 100}px`;
      orb.style.top = `${e.clientY - 100}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={orbRef}
      className="fixed w-48 h-48 pointer-events-none z-0 transition-all duration-300 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
      }}
    />
  );
};

// Light beam scanning effect
export const LightBeam = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute w-2 h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent"
        style={{
          animation: 'lightScan 8s linear infinite',
          filter: 'blur(2px)',
        }}
      />
      <style>{`
        @keyframes lightScan {
          0% { 
            left: -10px; 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            left: 100vw; 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
};

// Pulsing light waves
export const PulsingWaves = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-yellow-400/20"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            animation: `pulseWave ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulseWave {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

// Electric arc animation
export const ElectricArcs = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const createArc = () => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = startY + (Math.random() - 0.5) * 200;
      
      const cp1X = startX + (Math.random() - 0.5) * 100;
      const cp1Y = startY + (Math.random() - 0.5) * 100;
      const cp2X = endX + (Math.random() - 0.5) * 100;
      const cp2Y = endY + (Math.random() - 0.5) * 100;

      const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      
      path.setAttribute('d', d);
      path.setAttribute('stroke', '#FFD700');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.6');
      path.style.filter = 'drop-shadow(0 0 10px #FFD700)';
      path.style.animation = 'arcFlicker 0.3s ease-in-out';

      svg.appendChild(path);

      setTimeout(() => {
        path.remove();
      }, 300);
    };

    const interval = setInterval(createArc, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      />
      <style>{`
        @keyframes arcFlicker {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

// Constellation effect
export const Constellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{
      x: number;
      y: number;
      brightness: number;
      twinkle: number;
    }> = [];

    // Create stars
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        brightness: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
      ctx.lineWidth = 1;

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach(star => {
        star.brightness += star.twinkle;
        if (star.brightness > 1 || star.brightness < 0.2) {
          star.twinkle = -star.twinkle;
        }

        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = `rgba(255, 215, 0, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};