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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2 pb-2">
        <h2 className="text-2xl font-bold">Esmaül Hüsna</h2>
        <p className="text-muted-foreground">Allah'ın 99 Güzel İsmi</p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4">
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
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-center space-y-3">
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-lg font-bold text-primary">
                {selectedItem?.id}
              </div>
              
              {/* Arabic name */}
              <div className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'serif' }}>
                {selectedItem?.arabic}
              </div>
              
              {/* Transliteration */}
              <div className="text-2xl sm:text-3xl font-semibold text-muted-foreground">
                {selectedItem?.transliteration}
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh] pr-4">
            <div className="space-y-6 py-4">
              {/* Turkish meaning */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Anlamı</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  {selectedItem?.turkish}
                </p>
              </div>

              <Separator />

              {/* Dua */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Dua</h3>
                <DialogDescription asChild>
                  <p className="text-lg leading-relaxed text-foreground">
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
