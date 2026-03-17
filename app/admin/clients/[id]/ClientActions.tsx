"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Client = {
  id: number;
  business_name: string;
  subscription_status: string;
};

export default function ClientActions({ client }: { client: Client }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function call(action: string, method = "POST", body?: object) {
    setLoading(true);
    await fetch(`/api/admin/${action}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    setLoading(false);
    router.refresh();
  }

  const isPaused = client.subscription_status === "paused";

  return (
    <div className="flex gap-2 flex-wrap justify-end">
      <button
        onClick={() => call(`clients/${client.id}/${isPaused ? "resume" : "pause"}`)}
        disabled={loading}
        className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button
        onClick={() => call(`clients/${client.id}/extend-trial`, "POST", { days: 7 })}
        disabled={loading}
        className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        +7 days trial
      </button>
      <button
        onClick={() => {
          if (confirm(`Delete ${client.business_name} and all their data? This cannot be undone.`)) {
            call(`clients/${client.id}`, "DELETE").then(() => router.push("/admin"));
          }
        }}
        disabled={loading}
        className="text-sm px-4 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
