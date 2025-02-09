"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStore } from "@/store/useStore"
import { getParcels } from "@/services/api"

export default function DashboardPage() {
    const { parcels, setParcels } = useStore()

    useEffect(() => {
        const fetchParcels = async () => {
            try {
                const data = await getParcels()
                setParcels(data)
            } catch (error) {
                console.error("Failed to fetch parcels:", error)
            }
        }

        fetchParcels()
    }, [setParcels])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Parcels</CardTitle>
                <CardDescription>Overview of your parcel delivery orders</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Origin</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Weight</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parcels.map((parcel) => (
                            <TableRow key={parcel.id}>
                                <TableCell>{parcel.id}</TableCell>
                                <TableCell>{parcel.status}</TableCell>
                                <TableCell>{parcel.origin}</TableCell>
                                <TableCell>{parcel.destination}</TableCell>
                                <TableCell>{parcel.weight} kg</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}