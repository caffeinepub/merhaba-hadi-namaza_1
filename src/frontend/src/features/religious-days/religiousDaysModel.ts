// TypeScript types for Hijri-defined events and computed Gregorian instances

export interface HijriEvent {
  id: string;
  name: string;
  hijriMonth: number; // 1-12
  hijriDay: number; // 1-30
  durationDays?: number; // For multi-day events like Eid
}

export interface ComputedReligiousDay {
  id: string;
  name: string;
  date: Date;
  displayDate: string;
  hijriMonth: number;
  hijriDay: number;
}
