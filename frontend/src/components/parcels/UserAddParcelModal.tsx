"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"
import api, { getLocations, sendSMS, createPaymentIntent, userCreateParcel } from "@/services/api"
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
        id: string;
    } | null>(null);
    const [showSmsConfirmation, setShowSmsConfirmation] = useState(false);
    const [smsLoading, setSmsLoading] = useState(false);

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
        if (!stripe || !elements) return;

        try {
            const { data } = await createPaymentIntent(formData)
            setCalculatedAmount(data.amount);
            setPaymentIntentData(data);
            setShowConfirmation(true);
        } catch (error: any) {
            let errorMessage = "An unknown error occurred";
            
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } 
            else if (error.response?.status === 400) {
                errorMessage = error.response.data.message || "Invalid Inputs";
            }
            else if (error.message) {
                errorMessage = error.message;
            }
        
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
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

            const parcelData = {
                ...formData,
                stripePaymentId: paymentIntentData.id,
                amount: (paymentIntentData.amount) / 100,
                weight: parseFloat(formData.weight),
                senderId: user?.id
            }

            await userCreateParcel(parcelData)

            setShowConfirmation(false);
            setShowSmsConfirmation(true);

        } catch (error) {
            let errorMessage = "Payment failed";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if ((error as any).response?.data?.message) {
                errorMessage = (error as any).response.data.message;
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
            setShowConfirmation(false);
        }
    }

    const handleSendSmsConfirmation = async (sendSms: boolean) => {
        if (!sendSms) {
            onParcelCreated();
            onClose();
            toast({ title: "Success", description: `Payment of KES ${paymentIntentData!.amount / 100} successful!` });
            return;
        }

        try {
            setSmsLoading(true);
            await sendSMS(formData)

            toast({
                title: "Success",
                description: `Payment successful and receiver notified!`
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Payment processed but failed to send notification",
                variant: "destructive"
            });
        } finally {
            setSmsLoading(false);
            onParcelCreated();
            onClose();
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
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Receiver Email</label>
                <input
                    type="text"
                    value={formData.receiverEmail}
                    onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Receiver Phone</label>
                <input
                    type="tel"
                    value={formData.receiverPhone}
                    onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Sender Location</label>
                <select
                    value={formData.senderLocation}
                    onChange={(e) => setFormData({ ...formData, senderLocation: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                    step="0.1"
                    min="0"
                />
            </div>

            <div className="border p-3 rounded-lg">
                <label className="block text-sm font-medium mb-2">Card Details</label>
                <CardElement className="border p-2 rounded" />
            </div>

            {!showConfirmation && !showSmsConfirmation && (
                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
                >
                    Proceed to Payment
                </button>
            )}

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

            {showSmsConfirmation && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-medium">Payment Successful. Send notification?</h3>
                        <p className="text-sm">Would you like to notify the receiver via SMS?</p>
                        <div className="flex space-x-2 justify-end">
                            <button
                                type="button"
                                onClick={() => handleSendSmsConfirmation(false)}
                                className="px-4 py-2 text-sm border rounded-lg"
                            >
                                No Thanks
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSendSmsConfirmation(true)}
                                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
                                disabled={smsLoading}
                            >
                                {smsLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : 'Yes, Notify Receiver'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

