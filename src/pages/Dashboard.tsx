import React from 'react';
import { CalendarIcon, UserIcon, ClockIcon, TrendingUpIcon, AlertCircleIcon } from 'lucide-react';
const Dashboard = () => {
  // Mock data for dashboard
  const upcomingSessions = [{
    id: 1,
    client: 'Emma Wilson',
    time: '9:00 AM',
    duration: '60 min',
    type: 'Strength'
  }, {
    id: 2,
    client: 'Mike Johnson',
    time: '11:30 AM',
    duration: '45 min',
    type: 'Mobility'
  }, {
    id: 3,
    client: 'Sarah Lee',
    time: '2:15 PM',
    duration: '60 min',
    type: 'Rehab'
  }, {
    id: 4,
    client: 'Tom Garcia',
    time: '4:00 PM',
    duration: '30 min',
    type: 'Assessment'
  }];
  const clientAlerts = [{
    id: 1,
    client: 'Emma Wilson',
    alert: 'Missed last session',
    priority: 'high'
  }, {
    id: 2,
    client: 'David Chen',
    alert: 'Program needs update',
    priority: 'medium'
  }, {
    id: 3,
    client: 'Lisa Wong',
    alert: 'Reached strength goal',
    priority: 'low'
  }];
  return <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trainer Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your day.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full">
              <CalendarIcon size={24} className="text-amber-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">
                Today's Sessions
              </h2>
              <p className="text-2xl font-bold">{upcomingSessions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UserIcon size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">
                Active Clients
              </h2>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ClockIcon size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">
                Hours This Week
              </h2>
              <p className="text-2xl font-bold">32</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">Today's Schedule</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {upcomingSessions.map(session => <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-14 rounded-full mr-4" style={{
                backgroundColor: session.type === 'Strength' ? '#f59e0b' : session.type === 'Mobility' ? '#10b981' : session.type === 'Rehab' ? '#f59e0b' : '#8b5cf6'
              }}></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{session.client}</h3>
                    <p className="text-sm text-gray-500">
                      {session.type} • {session.duration}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-medium">{session.time}</p>
                    <button className="text-xs text-amber-600">Details</button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-medium text-gray-800">Client Alerts</h2>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {clientAlerts.length} New
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {clientAlerts.map(alert => <div key={alert.id} className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${alert.priority === 'high' ? 'bg-red-100' : alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    <AlertCircleIcon size={16} className={alert.priority === 'high' ? 'text-red-600' : alert.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'} />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{alert.client}</h3>
                    <p className="text-xs text-gray-500">{alert.alert}</p>
                  </div>
                </div>)}
            </div>
            <div className="mt-6">
              <button className="w-full py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors">
                View All Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800">
            Client Progress Overview
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex items-center">
              <TrendingUpIcon size={20} className="text-green-500 mr-2" />
              <span className="text-sm font-medium">
                Weekly Progress Summary
              </span>
            </div>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['Strength Gains', 'Mobility Improvement', 'Weight Loss', 'Session Attendance'].map(metric => <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xs text-gray-500 mb-1">{metric}</h3>
                <div className="flex items-end">
                  <span className="text-xl font-bold">
                    {Math.floor(Math.random() * 30) + 70}%
                  </span>
                  <span className="text-xs text-green-500 ml-2">
                    +{Math.floor(Math.random() * 10) + 1}%
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{
                width: `${Math.floor(Math.random() * 30) + 70}%`
              }}></div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;