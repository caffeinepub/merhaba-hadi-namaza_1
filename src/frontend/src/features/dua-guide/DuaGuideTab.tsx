import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  type Dua,
  type DuaCategory,
  duaCategories,
  duasByCategory,
} from "./duaGuideData";

export function DuaGuideTab() {
  const [selectedCategory, setSelectedCategory] =
    useState<DuaCategory>("general");
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isSearching = searchQuery.trim().length >= 2;

  // Build flat list of all duas for search
  const allDuas = useMemo<Dua[]>(() => {
    return Object.values(duasByCategory).flat();
  }, []);

  // Filter results when searching
  const searchResults = useMemo<Dua[]>(() => {
    if (!isSearching) return [];
    const q = searchQuery.trim().toLowerCase();
    return allDuas.filter(
      (dua) =>
        dua.title.toLowerCase().includes(q) ||
        dua.occasion.toLowerCase().includes(q) ||
        dua.translation.toLowerCase().includes(q),
    );
  }, [searchQuery, isSearching, allDuas]);

  const currentDuas = isSearching
    ? searchResults
    : duasByCategory[selectedCategory];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dua Rehberi</h2>
        <p className="text-sm text-muted-foreground">
          Farklı durumlar için dualar ve zikir önerileri
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Dua ara... (başlık, durum veya anlam)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11"
          data-ocid="dua.search_input"
          aria-label="Dua ara"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Aramayı temizle"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Selection — hidden when searching */}
      {!isSearching && (
        <Tabs
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as DuaCategory)}
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            {duaCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-col gap-1 py-2 h-auto text-xs"
                data-ocid={`dua.${category.id}.tab`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Search result count */}
      {isSearching && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {searchResults.length}
          </span>{" "}
          sonuç bulundu
        </p>
      )}

      {/* Dua List */}
      <ScrollArea className="h-[calc(100vh-380px)]">
        <div className="space-y-3">
          {currentDuas.length === 0 && isSearching && (
            <div
              className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-muted/30"
              data-ocid="dua.empty_state"
            >
              <Search className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Arama sonucu bulunamadı.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Farklı bir kelime deneyin.
              </p>
            </div>
          )}

          {currentDuas.map((dua, idx) => (
            <Card
              key={dua.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedDua(dua)}
              data-ocid={`dua.item.${idx + 1}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{dua.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {dua.occasion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Dua Detail Dialog */}
      <Dialog
        open={!!selectedDua}
        onOpenChange={(open) => !open && setSelectedDua(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[80vh]"
          data-ocid="dua.dialog"
        >
          <DialogHeader>
            <DialogTitle>{selectedDua?.title}</DialogTitle>
            <DialogDescription>{selectedDua?.occasion}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {selectedDua?.arabic && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Arapça
                  </h4>
                  <p
                    className="text-right text-xl leading-relaxed font-arabic p-4 bg-muted/50 rounded-lg"
                    dir="rtl"
                  >
                    {selectedDua.arabic}
                  </p>
                </div>
              )}
              {selectedDua?.transliteration && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Okunuşu
                  </h4>
                  <p className="text-sm italic p-3 bg-secondary/50 rounded-lg">
                    {selectedDua.transliteration}
                  </p>
                </div>
              )}
              {selectedDua?.translation && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Anlamı
                  </h4>
                  <p className="text-sm leading-relaxed p-3 bg-accent/50 rounded-lg">
                    {selectedDua.translation}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setSelectedDua(null)}
              data-ocid="dua.close_button"
              className="min-h-[44px]"
            >
              Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
