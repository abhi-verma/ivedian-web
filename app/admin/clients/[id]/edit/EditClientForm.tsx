"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type Client = {
  id: number;
  business_name: string;
  owner_name: string;
  owner_email: string;
  billing_email: string | null;
  booking_link: string;
};

export default function EditClientForm({ client }: { client: Client }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const body = {
      owner_name: (form.elements.namedItem("owner_name") as HTMLInputElement).value,
      owner_email: (form.elements.namedItem("owner_email") as HTMLInputElement).value,
      billing_email: (form.elements.namedItem("billing_email") as HTMLInputElement).value || null,
      booking_link: (form.elements.namedItem("booking_link") as HTMLInputElement).value,
    };

    const res = await fetch(`/api/admin/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.detail ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push(`/admin/clients/${client.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
      {/* Business name is read-only */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Business name
        </label>
        <div className="w-full border border-gray-100 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-400">
          {client.business_name}
        </div>
      </div>

      {[
        { name: "owner_name", label: "Owner name", type: "text", required: true, defaultValue: client.owner_name },
        { name: "owner_email", label: "Owner email", type: "email", required: true, defaultValue: client.owner_email },
        { name: "billing_email", label: "Billing email", type: "email", required: false, defaultValue: client.billing_email ?? "" },
        { name: "booking_link", label: "Booking link", type: "url", required: true, defaultValue: client.booking_link },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            name={field.name}
            type={field.type}
            required={field.required}
            defaultValue={field.defaultValue}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
        <Link href={`/admin/clients/${client.id}`} className="text-sm px-5 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}
