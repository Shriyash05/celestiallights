import { useState, useEffect } from 'react';
import { FloatingParticles, GlowingOrb, LightBeam, PulsingWaves, ElectricArcs, Constellation } from './LightAnimations';

type AnimationType = 'particles' | 'orb' | 'beam' | 'waves' | 'arcs' | 'constellation' | 'none';

interface AnimatedBackgroundProps {
  type?: AnimationType;
  autoRotate?: boolean;
  rotationInterval?: number;
}

const AnimatedBackground = ({ 
  type = 'particles', 
  autoRotate = true, 
  rotationInterval = 15000 
}: AnimatedBackgroundProps) => {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>(type);

  const animations: AnimationType[] = ['particles', 'constellation', 'waves', 'beam', 'arcs'];

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCurrentAnimation(prev => {
        const currentIndex = animations.indexOf(prev);
        const nextIndex = (currentIndex + 1) % animations.length;
        return animations[nextIndex];
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval]);

  const renderAnimation = () => {
    switch (currentAnimation) {
      case 'particles':
        return <FloatingParticles />;
      case 'orb':
        return <GlowingOrb />;
      case 'beam':
        return <LightBeam />;
      case 'waves':
        return <PulsingWaves />;
      case 'arcs':
        return <ElectricArcs />;
      case 'constellation':
        return <Constellation />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {renderAnimation()}
      
      {/* Animation indicator */}
      {autoRotate && (
        <div className="fixed bottom-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-yellow-400/80">
          {currentAnimation}
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground;