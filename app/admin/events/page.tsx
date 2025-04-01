"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Event {
  _id: string
  title: string
  date: string
  location: string
  isActive: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/events")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des événements")
      }

      const data = await response.json()
      setEvents(data)
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      return
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'événement")
      }

      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      })

      fetchEvents()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des événements</h1>
        <Link href="/admin/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Événements</CardTitle>
          <CardDescription>Gérez les événements qui apparaissent sur le site.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun événement trouvé. Créez votre premier événement !
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          event.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.isActive ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/events/${event._id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/events/${event._id}/edit`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(event._id)}>
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

