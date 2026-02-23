import React, { useState } from 'react';
import { EsmaulHusnaCard } from './EsmaulHusnaCard';
import { esmaulHusnaData, EsmaulHusnaItem } from './esmaulHusnaData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

export function EsmaulHusnaTab() {
  const [selectedItem, setSelectedItem] = useState<EsmaulHusnaItem | null>(null);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="text-center space-y-1 sm:space-y-2 pb-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Esmaül Hüsna</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Allah'ın 99 Güzel İsmi</p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {esmaulHusnaData.map((item) => (
          <EsmaulHusnaCard
            key={item.id}
            item={item}
            onSelect={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-center space-y-2 sm:space-y-3">
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-base sm:text-lg font-bold text-primary">
                {selectedItem?.id}
              </div>
              
              {/* Arabic name */}
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: 'serif' }}>
                {selectedItem?.arabic}
              </div>
              
              {/* Transliteration */}
              <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
                {selectedItem?.transliteration}
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh] pr-3 sm:pr-4">
            <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
              {/* Turkish meaning */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-primary">Anlamı</h3>
                <p className="text-base sm:text-lg leading-relaxed text-foreground">
                  {selectedItem?.turkish}
                </p>
              </div>

              <Separator />

              {/* Dua */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-primary">Dua</h3>
                <DialogDescription asChild>
                  <p className="text-base sm:text-lg leading-relaxed text-foreground">
                    {selectedItem?.dua}
                  </p>
                </DialogDescription>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
