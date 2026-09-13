import React, { useState } from 'react';
import {
  X,
  Trophy,
  Flame,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DAILY_QUIZZES, CATEGORIES } from '../data/seedData';
import { QuizQuestion } from '../types';

export const QuizHub: React.FC = () => {
  const {
    quizHubOpen,
    setQuizHubOpen,
    setActiveQuiz,
    setLeaderboardModalOpen,
    answeredQuizIds,
    videos
  } = useApp();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'categories' | 'weekly'>('daily');

  if (!quizHubOpen) return null;

  // Extract all quizzes from videos + daily quizzes
  const allVideoQuizzes = videos.filter((v) => v.quiz).map((v) => v.quiz as QuizQuestion);
  const totalAvailable = DAILY_QUIZZES.length + allVideoQuizzes.length;
  const totalAnswered = answeredQuizIds.size;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl h-[85vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                EduQuiz Hub & Challenges
              </h2>
              <p className="text-xs text-zinc-400">
                Test your knowledge, gain points, climb the global leaderboards!
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuizHubOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Stats Bar */}
        <div className="px-6 py-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Streak: 14 Days</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Award className="w-4 h-4" />
              <span>Score: {currentUser.quizPoints || 0} pts</span>
            </div>
            <div className="text-xs text-zinc-400 hidden sm:block">
              Completed: {totalAnswered} / {totalAvailable}
            </div>
          </div>

          <button
            onClick={() => {
              setQuizHubOpen(false);
              setLeaderboardModalOpen(true);
            }}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>View Leaderboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-900/30">
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'daily'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📅 Daily GK Quiz
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📚 Category Quizzes ({CATEGORIES.length - 1})
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'weekly'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🏆 Weekly Championship
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {activeTab === 'daily' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Today's Challenge
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Updated Daily at 00:00 UTC
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  General Knowledge & Competitive Science Mini-Mock
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Answer 4 quick high-yield questions to boost your daily retention streak and earn bonus badges.
                </p>
              </div>

              {DAILY_QUIZZES.map((quiz, idx) => {
                const isDone = answeredQuizIds.has(quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
                          {quiz.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 mt-0.5">
                          {quiz.question}
                        </h4>
                        <span className="text-[11px] text-zinc-400 font-medium">
                          Reward: +{quiz.points} points
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setQuizHubOpen(false);
                        setActiveQuiz(quiz);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500 text-white hover:bg-rose-600'
                      }`}
                    >
                      {isDone ? 'Review' : 'Answer'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                // Find matching quizzes
                const count = [...DAILY_QUIZZES, ...allVideoQuizzes].filter(
                  (q) => q.category === cat
                ).length;
                return (
                  <div
                    key={cat}
                    onClick={() => {
                      const match = [...DAILY_QUIZZES, ...allVideoQuizzes].find(
                        (q) => q.category === cat
                      );
                      if (match) {
                        setQuizHubOpen(false);
                        setActiveQuiz(match);
                      } else {
                        alert(`No quiz created yet for ${cat}. Creators can add quizzes in Creator Studio!`);
                      }
                    }}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                        {cat}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {count > 0 ? `${count} Quizzes Available` : 'Upcoming challenge'}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-rose-500 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Weekly National EduShorts Championship
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                  Compete with thousands of learners in real-time. Top 3 scorers win Verified Scholar badges and cash prize rewards!
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-amber-400">
                <span>Ends in: 02d 14h 28m</span>
                <span>•</span>
                <span>Prize Pool: $500</span>
              </div>
              <button
                onClick={() => {
                  setQuizHubOpen(false);
                  setActiveQuiz(DAILY_QUIZZES[0]);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
              >
                Join Championship Round (Free)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
