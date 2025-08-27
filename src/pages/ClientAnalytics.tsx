import React, { useState } from 'react';
import { BarChart2Icon, FileTextIcon, DownloadIcon, PlusIcon, CalendarIcon, TrendingUpIcon, UsersIcon, AwardIcon, ActivityIcon, AlertTriangleIcon, ArrowUpRightIcon } from 'lucide-react';
import ProgressChart from '../components/Analytics/ProgressChart';
// Mock client data for aggregate analytics
const aggregateData = {
  totalClients: 28,
  activeClients: 24,
  weeklySessionsAvg: 46,
  clientRetentionRate: 92,
  avgStrengthProgress: 14,
  avgMobilityScore: 74,
  avgConsistencyRate: 87,
  topPerformers: [{
    name: 'Emma Wilson',
    metric: 'Strength Progress',
    value: '+22%',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }, {
    name: 'Mike Johnson',
    metric: 'Attendance Rate',
    value: '96%',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }, {
    name: 'Sarah Lee',
    metric: 'Program Completion',
    value: '3 programs',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }],
  needsAttention: [{
    name: 'Tom Garcia',
    issue: 'Missed 3 sessions',
    lastActive: '2 weeks ago',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }, {
    name: 'Lisa Wong',
    issue: 'No progress in 4 weeks',
    lastActive: '3 days ago',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }],
  programDistribution: [{
    name: 'Strength Training',
    clients: 12
  }, {
    name: 'Weight Loss',
    clients: 8
  }, {
    name: 'Mobility & Recovery',
    clients: 5
  }, {
    name: 'Sports Performance',
    clients: 3
  }],
  muscleGroupFocus: {
    Chest: 22,
    Back: 18,
    Legs: 28,
    Shoulders: 14,
    Arms: 12,
    Core: 20
  },
  monthlyStats: [{
    month: 'Jan',
    newClients: 3,
    completedPrograms: 2
  }, {
    month: 'Feb',
    newClients: 2,
    completedPrograms: 3
  }, {
    month: 'Mar',
    newClients: 4,
    completedPrograms: 2
  }, {
    month: 'Apr',
    newClients: 5,
    completedPrograms: 4
  }, {
    month: 'May',
    newClients: 3,
    completedPrograms: 5
  }, {
    month: 'Jun',
    newClients: 2,
    completedPrograms: 3
  }]
};
const ClientAnalytics = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'programs'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  return <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Client Analytics</h1>
        <p className="text-gray-600">
          Aggregate metrics and insights across all clients
        </p>
      </div>
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <UsersIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-xl font-bold">{aggregateData.totalClients}</p>
            </div>
            <div className="mx-6 h-10 border-l border-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500">Active Clients</p>
              <div className="flex items-baseline">
                <span className="text-xl font-bold mr-2">
                  {aggregateData.activeClients}
                </span>
                <span className="text-xs text-green-500">
                  {Math.round(aggregateData.activeClients / aggregateData.totalClients * 100)}
                  %
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select value={timeRange} onChange={e => setTimeRange(e.target.value as any)} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border-none">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
              <FileTextIcon size={16} className="mr-1" />
              Export Report
            </button>
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              <PlusIcon size={16} className="mr-1" />
              Create Snapshot
            </button>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'performance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('performance')}>
              Performance Metrics
            </button>
            <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'programs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('programs')}>
              Program Analysis
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[{
              label: 'Weekly Sessions',
              value: aggregateData.weeklySessionsAvg,
              change: '+4',
              icon: <CalendarIcon size={20} className="text-blue-500" />
            }, {
              label: 'Avg. Strength Increase',
              value: `${aggregateData.avgStrengthProgress}%`,
              change: '+2%',
              icon: <TrendingUpIcon size={20} className="text-green-500" />
            }, {
              label: 'Avg. Mobility Score',
              value: `${aggregateData.avgMobilityScore}/100`,
              change: '+3',
              icon: <BarChart2Icon size={20} className="text-purple-500" />
            }, {
              label: 'Client Retention',
              value: `${aggregateData.clientRetentionRate}%`,
              change: '+1%',
              icon: <ActivityIcon size={20} className="text-yellow-500" />
            }].map((metric, index) => <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-gray-100 mr-3">
                        {metric.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{metric.label}</p>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">
                            {metric.value}
                          </span>
                          <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Client Growth & Completion</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <DownloadIcon size={16} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="h-64">
                      <ProgressChart metric="clientGrowth" />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Top Performers</h3>
                    <button className="text-blue-600 text-sm hover:text-blue-800">
                      View All
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {aggregateData.topPerformers.map((performer, index) => <div key={index} className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                            <img src={performer.profileImage} alt={performer.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900">
                                {performer.name}
                              </h4>
                              <span className="text-green-600 font-medium">
                                {performer.value}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {performer.metric}
                            </p>
                          </div>
                        </div>)}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Needs Attention
                      </h4>
                      <div className="space-y-4">
                        {aggregateData.needsAttention.map((client, index) => <div key={index} className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                              <img src={client.profileImage} alt={client.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-900">
                                  {client.name}
                                </h4>
                                <button className="text-blue-600 hover:text-blue-800">
                                  <ArrowUpRightIcon size={16} />
                                </button>
                              </div>
                              <div className="flex justify-between">
                                <p className="text-sm text-red-500">
                                  {client.issue}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Last active: {client.lastActive}
                                </p>
                              </div>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Program Distribution</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {aggregateData.programDistribution.map(program => <div key={program.name} className="flex items-center">
                          <div className="w-32 text-sm font-medium">
                            {program.name}
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="flex items-center">
                              <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{
                              width: `${program.clients / aggregateData.totalClients * 100}%`
                            }}></div>
                                </div>
                              </div>
                              <span className="ml-4 text-sm font-medium">
                                {program.clients} clients
                              </span>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Monthly Performance</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {aggregateData.monthlyStats.map(month => <div key={month.month} className="border border-gray-200 rounded-lg p-3 text-center">
                          <p className="text-sm font-medium text-gray-900">
                            {month.month}
                          </p>
                          <div className="mt-2 flex flex-col">
                            <div className="flex items-center justify-center text-green-600">
                              <PlusIcon size={14} className="mr-1" />
                              <span className="text-sm">
                                {month.newClients}
                              </span>
                            </div>
                            <div className="flex items-center justify-center text-blue-600 mt-1">
                              <CheckCircleIcon size={14} className="mr-1" />
                              <span className="text-sm">
                                {month.completedPrograms}
                              </span>
                            </div>
                          </div>
                        </div>)}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600">
                          New Clients
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600">
                          Completed Programs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'performance' && <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium">
                    Strength Progress Distribution
                  </h3>
                  <div className="flex space-x-2">
                    <select className="text-sm border rounded-md px-2 py-1">
                      <option>All Clients</option>
                      <option>Active Clients</option>
                      <option>New Clients (30 days)</option>
                    </select>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <DownloadIcon size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['Strength Progress', 'Mobility Scores', 'Attendance Rate', 'Program Completion'].map(metric => <div key={metric} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{metric}</h4>
                          <div className="text-green-500 flex items-center text-sm">
                            <TrendingUpIcon size={14} className="mr-1" />
                            <span>+{Math.floor(Math.random() * 10) + 5}%</span>
                          </div>
                        </div>
                        <div className="h-40">
                          <ProgressChart metric={metric} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="text-gray-500">Average</p>
                            <p className="font-medium">
                              {metric === 'Strength Progress' ? '+14%' : metric === 'Mobility Scores' ? '74/100' : metric === 'Attendance Rate' ? '87%' : '68%'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Top 25%</p>
                            <p className="font-medium">
                              {metric === 'Strength Progress' ? '+22%' : metric === 'Mobility Scores' ? '88/100' : metric === 'Attendance Rate' ? '95%' : '82%'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Bottom 25%</p>
                            <p className="font-medium">
                              {metric === 'Strength Progress' ? '+6%' : metric === 'Mobility Scores' ? '62/100' : metric === 'Attendance Rate' ? '72%' : '45%'}
                            </p>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Muscle Group Focus</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(aggregateData.muscleGroupFocus).map(([muscleGroup, value]) => <div key={muscleGroup} className="flex items-center">
                            <div className="w-24 text-sm font-medium">
                              {muscleGroup}
                            </div>
                            <div className="flex-1 ml-4">
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{
                              width: `${value / aggregateData.totalClients * 100}%`
                            }}></div>
                                  </div>
                                </div>
                                <span className="ml-4 text-sm font-medium">
                                  {Math.round(value / aggregateData.totalClients * 100)}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>)}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">
                            Most Targeted Areas
                          </p>
                          <p className="text-lg font-bold mt-1">
                            Legs, Chest, Core
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Least Targeted Areas
                          </p>
                          <p className="text-lg font-bold mt-1">
                            Arms, Shoulders
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Client Segments</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-green-100 mr-3">
                            <AwardIcon size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              High Performers
                            </p>
                            <p className="text-xl font-bold">8</p>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-blue-100 mr-3">
                            <ActivityIcon size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Consistent</p>
                            <p className="text-xl font-bold">12</p>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-yellow-100 mr-3">
                            <AlertTriangleIcon size={20} className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">At Risk</p>
                            <p className="text-xl font-bold">5</p>
                          </div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-md bg-purple-100 mr-3">
                            <UsersIcon size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              New (30 days)
                            </p>
                            <p className="text-xl font-bold">3</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium mb-4">Client Lifecycle</h4>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                              Client Journey
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className="bg-blue-600 h-2.5 rounded-l-full" style={{
                          width: '11%'
                        }}></div>
                            <div className="bg-green-500 h-2.5" style={{
                          width: '43%',
                          marginLeft: '11%'
                        }}></div>
                            <div className="bg-yellow-500 h-2.5" style={{
                          width: '18%',
                          marginLeft: '54%'
                        }}></div>
                            <div className="bg-red-500 h-2.5 rounded-r-full" style={{
                          width: '28%',
                          marginLeft: '72%'
                        }}></div>
                          </div>
                        </div>
                        <div className="flex text-xs justify-between mt-2">
                          <span>Onboarding (11%)</span>
                          <span>Active (43%)</span>
                          <span>Sporadic (18%)</span>
                          <span>At Risk (28%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'programs' && <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-green-100 mr-3">
                      <ClipboardCheckIcon size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Programs</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-blue-100 mr-3">
                      <CheckCircleIcon size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Completed this month
                      </p>
                      <p className="text-2xl font-bold">7</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-purple-100 mr-3">
                      <TrendingUpIcon size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Avg. Completion Rate
                      </p>
                      <p className="text-2xl font-bold">78%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium">Program Effectiveness</h3>
                  <div className="flex space-x-2">
                    <select className="text-sm border rounded-md px-2 py-1">
                      <option>All Programs</option>
                      <option>Strength Programs</option>
                      <option>Weight Loss Programs</option>
                      <option>Mobility Programs</option>
                    </select>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Program
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clients
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Avg. Completion
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Strength Gain
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mobility Improvement
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Effectiveness
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[{
                      name: 'Beginner Strength Program',
                      clients: 8,
                      completion: 92,
                      strength: 18,
                      mobility: 12,
                      effectiveness: 'High'
                    }, {
                      name: 'Intermediate Strength Program',
                      clients: 6,
                      completion: 84,
                      strength: 14,
                      mobility: 8,
                      effectiveness: 'Medium'
                    }, {
                      name: 'Weight Management',
                      clients: 7,
                      completion: 76,
                      strength: 8,
                      mobility: 10,
                      effectiveness: 'Medium'
                    }, {
                      name: 'Mobility Restoration',
                      clients: 5,
                      completion: 88,
                      strength: 6,
                      mobility: 22,
                      effectiveness: 'High'
                    }, {
                      name: 'Core & Posture Program',
                      clients: 4,
                      completion: 82,
                      strength: 10,
                      mobility: 18,
                      effectiveness: 'High'
                    }].map((program, index) => <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {program.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {program.clients}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {program.completion}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-green-600">
                                +{program.strength}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-blue-600">
                                +{program.mobility}%
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${program.effectiveness === 'High' ? 'bg-green-100 text-green-800' : program.effectiveness === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {program.effectiveness}
                              </span>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Program Duration Analysis</h3>
                  </div>
                  <div className="p-6">
                    <div className="h-64">
                      <ProgressChart metric="programDuration" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Shortest Program
                        </p>
                        <p className="font-medium">4 weeks</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Average Duration
                        </p>
                        <p className="font-medium">8 weeks</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Longest Program</p>
                        <p className="font-medium">12 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Program Recommendations</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">
                          Most Effective Programs
                        </h4>
                        <ul className="mt-2 space-y-1">
                          <li className="text-sm flex items-center">
                            <CheckCircleIcon size={16} className="text-green-500 mr-2" />
                            Beginner Strength Program (92% completion)
                          </li>
                          <li className="text-sm flex items-center">
                            <CheckCircleIcon size={16} className="text-green-500 mr-2" />
                            Mobility Restoration (88% completion)
                          </li>
                        </ul>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">
                          Needs Improvement
                        </h4>
                        <ul className="mt-2 space-y-1">
                          <li className="text-sm flex items-center">
                            <AlertTriangleIcon size={16} className="text-yellow-500 mr-2" />
                            Weight Management (76% completion)
                          </li>
                          <li className="text-sm flex items-center">
                            <AlertTriangleIcon size={16} className="text-yellow-500 mr-2" />
                            Advanced Strength Program (72% completion)
                          </li>
                        </ul>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">
                          Recommended Actions
                        </h4>
                        <ul className="mt-2 space-y-1">
                          <li className="text-sm flex items-center">
                            <ArrowUpRightIcon size={16} className="text-blue-500 mr-2" />
                            Increase check-ins for Weight Management program
                          </li>
                          <li className="text-sm flex items-center">
                            <ArrowUpRightIcon size={16} className="text-blue-500 mr-2" />
                            Review difficulty level of Advanced Strength Program
                          </li>
                          <li className="text-sm flex items-center">
                            <ArrowUpRightIcon size={16} className="text-blue-500 mr-2" />
                            Consider expanding Mobility Restoration offerings
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
// Missing CheckCircleIcon component - adding it here
const CheckCircleIcon = ({
  size,
  className
}: {
  size: number;
  className?: string;
}) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>;
};
export default ClientAnalytics;