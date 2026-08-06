import { NextResponse } from "next/server";
import { generateChatReply } from "@/lib/gemini";
import { getWeatherInfo } from "@/lib/weather-codes";
import { formatTemperature, unitSuffix } from "@/lib/units";
import type { ChatMessage } from "@/types/chat";
import type { City, TemperatureUnit, WeatherData } from "@/types/weather";

interface ChatRequestBody {
  messages: ChatMessage[];
  city: City | null;
  weather: WeatherData | null;
  unit: TemperatureUnit;
}

function buildSystemInstruction(
  city: City | null,
  weather: WeatherData | null,
  unit: TemperatureUnit
): string {
  const base =
    "너는 날씨 앱에 내장된 친절한 날씨 도우미 챗봇이야. " +
    "사용자의 질문에 한국어로 간결하고 자연스럽게 답변해. " +
    "아래에 현재 조회 중인 도시의 실시간 날씨 데이터가 주어지면 그 데이터를 근거로 답변하고, " +
    "옷차림, 우산, 야외활동 추천처럼 날씨에 기반한 실용적인 조언도 해줘. " +
    "데이터에 없는 정보는 추측하지 말고 모른다고 답해. " +
    "마크다운 문법(별표, 헤더, 목록 기호 등)은 사용하지 말고 일반 텍스트로만 답변해.";

  if (!city || !weather) {
    return `${base}\n\n현재 조회된 날씨 데이터가 없습니다.`;
  }

  const suffix = unitSuffix(unit);
  const current = weather.current;
  const { label: currentLabel } = getWeatherInfo(current.weatherCode, current.isDay);
  const today = weather.daily[0];

  const lines = [
    `${base}`,
    "",
    `[현재 날씨 데이터: ${city.name}${city.admin1 ? `, ${city.admin1}` : ""}]`,
    `- 날씨 상태: ${currentLabel}`,
    `- 현재 기온: ${formatTemperature(current.temperature, unit)}${suffix} (체감 ${formatTemperature(current.apparentTemperature, unit)}${suffix})`,
    `- 습도: ${current.humidity}%`,
    `- 강수량: ${current.precipitation}mm`,
    `- 풍속: ${current.windSpeed}km/h`,
  ];

  if (today) {
    lines.push(
      `- 오늘 최고/최저: ${formatTemperature(today.temperatureMax, unit)}${suffix} / ${formatTemperature(today.temperatureMin, unit)}${suffix}`,
      `- 오늘 강수확률: ${today.precipitationProbabilityMax}%`,
      `- 오늘 자외선지수: ${today.uvIndexMax}`
    );
  }

  if (weather.airQuality.usAqi !== null) {
    lines.push(`- 미세먼지(US AQI): ${weather.airQuality.usAqi}`);
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { messages, city, weather, unit } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "메시지가 없습니다." }, { status: 400 });
  }

  const systemInstruction = buildSystemInstruction(city, weather, unit ?? "celsius");
  const history = messages.map((message) => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));

  try {
    const reply = await generateChatReply(systemInstruction, history);
    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "챗봇 응답에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
