import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { clientApi } from '@/lib/clientApi';
import { TagInput } from './TagInput';
import type { CreateProgramDto, Program } from '@/types/program';

type Client = {
  id: string;
  client_name: string;
};

type ProgramCreateDialogProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateProgramDto) => Promise<Program | null>;
};

export function ProgramCreateDialog({
  userId,
  open,
  onOpenChange,
  onCreate,
}: ProgramCreateDialogProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ clientId?: string; name?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clientApi
      .getClientsByTrainerId(userId)
      .then((data) => setClients(data as Client[]))
      .catch(() => null);
  }, [userId]);

  useEffect(() => {
    if (!open) {
      setClientId('');
      setName('');
      setDescription('');
      setTags([]);
      setErrors({});
      setSubmitError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { clientId?: string; name?: string } = {};
    if (!clientId) newErrors.clientId = 'Please select a client.';
    if (!name.trim()) newErrors.name = 'Program name is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await onCreate({
        client_id: clientId,
        name: name.trim(),
        description: description.trim() || undefined,
        tags,
      });
      if (result) {
        onOpenChange(false);
      } else {
        setSubmitError('Failed to create program. Please try again.');
      }
    } catch {
      setSubmitError('Failed to create program. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Program</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="client">Client</Label>
            <Select value={clientId} onValueChange={(val) => setClientId(val)}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.client_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-xs text-red-600">{errors.clientId}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="name">Program Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Phase 1 Strength"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the program"
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label>Tags (optional)</Label>
            <TagInput tags={tags} onChange={setTags} placeholder="e.g. Strength, Mobility..." />
          </div>

          {submitError && (
            <p className="text-sm text-red-600">{submitError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Program'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
