import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Dumbbell, BarChart, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const Sidebar = ({
  sidebarOpen,
  setSidebarOpen
}: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  // Mock notification data - in a real app, this would come from an API
  const notifications = {
    calendar: 2,
    programBuilder: 0,
    clientAnalytics: 0,
    clients: 3,
    settings: 1 // 1 system update
  };
  const navItems = [{
    name: 'Dashboard',
    icon: <Home size={20} />,
    path: '/dashboard',
    notifications: 0
  }, {
    name: 'Calendar',
    icon: <Calendar size={20} />,
    path: '/calendar',
    notifications: notifications.calendar
  }, {
    name: 'Program Builder',
    icon: <Dumbbell size={20} />,
    path: '/program-builder',
    notifications: notifications.programBuilder
  }, {
    name: 'Client Analytics',
    icon: <BarChart size={20} />,
    path: '/client-analytics',
    notifications: notifications.clientAnalytics
  }, {
    name: 'Clients',
    icon: <Users size={20} />,
    path: '/clients',
    notifications: notifications.clients
  }, {
    name: 'Settings',
    icon: <Settings size={20} />,
    path: '/settings',
    notifications: notifications.settings
  }];
  return <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-900 text-white flex flex-col`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {sidebarOpen ? <h1 className="text-xl font-bold">GetJahBodyRight</h1> : <h1 className="text-xl font-bold">GJB</h1>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-md hover:bg-gray-800">
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <div className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map(item => <li key={item.name}>
              <Link to={item.path} className={cn('flex items-center px-4 py-3 rounded-md transition-colors', pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-800', sidebarOpen ? 'justify-start' : 'justify-center', 'relative')}>
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
                {/* Notification indicator */}
                {item.notifications > 0 && <span className={`absolute ${sidebarOpen ? 'right-4' : 'top-2 right-2'} flex h-5 w-5 items-center justify-center`}>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    {sidebarOpen && item.notifications > 1 && <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs">
                        {item.notifications}
                      </span>}
                  </span>}
              </Link>
            </li>)}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="font-medium text-sm">JD</span>
          </div>
          {sidebarOpen && <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Head Trainer</p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Sidebar;