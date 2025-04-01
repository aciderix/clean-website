"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

export default function NewSectionPage() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    subtitle: "",
    content: "",
    order: 0,
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la création de la section")
      }

      toast({
        title: "Succès",
        description: "Section créée avec succès",
      })

      router.push("/admin/sections")
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
      <h1 className="text-3xl font-bold">Nouvelle section</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations de la section</CardTitle>
            <CardDescription>Créez une nouvelle section pour votre site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom (identifiant)</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                <p className="text-xs text-muted-foreground">
                  Identifiant unique pour cette section (ex: about, mission)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="order">Ordre d'affichage</Label>
                <Input id="order" name="order" type="number" value={formData.order} onChange={handleNumberChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">Section active</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/sections")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la section"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

