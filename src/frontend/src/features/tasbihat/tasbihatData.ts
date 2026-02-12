export interface TasbihatItem {
  id: string;
  phrase: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  count: number;
}

export const tasbihatData: TasbihatItem[] = [
  {
    id: 'tasbihat-1',
    phrase: 'Sübhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Sübhanallah',
    translation: 'Allah her türlü eksiklikten münezzehtir',
    count: 33
  },
  {
    id: 'tasbihat-2',
    phrase: 'Elhamdülillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Elhamdülillah',
    translation: 'Hamd Allah\'a mahsustur',
    count: 33
  },
  {
    id: 'tasbihat-3',
    phrase: 'Allahu Ekber',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Ekber',
    translation: 'Allah en büyüktür',
    count: 34
  },
  {
    id: 'tasbihat-4',
    phrase: 'Kelime-i Tevhid',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey\'in kadîr',
    translation: 'Allah\'tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O\'nundur, hamd O\'na mahsustur ve O her şeye kadirdir',
    count: 1
  },
  {
    id: 'tasbihat-5',
    phrase: 'Ayetel Kürsi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    transliteration: 'Allâhu lâ ilâhe illâ hüvel-hayyül-kayyûm, lâ te\'huzühû sinetün ve lâ nevm...',
    translation: 'Allah, O\'ndan başka ilah yoktur. O Hayy\'dır, Kayyum\'dur. O\'nu ne uyuklama tutar ne de uyku...',
    count: 1
  }
];
