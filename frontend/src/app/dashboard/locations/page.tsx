"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getLocations, addLocation } from "@/services/api";
import { AddLocationModal } from "@/components/locations/AddLocationModal";

export default function ManageLocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await getLocations();
                setLocations(data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to load locations: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    variant: "destructive"
                });
            }
        };
        loadLocations();
    }, []);

    interface Location {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
    }

    interface NewLocation {
        name: string;
        latitude: number;
        longitude: number;
    }

    const handleAddLocation = async (newLocation: NewLocation): Promise<void> => {
        try {
            const response = await addLocation(newLocation);
            // Assuming the API returns the complete location object
            setLocations((prev: Location[]) => [...prev, response]);
            toast({ title: "Success", description: "Location added successfully" });
            setIsModalOpen(false);
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add location",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Manage Locations</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                    Add New Location
                </button>
            </div>

            <AddLocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddLocation}
            />

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latitude</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Longitude</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {locations.map((location) => (
                            <tr key={location.id || location.name}>  {/* Add fallback to location.name */}
                                <td className="px-6 py-4 whitespace-nowrap">{location.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{location.latitude}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{location.longitude}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}