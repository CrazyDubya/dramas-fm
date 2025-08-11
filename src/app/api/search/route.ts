import { NextRequest, NextResponse } from 'next/server';
import { searchShowsInD1 } from '@/lib/cloudflare';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '20');

    if (!q) {
      return NextResponse.json({ success: true, data: { shows: [], totalCount: 0, facets: { genres: {}, years: {}, series: {}, actors: {} } } });
    }

    const { total, shows, audioByShow } = await searchShowsInD1({ q, page, limit });

    const mapped = shows.map((s: any) => ({
      id: String(s.id),
      title: s.title || '',
      series: s.identifier || '',
      duration: audioByShow?.[String(s.id)]?.duration ? `${Math.round(audioByShow[String(s.id)].duration / 60)}:00` : '',
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
  } catch (err: any) {
    console.error('Search API error', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal error' }, { status: 500 });
  }
}
