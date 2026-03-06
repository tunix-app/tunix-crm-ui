import React, { useEffect, useState } from 'react';
import { SearchIcon, PlusIcon, FilterIcon, ChevronRightIcon, ArrowUpRightIcon, ClipboardCheckIcon, CalendarIcon, TagIcon, UserIcon, XIcon } from 'lucide-react';
import ClientProfile from '../components/Clients/ClientProfile';
import { Button } from '@/components/ui/button';
import { clientApi } from '@/lib/clientApi';
import { useUser } from '@/context/UserContext';


const Clients = () => {
  const { userId } = useUser();
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    const fetchClients = async () => {
      try {
        const backendClients = await clientApi.getClientsByTrainerId(userId);
        console.log('Fetched clients:', backendClients);
        setClients(backendClients);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };

    fetchClients();
  }, [userId]);



  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [addClientForm, setAddClientForm] = useState({ client_name: '', client_email: '', client_phone: '', goals: '' });
  const [addClientError, setAddClientError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClientSubmit = async () => {
    if (!userId) return;
    if (!addClientForm.client_name.trim() || !addClientForm.client_email.trim()) {
      setAddClientError('Name and email are required.');
      return;
    }
    try {
      setIsSubmitting(true);
      setAddClientError(null);
      const goalsArray = addClientForm.goals.trim()
        ? addClientForm.goals.split(',').map(g => g.trim()).filter(Boolean)
        : [];
      await clientApi.createClient(userId, {
        client_name: addClientForm.client_name.trim(),
        client_email: addClientForm.client_email.trim(),
        client_phone: addClientForm.client_phone.trim() || undefined,
        goals: goalsArray,
      });
      setAddClientForm({ client_name: '', client_email: '', client_phone: '', goals: '' });
      setShowAddClient(false);
      const backendClients = await clientApi.getClientsByTrainerId(userId);
      setClients(backendClients);
    } catch (err: any) {
      setAddClientError(err?.message || 'Failed to create client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (client.isActive ? statusFilter === 'active' : statusFilter === 'inactive');
    return matchesSearch && matchesStatus;
  });
  // Get the selected client data
  const clientData = selectedClient ? clients.find(c => c.id === selectedClient) : null;
  return <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
      </div>
      {selectedClient ? <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <button onClick={() => setSelectedClient(null)} className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-800">
              <ChevronRightIcon size={16} className="transform rotate-180 mr-1" />
              Back to Clients
            </button>
          </div>
          {clientData && <ClientProfile client={clientData} onDeactivate={() => setSelectedClient(null)} />}
        </div> : <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{ borderRadius: '24px' }} />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-1 rounded-md flex" style={{ borderRadius: '24px' }}>
                <Button className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'all' ? 'bg-white shadow' : ''}`} onClick={() => setStatusFilter('all')}>
                  All
                </Button>
                <Button className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'active' ? 'bg-white shadow' : ''}`} onClick={() => setStatusFilter('active')}>
                  Active
                </Button>
                <Button className={`px-3 py-1 text-sm rounded-md ${statusFilter === 'inactive' ? 'bg-white shadow' : ''}`} onClick={() => setStatusFilter('inactive')}>
                  Inactive
                </Button>
              </div>
              <Button className="flex items-center px-3 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700" onClick={() => setShowAddClient(true)}>
                <PlusIcon size={16} className="mr-1" />
                Add Client
              </Button>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map(client => {
                // const currentProgram = client.current_program.find((p: { status: string; }) => p.status === 'in-progress');
                return <tr key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedClient(client.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* <div className="h-10 w-10 flex-shrink-0"> */}
                              {/* <img className="h-10 w-10 rounded-full object-cover" src={client.profileImage} alt="" /> */}
                            {/* </div> */}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.client_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {client.client_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {client.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.last_session ? new Date(client.last_session).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.next_session ? new Date(client.next_session).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.current_program_name || '-'}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {currentProgram ? <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-tan-600 h-2.5 rounded-full" style={{
                          width: `${currentProgram.progress}%`
                        }}></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {currentProgram.progress}%
                              </span>
                            </div> : '-'}
                        </td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={e => {
                      e.stopPropagation();
                      setSelectedClient(client.id);
                    }} className="text-blue-600 hover:text-blue-900">
                            <ArrowUpRightIcon size={16} />
                          </button>
                        </td> */}
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
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Client</h3>
              <button onClick={() => { setShowAddClient(false); setAddClientError(null); }} className="p-1 rounded hover:bg-gray-100">
                <XIcon size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {addClientError && <p className="text-sm text-red-600">{addClientError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" value={addClientForm.client_name} onChange={e => setAddClientForm(prev => ({ ...prev, client_name: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" value={addClientForm.client_email} onChange={e => setAddClientForm(prev => ({ ...prev, client_email: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={addClientForm.client_phone} onChange={e => setAddClientForm(prev => ({ ...prev, client_phone: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+1-555-0100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goals <span className="text-gray-400 text-xs">(comma-separated)</span></label>
                <input type="text" value={addClientForm.goals} onChange={e => setAddClientForm(prev => ({ ...prev, goals: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Lose weight, Build strength" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => { setShowAddClient(false); setAddClientError(null); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddClientSubmit} disabled={isSubmitting} className="px-4 py-2 bg-tan-600 text-white rounded-md text-sm font-medium hover:bg-tan-700 disabled:opacity-50">
                {isSubmitting ? 'Adding...' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>;
};
export default Clients;