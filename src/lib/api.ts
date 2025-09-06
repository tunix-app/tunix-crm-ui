import { create } from "domain";

// API configuration and utilities
// const API_BASE_URL = import.meta.env.VITE_TUNIX_BACKEND_BASE_URL || 'https://tunix-crm-backend.fly.dev';
const API_BASE_URL = 'https://tunix-crm-backend.fly.dev';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authentication token if available
  // const token = localStorage.getItem('auth_token');
  //   if (token) {
  //   config.headers = {
  //     ...config.headers,
  //     'Authorization': `Bearer ${token}`,
  //   };
  // }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Network error or server unreachable');
  }
}

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

  // Settings endpoints
//   getNotificationSettings: () => apiRequest<any>('/user/notifications'),
//   updateNotificationSettings: (data: any) => apiRequest<any>('/user/notifications', {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   }),

//   getAppearanceSettings: () => apiRequest<any>('/user/appearance'),
//   updateAppearanceSettings: (data: any) => apiRequest<any>('/user/appearance', {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   }),

  // Security endpoints
//   changePassword: (data: any) => apiRequest<any>('/user/change-password', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   }),

  // Billing endpoints
//   getBillingInfo: () => apiRequest<any>('/user/billing'),
//   getPaymentMethods: () => apiRequest<any>('/user/payment-methods'),
//   getBillingHistory: () => apiRequest<any>('/user/billing-history'),
};

export { ApiError };
