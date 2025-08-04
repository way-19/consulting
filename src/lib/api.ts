export async function api<T>(url: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    ...init
  });
  const json = await res.json().catch(()=> ({}));
  if (!res.ok) throw new Error(json?.error || `API error: ${res.status}`);
  return json as T;
}