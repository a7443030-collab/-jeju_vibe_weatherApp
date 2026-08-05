import type { City, WeatherData } from "@/types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
}

export async function geocodeCity(
  query: string,
  signal?: AbortSignal
): Promise<City[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("도시 검색에 실패했습니다.");

  const data = (await res.json()) as { results?: GeocodingResult[] };
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeatherData(
  city: City,
  signal?: AbortSignal
): Promise<WeatherData> {
  const forecastUrl = new URL(FORECAST_URL);
  forecastUrl.searchParams.set("latitude", String(city.latitude));
  forecastUrl.searchParams.set("longitude", String(city.longitude));
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("forecast_days", "8");
  forecastUrl.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day"
  );
  forecastUrl.searchParams.set(
    "hourly",
    "temperature_2m,precipitation_probability,weather_code"
  );
  forecastUrl.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max"
  );

  const airQualityUrl = new URL(AIR_QUALITY_URL);
  airQualityUrl.searchParams.set("latitude", String(city.latitude));
  airQualityUrl.searchParams.set("longitude", String(city.longitude));
  airQualityUrl.searchParams.set("current", "pm10,pm2_5,us_aqi");

  const [forecastRes, airQualityRes] = await Promise.all([
    fetch(forecastUrl, { signal }),
    fetch(airQualityUrl, { signal }),
  ]);

  if (!forecastRes.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");

  const forecast = await forecastRes.json();
  const airQuality = airQualityRes.ok ? await airQualityRes.json() : null;

  const hourlyTimes: string[] = forecast.hourly?.time ?? [];
  const nowIndex = Math.max(
    0,
    hourlyTimes.findIndex((t) => t >= forecast.current.time)
  );

  return {
    timezone: forecast.timezone,
    current: {
      temperature: forecast.current.temperature_2m,
      apparentTemperature: forecast.current.apparent_temperature,
      humidity: forecast.current.relative_humidity_2m,
      precipitation: forecast.current.precipitation,
      weatherCode: forecast.current.weather_code,
      windSpeed: forecast.current.wind_speed_10m,
      isDay: forecast.current.is_day === 1,
    },
    hourly: hourlyTimes.slice(nowIndex, nowIndex + 24).map((time, i) => {
      const idx = nowIndex + i;
      return {
        time,
        temperature: forecast.hourly.temperature_2m[idx],
        precipitationProbability: forecast.hourly.precipitation_probability[idx],
        weatherCode: forecast.hourly.weather_code[idx],
      };
    }),
    daily: (forecast.daily?.time ?? []).map((date: string, i: number) => ({
      date,
      weatherCode: forecast.daily.weather_code[i],
      temperatureMax: forecast.daily.temperature_2m_max[i],
      temperatureMin: forecast.daily.temperature_2m_min[i],
      precipitationProbabilityMax: forecast.daily.precipitation_probability_max[i],
      uvIndexMax: forecast.daily.uv_index_max[i],
    })),
    airQuality: {
      pm10: airQuality?.current?.pm10 ?? null,
      pm2_5: airQuality?.current?.pm2_5 ?? null,
      usAqi: airQuality?.current?.us_aqi ?? null,
    },
  };
}
