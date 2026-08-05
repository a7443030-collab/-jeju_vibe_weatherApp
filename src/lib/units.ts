import type { TemperatureUnit } from "@/types/weather";

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === "celsius" ? celsius : celsius * 1.8 + 32;
  return `${Math.round(value)}°`;
}

export function unitSuffix(unit: TemperatureUnit): string {
  return unit === "celsius" ? "C" : "F";
}
