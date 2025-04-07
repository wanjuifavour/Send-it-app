"use client";
import { useEffect, useState } from 'react';
// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { Parcel } from '@/app/dashboard/all-parcels/page';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);
const Polyline = dynamic(
    () => import('react-leaflet').then((mod) => mod.Polyline),
    { ssr: false }
);

interface TrackMapProps {
    parcel: Parcel;
}

export default function TrackMap({ parcel }: TrackMapProps) {
    const [senderCoords, setSenderCoords] = useState<[number, number] | null>(null);
    const [receiverCoords, setReceiverCoords] = useState<[number, number] | null>(null);

    useEffect(() => {
        const fetchCoordinates = async (locationName: string) => {
            try {
                const response = await fetch(`/api/locations/coordinates?name=${locationName}`);
                const data = await response.json();
                return [data.latitude, data.longitude] as [number, number];
            } catch (error) {
                console.error('Error fetching coordinates:', error);
                return null;
            }
        };

        const loadCoordinates = async () => {
            const sender = await fetchCoordinates(parcel.senderLocation);
            const receiver = await fetchCoordinates(parcel.destination);
            if (sender) setSenderCoords(sender);
            if (receiver) setReceiverCoords(receiver);
        };

        loadCoordinates();
    }, [parcel]);

    if (!senderCoords || !receiverCoords) {
        return <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />;
    }

    return (
        <div className="h-96 rounded-lg overflow-hidden shadow-sm border">
            <MapContainer
                center={senderCoords}
                zoom={7}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker position={senderCoords}>
                    <Popup>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Sender Location</h3>
                            <p>{parcel.senderLocation}</p>
                        </div>
                    </Popup>
                </Marker>

                <Marker position={receiverCoords}>
                    <Popup>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Destination</h3>
                            <p>{parcel.destination}</p>
                            {parcel.status === 'Delivered' && (
                                <p className="text-green-600">Delivered on {new Date(parcel.updatedAt).toLocaleDateString()}</p>
                            )}
                        </div>
                    </Popup>
                </Marker>

                <Polyline
                    positions={[senderCoords, receiverCoords]}
                    color={parcel.status === 'Delivered' ? '#16a34a' : '#2563eb'}
                    weight={3}
                    opacity={0.7}
                />
            </MapContainer>
        </div>
    );
}