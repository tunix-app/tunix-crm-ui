import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userApi } from '@/lib/userApi';
import { useUser } from '@/context/UserContext';
import { UserProfile } from '@/hooks/useSettings';

const UserSelection = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const allUsers = await userApi.getUsers();
        setUsers(allUsers);
      } catch {
        setError('Failed to load users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleContinue = async () => {
    const selected = users.find((u) => u.id === selectedId);
    if (!selected) return;
    setIsContinuing(true);
    setUser(selected.id, selected);
    navigate('/dashboard');
  };

  const getInitials = (u: UserProfile) =>
    `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase();

  const formatRole = (role: string) =>
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-2 ring-gray-200">
            <img src="/apple-touch-icon.png" alt="GJBR" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Select your profile to continue</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-sm"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who are you?
              </label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a trainer or admin..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <span className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium flex-shrink-0">
                          {getInitials(u)}
                        </span>
                        <span>
                          {u.first_name} {u.last_name}
                          <span className="ml-1 text-gray-400 text-xs">
                            · {formatRole(u.role)}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-gray-900 hover:bg-gray-700 text-white"
              disabled={!selectedId || isContinuing}
              onClick={handleContinue}
            >
              {isContinuing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSelection;
