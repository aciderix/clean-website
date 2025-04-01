"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Users, Activity } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    sections: 0,
    events: 0,
    partners: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sectionsRes, eventsRes, partnersRes] = await Promise.all([
          fetch("/api/sections"),
          fetch("/api/events"),
          fetch("/api/partners"),
        ])

        const sections = await sectionsRes.json()
        const events = await eventsRes.json()
        const partners = await partnersRes.json()

        setStats({
          sections: sections.length,
          events: events.length,
          partners: partners.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.sections}</div>
            <p className="text-xs text-muted-foreground">Sections du site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.events}</div>
            <p className="text-xs text-muted-foreground">Événements à venir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partenaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.partners}</div>
            <p className="text-xs text-muted-foreground">Partenaires actifs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <Activity className="h-8 w-8 mr-2" />
            <span>Aucune activité récente</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

