import { NextRequest, NextResponse } from 'next/server';
import { d1QueryRaw } from '@/lib/cloudflare';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    if (!checkRateLimit(`show:${ip}`)) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }

    const showSql = `SELECT id, identifier, title, description, year, downloads FROM radio_shows WHERE id = ${idNum} LIMIT 1`;
    const showRes = await d1QueryRaw(showSql);
    const show = ((showRes.result?.[0]?.results ?? []) as unknown[])[0] as any;
    if (!show) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const audioSql = `SELECT id, radio_show_id, streaming_url, download_url, duration FROM audio_files WHERE radio_show_id = ${idNum} ORDER BY id LIMIT 100`;
    const audioRes = await d1QueryRaw(audioSql);
    const audioFiles = ((audioRes.result?.[0]?.results ?? []) as unknown[]) as any[];

    return NextResponse.json({ success: true, data: { show, audioFiles } });
  } catch (err) {
    const msg = (err && typeof err === 'object' && 'message' in err) ? (err as { message: string }).message : 'Internal error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
