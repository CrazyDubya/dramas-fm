import { NextResponse } from 'next/server';
import { databaseService } from '@/lib/database';

export async function GET() {
  try {
    const channels = await databaseService.getFeaturedChannels();

    return NextResponse.json({
      success: true,
      data: { channels }
    });

  } catch (error) {
    console.error('Channels API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch channels'
    }, { status: 500 });
  }
}