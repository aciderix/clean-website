"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  const pathname = usePathname()
  
  // Vérifier si on est sur la page setup
  const isSetupPage = pathname === "/admin/setup"

  useEffect(() => {
    // Skip authentication check for setup page
    if (isSetupPage) {
      return
    }
    
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
  }, [router, isSetupPage, pathname])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Afficher directement le contenu pour la page setup sans les éléments d'admin
  if (isSetupPage) {
    return <>{children}</>
  }

  // Pour les autres pages admin, afficher uniquement après authentification
  if (!user.username && !isSetupPage) {
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

