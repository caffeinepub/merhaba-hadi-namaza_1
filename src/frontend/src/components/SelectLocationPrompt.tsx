import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';

interface SelectLocationPromptProps {
  onNavigateToLocation: () => void;
}

export function SelectLocationPrompt({ onNavigateToLocation }: SelectLocationPromptProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MapPin className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>Konum Seçilmedi</CardTitle>
        <CardDescription>
          Namaz vakitlerini ve hava durumunu görmek için önce bir konum seçmelisiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <button
          onClick={onNavigateToLocation}
          className="text-primary hover:underline font-medium"
        >
          Konum Seç →
        </button>
      </CardContent>
    </Card>
  );
}
