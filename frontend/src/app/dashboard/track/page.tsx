"use client"

import { StatsCard } from '@/components/dashboard/stats-card';
import { Map } from '@/components/dashboard/map';
import { MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TrackPage() {
  const { user } = useStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard
          title="Sender Location"
          value="Mombasa, Kenya"
          label="Package dispatched"
          icon={<MapPin className="h-6 w-6 text-white" />}
        />
        <StatsCard
          title="Destination"
          value="Nairobi, Kenya"
          label="Expected delivery soon"
          icon={<MapPin className="h-6 w-6 text-white" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <Map />
        </div>
      </div>
    </div>
  );
}
