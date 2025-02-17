"use client"

import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentParcels } from '@/components/dashboard/recent-parcels';
import { Package, Truck, CheckCircle, Users, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { getUsers, getAllParcels } from '@/services/api';

export default function DashboardPage() {
  const { user } = useStore()
  const [users, setUsers] = useState([])
  const [parcels, setParcels] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      if(user?.isAdmin) {
        const data = await getUsers()
        setUsers(data)
      }
    }
    fetchUsers()
  }, [user])

  useEffect(() => {
    const loadParcels = async () => {
        try {
            const data = await getAllParcels();
            setParcels(data.parcels);
        } catch (error: unknown) {
            console.error('Failed to load parcels:', error);
            toast({ title: "Error", description: "Failed to load parcels", variant: "destructive" });
        }
    };
    loadParcels();
}, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user?.isAdmin && (
          <>
            <StatsCard
              title="Total Parcels"
              value={parcels.length.toLocaleString()}
              // change="-"
              icon={<Package className="h-6 w-6 text-white" />}
            />
            <StatsCard
              title="Total Users"
              value={users.length.toLocaleString()}
              icon={<Users className="h-6 w-6 text-white" />}
            />
            <StatsCard
              title="Completed Orders"
              value="423"
              label="Active"
              icon={<CheckCircle className="h-6 w-6 text-white" />}
            />
          </>
        )}
        {!user?.isAdmin && (
          <>
        <StatsCard
          title="Pending"
          value="423"
          label="Active"
          icon={<History className="h-6 w-6 text-white" />}
        />
        <StatsCard
          title="In Transit"
          value="423"
          label="Active"
          icon={<Truck className="h-6 w-6 text-white" />}
        />
        <StatsCard
          title="Delivered"
          value="826"
          change="+12.8%"
          icon={<CheckCircle className="h-6 w-6 text-white" />}
        />
        </>
        )}
      </div>
      <RecentParcels />
    </div>
  );
}