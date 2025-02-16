"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Clock, Package, CheckCircle, ChevronDown } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import TrackMap from '@/components/dashboard/TrackMap'
import { Parcel } from '@/app/dashboard/all-parcels/page'
import { getParcels } from '@/services/api'
import { useStore } from '@/store/useStore'

export default function TrackPage() {
  // const params = useParams()
  // const trackingId = params.trackingId
  const { trackingId } = useParams()
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userParcels, setUserParcels] = useState<Parcel[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const { user } = useStore()

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await fetch(`/api/parcels/${trackingId}`)
        if (!response.ok) throw new Error('Parcel not found')
        const data = await response.json()
        setParcel(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load parcel')
      } finally {
        setLoading(false)
      }
    }

    fetchParcel()
  }, [trackingId])

  useEffect(() => {
    const fetchUserParcels = async () => {
      try {
        const parcels = await getParcels()
        setUserParcels(parcels)
      } catch (err) {
        console.error('Error fetching user parcels:', err)
      }
    }

    if (user) fetchUserParcels()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          <div className="h-32 bg-gray-100 rounded-lg" />
          <div className="h-32 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!parcel) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Track Parcel</h1>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            Track Parcel <ChevronDown className="h-4 w-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border">
              <div className="max-h-96 overflow-y-auto p-2">
                {userParcels.map(parcel => (
                  <div
                    key={parcel.id}
                    onClick={() => {
                      setSelectedParcel(parcel)
                      setShowDropdown(false)
                    }}
                    className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Parcel ID: {parcel.id}</span>
                      <span className={`text-sm ${parcel.status === 'Delivered' ? 'text-green-600' :
                          parcel.status === 'In Transit' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                        {parcel.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {parcel.senderLocation} → {parcel.destination}
                    </div>
                  </div>
                ))}
                {userParcels.length === 0 && (
                  <div className="p-3 text-gray-500 text-center">
                    No parcels found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedParcel && <TrackMap parcel={selectedParcel} />}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard
            title="Sender Location"
            value={parcel.senderLocation}
            label="Package dispatched"
            icon={<MapPin className="h-6 w-6 text-white" />}
          />
          <StatsCard
            title="Destination"
            value={parcel.destination}
            label={parcel.status === 'Delivered' ? 'Delivered' : 'In Transit'}
            icon={<MapPin className="h-6 w-6 text-white" />}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Shipment Progress</h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <span>Tracking ID: {parcel.trackingId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Created: {new Date(parcel.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${parcel.status === 'Delivered'
                  ? 'bg-green-100 text-green-800'
                  : parcel.status === 'In Transit'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                {parcel.status}
              </span>
              {parcel.status === 'Delivered' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${parcel.status === 'Pending' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                <span>Order Received</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${['In Transit', 'Delivered'].includes(parcel.status)
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                  }`} />
                <span>In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${parcel.status === 'Delivered'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                  }`} />
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






// "use client"

// import { StatsCard } from '@/components/dashboard/stats-card';
// import { Map } from '@/components/dashboard/map';
// import { MapPin } from 'lucide-react';

// export default function TrackPage() {

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <StatsCard
//           title="Sender Location"
//           value="Mombasa, Kenya"
//           label="Package dispatched"
//           icon={<MapPin className="h-6 w-6 text-white" />}
//         />
//         <StatsCard
//           title="Destination"
//           value="Nairobi, Kenya"
//           label="Expected delivery soon"
//           icon={<MapPin className="h-6 w-6 text-white" />}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white rounded-lg shadow">
//           <Map />
//         </div>
//       </div>
//     </div>
//   );
// }
