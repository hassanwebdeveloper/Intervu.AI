
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Outlet />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300",
        sidebarOpen && !isMobile ? "ml-64" : "ml-0"
      )}>
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
