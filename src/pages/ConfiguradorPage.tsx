import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Armchair, ChevronDown, Car, ImageOff } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  availableModels,
  getVersionsForModel,
  getConfiguration,
  type ColorOption,
  type InteriorOption,
} from '@/data/configuratorData';
import { getVehicleImages } from '@/data/vehicleImages';
import { VehicleGallery } from '@/components/configurator/VehicleGallery';

export default function ConfiguradorPage() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedInterior, setSelectedInterior] = useState<InteriorOption | null>(null);

  const versions = useMemo(
    () => (selectedModel ? getVersionsForModel(selectedModel) : []),
    [selectedModel]
  );

  const config = useMemo(
    () => (selectedModel && selectedVersion ? getConfiguration(selectedModel, selectedVersion) : null),
    [selectedModel, selectedVersion]
  );

  // Get vehicle images based on current selection
  const vehicleImages = useMemo(() => {
    if (!selectedModel || !selectedVersion || !selectedColor || !selectedInterior) {
      return null;
    }
    return getVehicleImages(selectedModel, selectedVersion, selectedColor.name, selectedInterior.name);
  }, [selectedModel, selectedVersion, selectedColor, selectedInterior]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedVersion('');
    setSelectedColor(null);
    setSelectedInterior(null);
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    const newConfig = getConfiguration(selectedModel, version);
    if (newConfig) {
      setSelectedColor(newConfig.colors[0] || null);
      setSelectedInterior(newConfig.interiors[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Configurador" showBack />

      <div className="container px-4 py-4 sm:py-6">
        {/* Model Selection */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full h-12 sm:h-14 text-sm sm:text-base">
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map(model => (
                <SelectItem key={model} value={model}>
                  Volvo {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedVersion}
            onValueChange={handleVersionChange}
            disabled={!selectedModel}
          >
            <SelectTrigger className="w-full h-14">
              <SelectValue placeholder="Selecione a versão" />
            </SelectTrigger>
            <SelectContent>
              {versions.map(version => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <AnimatePresence mode="wait">
          {config && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Vehicle Gallery or Placeholder */}
              {vehicleImages ? (
                <VehicleGallery
                  images={vehicleImages}
                  modelName={`Volvo ${selectedModel} ${selectedVersion}`}
                />
              ) : (
                <div className="volvo-card p-8 flex flex-col items-center justify-center min-h-[200px]">
                  <motion.div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: selectedColor?.hex || '#1A1A1A' }}
                    animate={{ backgroundColor: selectedColor?.hex || '#1A1A1A' }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedColor ? (
                      <Car className="w-12 h-12 text-primary-foreground/80" />
                    ) : (
                      <ImageOff className="w-12 h-12 text-primary-foreground/50" />
                    )}
                  </motion.div>
                  <h2 className="text-xl font-semibold">
                    Volvo {selectedModel} {selectedVersion}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedColor?.name} • {selectedInterior?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Imagens não disponíveis para esta configuração
                  </p>
                </div>
              )}

              {/* Color Selection */}
              <div className="volvo-card p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base">Cor Exterior</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {config.colors.map((color, index) => (
                    <motion.button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor?.name === color.name
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedColor?.name === color.name && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-primary"
                          layoutId="color-selected"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {selectedColor.name} {selectedColor.metallic && '(Metálico)'}
                  </p>
                )}
              </div>

              {/* Interior Selection */}
              <div className="volvo-card p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Armchair className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base">Interior</h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {config.interiors.map((interior, index) => (
                    <motion.button
                      key={interior.name}
                      onClick={() => setSelectedInterior(interior)}
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                        selectedInterior?.name === interior.name
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-border"
                        style={{ backgroundColor: interior.color }}
                      />
                      <span className="font-medium text-sm">{interior.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!config && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              Configure seu Volvo
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Selecione modelo e versão para começar
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
