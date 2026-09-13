import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Share2,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CREATORS } from '../data/seedData';

export const ShareModal: React.FC = () => {
  const {
    activeShareVideo,
    setActiveShareVideo,
    incrementShareCount,
    shareVideoToChat,
    setViewingProfile
  } = useApp();
  const [copied, setCopied] = useState(false);
  const [sentUserIds, setSentUserIds] = useState<Set<string>>(new Set());

  if (!activeShareVideo) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://edushorts.app';
  const shareText = `Watch "${activeShareVideo.title}" by @${activeShareVideo.creator.username} on EduShorts! 🎓✨`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${currentUrl}#video-${activeShareVideo.id}`);
    setCopied(true);
    incrementShareCount(activeShareVideo.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    incrementShareCount(activeShareVideo.id);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
  };

  const handleFacebook = () => {
    incrementShareCount(activeShareVideo.id);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleTwitter = () => {
    incrementShareCount(activeShareVideo.id);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleDirectSend = (userId: string) => {
    shareVideoToChat(activeShareVideo.id, userId);
    setSentUserIds((prev) => new Set(prev).add(userId));
    incrementShareCount(activeShareVideo.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Share Reel</h3>
          </div>
          <button
            onClick={() => setActiveShareVideo(null)}
            className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Snapshot */}
        <div className="flex items-center gap-3 p-3 my-3 bg-zinc-900 rounded-xl border border-zinc-800">
          <img
            src={activeShareVideo.thumbnailUrl}
            alt={activeShareVideo.title}
            className="w-12 h-16 rounded-lg object-cover ring-1 ring-zinc-700"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white line-clamp-1">
              {activeShareVideo.title}
            </h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              by @{activeShareVideo.creator.username}
            </p>
            <span className="inline-block mt-1 text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {activeShareVideo.category}
            </span>
          </div>
        </div>

        {/* Send to friends via In-App DM */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-zinc-400 mb-2">
            Send via Direct Message:
          </p>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {INITIAL_CREATORS.slice(0, 5).map((user) => {
              const isSent = sentUserIds.has(user.id);
              return (
                <div key={user.id} className="flex flex-col items-center gap-1 shrink-0 w-16">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700"
                    />
                    {isSent && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-300 truncate w-full text-center">
                    {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => handleDirectSend(user.id)}
                    disabled={isSent}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isSent
                        ? 'bg-zinc-800 text-zinc-500'
                        : 'bg-rose-500 text-white hover:bg-rose-600'
                    }`}
                  >
                    {isSent ? 'Sent' : 'Send'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* External Social Apps */}
        <p className="text-xs font-semibold text-zinc-400 mb-2">
          Share to Social Media:
        </p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center font-black">
              f
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">Facebook</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleTwitter}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-black">
              𝕏
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">Twitter / X</span>
          </button>

          {/* Instagram Note / Stories */}
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
              IG
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">Instagram</span>
          </button>
        </div>

        {/* Copy Link & Creator Profile */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-semibold text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copy Video Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setActiveShareVideo(null);
              setViewingProfile(activeShareVideo.creator);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Creator Profile (@{activeShareVideo.creator.username})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
