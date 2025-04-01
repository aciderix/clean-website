import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable")
}

export function generateToken(user: any) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET!,
    { expiresIn: "1d" },
  )
}

export function verifyToken(token: string) {
  try {
    console.log("Auth: Vérification du token avec JWT_SECRET:", process.env.JWT_SECRET ? `défini (${process.env.JWT_SECRET.substring(0, 5)}...)` : "non défini");
    console.log("Auth: Token à vérifier (début):", token.substring(0, 15) + "...");
    // @ts-ignore - Pour debugging
    const decoded = jwt.verify(token, JWT_SECRET!);
    console.log("Auth: Token décodé avec succès:", !!decoded);
    return decoded;
  } catch (error: any) {
    console.error("Auth: Erreur lors de la vérification du token:", error.message);
    return null
  }
}

export function getAuthUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  return decoded
}

export function requireAuth() {
  const user = getAuthUser()

  if (!user) {
    redirect("/admin/login")
  }

  return user
}

export function requireAdmin() {
  const user = requireAuth()

  if (user.role !== "admin") {
    redirect("/admin/unauthorized")
  }

  return user
}

