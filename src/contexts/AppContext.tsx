import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  isAuthenticated: boolean;
  scholarshipEnabled: boolean;
  language: 'en' | 'hi' | 'te';
  userProfile: {
    firstName: string;
    lastName: string;
    profilePhoto: string | null;
    hasScholarship: boolean;
    scholarshipAmount: number;
  };
  login: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scholarshipEnabled, setScholarshipEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [userProfile, setUserProfile] = useState({
    firstName: 'Priya',
    lastName: 'Sharma',
    profilePhoto: null as string | null,
    hasScholarship: false,
    scholarshipAmount: 0,
  });

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  const updateProfile = (p: Partial<AppState['userProfile']>) =>
    setUserProfile((prev) => ({ ...prev, ...p }));

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        scholarshipEnabled,
        language,
        userProfile,
        login,
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
