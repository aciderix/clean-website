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

export default function NewEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
    link: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de la création de l'événement")
      }

      toast({
        title: "Succès",
        description: "Événement créé avec succès",
      })

      router.push("/admin/events")
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
      <h1 className="text-3xl font-bold">Nouvel événement</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations de l'événement</CardTitle>
            <CardDescription>Créez un nouvel événement pour votre site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image (optionnel)</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Lien externe (optionnel)</Label>
              <Input id="link" name="link" value={formData.link} onChange={handleChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isActive">Événement actif</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer l'événement"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

