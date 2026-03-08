import React, { useEffect, useRef, useState } from 'react';
import { FileTextIcon, UploadIcon, Trash2Icon, AlertTriangleIcon, CheckCircleIcon, ExternalLinkIcon } from 'lucide-react';
import { waiverApi, Waiver } from '@/lib/waiverApi';

interface ClientWaiverProps {
  clientId: string;
}

const ClientWaiver = ({ clientId }: ClientWaiverProps) => {
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchWaivers = async () => {
      try {
        const data = await waiverApi.getWaivers(clientId);
        setWaivers(data);
      } catch (err) {
        console.error('Failed to fetch waivers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWaivers();
  }, [clientId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const uploaded = await waiverApi.uploadWaiver(clientId, file);
      if (uploaded.fileName === 'waiver') uploaded.fileName = file.name;
      setWaivers(prev => [...prev, uploaded]);
    } catch (err) {
      console.error('Failed to upload waiver:', err);
      alert('Failed to upload waiver. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (waiverId: string) => {
    if (!window.confirm('Are you sure you want to remove this waiver?')) return;
    try {
      setDeletingId(waiverId);
      await waiverApi.deleteWaiver(waiverId);
      setWaivers(prev => prev.filter(w => w.id !== waiverId));
    } catch (err) {
      console.error('Failed to delete waiver:', err);
      alert('Failed to delete waiver. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewWaiver = async (waiverId: string) => {
    try {
      const signedUrl = await waiverApi.getSignedUrl(waiverId);
      const res = await fetch(signedUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (err) {
      console.error('Failed to get waiver URL:', err);
      alert('Failed to open waiver. Please try again.');
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return null;

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="*"
        className="hidden"
        onChange={handleFileChange}
      />

      {waivers.length === 0 ? (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangleIcon size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">No waiver on file</p>
            <p className="text-xs text-amber-600 mt-0.5">This client has not signed a waiver yet.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:opacity-50 flex-shrink-0"
          >
            <UploadIcon size={13} />
            {uploading ? 'Uploading...' : 'Upload Waiver'}
          </button>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircleIcon size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Waiver on file</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <UploadIcon size={13} />
              {uploading ? 'Uploading...' : 'Upload another'}
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {waivers.map(waiver => (
              <li key={waiver.id} className="flex items-center gap-3 px-4 py-3">
                <FileTextIcon size={18} className="text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{waiver.fileName}</p>
                  {formatDate(waiver.createdAt) && (
                    <p className="text-xs text-gray-400">{formatDate(waiver.createdAt)}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleViewWaiver(waiver.id)}
                    className="p-1.5 text-gray-400 hover:text-amber-600 rounded"
                    title="View waiver"
                  >
                    <ExternalLinkIcon size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(waiver.id)}
                    disabled={deletingId === waiver.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded disabled:opacity-50"
                    title="Delete waiver"
                  >
                    <Trash2Icon size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientWaiver;
