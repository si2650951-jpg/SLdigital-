import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  FileText,
  Sparkles,
  Plus,
  Search,
  Check,
  Send,
  Trophy,
  Share2,
  Paperclip,
  ThumbsUp,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_COMMUNITIES } from '../data/seedData';
import { LearningCommunity, CommunityPost } from '../types';

export const CommunityHub: React.FC = () => {
  const { currentUser } = useAuth();
  const [communities, setCommunities] = useState<LearningCommunity[]>(INITIAL_COMMUNITIES);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(INITIAL_COMMUNITIES[0].id);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(
    new Set([INITIAL_COMMUNITIES[0].id])
  );

  // New Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'question' | 'notes' | 'discussion'>('question');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const activeCommunity = communities.find((c) => c.id === selectedCommunityId) || communities[0];
  const isJoined = joinedCommunityIds.has(activeCommunity.id);

  const toggleJoin = (id: string) => {
    setJoinedCommunityIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      communityId: activeCommunity.id,
      author: currentUser,
      content: newPostContent.trim(),
      type: newPostCategory,
      likesCount: 1,
      repliesCount: 0,
      createdAt: 'Just now'
    };

    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === activeCommunity.id) {
          return {
            ...c,
            posts: [newPost, ...c.posts]
          };
        }
        return c;
      })
    );

    setNewPostContent('');
    setShowCreateModal(false);
  };

  const handleLikePost = (postId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === activeCommunity.id) {
          return {
            ...c,
            posts: c.posts.map((p) =>
              p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p
            )
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 pt-2 px-3 sm:px-4 space-y-4">
      {/* Community Hub Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md text-xl">
            🎓
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Outfit']">
              Learning Communities & Study Circles
            </h1>
            <p className="text-xs text-zinc-400">
              Join peer discussion groups, ask tricky questions, share handwritten notes
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post Question or Notes</span>
        </button>
      </div>

      {/* Community Selector Carousel */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Explore Study Circles
          </span>
          <span className="text-xs text-zinc-500">
            {joinedCommunityIds.size} Joined
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {communities.map((c) => {
            const isSelected = c.id === activeCommunity.id;
            const hasJoined = joinedCommunityIds.has(c.id);

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCommunityId(c.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500 text-white shadow'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>{c.avatarEmoji}</span>
                <span>{c.name}</span>
                {hasJoined && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Community Detail Header */}
      <div className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
              {activeCommunity.avatarEmoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  {activeCommunity.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 font-semibold border border-zinc-800">
                  {activeCommunity.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeCommunity.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleJoin(activeCommunity.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                isJoined
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              {isJoined ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Joined</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Join Circle</span>
                </>
              )}
            </button>

            <span className="text-xs text-zinc-500 font-mono">
              {activeCommunity.membersCount.toLocaleString()} members
            </span>
          </div>
        </div>

        {/* Quick Guidelines Banner */}
        <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span>Rules: Peer-learning only, be respectful, cite reference sources for facts.</span>
          <span className="text-amber-400 font-semibold hidden sm:inline">Mod-monitored</span>
        </div>
      </div>

      {/* Community Feed Posts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white px-1">
          Discussion Board & Shared Notes ({activeCommunity.posts.length})
        </h3>

        {activeCommunity.posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-md hover:border-zinc-750 transition-colors"
          >
            {/* Author bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{post.author.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      @{post.author.username}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{post.createdAt}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  post.type === 'question'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : post.type === 'notes'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {post.type}
              </span>
            </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-['Plus_Jakarta_Sans']">
              {post.content}
            </p>

            {/* Attachment pill if any */}
            {post.attachmentUrl && (
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span className="font-semibold">{post.attachmentName || 'Study_Notes.pdf'}</span>
                </div>
                <button
                  onClick={() => alert('Downloading resource: ' + post.attachmentName)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300"
                >
                  Download PDF ↗
                </button>
              </div>
            )}

            {/* Post Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likesCount} Helpful</span>
              </button>

              <button
                onClick={() => alert('Open replies thread...')}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.repliesCount} Answers</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Post link copied!');
                }}
                className="hover:text-white transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating a post */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-base">
                Post to {activeCommunity.name}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex gap-2">
                {(['question', 'notes', 'discussion'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewPostCategory(t)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      newPostCategory === t
                        ? 'bg-rose-500 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  {newPostCategory === 'question'
                    ? 'What is your doubt or concept question?'
                    : 'Summary notes / topic discussion:'}
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Type your question clearly with formulas, context or book references..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach Handwritten Formula PDF</span>
                </span>
                <button
                  type="button"
                  onClick={() => alert('PDF attachment simulated: "Key_Formulas_2026.pdf" attached!')}
                  className="text-xs text-rose-400 font-bold"
                >
                  Attach File
                </button>
              </div>

              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-95 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all"
              >
                Publish to Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
