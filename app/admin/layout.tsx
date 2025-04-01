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
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  
  // Vérifier si on est sur la page setup ou login
  const isPublicPage = pathname === "/admin/setup" || pathname === "/admin/login"

  useEffect(() => {
    // Skip authentication check for public pages (setup, login)
    if (isPublicPage) {
      setIsLoading(false)
      return
    }
    
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        console.log("Layout: Vérification de l'authentification...");
        console.log("Layout: Cookies actuels:", document.cookie);
        
        const response = await fetch("/api/auth/me", {
          credentials: "include",  // Important pour que les cookies soient envoyés
          cache: "no-store",       // Éviter la mise en cache
          headers: {
            "Cache-Control": "no-cache" // Éviter le cache
          }
        })

        console.log("Layout: Statut de la réponse:", response.status);
        
        if (!response.ok) {
          console.log("Layout: Non authentifié, redirection vers login");
          // Forcer un rechargement complet pour décharger le cache
          window.location.href = "/admin/login";
          return
        }

        const data = await response.json()
        console.log("Layout: Authentifié comme:", data.user.username);
        setUser(data.user)
      } catch (error) {
        console.error("Layout: Erreur lors de la vérification d'authentification:", error);
        window.location.href = "/admin/login";
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, isPublicPage, pathname])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Afficher directement le contenu pour les pages publiques sans les éléments d'admin
  if (isPublicPage) {
    return <>{children}</>
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <AdminSidebar isOpen={isSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} user={user} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

