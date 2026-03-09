import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VehicleImageSet, imageLabels } from '@/data/vehicleImages';
import { Button } from '@/components/ui/button';

interface VehicleGalleryProps {
  images: VehicleImageSet;
  modelName: string;
}

type ImageKey = keyof VehicleImageSet;

const imageOrder: ImageKey[] = ['exterior', 'frente', 'traseira', 'interior', 'bancos', 'console'];

export function VehicleGallery({ images, modelName }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentKey = imageOrder[currentIndex];
  const currentImage = images[currentKey];
  const currentLabel = imageLabels[currentKey];

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageOrder.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === imageOrder.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="volvo-card overflow-hidden">
      {/* Main Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-muted overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={`${modelName} - ${currentLabel}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-8 h-8 sm:w-10 sm:h-10"
          onClick={goPrev}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 w-8 h-8 sm:w-10 sm:h-10"
          onClick={goNext}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Current Label */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
          <span className="text-xs sm:text-sm font-medium">{currentLabel}</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="p-3 sm:p-4 bg-card">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageOrder.map((key, index) => (
            <button
              key={key}
              onClick={() => goTo(index)}
              className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              <img
                src={images[key]}
                alt={imageLabels[key]}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  layoutId="thumbnail-active"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
