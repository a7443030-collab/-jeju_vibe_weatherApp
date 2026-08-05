"use client";

import { useEffect, useState } from "react";
import { MapPin, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { geocodeCity } from "@/lib/open-meteo";
import type { City } from "@/types/weather";

interface CitySearchProps {
  city: City | null;
  onSelect: (city: City) => void;
}

export function CitySearch({ city, onSelect }: CitySearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    geocodeCity(debouncedQuery, controller.signal)
      .then((cities) => {
        setResults(cities);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-between sm:w-64"
          />
        }
      >
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          {city ? `${city.name}${city.admin1 ? `, ${city.admin1}` : ""}` : "도시 선택"}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="도시 이름 검색 (예: 제주, Seoul, Tokyo)"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "검색 중..."
                : query.trim()
                  ? "검색 결과가 없습니다."
                  : "도시 이름을 입력하세요."}
            </CommandEmpty>
            <CommandGroup>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={String(result.id)}
                  onSelect={() => {
                    onSelect(result);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>
                    {result.name}
                    {result.admin1 ? `, ${result.admin1}` : ""}
                    <span className="ml-1 text-muted-foreground">
                      ({result.country})
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
