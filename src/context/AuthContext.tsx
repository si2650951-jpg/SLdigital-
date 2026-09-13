import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { CURRENT_USER_DEFAULT, INITIAL_CREATORS } from '../data/seedData';
import { auth, googleProvider } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailOrPhone: (identifier: string, pass: string, isPhone?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoProfile: (profile: 'student' | 'creator' | 'admin') => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('edushorts_user');
    return cached ? JSON.parse(cached) : CURRENT_USER_DEFAULT;
  });
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem('edushorts_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setFirebaseUser(user);
          setCurrentUser((prev) => ({
            ...prev,
            id: user.uid,
            name: user.displayName || prev.name,
            email: user.email || undefined,
            avatar: user.photoURL || prev.avatar,
            username: (user.displayName || 'user').toLowerCase().replace(/\s+/g, '_') + '_' + user.uid.slice(0, 4)
          }));
        } else {
          setFirebaseUser(null);
        }
      });
      return () => unsubscribe();
    } catch {
      // Firebase auth listener gracefully handles offline/preview
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setFirebaseUser(user);
      setCurrentUser((prev) => ({
        ...prev,
        id: user.uid,
        name: user.displayName || prev.name,
        avatar: user.photoURL || prev.avatar,
        username: (user.displayName || 'user').toLowerCase().replace(/\s+/g, '_')
      }));
    } catch (err) {
      console.warn('Google popup error (simulating demo Google login):', err);
      // Fallback demo Google user
      setCurrentUser({
        ...CURRENT_USER_DEFAULT,
        id: 'google_user_demo',
        name: 'Saidul Ali (Google User)',
        username: 'saidul_google',
        isVerified: true
      });
    }
  };

  const loginWithEmailOrPhone = async (identifier: string, _pass: string, isPhone = false) => {
    // Simulated smooth OTP / email login
    const name = identifier.split('@')[0] || (isPhone ? `User ${identifier.slice(-4)}` : 'User');
    setCurrentUser((prev) => ({
      ...prev,
      id: `user_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      username: name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    }));
    return true;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setFirebaseUser(null);
    setCurrentUser(CURRENT_USER_DEFAULT);
  };

  const switchDemoProfile = (role: 'student' | 'creator' | 'admin') => {
    if (role === 'student') {
      setCurrentUser(CURRENT_USER_DEFAULT);
    } else if (role === 'creator') {
      setCurrentUser(INITIAL_CREATORS[0]); // Dr. Vikram
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin_root_1',
        name: 'Platform Super Admin',
        username: 'edushorts_admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'EduShorts Trust, Safety & Educational Operations',
        followersCount: 50000,
        followingCount: 12,
        likesReceivedCount: 999999,
        quizPoints: 99999,
        isCreator: true,
        isVerified: true,
        role: 'admin',
        badges: ['🛡️ Platform Admin', 'Safety Officer']
      });
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthenticated: true,
        loginWithGoogle,
        loginWithEmailOrPhone,
        logout,
        switchDemoProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
