import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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

