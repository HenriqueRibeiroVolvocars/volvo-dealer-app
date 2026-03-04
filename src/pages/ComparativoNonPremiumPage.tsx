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
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [selectedCompetitorVersion, setSelectedCompetitorVersion] = useState<string>('');

  const volvoModelData = useMemo(
    () => nonPremiumVolvoModels.find(m => m.model === selectedModel),
    [nonPremiumVolvoModels, selectedModel]
  );

  const volvoVersionData = useMemo(
    () => volvoModelData?.versions.find(v => v.name === selectedVersion),
    [volvoModelData, selectedVersion]
  );

  const competitorData = useMemo(() => {
    if (!volvoModelData || !selectedCompetitor) return null;
    const [brand, ...modelParts] = selectedCompetitor.split(' ');
    const model = modelParts.join(' ');
    return volvoModelData.competitors.find(c => c.brand === brand && c.model === model);
  }, [volvoModelData, selectedCompetitor]);

  const competitorVersionData = useMemo(
    () => competitorData?.versions.find(v => v.name === selectedCompetitorVersion),
    [competitorData, selectedCompetitorVersion]
  );

  const canCompare = volvoVersionData && competitorVersionData;

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedVersion('');
    setSelectedCompetitor('');
    setSelectedCompetitorVersion('');
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    setSelectedCompetitor('');
    setSelectedCompetitorVersion('');
  };

  const handleCompetitorChange = (competitor: string) => {
    setSelectedCompetitor(competitor);
    setSelectedCompetitorVersion('');
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
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Volvo Selection */}
          <div className="volvo-card p-5">
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
                      {v.name} - {v.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Competitor Selection */}
          <div className="volvo-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Concorrente</h3>
            <div className="space-y-3">
              <Select
                value={selectedCompetitor}
                onValueChange={handleCompetitorChange}
                disabled={!selectedVersion}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o concorrente" />
                </SelectTrigger>
                <SelectContent>
                  {volvoModelData?.competitors.map(c => (
                    <SelectItem key={`${c.brand} ${c.model}`} value={`${c.brand} ${c.model}`}>
                      {c.brand} {c.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCompetitorVersion}
                onValueChange={setSelectedCompetitorVersion}
                disabled={!selectedCompetitor}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a versão" />
                </SelectTrigger>
                <SelectContent>
                  {competitorData?.versions.map(v => (
                    <SelectItem key={v.name} value={v.name}>
                      {v.name} - {v.price}
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
              <div className="mb-6 rounded-xl bg-gradient-volvo p-5 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Volvo {selectedModel} {selectedVersion}</p>
                    <p className="text-2xl font-bold">
                      {volvoAdvantages} vantagens
                    </p>
                    <p className="text-sm opacity-80">
                      sobre {selectedCompetitor} {selectedCompetitorVersion}
                    </p>
                  </div>
                  <Trophy className="w-12 h-12 opacity-80" />
                </div>
              </div>

              {/* Comparison Table */}
              <div className="volvo-card overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Parâmetro
                        </th>
                        <th className="text-center p-4 font-semibold text-primary">
                          Volvo {selectedModel}
                        </th>
                        <th className="text-center p-4 font-medium text-muted-foreground">
                          {selectedCompetitor}
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
                            <td className="p-4 text-sm font-medium">
                              {param.label}
                            </td>
                            <td className={`p-4 text-center font-semibold ${volvoWins ? 'text-success' : ''}`}>
                              <div className="flex items-center justify-center gap-2">
                                {volvoVal} {param.unit}
                                {volvoWins && <CheckCircle2 className="w-4 h-4 text-success" />}
                              </div>
                            </td>
                            <td className={`p-4 text-center ${compWins ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              <div className="flex items-center justify-center gap-2">
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
              <div className="volvo-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Por que escolher o Volvo {selectedModel}?
                </h3>
                <ul className="space-y-3">
                  {(nonPremiumSalesArguments[selectedModel] || []).map((arg, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{arg}</span>
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
