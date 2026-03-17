const BASE = process.env.API_BASE_URL!;
const KEY = process.env.ADMIN_API_KEY!;

const headers = {
  "Content-Type": "application/json",
  "X-Admin-Key": KEY,
};

export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}
