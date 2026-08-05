import { Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAqiLevel } from "@/lib/air-quality";
import type { AirQuality } from "@/types/weather";

interface AirQualityCardProps {
  airQuality: AirQuality;
}

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  const level = getAqiLevel(airQuality.usAqi);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wind className="size-4" />
          미세먼지
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-2">
          <span className="text-3xl font-semibold tabular-nums">
            {airQuality.usAqi != null ? Math.round(airQuality.usAqi) : "-"}
          </span>
          <Badge className={level.className}>{level.label}</Badge>
        </div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>
            PM10 <span className="font-medium text-foreground">{airQuality.pm10 ?? "-"}</span>
          </span>
          <span>
            PM2.5 <span className="font-medium text-foreground">{airQuality.pm2_5 ?? "-"}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
