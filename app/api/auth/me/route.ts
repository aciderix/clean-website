import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    console.log("API Me: Vérification de l'authentification");
    
    // Logs des cookies pour débogage
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    console.log("API Me: Cookies disponibles:", allCookies.map(c => c.name));
    
    const tokenCookie = cookieStore.get("token");
    console.log("API Me: Cookie token présent:", !!tokenCookie);
    
    const user = getAuthUser()
    console.log("API Me: Utilisateur authentifié:", !!user);

    if (!user) {
      console.log("API Me: Non authentifié");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    console.log("API Me: Authentification réussie pour:", user.username);
    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

