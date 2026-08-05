import { Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUvLevel } from "@/lib/air-quality";

interface UvIndexCardProps {
  uvIndex: number;
}

export function UvIndexCard({ uvIndex }: UvIndexCardProps) {
  const level = getUvLevel(uvIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sun className="size-4" />
          자외선지수
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-2">
        <span className="text-3xl font-semibold tabular-nums">
          {Math.round(uvIndex)}
        </span>
        <Badge className={level.className}>{level.label}</Badge>
      </CardContent>
    </Card>
  );
}
