import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-red-600">Accès non autorisé</CardTitle>
          <CardDescription>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="mb-6 text-center">
            Veuillez contacter l'administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
          <Link href="/admin/login">
            <Button>Retour à la page de connexion</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

