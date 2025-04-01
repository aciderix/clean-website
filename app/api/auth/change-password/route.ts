import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Please provide current and new password" }, { status: 400 })
    }

    const userDoc = await User.findById(user.id)

    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await userDoc.comparePassword(currentPassword)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    userDoc.password = newPassword
    await userDoc.save()

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

