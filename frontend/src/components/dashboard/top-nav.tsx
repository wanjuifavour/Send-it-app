import { Search, Bell } from 'lucide-react';

export function TopNav() {
  return (
    <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">user</span>
          <span className="text-sm text-gray-500">Admin</span>
        </div>
      </div>
    </div>
  );
}