import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuadrantCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  delay?: number;
  gradient?: string;
  external?: string;
}

export function QuadrantCard({
  title,
  description,
  icon: Icon,
  to,
  delay = 0,
  gradient,
  external,
}: QuadrantCardProps) {
  const CardContent = (
    <div className="quadrant-card relative overflow-hidden rounded-2xl border border-border/50 p-3 sm:p-4 md:p-6 h-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex flex-col justify-between transition-all duration-500">
      {/* Background gradient on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: gradient || 'var(--gradient-volvo)' }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-500">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500 quadrant-icon" />
        </div>
        
        <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary-foreground mb-2 transition-colors duration-500 quadrant-title">
          {title}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-500 quadrant-desc">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="relative z-10 flex justify-end mt-3 sm:mt-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary group-hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-500 group-hover:translate-x-1">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {external ? (
        <a href={external} target="_blank" rel="noopener noreferrer" className="block group">
          {CardContent}
        </a>
      ) : (
        <Link to={to} className="block group">
          {CardContent}
        </Link>
      )}
    </motion.div>
  );
}
