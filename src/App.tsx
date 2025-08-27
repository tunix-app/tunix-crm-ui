import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import ProgramBuilder from './pages/ProgramBuilder';
import ClientAnalytics from './pages/ClientAnalytics';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/program-builder" element={<ProgramBuilder />} />
              <Route path="/client-analytics" element={<ClientAnalytics />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>;
}