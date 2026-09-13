export type FeedCategory = 
  | 'All'
  | 'General Knowledge'
  | 'Education'
  | 'English Speaking'
  | 'Mathematics'
  | 'Science'
  | 'Technology'
  | 'Computer'
  | 'Artificial Intelligence'
  | 'Business'
  | 'Digital Marketing'
  | 'Career'
  | 'Motivation'
  | 'History'
  | 'Geography'
  | 'Travel'
  | 'Life Skills'
  | 'Current Affairs'
  | 'Competitive Exam Preparation';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  likesReceivedCount: number;
  quizPoints: number;
  quizzesSolved?: number;
  isCreator: boolean;
  isVerified?: boolean;
  role?: 'student' | 'creator' | 'admin';
  badges: string[];
  earnings?: number;
  coverImage?: string;
  joinedDate?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
  category: FeedCategory;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  creatorId: string;
  creator: UserProfile;
  category: FeedCategory;
  hashtags: string[];
  musicTitle: string;
  duration: number; // in seconds
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  createdAt: string;
  quiz?: QuizQuestion;
  isTrending?: boolean;
  filterEffect?: string;
}

export interface CommentItem {
  id: string;
  videoId: string;
  userId: string;
  user: UserProfile;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
  parentId?: string | null;
  replies?: CommentItem[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'reel';
  sharedVideoId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  participants: UserProfile[];
  lastMessage?: DirectMessage;
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  sender: UserProfile;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'message' | 'quiz' | 'achievement' | 'live' | 'share';
  content: string;
  videoId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'video' | 'comment' | 'user';
  targetId: string;
  targetTitle?: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: UserProfile;
  points: number;
  quizzesSolved: number;
  badge: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  author: UserProfile;
  content: string;
  type: 'question' | 'notes' | 'discussion';
  likesCount: number;
  repliesCount: number;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface LearningCommunity {
  id: string;
  name: string;
  category: FeedCategory;
  description: string;
  avatarEmoji: string;
  membersCount: number;
  posts: CommunityPost[];
}

export interface EduStory {
  id: string;
  creator: UserProfile;
  mediaUrl: string;
  caption: string;
  type: 'image' | 'video';
  timestamp: string;
  isLive?: boolean;
  quizSnippet?: {
    question: string;
    answer: string;
  };
}
