import React, { useState } from 'react';
import {
  Heart,
  Send,
  Radio,
  ChevronDown,
  HelpCircle,
  Trophy,
  ShieldCheck,
  UserCheck,
  Sparkles,
  BarChart3,
  Bookmark,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const {
    unreadNotificationCount,
    setNotificationDrawerOpen,
    setLiveStreamOpen,
    setQuizHubOpen,
    setLeaderboardModalOpen,
    setAdminPanelOpen,
    setCreatorDashboardOpen,
    setCurrentScreen,
    activeFeedTab,
    setActiveFeedTab,
    conversations
  } = useApp();
  const { currentUser, switchDemoProfile } = useAuth();
  const [feedDropdownOpen, setFeedDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

  const totalUnreadMessages = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-900 px-3 sm:px-4 h-12 flex items-center justify-between transition-all select-none">
      {/* Instagram-Style Logo & Feed Selector Dropdown */}
      <div className="relative flex items-center">
        <button
          onClick={() => setFeedDropdownOpen(!feedDropdownOpen)}
          className="flex items-center gap-1 group py-1 active:opacity-70 transition-opacity"
        >
          <span className="font-['Outfit'] font-black text-xl tracking-tight text-white italic drop-shadow-sm flex items-center gap-1">
            Edu<span className="text-[#FF3040] not-italic">Shorts</span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform ${
              feedDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Instagram Feed Switcher Popup (Following / Favorites / Trending) */}
        {feedDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setFeedDropdownOpen(false)}
            />
            <div className="absolute left-0 top-full mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setActiveFeedTab('for_you');
                  setCurrentScreen('home');
                  setFeedDropdownOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                  activeFeedTab === 'for_you'
                    ? 'text-[#FF3040] bg-zinc-900/60'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>For You Feed</span>
                {activeFeedTab === 'for_you' && <span className="text-xs">✓</span>}
              </button>

              <button
                onClick={() => {
                  setActiveFeedTab('following');
                  setCurrentScreen('home');
                  setFeedDropdownOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                  activeFeedTab === 'following'
                    ? 'text-[#FF3040] bg-zinc-900/60'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>Following</span>
                {activeFeedTab === 'following' && <span className="text-xs">✓</span>}
              </button>

              <button
                onClick={() => {
                  setActiveFeedTab('trending');
                  setCurrentScreen('home');
                  setFeedDropdownOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                  activeFeedTab === 'trending'
                    ? 'text-[#FF3040] bg-zinc-900/60'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>Trending 🔥</span>
                {activeFeedTab === 'trending' && <span className="text-xs">✓</span>}
              </button>

              <div className="border-t border-zinc-800/80 my-1 pt-1">
                <button
                  onClick={() => {
                    setCurrentScreen('communities');
                    setFeedDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Study Circles & Hub</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Side Icons (Instagram Heart / Notifications & Direct Message Paper Plane) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Live Learning badge */}
        <button
          onClick={() => setLiveStreamOpen(true)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/15 border border-red-600/30 text-red-400 text-[11px] font-bold hover:bg-red-600/25 active:scale-95 transition-all"
          title="Watch Educator Live Stream"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <Radio className="w-3 h-3" />
          <span className="hidden xs:inline text-[10px]">LIVE</span>
        </button>

        {/* Quizzes Quick Pill */}
        <button
          onClick={() => setQuizHubOpen(true)}
          className="p-2 rounded-full hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
          title="Quiz Challenges & Points"
        >
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </button>

        {/* Notifications (Instagram Heart Icon) */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="relative p-2 rounded-full hover:bg-zinc-900 active:scale-90 text-white transition-all"
          title="Activity / Notifications"
        >
          <Heart className="w-6 h-6 stroke-[1.8]" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3040] rounded-full ring-2 ring-black" />
          )}
        </button>

        {/* Direct Messages (Instagram Paper Plane / Messenger Icon) */}
        <button
          onClick={() => setCurrentScreen('messages')}
          className="relative p-2 rounded-full hover:bg-zinc-900 active:scale-90 text-white transition-all"
          title="Direct Messages"
        >
          <Send className="w-6 h-6 stroke-[1.8] -rotate-12 translate-y-0.5" />
          {totalUnreadMessages > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[15px] h-3.5 bg-[#FF3040] text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-black">
              {totalUnreadMessages}
            </span>
          )}
        </button>

        {/* Role & Studio Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
            className="w-7 h-7 rounded-full overflow-hidden border border-zinc-700 hover:border-zinc-400 ml-1 transition-all"
            title="Account & Tools"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </button>

          {menuDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-zinc-800 text-[11px] text-zinc-400 font-semibold flex items-center justify-between">
                  <span>Logged in as:</span>
                  <span className="capitalize text-white font-bold">{currentUser.role || 'Student'}</span>
                </div>

                <div className="py-1 border-b border-zinc-800">
                  <button
                    onClick={() => {
                      switchDemoProfile('student');
                      setMenuDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 flex items-center justify-between"
                  >
                    <span>🎓 Student Mode</span>
                    {currentUser.role === 'student' && <span className="text-[#FF3040] font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoProfile('creator');
                      setMenuDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 flex items-center justify-between"
                  >
                    <span>⭐ Creator Mode</span>
                    {currentUser.role === 'creator' && <span className="text-[#FF3040] font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoProfile('admin');
                      setMenuDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 flex items-center justify-between"
                  >
                    <span>🛡️ Platform Admin</span>
                    {currentUser.role === 'admin' && <span className="text-[#FF3040] font-bold">Active</span>}
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setCreatorDashboardOpen(true);
                      setMenuDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-amber-300 hover:bg-zinc-900 flex items-center gap-2"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Creator Insights & Revenue</span>
                  </button>
                  <button
                    onClick={() => {
                      setLeaderboardModalOpen(true);
                      setMenuDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-indigo-300 hover:bg-zinc-900 flex items-center gap-2"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Points Leaderboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setAdminPanelOpen(true);
                      setMenuDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-rose-300 hover:bg-zinc-900 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Moderation & Safety</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
