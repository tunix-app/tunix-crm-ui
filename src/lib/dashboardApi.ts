import { apiRequest } from './api';
import type { CoachDashboard } from '@/types/dashboard';

export async function getDashboard(date?: string): Promise<CoachDashboard> {
  const params = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiRequest<CoachDashboard>(`/dashboard${params}`);
}
