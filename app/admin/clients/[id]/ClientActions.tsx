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
  const [status, setStatus] = useState(client.subscription_status);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function call(action: string, method = "POST", body?: object) {
    setError(null);
    setLoadingAction(action);
    const res = await fetch(`/api/admin/${action}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    setLoadingAction(null);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.detail ?? `Request failed (${res.status})`);
    }
    router.refresh();
  }

  async function togglePause() {
    const next = status === "paused" ? "active" : "paused";
    setStatus(next); // optimistic
    try {
      await call(`clients/${client.id}/${next === "paused" ? "pause" : "resume"}`);
    } catch (err) {
      setStatus(status); // roll back
      setError(err instanceof Error ? err.message : "Action failed");
    }
  }

  async function extendTrial() {
    try {
      await call(`clients/${client.id}/extend-trial`, "POST", { days: 7 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  }

  async function deleteClient() {
    if (!confirm(`Delete ${client.business_name} and all their data? This cannot be undone.`)) return;
    try {
      await call(`clients/${client.id}`, "DELETE");
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const isPaused = status === "paused";

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      <div className="flex gap-2 flex-wrap justify-end">
        <button
          onClick={togglePause}
          disabled={loadingAction !== null}
          className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={extendTrial}
          disabled={loadingAction !== null}
          className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {loadingAction === `clients/${client.id}/extend-trial` ? "Extending…" : "+7 days trial"}
        </button>
        <button
          onClick={deleteClient}
          disabled={loadingAction !== null}
          className="text-sm px-4 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
