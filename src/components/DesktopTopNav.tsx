import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

const DesktopTopNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { scholarshipEnabled, logout, userProfile } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const links = [
    { path: '/emi', label: t('nav.emi') },
    { path: '/dashboard', label: t('nav.dashboard') },
    { path: '/budget', label: t('nav.budget') },
    ...(scholarshipEnabled ? [{ path: '/scholarships', label: t('nav.scholarships') }] : []),
  ];

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><Leaf className="h-4 w-4 text-primary-foreground" /></div>
        <span className="text-lg font-bold text-foreground">FinCopilot</span>
      </Link>
      <nav className="flex items-center gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (<Link key={link.path} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>{link.label}</Link>);
        })}
      </nav>
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 h-9 px-2 rounded-full hover:bg-muted transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {userProfile.profilePhoto ? <img src={userProfile.profilePhoto} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-4 w-4 text-primary" />}
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 top-full mt-1 z-40 w-48 surface-elevated p-1">
              <p className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">{userProfile.firstName} {userProfile.lastName}</p>
              <button onClick={() => { navigate('/settings'); setShowDropdown(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"><Settings className="h-4 w-4" /> {t('nav.settings')}</button>
              <button onClick={() => { logout(); navigate('/auth'); setShowDropdown(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><LogOut className="h-4 w-4" /> {t('settings.logout')}</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default DesktopTopNav;
