import React, { useState } from 'react';
import {
  X,
  Send,
  Image,
  Mic,
  Video,
  Smile,
  Check,
  CheckCheck,
  Users,
  Search,
  MoreVertical,
  Shield,
  Trash2,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_CREATORS } from '../data/seedData';

export const DirectMessageModal: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    createGroupChat,
    submitReport,
    videos,
    setCurrentVideoIndex,
    setCurrentScreen
  } = useApp();
  const { currentUser } = useAuth();

  const [messageInput, setMessageInput] = useState('');
  const [searchChat, setSearchChat] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Active conversation object
  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const otherParticipant = activeConv?.participants.find((p) => p.id !== currentUser.id) || INITIAL_CREATORS[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSimulatedVoiceSend = () => {
    if (!activeConv) return;
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      sendMessage(activeConv.id, '🎙️ Voice Note (0:14) • "Here is how to solve step 3..."', 'audio');
    }, 1500);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedGroupMembers.length === 0) return;
    createGroupChat(groupName.trim(), selectedGroupMembers);
    setShowGroupModal(false);
    setGroupName('');
    setSelectedGroupMembers([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-125px)] max-h-[760px] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-2">
      {/* Left Sidebar: Conversations list */}
      <div className={`w-full md:w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/40 ${
        activeConversationId && 'hidden md:flex'
      }`}>
        {/* Top bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-white font-['Outfit']">
              Direct Messages
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <button
            onClick={() => setShowGroupModal(true)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            title="Create Study Group Chat"
          >
            <Users className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">New Group</span>
          </button>
        </div>

        {/* Search Chat Input */}
        <div className="p-3 border-b border-zinc-800/60">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
              placeholder="Search chats or creators..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
          {conversations
            .filter((c) => {
              if (!searchChat) return true;
              const name = c.isGroup ? c.groupName : c.participants.map((p) => p.name).join(' ');
              return (name || '').toLowerCase().includes(searchChat.toLowerCase());
            })
            .map((conv) => {
              const isSelected = conv.id === activeConv?.id;
              const other = conv.participants.find((p) => p.id !== currentUser.id) || INITIAL_CREATORS[0];
              const displayName = conv.isGroup ? conv.groupName : other.name;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-zinc-800/70 border-l-2 border-rose-500' : 'hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    {conv.isGroup ? (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center font-bold text-sm shadow">
                        👥
                      </div>
                    ) : (
                      <img
                        src={other.avatar}
                        alt={other.name}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {displayName}
                      </h4>
                      <span className="text-[10px] text-zinc-500">
                        {conv.updatedAt}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {conv.lastMessage?.text || 'Start conversation...'}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Right Pane: Active Chat Conversation */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-zinc-950">
          {/* Active Chat Top Bar */}
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <div className="flex items-center gap-3">
              {/* Back to list on mobile */}
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-1 text-zinc-400 hover:text-white"
              >
                ←
              </button>

              <div className="relative">
                {activeConv.isGroup ? (
                  <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    👥
                  </div>
                ) : (
                  <img
                    src={otherParticipant.avatar}
                    alt={otherParticipant.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700"
                  />
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-zinc-950" />
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  {activeConv.isGroup ? activeConv.groupName : otherParticipant.name}
                </h3>
                <span className="text-[10px] text-emerald-400 font-medium">
                  Active Now • Online
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  submitReport('user', otherParticipant.id, 'Unwanted messaging or spam', otherParticipant.name);
                  alert(`User @${otherParticipant.username} reported to admin.`);
                }}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                title="Report or Block User"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] text-zinc-500 font-medium bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                End-to-End Educational Discussion
              </span>
            </div>

            {/* Conversation Messages */}
            {activeConv.lastMessage && (
              <div
                className={`flex flex-col ${
                  activeConv.lastMessage.senderId === currentUser.id
                    ? 'items-end'
                    : 'items-start'
                }`}
              >
                {/* If it's a shared Reel */}
                {activeConv.lastMessage.sharedVideoId ? (
                  <div className="max-w-xs bg-zinc-900 border border-zinc-700/80 rounded-2xl p-2.5 shadow-lg space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
                      <Play className="w-3.5 h-3.5 fill-rose-400" />
                      <span>Shared Reel</span>
                    </div>
                    {(() => {
                      const sharedVid = videos.find(
                        (v) => v.id === activeConv.lastMessage?.sharedVideoId
                      );
                      if (!sharedVid) return <p className="text-xs text-zinc-400">{activeConv.lastMessage.text}</p>;
                      return (
                        <div
                          onClick={() => {
                            const idx = videos.findIndex((v) => v.id === sharedVid.id);
                            if (idx >= 0) setCurrentVideoIndex(idx);
                            setCurrentScreen('home');
                          }}
                          className="cursor-pointer group rounded-xl overflow-hidden border border-zinc-800 relative"
                        >
                          <img
                            src={sharedVid.thumbnailUrl}
                            alt={sharedVid.title}
                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                            <span className="text-white text-xs font-bold line-clamp-1">
                              {sharedVid.title}
                            </span>
                            <span className="text-[10px] text-rose-300">
                              Tap to Watch & Take Quiz ↗
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      activeConv.lastMessage.senderId === currentUser.id
                        ? 'bg-rose-500 text-white rounded-br-xs'
                        : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-xs'
                    }`}
                  >
                    {activeConv.lastMessage.text}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500">
                  <span>{activeConv.lastMessage.createdAt}</span>
                  {activeConv.lastMessage.senderId === currentUser.id && (
                    <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </div>
              </div>
            )}

            {isRecordingVoice && (
              <div className="p-3 bg-zinc-900/80 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-xs animate-pulse">
                <Mic className="w-4 h-4" />
                <span>Recording simulated voice message for study partner...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex items-center gap-2"
          >
            {/* Media Attachment buttons */}
            <button
              type="button"
              onClick={() => {
                sendMessage(activeConv.id, '📷 Shared Study Diagram: "Periodic Table Cheat Sheet"', 'image');
              }}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Share Image"
            >
              <Image className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleSimulatedVoiceSend}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Record Voice Note"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type message, question or learning tip..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 shadow-md"
            >
              <Send className="w-4 h-4 translate-x-0.5" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-zinc-500">
          <p className="text-sm">Select a conversation to start messaging creators and study groups.</p>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-base">
                Create Study & Quiz Group
              </h3>
              <button
                onClick={() => setShowGroupModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 my-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. UPSC Prelims Study Circle"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-2">Select Members</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {INITIAL_CREATORS.map((c) => {
                    const isSelected = selectedGroupMembers.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedGroupMembers((prev) => prev.filter((id) => id !== c.id));
                          } else {
                            setSelectedGroupMembers((prev) => [...prev, c.id]);
                          }
                        }}
                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-white'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold">{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={!groupName.trim() || selectedGroupMembers.length === 0}
                className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-bold transition-colors"
              >
                Create Group Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
