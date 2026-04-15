import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Client = {
  id: number;
  business_name: string;
  owner_name: string;
  owner_email: string;
  subscription_status: string;
  trial_end_date: string;
  lead_count: number;
  created_at: string;
};

type Metrics = {
  total_clients: number;
  total_leads: number;
  total_messages: number;
  clients_by_status: {
    trial: number;
    active: number;
    paused: number;
    churned: number;
  };
};

const statusColors: Record<string, string> = {
  trial: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  churned: "bg-red-100 text-red-700",
};

export default async function AdminPage() {
  const [clients, metrics] = await Promise.all([
    apiFetch("/admin/clients") as Promise<Client[]>,
    apiFetch("/admin/metrics") as Promise<Metrics>,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <Link
            href="/admin/clients/new"
            className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            + Add client
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total clients", value: metrics.total_clients },
            { label: "Total leads", value: metrics.total_leads },
            { label: "Total messages", value: metrics.total_messages },
            { label: "Active clients", value: metrics.clients_by_status.active },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {Object.entries(metrics.clients_by_status).map(([status, count]) => (
            <div key={status} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[status] ?? "bg-gray-100 text-gray-600"}`}>{status}</span>
              <span className="text-sm font-bold text-gray-700">{count}</span>
            </div>
          ))}
        </div>

        {/* Clients table */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Clients <span className="text-gray-400 font-normal text-sm">({clients.length})</span></h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Business</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Owner</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Trial ends</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Leads</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                    No clients yet.{" "}
                    <Link href="/admin/clients/new" className="text-blue-600 hover:underline">Add one.</Link>
                  </td>
                </tr>
              )}
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium">{c.business_name}</td>
                  <td className="px-5 py-4 text-gray-600">
                    <div>{c.owner_name}</div>
                    <div className="text-xs text-gray-400">{c.owner_email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[c.subscription_status] ?? "bg-gray-100 text-gray-600"}`}>
                      {c.subscription_status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {new Date(c.trial_end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.lead_count}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/clients/${c.id}`} className="text-blue-600 hover:underline font-medium">View →</Link>
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
