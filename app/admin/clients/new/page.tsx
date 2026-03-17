"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const body = {
      business_name: (form.elements.namedItem("business_name") as HTMLInputElement).value,
      owner_name: (form.elements.namedItem("owner_name") as HTMLInputElement).value,
      owner_email: (form.elements.namedItem("owner_email") as HTMLInputElement).value,
      billing_email: (form.elements.namedItem("billing_email") as HTMLInputElement).value || undefined,
      booking_link: (form.elements.namedItem("booking_link") as HTMLInputElement).value,
      twilio_phone_number: (form.elements.namedItem("twilio_phone_number") as HTMLInputElement).value,
    };

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.detail ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/admin" className="hover:text-gray-700">Clients</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">New client</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-8">Add client</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          {[
            { name: "business_name", label: "Business name", type: "text", required: true, placeholder: "Glow Med Spa" },
            { name: "owner_name", label: "Owner name", type: "text", required: true, placeholder: "Jane Smith" },
            { name: "owner_email", label: "Owner email", type: "email", required: true, placeholder: "jane@glowmedspa.com" },
            { name: "billing_email", label: "Billing email", type: "email", required: false, placeholder: "billing@glowmedspa.com (optional)" },
            { name: "booking_link", label: "Booking link", type: "url", required: true, placeholder: "https://calendly.com/glowmedspa" },
            { name: "twilio_phone_number", label: "Twilio phone number", type: "text", required: true, placeholder: "+18883945105" },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
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
              {loading ? "Creating..." : "Create client"}
            </button>
            <Link href="/admin" className="text-sm px-5 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
