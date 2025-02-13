"use client"

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    google: typeof google;
  }
}

export const Map = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const origin = { lat: -4.0435, lng: 39.6682 };
  const destination = { lat: -1.2921, lng: 36.8219 };
  const currentLocation = { lat: -3.0875, lng: 38.3673 };

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD***************`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: 7,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      new window.google.maps.Marker({
        position: origin,
        map: googleMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
        title: "Origin"
      });

      new window.google.maps.Marker({
        position: destination,
        map: googleMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
        title: "Destination"
      });

      new window.google.maps.Marker({
        position: currentLocation,
        map: googleMap,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
          rotation: 45
        },
        title: "Current Location"
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: googleMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#3b82f6",
          strokeWeight: 4
        }
      });

      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
        }
      });

      setMap(googleMap);
    };

    if (!window.google) {
      loadGoogleMaps();
    } else {
      initializeMap();
    }

    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="flex items-center space-x-2 bg-white p-2 rounded shadow">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Origin (Mombasa)</span>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded shadow">
          <Navigation className="h-4 w-4 text-green-500" />
          <span className="text-sm">Destination (Nairobi)</span>
        </div>
      </div>
      <div ref={mapRef} className="w-full h-full rounded-lg"></div>
    </div>
  );
};