"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"
import { createParcel, getLocations } from "@/services/api"

interface UserAddParcelModalProps {
    isOpen: boolean
    onClose: () => void
    onParcelCreated: () => void
}

export function UserAddParcelModal({ isOpen, onClose, onParcelCreated }: UserAddParcelModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const [locations, setLocations] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        receiverName: "",
        receiverEmail: "",
        receiverPhone: "",
        senderLocation: "",
        destination: "",
        weight: ""
    })
    const { user } = useStore()
    const { toast } = useToast()

    useEffect(() => {
        if (isOpen) {
            const fetchLocations = async () => {
                setLoading(true)
                try {
                    const locationData = await getLocations()
                    setLocations(locationData || [])
                } catch (error) {
                    console.error('Fetch Error:', error)
                    toast({
                        title: "Error",
                        description: "Failed to fetch locations",
                        variant: "destructive",
                    })
                } finally {
                    setLoading(false)
                }
            }
            fetchLocations()
        }
    }, [isOpen, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const parcelData = {
                ...formData,
                weight: parseFloat(formData.weight),
                senderId: user?.id,
                adminId: user?.id // Remove this if using separate user endpoint
            }

            await createParcel(parcelData)
            toast({
                title: "Success",
                description: "Parcel created successfully",
                variant: "default",
            })
            onParcelCreated()
            onClose()
        } catch (error) {
            console.error('Create Parcel Error:', error)
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Receiver Name</label>
                        <input
                            type="text"
                            value={formData.receiverName}
                            onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Receiver Email</label>
                        <input
                            type="email"
                            value={formData.receiverEmail}
                            onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Receiver Phone</label>
                        <input
                            type="tel"
                            value={formData.receiverPhone}
                            onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sender Location</label>
                        <select
                            value={formData.senderLocation}
                            onChange={(e) => setFormData({ ...formData, senderLocation: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        >
                            <option value="">Select sender location</option>
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination</label>
                        <select
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        >
                            <option value="">Select destination</option>
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
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
