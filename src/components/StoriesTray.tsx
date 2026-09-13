import React from 'react';
import { Plus, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { EduStory } from '../types';

interface StoriesTrayProps {
  stories: EduStory[];
  onSelectStory: (index: number) => void;
  viewedStoryIds: Set<string>;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  onSelectStory,
  viewedStoryIds
}) => {
  const { currentUser } = useAuth();
  const { setLiveStreamOpen, setCreateModalOpen } = useApp();

  return (
    <div className="w-full bg-black border-b border-zinc-900 py-2.5 px-3 overflow-x-auto no-scrollbar flex items-center gap-3.5 select-none">
      {/* 1. "Your Story" item */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
        <div
          onClick={() => setCreateModalOpen(true)}
          className="relative w-[66px] h-[66px] flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full p-[2px] border border-zinc-800 flex items-center justify-center">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover group-hover:scale-95 transition-transform"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0095F6] border-2 border-black rounded-full flex items-center justify-center text-white shadow-sm">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
        <span className="text-[11px] font-normal text-zinc-300 w-16 text-center truncate">
          Your story
        </span>
      </div>

      {/* 2. Creator Stories with Instagram Gradient Rings */}
      {stories.map((story, index) => {
        const isViewed = viewedStoryIds.has(story.id);
        const isLive = story.isLive;

        return (
          <div
            key={story.id}
            onClick={() => {
              if (isLive) {
                setLiveStreamOpen(true);
              } else {
                onSelectStory(index);
              }
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="relative w-[66px] h-[66px] flex items-center justify-center">
              {/* Story Gradient Ring */}
              <div
                className={`w-full h-full rounded-full p-[2.5px] transition-all group-active:scale-95 ${
                  isLive
                    ? 'bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 animate-pulse'
                    : isViewed
                    ? 'bg-zinc-800'
                    : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]'
                }`}
              >
                <div className="w-full h-full rounded-full bg-black p-[2px]">
                  <img
                    src={story.creator.avatar}
                    alt={story.creator.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* LIVE Badge */}
              {isLive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-0.5 border border-black">
                  <Radio className="w-2.5 h-2.5" />
                  <span>LIVE</span>
                </div>
              )}
            </div>

            {/* Creator Username */}
            <span className="text-[11px] font-normal text-zinc-300 w-16 text-center truncate">
              {story.creator.username.replace('_', ' ')}
            </span>
          </div>
        );
      })}
    </div>
  );
};
