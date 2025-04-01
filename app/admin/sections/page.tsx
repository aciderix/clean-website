"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Section {
  _id: string
  name: string
  title: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/sections")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des sections")
      }

      const data = await response.json()
      setSections(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) {
      return
    }

    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la section")
      }

      toast({
        title: "Succès",
        description: "Section supprimée avec succès",
      })

      fetchSections()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des sections</h1>
        <Link href="/admin/sections/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle section
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sections du site</CardTitle>
          <CardDescription>Gérez les différentes sections qui apparaissent sur le site.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune section trouvée. Créez votre première section !
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Ordre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section._id}>
                    <TableCell className="font-medium">{section.name}</TableCell>
                    <TableCell>{section.title}</TableCell>
                    <TableCell>{section.order}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          section.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {section.isActive ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/sections/${section._id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/sections/${section._id}/edit`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(section._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

