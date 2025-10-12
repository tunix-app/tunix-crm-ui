import { apiRequest } from "./api";

export const noteApi = {
    getNotesByClientId : (clientId: string) => apiRequest<any[]>(`/note/client/${clientId}`),
    createNote : (clientId: string, newNoteData: any) => apiRequest<any>(`/note/client/${clientId}`, {
        method: 'POST',
        body: JSON.stringify(newNoteData),
    }),
    updateNote : (noteId: string, updatedNoteData: any) => apiRequest<any>(`/note/${noteId}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedNoteData),
    }),
    deleteNote : (noteId: string) => apiRequest<void>(`/note/${noteId}`, { method: 'DELETE' }),
}