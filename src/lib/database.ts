// Database service for connecting to Cloudflare database
// Note: These keys should be stored in environment variables in production

import { RadioShow, Channel, SearchResult, SearchFilters } from './types';

// Cloudflare database configuration
// Removed hard-coded tokens. Use server-side API only.

// Base URL for the database service (this would be the actual Cloudflare endpoint)
// Use relative API routes; server handles DB access via Cloudflare
const DATABASE_BASE_URL = '';

class DatabaseService {
  private apiKey: string;

  constructor() {
    // Use first key as primary, others as fallbacks
    this.apiKey = ''; // not used; requests go to our Next.js API
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${DATABASE_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          // 'Authorization': `Bearer ${this.apiKey}`, // no direct db auth client-side
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Database request failed:', error);
      // In production, implement fallback to other keys
      throw error;
    }
  }

  // Get featured channels for homepage
  async getFeaturedChannels(): Promise<Channel[]> {
    try {
      const data = await this.makeRequest('/api/home') as { data?: { channels?: Channel[] } };
      return data.data?.channels || [];
    } catch (error) {
      console.error('Failed to fetch featured channels:', error);
      // Return mock data as fallback
      return this.getMockFeaturedChannels();
    }
  }

  // Search radio shows
  async searchShows(query: string, filters?: SearchFilters, page = 1, limit = 20): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString()
      });

      if (filters) {
        if (filters.genre?.length) {
          params.append('genre', filters.genre.join(','));
        }
        if (filters.year?.min) {
          params.append('year_min', filters.year.min.toString());
        }
        if (filters.year?.max) {
          params.append('year_max', filters.year.max.toString());
        }
        // Add other filter parameters as needed
      }

      const data = await this.makeRequest(`/api/search?${params.toString()}`) as SearchResult;
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      // Return mock search results as fallback
      return this.getMockSearchResults(query);
    }
  }

  // Get show details by ID
  async getShowById(id: string): Promise<RadioShow | null> {
    try {
      const data = await this.makeRequest(`/api/shows/${id}`) as { show: RadioShow };
      return data.show || null;
    } catch (error) {
      console.error('Failed to fetch show:', error);
      return null;
    }
  }

  // Get shows by series
  async getShowsBySeries(seriesName: string): Promise<RadioShow[]> {
    try {
      const data = await this.makeRequest(`/api/series/${encodeURIComponent(seriesName)}`) as { shows: RadioShow[] };
      return data.shows || [];
    } catch (error) {
      console.error('Failed to fetch series shows:', error);
      return [];
    }
  }

  // Get random shows for discovery
  async getRandomShows(count = 10): Promise<RadioShow[]> {
    try {
      const data = await this.makeRequest(`/api/shows/random?count=${count}`) as { shows: RadioShow[] };
      return data.shows || [];
    } catch (error) {
      console.error('Failed to fetch random shows:', error);
      return [];
    }
  }

  // Mock data for development/fallback
  private getMockFeaturedChannels(): Channel[] {
    return [
      {
        id: 'mystery-suspense',
        name: 'Mystery & Suspense',
        description: 'Classic mystery and suspense radio dramas',
        featured: true,
        category: 'Genre',
        curatedBy: 'admin',
        shows: [
          {
            id: '1',
            title: 'The Shadow - Who Knows What Evil Lurks',
            series: 'The Shadow',
            duration: '29:45',
            year: '1940',
            description: 'Lamont Cranston uses his mysterious power to cloud men\'s minds to fight crime.',
            archiveUrl: 'https://archive.org/details/TheShadow-WhoKnowsWhatEvilLurks',
            genre: ['mystery', 'suspense'],
            actors: ['Orson Welles', 'Agnes Moorehead'],
            rating: 4.8,
            playCount: 15420,
            tags: ['classic', 'superhero', 'noir'],
            ageRating: 'PG',
            quality: {
              audioQuality: 4,
              transcriptionAccuracy: 3,
              userReports: 2
            }
          },
          {
            id: '2',
            title: 'Philip Marlowe - The Red Wind',
            series: 'Philip Marlowe',
            duration: '29:12',
            year: '1947',
            description: 'Private detective Philip Marlowe investigates a mysterious case in Los Angeles.',
            archiveUrl: 'https://archive.org/details/PhilipMarlowe-TheRedWind',
            genre: ['mystery', 'detective', 'noir'],
            actors: ['Van Heflin', 'Howard Duff'],
            rating: 4.7,
            playCount: 12350,
            tags: ['detective', 'noir', 'crime'],
            ageRating: 'PG13',
            quality: {
              audioQuality: 4,
              transcriptionAccuracy: 4,
              userReports: 1
            }
          }
        ]
      },
      {
        id: 'science-fiction',
        name: 'Science Fiction',
        description: 'Futuristic tales and space adventures',
        featured: true,
        category: 'Genre',
        curatedBy: 'admin',
        shows: [
          {
            id: '3',
            title: 'X Minus One - The Green Hills of Earth',
            series: 'X Minus One',
            duration: '24:38',
            year: '1955',
            description: 'Sci-fi anthology series featuring stories by renowned science fiction authors.',
            archiveUrl: 'https://archive.org/details/XMinusOne-TheGreenHillsOfEarth',
            genre: ['science fiction', 'anthology'],
            actors: ['Bob Hastings', 'Santos Ortega'],
            rating: 4.9,
            playCount: 18750,
            tags: ['space', 'future', 'anthology'],
            ageRating: 'G',
            quality: {
              audioQuality: 5,
              transcriptionAccuracy: 4,
              userReports: 0
            }
          },
          {
            id: '4',
            title: 'Dimension X - The Martian Chronicles',
            series: 'Dimension X',
            duration: '28:15',
            year: '1950',
            description: 'Classic science fiction radio drama from the golden age of radio.',
            archiveUrl: 'https://archive.org/details/DimensionX-TheMartianChronicles',
            genre: ['science fiction', 'space'],
            actors: ['Joe Julian', 'Joan Alexander'],
            rating: 4.6,
            playCount: 14200,
            tags: ['mars', 'space', 'classic'],
            ageRating: 'G',
            quality: {
              audioQuality: 3,
              transcriptionAccuracy: 3,
              userReports: 3
            }
          }
        ]
      }
    ];
  }

  private getMockSearchResults(query: string): SearchResult {
    const allShows = this.getMockFeaturedChannels().flatMap(channel => channel.shows);
    const filteredShows = allShows.filter(show => 
      show.title.toLowerCase().includes(query.toLowerCase()) ||
      show.series.toLowerCase().includes(query.toLowerCase()) ||
      show.description.toLowerCase().includes(query.toLowerCase())
    );

    return {
      shows: filteredShows,
      totalCount: filteredShows.length,
      facets: {
        genres: { 'mystery': 2, 'science fiction': 2, 'suspense': 1 },
        years: { '1940': 1, '1947': 1, '1950': 1, '1955': 1 },
        series: { 'The Shadow': 1, 'Philip Marlowe': 1, 'X Minus One': 1, 'Dimension X': 1 },
        actors: { 'Orson Welles': 1, 'Van Heflin': 1, 'Bob Hastings': 1 }
      }
    };
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();