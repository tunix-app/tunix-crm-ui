import { apiRequest } from "./api";

export const sessionApi = {
    getSessionByTimeRange: (trainerId: string, timeRange: any) => apiRequest<any[]>(`/session/trainer/${trainerId}`, {
        method: 'POST',
        body: JSON.stringify(timeRange),
    }),
    getSessionById: (sessionId: string) => apiRequest<any>(`/session/${sessionId}`),
    createSession: (newSessionData: any) => apiRequest<any>('/session', {
        method: 'POST',
        body: JSON.stringify(newSessionData),
    }),
    updateSession: (sessionId: string, updatedSessionData: any) => apiRequest<any>(`/session/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedSessionData),
    }),
    cancelSession: (sessionId: string) => apiRequest<void>(`/session/${sessionId}`, { method: 'DELETE' }),
    getSessionsByClientId: (clientId: string) => apiRequest<any[]>(`/session/client/${clientId}`),
}