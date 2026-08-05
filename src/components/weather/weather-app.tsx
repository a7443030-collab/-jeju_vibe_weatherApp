"use client";

import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CitySearch } from "@/components/weather/city-search";
import { UnitToggle } from "@/components/weather/unit-toggle";
import { CurrentWeatherCard } from "@/components/weather/current-weather-card";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { UvIndexCard } from "@/components/weather/uv-index-card";
import { AirQualityCard } from "@/components/weather/air-quality-card";
import { DashboardSkeleton } from "@/components/weather/dashboard-skeleton";
import { useWeatherData } from "@/hooks/use-weather-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { City, TemperatureUnit } from "@/types/weather";

const DEFAULT_CITY: City = {
  id: 1846266,
  name: "제주",
  admin1: "제주특별자치도",
  country: "대한민국",
  countryCode: "KR",
  latitude: 33.5008,
  longitude: 126.5312,
};

export function WeatherApp() {
  const [city, setCity] = useLocalStorage<City>("weather-app:city", DEFAULT_CITY);
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>("weather-app:unit", "celsius");
  const { data, loading, error, refetch } = useWeatherData(city);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">날씨</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CitySearch city={city} onSelect={setCity} />
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      {error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <CloudOff className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="size-4" />
            다시 시도
          </Button>
        </div>
      ) : loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-6">
            <CurrentWeatherCard city={city} current={data.current} unit={unit} />
            <HourlyForecast hourly={data.hourly} unit={unit} isDayNow={data.current.isDay} />
            <DailyForecast daily={data.daily} unit={unit} />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-1 lg:content-start">
            <UvIndexCard uvIndex={data.daily[0]?.uvIndexMax ?? 0} />
            <AirQualityCard airQuality={data.airQuality} />
          </div>
        </div>
      )}
    </div>
  );
}
