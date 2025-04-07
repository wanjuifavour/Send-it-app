"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Package, Map, Users, Truck, Settings, MapPin } from 'lucide-react';
import { useStore } from "@/store/useStore";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user, setUser } = useStore();
  const pathname = usePathname();
  
  const logoutUser = () => {
    setUser(null);
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/";
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center px-2 py-2 text-sm rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-orange-500 text-white shadow-md' 
        : 'hover:bg-white/10'
    }`;
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#2E8B57] text-white w-64">
      <div className="p-6 border-b border-green-600">
        <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center space-x-2">
          <Truck className="h-6 w-6" />
          <span className="text-xl font-bold">SendIt</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
              General
            </h2>
            <div className="space-y-1">
              <Link href="/dashboard" onClick={handleLinkClick} className={getLinkClass('/dashboard')}>
                <BarChart className="h-5 w-5 mr-3" />
                Overview
              </Link>
              {!user?.isAdmin && (
                <Link href="/dashboard/parcels" onClick={handleLinkClick} className={getLinkClass('/dashboard/parcels')}>
                  <Package className="h-5 w-5 mr-3" />
                  My Parcels
                </Link>
              )}
              <Link href="/dashboard/track" onClick={handleLinkClick} className={getLinkClass('/dashboard/tperk')}>
                <Map className="h-5 w-5 mr-3" />
                Track Parcel
              </Link>
            </div>
          </div>

          {user?.isAdmin && (
            <div>
              <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-green-200 mb-3">
                Admin Controls
              </h2>
              <div className="space-y-1">
                <Link href="/dashboard/users" onClick={handleLinkClick} className={getLinkClass('/dashboard/users')}>
                  <Users className="h-5 w-5 mr-3" />
                  Manage Users
                </Link>
                <Link href="/dashboard/all-parcels" onClick={handleLinkClick} className={getLinkClass('/dashboard/all-parcels')}>
                  <Package className="h-5 w-5 mr-3" />
                  Manage Parcels
                </Link>
                <Link href="/dashboard/locations" onClick={handleLinkClick} className={getLinkClass('/dashboard/locations')}>
                  <MapPin className="h-5 w-5 mr-3" />
                  Manage locations
                </Link>
                <Link href="/dashboard/delivery" onClick={handleLinkClick} className={getLinkClass('/dashboard/delivery')}>
                  <Truck className="h-5 w-5 mr-3" />
                  Delivery Status
                </Link>
                <Link href="/dashboard/settings" onClick={handleLinkClick} className={getLinkClass('/dashboard/settings')}>
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-green-600">
          <button 
            onClick={logoutUser} 
            className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}