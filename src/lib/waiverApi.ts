const API_BASE_URL = '/api';

export interface Waiver {
  id: string;
  clientId: string;
  fileName: string;
  createdAt: string | null;
}

async function waiverRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${response.status}: ${body || response.statusText}`);
  }
  return response.json();
}

// Normalize a raw backend waiver object to our Waiver interface,
// handling both camelCase and snake_case field names.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeWaiver(raw: any): Waiver {
  return {
    id: raw.id,
    clientId: raw.clientId ?? raw.client_id ?? '',
    fileName: raw.fileName ?? raw.file_name ?? raw.originalName ?? raw.original_name ?? raw.name ?? 'waiver',
    createdAt: raw.createdAt ?? raw.created_at ?? null,
  };
}

export const waiverApi = {
  getWaivers: async (clientId: string): Promise<Waiver[]> => {
    const data = await waiverRequest<unknown[]>(`/waiver/client/${clientId}`);
    return data.map(normalizeWaiver);
  },

  uploadWaiver: async (clientId: string, file: File): Promise<Waiver> => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await waiverRequest<unknown>(`/waiver/client/${clientId}`, {
      method: 'POST',
      body: formData,
    });
    return normalizeWaiver(data);
  },

  getSignedUrl: async (waiverId: string): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await waiverRequest<any>(`/waiver/${waiverId}/url`);
    return data.url ?? data.signedUrl ?? data.signed_url ?? data;
  },

  deleteWaiver: async (waiverId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/waiver/${waiverId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  },
};
