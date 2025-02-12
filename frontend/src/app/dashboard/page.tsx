import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentParcels } from '@/components/dashboard/recent-parcels';
import { Package, Truck, CheckCircle, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Parcels"
          value="1,254"
          change="+15.3%"
          icon={<Package className="h-6 w-6 text-white" />}
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
        <StatsCard
          title="Total Users"
          value="3,856"
          change="+8.2%"
          icon={<Users className="h-6 w-6 text-white" />}
        />
      </div>
      <RecentParcels />
    </div>
  );
}