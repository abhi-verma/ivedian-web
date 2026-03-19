"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClientActions from "./ClientActions";

type Client = {
  id: number;
  business_name: string;
  owner_name: string;
  owner_email: string;
  billing_email: string | null;
  booking_link: string;
  twilio_phone_number: string;
  dashboard_token: string;
  subscription_status: string;
  trial_start_date: string;
  trial_end_date: string;
  trial_leads_count: number;
  lead_count: number;
  created_at: string;
};

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Lead = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  service_interest: string;
  status: string;
  message_count: number;
  created_at: string;
};

const statusColors: Record<string, string> = {
  trial: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  churned: "bg-red-100 text-red-700",
};

const leadStatusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-600",
  contacted: "bg-blue-100 text-blue-700",
  nurturing: "bg-purple-100 text-purple-700",
  booked: "bg-green-100 text-green-700",
  opted_out: "bg-red-100 text-red-700",
  nurture_complete: "bg-gray-100 text-gray-500",
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const loadMembers = () =>
    fetch(`/api/admin/clients/${id}/members`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setMembers(data); });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/clients/${id}`).then((r) => r.json()),
      fetch(`/api/admin/clients/${id}/leads`).then((r) => r.json()),
    ]).then(([c, l]) => {
      setClient(c);
      setLeads(l);
    });
    loadMembers();
  }, [id]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addForm, role: "owner" }),
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
    await fetch(`/api/admin/clients/${id}/members/${memberId}`, { method: "DELETE" });
    loadMembers();
  }

  if (!client) return null;

  const dashboardUrl = `https://www.ivedian.com/dashboard`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/admin" className="hover:text-gray-700">Clients</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{client.business_name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{client.business_name}</h1>
            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded-full ${statusColors[client.subscription_status] ?? "bg-gray-100 text-gray-600"}`}>
              {client.subscription_status}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Link
              href={`/admin/clients/${client.id}/edit`}
              className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Edit
            </Link>
            <ClientActions client={client} />
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Owner", value: client.owner_name },
            { label: "Owner email", value: client.owner_email },
            { label: "Billing email", value: client.billing_email ?? "—" },
            { label: "Phone number", value: client.twilio_phone_number },
            { label: "Trial ends", value: new Date(client.trial_end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
            { label: "Leads", value: `${client.lead_count} total` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-sm text-gray-800 font-medium break-all">{value}</div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Booking link</div>
          <a href={client.booking_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">{client.booking_link}</a>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-2">Dashboard URL</div>
          <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">{dashboardUrl}</a>
        </div>

        {/* Dashboard Access */}
        <h2 className="text-lg font-bold mb-4">
          Dashboard Access <span className="text-gray-400 font-normal text-sm">({members.length} of 5)</span>
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          {members.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-400">No members yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Role</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium">{m.name}</td>
                    <td className="px-5 py-4 text-gray-500">{m.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${m.role === "owner" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Add member form */}
          <form onSubmit={handleAddMember} className="border-t border-gray-100 px-5 py-4 flex flex-wrap gap-3 items-end">
            <div>
              <label htmlFor="member-name" className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
              <input
                id="member-name"
                type="text"
                required
                placeholder="Jane Smith"
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="member-email" className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input
                id="member-email"
                type="email"
                required
                placeholder="jane@example.com"
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
        </div>

        {/* Leads table */}
        <h2 className="text-lg font-bold mb-4">Leads <span className="text-gray-400 font-normal text-sm">({leads.length})</span></h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Service</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Messages</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400">No leads yet.</td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{lead.name}</td>
                  <td className="px-5 py-4 text-gray-500">
                    <div>{lead.email ?? "—"}</div>
                    <div className="text-xs">{lead.phone ?? "—"}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{lead.service_interest}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${leadStatusColors[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{lead.message_count}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/leads/${lead.id}`} className="text-blue-600 hover:underline font-medium">
                      Messages →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
