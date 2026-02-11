import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { menNamazSteps, womenNamazSteps, prayerRakatCounts } from './namazTutorialContent';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type GenderFlow = 'men' | 'women';

export function NamazOgreticiTab() {
  const [genderFlow, setGenderFlow] = useState<GenderFlow>('men');
  const [currentStep, setCurrentStep] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentSteps = genderFlow === 'men' ? menNamazSteps : womenNamazSteps;

  // Clamp currentStep whenever currentSteps changes
  useEffect(() => {
    setCurrentStep((prev) => Math.min(prev, currentSteps.length - 1));
  }, [currentSteps.length]);

  const handleGenderChange = (newGender: GenderFlow) => {
    setGenderFlow(newGender);
    // Reset to first step when switching flows to avoid out-of-range errors
    setCurrentStep(0);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(currentSteps.length - 1, prev + 1));
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - go to next
        handleNext();
      } else {
        // Swiped right - go to previous
        handlePrevious();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Defensive guard: ensure currentStep is always within bounds
  const safeCurrentStep = Math.min(Math.max(0, currentStep), currentSteps.length - 1);
  const currentStepData = currentSteps[safeCurrentStep];

  // Guard against empty steps array (should never happen, but defensive)
  if (!currentStepData) {
    return (
      <div className="space-y-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Namaz öğretici içeriği yükleniyor...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Rakat Counts Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-xl">Günlük Namaz Rekatları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prayerRakatCounts.map((prayer) => (
            <div
              key={prayer.name}
              className="flex items-center justify-between p-3 bg-card rounded-lg border"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-base">{prayer.name} Namazı</h3>
                <p className="text-sm text-muted-foreground mt-1">{prayer.total}</p>
              </div>
              <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                {prayer.fard} Farz
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Gender Flow Selector */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Namaz Kılınışı (Türkiye - Hanefî)</h2>
        <div className="flex gap-3">
          <Button
            variant={genderFlow === 'men' ? 'default' : 'outline'}
            size="lg"
            onClick={() => handleGenderChange('men')}
            className="flex-1"
          >
            Erkek
          </Button>
          <Button
            variant={genderFlow === 'women' ? 'default' : 'outline'}
            size="lg"
            onClick={() => handleGenderChange('women')}
            className="flex-1"
          >
            Kadın
          </Button>
        </div>
      </div>

      {/* Tutorial Steps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Adım {safeCurrentStep + 1} / {currentSteps.length}
          </span>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2 flex-wrap">
          {currentSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === safeCurrentStep
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Adım ${index + 1}`}
            />
          ))}
        </div>

        {/* Step Content Card with Swipe Support */}
        <Card
          ref={cardRef}
          className="overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CardContent className="p-0">
            {/* Image */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-accent/10 to-secondary/10">
              <img
                src={currentStepData.imagePath}
                alt={currentStepData.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{currentStepData.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {currentStepData.arabicText && (
                <div className="p-4 bg-accent/10 rounded-lg text-center">
                  <p className="text-2xl font-arabic leading-loose" dir="rtl">
                    {currentStepData.arabicText}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={safeCurrentStep === 0}
            className="flex-1"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Önceki
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            disabled={safeCurrentStep === currentSteps.length - 1}
            className="flex-1"
          >
            Sonraki
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
