import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for auth token
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

