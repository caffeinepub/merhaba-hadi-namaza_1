export interface AdhkarItem {
  id: string;
  title: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  count: number;
}

export const morningAdhkar: AdhkarItem[] = [
  {
    id: 'morning-1',
    title: 'Ayetel Kürsi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    translation: 'Allah, O\'ndan başka ilah yoktur. Diridir, Kayyumdur. O\'nu ne uyuklama tutar ne de uyku.',
    count: 1
  },
  {
    id: 'morning-2',
    title: 'İhlas Suresi',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    translation: 'De ki: O, Allah\'tır, bir tektir. Allah Samed\'dir. Doğurmamış ve doğmamıştır. Hiçbir şey O\'na denk değildir.',
    count: 3
  },
  {
    id: 'morning-3',
    title: 'Felak Suresi',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ',
    translation: 'De ki: Sabahın Rabbine sığınırım, yarattığı şeylerin şerrinden.',
    count: 3
  },
  {
    id: 'morning-4',
    title: 'Nas Suresi',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ',
    translation: 'De ki: İnsanların Rabbine, insanların Malikine, insanların İlahına sığınırım.',
    count: 3
  },
  {
    id: 'morning-5',
    title: 'Sabah Duası',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Asbahnâ ve asbaha\'l-mulku lillâhi ve\'l-hamdu lillâh',
    translation: 'Sabahladık, mülk Allah\'ındır ve hamd Allah\'a mahsustur.',
    count: 1
  },
  {
    id: 'morning-6',
    title: 'Tesbih',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi ve bihamdihi',
    translation: 'Allah\'ı tüm noksanlıklardan tenzih ederim, O\'na hamd ederim.',
    count: 100
  },
  {
    id: 'morning-7',
    title: 'Kelime-i Tevhid',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Lâ ilâhe illallâhu vahdehû lâ şerîke leh',
    translation: 'Allah\'tan başka ilah yoktur, O tektir, ortağı yoktur.',
    count: 10
  }
];

export const eveningAdhkar: AdhkarItem[] = [
  {
    id: 'evening-1',
    title: 'Ayetel Kürsi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    translation: 'Allah, O\'ndan başka ilah yoktur. Diridir, Kayyumdur. O\'nu ne uyuklama tutar ne de uyku.',
    count: 1
  },
  {
    id: 'evening-2',
    title: 'İhlas Suresi',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    translation: 'De ki: O, Allah\'tır, bir tektir. Allah Samed\'dir. Doğurmamış ve doğmamıştır.',
    count: 3
  },
  {
    id: 'evening-3',
    title: 'Felak Suresi',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ',
    translation: 'De ki: Sabahın Rabbine sığınırım, yarattığı şeylerin şerrinden.',
    count: 3
  },
  {
    id: 'evening-4',
    title: 'Nas Suresi',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ',
    translation: 'De ki: İnsanların Rabbine, insanların Malikine, insanların İlahına sığınırım.',
    count: 3
  },
  {
    id: 'evening-5',
    title: 'Akşam Duası',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amsaynâ ve amsa\'l-mulku lillâhi ve\'l-hamdu lillâh',
    translation: 'Akşamladık, mülk Allah\'ındır ve hamd Allah\'a mahsustur.',
    count: 1
  },
  {
    id: 'evening-6',
    title: 'Tesbih',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi ve bihamdihi',
    translation: 'Allah\'ı tüm noksanlıklardan tenzih ederim, O\'na hamd ederim.',
    count: 100
  },
  {
    id: 'evening-7',
    title: 'Kelime-i Tevhid',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Lâ ilâhe illallâhu vahdehû lâ şerîke leh',
    translation: 'Allah\'tan başka ilah yoktur, O tektir, ortağı yoktur.',
    count: 10
  }
];
