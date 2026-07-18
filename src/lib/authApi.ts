import { apiRequest } from './api';

interface RequestOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
}

export function requestOtp(email: string): Promise<RequestOtpResponse> {
  return apiRequest<RequestOtpResponse>('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyOtp(email: string, token: string): Promise<VerifyOtpResponse> {
  return apiRequest<VerifyOtpResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, token }),
  });
}
