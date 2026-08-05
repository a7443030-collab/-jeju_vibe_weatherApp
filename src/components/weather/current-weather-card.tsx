import { Droplets, Thermometer, Wind, CloudRain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather/weather-icon";
import { formatTemperature, unitSuffix } from "@/lib/units";
import { getWeatherInfo } from "@/lib/weather-codes";
import type { City, CurrentWeather, TemperatureUnit } from "@/types/weather";

interface CurrentWeatherCardProps {
  city: City;
  current: CurrentWeather;
  unit: TemperatureUnit;
}

export function CurrentWeatherCard({ city, current, unit }: CurrentWeatherCardProps) {
  const { label } = getWeatherInfo(current.weatherCode, current.isDay);
  const today = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const stats = [
    { icon: Thermometer, label: "체감", value: formatTemperature(current.apparentTemperature, unit) + unitSuffix(unit) },
    { icon: Droplets, label: "습도", value: `${Math.round(current.humidity)}%` },
    { icon: Wind, label: "풍속", value: `${Math.round(current.windSpeed)} km/h` },
    { icon: CloudRain, label: "강수량", value: `${current.precipitation} mm` },
  ];

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card">
      <CardHeader>
        <CardDescription>
          {city.name}
          {city.admin1 ? `, ${city.admin1}` : ""} · {today}
        </CardDescription>
        <CardTitle className="text-base font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl">
            {formatTemperature(current.temperature, unit)}
            <span className="text-3xl align-top sm:text-4xl">{unitSuffix(unit)}</span>
          </div>
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            className="size-20 shrink-0 text-primary sm:size-24"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-start gap-1 rounded-lg bg-background/60 p-3 ring-1 ring-foreground/5"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
              </span>
              <span className="text-sm font-medium tabular-nums">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
