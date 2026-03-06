import { apiRequest } from "./api";

export const clientApi = {
    getClientsByTrainerId : (trainerId: string) => apiRequest<any[]>(`/client/trainer/${trainerId}`),
    getClientById : (clientId: string) => apiRequest<any>(`/client/${clientId}`),
    searchClient: (query: string) => apiRequest<any[]>(`/client/search-clients`, {
        method: 'POST',
        body: JSON.stringify({ query }),
    }),
    createClient : (trainerId: string, newClientData: any) => apiRequest<any>(`/client/trainer/${trainerId}`, {
        method: 'POST',
        body: JSON.stringify(newClientData),
    }),
    updateClient : (clientId: string, updatedClientData: any) => apiRequest<any>(`/client/${clientId}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedClientData),
    }),
    decommissionClient : (clientId: string) => apiRequest<void>(`/client/${clientId}`, { method: 'DELETE' }),

}