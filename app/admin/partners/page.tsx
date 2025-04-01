"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Partner {
  _id: string
  name: string
  logo: string
  website: string
  order: number
  isActive: boolean
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/partners")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des partenaires")
      }

      const data = await response.json()
      setPartners(data)
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) {
      return
    }

    try {
      const response = await fetch(`/api/partners/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du partenaire")
      }

      toast({
        title: "Succès",
        description: "Partenaire supprimé avec succès",
      })

      fetchPartners()
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
        <h1 className="text-3xl font-bold">Gestion des partenaires</h1>
        <Link href="/admin/partners/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau partenaire
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partenaires</CardTitle>
          <CardDescription>Gérez les partenaires qui apparaissent sur le site.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun partenaire trouvé. Créez votre premier partenaire !
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Site web</TableHead>
                  <TableHead>Ordre</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner._id}>
                    <TableCell>
                      <div className="relative h-10 w-10">
                        <Image
                          src={partner.logo || "/placeholder.svg?height=40&width=40"}
                          alt={partner.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      {partner.website && (
                        <Link
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          {partner.website.replace(/^https?:\/\//, "").split("/")[0]}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{partner.order}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          partner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {partner.isActive ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/partners/${partner._id}/edit`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(partner._id)}>
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

