import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { tasbihatData } from './tasbihatData';

export function TasbihatTab() {
  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Namaz Sonrası Tesbihat</h2>
        <p className="text-sm text-muted-foreground">
          Farz namazların ardından okunacak tesbihat ve dualar
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-4">
          {tasbihatData.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                    <CardTitle className="text-base">{item.phrase}</CardTitle>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    {item.count}x
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-right text-xl leading-relaxed font-arabic" dir="rtl">
                    {item.arabic}
                  </p>
                </div>
                {item.transliteration && (
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm italic text-muted-foreground">
                      {item.transliteration}
                    </p>
                  </div>
                )}
                <div className="p-3 bg-accent/30 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {item.translation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            💡 <strong>Not:</strong> Bu tesbihatlar her farz namazın ardından okunur. 
            Zikirmatik sekmesini kullanarak sayıları takip edebilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
