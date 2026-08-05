import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

interface WeatherCodeInfo {
  label: string;
  dayIcon: LucideIcon;
  nightIcon: LucideIcon;
}

const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: "맑음", dayIcon: Sun, nightIcon: Moon },
  1: { label: "대체로 맑음", dayIcon: CloudSun, nightIcon: CloudMoon },
  2: { label: "구름 조금", dayIcon: CloudSun, nightIcon: CloudMoon },
  3: { label: "흐림", dayIcon: Cloud, nightIcon: Cloud },
  45: { label: "안개", dayIcon: CloudFog, nightIcon: CloudFog },
  48: { label: "짙은 안개", dayIcon: CloudFog, nightIcon: CloudFog },
  51: { label: "약한 이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  53: { label: "이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  55: { label: "강한 이슬비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  56: { label: "약한 얼음비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  57: { label: "얼음비", dayIcon: CloudDrizzle, nightIcon: CloudDrizzle },
  61: { label: "약한 비", dayIcon: CloudRain, nightIcon: CloudRain },
  63: { label: "비", dayIcon: CloudRain, nightIcon: CloudRain },
  65: { label: "강한 비", dayIcon: CloudRain, nightIcon: CloudRain },
  66: { label: "약한 어는 비", dayIcon: CloudRain, nightIcon: CloudRain },
  67: { label: "어는 비", dayIcon: CloudRain, nightIcon: CloudRain },
  71: { label: "약한 눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  73: { label: "눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  75: { label: "강한 눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  77: { label: "싸락눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  80: { label: "약한 소나기", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  81: { label: "소나기", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  82: { label: "강한 소나기", dayIcon: CloudRainWind, nightIcon: CloudRainWind },
  85: { label: "약한 소낙눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  86: { label: "소낙눈", dayIcon: CloudSnow, nightIcon: CloudSnow },
  95: { label: "뇌우", dayIcon: CloudLightning, nightIcon: CloudLightning },
  96: { label: "우박을 동반한 뇌우", dayIcon: CloudLightning, nightIcon: CloudLightning },
  99: { label: "강한 우박을 동반한 뇌우", dayIcon: CloudLightning, nightIcon: CloudLightning },
};

export function getWeatherInfo(code: number, isDay = true) {
  const info = WEATHER_CODES[code] ?? WEATHER_CODES[3];
  return {
    label: info.label,
    icon: isDay ? info.dayIcon : info.nightIcon,
  };
}
