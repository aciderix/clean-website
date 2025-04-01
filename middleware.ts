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

    // Check for auth token
    const token = request.cookies.get("token")?.value
    
    console.log("Middleware: Vérification du token pour", request.nextUrl.pathname);
    console.log("Middleware: Cookie token présent:", !!token);

    if (!token) {
      console.log("Middleware: Pas de token, redirection vers login");
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Verify token
    const decoded = verifyToken(token)
    console.log("Middleware: Token décodé:", !!decoded);

    if (!decoded) {
      console.log("Middleware: Token invalide, redirection vers login");
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    
    console.log("Middleware: Authentification réussie pour", request.nextUrl.pathname);
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

