import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AppState {
  isAuthenticated: boolean;
  session: Session | null;
  scholarshipEnabled: boolean;
  language: 'en' | 'hi' | 'te';
  userProfile: {
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
    hasScholarship: boolean;
    scholarshipAmount: number;
  };
  logout: () => void;
  setScholarshipEnabled: (v: boolean) => void;
  setLanguage: (v: 'en' | 'hi' | 'te') => void;
  updateProfile: (p: Partial<AppState['userProfile']>) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [scholarshipEnabled, setScholarshipEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profilePhoto: null as string | null,
    hasScholarship: false,
    scholarshipAmount: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Fetch profile after auth state change
        setTimeout(() => {
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUserProfile({
                  firstName: data.first_name || '',
                  lastName: data.last_name || '',
                  profilePhoto: data.profile_photo,
                  hasScholarship: data.has_scholarship || false,
                  scholarshipAmount: Number(data.scholarship_amount) || 0,
                });
              }
            });
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserProfile({
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                profilePhoto: data.profile_photo,
                hasScholarship: data.has_scholarship || false,
                scholarshipAmount: Number(data.scholarship_amount) || 0,
              });
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const updateProfile = async (p: Partial<AppState['userProfile']>) => {
    setUserProfile((prev) => ({ ...prev, ...p }));
    if (session?.user) {
      const updates: Record<string, any> = {};
      if (p.firstName !== undefined) updates.first_name = p.firstName;
      if (p.lastName !== undefined) updates.last_name = p.lastName;
      if (p.profilePhoto !== undefined) updates.profile_photo = p.profilePhoto;
      if (p.hasScholarship !== undefined) updates.has_scholarship = p.hasScholarship;
      if (p.scholarshipAmount !== undefined) updates.scholarship_amount = p.scholarshipAmount;
      if (Object.keys(updates).length > 0) {
        await supabase.from('profiles').update(updates).eq('user_id', session.user.id);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated: !!session,
        session,
        scholarshipEnabled,
        language,
        userProfile,
        logout,
        setScholarshipEnabled,
        setLanguage,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
