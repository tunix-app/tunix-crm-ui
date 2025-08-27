import React, { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>;
}