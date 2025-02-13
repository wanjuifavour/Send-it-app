"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { login } from "@/services/api"
import { useStore } from "@/store/useStore"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setUser } = useStore()
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        let errorMessage = "An error occurred";
        try {
            const data = await login(email, password)
            setUser(data.user)
            document.cookie = `token=${data.token}; path=/; max-age=3600`
            router.push("/dashboard")
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                errorMessage = error.response.data.message || errorMessage;
            }
            if (error instanceof AxiosError && !error.response?.data?.message) {
                if (error.response?.status === 404) {
                    errorMessage = "User does not exist";
                } else if (error.response?.status === 401) {
                    errorMessage = "Invalid password";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <Image
            src="/delivery.png"
            alt="Delivery Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onChange={(e) => setEmail(e.target.value)}

            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password?"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onChange={(e) => setPassword(e.target.value)}

            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-orange-500 hover:text-orange-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}