import { motion } from 'framer-motion';
import { Zap, ExternalLink, Battery, DollarSign, Leaf, Clock } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: DollarSign,
    title: 'Economia de Combustível',
    description: 'Compare o custo real entre elétrico e combustão baseado no seu uso diário',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    description: 'Veja quanto CO₂ você deixa de emitir ao ano com um elétrico',
  },
  {
    icon: Battery,
    title: 'Recarga em Casa',
    description: 'Calcule o custo de instalação do carregador residencial',
  },
  {
    icon: Clock,
    title: 'Tempo de Recarga',
    description: 'Entenda como funciona a rotina de recarga no dia a dia',
  },
];

export default function HomeChargePage() {
  const handleOpenHomeCharge = () => {
    window.open('https://preview--volvo-charge-compare.lovable.app/', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Volvo Home Charge" showBack />

      <div className="container px-4 py-4 sm:py-6">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-volvo mx-auto mb-4 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Zap className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Volvo Home Charge</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Calculadora de vantagens do carro elétrico para ajudar na argumentação com o cliente
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 sm:mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="volvo-card p-4 sm:p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div
          className="volvo-card p-4 sm:p-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold mb-3 text-sm sm:text-base">Como usar com o cliente</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span>Pergunte quantos km o cliente roda por dia em média</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span>Descubra qual o valor da energia elétrica na região dele</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span>Use a calculadora para mostrar a economia real</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <span>Destaque os benefícios ambientais e a praticidade da recarga em casa</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="w-full h-12 sm:h-16 text-sm sm:text-lg font-semibold bg-gradient-volvo hover:opacity-90 transition-opacity"
            onClick={handleOpenHomeCharge}
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Abrir Volvo Home Charge
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Abre a calculadora oficial Volvo em nova janela
          </p>
        </motion.div>
      </div>
    </div>
  );
}
