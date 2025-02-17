"use client"

import { StatsCard } from '@/components/dashboard/stats-card';
import MapWrapper from '@/components/dashboard/MapWrapper';
import { MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TrackPage() {
  const { user } = useStore();
  const locations = [
    {
      coords: [51.505, -0.09] as [number, number],
      popupContent: `
            <h3 class="font-bold text-lg">London</h3>
            <p class="text-sm">Capital of England</p>
        `
    },
    {
      coords: [48.8566, 2.3522] as [number, number],
      popupContent: `
            <h3 class="font-bold text-lg">Paris</h3>
            <p class="text-sm">Capital of France</p>
        `
    }
  ];

  return (
    <div className="h-screen flex flex-col p-4">
      {/* Top section - 40% height */}
      <div className="h-2/8 flex flex-col space-y-4">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Bottom section - 60% height */}
      <div className="h-6/8 overflow-hidden">
        <MapWrapper
          locations={locations}
          polyline
          className="h-full w-full rounded-lg shadow-xl border"
        />
      </div>
    </div>
  );
}
