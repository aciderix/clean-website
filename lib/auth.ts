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
    return jwt.verify(token, JWT_SECRET!)
  } catch (error) {
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

