import { Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WeatherIcon } from "@/components/weather/weather-icon";
import { formatTemperature } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weather-codes";
import type { DailyWeather, TemperatureUnit } from "@/types/weather";

interface DailyForecastProps {
  daily: DailyWeather[];
  unit: TemperatureUnit;
}

function dayLabel(dateStr: string, index: number) {
  if (index === 0) return "오늘";
  if (index === 1) return "내일";
  return new Date(dateStr).toLocaleDateString("ko-KR", { weekday: "short" });
}

export function DailyForecast({ daily, unit }: DailyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7일간 예보</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {daily.slice(0, 7).map((day, i) => {
          const { label } = getWeatherInfo(day.weatherCode, true);
          return (
            <div key={day.date}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between gap-3 py-2.5">
                <span className="w-12 shrink-0 text-sm font-medium">
                  {dayLabel(day.date, i)}
                </span>
                <div className="flex flex-1 items-center gap-2">
                  <WeatherIcon code={day.weatherCode} className="size-5 text-primary" />
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    {label}
                  </span>
                </div>
                <span className="flex w-12 shrink-0 items-center justify-end gap-0.5 text-xs text-sky-600 dark:text-sky-400">
                  <Droplet className="size-3" />
                  {Math.round(day.precipitationProbabilityMax)}%
                </span>
                <span className="flex w-20 shrink-0 items-center justify-end gap-1.5 text-sm tabular-nums">
                  <span className="text-muted-foreground">
                    {formatTemperature(day.temperatureMin, unit)}
                  </span>
                  <span className="font-semibold">
                    {formatTemperature(day.temperatureMax, unit)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
