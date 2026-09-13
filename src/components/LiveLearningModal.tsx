import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  Users,
  Send,
  Heart,
  Gift,
  HelpCircle,
  Pin,
  Sparkles,
  Award,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SoundFx } from '../utils/audio';

export const LiveLearningModal: React.FC = () => {
  const { isLiveModalOpen, setIsLiveModalOpen, tipCreator } = useApp();
  const { currentUser } = useAuth();

  const [viewerCount, setViewerCount] = useState(1482);
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; isMod?: boolean }>>([
    { id: '1', user: 'Vikram', text: 'Good evening Sir! Ready for Organic Chemistry shortcuts!' },
    { id: '2', user: 'Ananya', text: 'Will this cover electrophilic substitution reactions too?' },
    { id: '3', user: 'EduModerator', text: 'Welcome all! Please post your doubts in the Q&A box.', isMod: true },
    { id: '4', user: 'Rohan_IIT', text: 'The reaction mechanism at step 2 is so clear now 🙌' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [heartsFloat, setHeartsFloat] = useState<number[]>([]);
  const [activePoll, setActivePoll] = useState<{
    question: string;
    options: string[];
    votes: number[];
    userVote?: number;
  }>({
    question: 'Which element is liquid at room temperature?',
    options: ['Mercury', 'Bromine', 'Gallium', 'Both A & B'],
    votes: [42, 38, 12, 110]
  });

  // Simulated viewer count drift
  useEffect(() => {
    if (!isLiveModalOpen) return;
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveModalOpen]);

  if (!isLiveModalOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `live_${Date.now()}`, user: currentUser.name, text: inputMsg.trim() }
    ]);
    setInputMsg('');
  };

  const handleSendHeart = () => {
    SoundFx.playLike();
    setHeartsFloat((prev) => [...prev, Date.now()]);
    setTimeout(() => {
      setHeartsFloat((prev) => prev.slice(1));
    }, 1500);
  };

  const handleSendGift = (amount: number, giftName: string) => {
    tipCreator('user_1', amount);
    setMessages((prev) => [
      ...prev,
      {
        id: `gift_${Date.now()}`,
        user: currentUser.name,
        text: `Sent ${giftName} ($${amount}) to support the educator! 🎓⭐`
      }
    ]);
    alert(`Thank you! Sent ${giftName} ($${amount}) to Dr. Ananya Sharma!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
      <div
        className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-none sm:rounded-3xl h-full sm:h-[90vh] max-h-[820px] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Live Video Stream Screen */}
        <div className="flex-1 relative bg-black flex flex-col justify-between overflow-hidden">
          {/* Simulated Live Stream Video Background */}
          <video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />

          {/* Top Live Bar Over Video */}
          <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
            <div className="flex items-center gap-3">
              {/* Live Badge */}
              <div className="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE</span>
              </div>

              {/* Viewers counter */}
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                <span>{viewerCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setIsLiveModalOpen(false)}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Hearts Animation */}
          <div className="absolute right-4 bottom-24 pointer-events-none z-20 flex flex-col items-center">
            {heartsFloat.map((id) => (
              <span
                key={id}
                className="text-2xl animate-bounce -translate-y-8 transition-all opacity-90"
              >
                💖
              </span>
            ))}
          </div>

          {/* Educator Info & Pinned Topic at Bottom */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-2">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt="Dr. Ananya Sharma"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
              />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Dr. Ananya Sharma
                  <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded">Verified</span>
                </h3>
                <p className="text-xs text-zinc-300">
                  Masterclass: High-Yield Organic Chemistry Shortcuts (NEET / JEE)
                </p>
              </div>
            </div>

            {/* Pinned Note */}
            <div className="p-2.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-medium">
                📌 Pinned: "Download the reaction chart PDF from the study community tab after this live stream."
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Live Chat, Live Quiz Poll & Super Gifts */}
        <div className="w-full md:w-80 bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col h-72 md:h-full">
          {/* Chat Header */}
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Live Study Chat</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Slow Mode: On</span>
          </div>

          {/* Interactive Live Poll Card */}
          <div className="p-3 bg-zinc-900/70 border-b border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Live Quiz Question
              </span>
              <span className="text-zinc-400 font-mono">30s remaining</span>
            </div>
            <p className="text-xs font-semibold text-white">
              {activePoll.question}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {activePoll.options.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => {
                    SoundFx.playNotification();
                    setActivePoll((prev) => {
                      const newVotes = [...prev.votes];
                      newVotes[idx] += 1;
                      return { ...prev, votes: newVotes, userVote: idx };
                    });
                  }}
                  disabled={activePoll.userVote !== undefined}
                  className={`p-1.5 rounded-lg text-[11px] font-medium border text-left truncate transition-colors ${
                    activePoll.userVote === idx
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-zinc-850 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {opt} ({activePoll.votes[idx]})
                </button>
              ))}
            </div>
          </div>

          {/* Chat Stream Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {messages.map((m) => (
              <div key={m.id} className="leading-snug break-words">
                <span
                  className={`font-bold mr-1.5 ${
                    m.isMod ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {m.user}:
                </span>
                <span className="text-zinc-200">{m.text}</span>
              </div>
            ))}
          </div>

          {/* Gift / Coin tipping bar */}
          <div className="px-3 py-2 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between gap-1">
            <button
              onClick={() => handleSendGift(1, 'Scholar Coffee ☕')}
              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-amber-300 font-bold transition-colors"
            >
              ☕ $1
            </button>
            <button
              onClick={() => handleSendGift(5, 'Genius Badge 🏅')}
              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-amber-300 font-bold transition-colors"
            >
              🏅 $5
            </button>
            <button
              onClick={() => handleSendGift(10, 'Research Grant 🎓')}
              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-amber-300 font-bold transition-colors"
            >
              🎓 $10
            </button>
            <button
              onClick={handleSendHeart}
              className="p-1.5 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 transition-colors"
              title="Send Love"
            >
              <Heart className="w-4 h-4 fill-rose-500" />
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendChat}
            className="p-2.5 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask a live question..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5 translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
