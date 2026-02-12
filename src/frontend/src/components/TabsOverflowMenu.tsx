import React, { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Menu, Sun, BookHeart, Sparkles, Book, BookMarked, Compass, CalendarDays, MapPin, Apple, CheckSquare, BookOpenText } from 'lucide-react';

interface TabsOverflowMenuProps {
  onSelectTab: (tabValue: string) => void;
}

export function TabsOverflowMenu({ onSelectTab }: TabsOverflowMenuProps) {
  const [open, setOpen] = useState(false);

  const overflowItems = [
    { value: 'quranreading', label: 'Kuran Öğreniyorum', icon: BookOpenText },
    { value: 'prayertracker', label: 'Namaz Takibi', icon: CheckSquare },
    { value: 'fastingtracker', label: 'Oruç Takibi', icon: Apple },
    { value: 'nearbymosque', label: 'Yakındaki Camiler', icon: MapPin },
    { value: 'religiousdays', label: 'Dini Günler', icon: CalendarDays },
    { value: 'qibla', label: 'Kıble Bulucu', icon: Compass },
    { value: 'hatim', label: 'Hatim Takip', icon: BookMarked },
    { value: 'namazogretici', label: 'Namaz Öğretici', icon: Book },
    { value: 'adhkar', label: 'Sabah-Akşam Ezkarı', icon: Sparkles },
    { value: 'duaguide', label: 'Dua Rehberi', icon: BookHeart },
    { value: 'tasbihat', label: 'Tesbihler', icon: Sun },
    { value: 'settings', label: 'Ayarlar', icon: Sun }
  ];

  const handleSelect = (value: string) => {
    onSelectTab(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          {/* Ornamental accent on menu button */}
          <div className="absolute -top-1 -right-1 w-4 h-4 opacity-30 pointer-events-none">
            <img
              src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative border border-primary/20 hover:bg-primary/10"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-2 border-primary/20">
        {overflowItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className="gap-2 cursor-pointer hover:bg-primary/10"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
