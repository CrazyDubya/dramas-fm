'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { SearchResult, SearchFilters } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    const initialQuery = searchParams?.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, searchFilters: SearchFilters = {}) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: '1',
        limit: '20'
      });

      // Add filters to params
      if (searchFilters.genre?.length) {
        params.append('genre', searchFilters.genre.join(','));
      }
      if (searchFilters.year?.min) {
        params.append('year_min', searchFilters.year.min.toString());
      }
      if (searchFilters.year?.max) {
        params.append('year_max', searchFilters.year.max.toString());
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        console.error('Search failed:', data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, filters);
    
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url.toString());
  };

  const toggleFavorite = (showId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(showId)) {
      newFavorites.delete(showId);
    } else {
      newFavorites.add(showId);
    }
    setFavorites(newFavorites);
  };

  const playShow = (showId: string) => {
    setCurrentlyPlaying(showId);
    console.log(`Playing show ${showId}`);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dramas.FM
              </Link>
              <span className="ml-2 text-sm text-purple-300">Radio Drama Archive</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-purple-200 hover:text-white transition-colors">Home</Link>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Browse</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Playlists</a>
              <Link href="/search" className="text-white font-semibold">Search</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-purple-200 hover:text-white transition-colors">Sign In</button>
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/30">
                <MagnifyingGlassIcon className="h-6 w-6 text-purple-300 ml-4" />
                <input
                  type="text"
                  placeholder="Search for radio dramas, series, or actors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder-purple-300 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-2 m-2 rounded-lg transition-colors"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 px-4 py-2 rounded-lg transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Genre</label>
                  <select
                    value={filters.genre?.[0] || ''}
                    onChange={(e) => handleFilterChange({
                      ...filters,
                      genre: e.target.value ? [e.target.value] : undefined
                    })}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="">All Genres</option>
                    <option value="mystery">Mystery</option>
                    <option value="science fiction">Science Fiction</option>
                    <option value="suspense">Suspense</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Year Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="From"
                      value={filters.year?.min || ''}
                      onChange={(e) => handleFilterChange({
                        ...filters,
                        year: { ...filters.year, min: e.target.value ? parseInt(e.target.value) : undefined }
                      })}
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                    <input
                      type="number"
                      placeholder="To"
                      value={filters.year?.max || ''}
                      onChange={(e) => handleFilterChange({
                        ...filters,
                        year: { ...filters.year, max: e.target.value ? parseInt(e.target.value) : undefined }
                      })}
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">Rating</label>
                  <select
                    value={filters.rating?.min || ''}
                    onChange={(e) => handleFilterChange({
                      ...filters,
                      rating: e.target.value ? { min: parseFloat(e.target.value) } : undefined
                    })}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => {
                    setFilters({});
                    performSearch(query, {});
                  }}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {results && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Search Results for &quot;{query}&quot; ({results.totalCount} shows)
                </h2>
              </div>

              {results.shows.length === 0 ? (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">No shows found</h3>
                  <p className="text-purple-400">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.shows.map((show) => (
                    <div key={show.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-1">{show.title}</h3>
                        <p className="text-purple-300 text-sm mb-2">{show.series} • {show.year}</p>
                        <p className="text-purple-200 text-sm mb-3 line-clamp-2">{show.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-400">Duration: {show.duration}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-purple-300">{show.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => playShow(show.id)}
                            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            <PlayIcon className="h-4 w-4" />
                            <span>{currentlyPlaying === show.id ? 'Playing' : 'Play'}</span>
                          </button>
                          
                          <button
                            onClick={() => toggleFavorite(show.id)}
                            className="p-2 rounded-lg hover:bg-purple-600/20 transition-colors 
                            aria-label="Add to favorites
                            aria-pressed={favorites.has(show.id)
                            {favorites.has(show.id) ? (
                              <HeartSolidIcon className="h-5 w-5 text-red-400" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-purple-300" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {show.genre.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Facets/Categories */}
          {results && results.facets && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h4 className="font-semibold mb-3 text-purple-300">Popular Genres</h4>
                <div className="space-y-2">
                  {Object.entries(results.facets.genres).map(([genre, count]) => (
                    <div key={genre} className="flex justify-between text-sm">
                      <span className="text-purple-200">{genre}</span>
                      <span className="text-purple-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h4 className="font-semibold mb-3 text-purple-300">Years</h4>
                <div className="space-y-2">
                  {Object.entries(results.facets.years).map(([year, count]) => (
                    <div key={year} className="flex justify-between text-sm">
                      <span className="text-purple-200">{year}</span>
                      <span className="text-purple-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h4 className="font-semibold mb-3 text-purple-300">Popular Series</h4>
                <div className="space-y-2">
                  {Object.entries(results.facets.series).map(([series, count]) => (
                    <div key={series} className="flex justify-between text-sm">
                      <span className="text-purple-200">{series}</span>
                      <span className="text-purple-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h4 className="font-semibold mb-3 text-purple-300">Top Actors</h4>
                <div className="space-y-2">
                  {Object.entries(results.facets.actors).map(([actor, count]) => (
                    <div key={actor} className="flex justify-between text-sm">
                      <span className="text-purple-200">{actor}</span>
                      <span className="text-purple-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-300">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}