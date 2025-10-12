import { apiRequest } from "./api";

// API methods

export const userApi = {
  // Profile endpoints
  getUser: (userId: string) => apiRequest<any>(`/user/${userId}`),
  createUser: (newUserData: any) => apiRequest<any>('/user', {
    method: 'POST',
    body: JSON.stringify(newUserData),
  }),
  updateUser: (userId: string, updatedUserData: any) => apiRequest<any>(`/user/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedUserData),
  }),
};
