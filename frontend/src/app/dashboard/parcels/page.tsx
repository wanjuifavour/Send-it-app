"use client";
import { useState, useEffect } from 'react';
import { Package, ArrowUpDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getParcels } from '@/services/api';
import { Parcel } from '@/app/dashboard/all-parcels/page';

export default function ParcelsPage() {
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredParcels = filter === 'All' ? parcels : parcels.filter(p => p.status === filter);

  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);
  const paginatedParcels = filteredParcels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const data = await getParcels();
        setParcels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load parcels');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) loadParcels();
  }, [user]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading parcels...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

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
            {['All', 'Pending' , 'In Transit', 'Delivered'].map(status => (
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
                      <span className="text-sm font-medium">{parcel.trackingId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{parcel.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parcel.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                      parcel.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(parcel.createdAt).toLocaleDateString()}
                  </td>
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
