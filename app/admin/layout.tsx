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
        console.log("Vérification de l'authentification...");
        
        const response = await fetch("/api/auth/me", {
          credentials: "include"  // Important pour que les cookies soient envoyés
        })

        if (!response.ok) {
          console.log("Non authentifié, redirection vers login");
          router.push("/admin/login")
          return
        }

        const data = await response.json()
        console.log("Authentifié comme:", data.user.username);
        setUser(data.user)
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        router.push("/admin/login")
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

  // Afficher un indicateur de chargement pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">Chargement...</p>
      </div>
    )
  }

  // Pour les autres pages admin, afficher uniquement après authentification
  if (!user.username && !isPublicPage) {
    // Cette condition ne devrait pas se produire grâce au redirect dans useEffect
    // mais on le garde comme sécurité supplémentaire
    router.push("/admin/login")
    return null
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

