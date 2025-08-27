import React, { useState } from 'react';
import { SearchIcon, PlusIcon, FilterIcon, ChevronRightIcon, ArrowUpRightIcon, ClipboardCheckIcon, CalendarIcon, TagIcon, UserIcon } from 'lucide-react';
import ClientProfile from '../components/Clients/ClientProfile';
// Mock client data
const clients = [{
  id: 1,
  name: 'Emma Wilson',
  email: 'emma.wilson@example.com',
  phone: '(555) 123-4567',
  joinDate: '2023-01-15',
  status: 'active',
  lastSession: '2023-06-18',
  nextSession: '2023-06-22',
  goals: ['Strength improvement', 'Weight loss', 'Better mobility'],
  notes: 'Recently completed beginner strength program with excellent results. Ready to move to intermediate level. Focus areas: upper body strength and hip mobility.',
  programs: [{
    id: 1,
    name: 'Beginner Strength Program',
    status: 'completed',
    completedDate: '2023-06-15'
  }, {
    id: 2,
    name: 'Mobility Restoration',
    status: 'in-progress',
    progress: 45
  }],
  metrics: {
    attendance: 92,
    strengthProgress: 15,
    mobilityScore: 72
  },
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
}, {
  id: 2,
  name: 'Mike Johnson',
  email: 'mike.johnson@example.com',
  phone: '(555) 234-5678',
  joinDate: '2023-02-10',
  status: 'active',
  lastSession: '2023-06-19',
  nextSession: '2023-06-21',
  goals: ['Muscle gain', 'Athletic performance', 'Core strength'],
  notes: 'Former athlete returning to training after shoulder injury. Progressing well but needs continued focus on shoulder stability and proper form.',
  programs: [{
    id: 1,
    name: 'Post-Injury Rehab',
    status: 'completed',
    completedDate: '2023-05-10'
  }, {
    id: 3,
    name: 'Intermediate Strength Program',
    status: 'in-progress',
    progress: 75
  }],
  metrics: {
    attendance: 88,
    strengthProgress: 12,
    mobilityScore: 65
  },
  profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
}, {
  id: 3,
  name: 'Sarah Lee',
  email: 'sarah.lee@example.com',
  phone: '(555) 345-6789',
  joinDate: '2023-03-05',
  status: 'active',
  lastSession: '2023-06-16',
  nextSession: '2023-06-23',
  goals: ['Flexibility', 'Posture improvement', 'General fitness'],
  notes: 'Office worker with posture issues and lower back pain. Focusing on core strength and mobility work. Has shown great dedication to home exercises.',
  programs: [{
    id: 2,
    name: 'Mobility Restoration',
    status: 'completed',
    completedDate: '2023-05-20'
  }, {
    id: 4,
    name: 'Core & Posture Program',
    status: 'in-progress',
    progress: 30
  }],
  metrics: {
    attendance: 95,
    strengthProgress: 8,
    mobilityScore: 80
  },
  profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
}, {
  id: 4,
  name: 'Tom Garcia',
  email: 'tom.garcia@example.com',
  phone: '(555) 456-7890',
  joinDate: '2023-04-20',
  status: 'inactive',
  lastSession: '2023-05-30',
  nextSession: null,
  goals: ['Weight loss', 'Cardiovascular health', 'Nutrition guidance'],
  notes: 'Taking a break due to work travel. Was making good progress on weight loss goals. Provided nutrition plan to follow while traveling.',
  programs: [{
    id: 5,
    name: 'Weight Management',
    status: 'on-hold',
    progress: 40
  }],
  metrics: {
    attendance: 75,
    strengthProgress: 5,
    mobilityScore: 60
  },
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
}, {
  id: 5,
  name: 'David Chen',
  email: 'david.chen@example.com',
  phone: '(555) 567-8901',
  joinDate: '2023-06-01',
  status: 'active',
  lastSession: '2023-06-17',
  nextSession: '2023-06-24',
  goals: ['Strength building', 'Muscle definition', 'Sports performance'],
  notes: 'New client with previous training experience. Completed initial assessment with strong baseline metrics. Starting with intermediate program focusing on hypertrophy.',
  programs: [{
    id: 3,
    name: 'Intermediate Strength Program',
    status: 'in-progress',
    progress: 15
  }],
  metrics: {
    attendance: 100,
    strengthProgress: 0,
    mobilityScore: 68
  },
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
}];
const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // Get the selected client data
  const clientData = selectedClient ? clients.find(c => c.id === selectedClient) : null;
  return <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <p className="text-gray-600">
          Manage your client relationships and track their progress
        </p>
      </div>
      {selectedClient ? <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <button onClick={() => setSelectedClient(null)} className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-800">
              <ChevronRightIcon size={16} className="transform rotate-180 mr-1" />
              Back to Clients
            </button>
          </div>
          {clientData && <ClientProfile client={clientData} />}
        </div> : <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-1 rounded-md flex">
                <button className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'all' ? 'bg-white shadow' : ''}`} onClick={() => setStatusFilter('all')}>
                  All
                </button>
                <button className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'active' ? 'bg-white shadow' : ''}`} onClick={() => setStatusFilter('active')}>
                  Active
                </button>
                <button className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'inactive' ? 'bg-white shadow' : ''}`} onClick={() => setStatusFilter('inactive')}>
                  Inactive
                </button>
              </div>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <FilterIcon size={18} />
              </button>
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                <PlusIcon size={16} className="mr-1" />
                Add Client
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Session
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Session
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Program
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map(client => {
                const currentProgram = client.programs.find(p => p.status === 'in-progress');
                return <tr key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClient(client.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-full object-cover" src={client.profileImage} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {client.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(client.lastSession).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.nextSession ? new Date(client.nextSession).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currentProgram ? currentProgram.name : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {currentProgram ? <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{
                          width: `${currentProgram.progress}%`
                        }}></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {currentProgram.progress}%
                              </span>
                            </div> : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={e => {
                      e.stopPropagation();
                      setSelectedClient(client.id);
                    }} className="text-blue-600 hover:text-blue-900">
                            <ArrowUpRightIcon size={16} />
                          </button>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
              {filteredClients.length === 0 && <div className="text-center py-10">
                  <UserIcon size={40} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No clients found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>}
            </div>
          </div>
        </div>}
    </div>;
};
export default Clients;