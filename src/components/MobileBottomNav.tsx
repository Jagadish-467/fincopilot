import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, GraduationCap, User, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

const MobileBottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { scholarshipEnabled } = useAppContext();

  const navItems = [
    { path: '/emi', label: t('nav.emi'), icon: TrendingUp },
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/budget', label: t('nav.budget'), icon: Wallet },
    ...(scholarshipEnabled ? [{ path: '/scholarships', label: t('nav.scholarships'), icon: GraduationCap }] : []),
    { path: '/settings', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (<Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}><Icon className="h-5 w-5" /><span className="text-[10px] font-medium">{item.label}</span></Link>);
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
