export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
}

interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
}

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Hava durumu alınamadı');
  }

  const data: OpenMeteoWeatherResponse = await response.json();
  
  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m
  };
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Açık';
  if (code <= 3) return 'Parçalı Bulutlu';
  if (code <= 48) return 'Sisli';
  if (code <= 67) return 'Yağmurlu';
  if (code <= 77) return 'Karlı';
  if (code <= 82) return 'Sağanak Yağışlı';
  if (code <= 86) return 'Kar Yağışlı';
  return 'Fırtınalı';
}
