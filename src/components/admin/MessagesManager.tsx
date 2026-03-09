"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, RefreshCw, Gift, User, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type Message, listMessages, deleteMessage } from "@/firebase/messages";

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchMessages() {
    setLoading(true);
    try {
      const data = await listMessages();
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/tchubiraudau"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <MessageSquare className="w-6 h-6 text-neutral-700" />
            <h1 className="text-2xl font-bold text-neutral-900">Mensagens dos convidados</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMessages}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-neutral-200 p-5 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-neutral-100 rounded w-full mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-neutral-400">
            <MessageSquare className="w-10 h-10" />
            <p className="text-sm">Nenhuma mensagem ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl bg-white border border-neutral-200 p-5 flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-sm font-semibold text-neutral-900">{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {msg.createdAt && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {msg.createdAt.toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                {msg.gifts && (
                  <div className="flex items-start gap-2 rounded-xl bg-neutral-50 border border-neutral-100 px-3 py-2">
                    <Gift className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-neutral-500">{msg.gifts}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
