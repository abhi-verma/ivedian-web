"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  channel: string;
  nurture_step: number;
  content: string;
  status: string;
  sent_at: string;
};

const channelColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  sms: "bg-purple-100 text-purple-700",
};

const statusColors: Record<string, string> = {
  sent: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  skipped: "bg-gray-100 text-gray-500",
};

export default function LeadMessagesPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/leads/${id}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="text-sm text-gray-400 mb-6">
          <Link href="/admin" className="hover:text-gray-700">Clients</Link>
          <span className="mx-2">/</span>
          <Link href="javascript:history.back()" className="hover:text-gray-700">Client</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Lead #{id} messages</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-8">
          Messages <span className="text-gray-400 font-normal text-base">({messages.length})</span>
        </h1>

        {messages.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400">
            No messages sent yet.
          </div>
        )}

        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${channelColors[m.channel] ?? "bg-gray-100 text-gray-600"}`}>
                  {m.channel}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[m.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {m.status}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  Step {m.nurture_step} &middot; {new Date(m.sent_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
