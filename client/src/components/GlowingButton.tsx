import { ReactNode, useState, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlowingButtonProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  glowColor?: 'golden' | 'blue' | 'green' | 'red';
  intensity?: 'low' | 'medium' | 'high';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const GlowingButton = forwardRef<HTMLButtonElement, GlowingButtonProps>(
  function GlowingButton({
    children,
    variant = 'default',
    size = 'default',
    className,
    glowColor = 'golden',
    intensity = 'medium',
    onClick,
    disabled,
    type = 'button'
  }, ref) {
    const [isHovered, setIsHovered] = useState(false);

    const glowColors = {
      golden: {
        low: 'shadow-[0_0_10px_rgba(255,215,0,0.3)]',
        medium: 'shadow-[0_0_20px_rgba(255,215,0,0.5)]',
        high: 'shadow-[0_0_30px_rgba(255,215,0,0.7)]'
      },
      blue: {
        low: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
        medium: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
        high: 'shadow-[0_0_30px_rgba(59,130,246,0.7)]'
      },
      green: {
        low: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
        medium: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
        high: 'shadow-[0_0_30px_rgba(34,197,94,0.7)]'
      },
      red: {
        low: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
        medium: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
        high: 'shadow-[0_0_30px_rgba(239,68,68,0.7)]'
      }
    };

    const pulseAnimation = isHovered ? 'animate-pulse' : '';
    const glowClass = glowColors[glowColor][intensity];
    const hoverGlow = isHovered ? glowColors[glowColor].high : glowClass;

    return (
      <div className="relative">
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            'relative transition-all duration-300 ease-in-out',
            'before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r',
            'before:from-yellow-400/20 before:to-orange-400/20 before:opacity-0',
            'before:transition-opacity before:duration-300',
            'hover:before:opacity-100',
            hoverGlow,
            pulseAnimation,
            className
          )}
          onClick={onClick}
          disabled={disabled}
          type={type}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="relative z-10">{children}</span>
          
          {/* Sparkle effect on hover */}
          {isHovered && (
            <>
              <span className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
              <span className="absolute top-2 right-2 w-1 h-1 bg-orange-300 rounded-full animate-ping animation-delay-300" />
              <span className="absolute bottom-1 left-3 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-500" />
            </>
          )}
        </Button>
        
        <style>{`
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
          .animation-delay-500 {
            animation-delay: 0.5s;
          }
        `}</style>
      </div>
    );
  }
);

GlowingButton.displayName = 'GlowingButton';

export default GlowingButton;