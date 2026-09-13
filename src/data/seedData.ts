import { FeedCategory, UserProfile, VideoItem, CommentItem, QuizQuestion, ChatConversation, NotificationItem, LeaderboardEntry, LearningCommunity, EduStory } from '../types';

export const CATEGORIES: FeedCategory[] = [
  'All',
  'General Knowledge',
  'Education',
  'English Speaking',
  'Mathematics',
  'Science',
  'Technology',
  'Computer',
  'Artificial Intelligence',
  'Business',
  'Digital Marketing',
  'Career',
  'Motivation',
  'History',
  'Geography',
  'Travel',
  'Life Skills',
  'Current Affairs',
  'Competitive Exam Preparation'
];

export const INITIAL_CREATORS: UserProfile[] = [
  {
    id: 'user_science_vikram',
    name: 'Dr. Vikram Sarabhai Academy',
    username: 'vikram_physics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Astrophysics & Modern Quantum Mechanics simplified for curious minds 🚀 Astrophysics PhD. Daily 60-second discoveries.',
    followersCount: 142800,
    followingCount: 182,
    likesReceivedCount: 2450000,
    quizPoints: 4200,
    isCreator: true,
    isVerified: true,
    role: 'creator',
    badges: ['Top Science Creator', 'Quiz Master', 'Edu Pioneer'],
    earnings: 3420.50,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    joinedDate: 'Jan 2024'
  },
  {
    id: 'user_english_ananya',
    name: 'Ananya Sharma | English Coach',
    username: 'fluent_ananya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Native phrasing, pronunciation secrets & IELTS 8.5+ band hacks 🎙️ Oxford certified trainer. 500k+ learners transformed.',
    followersCount: 285400,
    followingCount: 95,
    likesReceivedCount: 4120000,
    quizPoints: 6100,
    isCreator: true,
    isVerified: true,
    role: 'creator',
    badges: ['Language Guru', 'Trending Educator'],
    earnings: 5890.00,
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    joinedDate: 'Feb 2024'
  },
  {
    id: 'user_math_raman',
    name: 'Raman Vedic Maths',
    username: 'speedmath_raman',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Calculate 10x faster than a calculator without pencil or paper ⚡ Vedic Math techniques for SSC, UPSC & Olympiads.',
    followersCount: 198000,
    followingCount: 45,
    likesReceivedCount: 3890000,
    quizPoints: 5350,
    isCreator: true,
    isVerified: true,
    role: 'creator',
    badges: ['Math Wizard', 'Top Rated'],
    earnings: 4120.75,
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
    joinedDate: 'Nov 2023'
  },
  {
    id: 'user_ai_rohit',
    name: 'Rohit Tech & AI Lab',
    username: 'rohit_ai_insights',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Silicon Valley AI Engineer. Demystifying Neural Nets, LLMs, prompt engineering & tech careers 🤖',
    followersCount: 312000,
    followingCount: 210,
    likesReceivedCount: 5240000,
    quizPoints: 7800,
    isCreator: true,
    isVerified: true,
    role: 'creator',
    badges: ['AI Pioneer', 'Tech Mastermind'],
    earnings: 7240.20,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    joinedDate: 'Dec 2023'
  },
  {
    id: 'user_gk_priya',
    name: 'Priya Verma (IAS Exam Guide)',
    username: 'upsc_priya_gk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Civil Services mentor & Current Affairs specialist. Daily crisp notes & Indian Constitution quizzes 🇮🇳',
    followersCount: 420000,
    followingCount: 88,
    likesReceivedCount: 6890000,
    quizPoints: 8900,
    isCreator: true,
    isVerified: true,
    role: 'creator',
    badges: ['IAS Mentor', 'Civics Ace'],
    earnings: 8910.00,
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    joinedDate: 'Jan 2024'
  },
  {
    id: 'user_history_karan',
    name: 'Karan Chronicles | World History',
    username: 'history_karan',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Uncovering the secrets of ancient empires, trade routes and forgotten revolutions 🏺',
    followersCount: 165000,
    followingCount: 110,
    likesReceivedCount: 2900000,
    quizPoints: 4800,
    isCreator: true,
    isVerified: false,
    role: 'creator',
    badges: ['History Sleuth'],
    earnings: 2750.00,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80',
    joinedDate: 'Mar 2024'
  }
];

export const CURRENT_USER_DEFAULT: UserProfile = {
  id: 'current_user_1',
  name: 'Saidul Ali',
  username: 'saidul_learner',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Passionate student of Science & Technology. Exploring AI, coding and general knowledge daily! 📚✨',
  followersCount: 840,
  followingCount: 36,
  likesReceivedCount: 1240,
  quizPoints: 1280,
  isCreator: true,
  isVerified: false,
  role: 'student',
  badges: ['Active Learner', 'Science Enthusiast', 'Streak 14 Days'],
  earnings: 145.00,
  coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  joinedDate: 'Apr 2024'
};

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid_gk_india_animal',
    title: 'National Symbols of India & The Story of the Royal Bengal Tiger 🇮🇳',
    description: 'Did you know the Lion was originally the national animal of India until 1973? Here is why it was changed and the conservation revolution that followed.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80',
    creatorId: 'user_gk_priya',
    creator: INITIAL_CREATORS[4],
    category: 'General Knowledge',
    hashtags: ['#GK', '#IndiaFacts', '#Knowledge', '#CompetitiveExams', '#Education'],
    musicTitle: 'Original Audio - Priya Verma • GK Byte',
    duration: 38,
    likesCount: 24500,
    commentsCount: 840,
    sharesCount: 3200,
    savesCount: 5120,
    viewsCount: 184000,
    createdAt: '2 hours ago',
    isTrending: true,
    quiz: {
      id: 'quiz_gk_animal',
      question: 'Which magnificent creature is the official National Animal of India?',
      options: ['Asiatic Lion', 'Royal Bengal Tiger', 'Indian Elephant', 'Blackbuck Deer'],
      correctIndex: 1,
      explanation: 'The Royal Bengal Tiger (Panthera tigris tigris) was declared the national animal of India in April 1973 with the launch of Project Tiger.',
      points: 50,
      category: 'General Knowledge'
    }
  },
  {
    id: 'vid_ai_transformers',
    title: 'How ChatGPT & Transformer AI Actually Work in 45 Seconds 🤖',
    description: 'Forget complex mathematics! Understand Self-Attention mechanisms and tokens like a 5-year old. Why Transformers revolutionized computing forever.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    creatorId: 'user_ai_rohit',
    creator: INITIAL_CREATORS[3],
    category: 'Artificial Intelligence',
    hashtags: ['#AI', '#MachineLearning', '#Technology', '#Computer', '#DeepLearning'],
    musicTitle: 'Cyber Synth Beats - Rohit AI Lab',
    duration: 45,
    likesCount: 38900,
    commentsCount: 1420,
    sharesCount: 7800,
    savesCount: 14200,
    viewsCount: 310000,
    createdAt: '4 hours ago',
    isTrending: true,
    quiz: {
      id: 'quiz_ai_trans',
      question: 'What foundational mechanism enables Transformers to weigh the relevance of different words in a sentence?',
      options: ['Convolutional Filter', 'Self-Attention Mechanism', 'Binary Decision Tree', 'Random Forest Sampling'],
      correctIndex: 1,
      explanation: 'Self-Attention allows neural networks to correlate different positions of a single sequence in order to compute a representation of the sequence.',
      points: 75,
      category: 'Artificial Intelligence'
    }
  },
  {
    id: 'vid_english_fluent',
    title: 'Stop Saying "Very Tired"! Use These 5 Natural Native Expressions 🎙️',
    description: 'Sound more fluent and natural in professional interviews & daily conversations. Upgrade your English vocabulary with these idiom swaps!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80',
    creatorId: 'user_english_ananya',
    creator: INITIAL_CREATORS[1],
    category: 'English Speaking',
    hashtags: ['#English', '#Vocabulary', '#Pronunciation', '#Fluency', '#Education'],
    musicTitle: 'Calm Acoustic Chords - Fluent Ananya',
    duration: 32,
    likesCount: 52100,
    commentsCount: 960,
    sharesCount: 12400,
    savesCount: 22800,
    viewsCount: 460000,
    createdAt: '1 day ago',
    isTrending: true,
    quiz: {
      id: 'quiz_english_vocab',
      question: 'Which of the following phrases is an authentic idiom meaning "completely exhausted"?',
      options: ['Over the moon', 'Bone tired / Dead on my feet', 'Bite the bullet', 'Barking up the wrong tree'],
      correctIndex: 1,
      explanation: '"Dead on my feet" or "Bone tired" means extremely fatigued or exhausted after a hard day.',
      points: 50,
      category: 'English Speaking'
    }
  },
  {
    id: 'vid_science_rainbow',
    title: 'The Hidden Physics of Double Rainbows: Total Internal Reflection 🌈',
    description: 'Why is the color order reversed in a secondary rainbow? Sunlight hits raindrops, refracts, reflects twice, and emerges inverted at 51 degrees!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    creatorId: 'user_science_vikram',
    creator: INITIAL_CREATORS[0],
    category: 'Science',
    hashtags: ['#Science', '#Physics', '#Optics', '#Nature', '#Learning'],
    musicTitle: 'Ambient Cosmos - Dr. Vikram Physics',
    duration: 52,
    likesCount: 19800,
    commentsCount: 650,
    sharesCount: 2900,
    savesCount: 6800,
    viewsCount: 142000,
    createdAt: '2 days ago',
    isTrending: false,
    quiz: {
      id: 'quiz_science_rainbow',
      question: 'What causes the colors to be inverted in the secondary (outer) rainbow?',
      options: ['The presence of dust particles', 'Two internal reflections inside water droplets', 'Atmospheric gravity variations', 'Polarized ultraviolet rays'],
      correctIndex: 1,
      explanation: 'Secondary rainbows occur when sunlight undergoes two internal reflections inside raindrops, flipping the color spectrum upside down.',
      points: 60,
      category: 'Science'
    }
  },
  {
    id: 'vid_math_speed',
    title: 'Vedic Math Trick: Multiply Any 2-Digit Number in 3 Seconds ⚡',
    description: 'Master the "Vertically and Crosswise" formula (Urdhva Tiryagbhyam). Supercharge your competitive exam calculation speed without paper work!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    creatorId: 'user_math_raman',
    creator: INITIAL_CREATORS[2],
    category: 'Mathematics',
    hashtags: ['#Mathematics', '#VedicMath', '#SpeedMath', '#Exams', '#MathTricks'],
    musicTitle: 'Upbeat Lo-Fi Beat - Raman Maths',
    duration: 40,
    likesCount: 44300,
    commentsCount: 1890,
    sharesCount: 9400,
    savesCount: 19500,
    viewsCount: 395000,
    createdAt: '3 days ago',
    isTrending: true,
    quiz: {
      id: 'quiz_math_vedic',
      question: 'Using the shortcut, what is 23 × 27 when units digits sum to 10 and tens digits are identical?',
      options: ['521', '621', '641', '721'],
      correctIndex: 1,
      explanation: 'Multiply tens by its successor: 2 × (2+1) = 6. Multiply units: 3 × 7 = 21. Put together: 621!',
      points: 50,
      category: 'Mathematics'
    }
  },
  {
    id: 'vid_history_indus',
    title: 'The 4,500-Year-Old Engineering of the Indus Valley Civilization 🏛️',
    description: 'Grid street layout, baked uniform bricks, underground covered drainage systems, and granaries. Discover why Harappa and Mohenjo-daro stun modern architects.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599837565318-67429bde7162?w=800&auto=format&fit=crop&q=80',
    creatorId: 'user_history_karan',
    creator: INITIAL_CREATORS[5],
    category: 'History',
    hashtags: ['#History', '#Archaeology', '#IndusValley', '#AncientIndia', '#Education'],
    musicTitle: 'Ancient Flute Strings - Karan Chronicles',
    duration: 58,
    likesCount: 16700,
    commentsCount: 430,
    sharesCount: 1850,
    savesCount: 4900,
    viewsCount: 98000,
    createdAt: '4 days ago',
    isTrending: false,
    quiz: {
      id: 'quiz_history_harappa',
      question: 'Which famous archaeological site of the Indus Valley civilization had the Great Bath?',
      options: ['Lothal', 'Mohenjo-daro', 'Kalibangan', 'Rakhigarhi'],
      correctIndex: 1,
      explanation: 'The Great Bath was discovered at Mohenjo-daro in Sindh, Pakistan, built with finely fitted bricks and waterproof bitumen.',
      points: 50,
      category: 'History'
    }
  }
];

export const INITIAL_COMMENTS: Record<string, CommentItem[]> = {
  vid_gk_india_animal: [
    {
      id: 'comm_1',
      videoId: 'vid_gk_india_animal',
      userId: 'user_101',
      user: {
        id: 'user_101',
        name: 'Rahul Sharma',
        username: 'rahul_ias_2026',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: 'Civil services aspirant',
        followersCount: 120,
        followingCount: 450,
        likesReceivedCount: 340,
        quizPoints: 850,
        isCreator: false,
        badges: []
      },
      text: 'This is very useful information! I never knew the lion was the national animal before 1973.',
      createdAt: '1 hour ago',
      likesCount: 125,
      isLiked: false,
      isPinned: true,
      replies: [
        {
          id: 'comm_1_rep_1',
          videoId: 'vid_gk_india_animal',
          userId: 'user_gk_priya',
          user: INITIAL_CREATORS[4],
          text: 'Thank you Rahul! Project Tiger in 1973 was a major turning point for wildlife protection laws in India. Keep learning! 🐯',
          createdAt: '45 mins ago',
          likesCount: 42,
          isLiked: false,
          parentId: 'comm_1'
        }
      ]
    },
    {
      id: 'comm_2',
      videoId: 'vid_gk_india_animal',
      userId: 'user_102',
      user: {
        id: 'user_102',
        name: 'Meera Iyer',
        username: 'meera_reads',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        bio: 'Curious bookworm',
        followersCount: 310,
        followingCount: 190,
        likesReceivedCount: 560,
        quizPoints: 920,
        isCreator: false,
        badges: []
      },
      text: 'The quiz question at the end is such a great retention tool! Answered Tiger and earned +50 points.',
      createdAt: '30 mins ago',
      likesCount: 68,
      isLiked: true,
      isPinned: false
    }
  ],
  vid_ai_transformers: [
    {
      id: 'comm_3',
      videoId: 'vid_ai_transformers',
      userId: 'user_103',
      user: {
        id: 'user_103',
        name: 'Arjun Das',
        username: 'arjun_coder',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        bio: 'CS Undergrad',
        followersCount: 450,
        followingCount: 220,
        likesReceivedCount: 890,
        quizPoints: 1450,
        isCreator: false,
        badges: []
      },
      text: 'The self-attention explanation with matrix query, key and values in 45 seconds was clearer than a 2-hour university lecture. Outstanding!',
      createdAt: '2 hours ago',
      likesCount: 340,
      isLiked: true,
      isPinned: true
    }
  ]
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      id: 'lead_1',
      name: 'Aditya Sen',
      username: 'aditya_scholar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Olympiad Gold Medalist & AI Researcher',
      followersCount: 14500,
      followingCount: 120,
      likesReceivedCount: 45000,
      quizPoints: 9850,
      isCreator: true,
      badges: ['Grandmaster', 'Quiz Legend', 'Science Ace']
    },
    points: 9850,
    quizzesSolved: 197,
    badge: '🥇 Grandmaster'
  },
  {
    rank: 2,
    user: {
      id: 'lead_2',
      name: 'Tanvi Kapoor',
      username: 'tanvi_gk_pro',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'UPSC Aspirant | Quizzer of the Year',
      followersCount: 9200,
      followingCount: 340,
      likesReceivedCount: 32000,
      quizPoints: 8940,
      quizzesSolved: 178,
      isCreator: false,
      badges: ['Knowledge Titan', 'Top Streak']
    },
    points: 8940,
    quizzesSolved: 178,
    badge: '🥈 Knowledge Titan'
  },
  {
    rank: 3,
    user: {
      id: 'lead_3',
      name: 'Dr. Vikram Sarabhai Academy',
      username: 'vikram_physics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Astrophysics & Quantum Mechanics',
      followersCount: 142800,
      followingCount: 182,
      likesReceivedCount: 2450000,
      quizPoints: 8200,
      isCreator: true,
      badges: ['Master Mentor']
    },
    points: 8200,
    quizzesSolved: 164,
    badge: '🥉 Master Mentor'
  },
  {
    rank: 4,
    user: {
      id: 'lead_4',
      name: 'Rohit Tech Lab',
      username: 'rohit_ai_insights',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Silicon Valley AI engineer',
      followersCount: 312000,
      followingCount: 210,
      likesReceivedCount: 5240000,
      quizPoints: 7800,
      isCreator: true,
      badges: ['Tech Wizard']
    },
    points: 7800,
    quizzesSolved: 156,
    badge: '🎖️ Tech Wizard'
  },
  {
    rank: 5,
    user: CURRENT_USER_DEFAULT,
    points: 1280,
    quizzesSolved: 26,
    badge: '⭐ Active Scholar'
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_1',
    participantIds: ['current_user_1', 'user_gk_priya'],
    participants: [CURRENT_USER_DEFAULT, INITIAL_CREATORS[4]],
    unreadCount: 1,
    isGroup: false,
    updatedAt: '10 mins ago',
    lastMessage: {
      id: 'msg_1',
      senderId: 'user_gk_priya',
      receiverId: 'current_user_1',
      text: 'Hello Saidul! Delighted to see your quiz score on the Constitution video. Let me know if you need the PDF notes!',
      createdAt: '10 mins ago',
      isRead: false
    }
  },
  {
    id: 'conv_2',
    participantIds: ['current_user_1', 'user_ai_rohit'],
    participants: [CURRENT_USER_DEFAULT, INITIAL_CREATORS[3]],
    unreadCount: 0,
    isGroup: false,
    updatedAt: '2 hours ago',
    lastMessage: {
      id: 'msg_2',
      senderId: 'current_user_1',
      receiverId: 'user_ai_rohit',
      text: 'Thanks Rohit! Your AI explanation helped me build my first neural net project.',
      createdAt: '2 hours ago',
      isRead: true
    }
  },
  {
    id: 'conv_3',
    participantIds: ['current_user_1', 'user_english_ananya', 'user_math_raman'],
    participants: [CURRENT_USER_DEFAULT, INITIAL_CREATORS[1], INITIAL_CREATORS[2]],
    unreadCount: 2,
    isGroup: true,
    groupName: '🚀 Daily GK & Skills Study Club',
    updatedAt: 'Just now',
    lastMessage: {
      id: 'msg_3',
      senderId: 'user_english_ananya',
      groupId: 'conv_3',
      text: 'Today\'s 5 PM Live Interactive Session on IELTS Speaking will have a live prize quiz!',
      createdAt: 'Just now',
      isRead: false
    }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'current_user_1',
    sender: INITIAL_CREATORS[4],
    type: 'comment',
    content: 'replied to your comment: "Thank you Rahul! Keep learning! 🐯"',
    videoId: 'vid_gk_india_animal',
    createdAt: '45 mins ago',
    isRead: false
  },
  {
    id: 'notif_2',
    userId: 'current_user_1',
    sender: INITIAL_CREATORS[3],
    type: 'like',
    content: 'liked your answer on the Transformer Quiz (+75 Points Earned!)',
    videoId: 'vid_ai_transformers',
    createdAt: '2 hours ago',
    isRead: false
  },
  {
    id: 'notif_3',
    userId: 'current_user_1',
    sender: INITIAL_CREATORS[1],
    type: 'live',
    content: 'is now LIVE: "Master Native English Expressions in 20 Mins"',
    createdAt: '3 hours ago',
    isRead: true
  },
  {
    id: 'notif_4',
    userId: 'current_user_1',
    sender: INITIAL_CREATORS[0],
    type: 'achievement',
    content: 'You unlocked the "Science Explorer" badge! Check your profile.',
    createdAt: '1 day ago',
    isRead: true
  },
  {
    id: 'notif_5',
    userId: 'current_user_1',
    sender: INITIAL_CREATORS[2],
    type: 'follow',
    content: 'started following you.',
    createdAt: '2 days ago',
    isRead: true
  }
];

export const DAILY_QUIZZES: QuizQuestion[] = [
  {
    id: 'daily_q1',
    question: 'What is the national animal of India?',
    options: ['Lion', 'Royal Bengal Tiger', 'Elephant', 'Deer'],
    correctIndex: 1,
    explanation: 'The Royal Bengal Tiger was adopted as the national animal of India in April 1973 with the launch of Project Tiger.',
    points: 50,
    category: 'General Knowledge'
  },
  {
    id: 'daily_q2',
    question: 'Which planet is known as the "Red Planet" due to iron oxide on its surface?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctIndex: 1,
    explanation: 'Mars appears reddish because of pervasive iron(III) oxide (rust) on its surface.',
    points: 50,
    category: 'Science'
  },
  {
    id: 'daily_q3',
    question: 'In computer science, what does "HTTP" stand for?',
    options: [
      'High Transfer Technical Protocol',
      'Hypertext Transfer Protocol',
      'Hyper Terminal Task Protocol',
      'High Trace Transport Packet'
    ],
    correctIndex: 1,
    explanation: 'Hypertext Transfer Protocol (HTTP) is an application-layer protocol for transmitting hypermedia documents, such as HTML.',
    points: 50,
    category: 'Technology'
  },
  {
    id: 'daily_q4',
    question: 'Who is known as the "Father of the Indian Constitution"?',
    options: ['Mahatma Gandhi', 'Dr. B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'],
    correctIndex: 1,
    explanation: 'Dr. Bhimrao Ramji Ambedkar served as the chairman of the Drafting Committee of the Constituent Assembly.',
    points: 50,
    category: 'Competitive Exam Preparation'
  }
];

export const INITIAL_COMMUNITIES: LearningCommunity[] = [
  {
    id: 'comm_upsc',
    name: 'UPSC & Civil Services Circle',
    category: 'Competitive Exam Preparation',
    description: 'Daily editorial analysis, Indian Polity, Modern History debates & mock question evaluations.',
    avatarEmoji: '🏛️',
    membersCount: 24890,
    posts: [
      {
        id: 'post_1',
        communityId: 'comm_upsc',
        author: INITIAL_CREATORS[2],
        content: 'Crucial Question: How does Article 32 compare with Article 226 in terms of writ jurisdiction? Let us discuss scope and precedent cases in the comments.',
        type: 'question',
        likesCount: 142,
        repliesCount: 38,
        createdAt: '1 hour ago'
      },
      {
        id: 'post_2',
        communityId: 'comm_upsc',
        author: INITIAL_CREATORS[4],
        content: 'Handwritten Revision Mindmap for 1857 Revolt leaders, causes and administrative outcomes attached below!',
        type: 'notes',
        likesCount: 289,
        repliesCount: 19,
        attachmentName: '1857_Revolt_Summary_Chart.pdf',
        attachmentUrl: '#',
        createdAt: '3 hours ago'
      }
    ]
  },
  {
    id: 'comm_ai_python',
    name: 'AI, Python & Deep Learning',
    category: 'Artificial Intelligence',
    description: 'Neural networks, PyTorch code snippets, LLM prompt engineering and machine learning roadmap.',
    avatarEmoji: '🤖',
    membersCount: 38200,
    posts: [
      {
        id: 'post_3',
        communityId: 'comm_ai_python',
        author: INITIAL_CREATORS[3],
        content: 'Quick benchmark: What prompt structure gave you the highest accuracy on structured JSON extraction from Gemini and Claude models?',
        type: 'discussion',
        likesCount: 195,
        repliesCount: 42,
        createdAt: '2 hours ago'
      }
    ]
  },
  {
    id: 'comm_english_fluency',
    name: 'Fluent English Club & Vocab',
    category: 'English Speaking',
    description: 'Daily speaking challenges, pronunciation clinics, idiom swaps and interview preparation.',
    avatarEmoji: '🎙️',
    membersCount: 41200,
    posts: [
      {
        id: 'post_4',
        communityId: 'comm_english_fluency',
        author: INITIAL_CREATORS[1],
        content: 'Today\'s speaking prompt: Record a 30-second audio explaining why you chose your college or career without using the filler words "like" or "basically"!',
        type: 'question',
        likesCount: 320,
        repliesCount: 67,
        createdAt: '5 hours ago'
      }
    ]
  },
  {
    id: 'comm_vedic_maths',
    name: 'Vedic Mathematics & Speed Math',
    category: 'Mathematics',
    description: 'Fast calculation sutras, square roots in 5 seconds, algebra tricks for competitive exams.',
    avatarEmoji: '📐',
    membersCount: 19400,
    posts: [
      {
        id: 'post_5',
        communityId: 'comm_vedic_maths',
        author: INITIAL_CREATORS[2],
        content: 'Sutra: "Ekadhikena Purvena" for squaring numbers ending in 5. Can anyone solve 95 x 95 mentally in under 2 seconds?',
        type: 'question',
        likesCount: 410,
        repliesCount: 88,
        createdAt: 'Yesterday'
      }
    ]
  }
];

export const INITIAL_STORIES: EduStory[] = [
  {
    id: 'story_live_1',
    creator: INITIAL_CREATORS[0],
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    caption: '🔴 LIVE NOW: Black Hole Event Horizon Masterclass! Tap to join live stream.',
    type: 'image',
    timestamp: 'Just now',
    isLive: true,
    quizSnippet: {
      question: 'What is the boundary around a black hole called?',
      answer: 'Event Horizon'
    }
  },
  {
    id: 'story_ananya_vocab',
    creator: INITIAL_CREATORS[1],
    mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    caption: 'Word of the Day: "Ephemeral" - lasting for a very short time! Use it in a sentence below 📝',
    type: 'image',
    timestamp: '2h ago',
    quizSnippet: {
      question: 'Opposite of Ephemeral?',
      answer: 'Eternal / Permanent'
    }
  },
  {
    id: 'story_raman_vedic',
    creator: INITIAL_CREATORS[2],
    mediaUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    caption: '⚡ Mental Math Hack: Multiply any 2-digit number by 11 in 1 second! (e.g. 35 x 11 = 385)',
    type: 'image',
    timestamp: '4h ago',
    quizSnippet: {
      question: 'Calculate: 43 x 11 = ?',
      answer: '473'
    }
  },
  {
    id: 'story_upsc_ias',
    creator: INITIAL_CREATORS[4],
    mediaUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    caption: '🏛️ Daily Editorial Breakdown: Supreme Court landmark ruling on Fundamental Rights.',
    type: 'image',
    timestamp: '6h ago',
    quizSnippet: {
      question: 'Which Article is known as the Heart & Soul of Constitution?',
      answer: 'Article 32'
    }
  },
  {
    id: 'story_coding_rahul',
    creator: INITIAL_CREATORS[3],
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    caption: '🚀 Python List Comprehension cheat-sheet for fast interview rounds! Save this story.',
    type: 'image',
    timestamp: '8h ago',
    quizSnippet: {
      question: 'Time complexity of dict lookup in Python?',
      answer: 'O(1) Average'
    }
  }
];
