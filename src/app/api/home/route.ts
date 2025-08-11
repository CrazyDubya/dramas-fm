import { NextResponse } from 'next/server';
import { d1QueryRaw } from '@/lib/cloudflare';

function toMinutes(duration?: number): string {
  if (!duration || !Number.isFinite(duration)) return '';
  const mins = Math.max(1, Math.round(duration / 60));
  return `${mins}:00`;
}

export async function GET() {
  try {
    // Top downloads
    const topSql = `SELECT id, identifier, title, description, year, downloads FROM radio_shows ORDER BY downloads DESC LIMIT 12`;
    const topRes = await d1QueryRaw(topSql);
    const topShows = ((topRes.result?.[0]?.results ?? []) as unknown[]) as any[];

    const ids = topShows.map((r) => r.id).filter((v) => v != null);
    let audioByShow: Record<string, any> = {};
    if (ids.length) {
      const inList = ids.map((id: number) => Number(id)).filter((n) => Number.isFinite(n)).join(',');
      if (inList) {
        const audioSql = `SELECT radio_show_id, MIN(id) AS id, MIN(streaming_url) AS streaming_url, MIN(download_url) AS download_url, MIN(duration) AS duration FROM audio_files WHERE radio_show_id IN (${inList}) GROUP BY radio_show_id`;
        const audioRes = await d1QueryRaw(audioSql);
        const arr = ((audioRes.result?.[0]?.results ?? []) as unknown[]) as any[];
        for (const row of arr) audioByShow[String(row.radio_show_id)] = row;
      }
    }

    const mappedTop = topShows.map((s) => ({
      id: String(s.id),
      title: s.title || '',
      series: s.identifier || '',
      duration: toMinutes(audioByShow[String(s.id)]?.duration),
      year: String(s.year || ''),
      description: s.description || '',
      archiveUrl: audioByShow[String(s.id)]?.streaming_url || audioByShow[String(s.id)]?.download_url || '',
      genre: [],
      actors: [],
      rating: 4.0,
      playCount: Number(s.downloads || 0),
      tags: [],
      quality: { audioQuality: 3, transcriptionAccuracy: 3, userReports: 0 },
    }));

    // Discover: random selection
    const rndSql = `SELECT id, identifier, title, description, year, downloads FROM radio_shows ORDER BY RANDOM() LIMIT 12`;
    const rndRes = await d1QueryRaw(rndSql);
    const rndShows = ((rndRes.result?.[0]?.results ?? []) as unknown[]) as any[];

    const rid = rndShows.map((r) => r.id).filter((v) => v != null);
    let rndAudio: Record<string, any> = {};
    if (rid.length) {
      const inList = rid.map((id: number) => Number(id)).filter((n) => Number.isFinite(n)).join(',');
      if (inList) {
        const audioSql = `SELECT radio_show_id, MIN(id) AS id, MIN(streaming_url) AS streaming_url, MIN(download_url) AS download_url, MIN(duration) AS duration FROM audio_files WHERE radio_show_id IN (${inList}) GROUP BY radio_show_id`;
        const audioRes = await d1QueryRaw(audioSql);
        const arr = ((audioRes.result?.[0]?.results ?? []) as unknown[]) as any[];
        for (const row of arr) rndAudio[String(row.radio_show_id)] = row;
      }
    }

    const mappedRnd = rndShows.map((s) => ({
      id: String(s.id),
      title: s.title || '',
      series: s.identifier || '',
      duration: toMinutes(rndAudio[String(s.id)]?.duration),
      year: String(s.year || ''),
      description: s.description || '',
      archiveUrl: rndAudio[String(s.id)]?.streaming_url || rndAudio[String(s.id)]?.download_url || '',
      genre: [],
      actors: [],
      rating: 4.0,
      playCount: Number(s.downloads || 0),
      tags: [],
      quality: { audioQuality: 3, transcriptionAccuracy: 3, userReports: 0 },
    }));

    const channels = [
      { id: 'top-downloads', name: 'Top Downloads', description: 'Most popular radio shows', featured: true, category: 'Popular', curatedBy: 'system', shows: mappedTop },
      { id: 'discover', name: 'Discover', description: 'Random picks from the archive', featured: true, category: 'Discovery', curatedBy: 'system', shows: mappedRnd },
    ];

    return NextResponse.json({ success: true, data: { channels } });
  } catch (err) {
    const msg = (err && typeof err === 'object' && 'message' in err) ? (err as { message: string }).message : 'Internal error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
