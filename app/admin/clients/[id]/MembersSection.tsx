"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function MembersSection({
  clientId,
  initialMembers,
}: {
  clientId: number;
  initialMembers: Member[];
}) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addForm, role: "owner" }),
      });
      if (!res.ok) {
        const err = await res.json();
        setAddError(err.detail ?? "Failed to add member");
      } else {
        setAddForm({ name: "", email: "" });
        router.refresh();
      }
    } finally {
      setAddLoading(false);
    }
  }

  async function handleRemoveMember(memberId: number) {
    if (!confirm("Remove this member's dashboard access?")) return;
    // optimistic remove
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    const res = await fetch(`/api/admin/clients/${clientId}/members/${memberId}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.detail ?? "Failed to remove member");
      router.refresh(); // re-sync on failure
    }
  }

  return (
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
  );
}
