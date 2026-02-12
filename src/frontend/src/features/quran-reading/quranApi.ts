// Frontend-only data layer for Qur'an content using Al-Quran Cloud API
// Provides surah metadata, ayah content (Arabic + Turkish translation), and audio recitation URLs

export interface SurahMetadata {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string; // Arabic text
  translation?: string; // Turkish translation
  audio?: string; // Audio URL
}

export interface SurahContent {
  metadata: SurahMetadata;
  ayahs: Ayah[];
}

const API_BASE = 'https://api.alquran.cloud/v1';
const ARABIC_EDITION = 'quran-uthmani';
const TURKISH_EDITION = 'tr.diyanet'; // Diyanet Turkish translation
const AUDIO_RECITER = 'ar.alafasy'; // Mishary Alafasy recitation

// Simple in-memory cache
const cache = new Map<string, any>();

async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

export async function getAllSurahs(): Promise<SurahMetadata[]> {
  try {
    const data = await fetchWithCache<any>(
      `${API_BASE}/surah`,
      'all-surahs'
    );

    if (data.code !== 200 || !data.data) {
      throw new Error('Invalid API response');
    }

    return data.data.map((s: any) => ({
      number: s.number,
      name: s.name,
      englishName: s.englishName,
      englishNameTranslation: s.englishNameTranslation,
      numberOfAyahs: s.numberOfAyahs,
      revelationType: s.revelationType
    }));
  } catch (error) {
    console.error('Failed to load surahs:', error);
    return [];
  }
}

export async function getSurahContent(surahNumber: number): Promise<SurahContent | null> {
  try {
    // Fetch Arabic text, Turkish translation, and audio in parallel
    const [arabicData, turkishData, audioData] = await Promise.all([
      fetchWithCache<any>(
        `${API_BASE}/surah/${surahNumber}/${ARABIC_EDITION}`,
        `surah-${surahNumber}-arabic`
      ),
      fetchWithCache<any>(
        `${API_BASE}/surah/${surahNumber}/${TURKISH_EDITION}`,
        `surah-${surahNumber}-turkish`
      ),
      fetchWithCache<any>(
        `${API_BASE}/surah/${surahNumber}/${AUDIO_RECITER}`,
        `surah-${surahNumber}-audio`
      )
    ]);

    if (
      arabicData.code !== 200 ||
      turkishData.code !== 200 ||
      audioData.code !== 200
    ) {
      throw new Error('Invalid API response');
    }

    const arabicSurah = arabicData.data;
    const turkishSurah = turkishData.data;
    const audioSurah = audioData.data;

    const metadata: SurahMetadata = {
      number: arabicSurah.number,
      name: arabicSurah.name,
      englishName: arabicSurah.englishName,
      englishNameTranslation: arabicSurah.englishNameTranslation,
      numberOfAyahs: arabicSurah.numberOfAyahs,
      revelationType: arabicSurah.revelationType
    };

    const ayahs: Ayah[] = arabicSurah.ayahs.map((ayah: any, index: number) => {
      // Get audio URL from API response, or construct fallback CDN URL
      let audioUrl = audioSurah.ayahs[index]?.audio || '';
      
      // If API audio URL is empty or invalid, construct fallback CDN URL
      if (!audioUrl || !audioUrl.startsWith('http')) {
        audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
      }

      return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: turkishSurah.ayahs[index]?.text || '',
        audio: audioUrl
      };
    });

    return { metadata, ayahs };
  } catch (error) {
    console.error(`Failed to load surah ${surahNumber}:`, error);
    return null;
  }
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  // Construct audio URL for specific ayah
  // Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/{ayah_number}.mp3
  const globalAyahNumber = getGlobalAyahNumber(surahNumber, ayahNumber);
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
}

// Helper to convert surah:ayah to global ayah number (1-6236)
function getGlobalAyahNumber(surahNumber: number, ayahInSurah: number): number {
  // Simplified calculation - in production, use a lookup table
  // This is approximate and should be replaced with accurate mapping
  const ayahsBeforeSurah = [
    0, 7, 293, 493, 669, 789, 954, 1160, 1235, 1364, 1473, 1596, 1707, 1750, 1802, 1901,
    2029, 2140, 2250, 2348, 2483, 2595, 2673, 2791, 2855, 2932, 3159, 3252, 3340, 3409,
    3469, 3503, 3533, 3606, 3660, 3705, 3788, 3970, 4058, 4133, 4218, 4272, 4325, 4414,
    4473, 4510, 4545, 4583, 4612, 4630, 4675, 4735, 4784, 4846, 4901, 4979, 5075, 5104,
    5126, 5150, 5163, 5177, 5188, 5199, 5217, 5229, 5241, 5271, 5323, 5375, 5419, 5447,
    5475, 5495, 5551, 5591, 5622, 5672, 5712, 5758, 5800, 5829, 5848, 5884, 5909, 5931,
    5948, 5967, 5993, 6023, 6043, 6058, 6079, 6090, 6098, 6106, 6125, 6130, 6138, 6146,
    6157, 6168, 6176, 6179, 6188, 6193, 6197, 6204, 6207, 6213, 6216, 6221, 6225, 6230
  ];

  if (surahNumber < 1 || surahNumber > 114) return 1;
  return ayahsBeforeSurah[surahNumber - 1] + ayahInSurah;
}
