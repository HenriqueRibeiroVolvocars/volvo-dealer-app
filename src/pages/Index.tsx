import { GitCompare, FileSpreadsheet, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import { QuadrantCard } from '@/components/home/QuadrantCard';
import { VolvoLogo } from '@/components/ui/VolvoLogo';

const features = [
{
  title: 'Comparativo',
  description: 'Compare modelos Volvo com concorrentes e veja as vantagens',
  icon: GitCompare,
  to: '/comparativo',
  gradient: 'linear-gradient(135deg, hsl(210, 100%, 18%) 0%, hsl(200, 85%, 35%) 100%)'
},
{
  title: 'Dados Técnicos',
  description: 'Fichas técnicas e especificações de todos os modelos',
  icon: FileSpreadsheet,
  to: '/dados-tecnicos',
  gradient: 'linear-gradient(135deg, hsl(152, 60%, 30%) 0%, hsl(170, 50%, 40%) 100%)'
},
{
  title: 'Thrive Learner',
  description: 'Acesse a plataforma de treinamento e aprendizado Volvo',
  icon: GraduationCap,
  to: '/thrive',
  gradient: 'linear-gradient(135deg, hsl(280, 60%, 35%) 0%, hsl(300, 50%, 45%) 100%)',
  external: 'https://volvocars.learn.link/login'
}
];

const Index = () => {

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden max-h-[750px]:overflow-y-auto">

      <AppHeader />

      {/* Hero */}
      <motion.section
        className="bg-white flex justify-center items-center py-6"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:0.6}}
      >
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{y:20, opacity:0}}
          animate={{y:0, opacity:1}}
          transition={{delay:0.2}}
        >
          <VolvoLogo size="lg" className="mb-4 w-24 sm:w-24 md:w-40" />

          <span className="text-xs sm:text-sm font-light text-gray-600 tracking-[0.25em] uppercase">
            Dealer App
          </span>
        </motion.div>
      </motion.section>

      {/* Conteúdo central ocupa espaço disponível */}
      <section className="flex-1 container px-4 py-6 flex items-center">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {features.map((feature, index) => (
            <QuadrantCard
              key={feature.title}
              {...feature}
              delay={0.1 * (index + 1)}
            />
          ))}
        </div>

      </section>

      {/* Footer sempre aparece */}
      <footer className="container px-4 py-4 text-center">

        <p className="text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} Volvo Car Brasil • Uso interno
        </p>


      </footer>

    </div>
  );
};

export default Index;