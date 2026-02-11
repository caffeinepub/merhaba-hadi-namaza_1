export interface NamazStep {
  id: string;
  title: string;
  description: string;
  arabicText?: string;
  imagePath: string;
}

export interface PrayerRakatInfo {
  name: string;
  fard: number;
  sunnah?: string;
  total: string;
}

export const prayerRakatCounts: PrayerRakatInfo[] = [
  {
    name: 'Sabah',
    fard: 2,
    sunnah: '2 sünnet',
    total: '2 sünnet + 2 farz = 4 rekat'
  },
  {
    name: 'Öğle',
    fard: 4,
    sunnah: '4 sünnet + 2 sünnet',
    total: '4 sünnet + 4 farz + 2 sünnet = 10 rekat'
  },
  {
    name: 'İkindi',
    fard: 4,
    sunnah: '4 sünnet',
    total: '4 sünnet + 4 farz = 8 rekat'
  },
  {
    name: 'Akşam',
    fard: 3,
    sunnah: '2 sünnet',
    total: '3 farz + 2 sünnet = 5 rekat'
  },
  {
    name: 'Yatsı',
    fard: 4,
    sunnah: '4 sünnet + 2 sünnet + 3 vitir',
    total: '4 sünnet + 4 farz + 2 sünnet + 3 vitir = 13 rekat'
  }
];

export const menNamazSteps: NamazStep[] = [
  {
    id: 'men-tr-01-qiyam',
    title: 'Kıyam (Ayakta Duruş)',
    description: 'Kıbleye dönüp ayakta durun. Ayaklar arasında 4 parmak kadar açıklık bırakın. Gözler secde yerine bakmalıdır.',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-01-qiyam.dim_1024x1024.png'
  },
  {
    id: 'men-tr-02-iftitah-takbir',
    title: 'İftitah Tekbiri',
    description: 'Ellerinizi kulak hizasına kaldırarak avuç içleri kıbleye dönük şekilde "Allahu Ekber" deyin. Bu tekbirle namaza başlamış olursunuz.',
    arabicText: 'اللّٰهُ اَكْبَرُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-02-iftitah-takbir.dim_1024x1024.png'
  },
  {
    id: 'men-tr-03-hands-folded',
    title: 'Ellerin Bağlanması',
    description: 'Sağ elinizi sol elinizin üzerine koyarak göbek altında bağlayın. Sağ elin başparmağı ve serçe parmağı sol bileği kavrar, diğer üç parmak düz durur.',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-03-hands-folded.dim_1024x1024.png'
  },
  {
    id: 'men-tr-04-qiraah',
    title: 'Kıraat (Okuma)',
    description: 'Sübhaneke duasını, ardından Fatiha suresini okuyun. Sonra bir sure veya en az üç ayet ekleyin. İlk iki rekatta kıraat yapılır.',
    arabicText: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-04-qiraah.dim_1024x1024.png'
  },
  {
    id: 'men-tr-05-ruku',
    title: 'Rükû',
    description: 'Tekbir getirerek rükûya eğilin. Eller dizlere konur, parmaklar açık tutulur. Sırt düz, baş sırt hizasında olmalıdır. "Sübhane Rabbiyel Azim" deyin (en az 3 kez).',
    arabicText: 'سُبْحَانَ رَبِّيَ الْعَظ۪يمِ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-05-ruku.dim_1024x1024.png'
  },
  {
    id: 'men-tr-06-qawmah',
    title: 'Kavme (Rükûdan Kalkma)',
    description: '"Semiallahu limen hamideh" diyerek doğrulun. Ayakta tam dik dururken "Rabbena lekel hamd" deyin. Eller yanlara salık bırakılır.',
    arabicText: 'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ - رَبَّنَا لَكَ الْحَمْدُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-06-qawmah.dim_1024x1024.png'
  },
  {
    id: 'men-tr-07-sujud-1',
    title: 'Birinci Secde',
    description: 'Tekbir getirerek secdeye varın. Önce dizler, sonra eller, sonra burun ve alın yere değer. Dirsekler yerden ve vücuttan açık tutulur. "Sübhane Rabbiyel A\'la" deyin (en az 3 kez).',
    arabicText: 'سُبْحَانَ رَبِّيَ الْاَعْلٰى',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-07-sujud-1.dim_1024x1024.png'
  },
  {
    id: 'men-tr-08-jalsa',
    title: 'Celse (İki Secde Arası Oturuş)',
    description: 'Tekbir getirerek secdeden kalkıp oturun. Sol ayak üzerine oturun, sağ ayak parmakları kıbleye dönük olsun. Eller dizler üzerinde durur.',
    arabicText: 'اللّٰهُ اَكْبَرُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-08-jalsa.dim_1024x1024.png'
  },
  {
    id: 'men-tr-09-sujud-2',
    title: 'İkinci Secde',
    description: 'Tekbir getirerek ikinci secdeye varın. Birinci secdedeki gibi "Sübhane Rabbiyel A\'la" deyin (en az 3 kez). Bu şekilde bir rekat tamamlanmış olur.',
    arabicText: 'سُبْحَانَ رَبِّيَ الْاَعْلٰى',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-09-sujud-2.dim_1024x1024.png'
  },
  {
    id: 'men-tr-10-tashahhud',
    title: 'Ka\'de (Teşehhüd Oturuşu)',
    description: 'İkinci ve son rekatlarda oturarak Ettehiyyatü duasını okuyun. Son oturuşta Salli-Barik dualarını da ekleyin. Sol ayak üzerine oturun, sağ ayak parmakları kıbleye dönük olsun.',
    arabicText: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-10-tashahhud.dim_1024x1024.png'
  },
  {
    id: 'men-tr-11-salam',
    title: 'Selam Verme',
    description: 'Başınızı önce sağa çevirerek "Esselamü aleyküm ve rahmetullah", sonra sola çevirerek aynı şekilde selam verin. Namazınız tamamlanmıştır.',
    arabicText: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
    imagePath: '/assets/generated/namaz-tr-hanafi-male-11-salam.dim_1024x1024.png'
  }
];

export const womenNamazSteps: NamazStep[] = [
  {
    id: 'women-tr-01-qiyam',
    title: 'Kıyam (Ayakta Duruş)',
    description: 'Kıbleye dönüp ayakta durun. Ayaklar bitişik veya çok az aralıklı durmalıdır. Gözler secde yerine bakmalıdır.',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-01-qiyam.dim_1024x1024.png'
  },
  {
    id: 'women-tr-02-iftitah-takbir',
    title: 'İftitah Tekbiri',
    description: 'Ellerinizi omuz hizasına kaldırarak avuç içleri kıbleye dönük şekilde "Allahu Ekber" deyin. Bu tekbirle namaza başlamış olursunuz.',
    arabicText: 'اللّٰهُ اَكْبَرُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-02-iftitah-takbir.dim_1024x1024.png'
  },
  {
    id: 'women-tr-03-hands-folded',
    title: 'Ellerin Bağlanması',
    description: 'Sağ elinizi sol elinizin üzerine koyarak göğüs hizasında bağlayın. Eller hafifçe vücuda yakın ve toplu durmalıdır.',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-03-hands-folded.dim_1024x1024.png'
  },
  {
    id: 'women-tr-04-qiraah',
    title: 'Kıraat (Okuma)',
    description: 'Sübhaneke duasını, ardından Fatiha suresini okuyun. Sonra bir sure veya en az üç ayet ekleyin. İlk iki rekatta kıraat yapılır.',
    arabicText: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-04-qiraah.dim_1024x1024.png'
  },
  {
    id: 'women-tr-05-ruku',
    title: 'Rükû',
    description: 'Tekbir getirerek rükûya eğilin. Eller dizlere konur, parmaklar kapalı tutulur. Kollar vücuda yakın, hafif eğilme ile rükû yapılır. "Sübhane Rabbiyel Azim" deyin (en az 3 kez).',
    arabicText: 'سُبْحَانَ رَبِّيَ الْعَظ۪يمِ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-05-ruku.dim_1024x1024.png'
  },
  {
    id: 'women-tr-06-qawmah',
    title: 'Kavme (Rükûdan Kalkma)',
    description: '"Semiallahu limen hamideh" diyerek doğrulun. Ayakta tam dik dururken "Rabbena lekel hamd" deyin. Eller yanlara salık bırakılır.',
    arabicText: 'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ - رَبَّنَا لَكَ الْحَمْدُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-06-qawmah.dim_1024x1024.png'
  },
  {
    id: 'women-tr-07-sujud-1',
    title: 'Birinci Secde',
    description: 'Tekbir getirerek secdeye varın. Önce dizler, sonra eller, sonra burun ve alın yere değer. Kollar vücuda yakın, dirsekler yere değmez, toplu bir şekilde secde yapılır. "Sübhane Rabbiyel A\'la" deyin (en az 3 kez).',
    arabicText: 'سُبْحَانَ رَبِّيَ الْاَعْلٰى',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-07-sujud-1.dim_1024x1024.png'
  },
  {
    id: 'women-tr-08-jalsa',
    title: 'Celse (İki Secde Arası Oturuş)',
    description: 'Tekbir getirerek secdeden kalkıp oturun. Her iki ayak sağa doğru çıkarılır, sol kalça üzerine oturulur. Eller dizler üzerinde durur.',
    arabicText: 'اللّٰهُ اَكْبَرُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-08-jalsa.dim_1024x1024.png'
  },
  {
    id: 'women-tr-09-sujud-2',
    title: 'İkinci Secde',
    description: 'Tekbir getirerek ikinci secdeye varın. Birinci secdedeki gibi "Sübhane Rabbiyel A\'la" deyin (en az 3 kez). Bu şekilde bir rekat tamamlanmış olur.',
    arabicText: 'سُبْحَانَ رَبِّيَ الْاَعْلٰى',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-09-sujud-2.dim_1024x1024.png'
  },
  {
    id: 'women-tr-10-tashahhud',
    title: 'Ka\'de (Teşehhüd Oturuşu)',
    description: 'İkinci ve son rekatlarda oturarak Ettehiyyatü duasını okuyun. Son oturuşta Salli-Barik dualarını da ekleyin. Her iki ayak sağa doğru çıkarılır, sol kalça üzerine oturulur.',
    arabicText: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-10-tashahhud.dim_1024x1024.png'
  },
  {
    id: 'women-tr-11-salam',
    title: 'Selam Verme',
    description: 'Başınızı önce sağa çevirerek "Esselamü aleyküm ve rahmetullah", sonra sola çevirerek aynı şekilde selam verin. Namazınız tamamlanmıştır.',
    arabicText: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
    imagePath: '/assets/generated/namaz-tr-hanafi-female-11-salam.dim_1024x1024.png'
  }
];
