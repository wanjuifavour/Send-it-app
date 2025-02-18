"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"
import api from "@/services/api"
import { getLocations } from "@/services/api"
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe, StripeCardElement } from '@stripe/stripe-js'

interface UserAddParcelModalProps {
    isOpen: boolean
    onClose: () => void
    onParcelCreated: () => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

function ParcelForm({ onClose, onParcelCreated }: { onClose: () => void; onParcelCreated: () => void }) {
    const [locations, setLocations] = useState<Array<{ name: string }>>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        receiverName: "",
        receiverEmail: "",
        receiverPhone: "",
        senderLocation: "",
        destination: "",
        weight: ""
    })
    const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [paymentIntentData, setPaymentIntentData] = useState<{
        clientSecret: string;
        amount: number;
    } | null>(null);

    const { user } = useStore()
    const { toast } = useToast()
    const stripe = useStripe()
    const elements = useElements()

    useEffect(() => {
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
    }, [toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            throw new Error("Stripe not initialized");
        }

        if (!locations.some(loc => loc.name === formData.senderLocation)) {
            toast({ title: "Error", description: "Invalid sender location", variant: "destructive" });
            return;
        }

        if (!locations.some(loc => loc.name === formData.senderLocation)) {
            toast({ title: "Error", description: "Invalid destination", variant: "destructive" });
            return;
        }

        try {
            const parcelData = {
                ...formData,
                weight: parseFloat(formData.weight),
                senderId: user?.id
            };

            const { data } = await api.post("/pay/payment-intent", { parcelData });
            setCalculatedAmount(data.amount);
            setPaymentIntentData(data);
            setShowConfirmation(true);

        } catch (error) {
            if (error instanceof Error) {
                if (error instanceof Error) {
                    toast({ title: "Error", description: error.message, variant: "destructive" });
                } else {
                    toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" });
                }
            } else {
                toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" });
            }
        }
    }

    const handlePaymentConfirmation = async () => {
        if (!paymentIntentData || !stripe) return;

        try {
            if (!elements) {
                throw new Error("Stripe elements not initialized");
            }

            const { error } = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement) as StripeCardElement,
                }
            });

            if (error) throw error;

            toast({ title: "Success", description: `Payment of KES ${paymentIntentData.amount / 100} successful! Parcel created.` });
            onParcelCreated();
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                if (error instanceof Error) {
                    toast({ title: "Error", description: error.message, variant: "destructive" });
                } else {
                    toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" });
                }
            } else {
                toast({ title: "Error", description: "An unknown error occurred", variant: "destructive" });
            }
        } finally {
            setShowConfirmation(false);
        }
    }

    return (
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
                    <option value="">Select your location</option>
                    {locations.length > 0 ? (
                        locations.map((location) => (
                            <option key={location.name} value={location.name}>
                                {location.name}
                            </option>
                        ))) : (
                        <option disabled>Loading locations...</option>
                    )}
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
                    <option value="">Choose destination</option>
                    {locations.map((location) => (
                        <option key={location.name} value={location.name}>
                            {location.name}
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

            <div className="border p-3 rounded-lg">
                <label className="block text-sm font-medium mb-2">Card Details</label>
                <CardElement className="border p-2 rounded" />
            </div>

            {showConfirmation && calculatedAmount && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium">Total Amount</h3>
                            <p className="text-2xl">KES {calculatedAmount / 100}</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 text-sm border rounded-lg"
                            >
                                Edit Details
                            </button>
                            <button
                                type="button"
                                onClick={handlePaymentConfirmation}
                                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                Confirm & Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
            >
                Proceed to Payment
            </button>
        </form>
    )
}

export function UserAddParcelModal({ isOpen, onClose, onParcelCreated }: UserAddParcelModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-semibold mb-4">Send New Parcel</h2>

                <Elements stripe={stripePromise}>
                    <ParcelForm onClose={onClose} onParcelCreated={onParcelCreated} />
                </Elements>
            </div>
        </div>
    )
}
