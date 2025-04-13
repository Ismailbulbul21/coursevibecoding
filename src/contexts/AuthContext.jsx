import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, setUser, checkUser } = useAuthStore();
  const { fetchProfile } = useProfileStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setIsLoading(true);
      await checkUser();
      setIsLoading(false);
    };

    checkSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkUser, setUser]);

  // Fetch profile when user changes
  useEffect(() => {
    const getProfile = async () => {
      if (user) {
        console.log('Fetching profile for user:', user.id);
        const profileData = await fetchProfile(user.id);
        console.log('Profile data received:', profileData);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    };

    getProfile();
  }, [user, fetchProfile]);

  const isAdmin = !!profile?.is_admin;
  console.log('Auth context state:', { 
    userId: user?.id, 
    isAuthenticated: !!user, 
    profileLoaded: !!profile, 
    isAdmin,
    adminInProfile: profile?.is_admin
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      isAuthenticated: !!user,
      isAdmin,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 