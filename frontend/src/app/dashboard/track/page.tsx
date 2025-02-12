import { Package, MapPin, Clock, CheckCircle, Truck } from 'lucide-react';

export default function TrackPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Track Parcel</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-xl mx-auto space-y-6">
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
                  <div className={`absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                    step.completed ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'
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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Parcel Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Sender Information</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">James Kimaethi</p>
              <p className="text-sm">123 Sender Street</p>
              <p className="text-sm">Nyeri, NY 10001</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recipient Information</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">Jane Kioko</p>
              <p className="text-sm">456 Receiver Road</p>
              <p className="text-sm">Mumbi, CA 90001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}