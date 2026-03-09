import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Users } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';

export default function ComparativoSelectorPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Comparativo" showBack />

      <div className="container px-4 py-6 sm:py-8">
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Escolha o tipo de comparativo</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Compare veículos Volvo com concorrentes premium ou não premium
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {/* Premium Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/comparativo/premium" className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 p-4 sm:p-6 h-full min-h-[200px] sm:min-h-[240px] flex flex-col transition-all duration-500 hover:border-primary/30">
                {/* Background gradient on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, hsl(210, 100%, 18%) 0%, hsl(200, 85%, 35%) 100%)' }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-500">
                    <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  
                  <h3 className="text-lg sm:text-2xl font-bold text-foreground group-hover:text-primary-foreground mb-2 transition-colors duration-500">
                    Premium
                  </h3>
                  
                  <p className="text-sm sm:text-base text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-500 mb-4">
                    Compare com marcas premium tradicionais
                  </p>

                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {['BMW', 'Mercedes', 'Audi', 'Mini'].map(brand => (
                        <span
                          key={brand}
                          className="text-xs px-2 py-1 rounded-full bg-muted group-hover:bg-primary-foreground/20 text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-500"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="relative z-10 flex justify-end mt-4">
                  <div className="w-10 h-10 rounded-full bg-secondary group-hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-500 group-hover:translate-x-1">
                    <svg
                      className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Non-Premium Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/comparativo/non-premium" className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 p-4 sm:p-6 h-full min-h-[200px] sm:min-h-[240px] flex flex-col transition-all duration-500 hover:border-primary/30">
                {/* Background gradient on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, hsl(152, 60%, 30%) 0%, hsl(170, 50%, 40%) 100%)' }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-primary/10 group-hover:bg-primary-foreground/20 flex items-center justify-center mb-3 sm:mb-4 transition-colors duration-500">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  
                  <h3 className="text-lg sm:text-2xl font-bold text-foreground group-hover:text-primary-foreground mb-2 transition-colors duration-500">
                    Não Premium
                  </h3>
                  
                  <p className="text-sm sm:text-base text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-500 mb-4">
                    Compare com marcas populares e chinesas
                  </p>

                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {['BYD', 'GWM', 'Toyota', 'Honda', 'Jeep'].map(brand => (
                        <span
                          key={brand}
                          className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted group-hover:bg-primary-foreground/20 text-muted-foreground group-hover:text-primary-foreground/80 transition-colors duration-500"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
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
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
