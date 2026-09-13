import React, { useState } from 'react';
import {
  X,
  Heart,
  Send,
  Pin,
  Trash2,
  CornerDownRight,
  Flag,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const CommentDrawer: React.FC = () => {
  const {
    activeCommentVideoId,
    setActiveCommentVideoId,
    comments,
    addComment,
    likeComment,
    pinComment,
    deleteComment,
    submitReport,
    videos
  } = useApp();

  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const [menuOpenCommentId, setMenuOpenCommentId] = useState<string | null>(null);

  if (!activeCommentVideoId) return null;

  const currentVideo = videos.find((v) => v.id === activeCommentVideoId);
  const isVideoCreator = currentVideo?.creatorId === currentUser.id || currentUser.role === 'admin';
  const videoComments = comments[activeCommentVideoId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (replyingTo) {
      addComment(activeCommentVideoId, inputText, replyingTo.id);
      setReplyingTo(null);
    } else {
      addComment(activeCommentVideoId, inputText);
    }
    setInputText('');
  };

  const EMOJI_PRESETS = ['👏', '🔥', '💡', '🧠', '❤️', '🙌', '💯', '✨'];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 select-none"
      onClick={() => {
        setActiveCommentVideoId(null);
        setReplyingTo(null);
      }}
    >
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-t-3xl sm:rounded-3xl h-[75vh] max-h-[640px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Instagram Drag Handle Pill */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Drawer Header */}
        <div className="px-4 py-2.5 border-b border-zinc-900 flex items-center justify-between">
          <div className="w-6" />
          <h3 className="font-bold text-white text-sm text-center">
            Comments ({videoComments.length})
          </h3>
          <button
            onClick={() => {
              setActiveCommentVideoId(null);
              setReplyingTo(null);
            }}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {videoComments.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <p className="text-sm font-medium">No comments yet.</p>
              <p className="text-xs text-zinc-600 mt-1">Be the first to share an educational takeaway!</p>
            </div>
          ) : (
            videoComments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start justify-between gap-3 group">
                  {/* User Avatar */}
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700 shrink-0 mt-0.5"
                  />

                  {/* Comment Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white">
                        {comment.user.name}
                      </span>
                      {comment.user.id === currentVideo?.creatorId && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                          Creator
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-500">
                        {comment.createdAt}
                      </span>
                      {comment.isPinned && (
                        <span className="flex items-center gap-0.5 text-amber-400 text-[10px] font-semibold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                          <Pin className="w-3 h-3 fill-amber-400" /> Pinned
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-zinc-200 mt-1 leading-relaxed break-words">
                      {comment.text}
                    </p>

                    {/* Comment Sub-Actions */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                      <button
                        onClick={() =>
                          setReplyingTo({ id: comment.id, username: comment.user.username })
                        }
                        className="hover:text-rose-400 font-semibold transition-colors"
                      >
                        Reply
                      </button>

                      {/* Pin button (for creator or admin) */}
                      {isVideoCreator && (
                        <button
                          onClick={() => pinComment(activeCommentVideoId, comment.id)}
                          className={`hover:text-amber-400 transition-colors flex items-center gap-1 ${
                            comment.isPinned ? 'text-amber-400 font-bold' : ''
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                          <span>{comment.isPinned ? 'Unpin' : 'Pin'}</span>
                        </button>
                      )}

                      {/* Delete own comment */}
                      {(comment.userId === currentUser.id || currentUser.role === 'admin') && (
                        <button
                          onClick={() => deleteComment(activeCommentVideoId, comment.id)}
                          className="hover:text-rose-500 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Report comment */}
                      <button
                        onClick={() => {
                          submitReport('comment', comment.id, 'Spam, harassment or offensive comment', comment.text);
                          alert('Comment reported to moderators.');
                        }}
                        className="hover:text-zinc-200 transition-colors"
                        title="Report comment"
                      >
                        <Flag className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Heart Like */}
                  <button
                    onClick={() => likeComment(activeCommentVideoId, comment.id)}
                    className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-rose-500 transition-colors shrink-0 pt-1"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        comment.isLiked ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    />
                    <span className="text-[10px] font-medium">
                      {comment.likesCount > 0 ? comment.likesCount : ''}
                    </span>
                  </button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-10 space-y-3 pt-2 border-l-2 border-zinc-800/80 pl-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start justify-between gap-2.5">
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-white">
                              {reply.user.name}
                            </span>
                            {reply.user.id === currentVideo?.creatorId && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                                Creator
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-500">
                              {reply.createdAt}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-200 mt-0.5 leading-relaxed break-words">
                            {reply.text}
                          </p>
                        </div>
                        <button
                          onClick={() => likeComment(activeCommentVideoId, reply.id)}
                          className="flex flex-col items-center text-zinc-400 hover:text-rose-500 shrink-0"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              reply.isLiked ? 'text-rose-500 fill-rose-500' : ''
                            }`}
                          />
                          <span className="text-[9px]">{reply.likesCount || ''}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Replying indicator */}
        {replyingTo && (
          <div className="px-5 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-rose-400">
            <span className="flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5" />
              Replying to @{replyingTo.username}
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Quick Emoji Bar */}
        <div className="px-4 py-1.5 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {EMOJI_PRESETS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setInputText((prev) => prev + em)}
              className="text-base hover:scale-125 transition-transform p-1"
            >
              {em}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              replyingTo
                ? `Reply to @${replyingTo.username}...`
                : 'Add educational comment or question...'
            }
            className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-full px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-md"
          >
            <Send className="w-4 h-4 translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
