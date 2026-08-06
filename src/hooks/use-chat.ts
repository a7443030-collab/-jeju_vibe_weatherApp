import { useCallback, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import type { City, TemperatureUnit, WeatherData } from "@/types/weather";

interface UseChatOptions {
  city: City | null;
  weather: WeatherData | null;
  unit: TemperatureUnit;
}

export function useChat({ city, weather, unit }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
      };

      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setSending(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages, city, weather, unit }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "챗봇 응답에 실패했습니다.");

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "model", text: data.reply as string },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setSending(false);
      }
    },
    [messages, sending, city, weather, unit]
  );

  return { messages, sendMessage, sending, error };
}
