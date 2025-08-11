'use client';

import { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { MagnifyingGlassIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Sample data - this will be replaced with actual database calls
const featuredChannels = [
  {
    name: "Mystery & Suspense",
    shows: [
      {
        id: "1",
        title: "The Shadow - Who Knows What Evil Lurks",
        series: "The Shadow",
        duration: "29:45",
        year: "1940",
        description: "Lamont Cranston uses his mysterious power to cloud mens minds to fight crime.",
        archiveUrl: "https://archive.org/details/TheShadow-WhoKnowsWhatEvilLurks"
      },
      {
        id: "2", 
        title: "Philip Marlowe - The Red Wind",
        series: "Philip Marlowe",
        duration: "29:12",
        year: "1947",
        description: "Private detective Philip Marlowe investigates a mysterious case in Los Angeles.",
        archiveUrl: "https://archive.org/details/PhilipMarlowe-TheRedWind"
      }
    ]
  },
  {
    name: "Science Fiction",
    shows: [
      {
        id: "3",
        title: "X Minus One - The Green Hills of Earth",
        series: "X Minus One",
        duration: "24:38",
        year: "1955",
        description: "Sci-fi anthology series featuring stories by renowned science fiction authors.",
        archiveUrl: "https://archive.org/details/XMinusOne-TheGreenHillsOfEarth"
      },
      {
        id: "4",
        title: "Dimension X - The Martian Chronicles",
        series: "Dimension X", 
        duration: "28:15",
        year: "1950",
        description: "Classic science fiction radio drama from the golden age of radio.",
        archiveUrl: "https://archive.org/details/DimensionX-TheMartianChronicles"
      }
    ]
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { playShow, currentShow } = usePlayer();

  const toggleFavorite = (showId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(showId)) {
      newFavorites.delete(showId);
    } else {
      newFavorites.add(showId);
    }
    setFavorites(newFavorites);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
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
              <Link href="/" className="text-white font-semibold">Home</Link>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Browse</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Playlists</a>
              <Link href="/search" className="text-purple-200 hover:text-white transition-colors">Search</Link>
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

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Dramas.FM
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Discover thousands of classic radio dramas from the golden age of broadcasting. 
            Stream directly from Archive.org and create your own curated playlists.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-purple-500/30">
              <MagnifyingGlassIcon className="h-6 w-6 text-purple-300 ml-4" />
              <input
                type="text"
                placeholder="Search for radio dramas, series, or actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-4 text-white placeholder-purple-300 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 m-2 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Channels */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">Featured Channels</h3>
          
          {featuredChannels.map((channel, channelIndex) => (
            <div key={channelIndex} className="mb-12">
              <h4 className="text-2xl font-semibold mb-6 text-purple-300">{channel.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {channel.shows.map((show) => (
                  <div key={show.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-white mb-1">{show.title}</h5>
                        <p className="text-purple-300 text-sm mb-2">{show.series} • {show.year}</p>
                        <p className="text-purple-200 text-sm mb-3 line-clamp-2">{show.description}</p>
                        <p className="text-purple-400 text-sm">Duration: {show.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => playShow(show)}
                          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          <PlayIcon className="h-4 w-4" />
                          <span>{currentShow?.id === show.id ? 'Playing' : 'Play'}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleFavorite(show.id)}
                          className="p-2 rounded-lg hover:bg-purple-600/20 transition-colors"
                        >
                          {favorites.has(show.id) ? (
                            <HeartSolidIcon className="h-5 w-5 text-red-400" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-purple-300" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                        ))}
                        <span className="text-sm text-purple-300 ml-2">4.8</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <PlayIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Curated Channels</h4>
              <p className="text-purple-200">Hand-picked collections of radio dramas organized by genre, era, and theme.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Advanced Search</h4>
              <p className="text-purple-200">Powerful search capabilities to find exactly what you&apos;re looking for in our vast archive.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Personal Playlists</h4>
              <p className="text-purple-200">Create and manage your own playlists with AI-powered recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dramas.FM
          </h3>
          <p className="text-purple-300 mb-6">
            Preserving and sharing the golden age of radio drama
          </p>
          <div className="flex justify-center space-x-6 text-sm text-purple-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div className="mt-6 text-sm text-purple-500">
            Content streamed from Archive.org • Built with ❤️ for radio drama enthusiasts
          </div>
        </div>
      </footer>
    </div>
  );
}
