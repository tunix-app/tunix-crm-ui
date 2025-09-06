import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, Menu, Plus, UserPlus, CalendarPlus, Dumbbell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const Header = ({
  sidebarOpen,
  setSidebarOpen
}: HeaderProps) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const addMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  // Mock notifications
  const notifications = [{
    id: 1,
    type: 'schedule',
    message: 'Emma Wilson rescheduled her session to tomorrow at 10:00 AM',
    time: '10 minutes ago',
    read: false
  }, {
    id: 2,
    type: 'client',
    message: 'New client registration: David Chen',
    time: '1 hour ago',
    read: false
  }, {
    id: 3,
    type: 'program',
    message: 'Mike Johnson completed "Beginner Strength Program"',
    time: '3 hours ago',
    read: true
  }, {
    id: 4,
    type: 'system',
    message: 'System update scheduled for tonight at 2:00 AM',
    time: 'Yesterday',
    read: true
  }];
  const unreadCount = notifications.filter(n => !n.read).length;
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return <header className="bg-white shadow-sm h-16 flex items-center px-4">
      <button className="md:hidden p-2 rounded-md hover:bg-gray-100 mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={20} />
      </button>
      <div className="flex-1 flex items-center justify-between">
        {showSearch ? <div className="relative max-w-md w-full flex items-center">
            <input type="text" placeholder="Search clients, programs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" autoFocus />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button onClick={() => setShowSearch(false)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div> : <div className="flex items-center space-x-2">
            <button onClick={() => setShowSearch(true)} className="p-2 rounded-full hover:bg-gray-100">
              <Search size={20} className="text-gray-500" />
            </button>
            <div className="flex items-center">
              <span className="ml-2 text-sm font-medium text-gray-600">
                {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
              </span>
            </div>
          </div>}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button className="p-2 rounded-full hover:bg-gray-100 relative" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} className="text-gray-500" />
              {unreadCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>}
            </button>
            {showNotifications && <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? <div className="divide-y divide-gray-200">
                      {notifications.map(notification => <div key={notification.id} className={`p-4 hover:bg-gray-50 ${notification.read ? '' : 'bg-tan-50'}`}>
                          <div className="flex items-start">
                            <div className={`rounded-full p-2 mr-3 ${notification.type === 'schedule' ? 'bg-tan-100' : notification.type === 'client' ? 'bg-green-100' : notification.type === 'program' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                              {notification.type === 'schedule' ? <CalendarPlus size={16} className="text-blue-600" /> : notification.type === 'client' ? <UserPlus size={16} className="text-green-600" /> : notification.type === 'program' ? <Dumbbell size={16} className="text-purple-600" /> : <Bell size={16} className="text-gray-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>)}
                    </div> : <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>}
                </div>
                <div className="p-2 border-t border-gray-200 bg-gray-50">
                  <button className="w-full py-2 text-xs text-blue-600 font-medium hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
              </div>}
          </div>
          {/* Add Button with Dropdown */}
          <div className="relative" ref={addMenuRef}>
            <Button onClick={() => setShowAddMenu(!showAddMenu)} variant="blue" size="sm" className="flex items-center">
              <Plus size={16} className="mr-1" />
              Add New
            </Button>
            {showAddMenu && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setShowAddMenu(false)}>
                    <CalendarPlus size={16} className="mr-2 text-blue-500" />
                    New Session
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setShowAddMenu(false)}>
                    <Dumbbell size={16} className="mr-2 text-purple-500" />
                    New Program
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setShowAddMenu(false)}>
                    <UserPlus size={16} className="mr-2 text-green-500" />
                    New Client
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;