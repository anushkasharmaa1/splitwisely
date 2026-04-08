'use client';

import { useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import AppTopbar from '@/components/AppTopbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch('/api/sync-user').catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <AppTopbar />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}