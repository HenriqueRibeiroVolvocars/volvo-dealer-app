import { motion } from 'framer-motion';
import volvoWordmark from '@/assets/volvo-logo.png';

interface VolvoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
}

export function VolvoLogo({
  className = '',
  size = 'md',
  inverted = false
}: VolvoLogoProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  return (
    <motion.img
      src={volvoWordmark}
      alt="Volvo Cars"
      className={`${sizeClasses[size]} ${inverted ? 'invert' : ''} object-contain ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}
