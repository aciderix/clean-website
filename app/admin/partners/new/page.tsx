"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

export default function NewPartnerPage() {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    order: 0,
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la création du partenaire")
      }

      toast({
        title: "Succès",
        description: "Partenaire créé avec succès",
      })

      router.push("/admin/partners")
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nouveau partenaire</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations du partenaire</CardTitle>
            <CardDescription>Créez un nouveau partenaire pour votre site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">URL du logo</Label>
              <Input id="logo" name="logo" value={formData.logo} onChange={handleChange} required />
              <p className="text-xs text-muted-foreground">Entrez l'URL complète de l'image du logo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleChange} />
              <p className="text-xs text-muted-foreground">
                Entrez l'URL complète du site web (ex: https://example.com)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input id="order" name="order" type="number" value={formData.order} onChange={handleNumberChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">Partenaire actif</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/partners")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer le partenaire"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

