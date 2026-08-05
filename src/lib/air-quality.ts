export interface AqiLevel {
  label: string;
  className: string;
}

export function getAqiLevel(usAqi: number | null): AqiLevel {
  if (usAqi == null) return { label: "정보 없음", className: "bg-muted text-muted-foreground" };
  if (usAqi <= 50) return { label: "좋음", className: "bg-emerald-500 text-white" };
  if (usAqi <= 100) return { label: "보통", className: "bg-yellow-500 text-white" };
  if (usAqi <= 150) return { label: "민감군 나쁨", className: "bg-orange-500 text-white" };
  if (usAqi <= 200) return { label: "나쁨", className: "bg-red-500 text-white" };
  if (usAqi <= 300) return { label: "매우 나쁨", className: "bg-purple-600 text-white" };
  return { label: "위험", className: "bg-rose-900 text-white" };
}

export function getUvLevel(uvIndex: number): AqiLevel {
  if (uvIndex < 3) return { label: "낮음", className: "bg-emerald-500 text-white" };
  if (uvIndex < 6) return { label: "보통", className: "bg-yellow-500 text-white" };
  if (uvIndex < 8) return { label: "높음", className: "bg-orange-500 text-white" };
  if (uvIndex < 11) return { label: "매우 높음", className: "bg-red-500 text-white" };
  return { label: "위험", className: "bg-purple-600 text-white" };
}
