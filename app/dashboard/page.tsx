"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Message = {
  id: number;
  channel: string;
  nurture_step: number;
  content: string;
  status: string;
  sent_at: string;
};

type Lead = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  service_interest: string;
  status: string;
  created_at: string;
  messages: Message[];
};

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type DashboardData = {
  client: {
    id: number;
    business_name: string;
    subscription_status: string;
    trial_end_date: string;
    days_remaining: number | null;
    booking_link: string;
  };
  member: {
    name: string;
    email: string;
    role: string;
  };
  stats: {
    total: number;
    booked: number;
    nurturing: number;
    opted_out: number;
  };
  leads: Lead[];
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  nurturing: "Nurturing",
  booked: "Booked",
  opted_out: "Opted Out",
  nurture_complete: "Complete",
};

const STATUS_COLOR: Record<string, string> = {
  new: "bg-gray-100 text-gray-600",
  contacted: "bg-blue-100 text-blue-700",
  nurturing: "bg-purple-100 text-purple-700",
  booked: "bg-green-100 text-green-700",
  opted_out: "bg-red-100 text-red-700",
  nurture_complete: "bg-gray-100 text-gray-500",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeader = async () => `Bearer ${await getToken()}`;

  const loadMembers = async () => {
    const auth = await authHeader();
    const res = await fetch("/api/dashboard/members", {
      headers: { Authorization: auth },
    });
    if (res.ok) setMembers(await res.json());
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    (async () => {
      const auth = await authHeader();
      const res = await fetch("/api/dashboard/me", {
        headers: { Authorization: auth },
      });

      if (!res.ok) {
        const body = await res.json();
        setError(
          res.status === 403
            ? "Your dashboard access has been deactivated. Please contact your administrator."
            : body.detail ?? "Something went wrong. Please try again."
        );
        return;
      }

      setData(await res.json());
      loadMembers();
    })();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || (!data && !error)) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm space-y-3">
          <p className="text-gray-600 text-sm">{error}</p>
          <div className="flex flex-col gap-2 items-center">
            <a href="/admin" className="text-blue-600 hover:underline text-sm">
              Go to admin dashboard →
            </a>
            <a href="mailto:hello@nevermissalead.com" className="text-gray-400 hover:underline text-xs">
              Contact support
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { client, member, stats, leads } = data;
  const isOwner = member.role === "owner";

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const auth = await authHeader();
      const res = await fetch("/api/dashboard/members", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: auth },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const err = await res.json();
        setAddError(err.detail ?? "Failed to add member");
      } else {
        setAddForm({ name: "", email: "" });
        loadMembers();
      }
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemoveMember(memberId: number) {
    if (!confirm("Remove this member's dashboard access?")) return;
    const auth = await authHeader();
    await fetch(`/api/dashboard/members/${memberId}`, {
      method: "DELETE",
      headers: { Authorization: auth },
    });
    loadMembers();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{client.business_name}</h1>
          <p className="text-xs text-gray-400">Lead Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{member.name}</span>
          <UserButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Trial banner */}
        {client.subscription_status === "trial" && client.days_remaining !== null && (
          <div
            className={`mb-6 px-5 py-3 rounded-lg border-l-4 text-sm ${
              client.days_remaining <= 5
                ? "bg-amber-50 border-amber-500 text-amber-800"
                : "bg-blue-50 border-blue-400 text-blue-800"
            }`}
          >
            <strong>Free trial:</strong> {client.days_remaining} day{client.days_remaining !== 1 ? "s" : ""} remaining.{" "}
            <a href="mailto:hello@nevermissalead.com" className="underline">
              Upgrade to remove limits.
            </a>
          </div>
        )}
        {client.subscription_status === "paused" && (
          <div className="mb-6 px-5 py-3 rounded-lg border-l-4 bg-red-50 border-red-500 text-red-800 text-sm">
            <strong>Account paused.</strong> New leads are not being processed.{" "}
            <a href="mailto:hello@nevermissalead.com" className="underline">
              Contact us to reactivate.
            </a>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.total, color: "" },
            { label: "Booked", value: stats.booked, color: "text-green-600" },
            { label: "Nurturing", value: stats.nurturing, color: "text-purple-600" },
            { label: "Opted Out", value: stats.opted_out, color: "text-red-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className={`text-3xl font-bold ${color || "text-gray-900"}`}>{value}</div>
            </div>
          ))}
        </div>

        {/* Leads table */}
        <h2 className="text-base font-bold text-gray-800 mb-3">
          Leads <span className="text-gray-400 font-normal text-sm">({leads.length})</span>
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Name", "Contact", "Service", "Status", "Received", "Last Message"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No leads yet. Share your inquiry form to get started.
                  </td>
                </tr>
              )}
              {leads.map((lead) => {
                const sentMsgs = lead.messages.filter((m) => m.status === "sent");
                const lastMsg = sentMsgs.at(-1) ?? null;
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-5 py-4 text-gray-500">
                      <div>{lead.email ?? "—"}</div>
                      {lead.phone && <div className="text-xs">{lead.phone}</div>}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{lead.service_interest}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          STATUS_COLOR[lead.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABEL[lead.status] ?? lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{fmtDate(lead.created_at)}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {lastMsg ? fmtDateTime(lastMsg.sent_at) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Team */}
        <h2 className="text-base font-bold text-gray-800 mb-3">
          Team <span className="text-gray-400 font-normal text-sm">({members.length} of 5)</span>
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10">
          {members.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Role</th>
                  {isOwner && <th className="px-5 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{m.name}</td>
                    <td className="px-5 py-4 text-gray-500">{m.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          m.role === "owner" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    {isOwner && (
                      <td className="px-5 py-4 text-right">
                        {m.email !== member.email && (
                          <button
                            onClick={() => handleRemoveMember(m.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isOwner && (
            <form
              onSubmit={handleAddMember}
              className={`${members.length > 0 ? "border-t border-gray-100" : ""} px-5 py-4 flex flex-wrap gap-3 items-end`}
            >
              <div>
                <label htmlFor="team-name" className="block text-xs font-semibold text-gray-500 mb-1">
                  Name
                </label>
                <input
                  id="team-name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="team-email" className="block text-xs font-semibold text-gray-500 mb-1">
                  Email
                </label>
                <input
                  id="team-email"
                  type="email"
                  required
                  placeholder="jane@yourspa.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={addLoading || members.length >= 5}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {addLoading ? "Adding…" : "Add Member"}
              </button>
              {addError && <p className="text-red-500 text-xs w-full">{addError}</p>}
            </form>
          )}

          {!isOwner && members.length === 0 && (
            <p className="px-5 py-6 text-sm text-gray-400">No team members yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
