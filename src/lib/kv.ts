// Optional Cloudflare KV helper for server-side caching
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_KV_NAMESPACE_ID = process.env.CF_KV_NAMESPACE_ID; // optional

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

async function kvFetch(path: string, init?: RequestInit) {
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID || !CF_KV_NAMESPACE_ID) {
    throw new Error('KV not configured');
  }
  const url = `${CF_API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`KV API error ${res.status}: ${text}`);
  }
  return res;
}

export async function kvGetJson<T>(key: string): Promise<T | null> {
  try {
    const res = await kvFetch(`/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${encodeURIComponent(key)}`, { method: 'GET' });
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function kvPutJson<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  try {
    const body: any = { value: JSON.stringify(value) };
    if (ttlSeconds && ttlSeconds > 0) body.expiration_ttl = ttlSeconds;
    await kvFetch(`/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/${encodeURIComponent(key)}`,
      { method: 'PUT', body: JSON.stringify(body) });
    return true;
  } catch {
    return false;
  }
}
