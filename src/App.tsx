import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { VideoFeed } from './components/VideoFeed';
import { SearchExploreView } from './components/SearchExploreView';
import { CommunityHub } from './components/CommunityHub';
import { DirectMessageModal } from './components/DirectMessageModal';
import { ProfileView } from './components/ProfileView';

// Modals
import { CommentDrawer } from './components/CommentDrawer';
import { ShareModal } from './components/ShareModal';
import { QuizModal } from './components/QuizModal';
import { QuizHub } from './components/QuizHub';
import { LeaderboardModal } from './components/LeaderboardModal';
import { VideoCreatorModal } from './components/VideoCreatorModal';
import { CreatorDashboardModal } from './components/CreatorDashboardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { LiveLearningModal } from './components/LiveLearningModal';
import { NotificationCenter } from './components/NotificationCenter';

const MainLayout: React.FC = () => {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-screen bg-black sm:bg-zinc-950 text-white font-['Plus_Jakarta_Sans'] flex justify-center selection:bg-rose-500 selection:text-white">
      {/* Mobile-Proportioned Device Container */}
      <div className="w-full max-w-md min-h-screen bg-black sm:border-x sm:border-zinc-900 flex flex-col relative shadow-2xl overflow-x-hidden">
        {/* Top Instagram-Style Navigation Bar */}
        <Navbar />

        {/* Main Screen Router */}
        <main className="flex-1 w-full relative flex flex-col">
          {currentScreen === 'home' && <VideoFeed />}
          {currentScreen === 'shorts' && <VideoFeed />}
          {currentScreen === 'explore' && <SearchExploreView />}
          {currentScreen === 'communities' && <CommunityHub />}
          {currentScreen === 'messages' && <DirectMessageModal />}
          {currentScreen === 'profile' && <ProfileView />}
        </main>

        {/* Bottom Instagram 5-Tab Navigation Bar */}
        <BottomNav />

        {/* Overlays and Modals */}
        <CommentDrawer />
        <ShareModal />
        <QuizModal />
        <QuizHub />
        <LeaderboardModal />
        <VideoCreatorModal />
        <CreatorDashboardModal />
        <AdminPanelModal />
        <LiveLearningModal />
        <NotificationCenter />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
