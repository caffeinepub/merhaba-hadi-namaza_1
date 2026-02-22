import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { duaCategories, duasByCategory, type DuaCategory, type Dua } from './duaGuideData';

export function DuaGuideTab() {
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory>('general');
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);

  const currentDuas = duasByCategory[selectedCategory];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dua Rehberi</h2>
        <p className="text-sm text-muted-foreground">
          Farklı durumlar için dualar ve zikir önerileri
        </p>
      </div>

      {/* Category Selection */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as DuaCategory)}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
          {duaCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex-col gap-1 py-2 h-auto text-xs"
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Dua List */}
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-3">
          {currentDuas.map((dua) => (
            <Card
              key={dua.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedDua(dua)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{dua.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">{dua.occasion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Dua Detail Dialog */}
      <Dialog open={!!selectedDua} onOpenChange={(open) => !open && setSelectedDua(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]" aria-describedby="dua-occasion">
          <DialogHeader>
            <DialogTitle>{selectedDua?.title}</DialogTitle>
            <DialogDescription id="dua-occasion">{selectedDua?.occasion}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {selectedDua?.arabic && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Arapça</h4>
                  <p className="text-right text-xl leading-relaxed font-arabic p-4 bg-muted/50 rounded-lg" dir="rtl">
                    {selectedDua.arabic}
                  </p>
                </div>
              )}
              {selectedDua?.transliteration && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Okunuşu</h4>
                  <p className="text-sm italic p-3 bg-secondary/50 rounded-lg">
                    {selectedDua.transliteration}
                  </p>
                </div>
              )}
              {selectedDua?.translation && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Anlamı</h4>
                  <p className="text-sm leading-relaxed p-3 bg-accent/50 rounded-lg">
                    {selectedDua.translation}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
