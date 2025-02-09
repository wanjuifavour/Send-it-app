"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { useRouter } from "next/navigation"

export function Header() {
    const { user, setUser } = useStore()
    const router = useRouter()

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem("token")
        router.push("/")
    }

    return (
        <header className="bg-primary text-primary-foreground py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link href="/" className="text-2xl font-bold">
                    Send-It
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        {user ? (
                            <>
                                <li>
                                    <Link href="/dashboard">
                                        <Button variant="ghost">Dashboard</Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/create-order">
                                        <Button variant="ghost">Create Order</Button>
                                    </Link>
                                </li>
                                <li>
                                    <Button variant="secondary" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register">
                                        <Button variant="ghost">Register</Button>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}