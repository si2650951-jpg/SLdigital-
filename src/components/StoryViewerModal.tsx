import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Sparkles, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { EduStory } from '../types';
import { soundFx } from '../utils/audio';

interface StoryViewerModalProps {
  stories: EduStory[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onStoryViewed
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showQuizSnippet, setShowQuizSnippet] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  const activeStory = stories[currentIndex];

  useEffect(() => {
    if (!isOpen || !activeStory) return;
    onStoryViewed(activeStory.id);
    setProgress(0);
    setIsLiked(false);
    setShowQuizSnippet(false);
  }, [currentIndex, isOpen]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  // Story progress timer (5 seconds duration)
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const intervalTime = 50; // ms
    const step = 100 / (5000 / intervalTime);

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isOpen, isPaused]);

  if (!isOpen || !activeStory) return null;

  const handleSendHeart = () => {
    soundFx.playLike();
    setIsLiked(true);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    soundFx.playPop();
    alert(`Reply sent to @${activeStory.creator.username}: "${replyText.trim()}"`);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none">
      {/* Smartphone Story Frame Container */}
      <div className="relative w-full max-w-md h-full sm:h-[92vh] max-h-[850px] bg-zinc-950 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Story Media Background */}
        <div
          className="absolute inset-0 z-0 bg-black cursor-pointer"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={activeStory.mediaUrl}
            alt={activeStory.caption}
            className="w-full h-full object-cover"
          />
          {/* Subtle Instagram Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Floating Tap Zones (Left = Prev, Right = Next) */}
        <div className="absolute inset-0 z-10 grid grid-cols-3 pointer-events-auto">
          <div className="h-full cursor-pointer" onClick={handlePrev} />
          <div className="h-full cursor-pointer" />
          <div className="h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Top Section: Segmented Progress Bars & Creator Info */}
        <div className="relative z-20 p-3.5 space-y-3 pointer-events-auto">
          {/* Instagram Progress Segment Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((s, idx) => {
              let fillPercent = 0;
              if (idx < currentIndex) fillPercent = 100;
              else if (idx === currentIndex) fillPercent = progress;
              return (
                <div
                  key={s.id}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Creator Profile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
                <img
                  src={activeStory.creator.avatar}
                  alt={activeStory.creator.name}
                  className="w-full h-full rounded-full object-cover border border-black"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeStory.creator.username}
                </span>
                {activeStory.creator.isVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0095F6] text-white flex items-center justify-center text-[8px] font-black">
                    ✓
                  </span>
                )}
                <span className="text-[11px] text-zinc-300 font-medium opacity-80">
                  • {activeStory.timestamp}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Heart Pop Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <Heart className="w-24 h-24 text-[#FF3040] fill-[#FF3040] animate-ping opacity-90" />
          </div>
        )}

        {/* Middle: Interactive Quiz Flashcard snippet (if present) */}
        {activeStory.quizSnippet && (
          <div className="relative z-20 px-5 pointer-events-auto">
            <div className="bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 shadow-2xl text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Quick Concept Flashcard
                </span>
                <button
                  onClick={() => setShowQuizSnippet(!showQuizSnippet)}
                  className="text-[11px] text-[#0095F6] font-bold hover:underline"
                >
                  {showQuizSnippet ? 'Hide' : 'Reveal Answer'}
                </button>
              </div>
              <p className="text-xs font-semibold leading-snug">
                {activeStory.quizSnippet.question}
              </p>
              {showQuizSnippet && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
                  💡 Answer: {activeStory.quizSnippet.answer}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section: Caption & Instagram Reply Bar */}
        <div className="relative z-20 p-4 space-y-3 pointer-events-auto">
          {/* Caption */}
          <p className="text-xs sm:text-sm text-white font-medium drop-shadow-md leading-relaxed">
            {activeStory.caption}
          </p>

          {/* Reply form */}
          <div className="flex items-center gap-2.5">
            <form
              onSubmit={handleSendReply}
              className="flex-1 flex items-center bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                placeholder={`Reply to ${activeStory.creator.username}...`}
                className="w-full bg-transparent text-xs text-white placeholder-zinc-400 focus:outline-none"
              />
              {replyText.trim() && (
                <button
                  type="submit"
                  className="text-xs font-bold text-[#0095F6] hover:text-blue-400 shrink-0 ml-1.5"
                >
                  Send
                </button>
              )}
            </form>

            <button
              onClick={handleSendHeart}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:scale-110 active:scale-95 transition-all"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? 'text-[#FF3040] fill-[#FF3040]' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
