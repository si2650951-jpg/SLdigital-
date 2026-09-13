import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Hash,
  Users,
  Compass,
  Filter,
  Play,
  Flame,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, INITIAL_CREATORS } from '../data/seedData';
import { FeedCategory } from '../types';

export const SearchExploreView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    videos,
    setCurrentVideoIndex,
    setCurrentScreen,
    setViewingProfile
  } = useApp();

  const [filterDuration, setFilterDuration] = useState<'all' | 'short' | 'long'>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'views' | 'latest'>('trending');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Vedic Math',
    'Quantum Physics',
    'ChatGPT',
    'UPSC Exam'
  ]);

  const TRENDING_TOPICS = [
    { title: 'Generative AI & LLMs', videos: '1.2k shorts', tag: '#ArtificialIntelligence' },
    { title: 'Spoken English Fluency', videos: '840 shorts', tag: '#EnglishSpeaking' },
    { title: 'Mental Math Tricks', videos: '620 shorts', tag: '#Mathematics' },
    { title: 'Space Exploration 2026', videos: '450 shorts', tag: '#Science' }
  ];

  const POPULAR_HASHTAGS = [
    '#StudySmart',
    '#GK2026',
    '#TechNews',
    '#CareerAdvice',
    '#PhysicsHacks',
    '#CodingBasics',
    '#DailyMotivation'
  ];

  // Filtering videos
  const searchResults = videos.filter((video) => {
    // category filter
    if (activeCategory !== 'All' && video.category !== activeCategory) {
      return false;
    }
    // duration filter
    if (filterDuration === 'short' && video.duration > 30) return false;
    if (filterDuration === 'long' && video.duration <= 30) return false;

    // text search
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(q) ||
      video.description.toLowerCase().includes(q) ||
      video.creator.name.toLowerCase().includes(q) ||
      video.creator.username.toLowerCase().includes(q) ||
      video.hashtags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Sort
  if (sortBy === 'views') {
    searchResults.sort((a, b) => b.viewsCount - a.viewsCount);
  } else if (sortBy === 'latest') {
    searchResults.sort((a, b) => b.id.localeCompare(a.id));
  } else {
    searchResults.sort((a, b) => b.likesCount - a.likesCount);
  }

  const handleSelectVideo = (vidId: string) => {
    const idx = videos.findIndex((v) => v.id === vidId);
    if (idx >= 0) {
      setCurrentVideoIndex(idx);
      setCurrentScreen('home');
    }
  };

  const handleSearchSubmit = (term: string) => {
    setSearchQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-24 pt-2 px-3 space-y-4 bg-black min-h-screen text-white select-none">
      {/* Search Input Bar (Instagram style) */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              handleSearchSubmit(searchQuery.trim());
            }
          }}
          placeholder="Search creators, topics, hashtags..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and Category Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary filters: Sort and Duration */}
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <div className="flex items-center gap-2">
            <span>Duration:</span>
            {(['all', 'short', 'long'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setFilterDuration(d)}
                className={`px-2 py-0.5 rounded-md capitalize font-semibold transition-colors ${
                  filterDuration === d ? 'bg-zinc-800 text-white' : 'hover:text-zinc-200'
                }`}
              >
                {d === 'short' ? '≤30s' : d === 'long' ? '>30s' : 'Any'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-0.5 text-zinc-300 focus:outline-none"
            >
              <option value="trending">🔥 Most Liked</option>
              <option value="views">👀 Most Viewed</option>
              <option value="latest">✨ Latest Upload</option>
            </select>
          </div>
        </div>
      </div>

      {/* If No search query, show Explore Discovery Modules */}
      {!searchQuery && (
        <div className="space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <button
                  onClick={() => setRecentSearches([])}
                  className="hover:text-zinc-200 text-[11px]"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearchSubmit(term)}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Top Verified Educators */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-500" />
                <span>Top Educational Creators</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INITIAL_CREATORS.map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => setViewingProfile(creator)}
                  className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex flex-col items-center text-center transition-all group shadow-md"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-700 group-hover:ring-rose-500 transition-all mb-2"
                  />
                  <h4 className="text-xs font-bold text-white truncate w-full">
                    {creator.name}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    @{creator.username}
                  </span>
                  <span className="mt-2 text-[10px] bg-rose-500/15 text-rose-300 font-bold px-2 py-0.5 rounded-full">
                    {creator.followersCount} followers
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics & Hashtags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trending Curricula */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Trending Topics</span>
              </h3>
              <div className="space-y-2">
                {TRENDING_TOPICS.map((topic) => (
                  <div
                    key={topic.title}
                    onClick={() => handleSearchSubmit(topic.title)}
                    className="p-2 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{topic.title}</h4>
                      <span className="text-[10px] text-zinc-500">{topic.tag}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{topic.videos}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Hashtags */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Hash className="w-4 h-4" />
                <span>Popular Hashtags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearchSubmit(tag)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">
            {searchQuery
              ? `Results for "${searchQuery}" (${searchResults.length})`
              : `Explore Recommended Reels (${searchResults.length})`}
          </h3>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800">
            <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No results found</p>
            <p className="text-xs text-zinc-400 mt-1">
              Try searching with another keyword, educator name, or change the category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {searchResults.map((video) => (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video.id)}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer border border-zinc-800 hover:border-rose-500 transition-all shadow-md"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                  <span className="text-white text-xs font-bold line-clamp-2 leading-tight">
                    {video.title}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300 font-mono mt-1">
                    <span>@{video.creator.username}</span>
                    <span className="flex items-center gap-0.5">
                      <Play className="w-3 h-3 fill-white" />
                      {video.viewsCount >= 1000 ? `${(video.viewsCount / 1000).toFixed(0)}k` : video.viewsCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
