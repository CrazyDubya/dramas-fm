import { NextRequest, NextResponse } from 'next/server';
import { searchShowsInD1 } from '@/lib/cloudflare';
import { kvGetJson, kvPutJson } from '@/lib/kv';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    if (!checkRateLimit(`search:${ip}`)) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '20');

    if (!q) {
      return NextResponse.json({ success: true, data: { shows: [], totalCount: 0, facets: { genres: {}, years: {}, series: {}, actors: {} } } });
    }

    const cacheKey = `search:${q}:${page}:${limit}`;
    const cached = await kvGetJson<any>(cacheKey);
    if (!cached) {
      const fresh = await searchShowsInD1({ q, page, limit });
      await kvPutJson(cacheKey, fresh, 600);
      var { total, shows, audioByShow } = fresh;
    } else {
      var { total, shows, audioByShow } = cached;
    }

    const mapped = shows.map((s) => ({
      id: String(s.id),
      title: s.title || '',
      series: s.identifier || '',
      duration: audioByShow && audioByShow[String(s.id)] && typeof audioByShow[String(s.id)].duration === 'number'
        ? `${Math.round((audioByShow[String(s.id)].duration as number) / 60)}:00`
        : '',
      year: String(s.year || ''),
      description: s.description || '',
      archiveUrl: audioByShow?.[String(s.id)]?.streaming_url || '',
      genre: [],
      actors: [],
      rating: 4.0,
      playCount: Number(s.downloads || 0),
      tags: []
    }));

    const data = {
      shows: mapped,
      totalCount: total,
      facets: {
        genres: {},
        years: {},
        series: {},
        actors: {}
      }
    };

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Search API error', err);
    const msg = (err && typeof err === 'object' && 'message' in err) ? (err as { message: string }).message : 'Internal error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
