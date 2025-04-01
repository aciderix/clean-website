import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  return response
}

