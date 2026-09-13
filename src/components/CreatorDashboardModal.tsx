import React, { useState } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  Users,
  Gift,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const CreatorDashboardModal: React.FC = () => {
  const { creatorDashboardOpen, setCreatorDashboardOpen, videos, creatorTipsTotal } = useApp();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'monetization' | 'analytics'>('overview');

  if (!creatorDashboardOpen) return null;

  // Aggregate stats
  const creatorVideos = videos.filter((v) => v.creatorId === currentUser.id);
  const totalViews = creatorVideos.reduce((sum, v) => sum + v.viewsCount, 0) || 48200;
  const totalLikes = creatorVideos.reduce((sum, v) => sum + v.likesCount, 0) || 6400;
  const estEarnings = (currentUser.earnings || 145.0) + creatorTipsTotal;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl h-[88vh] max-h-[760px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Creator Studio & Monetization Hub
              </h2>
              <p className="text-xs text-zinc-400">
                Track educational reach, watch time, earnings and subscriber revenue
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreatorDashboardOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-900/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📊 Analytics & Growth
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'monetization'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            💰 Monetization Streams
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🎯 Audience Demographics
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Total Views</span>
                    <Eye className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {totalViews.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" /> +24% this week
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Total Likes</span>
                    <Heart className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {totalLikes.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18% this week
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Watch Time</span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    342.5 hrs
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" /> +32 hrs
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
                    <span>Net Earnings</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-extrabold text-amber-400 font-mono">
                    ${estEarnings.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                    Instant Payout Ready
                  </span>
                </div>
              </div>

              {/* Performance Curve Visualization */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    7-Day Engagement & Retention Curve
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">94% average completion rate</span>
                </div>

                {/* SVG Trend Chart */}
                <div className="h-28 w-full relative flex items-end justify-between pt-4 px-2">
                  {[45, 60, 52, 78, 85, 92, 100].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        className="w-8 sm:w-12 bg-gradient-to-t from-rose-500/40 to-rose-500 rounded-t-lg transition-all group-hover:brightness-125"
                        style={{ height: `${val}%` }}
                      />
                      <span className="text-[10px] text-zinc-500">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Educational Videos */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">
                  Top Performing Educational Reels
                </h3>
                <div className="space-y-2">
                  {videos.slice(0, 3).map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-12 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {v.title}
                          </h4>
                          <span className="text-[11px] text-zinc-400">
                            {v.category} • {v.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-xs">
                        <div className="font-bold text-white font-mono">
                          {v.viewsCount.toLocaleString()} views
                        </div>
                        <div className="text-[11px] text-emerald-400 font-semibold">
                          +${(v.viewsCount * 0.012).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-sm font-bold text-white mb-1">
                  Active Monetization Programs
                </h3>
                <p className="text-xs text-zinc-400">
                  EduShorts distributes 65% of educational ad revenue and direct fan tips to verified creators.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Video Ad Revenue Sharing</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Earn from non-intrusive educational brand sponsors and in-feed micro sponsorships.
                  </p>
                  <div className="pt-2 text-sm font-bold text-white font-mono">$184.20 this month</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Learner Gifts & Tips</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Students tip coins for high-yield exam preparation summaries and verified answers.
                  </p>
                  <div className="pt-2 text-sm font-bold text-amber-400 font-mono">
                    ${creatorTipsTotal.toFixed(2)} received
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Paid Masterclasses & Live Q&A</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                      Enabled
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Host weekend live batches for competitive exams and hands-on programming bootcamps.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Creator Fund Rewards</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                      Eligible
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Monthly bonuses for the top 50 educational creators with highest retention quiz completion.
                  </p>
                </div>
              </div>

              {/* Payout Details */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-zinc-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Connected Bank / UPI Payout</span>
                    <span className="text-[11px] text-zinc-500">Auto-transferred on the 1st of every month</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Payout of $' + estEarnings.toFixed(2) + ' initiated to connected account!')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs transition-colors"
                >
                  Withdraw Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase">Top Student Demographics</h4>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span>College Students (18-24)</span>
                      <span className="font-bold text-white">58%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Young Professionals (25-34)</span>
                      <span className="font-bold text-white">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>School Learners (13-17)</span>
                      <span className="font-bold text-white">14%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase">Top Search Discovery Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['#Physics', '#VedicMaths', '#IASPrep', '#ChatGPT', '#EnglishVocabulary', '#Constitution'].map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg bg-zinc-800 text-rose-400 text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
