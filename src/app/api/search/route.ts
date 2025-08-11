import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database';
import { SearchFilters } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Parse filters
    const filters: SearchFilters = {};
    
    const genre = searchParams.get('genre');
    if (genre) {
      filters.genre = genre.split(',');
    }

    const yearMin = searchParams.get('year_min');
    const yearMax = searchParams.get('year_max');
    if (yearMin || yearMax) {
      filters.year = {};
      if (yearMin) filters.year.min = parseInt(yearMin);
      if (yearMax) filters.year.max = parseInt(yearMax);
    }

    const durationMin = searchParams.get('duration_min');
    const durationMax = searchParams.get('duration_max');
    if (durationMin || durationMax) {
      filters.duration = {};
      if (durationMin) filters.duration.min = parseInt(durationMin);
      if (durationMax) filters.duration.max = parseInt(durationMax);
    }

    const ratingMin = searchParams.get('rating_min');
    const ratingMax = searchParams.get('rating_max');
    if (ratingMin || ratingMax) {
      filters.rating = {};
      if (ratingMin) filters.rating.min = parseFloat(ratingMin);
      if (ratingMax) filters.rating.max = parseFloat(ratingMax);
    }

    const series = searchParams.get('series');
    if (series) {
      filters.series = series;
    }

    const actors = searchParams.get('actors');
    if (actors) {
      filters.actors = actors.split(',');
    }

    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',');
    }

    const ageRating = searchParams.get('age_rating');
    if (ageRating) {
      filters.ageRating = ageRating.split(',');
    }

    // Perform search
    const results = await databaseService.searchShows(query, filters, page, limit);

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Search failed'
    }, { status: 500 });
  }
}