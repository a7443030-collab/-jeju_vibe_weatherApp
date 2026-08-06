"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import type { City, TemperatureUnit, WeatherData } from "@/types/weather";

interface WeatherChatbotProps {
  city: City | null;
  weather: WeatherData | null;
  unit: TemperatureUnit;
}

export function WeatherChatbot({ city, weather, unit }: WeatherChatbotProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, sending, error } = useChat({ city, weather, unit });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    sendMessage(input);
    setInput("");
  }

  if (!open) {
    return (
      <Button
        size="icon-lg"
        className="fixed right-4 bottom-4 z-50 rounded-full shadow-lg sm:right-6 sm:bottom-6"
        onClick={() => setOpen(true)}
        aria-label="날씨 챗봇 열기"
      >
        <MessageCircle />
      </Button>
    );
  }

  return (
    <Card className="fixed right-4 bottom-4 z-50 h-[min(32rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] shadow-xl sm:right-6 sm:bottom-6">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-1.5">
          <Bot className="size-4.5 text-primary" />
          날씨 챗봇
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen(false)}
            aria-label="날씨 챗봇 닫기"
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-0">
        <ScrollArea className="min-h-0 flex-1 px-4">
          <div className="flex flex-col gap-3 py-1">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {city
                  ? `${city.name}의 날씨에 대해 무엇이든 물어보세요. (예: 오늘 우산 필요할까?)`
                  : "날씨에 대해 무엇이든 물어보세요."}
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "self-end bg-primary text-primary-foreground"
                      : "self-start bg-muted text-foreground"
                  )}
                >
                  {message.text}
                </div>
              ))
            )}
            {sending && (
              <div className="flex items-center gap-1.5 self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                답변 작성 중...
              </div>
            )}
            {error && (
              <p className="self-start text-sm text-destructive">{error}</p>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={sending || !input.trim()}>
            <Send />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
