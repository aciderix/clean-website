import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"
import jwt from "jsonwebtoken"

export function middleware(request: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET
  console.log("Middleware: JWT_SECRET défini:", !!JWT_SECRET, JWT_SECRET ? `(${JWT_SECRET.substring(0, 5)}...)` : "");
  
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
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    
    console.log("Middleware: Vérification du token pour", request.nextUrl.pathname);
    console.log("Middleware: Cookie token présent:", !!token, token ? `(début: ${token.substring(0, 15)}...)` : "");
    console.log("Middleware: Header token présent:", !!tokenFromHeader);

    // Vérification manuelle du token (debug)
    if (token && JWT_SECRET) {
      try {
        // Utiliser directement jwt.verify pour déboguer
        const manualCheck = jwt.verify(token, JWT_SECRET);
        console.log("Middleware: Vérification manuelle du token:", !!manualCheck);
      } catch (error: any) {
        console.error("Middleware: Erreur vérification manuelle:", error.message);
      }
    }

    // Vérifier le token depuis le cookie
    if (token) {
      try {
        const decoded = verifyToken(token)
        console.log("Middleware: Token du cookie décodé:", !!decoded);

        if (decoded) {
          console.log("Middleware: Authentification réussie pour", request.nextUrl.pathname);
          return NextResponse.next()
        }
        
        console.log("Middleware: Token du cookie invalide");
      } catch (err) {
        console.error("Middleware: Erreur lors du décodage du token:", err);
      }
    }
    
    // Vérifier le token depuis l'en-tête si pas de cookie valide
    if (tokenFromHeader) {
      try {
        const decoded = verifyToken(tokenFromHeader)
        console.log("Middleware: Token de l'en-tête décodé:", !!decoded);

        if (decoded) {
          console.log("Middleware: Authentification par en-tête réussie pour", request.nextUrl.pathname);
          const response = NextResponse.next();
          response.cookies.set({
            name: "token",
            value: tokenFromHeader,
            httpOnly: false,
            secure: false,
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
          });
          return response;
        }
        
        console.log("Middleware: Token de l'en-tête invalide");
      } catch (err) {
        console.error("Middleware: Erreur lors du décodage du token de l'en-tête:", err);
      }
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

