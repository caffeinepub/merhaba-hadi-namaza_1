import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { menNamazSteps, womenNamazSteps, prayerRakatCounts } from './namazTutorialContent';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type GenderFlow = 'men' | 'women';

export function NamazOgreticiTab() {
  const [genderFlow, setGenderFlow] = useState<GenderFlow>('men');

  const currentSteps = genderFlow === 'men' ? menNamazSteps : womenNamazSteps;

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
            onClick={() => setGenderFlow('men')}
            className="flex-1"
          >
            Erkek
          </Button>
          <Button
            variant={genderFlow === 'women' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setGenderFlow('women')}
            className="flex-1"
          >
            Kadın
          </Button>
        </div>
      </div>

      {/* All Steps in Single Scrollable Page */}
      <div className="space-y-4">
        {currentSteps.map((step, index) => (
          <Card key={step.id} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="default" className="text-base font-bold px-3 py-1 shrink-0">
                  {index + 1}
                </Badge>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {step.arabicText && (
                    <div className="p-4 bg-accent/10 rounded-lg text-center">
                      <p className="text-2xl font-arabic leading-loose" dir="rtl">
                        {step.arabicText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
