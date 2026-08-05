import { getWeatherInfo } from "@/lib/weather-codes";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export function WeatherIcon({ code, isDay = true, className }: WeatherIconProps) {
  const { icon: Icon } = getWeatherInfo(code, isDay);
  return <Icon className={cn("shrink-0", className)} />;
}
