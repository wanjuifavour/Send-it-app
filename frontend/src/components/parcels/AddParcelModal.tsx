"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"
import { createParcel, getLocations, getUsers } from "@/services/api"

interface User {
  id: number;
  username: string;
  email: string;
}

interface AddParcelModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddParcelModal({ isOpen, onClose }: AddParcelModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [locations, setLocations] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    senderId: "",
    receiverId: "",
    senderLocation: "",
    destination: "",
    weight: "",
  })
  const { user } = useStore()
  const { toast } = useToast()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [locationData, userData] = await Promise.all([
            getLocations(),
            getUsers()
          ]);

          setLocations(locationData || []);
          setUsers(userData || []);

          console.log('Users loaded:', userData); // Debug log
        } catch (error) {
          console.error('Fetch Error:', error);
          toast({
            title: "Error",
            description: "Failed to fetch data",
            variant: "destructive",
          })
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [isOpen, toast]);


  const filteredLocations = (searchTerm: string) => {
    if (!locations) return [];
    return locations.filter(location =>
      location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const parcelData = {
        ...formData,
        senderId: parseInt(formData.senderId, 10),
        receiverId: parseInt(formData.receiverId, 10),

        weight: parseFloat(formData.weight),
        adminId: user?.id
      }

      await createParcel(parcelData)
      toast({
        title: "Success",
        description: "Parcel created successfully",
        variant: "default",
      })
      onClose()
    } catch (error) {
      console.error('Create Parcel Error:', error);
      toast({
        title: "Error", 
        description: "Failed to create parcel",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Send New Parcel</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sender</label>
                <select
                  value={formData.senderId}
                  onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a sender</option>
                  {Array.isArray(users) && users.map((user) => (
                    user && user.id ? (
                      <option key={user.id} value={user.id}>
                        {user.username || 'Unknown User'}
                      </option>
                    ) : null
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Receiver</label>
                <select
                  value={formData.receiverId}
                  onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a receiver</option>
                  {Array.isArray(users) && users.map((user) => (
                    user && user.id ? (
                      <option key={user.id} value={user.id}>
                        {user.username || 'Unknown User'}
                      </option>
                    ) : null
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sender Location
                </label>
                <select
                  value={formData.senderLocation}
                  onChange={(e) => setFormData({ ...formData, senderLocation: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a sender location</option>
                  {filteredLocations(formData.senderLocation).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select a destination</option>
                  {filteredLocations(formData.destination).map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                  step="0.1"
                  min="0"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
              >
                Create Parcel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}