import React, { useEffect, useState } from 'react';
import { CalendarIcon, PhoneIcon, MailIcon, ClipboardCheckIcon, TagIcon, EditIcon, PlusIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, TrendingUpIcon, BarChart2Icon, SaveIcon, XIcon, CircleSlash, Trash } from 'lucide-react';
import ProgressChart from '../Analytics/ProgressChart';
import ClientNotes from '../Analytics/ClientNotes';
import { clientApi } from '@/lib/clientApi';
import { Link } from 'react-router-dom';
import ClientWaiver from './ClientWaiver';
import { Skeleton } from '@/components/ui/skeleton';
interface Program {
  id: number;
  name: string;
  status: string;
  progress?: number;
  completedDate?: string;
  exercises?: number[];
}
interface ClientData {
  id: string;
  client_name: string;
  client_email: string;
  client_id: string;
  phone: string;
  joinDate: string;
  isActive: boolean;
  last_session: string;
  next_session: string | null;
  goals: string[];
  notes: string;
  programs: Program[];
  metrics: {
    attendance: number;
  };
  profileImage: string;
}
interface ClientProfileProps {
  client: ClientData;
  onDeactivate?: () => void;
}
// Mock exercises from the library
const exerciseLibrary = [{
  id: 1,
  name: 'Barbell Back Squat',
  category: 'strength',
  equipment: 'Barbell',
  image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 2,
  name: 'Romanian Deadlift',
  category: 'strength',
  equipment: 'Barbell',
  image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 3,
  name: 'Bench Press',
  category: 'strength',
  equipment: 'Barbell',
  image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 4,
  name: 'Pull-up',
  category: 'strength',
  equipment: 'Pull-up Bar',
  image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 5,
  name: 'Hip Mobility Flow',
  category: 'mobility',
  equipment: 'None',
  image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 6,
  name: 'Shoulder Dislocates',
  category: 'mobility',
  equipment: 'Resistance Band',
  image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 7,
  name: 'Ankle Mobility Routine',
  category: 'rehab',
  equipment: 'None',
  image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 8,
  name: 'Rotator Cuff Strengthening',
  category: 'rehab',
  equipment: 'Dumbbells',
  image: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}];
const ClientProfile = ({
  client,
  onDeactivate,
}: ClientProfileProps) => {


  const [clientData, setClientData] = useState<ClientData>(client);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [editForm, setEditForm] = useState({
    client_name: '',
    client_email: '',
    phone: '',
  });
  const [editErrors, setEditErrors] = useState<{ client_email?: string; phone?: string }>({});
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');
  const [isAddingProgram, setIsAddingProgram] = useState(false);


  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        const backendClient = await clientApi.getClientById(client.id);
        console.log('Fetched client data:', backendClient);
        setClientData({ ...backendClient, phone: backendClient.phone ?? backendClient.client_phone ?? '' });
      } catch (error) {
        console.error('Failed to fetch client data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClientData();
  }, [client]);

  const handleDeactivate = async () => {
    if (!window.confirm(`Are you sure you want to deactivate ${clientData.client_name}?`)) return;
    try {
      setIsDeactivating(true);
      await clientApi.decommissionClient(clientData.id);
      onDeactivate?.();
    } catch (err) {
      console.error('Failed to deactivate client:', err);
      alert('Failed to deactivate client. Please try again.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleAddGoal = async () => {
    const goal = newGoal.trim();
    if (!goal) return;
    const updatedGoals = [...(clientData.goals || []), goal];
    try {
      await clientApi.updateClient(clientData.id, { goals: updatedGoals });
      setClientData(prev => ({ ...prev, goals: updatedGoals }));
      setNewGoal('');
      setShowGoalInput(false);
    } catch (err) {
      console.error('Failed to add goal:', err);
      alert('Failed to add goal. Please try again.');
    }
  };

  const handleRemoveGoal = async (index: number) => {
    const updatedGoals = (clientData.goals || []).filter((_, i) => i !== index);
    try {
      await clientApi.updateClient(clientData.id, { goals: updatedGoals });
      setClientData(prev => ({ ...prev, goals: updatedGoals }));
    } catch (err) {
      console.error('Failed to remove goal:', err);
      alert('Failed to remove goal. Please try again.');
    }
  };

  const handleAddProgram = async () => {
    const name = newProgramName.trim();
    if (!name) return;
    const newProgram: Program = {
      id: Date.now(),
      name,
      status: 'in-progress',
      progress: 0,
    };
    const updatedPrograms = [...(clientData.programs || []), newProgram];
    try {
      setIsAddingProgram(true);
      await clientApi.updateClient(clientData.id, { programs: updatedPrograms });
      setClientData(prev => ({ ...prev, programs: updatedPrograms }));
      setNewProgramName('');
      setShowAddProgram(false);
    } catch (err) {
      console.error('Failed to add program:', err);
      alert('Failed to add program. Please try again.');
    } finally {
      setIsAddingProgram(false);
    }
  };

  const handleStartEditInfo = () => {
    setEditForm({
      client_name: clientData.client_name,
      client_email: clientData.client_email,
      phone: clientData.phone,
    });
    setIsEditingInfo(true);
  };

  const handleSaveInfo = async () => {
    const errors: { client_email?: string; phone?: string } = {};
    if (editForm.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.client_email)) {
      errors.client_email = 'Enter a valid email address.';
    }
    const digits = editForm.phone.replace(/\D/g, '');
    if (editForm.phone && !(digits.length === 10 || (digits.length === 11 && digits[0] === '1'))) {
      errors.phone = 'Enter a 10-digit phone number.';
    }
    if (Object.keys(errors).length) {
      setEditErrors(errors);
      return;
    }
    setEditErrors({});
    try {
      setIsSavingInfo(true);
      await clientApi.updateClient(clientData.id, {
        client_name: editForm.client_name,
        client_email: editForm.client_email,
        client_phone: editForm.phone.replace(/\D/g, ''),
      });
      setClientData(prev => ({ ...prev, ...editForm }));
      setIsEditingInfo(false);
    } catch (err) {
      console.error('Failed to update client info:', err);
      alert('Failed to update client info. Please try again.');
    } finally {
      setIsSavingInfo(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'metrics' | 'notes'>('overview');
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11 && digits[0] === '1') return `${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    return raw;
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  // Get exercises for a program
  const getProgramExercises = (programId: number) => {
    const program = client.programs.find(p => p.id === programId);
    if (!program || !program.exercises) return [];
    return program.exercises.map(exerciseId => exerciseLibrary.find(ex => ex.id === exerciseId)).filter(Boolean);
  };
  // Open program details popup
  const handleOpenProgramDetails = (program: Program) => {
    setSelectedProgram({
      ...program,
      exercises: [1, 2, 3, 4] // Mock exercise IDs for demonstration
    });
    setShowProgramDetails(true);
  };
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center">
              <div className="ml-4 space-y-2">
                <Skeleton className="h-6 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto flex gap-3">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 px-6 py-4 flex gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex-1 p-4 sm:p-6 space-y-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        {isEditingInfo ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.client_name}
                  onChange={e => setEditForm(f => ({ ...f, client_name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.client_email}
                  onChange={e => { setEditForm(f => ({ ...f, client_email: e.target.value })); setEditErrors(err => ({ ...err, client_email: undefined })); }}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${editErrors.client_email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-amber-500'}`}
                />
                {editErrors.client_email && <p className="mt-1 text-xs text-red-500">{editErrors.client_email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={e => { setEditForm(f => ({ ...f, phone: e.target.value })); setEditErrors(err => ({ ...err, phone: undefined })); }}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${editErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-amber-500'}`}
                />
                {editErrors.phone && <p className="mt-1 text-xs text-red-500">{editErrors.phone}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveInfo} disabled={isSavingInfo} className="inline-flex items-center px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded-full hover:bg-amber-700 disabled:opacity-50">
                <SaveIcon size={14} className="mr-1" />
                {isSavingInfo ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => { setIsEditingInfo(false); setEditErrors({}); }} className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-50">
                <XIcon size={14} className="mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center">
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{clientData.client_name}</h2>
                  <button onClick={handleStartEditInfo} className="text-gray-400 hover:text-gray-600 rounded-full">
                    <EditIcon size={15} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${clientData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {clientData.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="flex items-center mr-3">
                    <CalendarIcon size={14} className="mr-1" />
                    Joined {formatDate(clientData.last_session)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto flex flex-wrap gap-3">
              {clientData.phone && (
                <a href={`tel:${clientData.phone}`} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                  <PhoneIcon size={16} className="mr-2 text-gray-500" />
                  {formatPhone(clientData.phone)}
                </a>
              )}
              {clientData.client_email && (
                <a href={`mailto:${clientData.client_email}`} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                  <MailIcon size={16} className="mr-2 text-gray-500" />
                  {clientData.client_email}
                </a>
              )}
              <button onClick={handleDeactivate} disabled={isDeactivating} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-full text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
                {isDeactivating ? 'Deactivating...' : 'Deactivate Client'}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex whitespace-nowrap">
          <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'overview' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          {/* <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'programs' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('programs')}>
            Programs
          </button> */}
          {/* <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'metrics' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('metrics')}>
            Metrics
          </button> */}
          <button className={`px-6 py-4 font-medium text-sm ${activeTab === 'notes' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('notes')}>
            Training Notes
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === 'overview' && <div className="space-y-6">
            <ClientWaiver clientId={clientData.id} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Sessions</h3>
                  <button className="text-amber-600 text-sm hover:text-amber-800">
                    <Link to={`/calendar`}>View Calendar</Link>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Last Session</div>
                    <div className="flex items-center mt-1">
                      <CalendarIcon size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium">
                        {formatDate(clientData.last_session)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Next Session</div>
                    <div className="flex items-center mt-1">
                      <CalendarIcon size={16} className="text-gray-400 mr-2" />
                      <span className="font-medium">
                        {formatDate(clientData.next_session)}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-2 py-2 flex items-center justify-center text-sm text-amber-600 hover:text-amber-800 border border-amber-200 rounded-full">
                    <PlusIcon size={16} className="mr-1" />
                    Schedule New Session
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Goals</h3>
                  <button onClick={() => setShowGoalInput(v => !v)} className="text-gray-400 hover:text-gray-600 rounded-full">
                    <PlusIcon size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {clientData.goals && clientData.goals.length > 0 ? (
                    clientData.goals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className="mt-0.5 mr-2 text-green-500">
                            <CircleSlash size={16} />
                          </div>
                          <span className="text-sm">{goal}</span>
                        </div>
                        <button onClick={() => handleRemoveGoal(index)} className="text-gray-400 hover:text-red-500 rounded-full">
                          <Trash size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No goals set yet</p>
                    </div>
                  )}
                  {showGoalInput && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newGoal}
                        onChange={e => setNewGoal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddGoal()}
                        placeholder="Add a goal..."
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button onClick={handleAddGoal} className="text-xs px-2 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700">Add</button>
                      <button onClick={() => { setShowGoalInput(false); setNewGoal(''); }} className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-50">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Current Program</h3>
                </div>
                {(() => {
                  const activeProgram = clientData.programs?.find(p => p.status === 'in-progress');
                  if (activeProgram) {
                    return (
                      <div>
                        <div className="font-medium">{activeProgram.name}</div>
                        {activeProgram.progress !== undefined && (
                          <div className="flex items-center mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${activeProgram.progress}%` }} />
                            </div>
                            <span className="text-sm text-gray-600 whitespace-nowrap">{activeProgram.progress}%</span>
                          </div>
                        )}
                        <button
                          className="mt-4 w-full py-2 flex items-center justify-center text-sm text-amber-600 hover:text-amber-800 bg-amber-50 rounded-full"
                          onClick={() => handleOpenProgramDetails(activeProgram)}
                        >
                          <ClipboardCheckIcon size={14} className="mr-1" />
                          View Details
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div className="text-center py-4">
                      <ClipboardCheckIcon size={24} className="mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No active program</p>
                      {showAddProgram ? (
                        <div className="mt-3 flex flex-col gap-2">
                          <input
                            type="text"
                            value={newProgramName}
                            onChange={e => setNewProgramName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddProgram()}
                            placeholder="Program name..."
                            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                            autoFocus
                          />
                          <div className="flex gap-2 justify-center">
                            <button onClick={handleAddProgram} disabled={isAddingProgram} className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-full hover:bg-amber-700 disabled:opacity-50">
                              {isAddingProgram ? 'Adding...' : 'Add'}
                            </button>
                            <button onClick={() => { setShowAddProgram(false); setNewProgramName(''); }} className="px-3 py-1.5 border border-gray-300 text-xs rounded-full hover:bg-gray-50">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowAddProgram(true)} className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-amber-600 hover:text-amber-800 bg-amber-50 rounded-full">
                          <PlusIcon size={14} className="mr-1" />
                          Add Program
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-medium">Attendance Overview</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-amber-100 mr-3">
                        <CalendarIcon size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Attendance Rate</p>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">
                            {client.metrics.attendance}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-green-100 mr-3">
                        <TrendingUpIcon size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Sessions This Month
                        </p>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-purple-100 mr-3">
                        <BarChart2Icon size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Sessions</p>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>}
        {activeTab === 'programs' && <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Client Programs</h3>
              <button className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700">
                <PlusIcon size={16} className="mr-1" />
                Assign New Program
              </button>
            </div>
            <div className="space-y-4">
              {client.programs.map(program => <div key={program.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md mr-3 ${program.status === 'completed' ? 'bg-green-100' : program.status === 'in-progress' ? 'bg-amber-100' : 'bg-yellow-100'}`}>
                        {program.status === 'completed' ? <CheckCircleIcon size={20} className="text-green-600" /> : program.status === 'in-progress' ? <ClockIcon size={20} className="text-amber-600" /> : <AlertCircleIcon size={20} className="text-yellow-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{program.name}</h4>
                        <div className="text-sm text-gray-500">
                          {program.status === 'completed' ? `Completed on ${formatDate(program?.completedDate || null)}` : program.status === 'in-progress' ? `In progress - ${program.progress}% complete` : 'On hold'}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-md hover:bg-gray-100">
                        <EditIcon size={16} className="text-gray-500" />
                      </button>
                      <button className="px-3 py-1 text-sm bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100" onClick={() => handleOpenProgramDetails(program)}>
                        View Details
                      </button>
                    </div>
                  </div>
                  {program.status === 'in-progress' && <div className="p-6">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{program.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-amber-600 h-2.5 rounded-full" style={{
                    width: `${program.progress}%`
                  }}></div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="text-sm font-medium mb-2">
                          Recent Updates
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-900">
                                Completed Week 2 assessment
                              </p>
                              <p className="text-xs text-gray-500">
                                2 days ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-900">
                                Increased weights for main lifts
                              </p>
                              <p className="text-xs text-gray-500">
                                1 week ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>)}
            </div>
          </div>}
        {activeTab === 'metrics' && <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Performance Metrics</h3>
                <select className="text-sm border rounded-md px-2 py-1">
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ProgressChart />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-medium">Session Stats</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">
                        Total Sessions
                      </div>
                      <div className="text-2xl font-bold mt-1">24</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">
                        Attendance Rate
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {client.metrics.attendance}%
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">
                        Avg. Session Duration
                      </div>
                      <div className="text-2xl font-bold mt-1">55 min</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">
                        Programs Completed
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {client.programs.filter(p => p.status === 'completed').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-medium">Attendance Trends</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Last 30 Days</div>
                      <div className="text-sm font-medium text-green-600">
                        8/9 sessions
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{
                    width: '89%'
                  }}></div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm font-medium">Last 60 Days</div>
                      <div className="text-sm font-medium text-amber-600">
                        15/18 sessions
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-600 h-2.5 rounded-full" style={{
                    width: '83%'
                  }}></div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm font-medium">Last 90 Days</div>
                      <div className="text-sm font-medium text-amber-600">
                        22/24 sessions
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-amber-600 h-2.5 rounded-full" style={{
                    width: '92%'
                  }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {activeTab === 'notes' && <div className="space-y-6">
            <ClientNotes clientId={clientData.client_id} showEditor={true} limit={5} />
          </div>}
      </div>
      {/* Program Details Popup */}
      {showProgramDetails && selectedProgram && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className={`p-2 rounded-md mr-3 ${selectedProgram.status === 'completed' ? 'bg-green-100' : selectedProgram.status === 'in-progress' ? 'bg-amber-100' : 'bg-yellow-100'}`}>
                  {selectedProgram.status === 'completed' ? <CheckCircleIcon size={20} className="text-green-600" /> : selectedProgram.status === 'in-progress' ? <ClockIcon size={20} className="text-amber-600" /> : <AlertCircleIcon size={20} className="text-yellow-600" />}
                </div>
                <h3 className="text-lg font-medium">{selectedProgram.name}</h3>
              </div>
              <button onClick={() => setShowProgramDetails(false)} className="p-2 rounded-full hover:bg-gray-100">
                <XIcon size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`ml-2 text-sm font-medium ${selectedProgram.status === 'completed' ? 'text-green-600' : selectedProgram.status === 'in-progress' ? 'text-amber-600' : 'text-yellow-600'}`}>
                    {selectedProgram.status === 'completed' ? 'Completed' : selectedProgram.status === 'in-progress' ? 'In Progress' : 'On Hold'}
                  </span>
                </div>
                {selectedProgram.progress !== undefined && <div>
                    <span className="text-sm text-gray-500">Progress:</span>
                    <span className="ml-2 text-sm font-medium">
                      {selectedProgram.progress}%
                    </span>
                  </div>}
              </div>
              {selectedProgram.progress !== undefined && <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{
                width: `${selectedProgram.progress}%`
              }}></div>
                  </div>
                </div>}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="font-medium mb-4">Program Exercises</h4>
              <div className="space-y-4">
                {selectedProgram.exercises && selectedProgram.exercises.map(exerciseId => {
              const exercise = exerciseLibrary.find(ex => ex.id === exerciseId);
              if (!exercise) return null;
              return <div key={exercise.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <div className="h-12 w-12 flex-shrink-0 mr-4">
                          <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover rounded" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{exercise.name}</h5>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">{exercise.category}</span>
                            <span className="mx-1">•</span>
                            <span>{exercise.equipment}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {exercise.category === 'strength' ? '3-4 sets × 8-10 reps' : exercise.category === 'mobility' ? '2 sets × 30-60 sec' : '2-3 sets × 12-15 reps'}
                        </div>
                      </div>;
            })}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button onClick={() => setShowProgramDetails(false)} className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700">
                Close
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700">
                Edit Program
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default ClientProfile;