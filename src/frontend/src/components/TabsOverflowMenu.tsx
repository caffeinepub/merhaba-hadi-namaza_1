import React, { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Menu, Sun, BookHeart, Sparkles, Book, BookMarked, Compass, CalendarDays, MapPin, Apple } from 'lucide-react';

interface TabsOverflowMenuProps {
  onSelectTab: (tabValue: string) => void;
}

export function TabsOverflowMenu({ onSelectTab }: TabsOverflowMenuProps) {
  const [open, setOpen] = useState(false);

  const overflowItems = [
    { value: 'fastingtracker', label: 'Oruç Takibi', icon: Apple },
    { value: 'nearbymosque', label: 'Yakındaki Camiler', icon: MapPin },
    { value: 'religiousdays', label: 'Dini Günler', icon: CalendarDays },
    { value: 'adhkar', label: 'Zikirler', icon: Sun },
    { value: 'duaguide', label: 'Dualar', icon: BookHeart },
    { value: 'tasbihat', label: 'Tesbihat', icon: Sparkles },
    { value: 'hatim', label: 'Hatim', icon: Book },
    { value: 'namazogretici', label: 'Öğretici', icon: BookMarked },
    { value: 'qibla', label: 'Kıble', icon: Compass },
  ];

  const handleSelect = (value: string) => {
    onSelectTab(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex-col gap-1 px-2 py-2 h-auto"
          aria-label="Diğer sekmeler"
        >
          <Menu className="h-4 w-4" />
          <span className="text-[9px] leading-tight hidden sm:inline">Diğer</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {overflowItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
