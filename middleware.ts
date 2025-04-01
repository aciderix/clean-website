import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for login page and setup page
    if (
      request.nextUrl.pathname === "/admin/login" || 
      request.nextUrl.pathname === "/admin/setup"
    ) {
      console.log("Middleware: Page publique, accès autorisé");
      return NextResponse.next()
    }

    // Check for auth token dans cookie
    const token = request.cookies.get("token")?.value
    
    console.log("Middleware: Vérification du token pour", request.nextUrl.pathname);
    console.log("Middleware: Cookie token présent:", !!token);

    // Si token présent, on vérifie sa validité
    if (token) {
      const decoded = verifyToken(token)
      console.log("Middleware: Token décodé:", !!decoded);

      if (decoded) {
        console.log("Middleware: Authentification réussie pour", request.nextUrl.pathname);
        return NextResponse.next()
      }
      
      console.log("Middleware: Token invalide");
    }
    
    // Si aucun token valide trouvé, redirection vers login
    console.log("Middleware: Redirection vers login");
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

