'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Custom Icon Configuration
const customIcon = L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export interface Location {
    coords: [number, number];
    popupContent?: string;
    icon?: L.Icon;
}

interface MapProps {
    locations: Location[];
    className?: string;
    polyline?: boolean;
}

export default function Map({ locations, className = 'h-[600px]' }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const polylineRef = useRef<L.Polyline | null>(null);
    const [route, setRoute] = useState<[number, number][]>([]);
    const [distance, setDistance] = useState<number | null>(null); // State to store distance

    // Function to update the polyline
    const updatePolyline = () => {
        if (!mapInstance.current) return;

        // Remove existing polyline
        polylineRef.current?.remove();

        // Add new polyline if route exists
        if (route.length > 0) {
            polylineRef.current = L.polyline(route, { color: '#3b82f6', weight: 5 }).addTo(mapInstance.current);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeMap = () => {
            if (!mapRef.current || mapInstance.current || !isMounted) return;

            // Initialize map
            mapInstance.current = L.map(mapRef.current);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstance.current);
        };

        const fetchRoute = async () => {
            if (locations.length < 2) return;

            try {
                const coords = locations.map(loc => loc.coords);
                const response = await axios.get(
                    `https://router.project-osrm.org/route/v1/driving/${coords[0][1]},${coords[0][0]};${coords[1][1]},${coords[1][0]}?overview=full&geometries=geojson`
                );

                if (response.data.routes && response.data.routes[0]) {
                    const routeCoordinates = response.data.routes[0].geometry.coordinates.map((coord: [number, number]) => [
                        coord[1], // Latitude
                        coord[0], // Longitude
                    ]);
                    setRoute(routeCoordinates);

                    // Extract distance from the API response (in meters)
                    const routeDistance = response.data.routes[0].distance;
                    setDistance(routeDistance);
                }
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        };

        const updateMarkers = () => {
            if (!mapInstance.current || !isMounted) return;

            // Clear existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Add new markers
            locations.forEach((location) => {
                const marker = L.marker(location.coords, {
                    icon: location.icon || customIcon
                }).addTo(mapInstance.current!);

                if (location.popupContent) {
                    marker.bindPopup(`
            <div class="leaflet-popup-content">
              ${location.popupContent}
              <div class="mt-2 text-xs text-gray-500">
                ${location.coords[0].toFixed(4)}, ${location.coords[1].toFixed(4)}
              </div>
            </div>
          `);
                }

                markersRef.current.push(marker);
            });
        };

        const updateMapView = () => {
            if (mapInstance.current && locations.length > 0) {
                const bounds = L.latLngBounds(locations.map(l => l.coords));
                mapInstance.current.fitBounds(bounds.pad(0.2));
            }
        };

        // Initial setup
        initializeMap();
        fetchRoute();
        updateMapView();
        updateMarkers();

        // Cleanup
        return () => {
            isMounted = false;
            markersRef.current.forEach(marker => marker.remove());
            polylineRef.current?.remove();
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, [locations]);

    // Update polyline when route changes
    useEffect(() => {
        if (mapInstance.current && route.length > 0) {
            updatePolyline();
        }
    }, [route]);

    // Convert distance to kilometers
    const distanceInKm = distance ? (distance / 1000).toFixed(2) : null;

    return (
        <div>
            {distanceInKm && (
                <div className="p-4 bg-white shadow-md rounded-lg mb-4">
                    <p className="text-lg font-semibold">
                        Distance: <span className="text-blue-600">{distanceInKm} km</span>
                    </p>
                </div>
            )}
            <div ref={mapRef} style={{ height: '600px', width: '100%' }} className={className} />
        </div>
    );
}