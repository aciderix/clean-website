"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=None`;
    console.log("Cookie défini manuellement:", `${name}=${value.substring(0, 10)}...`);
  }

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue;
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Tentative de connexion avec:", formData.username);
      
      // Vérifier les cookies avant la connexion
      console.log("Cookies avant connexion:", document.cookie || "aucun cookie");
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include"
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion")
      }

      console.log("Connexion réussie:", data.message);
      console.log("Headers de réponse:", response.headers);
      console.log("Cookies après connexion:", document.cookie || "aucun cookie");
      
      // Si le serveur a envoyé un token dans la réponse JSON, on le sauvegarde en cookie et localStorage
      if (data.token) {
        console.log("Token reçu dans la réponse:", data.token.substring(0, 10) + "...");
        
        // Sauvegarde dans localStorage et sessionStorage
        console.log("Sauvegarde dans localStorage");
        localStorage.setItem("authToken", data.token);
        sessionStorage.setItem("authToken", data.token);
        
        // Définir cookie manuellement
        console.log("Définition d'un cookie côté client");
        setCookie("token", data.token, 1); // Expire dans 1 jour
        
        // Vérifier si le cookie a bien été défini
        const tokenCookie = getCookie("token");
        console.log("Cookie token après définition manuelle:", tokenCookie ? "présent" : "absent");
        
        // Pause pour permettre au cookie de s'établir
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.error("Aucun token reçu dans la réponse");
      }
      
      toast({
        title: "Succès",
        description: "Vous êtes connecté avec succès",
      })

      // Courte pause pour s'assurer que les cookies sont bien enregistrés
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Cookies avant redirection:", document.cookie || "aucun cookie");
      console.log("localStorage avant redirection:", localStorage.getItem("authToken") ? "token présent" : "pas de token");
      
      // Utiliser une redirection dure pour s'assurer que le middleware récupère le bon état
      window.location.href = "/admin";
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Identifiants invalides",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion administrateur</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à l'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

