export type SessionType = 'STRETCH' | 'TRAINING' | 'GROUP_TRAINING' | 'NEURO_RECON';

export type DashboardSession = {
  id: string;
  client_id: string;
  client_name: string;
  session_type: SessionType;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  description: string | null;
};

export type UnscheduledClient = {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  last_session: string | null;
};

export type CoachDashboard = {
  total_sessions_today: number;
  total_active_clients: number;
  sessions_today: DashboardSession[];
  unscheduled_clients: UnscheduledClient[];
};

export type DashboardDateFilter = string | undefined;
