import React, { useRef, useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Plus,
  Check,
  Volume2,
  VolumeX,
  Play,
  HelpCircle,
  Music,
  MoreHorizontal,
  Share2,
  Flag
} from 'lucide-react';
import { VideoItem } from '../types';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/audio';

interface VideoCardProps {
  video: VideoItem;
  isActive: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 50, y: 50 });
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showPlayIconFlash, setShowPlayIconFlash] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const lastTapRef = useRef<number>(0);

  const {
    likedVideoIds,
    toggleLikeVideo,
    savedVideoIds,
    toggleSaveVideo,
    followingIds,
    toggleFollowUser,
    setActiveCommentVideoId,
    setActiveShareVideo,
    setActiveQuiz,
    setViewingProfile,
    submitReport
  } = useApp();

  const { currentUser } = useAuth();

  const isLiked = likedVideoIds.has(video.id);
  const isSaved = savedVideoIds.has(video.id);
  const isFollowing = followingIds.has(video.creatorId);

  // Play / Pause on active index change
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => {});
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || video.duration || 1;
    setProgress((current / total) * 100);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
    setShowPlayIconFlash(true);
    setTimeout(() => setShowPlayIconFlash(false), 500);
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Instagram Double-Tap to Like!
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setHeartPos({ x, y });
      setShowHeartBurst(true);
      if (!isLiked) {
        toggleLikeVideo(video.id);
        soundFx.playLike();
      }
      setTimeout(() => setShowHeartBurst(false), 900);
    } else {
      handleTogglePlay();
    }
    lastTapRef.current = now;
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = clickX / width;
    const total = videoRef.current.duration || video.duration;
    videoRef.current.currentTime = ratio * total;
    setProgress(ratio * 100);
  };

  return (
    <div
      id={`video-card-${video.id}`}
      className="relative w-full h-[calc(100dvh-102px)] sm:h-[calc(100vh-112px)] max-h-[820px] max-w-md mx-auto bg-black sm:rounded-3xl overflow-hidden shadow-2xl select-none flex items-center justify-center snap-start"
    >
      {/* Video Media Area */}
      <div
        className="relative w-full h-full cursor-pointer flex items-center justify-center bg-black"
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-full object-cover ${video.filterEffect || ''}`}
        />

        {/* Instagram Single Tap Play/Pause Flash Overlay */}
        {showPlayIconFlash && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-all">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 scale-105 animate-in zoom-in-50 duration-200">
              {isPlaying ? (
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              ) : (
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-7 bg-white rounded-sm" />
                  <div className="w-2.5 h-7 bg-white rounded-sm" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instagram Double-Tap Popout Heart Burst */}
        {showHeartBurst && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30"
            style={{ left: `${heartPos.x}%`, top: `${heartPos.y}%` }}
          >
            <div className="animate-heart-burst">
              <Heart className="w-28 h-28 text-[#FF3040] fill-[#FF3040] drop-shadow-[0_0_24px_rgba(255,48,64,0.85)]" />
            </div>
          </div>
        )}

        {/* Instagram Vignettes for optimal text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

        {/* Top Controls: Audio indicator */}
        <div className="absolute top-3 right-3 z-20 pointer-events-auto flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white active:scale-90 transition-transform"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Side Social Rails (Instagram Reels Exact Layout) */}
        <div className="absolute right-2.5 bottom-12 flex flex-col items-center gap-5 z-20 pointer-events-auto">
          {/* 1. Like Button */}
          <div className="flex flex-col items-center">
            <button
              id={`btn-like-${video.id}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLikeVideo(video.id);
                soundFx.playLike();
              }}
              className="p-1 active:scale-125 transition-transform text-white"
            >
              <Heart
                className={`w-7 h-7 transition-colors ${
                  isLiked ? 'text-[#FF3040] fill-[#FF3040]' : 'text-white stroke-[1.9]'
                }`}
              />
            </button>
            <span className="text-[12px] font-semibold text-white mt-1 drop-shadow">
              {video.likesCount >= 1000 ? `${(video.likesCount / 1000).toFixed(1)}k` : video.likesCount}
            </span>
          </div>

          {/* 2. Comment Button */}
          <div className="flex flex-col items-center">
            <button
              id={`btn-comment-${video.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveCommentVideoId(video.id);
              }}
              className="p-1 active:scale-110 transition-transform text-white"
            >
              <MessageCircle className="w-7 h-7 stroke-[1.9]" />
            </button>
            <span className="text-[12px] font-semibold text-white mt-1 drop-shadow">
              {video.commentsCount >= 1000 ? `${(video.commentsCount / 1000).toFixed(1)}k` : video.commentsCount}
            </span>
          </div>

          {/* 3. Send / Share Button (Paper Plane) */}
          <div className="flex flex-col items-center">
            <button
              id={`btn-share-${video.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveShareVideo(video);
              }}
              className="p-1 active:scale-110 transition-transform text-white"
            >
              <Send className="w-7 h-7 stroke-[1.9] -rotate-12 translate-y-0.5" />
            </button>
            <span className="text-[12px] font-semibold text-white mt-1 drop-shadow">
              {video.sharesCount >= 1000 ? `${(video.sharesCount / 1000).toFixed(1)}k` : video.sharesCount}
            </span>
          </div>

          {/* 4. Bookmark / Save Button */}
          <div className="flex flex-col items-center">
            <button
              id={`btn-save-${video.id}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveVideo(video.id);
                soundFx.playPop();
              }}
              className="p-1 active:scale-110 transition-transform text-white"
            >
              <Bookmark
                className={`w-7 h-7 transition-colors ${
                  isSaved ? 'text-white fill-white' : 'text-white stroke-[1.9]'
                }`}
              />
            </button>
            <span className="text-[12px] font-semibold text-white mt-1 drop-shadow">
              {video.savesCount >= 1000 ? `${(video.savesCount / 1000).toFixed(1)}k` : video.savesCount}
            </span>
          </div>

          {/* 5. Interactive Quiz Badge (Educational Short Feature) */}
          {video.quiz && (
            <div className="flex flex-col items-center animate-bounce">
              <button
                id={`btn-quiz-${video.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveQuiz(video.quiz || null);
                }}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-lg text-white flex items-center justify-center hover:scale-110 transition-transform"
                title="Earn Quiz Points"
              >
                <HelpCircle className="w-5 h-5 stroke-[2.2]" />
              </button>
              <span className="text-[10px] font-extrabold text-amber-300 mt-1">
                +{video.quiz.points} pts
              </span>
            </div>
          )}

          {/* 6. Instagram 3-Dots Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOptionsMenuOpen(!optionsMenuOpen);
              }}
              className="p-1 text-white active:scale-95 transition-transform"
            >
              <MoreHorizontal className="w-6 h-6 stroke-[2]" />
            </button>

            {optionsMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOptionsMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 bottom-full mb-2 w-44 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl py-1.5 z-50 text-xs font-semibold animate-in fade-in">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      submitReport('video', video.id, 'Inappropriate content', video.title);
                      alert('Video reported to moderators. Thank you for keeping EduShorts safe!');
                      setOptionsMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-[#FF3040] hover:bg-zinc-900 flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report Post</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(window.location.href);
                      alert('Reel link copied to clipboard!');
                      setOptionsMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 7. Rotating Instagram Music Vinyl Disc */}
          <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-zinc-700 p-0.5 overflow-hidden animate-spin shadow-lg" style={{ animationDuration: '4s' }}>
            <img
              src={video.creator.avatar}
              alt="audio-album"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Left: Creator Details & Caption (Instagram Layout) */}
        <div className="absolute left-3 right-16 bottom-3 z-20 pointer-events-auto text-left space-y-2">
          {/* Creator Profile & Follow Pill Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewingProfile(video.creator);
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
                <img
                  src={video.creator.avatar}
                  alt={video.creator.name}
                  className="w-full h-full rounded-full object-cover border border-black"
                />
              </div>
              <span className="text-white font-bold text-xs tracking-tight flex items-center gap-1">
                {video.creator.username}
                {video.creator.isVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0095F6] text-white flex items-center justify-center text-[8px] font-black">
                    ✓
                  </span>
                )}
              </span>
            </button>

            {/* Follow / Following Button (Instagram Pill Style) */}
            {currentUser.id !== video.creatorId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowUser(video.creatorId);
                  soundFx.playPop();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-zinc-800/80 text-white border border-zinc-700'
                    : 'bg-[#0095F6] hover:bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Video Title & Caption */}
          <div>
            <p
              className={`text-white text-xs leading-relaxed drop-shadow ${
                isDescExpanded ? '' : 'line-clamp-2'
              }`}
            >
              <span className="font-bold mr-1.5">{video.title}</span>
              {video.description}
            </p>
            {video.description.length > 70 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescExpanded(!isDescExpanded);
                }}
                className="text-zinc-400 font-semibold text-[11px] hover:text-white mt-0.5 block"
              >
                {isDescExpanded ? 'less' : '...more'}
              </button>
            )}
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5">
            {video.hashtags.map((tag) => (
              <span key={tag} className="text-white/80 font-medium text-[11px]">
                {tag}
              </span>
            ))}
          </div>

          {/* Audio Marquee Ticker */}
          <div className="flex items-center gap-2 text-white/90 text-xs">
            <Music className="w-3.5 h-3.5 shrink-0" />
            <div className="overflow-hidden w-44 whitespace-nowrap">
              <span className="inline-block text-[11px] font-normal animate-marquee">
                {video.musicTitle} • Original audio
              </span>
            </div>
          </div>
        </div>

        {/* Slim Instagram Progress Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 cursor-pointer z-30"
          onClick={handleProgressBarClick}
        >
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
