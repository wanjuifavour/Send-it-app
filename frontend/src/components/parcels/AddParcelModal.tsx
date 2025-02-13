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
  const [searchTerms, setSearchTerms] = useState({
    sender: "",
    receiver: "",
    senderLocation: "",
    destination: ""
  })
  const [formData, setFormData] = useState({
    senderId: "",
    receiverId: "",
    senderLocation: "",
    destination: "",
    weight: "",
    status: "Pending"
  })
  const { user } = useStore()
  const { toast } = useToast()
  const [dropdownOpen, setDropdownOpen] = useState({
    sender: false,
    receiver: false
  });

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
        try {
          const [locationData, userData] = await Promise.all([
            getLocations(),
            getUsers()
          ]);
          console.log('Location Data:', locationData);
          console.log('Users:', userData); // Debug log
          setLocations(locationData);
          // Set users directly since we're now getting the array from the API
          setUsers(Array.isArray(userData) ? userData : []);
        } catch (error) {
          console.error('Fetch Error:', error);
          toast({
            title: "Error",
            description: "Failed to fetch data",
            variant: "destructive",
          })
        }
      }
      fetchData();
    }
  }, [isOpen]);

  const filteredUsers = (searchTerm: string) => {
    console.log('Filtering users:', users); // Debug log
    if (!Array.isArray(users) || users.length === 0) return [];
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => {
      console.log('Checking user:', user); // Debug log
      if (!user?.username) return false;
      return user.username.toLowerCase().includes(term);
    });
  };

  const filteredLocations = (searchTerm: string) => {
    if (!locations) return [];
    return locations.filter(location => 
      location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleUserSelect = (user: User, type: 'sender' | 'receiver') => {
    if (!user?.id) return;
    
    setFormData({
      ...formData,
      [type === 'sender' ? 'senderId' : 'receiverId']: user.id.toString()
    });
    setSearchTerms({
      ...searchTerms,
      [type]: user.username || ''
    });
    setDropdownOpen({
      ...dropdownOpen,
      [type]: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const parcelData = {
        ...formData,
        senderId: user?.id,
        weight: parseFloat(formData.weight),
        status: "Pending"
      }

      const response = await createParcel(parcelData)
      toast({
        title: "Success",
        description: "Parcel created successfully",
        variant: "default",
      })
      onClose()
    } catch (error) {
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Send New Parcel</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Sender</label>
            <input
              type="text"
              value={searchTerms.sender}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerms(prev => ({...prev, sender: value}));
                setDropdownOpen(prev => ({...prev, sender: true})); // Always show dropdown while typing
              }}
              onFocus={() => setDropdownOpen(prev => ({...prev, sender: true}))}
              onBlur={() => {
                // Delay hiding dropdown to allow click events
                setTimeout(() => {
                  setDropdownOpen(prev => ({...prev, sender: false}));
                }, 200);
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Type to search users..."
            />
            {dropdownOpen.sender && (
              <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-auto shadow-lg">
                {filteredUsers(searchTerms.sender).map((user, index) => (
                  <div
                    key={`sender-${user.id}-${index}`}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleUserSelect(user, 'sender')}
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Receiver</label>
            <input
              type="text"
              value={searchTerms.receiver}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerms(prev => ({...prev, receiver: value}));
                setDropdownOpen(prev => ({...prev, receiver: true})); // Always show dropdown while typing
              }}
              onFocus={() => setDropdownOpen(prev => ({...prev, receiver: true}))}
              onBlur={() => {
                setTimeout(() => {
                  setDropdownOpen(prev => ({...prev, receiver: false}));
                }, 200);
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Type to search users..."
            />
            {dropdownOpen.receiver && (
              <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-auto shadow-lg">
                {filteredUsers(searchTerms.receiver).map((user, index) => (
                  <div
                    key={`receiver-${user.id}-${index}`}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleUserSelect(user, 'receiver')}
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}
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
              <option key="default-sender" value="">Select a sender location</option>
              {filteredLocations(searchTerms.senderLocation).map((location, index) => (
                <option key={`sender-${location}-${index}`} value={location}>
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
              <option key="default-destination" value="">Select a destination</option>
              {filteredLocations(searchTerms.destination).map((location, index) => (
                <option key={`destination-${location}-${index}`} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
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
          </div>

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
      </div>
    </div>
  )
} 