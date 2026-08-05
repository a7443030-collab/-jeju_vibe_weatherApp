import { Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather/weather-icon";
import { formatTemperature } from "@/lib/units";
import type { HourlyWeather, TemperatureUnit } from "@/types/weather";

interface HourlyForecastProps {
  hourly: HourlyWeather[];
  unit: TemperatureUnit;
  isDayNow: boolean;
}

export function HourlyForecast({ hourly, unit, isDayNow }: HourlyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>시간별 예보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {hourly.map((hour, i) => {
            const date = new Date(hour.time);
            const hourLabel = i === 0 ? "지금" : `${date.getHours()}시`;
            const isDay = i === 0 ? isDayNow : date.getHours() >= 6 && date.getHours() < 18;

            return (
              <div
                key={hour.time}
                className="flex w-16 shrink-0 snap-start flex-col items-center gap-2 rounded-lg bg-muted/40 p-3 text-center"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {hourLabel}
                </span>
                <WeatherIcon
                  code={hour.weatherCode}
                  isDay={isDay}
                  className="size-6 text-primary"
                />
                <span className="flex items-center gap-0.5 text-xs text-sky-600 dark:text-sky-400">
                  <Droplet className="size-3" />
                  {Math.round(hour.precipitationProbability)}%
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatTemperature(hour.temperature, unit)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
