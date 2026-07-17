import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import ProgramsPage from './pages/Programs';
import ProgramBuilderPage from './pages/ProgramBuilder';
import ClientAnalytics from './pages/ClientAnalytics';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import ExercisesPage from './pages/ExercisesPage';
import UserSelection from './pages/UserSelection';
import { UserProvider, useUser } from './context/UserContext';

function UserSelectionGuard() {
  const { userId, isInitializing } = useUser();
  if (isInitializing) return null;
  if (userId) return <Navigate to="/dashboard" replace />;
  return <UserSelection />;
}

const FULL_HEIGHT_ROUTES = new Set(['/program-builder']);

function ProtectedLayout() {
  const { userId, isInitializing } = useUser();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isInitializing) return null;

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  const isFullHeight = FULL_HEIGHT_ROUTES.has(pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className={isFullHeight ? 'flex-1 overflow-hidden bg-gray-50' : 'flex-1 overflow-y-auto bg-gray-50 p-4'}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <UserProvider>
      <Router>
<Routes>
          <Route path="/" element={<UserSelectionGuard />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/program-builder" element={<ProgramBuilderPage />} />
            <Route path="/client-analytics" element={<ClientAnalytics />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}
