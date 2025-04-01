import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    console.log("API Login: Traitement de la demande de connexion");
    await connectDB()

    const { username, password } = await req.json()
    console.log("API Login: Tentative de connexion pour l'utilisateur:", username);

    if (!username || !password) {
      console.log("API Login: Données manquantes");
      return NextResponse.json({ message: "Please provide username and password" }, { status: 400 })
    }

    const user = await User.findOne({ username })

    if (!user) {
      console.log("API Login: Utilisateur non trouvé");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      console.log("API Login: Mot de passe invalide");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("API Login: Authentification réussie pour:", username);
    const token = generateToken(user)
    console.log("API Login: Token généré:", token.substring(0, 15) + "...");

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        token: token,
      },
      { status: 200 },
    )

    console.log("API Login: Définition du cookie token");
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    console.log("API Login: Cookies définis dans la réponse");
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

