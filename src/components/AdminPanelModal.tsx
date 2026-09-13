import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Users,
  Video,
  AlertTriangle,
  BarChart2,
  Trash2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  FolderTree,
  Lock,
  Unlock,
  BadgeCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/seedData';

export const AdminPanelModal: React.FC = () => {
  const {
    adminPanelOpen,
    setAdminPanelOpen,
    reports,
    resolveReport,
    videos,
    deleteVideo
  } = useApp();
  const { allDemoUsers, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users' | 'videos' | 'categories'>('overview');

  if (!adminPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl h-[90vh] max-h-[780px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                EduShorts Super Admin Center
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Root Privileges
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Manage platform moderation, community safety, creator verification & analytics
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminPanelOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-900/40 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📈 Platform Analytics
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Safety Reports ({reports.filter((r) => r.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            👥 User & Creator Management
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🎬 Content & Video Catalog ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📂 Taxonomies & Categories
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-xs text-zinc-400 block mb-1">Total Active Learners</span>
                  <div className="text-2xl font-extrabold text-white font-mono">148,290</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">+12% this month</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-xs text-zinc-400 block mb-1">Verified Educators</span>
                  <div className="text-2xl font-extrabold text-white font-mono">2,418</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">+84 this week</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-xs text-zinc-400 block mb-1">Daily Quizzes Solved</span>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">89,450</div>
                  <span className="text-[10px] text-amber-300 font-semibold">91% accuracy rate</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-xs text-zinc-400 block mb-1">Pending Flagged Content</span>
                  <div className="text-2xl font-extrabold text-rose-400 font-mono">
                    {reports.filter((r) => r.status === 'pending').length}
                  </div>
                  <span className="text-[10px] text-rose-300 font-semibold">Action required</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Platform Safety & Community Guidelines Health
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold">99.8% Safe Score</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Automated AI safety filters screen all video metadata, descriptions, audio transcriptions, and comments. Flagged items are escalated to this Admin Center for immediate takedown or dismissal.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MODERATION & REPORTS */}
          {activeTab === 'moderation' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-bold text-white">
                  User Reports & Violations Queue
                </h3>
                <span className="text-xs text-zinc-400">
                  {reports.length} Total Reports Handled
                </span>
              </div>

              {reports.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Inbox Clean!</p>
                  <p className="text-xs text-zinc-400 mt-1">No pending reports or flagged violations.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {report.targetType}
                          </span>
                          <span className="text-xs font-mono text-zinc-400">
                            Target ID: {report.targetId}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            report.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {report.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          Reason: {report.reason}
                        </h4>
                        {report.targetSnippet && (
                          <p className="text-xs text-zinc-400 italic bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                            "{report.targetSnippet}"
                          </p>
                        )}
                        <span className="text-[10px] text-zinc-500 block">
                          Reported on {report.createdAt}
                        </span>
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => resolveReport(report.id, 'dismiss')}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => {
                              if (report.targetType === 'video') {
                                deleteVideo(report.targetId);
                              }
                              resolveReport(report.id, 'delete_content');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Takedown Content</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USER & CREATOR MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">
                User Roster & Verification Controls
              </h3>
              <div className="space-y-2">
                {allDemoUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">
                            {user.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase font-mono font-bold">
                            {user.role}
                          </span>
                          {user.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          @{user.username} • {user.followersCount} followers • {user.quizPoints} pts
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          switchUser(user.id);
                          setAdminPanelOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                      >
                        Impersonate
                      </button>
                      <button
                        onClick={() => alert(`Verified status toggled for @${user.username}`)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 text-xs font-bold transition-colors"
                      >
                        Verify Educator
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VIDEOS MANAGEMENT */}
          {activeTab === 'videos' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">
                All Published Learning Shorts ({videos.length})
              </h3>
              <div className="space-y-2">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-12 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          by @{vid.creator.username} • {vid.category} • {vid.viewsCount} views • {vid.likesCount} likes
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently remove "${vid.title}"?`)) {
                          deleteVideo(vid.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">
                Managed Learning Categories & Taxonomies ({CATEGORIES.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((c) => {
                  const count = videos.filter((v) => c === 'All' || v.category === c).length;
                  return (
                    <div
                      key={c}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{c}</h4>
                        <span className="text-[10px] text-zinc-400">{count} Active Reels</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold">
                        Live
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
