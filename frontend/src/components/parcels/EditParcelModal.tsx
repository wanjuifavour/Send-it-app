"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"
import { upsertParcel, getLocations, getUsers } from "@/services/api"
import { Parcel } from "@/app/dashboard/all-parcels/page"

interface User {
    id: number;
    username: string;
    email: string;
}

interface EditParcelModalProps {
    isOpen: boolean
    onClose: () => void
    parcel: {
        id: number
        senderId: number
        receiverId: number
        senderLocation: string
        destination: string
        weight: number
    } | null
    onParcelUpdated: (updatedParcel: Parcel) => void
}

export function EditParcelModal({ isOpen, onClose, parcel }: EditParcelModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [locations, setLocations] = useState<string[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        senderId: parcel?.senderId?.toString() || '',
        receiverId: parcel?.receiverId?.toString() || '',
        senderLocation: parcel?.senderLocation || '',
        destination: parcel?.destination || '',
        weight: parcel?.weight?.toString() || '',
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

    useEffect(() => {
        setFormData({
            senderId: parcel?.senderId?.toString() || '',
            receiverId: parcel?.receiverId?.toString() || '',
            senderLocation: parcel?.senderLocation || '',
            destination: parcel?.destination || '',
            weight: parcel?.weight?.toString() || '',
        })
    }, [parcel])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const parcelData = {
                ...formData,
                id: parcel?.id,
                senderId: parseInt(formData.senderId, 10),
                receiverId: parseInt(formData.receiverId, 10),
                weight: parseFloat(formData.weight),
                adminId: user?.id
            }

            await upsertParcel(parcelData)
            toast({
                title: "Success",
                description: "Parcel updated successfully",
                variant: "default",
            })
            onClose()
        } catch (error) {
            console.log('Error:', error)
            toast({
                title: "Error",
                description: "Failed to update parcel",
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

                        <h2 className="text-xl font-semibold mb-4">Edit Parcel</h2>

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
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.username || 'Unknown User'}
                                        </option>
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
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.username || 'Unknown User'}
                                        </option>
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
                                    {locations.map((location) => (
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
                                    {locations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
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
                                Update Parcel
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
