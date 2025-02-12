import { Bell, Lock, User, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" className="mt-1 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 px-4 py-2" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {['Email Notifications', 'SMS Updates', 'Push Notifications', 'Delivery Updates'].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
      </div>
    </div>
  );
}