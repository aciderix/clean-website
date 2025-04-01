import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Section from "@/lib/models/section"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const sections = await Section.find({}).sort({ order: 1 })

    return NextResponse.json(sections, { status: 200 })
  } catch (error) {
    console.error("Get sections error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser()

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await req.json()

    const section = await Section.create(data)

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error("Create section error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

