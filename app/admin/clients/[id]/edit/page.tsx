"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditClientForm from "./EditClientForm";

type Client = {
  id: number;
  business_name: string;
  owner_name: string;
  owner_email: string;
  billing_email: string | null;
  booking_link: string;
};

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    fetch(`/api/admin/clients/${id}`)
      .then((r) => r.json())
      .then(setClient);
  }, [id]);

  if (!client) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/admin" className="hover:text-gray-700">Clients</Link>
          <span className="mx-2">/</span>
          <Link href={`/admin/clients/${id}`} className="hover:text-gray-700">{client.business_name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Edit</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-8">Edit client</h1>
        <EditClientForm client={client} />
      </div>
    </div>
  );
}
