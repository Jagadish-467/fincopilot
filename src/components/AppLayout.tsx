import { Outlet } from 'react-router-dom';
import DesktopTopNav from './DesktopTopNav';
import MobileBottomNav from './MobileBottomNav';
import ChatFAB from './ChatFAB';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <DesktopTopNav />
      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>
      <MobileBottomNav />
      <ChatFAB />
    </div>
  );
};

export default AppLayout;
