import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Please provide username and password" }, { status: 400 })
    }

    const user = await User.findOne({ username })

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user)

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 },
    )

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

