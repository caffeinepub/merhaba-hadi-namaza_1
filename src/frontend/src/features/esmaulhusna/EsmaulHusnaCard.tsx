import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { EsmaulHusnaItem } from './esmaulHusnaData';

interface EsmaulHusnaCardProps {
  item: EsmaulHusnaItem;
  onSelect: () => void;
}

// Color palette for cards - warm, accessible colors
const cardColors = [
  'bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30',
  'bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30',
  'bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30',
  'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200',
  'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200',
  'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200',
];

export function EsmaulHusnaCard({ item, onSelect }: EsmaulHusnaCardProps) {
  // Rotate colors based on item id
  const colorClass = cardColors[(item.id - 1) % cardColors.length];

  return (
    <Card
      className={`${colorClass} cursor-pointer transition-all hover:scale-105 hover:shadow-lg active:scale-100`}
      onClick={onSelect}
    >
      <CardContent className="p-8 text-center space-y-4">
        {/* Number badge */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/80 text-sm font-bold text-foreground">
          {item.id}
        </div>

        {/* Arabic name - very large */}
        <div className="text-5xl sm:text-6xl font-bold text-foreground leading-tight" style={{ fontFamily: 'serif' }}>
          {item.arabic}
        </div>

        {/* Transliteration - large and readable */}
        <div className="text-2xl sm:text-3xl font-semibold text-foreground/90">
          {item.transliteration}
        </div>

        {/* Tap hint */}
        <div className="text-sm text-muted-foreground pt-2">
          Anlamı ve duası için dokunun
        </div>
      </CardContent>
    </Card>
  );
}
