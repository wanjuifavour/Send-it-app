'use client';

import dynamic from 'next/dynamic';
import type { Location } from '@/components/dashboard/Map';

const Map = dynamic(() => import('@/components/dashboard/Map'), {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">Loading map...</div>,
});

interface MapWrapperProps {
    locations: Location[];
    polyline?: boolean;
    className?: string;
}

export default function MapWrapper({ locations, polyline = true, className }: MapWrapperProps) {
    return <Map locations={locations} polyline={polyline} className={className} />;
}