"use client"

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopNav } from '@/components/dashboard/top-nav';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            xl:translate-x-0 fixed xl:static z-50 transition-transform duration-300 ease-in-out
          `}
        >
          <Sidebar onClose={closeSidebar} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center xl:hidden p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <TopNav />

          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {children}
          </main>
        </div>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden transition-opacity duration-300 ease-in-out"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}