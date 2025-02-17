"use client";

import { useState, useEffect } from "react";
import { Search, Filter, } from "lucide-react";
import { AddParcelModal } from "@/components/parcels/AddParcelModal"
import { getAllParcels, updateParcelStatus, softDeleteParcel } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { ParcelActionsModal } from "@/components/parcels/ParcelActionsModal"
import { EditParcelModal } from "@/components/parcels/EditParcelModal"

export interface Parcel {
  id: number
  trackingId: string
  senderName: string
  senderId: number
  receiverName: string
  receiverId: number
  status: string
  weight: number
  createdAt: string
  senderLocation: string
  destination: string
}

const itemsPerPage = 5;

export default function AllParcelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(parcels.length / itemsPerPage);
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedParcelForEdit, setSelectedParcelForEdit] = useState<Parcel>({
    id: 0,
    trackingId: '',
    senderName: '',
    senderId: 0,
    receiverName: '',
    receiverId: 0,
    status: 'Pending',
    weight: 0,
    createdAt: '',
    senderLocation: '',
    destination: ''
  })
  // const paginatedParcels = parcels.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const data = await getAllParcels()
        setParcels(data.parcels)
        console.log(data.parcels)
      } catch (error: unknown) {
        toast({ 
          title: "Error", 
          description: `Failed to load parcels: ${error instanceof Error ? error.message : 'Unknown error'}`, 
          variant: "destructive" 
        })
      }
    }
    loadParcels()
  }, [])

  const handleStatusUpdate = async (parcelId: number, newStatus: string) => {
    try {
      await updateParcelStatus(parcelId, newStatus)
      setParcels(prev => prev.map(p => 
        p.id === parcelId ? { ...p, status: newStatus } : p
      ))
      toast({ title: "Success", description: "Status updated successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
    }
  }

  const handleDelete = async (parcelId: number) => {
    try {
      await softDeleteParcel(parcelId)
      setParcels(prev => prev.filter(p => p.id !== parcelId))
      toast({ title: "Success", description: "Parcel deleted successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to delete parcel", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Parcels</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Add New Parcel
        </button>
      </div>

      <AddParcelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search parcels..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcel ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receiver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (kg)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parcels.map(parcel => (
                <tr 
                  key={parcel.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedParcel(parcel)
                    setIsActionModalOpen(true)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{parcel.trackingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{parcel.senderName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{parcel.receiverName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{parcel.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
              currentPage * itemsPerPage,
              parcels.length
            )} of {parcels.length} results
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-50"}`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-50"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedParcel && (
        <>
          <ParcelActionsModal
            parcel={selectedParcel}
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            onStatusChange={(newStatus) => handleStatusUpdate(selectedParcel.id, newStatus)}
            onDelete={() => handleDelete(selectedParcel.id)}
            onEdit={() => {
              setSelectedParcelForEdit(selectedParcel)
              setEditModalOpen(true)
              setIsActionModalOpen(false)
            }}
          />
          
          {selectedParcelForEdit && (
            <EditParcelModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              parcel={selectedParcelForEdit}
              onParcelUpdated={(updatedParcel: Parcel) => {
                setParcels(prev => prev.map(p => 
                  p.id === updatedParcel.id ? updatedParcel : p
                ))
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
