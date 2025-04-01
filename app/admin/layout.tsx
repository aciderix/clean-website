"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState({ username: "", role: "" })
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/admin/login")
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!user.username) {
    return null // Loading state
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <AdminSidebar />
      </div>

      <div className="flex-1">
        <AdminHeader toggleSidebar={toggleSidebar} user={user} />
        <main className="pt-16 pb-8 px-6 ml-64">{children}</main>
      </div>
    </div>
  )
}

