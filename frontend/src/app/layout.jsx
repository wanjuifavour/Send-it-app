import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Send-It",
  description: "Parcel delivery management system",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto mt-8 px-4">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}