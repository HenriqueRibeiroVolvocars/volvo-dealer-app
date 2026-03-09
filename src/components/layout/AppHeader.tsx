import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { VolvoLogo } from '@/components/ui/VolvoLogo';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack = false }: AppHeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return null;
  }

  return (
    <motion.header
      className="sticky top-0 z-50 glass border-b border-border/30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-14 sm:h-16 items-center justify-center px-4 relative">

        {showBack && (
          <Link
            to="/"
            className="absolute left-2 sm:left-4 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Voltar</span>
          </Link>
        )}

        <div className="flex items-center gap-3">
          <VolvoLogo size="lg" className="w-16 sm:w-20 md:w-24" />

          <span className="text-muted-foreground text-sm">|</span>

          <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider uppercase">
            {title || 'Dealer App'}
          </span>
        </div>

      </div>
    </motion.header>
  );
}