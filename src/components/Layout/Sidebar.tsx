import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useUser();
  const pathname = location.pathname;

  // Mock notification data - in a real app, this would come from an API
  const notifications = {
    calendar: 2,
    programBuilder: 0,
    clientAnalytics: 0,
    clients: 3,
    settings: 1,
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
      notifications: 0,
    },
    {
      name: 'Calendar',
      icon: <Calendar size={20} />,
      path: '/calendar',
      notifications: notifications.calendar,
    },
    {
      name: 'Clients',
      icon: <Users size={20} />,
      path: '/clients',
      notifications: notifications.clients,
    },
    // {
    //   name: 'Program Builder',
    //   icon: <Dumbbell size={20} />,
    //   path: '/program-builder',
    //   notifications: notifications.programBuilder
    // },
    // {
    //   name: 'Client Analytics',
    //   icon: <BarChart size={20} />,
    //   path: '/client-analytics',
    //   notifications: notifications.clientAnalytics
    // }
  ];

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  const displayName = user ? `${user.first_name} ${user.last_name}` : '';
  const displayRole = user
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : '';

  const handleSwitchUser = () => {
    clearUser();
    navigate('/');
  };

  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-24'} transition-all duration-300 bg-gray-900 text-white flex flex-col`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">GJBR</h1>
        ) : (
          <h1 className="text-lg font-bold">GJBR</h1>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md hover:bg-gray-800"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center px-4 py-3 rounded-md transition-colors',
                  pathname === item.path ? 'bg-tan-600' : 'hover:bg-gray-800',
                  sidebarOpen ? 'justify-start' : 'justify-center',
                  'relative'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
                {item.notifications > 0 && (
                  <span
                    className={`absolute ${sidebarOpen ? 'right-4' : 'top-2 right-2'} flex h-5 w-5 items-center justify-center`}
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    {sidebarOpen && item.notifications > 1 && (
                      <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs">
                        {item.notifications}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link
          to="/settings"
          className="flex items-center rounded-md p-2 transition-colors hover:bg-gray-800"
        >
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <span className="font-medium text-sm">{initials}</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-gray-400">{displayRole}</p>
            </div>
          )}
        </Link>
        <button
          onClick={handleSwitchUser}
          className={cn(
            'mt-1 flex items-center rounded-md p-2 transition-colors hover:bg-gray-800 text-gray-400 hover:text-white w-full',
            sidebarOpen ? 'justify-start' : 'justify-center'
          )}
          title="Switch user"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {sidebarOpen && <span className="ml-3 text-xs">Switch User</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
