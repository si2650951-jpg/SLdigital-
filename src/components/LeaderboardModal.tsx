import React, { useState } from 'react';
import {
  X,
  Trophy,
  Medal,
  Sparkles,
  Flame,
  Award,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const LeaderboardModal: React.FC = () => {
  const { leaderboardModalOpen, setLeaderboardModalOpen, leaderboard, setViewingProfile } = useApp();
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  if (!leaderboardModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl h-[85vh] max-h-[680px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-['Outfit']">
                Knowledge Leaderboard
              </h3>
              <p className="text-xs text-zinc-400">
                Top learners ranked by quiz points & retention
              </p>
            </div>
          </div>
          <button
            onClick={() => setLeaderboardModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeframe selector */}
        <div className="grid grid-cols-3 p-1.5 mx-6 mt-4 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setTimeframe('daily')}
            className={`py-1.5 rounded-lg transition-colors ${
              timeframe === 'daily'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`py-1.5 rounded-lg transition-colors ${
              timeframe === 'weekly'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`py-1.5 rounded-lg transition-colors ${
              timeframe === 'monthly'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Podium Top 3 */}
        <div className="px-6 py-4 flex items-end justify-center gap-3 border-b border-zinc-800/60">
          {/* Rank 2 */}
          {leaderboard[1] && (
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => {
                setLeaderboardModalOpen(false);
                setViewingProfile(leaderboard[1].user);
              }}
            >
              <div className="relative mb-1">
                <img
                  src={leaderboard[1].user.avatar}
                  alt={leaderboard[1].user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-400 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-zinc-400 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  2
                </span>
              </div>
              <span className="text-xs font-bold text-white max-w-[80px] truncate text-center">
                {leaderboard[1].user.name.split(' ')[0]}
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {leaderboard[1].points} pts
              </span>
              <div className="w-16 h-12 bg-zinc-800/80 rounded-t-xl border-t-2 border-zinc-400 flex items-center justify-center text-xs text-zinc-400 font-bold mt-1">
                🥈 2nd
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {leaderboard[0] && (
            <div
              className="flex flex-col items-center cursor-pointer group -mt-4"
              onClick={() => {
                setLeaderboardModalOpen(false);
                setViewingProfile(leaderboard[0].user);
              }}
            >
              <Crown className="w-6 h-6 text-amber-400 animate-bounce mb-0.5" />
              <div className="relative mb-1">
                <img
                  src={leaderboard[0].user.avatar}
                  alt={leaderboard[0].user.name}
                  className="w-18 h-18 rounded-full object-cover ring-4 ring-amber-400 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-black px-2 py-0.2 rounded-full">
                  1
                </span>
              </div>
              <span className="text-xs font-bold text-white max-w-[90px] truncate text-center">
                {leaderboard[0].user.name.split(' ')[0]}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {leaderboard[0].points} pts
              </span>
              <div className="w-20 h-16 bg-gradient-to-t from-amber-500/20 to-amber-500/40 rounded-t-xl border-t-2 border-amber-400 flex items-center justify-center text-xs text-amber-300 font-extrabold mt-1">
                🥇 1st
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {leaderboard[2] && (
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => {
                setLeaderboardModalOpen(false);
                setViewingProfile(leaderboard[2].user);
              }}
            >
              <div className="relative mb-1">
                <img
                  src={leaderboard[2].user.avatar}
                  alt={leaderboard[2].user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-700 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  3
                </span>
              </div>
              <span className="text-xs font-bold text-white max-w-[80px] truncate text-center">
                {leaderboard[2].user.name.split(' ')[0]}
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {leaderboard[2].points} pts
              </span>
              <div className="w-16 h-10 bg-zinc-800/80 rounded-t-xl border-t-2 border-amber-700 flex items-center justify-center text-xs text-amber-600 font-bold mt-1">
                🥉 3rd
              </div>
            </div>
          )}
        </div>

        {/* Full List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.user.id === currentUser.id;
            return (
              <div
                key={entry.user.id}
                onClick={() => {
                  setLeaderboardModalOpen(false);
                  setViewingProfile(entry.user);
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isCurrentUser
                    ? 'bg-rose-500/15 border-rose-500/40 text-white'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 text-center font-extrabold text-sm font-mono ${
                      entry.rank <= 3 ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  >
                    #{entry.rank}
                  </span>
                  <img
                    src={entry.user.avatar}
                    alt={entry.user.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {entry.user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span>@{entry.user.username}</span>
                      <span>•</span>
                      <span className="text-amber-400">{entry.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-mono font-black text-white">
                    {entry.points}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {entry.quizzesSolved} quizzes
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
