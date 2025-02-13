"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { register } from "@/services/api"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: ModalProps) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const { toast } = useToast()

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        try {
            await register(formData.username, formData.email, formData.password)
            toast({ title: "Success", description: "User created successfully" })
            onUserCreated()
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create user",
                variant: "destructive"
            })
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Create New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
                    >
                        Create User
                    </button>
                </form>
            </div>
        </div>
    )
}