"use client"

import Link from 'next/link';
import { BarChart, Package, Map, Users, Truck, Settings } from 'lucide-react';
import { useStore } from "@/store/useStore"

export function Sidebar() {
  const { setUser } = useStore()
  const logoutUser = () => {
    setUser(null)
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/";
  }
  return (
    <div className="w-64 bg-[#2E8B57] text-white flex flex-col">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Truck className="h-6 w-6" />
          <span className="text-xl font-bold">SendIt</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="py-4">
          <h2 className="text-xs uppercase tracking-wider text-green-200">General</h2>
          <div className="mt-2 space-y-1">
            <Link href="/dashboard" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <BarChart className="h-5 w-5 mr-3" />
              Overview
            </Link>
            <Link href="/dashboard/parcels" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <Package className="h-5 w-5 mr-3" />
              My Parcels
            </Link>
            <Link href="/dashboard/track" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <Map className="h-5 w-5 mr-3" />
              Track Parcel
            </Link>
          </div>
        </div>

        <div className="py-4">
          <h2 className="text-xs uppercase tracking-wider text-green-200">Admin Controls</h2>
          <div className="mt-2 space-y-1">
            <Link href="/dashboard/users" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <Users className="h-5 w-5 mr-3" />
              Manage Users
            </Link>
            <Link href="/dashboard/all-parcels" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <Package className="h-5 w-5 mr-3" />
              All Parcels
            </Link>
            <Link href="/dashboard/delivery" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <Truck className="h-5 w-5 mr-3" />
              Delivery Status
            </Link>
            <Link href="/dashboard/settings" className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-white/10">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </div>
        </div>
        <div className="mt-auto p-4">
          <button onClick={logoutUser} className="w-full py-2 px-4 bg-red-600 text-white rounded">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}