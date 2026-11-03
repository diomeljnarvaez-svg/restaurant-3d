"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations, dicts, type Dict } from "@/lib/i18n";
import { useMounted } from "@/lib/use-mounted";

interface Message {
  type: "bot" | "user";
  text: string;
}

function buildFaq(d: Dict): { keywords: string[]; answer: string }[] {
  const c = d.chatbot as Record<string, string>;
  return Object.keys(d.chatbot)
    .filter(k => k.startsWith("faq_") && k.endsWith("_q"))
    .map(k => ({
      keywords: c[k].split(",").map(s => s.trim()),
      answer: c[k.replace("_q", "_a")],
    }));
}

function getBotResponse(input: string, d: Dict): string {
  const lower = input.toLowerCase();
  const faq = buildFaq(d);
  for (const item of faq) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.answer;
    }
  }
  return d.chatbot.fallback;
}

export default function ChatBot() {
  const { t, lang } = useTranslations();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const bottomRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => setPrimaryColor(s.primaryColor || "#8B5CF6")).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggle = () => {
    if (!open && !started) {
      setStarted(true);
      setMessages([
        { type: "bot", text: t("chatbot.greeting1") },
        { type: "bot", text: t("chatbot.greeting2") },
        { type: "bot", text: t("chatbot.greeting3") },
      ]);
    }
    setOpen(!open);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { type: "user", text }]);
    setInput("");
    setTimeout(() => {
      const reply = getBotResponse(text, dicts[lang]);
      setMessages(prev => [...prev, { type: "bot", text: reply }]);
    }, 500);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Chat button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
        style={{ backgroundColor: primaryColor }}
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[480px] max-h-[calc(100vh-200px)] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center gap-3 border-b border-white/10" style={{ backgroundColor: primaryColor + "22" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
              S
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Savy</p>
              <p className="text-xs text-gray-400">{t("chatbot.assistant")}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "text-white"
                      : "text-gray-200 bg-white/5 border border-white/10"
                  }`}
                  style={msg.type === "user" ? { backgroundColor: primaryColor } : {}}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={t("chatbot.placeholder")}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-2 placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
