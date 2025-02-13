"use client";

import { Package, MapPin, Clock, CheckCircle, Truck } from 'lucide-react';
import { useEffect } from 'react';

export default function TrackPage() {
  useEffect(() => {
    const initMap = () => {
      const mapElement = document.getElementById("map") as HTMLElement;
      const map = new google.maps.Map(mapElement, {
        zoom: 7,
        center: { lat: -1.286389, lng: 36.817223 },
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: "Nyeri, Kenya",
          destination: "Mumbi, Kenya",
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6 h-screen p-6">
      <div className="col-span-1 space-y-6">
        <h1 className="text-2xl font-semibold">Track Parcel</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Enter Tracking Number</label>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="e.g., TRK-123456789"
                className="flex-1 rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2"
              />
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                Track
              </button>
            </div>
          </div>

          <div className="relative pt-8">
            <div className="absolute top-0 left-8 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {[
                { status: 'Order Placed', date: '2025-02-12 09:00 AM', icon: Package, completed: true },
                { status: 'Picked Up', date: '2025-02-12 11:30 AM', icon: MapPin, completed: true },
                { status: 'In Transit', date: '2025-02-12 02:15 PM', icon: Clock, completed: true },
                { status: 'Out for Delivery', date: '2025-02-12 04:45 PM', icon: Truck, completed: false },
                { status: 'Delivered', date: 'Pending', icon: CheckCircle, completed: false }
              ].map((step, index) => (
                <div key={index} className="relative flex items-start">
                  <div className={`absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'
                    }`}></div>
                  <div className="ml-12">
                    <div className="font-medium">{step.status}</div>
                    <div className="text-sm text-gray-500">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3">
        <div id="map" className="w-full h-full bg-gray-200 rounded-lg shadow"></div>
      </div>
    </div>
  );
}