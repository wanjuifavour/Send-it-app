"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { register } from "@/services/api"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
    const [username, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setUser } = useStore()
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await register(username, email, password)
            setUser(data.user)
            localStorage.setItem("token", data.token)
            toast({
                title: "Success",
                description: "User registered successfully",
                variant: "default",
            })
            router.push("/dashboard")
        } catch (error) {
            let errorMessage = error.response?.data?.message || "Registration failed. Please try again."
            if (!error.response?.data?.message) {
                if (error.response?.status === 409) {
                    errorMessage = "Email already exists";
                } else if (error.response?.status === 400) {
                    errorMessage = "Invalid Registration data";
                }
            }
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Register for Send-It</CardTitle>
                    <CardDescription>Create your account to start using Send-It</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Input id="name" placeholder="Name" value={username} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    id="email"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSubmit}>
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}