"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createParcel } from "@/services/api"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"

export default function CreateOrderPage() {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [weight, setWeight] = useState("")
    const [description, setDescription] = useState("")
    const { addParcel } = useStore()
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newParcel = await createParcel({
                origin,
                destination,
                weight: Number.parseFloat(weight),
                description,
            })
            addParcel(newParcel)
            toast({
                title: "Success",
                description: "Parcel order created successfully",
            })
            router.push("/dashboard")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create parcel order",
                variant: "destructive",
            })
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Parcel Order</CardTitle>
                <CardDescription>Enter the details for your new parcel delivery order</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="origin">Origin</Label>
                            <Input
                                id="origin"
                                placeholder="Enter origin address"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="destination">Destination</Label>
                            <Input
                                id="destination"
                                placeholder="Enter destination address"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                placeholder="Enter parcel weight"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter parcel description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>
                    Create Order
                </Button>
            </CardFooter>
        </Card>
    )
}