"use client"

import Link from 'next/link';
import '../../auth.css';
import { useToast } from "@/hooks/use-toast"
import { login } from "@/services/api"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { useStore } from "@/store/useStore"
import { User } from "@/types/types"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useStore()
  const router = useRouter()
  const { toast } = useToast()

  interface LoginResponse {
    user: User;
    token: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data: LoginResponse = await login(email, password);
      setUser(data.user);
      document.cookie = `token=${data.token}; path=/; max-age=3600`;
      router.push("/dashboard");
    }
    catch (error) {
      let errorMessage = "Something went wrong";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (!error.response.data?.message) {
          if (error.response.status === 404) {
            errorMessage = "User does not exist";
          } else if (error.response.status === 401) {
            errorMessage = "Invalid password";
          }
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#ff5722" />
            <path d="M12 20h16M20 12v16" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="forgot-password">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="auth-button"> Login </button>
        </form>
        <div className="switch-auth">
          <p>Don&apos;t have an account? <Link href="/auth/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}