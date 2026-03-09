import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trophy, ChevronDown, Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { comparisonParameters, type VehicleVersion } from '@/data/comparisonData';
import { nonPremiumSalesArguments } from '@/data/nonPremiumComparisonData';
import { useVehicleData } from '@/hooks/useVehicleData';

function parseNumericValue(value: string): number | null {
  if (value === '-' || value === '' || value === 'N/A') return null;
  const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || null;
}

function compareValues(
  volvoVal: string,
  competitorVal: string,
  higherIsBetter: boolean | null
): 'volvo' | 'competitor' | 'tie' | 'na' {
  if (higherIsBetter === null) return 'na';
  
  const v1 = parseNumericValue(volvoVal);
  const v2 = parseNumericValue(competitorVal);
  
  if (v1 === null || v2 === null) return 'na';
  if (v1 === v2) return 'tie';
  
  if (higherIsBetter) {
    return v1 > v2 ? 'volvo' : 'competitor';
  } else {
    return v1 < v2 ? 'volvo' : 'competitor';
  }
}

export default function ComparativoNonPremiumPage() {
  const { data: nonPremiumVolvoModels = [], isLoading, error } = useVehicleData('Non Premium');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedCompetitorBrand, setSelectedCompetitorBrand] = useState<string>('');
  const [selectedCompetitorModel, setSelectedCompetitorModel] = useState<string>('');

  const volvoModelData = useMemo(
    () => nonPremiumVolvoModels.find(m => m.model === selectedModel),
    [nonPremiumVolvoModels, selectedModel]
  );

  const volvoVersionData = useMemo(
    () => volvoModelData?.versions.find(v => v.name === selectedVersion),
    [volvoModelData, selectedVersion]
  );

  const competitorData = useMemo(() => {
    if (!volvoModelData || !selectedCompetitorBrand || !selectedCompetitorModel) return null;
    return volvoModelData.competitors.find(c => c.brand === selectedCompetitorBrand && c.model === selectedCompetitorModel);
  }, [volvoModelData, selectedCompetitorBrand, selectedCompetitorModel]);

  const competitorVersionData = useMemo(
    () => competitorData?.versions[0], // Use first version as default
    [competitorData]
  );

  const availableCompetitorBrands = useMemo(() => {
    if (!volvoModelData) return [];
    const brands = volvoModelData.competitors.map(c => c.brand);
    return [...new Set(brands)].sort();
  }, [volvoModelData]);

  const availableCompetitorModels = useMemo(() => {
    if (!volvoModelData || !selectedCompetitorBrand) return [];
    return volvoModelData.competitors
      .filter(c => c.brand === selectedCompetitorBrand)
      .map(c => c.model)
      .sort();
  }, [volvoModelData, selectedCompetitorBrand]);

  const canCompare = volvoVersionData && competitorVersionData;

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedVersion('');
    setSelectedCompetitorBrand('');
    setSelectedCompetitorModel('');
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    setSelectedCompetitorBrand('');
    setSelectedCompetitorModel('');
  };

  const handleCompetitorBrandChange = (brand: string) => {
    setSelectedCompetitorBrand(brand);
    setSelectedCompetitorModel('');
  };

  const handleCompetitorModelChange = (model: string) => {
    setSelectedCompetitorModel(model);
  };

  const getValue = (version: VehicleVersion, key: string): string => {
    const keyMap: Record<string, keyof VehicleVersion> = {
      power: 'power',
      acceleration: 'acceleration',
      autonomy: 'autonomy',
      battery: 'battery',
      chargingTime: 'chargingTime',
      trunk: 'trunk',
      os: 'os',
      ncapAdult: 'ncapAdult',
      ncapChildren: 'ncapChildren',
      dealerships: 'dealerships',
      resaleValue: 'resaleValue',
    };
    return version[keyMap[key]] || '-';
  };

  const volvoAdvantages = useMemo(() => {
    if (!canCompare) return 0;
    let count = 0;
    comparisonParameters.forEach(param => {
      const result = compareValues(
        getValue(volvoVersionData!, param.key),
        getValue(competitorVersionData!, param.key),
        param.higherIsBetter
      );
      if (result === 'volvo') count++;
    });
    return count;
  }, [canCompare, volvoVersionData, competitorVersionData]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Comparativo Não Premium" showBack />

      <div className="container px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">
            <p>Erro ao carregar dados. Tente novamente.</p>
          </div>
        ) : (
        <>
        {/* Selection Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Volvo Selection */}
          <div className="volvo-card p-4 sm:p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Volvo</h3>
            <div className="space-y-3">
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {nonPremiumVolvoModels.map(m => (
                    <SelectItem key={m.model} value={m.model}>
                      Volvo {m.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedVersion}
                onValueChange={handleVersionChange}
                disabled={!selectedModel}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a versão" />
                </SelectTrigger>
                <SelectContent>
                  {volvoModelData?.versions.map(v => (
                    <SelectItem key={v.name} value={v.name}>
                      {v.price ? `${v.name} - ${v.price}` : v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Competitor Selection */}
          <div className="volvo-card p-4 sm:p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Concorrente</h3>
            <div className="space-y-3">
              <Select
                value={selectedCompetitorBrand}
                onValueChange={handleCompetitorBrandChange}
                disabled={!selectedVersion}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {availableCompetitorBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCompetitorModel}
                onValueChange={handleCompetitorModelChange}
                disabled={!selectedCompetitorBrand}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {availableCompetitorModels.map(model => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Comparison Results */}
        <AnimatePresence mode="wait">
          {canCompare && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Summary Banner */}
              <div className="mb-4 sm:mb-6 rounded-xl bg-gradient-volvo p-4 sm:p-5 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm opacity-80">Volvo {selectedModel} {selectedVersion}</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {volvoAdvantages} vantagens
                    </p>
                    <p className="text-xs sm:text-sm opacity-80">
                      sobre {selectedCompetitorBrand} {selectedCompetitorModel}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 sm:w-12 sm:h-12 opacity-80 flex-shrink-0" />
                </div>
              </div>

              {/* Comparison Table */}
              <div className="volvo-card overflow-hidden mb-6 sm:mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 sm:p-4 font-medium text-muted-foreground text-sm sm:text-base">
                          Parâmetro
                        </th>
                        <th className="text-center p-3 sm:p-4 font-semibold text-primary text-sm sm:text-base">
                          Volvo {selectedModel}
                        </th>
                        <th className="text-center p-3 sm:p-4 font-medium text-muted-foreground text-sm sm:text-base">
                          {selectedCompetitorBrand} {selectedCompetitorModel}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonParameters.map((param, index) => {
                        const volvoVal = getValue(volvoVersionData!, param.key);
                        const compVal = getValue(competitorVersionData!, param.key);
                        const result = compareValues(volvoVal, compVal, param.higherIsBetter);
                        const volvoWins = result === 'volvo';
                        const compWins = result === 'competitor';

                        return (
                          <motion.tr
                            key={param.key}
                            className="border-b border-border/50 last:border-0"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium">
                              {param.label}
                            </td>
                            <td className={`p-3 sm:p-4 text-center font-semibold text-xs sm:text-sm ${volvoWins ? 'text-success' : ''}`}>
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                {volvoVal} {param.unit}
                                {volvoWins && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-success" />}
                              </div>
                            </td>
                            <td className={`p-3 sm:p-4 text-center text-xs sm:text-sm ${compWins ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                {compVal} {param.unit}
                                {compWins && <span className="text-xs">(melhor)</span>}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sales Arguments */}
              <div className="volvo-card p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Por que escolher o Volvo {selectedModel}?
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {(nonPremiumSalesArguments[selectedModel] || []).map((arg, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 sm:gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm">{arg}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!canCompare && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              Selecione os veículos para comparar
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Escolha um modelo Volvo e um concorrente não premium acima
            </p>
          </motion.div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
