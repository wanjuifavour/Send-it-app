"use client";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; latitude: number; longitude: number }) => Promise<void>;
}

interface FormData {
    name: string;
    latitude: string;
    longitude: string;
}

export function AddLocationModal({ isOpen, onClose, onSubmit }: AddLocationModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        latitude: "",
        longitude: ""
    });
    const { toast } = useToast();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await onSubmit({
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            });
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: (error instanceof Error ? error.message : "Failed to add location"),
                variant: "destructive"
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                
                <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value.trim()})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                        </label>
                        <input
                            type="number"
                            step="any"
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.latitude}
                            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                        </label>
                        <input
                            type="number"
                            step="any"
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.longitude}
                            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                    >
                        Add Location
                    </button>
                </form>
            </div>
        </div>
    );
}