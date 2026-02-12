// Fixed 2026 Islamic dates dataset with Gregorian dates and Turkish names

import { ComputedReligiousDay } from './religiousDaysModel';

export const RELIGIOUS_DAYS_2026: ComputedReligiousDay[] = [
  {
    id: 'miraj',
    name: 'Miraj Kandili',
    date: new Date(2026, 0, 16), // January 16, 2026
    displayDate: '16 Ocak 2026',
    hijriMonth: 7,
    hijriDay: 27
  },
  {
    id: 'barat',
    name: 'Berat Kandili',
    date: new Date(2026, 1, 2), // February 2, 2026
    displayDate: '2 Şubat 2026',
    hijriMonth: 8,
    hijriDay: 15
  },
  {
    id: 'laylat-al-qadr',
    name: 'Kadir Gecesi',
    date: new Date(2026, 2, 16), // March 16, 2026
    displayDate: '16 Mart 2026',
    hijriMonth: 9,
    hijriDay: 27
  },
  {
    id: 'eid-al-fitr-1',
    name: 'Ramazan Bayramı - 1. Gün',
    date: new Date(2026, 2, 20), // March 20, 2026
    displayDate: '20 Mart 2026',
    hijriMonth: 10,
    hijriDay: 1
  },
  {
    id: 'eid-al-fitr-2',
    name: 'Ramazan Bayramı - 2. Gün',
    date: new Date(2026, 2, 21), // March 21, 2026
    displayDate: '21 Mart 2026',
    hijriMonth: 10,
    hijriDay: 2
  },
  {
    id: 'eid-al-fitr-3',
    name: 'Ramazan Bayramı - 3. Gün',
    date: new Date(2026, 2, 22), // March 22, 2026
    displayDate: '22 Mart 2026',
    hijriMonth: 10,
    hijriDay: 3
  },
  {
    id: 'day-of-arafah',
    name: 'Arefe Günü',
    date: new Date(2026, 4, 25), // May 25, 2026
    displayDate: '25 Mayıs 2026',
    hijriMonth: 12,
    hijriDay: 9
  },
  {
    id: 'eid-al-adha-1',
    name: 'Kurban Bayramı - 1. Gün',
    date: new Date(2026, 4, 26), // May 26, 2026
    displayDate: '26 Mayıs 2026',
    hijriMonth: 12,
    hijriDay: 10
  },
  {
    id: 'eid-al-adha-2',
    name: 'Kurban Bayramı - 2. Gün',
    date: new Date(2026, 4, 27), // May 27, 2026
    displayDate: '27 Mayıs 2026',
    hijriMonth: 12,
    hijriDay: 11
  },
  {
    id: 'eid-al-adha-3',
    name: 'Kurban Bayramı - 3. Gün',
    date: new Date(2026, 4, 28), // May 28, 2026
    displayDate: '28 Mayıs 2026',
    hijriMonth: 12,
    hijriDay: 12
  },
  {
    id: 'eid-al-adha-4',
    name: 'Kurban Bayramı - 4. Gün',
    date: new Date(2026, 4, 29), // May 29, 2026
    displayDate: '29 Mayıs 2026',
    hijriMonth: 12,
    hijriDay: 13
  },
  {
    id: 'islamic-new-year',
    name: 'Hicri Yılbaşı',
    date: new Date(2026, 5, 16), // June 16, 2026
    displayDate: '16 Haziran 2026',
    hijriMonth: 1,
    hijriDay: 1
  },
  {
    id: 'ashura',
    name: 'Aşure Günü',
    date: new Date(2026, 5, 25), // June 25, 2026
    displayDate: '25 Haziran 2026',
    hijriMonth: 1,
    hijriDay: 10
  },
  {
    id: 'mawlid',
    name: 'Mevlid Kandili',
    date: new Date(2026, 7, 24), // August 24, 2026
    displayDate: '24 Ağustos 2026',
    hijriMonth: 3,
    hijriDay: 12
  },
  {
    id: 'regaib',
    name: 'Regaib Kandili',
    date: new Date(2026, 11, 10), // December 10, 2026
    displayDate: '10 Aralık 2026',
    hijriMonth: 7,
    hijriDay: 1
  }
];
