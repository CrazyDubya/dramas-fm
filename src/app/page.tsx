'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import { RadioShow } from '@/lib/types';

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
        archiveUrl: "https://archive.org/details/TheShadow-WhoKnowsWhatEvilLurks",
        rating: 4.8,
        genre: ["Mystery", "Drama"],
        actors: ["Orson Welles", "Agnes Moorehead"],
        playCount: 12847,
        tags: ["classic", "superhero", "crime-fighting"],
        quality: {
          audioQuality: 4,
          transcriptionAccuracy: 0.92,
          userReports: 3
        }
      },
      {
        id: "2", 
        title: "Philip Marlowe - The Red Wind",
        series: "Philip Marlowe",
        duration: "29:12",
        year: "1947",
        description: "Private detective Philip Marlowe investigates a mysterious case in Los Angeles.",
        archiveUrl: "https://archive.org/details/PhilipMarlowe-TheRedWind",
        rating: 4.7,
        genre: ["Mystery", "Detective"],
        actors: ["Gerald Mohr", "Jeff Corey"],
        playCount: 9654,
        tags: ["detective", "film-noir", "los-angeles"],
        quality: {
          audioQuality: 5,
          transcriptionAccuracy: 0.95,
          userReports: 1
        }
      },
      {
        id: "5",
        title: "Sam Spade - The Maltese Falcon",
        series: "Adventures of Sam Spade",
        duration: "30:00",
        year: "1946",
        description: "Classic detective story featuring the legendary private investigator Sam Spade.",
        archiveUrl: "https://archive.org/details/SamSpade-MalteseFalcon",
        rating: 4.9,
        genre: ["Mystery", "Detective"],
        actors: ["Howard Duff", "Lurene Tuttle"],
        playCount: 15234,
        tags: ["classic", "detective", "dashiell-hammett"],
        quality: {
          audioQuality: 4,
          transcriptionAccuracy: 0.88,
          userReports: 2
        }
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
        archiveUrl: "https://archive.org/details/XMinusOne-TheGreenHillsOfEarth",
        rating: 4.6,
        genre: ["Science Fiction", "Anthology"],
        actors: ["Various Cast"],
        playCount: 8765,
        tags: ["anthology", "space", "future"],
        quality: {
          audioQuality: 3,
          transcriptionAccuracy: 0.89,
          userReports: 4
        }
      },
      {
        id: "4",
        title: "Dimension X - The Martian Chronicles",
        series: "Dimension X", 
        duration: "28:15",
        year: "1950",
        description: "Classic science fiction radio drama from the golden age of radio.",
        archiveUrl: "https://archive.org/details/DimensionX-TheMartianChronicles",
        rating: 4.8,
        genre: ["Science Fiction", "Drama"],
        actors: ["Various Cast"],
        playCount: 11543,
        tags: ["mars", "ray-bradbury", "space-colonization"],
        quality: {
          audioQuality: 4,
          transcriptionAccuracy: 0.91,
          userReports: 2
        }
      },
      {
        id: "6",
        title: "Buck Rogers in the 25th Century",
        series: "Buck Rogers",
        duration: "15:00",
        year: "1939",
        description: "Adventures of Buck Rogers, the first sci-fi hero of the airwaves.",
        archiveUrl: "https://archive.org/details/BuckRogers25thCentury",
        rating: 4.4,
        genre: ["Science Fiction", "Adventure"],
        actors: ["Matt Crowley", "Adele Ronson"],
        playCount: 6789,
        tags: ["adventure", "space-hero", "vintage"],
        quality: {
          audioQuality: 2,
          transcriptionAccuracy: 0.75,
          userReports: 8
        }
      }
    ]
  },
  {
    name: "Comedy & Variety",
    shows: [
      {
        id: "7",
        title: "The Jack Benny Program",
        series: "Jack Benny Show",
        duration: "30:00",
        year: "1945",
        description: "Classic comedy radio show featuring the legendary Jack Benny and his cast.",
        archiveUrl: "https://archive.org/details/JackBennyProgram1945",
        rating: 4.7,
        genre: ["Comedy", "Variety"],
        actors: ["Jack Benny", "Mary Livingstone", "Rochester"],
        playCount: 13456,
        tags: ["classic-comedy", "variety", "entertainment"],
        quality: {
          audioQuality: 4,
          transcriptionAccuracy: 0.93,
          userReports: 1
        }
      },
      {
        id: "8",
        title: "Amos 'n' Andy",
        series: "Amos 'n' Andy",
        duration: "15:00",
        year: "1943",
        description: "Popular comedy series from the golden age of radio.",
        archiveUrl: "https://archive.org/details/AmosAndAndy1943",
        rating: 4.3,
        genre: ["Comedy"],
        actors: ["Freeman Gosden", "Charles Correll"],
        playCount: 7890,
        tags: ["classic-comedy", "series"],
        quality: {
          audioQuality: 3,
          transcriptionAccuracy: 0.87,
          userReports: 5
        }
      }
    ]
  }
];

// Recent activity - shows some activity on the platform
const recentlyPlayed = [
  featuredChannels[0].shows[0], // The Shadow
  featuredChannels[1].shows[1], // Dimension X
  featuredChannels[2].shows[0], // Jack Benny
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<RadioShow | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      // Simulate loading for better UX
      setTimeout(() => {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      }, 500);
    }
  };

  const playShow = (show: RadioShow) => {
    setCurrentlyPlaying(show);
  };

  const closePlayer = () => {
    setCurrentlyPlaying(null);
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
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 m-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
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
                  <div key={show.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-white mb-1 hover:text-purple-300 transition-colors">{show.title}</h5>
                        <p className="text-purple-300 text-sm mb-2">{show.series} • {show.year}</p>
                        <p className="text-purple-200 text-sm mb-3 line-clamp-2">{show.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-purple-400">
                          <span>Duration: {show.duration}</span>
                          <span>•</span>
                          <span>{show.playCount.toLocaleString()} plays</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => playShow(show)}
                          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          <PlayIcon className="h-4 w-4" />
                          <span>{currentlyPlaying?.id === show.id ? 'Playing' : 'Play'}</span>
                        </button>
                        
                        <button
                          onClick={() => toggleFavorite(show.id)}
                          className="p-2 rounded-lg hover:bg-purple-600/20 transition-all duration-200 hover:scale-110 active:scale-95"
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
                          <StarSolidIcon 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(show.rating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                          />
                        ))}
                        <span className="text-sm text-purple-300 ml-2">{show.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Played Section */}
      <section className="py-16 px-4 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center">Recently Popular</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyPlayed.map((show) => (
              <div key={show.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                <h5 className="text-white font-semibold mb-2">{show.title}</h5>
                <p className="text-purple-300 text-sm mb-3">{show.series}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(show.rating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                    <span className="text-xs text-purple-300 ml-1">{show.rating}</span>
                  </div>
                  <button
                    onClick={() => playShow(show)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <PlayIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors">
                <PlayIcon className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Curated Channels</h4>
              <p className="text-purple-200">Hand-picked collections of radio dramas organized by genre, era, and theme.</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors">
                <MagnifyingGlassIcon className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Advanced Search</h4>
              <p className="text-purple-200">Powerful search capabilities to find exactly what you&apos;re looking for in our vast archive.</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors">
                <HeartIcon className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Personal Playlists</h4>
              <p className="text-purple-200">Create and manage your own playlists with AI-powered recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      {currentlyPlaying && (
        <AudioPlayer 
          show={currentlyPlaying} 
          onClose={closePlayer}
        />
      )}

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
