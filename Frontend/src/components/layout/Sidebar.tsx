
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  PlusCircle, 
  Calendar, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'New Interview', path: '/interviews/new' },
    { icon: Calendar, label: 'Scheduled', path: '/interviews/scheduled' },
    { icon: BarChart, label: 'Results', path: '/interviews/results' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-900 border-r transition-transform duration-300 ease-in-out transform",
        open ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:shadow-none"
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="text-white font-semibold">VI</span>
              </div>
              <span className="font-semibold text-xl">VoiceInterview</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <item.icon size={18} className="mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogOut size={18} className="mr-3" />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
