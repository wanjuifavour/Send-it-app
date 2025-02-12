"use client";
import { useState } from 'react';
import { Package, ArrowUpDown } from 'lucide-react';

const parcels = [
  { id: 1, tracking: 'PKG-198765', destination: 'Nyeri, NY', status: 'In Transit', lastUpdate: '2 hours ago' },
  { id: 2, tracking: 'PKG-298765', destination: 'Nairobi, KE', status: 'Delivered', lastUpdate: '1 day ago' },
  { id: 3, tracking: 'PKG-398765', destination: 'Mombasa, KE', status: 'In Transit', lastUpdate: '5 hours ago' },
  { id: 4, tracking: 'PKG-498765', destination: 'Eldoret, KE', status: 'Delivered', lastUpdate: '3 days ago' },
  { id: 5, tracking: 'PKG-598765', destination: 'Kisumu, KE', status: 'In Transit', lastUpdate: '6 hours ago' },
  { id: 6, tracking: 'PKG-698765', destination: 'Nakuru, KE', status: 'Delivered', lastUpdate: '2 days ago' },
];

export default function ParcelsPage() {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredParcels = filter === 'All' ? parcels : parcels.filter(p => p.status === filter);

  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);
  const paginatedParcels = filteredParcels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Parcels</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
          Send New Parcel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            {['All', 'In Transit', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => { setFilter(status); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === status ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Tracking Number</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedParcels.map(parcel => (
                <tr key={parcel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{parcel.tracking}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{parcel.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parcel.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parcel.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === 1 ? 'text-gray-400' : 'text-emerald-600 hover:bg-gray-100'}`}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === totalPages ? 'text-gray-400' : 'text-emerald-600 hover:bg-gray-100'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
