import React from 'react';
import {
  X,
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Trophy,
  Video,
  CheckCheck,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationCenter: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    setCurrentVideoIndex,
    setCurrentScreen,
    setQuizHubOpen,
    videos
  } = useApp();

  if (!notificationsOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'quiz_result':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'new_video':
        return <Video className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  const handleClickNotification = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.targetVideoId) {
      const idx = videos.findIndex((v) => v.id === notif.targetVideoId);
      if (idx >= 0) {
        setCurrentVideoIndex(idx);
        setCurrentScreen('home');
      }
    } else if (notif.type === 'quiz_result') {
      setQuizHubOpen(true);
    }
    setNotificationsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4">
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl h-[85vh] max-h-[640px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 mt-12 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-white text-base">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark Read</span>
              </button>
            )}
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              <Bell className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No notifications</p>
              <p className="text-xs text-zinc-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleClickNotification(notif)}
                className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                  notif.isRead ? 'bg-transparent hover:bg-zinc-900/40' : 'bg-zinc-900/80 hover:bg-zinc-900'
                }`}
              >
                {/* User avatar or icon */}
                <div className="relative shrink-0">
                  {notif.actor ? (
                    <img
                      src={notif.actor.avatar}
                      alt={notif.actor.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                      {getNotificationIcon(notif.type)}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-zinc-950 border border-zinc-800">
                    {getNotificationIcon(notif.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-200 leading-snug">
                    <strong className="text-white font-semibold mr-1">
                      {notif.actor?.name || 'EduShorts'}
                    </strong>
                    {notif.text}
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    {notif.createdAt}
                  </span>
                </div>

                {/* Unread indicator dot */}
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
