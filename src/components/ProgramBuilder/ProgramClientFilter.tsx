import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { clientApi } from '@/lib/clientApi';

type Client = {
  id: string;
  user: { first_name: string; last_name: string };
};

type ProgramClientFilterProps = {
  userId: string;
  selectedClientId: string | undefined;
  onChange: (clientId: string | undefined) => void;
};

export function ProgramClientFilter({ userId, selectedClientId, onChange }: ProgramClientFilterProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    clientApi
      .getClientsByTrainerId(userId)
      .then((data) => setClients(data as Client[]))
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return <Skeleton className="h-9 w-full" />;
  }

  return (
    <Select
      value={selectedClientId ?? 'all'}
      onValueChange={(val) => onChange(val === 'all' ? undefined : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="All Clients" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Clients</SelectItem>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.user.first_name} {client.user.last_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
