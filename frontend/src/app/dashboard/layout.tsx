import React from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopNav } from '@/components/dashboard/top-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}