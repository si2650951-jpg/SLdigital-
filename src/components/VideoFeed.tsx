import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCard } from './VideoCard';
import { StoriesTray } from './StoriesTray';
import { StoryViewerModal } from './StoryViewerModal';
import { CATEGORIES, INITIAL_STORIES } from '../data/seedData';
import { ChevronUp, ChevronDown, Compass, RefreshCw } from 'lucide-react';

export const VideoFeed: React.FC = () => {
  const {
    filteredVideos,
    currentVideoIndex,
    setCurrentVideoIndex,
    activeCategory,
    setActiveCategory,
    setQuizHubOpen
  } = useApp();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [viewedStoryIds, setViewedStoryIds] = useState<Set<string>>(new Set());

  // Navigation handlers
  const handleNext = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  // Touch swipe support for mobile
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    const SWIPE_THRESHOLD = 50;

    if (diff > SWIPE_THRESHOLD) {
      // Swiped UP -> Next video
      handleNext();
    } else if (diff < -SWIPE_THRESHOLD) {
      // Swiped DOWN -> Prev video
      handlePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, filteredVideos.length]);

  const markStoryViewed = (storyId: string) => {
    setViewedStoryIds((prev) => new Set(prev).add(storyId));
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none pb-14 sm:pb-16 bg-black min-h-screen">
      {/* 1. Instagram Stories Tray */}
      <StoriesTray
        stories={INITIAL_STORIES}
        viewedStoryIds={viewedStoryIds}
        onSelectStory={(idx) => setSelectedStoryIndex(idx)}
      />

      {/* 2. Educational Topic Categories (Instagram story highlight pill style) */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-3 flex items-center gap-2 border-b border-zinc-900 bg-black/60 backdrop-blur-md">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentVideoIndex(0);
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Main Reels Feed Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full relative px-0 sm:px-1 flex justify-center items-center mt-1"
      >
        {filteredVideos.length > 0 ? (
          <div className="w-full relative">
            <VideoCard
              video={filteredVideos[currentVideoIndex] || filteredVideos[0]}
              isActive={true}
            />

            {/* Desktop Side Arrows */}
            <div className="hidden md:flex flex-col gap-3 absolute -right-14 top-1/2 -translate-y-1/2 z-20">
              <button
                onClick={handlePrev}
                disabled={currentVideoIndex === 0}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl transition-all"
                title="Previous Reel (Up Arrow)"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentVideoIndex === filteredVideos.length - 1}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl transition-all"
                title="Next Reel (Down Arrow)"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-20 px-6 text-center bg-zinc-950 rounded-2xl border border-zinc-900 my-8">
            <Compass className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-spin" />
            <h3 className="text-base font-bold text-white mb-1">No videos found</h3>
            <p className="text-xs text-zinc-400 mb-4 max-w-xs mx-auto">
              No educational shorts match this topic right now. Reset to explore all subjects!
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setActiveCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-[#0095F6] text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Feed
              </button>
              <button
                onClick={() => setQuizHubOpen(true)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Solve Quizzes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={INITIAL_STORIES}
          initialIndex={selectedStoryIndex}
          isOpen={selectedStoryIndex !== null}
          onClose={() => setSelectedStoryIndex(null)}
          onStoryViewed={markStoryViewed}
        />
      )}
    </div>
  );
};
