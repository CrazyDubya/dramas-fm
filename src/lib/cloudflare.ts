// Cloudflare D1 REST helper
// Never expose secrets client-side. This module is only for server-side usage.

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_D1_DB_ID = process.env.CF_D1_DB_ID; // optional, if not provided we resolve by name
const CF_D1_DB_NAME = process.env.CF_D1_DB_NAME || 'radio-archive-catalog';

if (!CF_API_TOKEN) {
  console.warn('CF_API_TOKEN is not set. D1 queries will fail until configured.');
}
if (!CF_ACCOUNT_ID) {
  console.warn('CF_ACCOUNT_ID is not set. D1 queries will fail until configured.');
}

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

async function cfFetch(path: string, init?: RequestInit) {
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
    throw new Error('Cloudflare credentials missing (CF_API_TOKEN or CF_ACCOUNT_ID).');
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
    throw new Error(`Cloudflare API error ${res.status}: ${text}`);
  }
  return res.json();
}

let cachedDbId: string | undefined = CF_D1_DB_ID;

export async function getD1DbId(): Promise<string> {
  if (cachedDbId) return cachedDbId;
  // Resolve by name
  const list = await cfFetch(`/accounts/${CF_ACCOUNT_ID}/d1/database?per_page=100`, { method: 'GET' }) as any;
  const match = (list.result || []).find((r: any) => r && r.name === CF_D1_DB_NAME);
  if (!match) throw new Error(`D1 database named ${CF_D1_DB_NAME} not found in account ${CF_ACCOUNT_ID}`);
  cachedDbId = match.uuid;
  return cachedDbId!;
}

// Very small helper to escape a single SQL string literal
function sqlEscape(str: string) {
  return str.replace(/'/g, "''");
}

export async function d1QueryRaw(sql: string): Promise<any> {
  const dbId = await getD1DbId();
  const body = JSON.stringify({ sql });
  const json = await cfFetch(`/accounts/${CF_ACCOUNT_ID}/d1/database/${dbId}/query`, {
    method: 'POST',
    body
  });
  return json;
}

export async function searchShowsInD1(options: { q: string, page?: number, limit?: number }) {
  const q = (options.q || '').toLowerCase();
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;
  const like = `%${sqlEscape(q)}%`;

  // Count total matches
  const countSql = `SELECT COUNT(*) AS c FROM radio_shows rs
    WHERE LOWER(rs.title) LIKE '${like}'
       OR LOWER(rs.description) LIKE '${like}'
       OR LOWER(rs.identifier) LIKE '${like}'`;
  const countRes = await d1QueryRaw(countSql);
  const total = countRes?.result?.[0]?.results?.[0]?.c ?? 0;

  const rowsSql = `SELECT rs.id, rs.identifier, rs.title, rs.description, rs.year, rs.downloads
    FROM radio_shows rs
    WHERE LOWER(rs.title) LIKE '${like}'
       OR LOWER(rs.description) LIKE '${like}'
       OR LOWER(rs.identifier) LIKE '${like}'
    ORDER BY rs.downloads DESC
    LIMIT ${limit} OFFSET ${offset}`;
  const rowsRes = await d1QueryRaw(rowsSql);
  const shows = rowsRes?.result?.[0]?.results ?? [];

  // Fetch one sample audio file per show if available
  const ids = shows.map((r: any) => r.id).filter((v: any) => v != null);
  let audioByShow: Record<string, any> = {};
  if (ids.length) {
    const idList = ids.map((id: any) => Number(id)).filter((n: any) => Number.isFinite(n));
    if (idList.length) {
      const inList = idList.join(',');
      const audioSql = `SELECT radio_show_id, MIN(id) AS id, MIN(streaming_url) AS streaming_url, MIN(download_url) AS download_url, MIN(duration) AS duration
        FROM audio_files
        WHERE radio_show_id IN (${inList})
        GROUP BY radio_show_id`;
      const audioRes = await d1QueryRaw(audioSql);
      const arr = audioRes?.result?.[0]?.results ?? [];
      for (const row of arr) audioByShow[String(row.radio_show_id)] = row;
    }
  }

  return { total, shows, audioByShow };
}
