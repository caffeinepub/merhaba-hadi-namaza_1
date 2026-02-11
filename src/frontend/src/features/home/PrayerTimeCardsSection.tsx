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
  bgColor: string;
  iconColor: string;
}

const cardConfigs: CardConfig[] = [
  {
    type: 'verse',
    title: 'Vaktin Ayeti',
    icon: BookOpen,
    bgColor: 'bg-gradient-to-br from-primary/10 to-primary/5',
    iconColor: 'text-primary'
  },
  {
    type: 'hadith',
    title: 'Vaktin Hadisi',
    icon: MessageSquare,
    bgColor: 'bg-gradient-to-br from-secondary/10 to-secondary/5',
    iconColor: 'text-secondary'
  },
  {
    type: 'dua',
    title: 'Vaktin Duası',
    icon: Heart,
    bgColor: 'bg-gradient-to-br from-accent/10 to-accent/5',
    iconColor: 'text-accent'
  },
  {
    type: 'esma',
    title: 'Vaktin Esmaül Hüsnası',
    icon: Sparkles,
    bgColor: 'bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/5',
    iconColor: 'text-muted-foreground'
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
            <Card
              key={config.type}
              className={`${config.bgColor} border-2 cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => handleCardClick(config.type)}
            >
              <CardContent className="pt-4 pb-4 px-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                  <h3 className="font-semibold text-sm leading-tight">{config.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {cardContent.turkish}
                </p>
              </CardContent>
            </Card>
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
