import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  FeedCategory,
  UserProfile,
  VideoItem,
  CommentItem,
  QuizQuestion,
  ChatConversation,
  NotificationItem,
  ContentReport,
  LeaderboardEntry,
  DirectMessage
} from '../types';
import {
  INITIAL_VIDEOS,
  INITIAL_COMMENTS,
  INITIAL_LEADERBOARD,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CREATORS
} from '../data/seedData';
import { useAuth } from './AuthContext';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, limit } from 'firebase/firestore';

interface AppContextType {
  // Feed & Videos
  videos: VideoItem[];
  currentVideoIndex: number;
  setCurrentVideoIndex: (idx: number) => void;
  activeFeedTab: 'for_you' | 'following' | 'trending' | 'latest';
  setActiveFeedTab: (tab: 'for_you' | 'following' | 'trending' | 'latest') => void;
  activeCategory: FeedCategory;
  setActiveCategory: (cat: FeedCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredVideos: VideoItem[];
  addVideo: (video: Omit<VideoItem, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'viewsCount' | 'createdAt'>) => Promise<void>;
  
  // Likes & Saves & Follows
  likedVideoIds: Set<string>;
  toggleLikeVideo: (videoId: string) => void;
  savedVideoIds: Set<string>;
  toggleSaveVideo: (videoId: string) => void;
  followingIds: Set<string>;
  toggleFollowUser: (userId: string) => void;
  
  // Comments
  comments: Record<string, CommentItem[]>;
  activeCommentVideoId: string | null;
  setActiveCommentVideoId: (id: string | null) => void;
  addComment: (videoId: string, text: string, parentId?: string | null) => void;
  likeComment: (videoId: string, commentId: string) => void;
  pinComment: (videoId: string, commentId: string) => void;
  deleteComment: (videoId: string, commentId: string) => void;

  // Sharing
  activeShareVideo: VideoItem | null;
  setActiveShareVideo: (v: VideoItem | null) => void;
  incrementShareCount: (videoId: string) => void;

  // Quizzes & Leaderboard
  activeQuiz: QuizQuestion | null;
  setActiveQuiz: (q: QuizQuestion | null) => void;
  answeredQuizIds: Set<string>;
  answerQuiz: (quizId: string, selectedIdx: number) => boolean;
  leaderboard: LeaderboardEntry[];
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;

  // Direct Messages / Chat
  conversations: ChatConversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (convId: string, text: string, mediaType?: 'image' | 'video' | 'audio' | 'reel', sharedVideoId?: string) => void;
  shareVideoToChat: (videoId: string, recipientUserId: string) => void;
  deleteMessage: (convId: string, msgId: string) => void;
  createGroupChat: (name: string, memberIds: string[]) => void;

  // Reports & Safety
  reports: ContentReport[];
  submitReport: (targetType: 'video' | 'comment' | 'user', targetId: string, reason: string, targetTitle?: string) => void;
  bannedUserIds: Set<string>;
  mutedUserIds: Set<string>;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  removeVideoByAdmin: (videoId: string) => void;
  dismissReport: (reportId: string) => void;

  // Navigation & Modals
  currentScreen: 'home' | 'shorts' | 'messages' | 'profile' | 'explore' | 'quizzes';
  setCurrentScreen: (screen: 'home' | 'shorts' | 'messages' | 'profile' | 'explore' | 'quizzes') => void;
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  creatorDashboardOpen: boolean;
  setCreatorDashboardOpen: (open: boolean) => void;
  adminPanelOpen: boolean;
  setAdminPanelOpen: (open: boolean) => void;
  liveStreamOpen: boolean;
  setLiveStreamOpen: (open: boolean) => void;
  quizHubOpen: boolean;
  setQuizHubOpen: (open: boolean) => void;
  leaderboardModalOpen: boolean;
  setLeaderboardModalOpen: (open: boolean) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;

  // User Profile inspection
  viewingProfile: UserProfile | null;
  setViewingProfile: (user: UserProfile | null) => void;

  // Creator Earnings
  creatorTipsTotal: number;
  sendTipToCreator: (creatorId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile } = useAuth();

  // Primary State
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const cached = localStorage.getItem('edushorts_videos');
    return cached ? JSON.parse(cached) : INITIAL_VIDEOS;
  });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeFeedTab, setActiveFeedTab] = useState<'for_you' | 'following' | 'trending' | 'latest'>('for_you');
  const [activeCategory, setActiveCategory] = useState<FeedCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Likes, saves, follows
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(() => {
    const cached = localStorage.getItem('edushorts_liked');
    return cached ? new Set(JSON.parse(cached)) : new Set(['vid_gk_india_animal']);
  });
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(() => {
    const cached = localStorage.getItem('edushorts_saved');
    return cached ? new Set(JSON.parse(cached)) : new Set(['vid_ai_transformers']);
  });
  const [followingIds, setFollowingIds] = useState<Set<string>>(() => {
    const cached = localStorage.getItem('edushorts_follows');
    return cached ? new Set(JSON.parse(cached)) : new Set(['user_gk_priya', 'user_science_vikram']);
  });

  // Comments
  const [comments, setComments] = useState<Record<string, CommentItem[]>>(() => {
    const cached = localStorage.getItem('edushorts_comments');
    return cached ? JSON.parse(cached) : INITIAL_COMMENTS;
  });
  const [activeCommentVideoId, setActiveCommentVideoId] = useState<string | null>(null);

  // Shares
  const [activeShareVideo, setActiveShareVideo] = useState<VideoItem | null>(null);

  // Quizzes & Leaderboard
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [answeredQuizIds, setAnsweredQuizIds] = useState<Set<string>>(() => {
    const cached = localStorage.getItem('edushorts_answered_quizzes');
    return cached ? new Set(JSON.parse(cached)) : new Set();
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const cached = localStorage.getItem('edushorts_leaderboard');
    return cached ? JSON.parse(cached) : INITIAL_LEADERBOARD;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const cached = localStorage.getItem('edushorts_notifs');
    return cached ? JSON.parse(cached) : INITIAL_NOTIFICATIONS;
  });

  // Chat
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const cached = localStorage.getItem('edushorts_convs');
    return cached ? JSON.parse(cached) : INITIAL_CONVERSATIONS;
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Safety & Moderation
  const [reports, setReports] = useState<ContentReport[]>(() => {
    const cached = localStorage.getItem('edushorts_reports');
    return cached ? JSON.parse(cached) : [
      {
        id: 'rep_1',
        reporterId: 'user_102',
        reporterName: 'Meera Iyer',
        targetType: 'comment',
        targetId: 'comm_spam_1',
        targetTitle: 'Promotion of unofficial telegram link',
        reason: 'Spam or irrelevant advertising',
        status: 'pending',
        createdAt: '3 hours ago'
      }
    ];
  });
  const [bannedUserIds, setBannedUserIds] = useState<Set<string>>(new Set());
  const [mutedUserIds, setMutedUserIds] = useState<Set<string>>(new Set());

  // UI Navigation & Modals
  const [currentScreen, setCurrentScreen] = useState<'home' | 'shorts' | 'messages' | 'profile' | 'explore' | 'quizzes'>('home');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatorDashboardOpen, setCreatorDashboardOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [liveStreamOpen, setLiveStreamOpen] = useState(false);
  const [quizHubOpen, setQuizHubOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [creatorTipsTotal, setCreatorTipsTotal] = useState(380);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('edushorts_videos', JSON.stringify(videos));
  }, [videos]);
  useEffect(() => {
    localStorage.setItem('edushorts_liked', JSON.stringify(Array.from(likedVideoIds)));
  }, [likedVideoIds]);
  useEffect(() => {
    localStorage.setItem('edushorts_saved', JSON.stringify(Array.from(savedVideoIds)));
  }, [savedVideoIds]);
  useEffect(() => {
    localStorage.setItem('edushorts_follows', JSON.stringify(Array.from(followingIds)));
  }, [followingIds]);
  useEffect(() => {
    localStorage.setItem('edushorts_comments', JSON.stringify(comments));
  }, [comments]);
  useEffect(() => {
    localStorage.setItem('edushorts_answered_quizzes', JSON.stringify(Array.from(answeredQuizIds)));
  }, [answeredQuizIds]);
  useEffect(() => {
    localStorage.setItem('edushorts_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);
  useEffect(() => {
    localStorage.setItem('edushorts_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('edushorts_convs', JSON.stringify(conversations));
  }, [conversations]);
  useEffect(() => {
    localStorage.setItem('edushorts_reports', JSON.stringify(reports));
  }, [reports]);

  // Firestore sync: Try loading newly published videos from Firestore
  useEffect(() => {
    const fetchFirestoreVideos = async () => {
      try {
        const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const firestoreVideos: VideoItem[] = [];
          querySnapshot.forEach((docSnap) => {
            firestoreVideos.push({ id: docSnap.id, ...docSnap.data() } as VideoItem);
          });
          // Merge unique
          setVideos((prev) => {
            const existingIds = new Set(prev.map(v => v.id));
            const newOnes = firestoreVideos.filter(v => !existingIds.has(v.id));
            return [...newOnes, ...prev];
          });
        }
      } catch (err) {
        console.warn('Firestore fetch fallback (using seed data):', err);
      }
    };
    fetchFirestoreVideos();
  }, []);

  // Filtered videos based on active feed tab, category, search query, banned users
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Exclude banned creators
      if (bannedUserIds.has(video.creatorId)) return false;

      // Category filter
      if (activeCategory !== 'All' && video.category !== activeCategory) {
        return false;
      }

      // Feed tab filter
      if (activeFeedTab === 'following') {
        if (!followingIds.has(video.creatorId)) return false;
      } else if (activeFeedTab === 'trending') {
        if (!video.isTrending && video.viewsCount < 150000) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(q);
        const matchesDesc = video.description.toLowerCase().includes(q);
        const matchesCreator = video.creator.name.toLowerCase().includes(q) || video.creator.username.toLowerCase().includes(q);
        const matchesTag = video.hashtags.some((h) => h.toLowerCase().includes(q));
        const matchesCat = video.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCreator && !matchesTag && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [videos, bannedUserIds, activeCategory, activeFeedTab, followingIds, searchQuery]);

  // Likes
  const toggleLikeVideo = (videoId: string) => {
    soundFx.playLike();
    setLikedVideoIds((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(videoId);
      if (isLiked) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      // Update count on video
      setVideos((vList) =>
        vList.map((v) =>
          v.id === videoId ? { ...v, likesCount: v.likesCount + (isLiked ? -1 : 1) } : v
        )
      );
      return next;
    });
  };

  // Saves / Bookmarks
  const toggleSaveVideo = (videoId: string) => {
    setSavedVideoIds((prev) => {
      const next = new Set(prev);
      const isSaved = next.has(videoId);
      if (isSaved) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      setVideos((vList) =>
        vList.map((v) =>
          v.id === videoId ? { ...v, savesCount: v.savesCount + (isSaved ? -1 : 1) } : v
        )
      );
      return next;
    });
  };

  // Follow creator
  const toggleFollowUser = (userId: string) => {
    setFollowingIds((prev) => {
      const next = new Set(prev);
      const isFollowing = next.has(userId);
      if (isFollowing) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  // Comments
  const addComment = (videoId: string, text: string, parentId: string | null = null) => {
    if (!text.trim()) return;
    const newComment: CommentItem = {
      id: `comm_${Date.now()}`,
      videoId,
      userId: currentUser.id,
      user: currentUser,
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      isPinned: false,
      parentId
    };

    setComments((prev) => {
      const currentList = prev[videoId] || [];
      if (parentId) {
        // Find parent and append to replies
        const updated = currentList.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment]
            };
          }
          return c;
        });
        return { ...prev, [videoId]: updated };
      } else {
        return { ...prev, [videoId]: [newComment, ...currentList] };
      }
    });

    setVideos((vList) =>
      vList.map((v) =>
        v.id === videoId ? { ...v, commentsCount: v.commentsCount + 1 } : v
      )
    );
  };

  const likeComment = (videoId: string, commentId: string) => {
    soundFx.playLike();
    setComments((prev) => {
      const list = prev[videoId] || [];
      const updated = list.map((c) => {
        if (c.id === commentId) {
          const liked = !c.isLiked;
          return {
            ...c,
            isLiked: liked,
            likesCount: c.likesCount + (liked ? 1 : -1)
          };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((rep) => {
              if (rep.id === commentId) {
                const repLiked = !rep.isLiked;
                return {
                  ...rep,
                  isLiked: repLiked,
                  likesCount: rep.likesCount + (repLiked ? 1 : -1)
                };
              }
              return rep;
            })
          };
        }
        return c;
      });
      return { ...prev, [videoId]: updated };
    });
  };

  const pinComment = (videoId: string, commentId: string) => {
    setComments((prev) => {
      const list = prev[videoId] || [];
      const updated = list.map((c) => ({
        ...c,
        isPinned: c.id === commentId ? !c.isPinned : c.isPinned
      }));
      // sort so pinned is on top
      updated.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
      return { ...prev, [videoId]: updated };
    });
  };

  const deleteComment = (videoId: string, commentId: string) => {
    setComments((prev) => {
      const list = prev[videoId] || [];
      const updated = list
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies ? c.replies.filter((r) => r.id !== commentId) : []
        }));
      return { ...prev, [videoId]: updated };
    });
    setVideos((vList) =>
      vList.map((v) =>
        v.id === videoId ? { ...v, commentsCount: Math.max(0, v.commentsCount - 1) } : v
      )
    );
  };

  // Shares
  const incrementShareCount = (videoId: string) => {
    setVideos((vList) =>
      vList.map((v) =>
        v.id === videoId ? { ...v, sharesCount: v.sharesCount + 1 } : v
      )
    );
  };

  // Quizzes & Points
  const answerQuiz = (quizId: string, selectedIdx: number): boolean => {
    let targetQuiz: QuizQuestion | undefined;
    for (const v of videos) {
      if (v.quiz && v.quiz.id === quizId) {
        targetQuiz = v.quiz;
        break;
      }
    }
    if (!targetQuiz) return false;

    const isCorrect = selectedIdx === targetQuiz.correctIndex;
    setAnsweredQuizIds((prev) => new Set(prev).add(quizId));

    if (isCorrect) {
      soundFx.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const addedPoints = targetQuiz.points || 50;
      updateProfile({
        quizPoints: (currentUser.quizPoints || 0) + addedPoints
      });

      // Update leaderboard entry for current user
      setLeaderboard((prev) => {
        const updated = prev.map((entry) => {
          if (entry.user.id === currentUser.id) {
            return {
              ...entry,
              points: entry.points + addedPoints,
              quizzesSolved: entry.quizzesSolved + 1
            };
          }
          return entry;
        });
        updated.sort((a, b) => b.points - a.points);
        return updated.map((e, idx) => ({ ...e, rank: idx + 1 }));
      });
    } else {
      soundFx.playIncorrect();
    }
    return isCorrect;
  };

  // Notifications
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: 'Just now',
      isRead: false
    };
    soundFx.playNotification();
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Direct Chat
  const sendMessage = (
    convId: string,
    text: string,
    mediaType: 'image' | 'video' | 'audio' | 'reel' = 'image',
    sharedVideoId?: string
  ) => {
    if (!text.trim() && !sharedVideoId) return;
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      mediaType: sharedVideoId ? 'reel' : (mediaType || undefined),
      sharedVideoId,
      createdAt: 'Just now',
      isRead: false
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === convId) {
          return {
            ...conv,
            lastMessage: newMsg,
            updatedAt: 'Just now'
          };
        }
        return conv;
      })
    );
  };

  const shareVideoToChat = (videoId: string, recipientUserId: string) => {
    let conv = conversations.find(
      (c) => !c.isGroup && c.participantIds.includes(recipientUserId)
    );
    const v = videos.find((item) => item.id === videoId);
    const shareText = `Shared Reel: "${v?.title || 'Educational Video'}"`;

    if (conv) {
      sendMessage(conv.id, shareText, 'reel', videoId);
    } else {
      // Create conversation
      const otherCreator = INITIAL_CREATORS.find((c) => c.id === recipientUserId) || {
        id: recipientUserId,
        name: 'Creator',
        username: 'creator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bio: '',
        followersCount: 10,
        followingCount: 10,
        likesReceivedCount: 10,
        quizPoints: 100,
        isCreator: true,
        badges: []
      };
      const newConvId = `conv_${Date.now()}`;
      const newConv: ChatConversation = {
        id: newConvId,
        participantIds: [currentUser.id, recipientUserId],
        participants: [currentUser, otherCreator],
        unreadCount: 0,
        isGroup: false,
        updatedAt: 'Just now',
        lastMessage: {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: recipientUserId,
          text: shareText,
          mediaType: 'reel',
          sharedVideoId: videoId,
          createdAt: 'Just now',
          isRead: false
        }
      };
      setConversations((prev) => [newConv, ...prev]);
    }
  };

  const deleteMessage = (_convId: string, _msgId: string) => {
    // Message deleted locally
  };

  const createGroupChat = (name: string, memberIds: string[]) => {
    const members = INITIAL_CREATORS.filter((c) => memberIds.includes(c.id));
    const newConv: ChatConversation = {
      id: `conv_grp_${Date.now()}`,
      participantIds: [currentUser.id, ...memberIds],
      participants: [currentUser, ...members],
      unreadCount: 0,
      isGroup: true,
      groupName: name,
      updatedAt: 'Just now',
      lastMessage: {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        groupId: `conv_grp_${Date.now()}`,
        text: `Group "${name}" created. Start learning together!`,
        createdAt: 'Just now',
        isRead: true
      }
    };
    setConversations((prev) => [newConv, ...prev]);
  };

  // Reporting & Moderation
  const submitReport = (
    targetType: 'video' | 'comment' | 'user',
    targetId: string,
    reason: string,
    targetTitle?: string
  ) => {
    const newReport: ContentReport = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType,
      targetId,
      targetTitle,
      reason,
      status: 'pending',
      createdAt: 'Just now'
    };
    setReports((prev) => [newReport, ...prev]);
    // Save to Firestore reports collection
    try {
      addDoc(collection(db, 'reports'), newReport).catch(() => {});
    } catch {
      // ignore
    }
  };

  const banUser = (userId: string) => {
    setBannedUserIds((prev) => new Set(prev).add(userId));
  };

  const unbanUser = (userId: string) => {
    setBannedUserIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const removeVideoByAdmin = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  // Add Video
  const addVideo = async (
    videoData: Omit<VideoItem, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'savesCount' | 'viewsCount' | 'createdAt'>
  ) => {
    const newVideo: VideoItem = {
      ...videoData,
      id: `vid_custom_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      createdAt: 'Just now',
      isTrending: false
    };

    setVideos((prev) => [newVideo, ...prev]);
    setCurrentVideoIndex(0);

    // Save to Firestore
    try {
      await addDoc(collection(db, 'videos'), newVideo);
    } catch (err) {
      console.warn('Firestore video write fallback:', err);
    }
  };

  // Tips / Creator Earnings
  const sendTipToCreator = (creatorId: string, amount: number) => {
    setCreatorTipsTotal((prev) => prev + amount);
    soundFx.playCorrect();
    confetti({ particleCount: 50, spread: 60 });
    addNotification({
      userId: creatorId,
      sender: currentUser,
      type: 'achievement',
      content: `sent you a $${amount} creator reward tip for your educational video!`
    });
  };

  return (
    <AppContext.Provider
      value={{
        videos,
        currentVideoIndex,
        setCurrentVideoIndex,
        activeFeedTab,
        setActiveFeedTab,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filteredVideos,
        addVideo,
        likedVideoIds,
        toggleLikeVideo,
        savedVideoIds,
        toggleSaveVideo,
        followingIds,
        toggleFollowUser,
        comments,
        activeCommentVideoId,
        setActiveCommentVideoId,
        addComment,
        likeComment,
        pinComment,
        deleteComment,
        activeShareVideo,
        setActiveShareVideo,
        incrementShareCount,
        activeQuiz,
        setActiveQuiz,
        answeredQuizIds,
        answerQuiz,
        leaderboard,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        addNotification,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        shareVideoToChat,
        deleteMessage,
        createGroupChat,
        reports,
        submitReport,
        bannedUserIds,
        mutedUserIds,
        banUser,
        unbanUser,
        removeVideoByAdmin,
        dismissReport,
        currentScreen,
        setCurrentScreen,
        createModalOpen,
        setCreateModalOpen,
        creatorDashboardOpen,
        setCreatorDashboardOpen,
        adminPanelOpen,
        setAdminPanelOpen,
        liveStreamOpen,
        setLiveStreamOpen,
        quizHubOpen,
        setQuizHubOpen,
        leaderboardModalOpen,
        setLeaderboardModalOpen,
        searchModalOpen,
        setSearchModalOpen,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        viewingProfile,
        setViewingProfile,
        creatorTipsTotal,
        sendTipToCreator
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
