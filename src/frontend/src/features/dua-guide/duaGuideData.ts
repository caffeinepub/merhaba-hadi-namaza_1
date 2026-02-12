export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  occasion: string;
}

export type DuaCategory = 'travel' | 'healing' | 'abundance' | 'anger' | 'sustenance' | 'general';

export interface DuaCategoryInfo {
  id: DuaCategory;
  name: string;
  icon: string;
}

export const duaCategories: DuaCategoryInfo[] = [
  { id: 'travel', name: 'Yolculuk', icon: '✈️' },
  { id: 'healing', name: 'Şifa', icon: '🤲' },
  { id: 'abundance', name: 'Bereket', icon: '🌟' },
  { id: 'anger', name: 'Öfke Anı', icon: '😌' },
  { id: 'sustenance', name: 'Rızık', icon: '🍞' },
  { id: 'general', name: 'Genel', icon: '📿' }
];

export const duasByCategory: Record<DuaCategory, Dua[]> = {
  travel: [
    {
      id: 'travel-1',
      title: 'Yolculuğa Çıkarken',
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
      transliteration: 'Subhânellezî sehhara lenâ hâzâ ve mâ künnâ lehû mukrinîn. Ve innâ ilâ rabbinâ lemünkalibûn.',
      translation: 'Bunu bize boyun eğdiren Allah\'ı tesbih ederim. Biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz.',
      occasion: 'Yolculuğa çıkarken okunur'
    },
    {
      id: 'travel-2',
      title: 'Yolculukta Korunma',
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'Eûzü bi kelimâtillâhit-tâmmâti min şerri mâ halak.',
      translation: 'Allah\'ın tam olan kelimelerine sığınırım, yarattığı şeylerin şerrinden.',
      occasion: 'Yolculukta korunmak için'
    }
  ],
  healing: [
    {
      id: 'healing-1',
      title: 'Şifa Duası',
      arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
      transliteration: 'Allâhümme rabben-nâsi ezhib\'il-be\'se işfi ente\'ş-şâfî lâ şifâe illâ şifâuke şifâen lâ yügâdiru sekamâ.',
      translation: 'Allah\'ım, insanların Rabbi, hastalığı gider, şifa ver. Sen şifa verensin, Senin şifandan başka şifa yoktur. Hiçbir hastalık bırakmayan bir şifa ver.',
      occasion: 'Hasta için dua'
    },
    {
      id: 'healing-2',
      title: 'Ağrı için Dua',
      arabic: 'بِسْمِ اللَّهِ ثَلَاثًا وَقُلْ سَبْعَ مَرَّاتٍ أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
      transliteration: 'Bismillâh (3 kez). Eûzü billâhi ve kudretihî min şerri mâ ecidü ve uhâzir (7 kez).',
      translation: 'Allah\'ın adıyla (3 kez). Allah\'a ve O\'nun kudretine sığınırım, bulduğum ve çekindiğim şerden (7 kez).',
      occasion: 'Ağrı çekildiğinde'
    }
  ],
  abundance: [
    {
      id: 'abundance-1',
      title: 'Bereket Duası',
      arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
      transliteration: 'Allâhümme bârik lenâ fîmâ razaktanâ ve kinâ azâben-nâr.',
      translation: 'Allah\'ım, bize verdiğin rızıkta bereket ver ve bizi cehennem azabından koru.',
      occasion: 'Yemek öncesi bereket için'
    },
    {
      id: 'abundance-2',
      title: 'Mal ve Evlat Bereketi',
      arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
      transliteration: 'Rabbi heb lî min ledünke zürriyyeten tayyibeten inneke semîud-duâ.',
      translation: 'Rabbim! Bana katından temiz bir nesil bağışla. Şüphesiz sen duayı işitensin.',
      occasion: 'Evlat ve aile bereketi için'
    }
  ],
  anger: [
    {
      id: 'anger-1',
      title: 'Öfkelendiğinde',
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'Eûzü billâhi mineş-şeytânir-racîm.',
      translation: 'Kovulmuş şeytandan Allah\'a sığınırım.',
      occasion: 'Öfkelendiğinde okunur'
    },
    {
      id: 'anger-2',
      title: 'Sakinleşmek için',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ',
      transliteration: 'Allâhümme innî es\'elukel-afve vel-âfiyeh.',
      translation: 'Allah\'ım, senden affı ve afiyet istiyorum.',
      occasion: 'Sakinleşmek için'
    }
  ],
  sustenance: [
    {
      id: 'sustenance-1',
      title: 'Rızık Duası',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقًا طَيِّبًا وَعِلْمًا نَافِعًا وَعَمَلًا مُتَقَبَّلًا',
      transliteration: 'Allâhümme innî es\'elüke rızkan tayyiben ve ilmen nâfian ve amelen mütekabbelen.',
      translation: 'Allah\'ım, senden helal rızık, faydalı ilim ve makbul amel istiyorum.',
      occasion: 'Rızık için dua'
    },
    {
      id: 'sustenance-2',
      title: 'Bolluk Duası',
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: 'Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhireti haseneten ve kinâ azâben-nâr.',
      translation: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',
      occasion: 'Dünya ve ahiret için'
    }
  ],
  general: [
    {
      id: 'general-1',
      title: 'Sabah Akşam Duası',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
      transliteration: 'Allâhümme innî es\'elukel-âfiyete fid-dünyâ vel-âhireh.',
      translation: 'Allah\'ım, senden dünyada ve ahirette afiyet istiyorum.',
      occasion: 'Her zaman okunabilir'
    },
    {
      id: 'general-2',
      title: 'İstiğfar',
      arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
      transliteration: 'Estağfirullâhel-azîmellezî lâ ilâhe illâ hüvel-hayyul-kayyûmü ve etûbü ileyh.',
      translation: 'Kendisinden başka ilah olmayan, Hayy ve Kayyum olan Yüce Allah\'tan mağfiret dilerim ve O\'na tevbe ederim.',
      occasion: 'Günah affı için'
    },
    {
      id: 'general-3',
      title: 'Hamd Duası',
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Elhamdü lillâhi rabbil-âlemîn.',
      translation: 'Hamd, alemlerin Rabbi Allah\'a mahsustur.',
      occasion: 'Şükür için'
    }
  ]
};
