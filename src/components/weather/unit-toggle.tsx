import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { TemperatureUnit } from "@/types/weather";

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const isFahrenheit = unit === "fahrenheit";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
      <span
        className={cn(
          "text-sm font-medium",
          !isFahrenheit ? "text-foreground" : "text-muted-foreground"
        )}
      >
        °C
      </span>
      <Switch
        checked={isFahrenheit}
        onCheckedChange={(checked) => onChange(checked ? "fahrenheit" : "celsius")}
        aria-label="온도 단위 전환"
      />
      <span
        className={cn(
          "text-sm font-medium",
          isFahrenheit ? "text-foreground" : "text-muted-foreground"
        )}
      >
        °F
      </span>
    </div>
  );
}
