import { useCallback, useEffect, useState } from "react";
import { fetchWeatherData } from "@/lib/open-meteo";
import type { City, WeatherData } from "@/types/weather";

export function useWeatherData(city: City | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!city) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchWeatherData(city, controller.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [city, reloadKey]);

  return { data, loading, error, refetch };
}
