import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useCurrentPrayerSlot } from './useCurrentPrayerSlot';
import { usePrayerTimeCardContent } from './usePrayerTimeCardContent';
import type { AdjustedPrayerTimes } from './currentPrayerSlot';
import { BookOpen, MessageSquare, Heart, Sparkles } from 'lucide-react';

interface PrayerTimeCardsSectionProps {
  adjustedTimes: AdjustedPrayerTimes | null;
  isLoading: boolean;
  error: any;
}

type CardType = 'verse' | 'hadith' | 'dua' | 'esma';

interface CardConfig {
  type: CardType;
  title: string;
  icon: React.ElementType;
  bgGradient: string;
  iconColor: string;
  borderColor: string;
}

const cardConfigs: CardConfig[] = [
  {
    type: 'verse',
    title: 'Vaktin Ayeti',
    icon: BookOpen,
    bgGradient: 'bg-gradient-to-br from-primary/20 to-primary/5',
    iconColor: 'text-primary',
    borderColor: 'border-primary/30'
  },
  {
    type: 'hadith',
    title: 'Vaktin Hadisi',
    icon: MessageSquare,
    bgGradient: 'bg-gradient-to-br from-secondary/20 to-secondary/5',
    iconColor: 'text-secondary-foreground',
    borderColor: 'border-secondary/30'
  },
  {
    type: 'dua',
    title: 'Vaktin Duası',
    icon: Heart,
    bgGradient: 'bg-gradient-to-br from-accent/20 to-accent/5',
    iconColor: 'text-accent-foreground',
    borderColor: 'border-accent/30'
  },
  {
    type: 'esma',
    title: 'Vaktin Esmaül Hüsnası',
    icon: Sparkles,
    bgGradient: 'bg-gradient-to-br from-chart-2/20 to-chart-2/5',
    iconColor: 'text-chart-2',
    borderColor: 'border-chart-2/30'
  }
];

export function PrayerTimeCardsSection({ adjustedTimes, isLoading, error }: PrayerTimeCardsSectionProps) {
  const currentSlot = useCurrentPrayerSlot(adjustedTimes);
  const content = usePrayerTimeCardContent(currentSlot);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Don't show if loading, error, or no times
  if (isLoading || error || !adjustedTimes || !content) {
    return null;
  }

  const handleCardClick = (type: CardType) => {
    setSelectedCard(type);
    setDialogOpen(true);
  };

  const getCardContent = (type: CardType) => {
    switch (type) {
      case 'verse':
        return {
          arabic: content.verse.arabic,
          turkish: content.verse.turkish,
          reference: content.verse.reference
        };
      case 'hadith':
        return {
          arabic: content.hadith.arabic,
          turkish: content.hadith.turkish,
          reference: content.hadith.source
        };
      case 'dua':
        return {
          arabic: content.dua.arabic,
          turkish: content.dua.turkish,
          reference: content.dua.occasion
        };
      case 'esma':
        return {
          arabic: content.esma.arabic,
          turkish: content.esma.turkish,
          reference: content.esma.transliteration
        };
    }
  };

  const selectedContent = selectedCard ? getCardContent(selectedCard) : null;
  const selectedConfig = cardConfigs.find(c => c.type === selectedCard);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {cardConfigs.map((config) => {
          const Icon = config.icon;
          const cardContent = getCardContent(config.type);
          
          return (
            <div key={config.type} className="relative">
              {/* Subtle corner ornaments on cards */}
              <div className="absolute -top-2 -left-2 w-8 h-8 opacity-20 pointer-events-none z-10">
                <img
                  src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <Card
                className={`${config.bgGradient} border-2 ${config.borderColor} cursor-pointer hover:scale-[1.02] transition-transform shadow-md relative`}
                onClick={() => handleCardClick(config.type)}
              >
                <CardContent className="pt-4 pb-4 px-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-background/50">
                      <Icon className={`h-4 w-4 ${config.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-sm leading-tight">{config.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {cardContent.turkish}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedConfig && (
                <>
                  <selectedConfig.icon className={`h-5 w-5 ${selectedConfig.iconColor}`} />
                  {selectedConfig.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedContent && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-2xl font-arabic leading-loose" dir="rtl">
                    {selectedContent.arabic}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-base leading-relaxed">
                    {selectedContent.turkish}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    {selectedContent.reference}
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
