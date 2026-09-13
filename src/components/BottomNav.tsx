import React from 'react';
import {
  Home,
  Search,
  PlusSquare,
  Clapperboard,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, setCreateModalOpen } = useApp();
  const { currentUser } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-t border-zinc-900 h-[50px] px-4 flex items-center justify-around max-w-md mx-auto select-none">
      {/* 1. Home */}
      <button
        id="nav-tab-home"
        onClick={() => setCurrentScreen('home')}
        className="flex items-center justify-center p-2 text-white active:scale-90 transition-transform"
        title="Home Feed"
      >
        <Home
          className={`w-6 h-6 transition-all ${
            currentScreen === 'home'
              ? 'stroke-[2.5] text-white fill-white'
              : 'stroke-[1.8] text-zinc-300'
          }`}
        />
      </button>

      {/* 2. Search / Explore */}
      <button
        id="nav-tab-explore"
        onClick={() => setCurrentScreen('explore')}
        className="flex items-center justify-center p-2 text-white active:scale-90 transition-transform"
        title="Explore"
      >
        <Search
          className={`w-6 h-6 transition-all ${
            currentScreen === 'explore'
              ? 'stroke-[3] text-white'
              : 'stroke-[1.8] text-zinc-300'
          }`}
        />
      </button>

      {/* 3. Create (Instagram PlusSquare) */}
      <button
        id="nav-tab-create"
        onClick={() => setCreateModalOpen(true)}
        className="flex items-center justify-center p-2 text-white active:scale-90 transition-transform"
        title="Create Post / Reel"
      >
        <PlusSquare className="w-6 h-6 stroke-[1.8] text-zinc-300 hover:text-white" />
      </button>

      {/* 4. Reels */}
      <button
        id="nav-tab-shorts"
        onClick={() => setCurrentScreen('shorts')}
        className="flex items-center justify-center p-2 text-white active:scale-90 transition-transform"
        title="Reels"
      >
        <Clapperboard
          className={`w-6 h-6 transition-all ${
            currentScreen === 'shorts'
              ? 'stroke-[2.5] text-white fill-white/20'
              : 'stroke-[1.8] text-zinc-300'
          }`}
        />
      </button>

      {/* 5. Profile */}
      <button
        id="nav-tab-profile"
        onClick={() => setCurrentScreen('profile')}
        className="flex items-center justify-center p-2 active:scale-90 transition-transform"
        title="Profile"
      >
        <div
          className={`w-6 h-6 rounded-full overflow-hidden transition-all ${
            currentScreen === 'profile'
              ? 'ring-2 ring-white scale-105'
              : 'ring-1 ring-zinc-700'
          }`}
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <User className="w-4 h-4 text-zinc-300" />
            </div>
          )}
        </div>
      </button>
    </nav>
  );
};
