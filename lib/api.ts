const BASE = process.env.API_BASE_URL!;
const KEY = process.env.ADMIN_API_KEY!;

const adminHeaders = {
  "Content-Type": "application/json",
  "X-Admin-Key": KEY,
};

export async function apiFetch(path: string, init?: RequestInit) {
  const method = (init?.method ?? "GET").toUpperCase();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...adminHeaders, ...(init?.headers ?? {}) },
    ...(method === "GET" ? {} : { cache: "no-store" as const }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Proxy a dashboard request to the Railway backend, forwarding the user's
 * Clerk Bearer token. Used by client-facing dashboard API routes.
 */
export async function dashboardFetch(
  path: string,
  authorization: string,
  init?: RequestInit
) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}
