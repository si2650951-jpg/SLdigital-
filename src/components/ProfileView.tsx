import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  Heart,
  Award,
  Share2,
  Settings,
  Edit3,
  MessageCircle,
  Trophy,
  Check,
  Plus,
  Play,
  Clapperboard,
  Sparkles,
  Link as LinkIcon,
  Menu,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FeedCategory } from '../types';

export const ProfileView: React.FC = () => {
  const {
    viewingProfile,
    setViewingProfile,
    videos,
    savedVideoIds,
    likedVideoIds,
    followingIds,
    toggleFollowUser,
    setCurrentVideoIndex,
    setCurrentScreen,
    setActiveConversationId,
    setCreatorDashboardOpen
  } = useApp();

  const { currentUser, updateProfile } = useAuth();
  const profileUser = viewingProfile || currentUser;
  const isSelf = profileUser.id === currentUser.id;
  const isFollowing = followingIds.has(profileUser.id);

  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'saved'>('grid');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profileUser.bio);
  const [copiedLink, setCopiedLink] = useState(false);

  // User videos
  const userVideos = videos.filter((v) => v.creatorId === profileUser.id);
  const savedVideos = videos.filter((v) => savedVideoIds.has(v.id));

  // Mock Instagram Story Highlights
  const HIGHLIGHTS = [
    { title: 'Top Tips', emoji: '💡' },
    { title: 'Formulas', emoji: '📐' },
    { title: 'NEET/JEE', emoji: '🎯' },
    { title: 'Q&A Live', emoji: '🎙️' },
    { title: 'Notes', emoji: '📝' }
  ];

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}#@${profileUser.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveBio = () => {
    updateProfile({ bio: bioInput });
    setIsEditingBio(false);
  };

  const playVideoFromGrid = (vidId: string) => {
    const idx = videos.findIndex((v) => v.id === vidId);
    if (idx >= 0) {
      setCurrentVideoIndex(idx);
      setCurrentScreen('home');
    }
  };

  const displayedVideos = activeTab === 'saved' ? savedVideos : userVideos;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-black text-white pb-20 select-none">
      {/* 1. Instagram Profile Top Header */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-900 px-4 h-11 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-bold text-sm text-white tracking-tight">
            {profileUser.username}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </div>

        <div className="flex items-center gap-3">
          {isSelf && (
            <button
              onClick={() => setCreatorDashboardOpen(true)}
              className="p-1 text-white hover:text-zinc-300"
              title="Creator Studio"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
            </button>
          )}
          <button
            onClick={handleShareProfile}
            className="p-1 text-white hover:text-zinc-300"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Main Profile Info Section */}
      <div className="px-4 pt-3 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          {/* Avatar with Instagram Sunset Gradient Ring */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-full h-full rounded-full object-cover border-2 border-black"
              />
            </div>
            {isSelf && (
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0095F6] border-2 border-black flex items-center justify-center text-white">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          {/* 3 Stats: Posts, Followers, Following */}
          <div className="flex items-center gap-6 text-center pr-2">
            <div>
              <div className="font-bold text-base text-white">
                {userVideos.length || 6}
              </div>
              <div className="text-xs text-zinc-400">Posts</div>
            </div>

            <div>
              <div className="font-bold text-base text-white">
                {profileUser.followersCount >= 1000
                  ? `${(profileUser.followersCount / 1000).toFixed(1)}k`
                  : profileUser.followersCount}
              </div>
              <div className="text-xs text-zinc-400">Followers</div>
            </div>

            <div>
              <div className="font-bold text-base text-white">
                {profileUser.followingCount || 142}
              </div>
              <div className="text-xs text-zinc-400">Following</div>
            </div>
          </div>
        </div>

        {/* Name & Bio Description */}
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-sm text-white">{profileUser.name}</h1>
            {profileUser.isVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#0095F6] text-white flex items-center justify-center text-[8px] font-black">
                ✓
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 font-medium">
            {profileUser.role === 'creator' ? 'Education & Science Creator' : 'Student & Lifelong Learner'}
          </p>

          {isEditingBio ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBio}
                  className="px-3 py-1 bg-white text-black text-xs font-bold rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
              {profileUser.bio}
            </p>
          )}

          {/* Clickable URL */}
          <div className="flex items-center gap-1.5 text-xs text-[#0095F6] pt-0.5">
            <LinkIcon className="w-3 h-3" />
            <span className="font-semibold hover:underline">
              edushorts.app/{profileUser.username}
            </span>
          </div>
        </div>

        {/* Instagram Profile Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {isSelf ? (
            <>
              <button
                onClick={() => setIsEditingBio(true)}
                className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-white text-center transition-colors"
              >
                Edit profile
              </button>
              <button
                onClick={handleShareProfile}
                className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-white text-center transition-colors"
              >
                {copiedLink ? 'Link copied! ✓' : 'Share profile'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFollowUser(profileUser.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-zinc-900 border border-zinc-800 text-white'
                    : 'bg-[#0095F6] hover:bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={() => {
                  setActiveConversationId(profileUser.id);
                  setCurrentScreen('messages');
                }}
                className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-white transition-colors"
              >
                Message
              </button>
              <button
                onClick={() => setViewingProfile(null)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400"
              >
                Back
              </button>
            </>
          )}
        </div>

        {/* 3. Instagram Story Highlights Circles */}
        <div className="pt-2 border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            {HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                <div className="w-14 h-14 rounded-full p-[1.5px] border border-zinc-800 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xl">
                    {item.emoji}
                  </div>
                </div>
                <span className="text-[11px] text-zinc-300 font-normal">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Instagram 3-Tab Bar (Grid / Reels / Saved) */}
      <div className="flex items-center border-b border-zinc-900">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex items-center justify-center transition-all ${
            activeTab === 'grid'
              ? 'border-b-2 border-white text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="Posts Grid"
        >
          <Grid className="w-5 h-5 stroke-[2]" />
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3 flex items-center justify-center transition-all ${
            activeTab === 'reels'
              ? 'border-b-2 border-white text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="Reels"
        >
          <Clapperboard className="w-5 h-5 stroke-[2]" />
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 flex items-center justify-center transition-all ${
            activeTab === 'saved'
              ? 'border-b-2 border-white text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title="Saved Videos"
        >
          <Bookmark className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* 5. Instagram 3x3 Photo/Video Grid */}
      <div className="grid grid-cols-3 gap-0.5 pt-0.5">
        {displayedVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => playVideoFromGrid(video.id)}
            className="relative aspect-square bg-zinc-950 cursor-pointer overflow-hidden group"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Reel Clapperboard Icon on top-right */}
            <div className="absolute top-1.5 right-1.5 text-white drop-shadow">
              <Clapperboard className="w-3.5 h-3.5 stroke-[2]" />
            </div>

            {/* Views counter at bottom-left */}
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-bold text-white drop-shadow">
              <Play className="w-3 h-3 fill-white" />
              <span>
                {video.viewsCount >= 1000
                  ? `${(video.viewsCount / 1000).toFixed(0)}k`
                  : video.viewsCount}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white font-bold text-xs">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-white" />
                {video.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 fill-white" />
                {video.commentsCount}
              </span>
            </div>
          </div>
        ))}

        {displayedVideos.length === 0 && (
          <div className="col-span-3 py-16 text-center text-zinc-500 space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-zinc-600" />
            <p className="text-xs font-semibold">
              {activeTab === 'saved' ? 'No saved videos yet' : 'No posts uploaded yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
