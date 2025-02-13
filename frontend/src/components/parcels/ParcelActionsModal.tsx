"use client"

import { X } from "lucide-react"
import { useState } from "react"

interface ParcelActionsModalProps {
    parcel: {
        id: number
        status: string
        trackingId: string
    }
    isOpen: boolean
    onClose: () => void
    onDelete: () => void
    onStatusChange: (newStatus: string) => Promise<void>
    onEdit: () => void
}

export function ParcelActionsModal({ parcel, isOpen, onClose, onDelete, onStatusChange, onEdit }: ParcelActionsModalProps) {
    const [status, setStatus] = useState(parcel.status)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        try {
            await onStatusChange(newStatus)
            setStatus(newStatus)
        } catch (error) {
            console.error("Status update failed:", error)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this parcel?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-gray-600">
                                Cancel
                            </button>
                            <button 
                                onClick={onDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete Parcel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Actions Modal - Only show when not in delete confirmation */}
            {!showDeleteConfirm && (
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Parcel Actions - {parcel.trackingId}</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Update Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>

                        <button
                            onClick={onEdit}
                            className="w-full p-3 text-left border rounded hover:bg-gray-50"
                        >
                            Edit Parcel Details
                        </button>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full p-3 text-left text-red-600 border rounded hover:bg-red-50"
                        >
                            Delete Parcel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
} 