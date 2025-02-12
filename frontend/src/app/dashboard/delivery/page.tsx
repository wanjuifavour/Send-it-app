import { Truck, MapPin } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Delivery Status</h1>
        <div className="flex space-x-4">
          <select className="border rounded-lg px-4 py-2">
            <option>All Drivers</option>
            <option>Active Drivers</option>
            <option>Off Duty</option>
          </select>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            Assign Delivery
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Active Deliveries</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((delivery) => (
              <div key={delivery} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Truck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Driver #{delivery}</div>
                    <div className="text-sm text-gray-500">5 packages remaining</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Downtown Area</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Delivery Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">On Time Delivery</div>
              <div className="text-2xl font-semibold">94.8%</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Average Time</div>
              <div className="text-2xl font-semibold">2.5 hrs</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Active Drivers</div>
              <div className="text-2xl font-semibold">12</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-gray-500">Total Routes</div>
              <div className="text-2xl font-semibold">8</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}