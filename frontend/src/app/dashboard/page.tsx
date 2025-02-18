"use client"

import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentParcels } from '@/components/dashboard/recent-parcels';
import { Package, Truck, CheckCircle, Users, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { getUsers, getAllParcels, getParcels } from '@/services/api';
import { Parcel } from "@/app/dashboard/all-parcels/page"

export default function DashboardPage() {
  const { user } = useStore()
  const [users, setUsers] = useState([])
  const [parcels, setParcels] = useState<Parcel[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.isAdmin) {
        const data = await getUsers()
        setUsers(data)
      }
    }
    fetchUsers()
  }, [user])

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const data = user?.isAdmin
          ? await getAllParcels()
          : await getParcels(); // This should be the user-specific endpoint

        setParcels(user?.isAdmin ? data.parcels : data);
      } catch (error: unknown) {
        console.error('Failed to load parcels:', error);
        toast({ title: "Error", description: "Failed to load parcels", variant: "destructive" });
      }
    };
    loadParcels();
  }, [user]);

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
              title="Delivered"
              value={parcels.filter(p => p.status === 'Delivered').length.toString()}
              label="Completed Shipments"
              icon={<CheckCircle className="h-6 w-6 text-white" />}
            />
          </>
        )}
        {!user?.isAdmin && (
          <>
            <StatsCard
              title="Pending"
              value={parcels.filter(p => p.status === 'Pending').length.toString()}
              label="Parcels not shipped "
              icon={<History className="h-6 w-6 text-white" />}
            />
            <StatsCard
              title="In Transit"
              value={parcels.filter(p => p.status === 'In Transit').length.toString()}
              label="Parcels shipped"
              icon={<Truck className="h-6 w-6 text-white" />}
            />
            <StatsCard
              title="Delivered"
              value={parcels.filter(p => p.status === 'Delivered').length.toString()}
              change="Total parcels delivered"
              icon={<CheckCircle className="h-6 w-6 text-white" />}
            />
          </>
        )}
      </div>
      <RecentParcels parcels={parcels.slice(0, 5)} />
    </div>
  );
}